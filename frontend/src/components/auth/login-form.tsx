'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/src/components/ui/card';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/src/components/ui/field';
import { Input } from '@/src/components/ui/input-native';
import { useAuth } from '@/src/context/AuthContext';
import { USER_ROLES } from '@/src/constants/initialData';
import { usePageCurtains } from '@/src/components/ui/page-curtains';
import { useToast } from '@/src/components/ui/notifications';
import { InteractiveHoverButton } from '@/src/components/ui/interactive-hover-button';
import { BorderBeam } from '@/src/components/ui/border-beam';
import { GoogleAuthButton } from './GoogleAuthButton';

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get('redirect');
  const { login } = useAuth();
  const { notify } = useToast();
  const { navigateWithCurtains } = usePageCurtains();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);

  // Validate redirect parameter to ensure safe relative internal path
  const getSafeDestination = (userRole?: string) => {
    if (
      redirectParam &&
      redirectParam.startsWith('/') &&
      !redirectParam.startsWith('//') &&
      !redirectParam.includes('\\')
    ) {
      if (
        redirectParam === '/dashboard/tenant' ||
        redirectParam === '/dashboard/landlord' ||
        redirectParam === '/dashboard/renter' ||
        redirectParam === '/dashboard/Renter'
      ) {
        return '/dashboard';
      }
      return redirectParam;
    }
    return '/dashboard';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsInvalid(false);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      notify.error('Please enter your email address.', 'Missing Email');
      setIsInvalid(true);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      notify.error('Please enter a valid email address (e.g. name@domain.com).', 'Invalid Email');
      setIsInvalid(true);
      return;
    }

    if (!password) {
      notify.error('Please enter your password.', 'Missing Password');
      setIsInvalid(true);
      return;
    }

    setLoading(true);
    try {
      const res = await login(trimmedEmail, password);
      notify.success(`Welcome back, ${res.user.firstName}!`, 'Signed In');
      const target = getSafeDestination(res.user.role);
      navigateWithCurtains(target, 'Dashboard');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid credentials. Please check your email and password.';
      setIsInvalid(true);
      notify.error(msg, 'Sign-In Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn('flex flex-col gap-5', className)} {...props}>
      <Card className="relative overflow-hidden border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xl shadow-zinc-900/5 dark:shadow-black/50 rounded-3xl p-7 sm:p-9">
        <BorderBeam
          size={70}
          duration={8}
          colorFrom="#ffffff"
          colorTo="#71717a"
          borderWidth={1.5}
        />
        <CardContent className="p-0">

          <div className="mb-6">
            <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              Welcome back
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Sign in to manage your saved properties, chats, and tenancy inquiries
            </p>
          </div>

          {/* Social Google Login Button */}
          <GoogleAuthButton
            mode="signin"
            disabled={loading}
            className="mb-5"
            onLoadingChange={setLoading}
            onSuccess={(session) => {
              notify.success(`Welcome back, ${session.user.firstName}!`, 'Signed In');
              const target = getSafeDestination(session.user.role);
              navigateWithCurtains(target, 'Dashboard');
              setTimeout(() => {
                router.push(target);
              }, 450);
            }}
            onError={(err) => {
              setIsInvalid(true);
              notify.error(err.message, 'Google Sign-In Error');
            }}
          />

          {/* Centered Horizontal Separator */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-zinc-200 dark:border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-[11px] uppercase tracking-wider font-semibold">
              <span className="bg-white dark:bg-zinc-950 px-3 text-zinc-400">
                or email
              </span>
            </div>
          </div>

          <form noValidate onSubmit={handleSubmit} className="space-y-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email" className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                  Email Address
                </FieldLabel>
                <div className="relative mt-1">
                  <Mail className="h-4 w-4 text-zinc-400 absolute left-3 top-3 pointer-events-none" />
                  <Input
                    id="email"
                    type="text"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (isInvalid) setIsInvalid(false);
                    }}
                    placeholder="you@domain.com"
                    className="rounded-xl border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 text-xs sm:text-sm h-10 pl-9.5 focus:border-[#E8510E] focus:ring-[#E8510E]/20 dark:focus:border-[#F06A32] dark:focus:ring-[#F06A32]/20"
                  />
                </div>
              </Field>

              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="password" className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                    Password
                  </FieldLabel>
                  <button
                    type="button"
                    onClick={() => notify.info('Password reset is not available yet.', 'Password Reset')}
                    className="text-xs text-violet-600 hover:text-violet-700 dark:text-violet-400 font-semibold cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative mt-1">
                  <Lock className="h-4 w-4 text-zinc-400 absolute left-3 top-3 pointer-events-none" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (isInvalid) setIsInvalid(false);
                    }}
                    placeholder="••••••••"
                    className="rounded-xl border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 text-xs sm:text-sm h-10 pl-9.5 pr-10 focus:border-[#E8510E] focus:ring-[#E8510E]/20 dark:focus:border-[#F06A32] dark:focus:ring-[#F06A32]/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors cursor-pointer p-0.5"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </Field>

              <InteractiveHoverButton
                type="submit"
                disabled={loading}
                isInvalid={isInvalid}
                className="mt-3"
              >
                {loading ? 'Signing in...' : 'Sign In to Account'}
              </InteractiveHoverButton>
            </FieldGroup>
          </form>

          {/* Footer switcher */}
          <div className="pt-5 mt-5 border-t border-zinc-100 dark:border-zinc-800 text-center text-xs text-zinc-500 dark:text-zinc-400">
            Don&apos;t have an account?{' '}
            <button
              type="button"
              onClick={() => navigateWithCurtains('/signup', 'Create Account')}
              className="font-bold text-[#E8510E] dark:text-[#F06A32] hover:underline cursor-pointer"
            >
              Create Account
            </button>
          </div>
        </CardContent>
      </Card>

      <FieldDescription className="text-center text-[11px] text-zinc-500 dark:text-zinc-400">
        By continuing, you agree to RentMatch AI&apos;s Terms of Service and Privacy Policy.
      </FieldDescription>
    </div>
  );
}
