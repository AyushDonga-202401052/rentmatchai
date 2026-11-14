'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Mail, User, Phone, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/src/components/ui/card';
import { FieldDescription, FieldLabel } from '@/src/components/ui/field';
import { Input } from '@/src/components/ui/input-native';
import { useAuth } from '@/src/context/AuthContext';
import { USER_ROLES, type UserRole } from '@/src/constants/initialData';
import { usePageCurtains } from '@/src/components/ui/page-curtains';
import { useToast } from '@/src/components/ui/notifications';
import { InteractiveHoverButton } from '@/src/components/ui/interactive-hover-button';
import { BorderBeam } from '@/src/components/ui/border-beam';
import { GoogleAuthButton } from './GoogleAuthButton';

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get('redirect');
  const { register } = useAuth();
  const { notify } = useToast();
  const { navigateWithCurtains } = usePageCurtains();

  const [role, setRole] = useState<UserRole>(USER_ROLES.TENANT);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
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
      return redirectParam;
    }
    return userRole === USER_ROLES.PROPERTY_LISTER ? '/dashboard/landlord' : '/dashboard/tenant';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsInvalid(false);

    const trimmedFirst = firstName.trim();
    const trimmedLast = lastName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedFirst) {
      notify.error('Please enter your first name.', 'Missing First Name');
      setIsInvalid(true);
      return;
    }

    if (!trimmedLast) {
      notify.error('Please enter your last name.', 'Missing Last Name');
      setIsInvalid(true);
      return;
    }

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
      notify.error('Please choose a password.', 'Missing Password');
      setIsInvalid(true);
      return;
    }

    if (password.length < 8) {
      notify.error('Password must be at least 8 characters.', 'Password Too Short');
      setIsInvalid(true);
      return;
    }

    setLoading(true);
    try {
      const res = await register({
        role,
        firstName: trimmedFirst,
        lastName: trimmedLast,
        email: trimmedEmail,
        password,
        phone: phone.trim() || undefined,
      });
      notify.success(`Welcome to RentMatch AI, ${res.user.firstName}!`, 'Account Created');
      const target = getSafeDestination(res.user.role);
      navigateWithCurtains(target, 'Dashboard');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      setIsInvalid(true);
      notify.error(msg, 'Registration Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn('flex flex-col gap-5', className)} {...props}>
      <Card className="relative overflow-hidden border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xl shadow-zinc-900/5 dark:shadow-black/50 rounded-3xl p-7 sm:p-9">
        <BorderBeam
          size={80}
          duration={8}
          colorFrom="#ffffff"
          colorTo="#71717a"
          borderWidth={1.5}
        />
        <CardContent className="p-0">

          <div className="mb-6">
            <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              Create Account
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Zero brokerage rental platform for Gandhinagar &amp; Ahmedabad
            </p>
          </div>

          {/* Role Selection Tabs */}
          <div className="relative grid grid-cols-2 gap-2 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-2xl mb-5">
            <button
              type="button"
              onClick={() => setRole(USER_ROLES.TENANT)}
              className={`relative z-10 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-colors cursor-pointer ${role === USER_ROLES.TENANT
                  ? 'text-zinc-950 dark:text-white'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
            >
              {role === USER_ROLES.TENANT && (
                <motion.div
                  layoutId="activeRoleTabSignup"
                  className="absolute inset-0 bg-white dark:bg-[#211E1B] rounded-xl shadow-xs -z-10"
                  transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                />
              )}
              <AnimatePresence>
                {role === USER_ROLES.TENANT && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="inline-flex"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#E8510E] dark:text-[#F06A32]" />
                  </motion.span>
                )}
              </AnimatePresence>
              <span>I Want to Rent</span>
            </button>
            <button
              type="button"
              onClick={() => setRole(USER_ROLES.PROPERTY_LISTER)}
              className={`relative z-10 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-colors cursor-pointer ${role === USER_ROLES.PROPERTY_LISTER
                  ? 'text-zinc-950 dark:text-white'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
            >
              {role === USER_ROLES.PROPERTY_LISTER && (
                <motion.div
                  layoutId="activeRoleTabSignup"
                  className="absolute inset-0 bg-white dark:bg-[#211E1B] rounded-xl shadow-xs -z-10"
                  transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                />
              )}
              <AnimatePresence>
                {role === USER_ROLES.PROPERTY_LISTER && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="inline-flex"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#E8510E] dark:text-[#F06A32]" />
                  </motion.span>
                )}
              </AnimatePresence>
              <span>I Own Property</span>
            </button>
          </div>

          {/* Social Google Signup Button */}
          <GoogleAuthButton
            mode="signup"
            preferredRole={role}
            disabled={loading}
            className="mb-4"
            onLoadingChange={setLoading}
            onSuccess={(session) => {
              notify.success(`Welcome to RentMatch AI, ${session.user.firstName}!`, 'Account Created');
              navigateWithCurtains(getSafeDestination(session.user.role), 'Dashboard');
            }}
            onError={(err) => {
              setIsInvalid(true);
              notify.error(err.message, 'Google Sign-Up Error');
            }}
          />

          {/* Centered Horizontal Separator */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-zinc-200 dark:border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-[11px] uppercase tracking-wider font-semibold">
              <span className="bg-white dark:bg-zinc-950 px-3 text-zinc-400">
                or enter details
              </span>
            </div>
          </div>

          <form noValidate onSubmit={handleSubmit} className="space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <FieldLabel htmlFor="firstName" className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
                  First Name *
                </FieldLabel>
                <div className="relative">
                  <User className="h-4 w-4 text-zinc-400 absolute left-3 top-3 pointer-events-none" />
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      if (isInvalid) setIsInvalid(false);
                    }}
                    placeholder="Rohan"
                    className="rounded-xl border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 text-xs sm:text-sm h-10 pl-9.5"
                  />
                </div>
              </div>
              <div>
                <FieldLabel htmlFor="lastName" className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
                  Last Name *
                </FieldLabel>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    if (isInvalid) setIsInvalid(false);
                  }}
                  placeholder="Shah"
                  className="rounded-xl border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 text-xs sm:text-sm h-10"
                />
              </div>
            </div>

            <div>
              <FieldLabel htmlFor="signup-email" className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
                Email Address *
              </FieldLabel>
              <div className="relative">
                <Mail className="h-4 w-4 text-zinc-400 absolute left-3 top-3 pointer-events-none" />
                <Input
                  id="signup-email"
                  type="text"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (isInvalid) setIsInvalid(false);
                  }}
                  placeholder="you@domain.com"
                  className="rounded-xl border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 text-xs sm:text-sm h-10 pl-9.5"
                />
              </div>
            </div>

            <div>
              <FieldLabel htmlFor="signup-phone" className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
                Phone Number (WhatsApp)
              </FieldLabel>
              <div className="relative">
                <Phone className="h-4 w-4 text-zinc-400 absolute left-3 top-3 pointer-events-none" />
                <Input
                  id="signup-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (isInvalid) setIsInvalid(false);
                  }}
                  placeholder="+91 98765 43210"
                  className="rounded-xl border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 text-xs sm:text-sm h-10 pl-9.5"
                />
              </div>
            </div>

            <div>
              <FieldLabel htmlFor="signup-password" className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
                Password *
              </FieldLabel>
              <div className="relative">
                <Lock className="h-4 w-4 text-zinc-400 absolute left-3 top-3 pointer-events-none" />
                <Input
                  id="signup-password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (isInvalid) setIsInvalid(false);
                  }}
                  placeholder="At least 8 characters"
                  className="rounded-xl border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 text-xs sm:text-sm h-10 pl-9.5"
                />
              </div>
            </div>

            <InteractiveHoverButton
              type="submit"
              disabled={loading}
              isInvalid={isInvalid}
              className="mt-3"
            >
              {loading ? 'Creating account...' : 'Create Free Account'}
            </InteractiveHoverButton>
          </form>

          {/* Footer switcher */}
          <div className="pt-4 mt-4 border-t border-zinc-100 dark:border-zinc-800 text-center text-xs text-zinc-500 dark:text-zinc-400">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => navigateWithCurtains('/login', 'Login')}
              className="font-bold text-[#E8510E] dark:text-[#F06A32] hover:underline cursor-pointer"
            >
              Login
            </button>
          </div>
        </CardContent>
      </Card>

      <FieldDescription className="text-center text-[11px] text-zinc-500 dark:text-zinc-400">
        By signing up, you agree to RentMatch AI&apos;s Terms of Service and Privacy Policy.
      </FieldDescription>
    </div>
  );
}
