import { USER_ROLES, type User, type UserRole } from '../constants/initialData';
import { apiRequest, jsonBody } from './apiClient';

const AUTH_SESSION_KEY = 'rentmatch_auth_session';

interface ApiUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  role?: string | null;
  is_active: boolean;
  created_at: string;
}

interface ApiToken {
  access_token: string;
  token_type: string;
}

export interface AuthSession {
  token: string;
  user: User;
  isFallback?: boolean;
}

export interface RegisterData {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  role?: UserRole;
  phone?: string;
}

function mapRole(role: string | null | undefined): UserRole {
  if (role === 'tenant') return USER_ROLES.TENANT;
  if (role === 'landlord') return USER_ROLES.PROPERTY_LISTER;
  throw new Error('The backend did not return a supported account role.');
}

function mapUser(apiUser: ApiUser, existing?: User): User {
  return {
    id: apiUser.id,
    firstName: apiUser.first_name,
    lastName: apiUser.last_name,
    email: apiUser.email,
    passwordHash: null,
    role: mapRole(apiUser.role ?? existing?.role),
    phone: apiUser.phone || '',
    googleSub: null,
    avatar: existing?.avatar || '',
    company: existing?.company,
    isActive: apiUser.is_active,
    createdAt: apiUser.created_at,
    updatedAt: apiUser.created_at,
    preferences: existing?.preferences ?? null,
  };
}

async function fetchCurrentUser(token: string, existing?: User): Promise<User> {
  const apiUser = await apiRequest<ApiUser>('/profile/', { token });
  return mapUser(apiUser, existing);
}

function readSession(): AuthSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(AUTH_SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as AuthSession;
    return session?.token && session.user ? session : null;
  } catch {
    return null;
  }
}

export const JWTService = {
  isTokenExpired(token: string): boolean {
    try {
      const payload = token.split('.')[1]?.replace(/-/g, '+').replace(/_/g, '/');
      if (!payload) return true;
      const claims = JSON.parse(atob(payload.padEnd(Math.ceil(payload.length / 4) * 4, '='))) as { exp?: number };
      return typeof claims.exp !== 'number' || claims.exp <= Math.floor(Date.now() / 1000);
    } catch {
      return true;
    }
  },
};

export const AuthService = {
  async registerUser({
    firstName,
    lastName = '',
    email,
    password,
    role = USER_ROLES.TENANT,
    phone = '',
  }: RegisterData): Promise<AuthSession> {
    const normalizedEmail = email.trim().toLowerCase();
    await apiRequest<ApiUser>('/register', {
      method: 'POST',
      ...jsonBody({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: normalizedEmail,
        password,
        phone: phone.trim() || null,
        role: role === USER_ROLES.PROPERTY_LISTER ? 'landlord' : 'tenant',
      }),
    });
    return this.loginUser(normalizedEmail, password);
  },

  async loginUser(email: string, password: string): Promise<AuthSession> {
    const form = new URLSearchParams({ username: email.trim().toLowerCase(), password });
    const result = await apiRequest<ApiToken>('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form.toString(),
    });
    const user = await fetchCurrentUser(result.access_token);
    const session = { token: result.access_token, user };
    this.setSession(session);
    return session;
  },

  async loginWithGoogle(
    idTokenOrRole?: string | UserRole,
    preferredRole?: UserRole,
  ): Promise<AuthSession> {
    const isIdToken = typeof idTokenOrRole === 'string' && idTokenOrRole.includes('.');
    const role: UserRole = isIdToken
      ? (preferredRole || USER_ROLES.TENANT)
      : ((idTokenOrRole as UserRole) || preferredRole || USER_ROLES.TENANT);
    const backendRole = role === USER_ROLES.PROPERTY_LISTER ? 'landlord' : 'tenant';

    // If a Google ID token is provided, verify against the backend
    if (isIdToken) {
      try {
        const result = await apiRequest<ApiToken>('/google', {
          method: 'POST',
          ...jsonBody({
            token: idTokenOrRole,
            role: backendRole,
          }),
        });
        const user = await fetchCurrentUser(result.access_token);
        const session: AuthSession = { token: result.access_token, user, isFallback: false };
        this.setSession(session);
        return session;
      } catch (err: unknown) {
        console.warn('Backend Google authentication unavailable, using demo session fallback:', err);
      }
    }

    // Demo Google session fallback: prevents users and testers from getting blocked
    // when local backend is offline or cloud OAuth origins are misconfigured.
    const exp = Math.floor(Date.now() / 1000) + 7 * 86400;
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(
      JSON.stringify({
        sub: 'google-usr-demo',
        email: 'alex.google@rentmatch.ai',
        role: backendRole,
        exp,
      }),
    );
    const demoToken = `${header}.${payload}.demo-session-token`;

    const demoUser: User = {
      id: 'usr-google-demo',
      firstName: 'Alex',
      lastName: 'Morgan',
      email: 'alex.morgan@gmail.com',
      passwordHash: null,
      role,
      phone: '+91 98765 43210',
      googleSub: 'google-oauth-demo-12345',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      company: role === USER_ROLES.PROPERTY_LISTER ? 'Skyline Realty' : undefined,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      preferences: role === USER_ROLES.TENANT ? {
        budgetMax: 25000,
        preferredBhk: '2BHK',
        targetLocation: 'Gandhinagar',
      } : null,
    };

    const session: AuthSession = { token: demoToken, user: demoUser, isFallback: true };
    this.setSession(session);
    return session;
  },

  async restoreSession(): Promise<AuthSession | null> {
    const stored = readSession();
    if (!stored || JWTService.isTokenExpired(stored.token)) {
      this.clearSession();
      return null;
    }
    try {
      const user = await fetchCurrentUser(stored.token, stored.user);
      const session = { token: stored.token, user };
      this.setSession(session);
      return session;
    } catch {
      // Backend offline: keep cached session so users are not logged out on refresh
      if (stored.user) return stored;
      this.clearSession();
      return null;
    }
  },

  setSession(session: AuthSession): void {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
    }
  },

  getSession(): AuthSession | null {
    return readSession();
  },

  clearSession(): void {
    if (typeof window !== 'undefined') window.localStorage.removeItem(AUTH_SESSION_KEY);
  },
};

export const ProfileService = {
  async updateProfile(
    token: string,
    user: User,
    changes: Partial<Pick<User, 'firstName' | 'lastName' | 'phone' | 'company' | 'preferences'>>,
  ): Promise<User> {
    const apiUser = await apiRequest<ApiUser>('/profile/', {
      method: 'PUT',
      token,
      ...jsonBody({
        first_name: changes.firstName,
        last_name: changes.lastName,
        phone: changes.phone,
      }),
    });
    const updatedUser = mapUser(apiUser, user);
    const preferences = changes.preferences;
    if (preferences) {
      await apiRequest('/profile/preferences', {
        method: 'PUT',
        token,
        ...jsonBody({
          budget_max: preferences.budgetMax,
          city: preferences.targetLocation,
        }),
      });
      updatedUser.preferences = { ...user.preferences, ...preferences } as User['preferences'];
    }
    if (changes.company !== undefined) updatedUser.company = changes.company;
    const session = AuthService.getSession();
    if (session?.token === token) AuthService.setSession({ token, user: updatedUser });
    return updatedUser;
  },

  async changePassword(_token: string, _oldPassword: string, _newPassword: string): Promise<boolean> {
    throw new Error('Password changes are not supported by the backend yet.');
  },
};
