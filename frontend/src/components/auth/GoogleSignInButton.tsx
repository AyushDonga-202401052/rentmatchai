'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import { useAuth } from '@/src/context/AuthContext';
import type { UserRole } from '@/src/constants/initialData';
import type { AuthSession } from '@/src/services/authService';

type GoogleButtonText = 'signin_with' | 'signup_with' | 'continue_with';

interface GoogleCredentialResponse {
  credential?: string;
}

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (options: {
            client_id: string;
            callback: (response: GoogleCredentialResponse) => void;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              theme: 'outline';
              size: 'large';
              text: GoogleButtonText;
              shape: 'rectangular';
              width: number;
            },
          ) => void;
        };
      };
    };
  }
}

interface GoogleSignInButtonProps {
  preferredRole?: UserRole;
  buttonText: GoogleButtonText;
  disabled?: boolean;
  className?: string;
  onLoadingChange?: (loading: boolean) => void;
  onSuccess: (session: AuthSession) => void;
  onError: (error: Error) => void;
}

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export function GoogleSignInButton({
  preferredRole,
  buttonText,
  disabled = false,
  className,
  onLoadingChange,
  onSuccess,
  onError,
}: GoogleSignInButtonProps) {
  const buttonContainer = useRef<HTMLDivElement>(null);
  const { loginWithGoogle } = useAuth();
  const [scriptReady, setScriptReady] = useState(false);
  const [scriptFailed, setScriptFailed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleCredential = useCallback(async (response: GoogleCredentialResponse) => {
    if (!response.credential) {
      onError(new Error('Google did not return an ID token. Please try again.'));
      return;
    }

    setSubmitting(true);
    onLoadingChange?.(true);
    let session: AuthSession;
    try {
      session = await loginWithGoogle(response.credential, preferredRole);
    } catch (error: unknown) {
      setSubmitting(false);
      onLoadingChange?.(false);
      onError(error instanceof Error ? error : new Error('Google sign-in failed.'));
      return;
    }
    setSubmitting(false);
    onLoadingChange?.(false);
    onSuccess(session);
  }, [loginWithGoogle, onError, onLoadingChange, onSuccess, preferredRole]);
  const credentialHandler = useRef(handleCredential);

  useEffect(() => {
    credentialHandler.current = handleCredential;
  }, [handleCredential]);

  useEffect(() => {
    const googleId = window.google?.accounts?.id;
    const container = buttonContainer.current;
    if (!scriptReady || !GOOGLE_CLIENT_ID || !googleId || !container) return;

    container.replaceChildren();
    googleId.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: (response) => {
        void credentialHandler.current(response);
      },
    });
    googleId.renderButton(container, {
      theme: 'outline',
      size: 'large',
      text: buttonText,
      shape: 'rectangular',
      width: Math.min(container.clientWidth, 400),
    });
  }, [buttonText, scriptReady]);

  if (!GOOGLE_CLIENT_ID) {
    return (
      <p className={className} role="status">
        Google sign-in is unavailable. Configure NEXT_PUBLIC_GOOGLE_CLIENT_ID and restart the frontend.
      </p>
    );
  }

  if (scriptFailed) {
    return <p className={className} role="alert">Google sign-in could not load. Please refresh and try again.</p>;
  }

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onReady={() => setScriptReady(true)}
        onError={() => setScriptFailed(true)}
      />
      <div
        ref={buttonContainer}
        className={`${className ?? ''} ${disabled || submitting ? 'pointer-events-none opacity-60' : ''}`}
        aria-disabled={disabled || submitting}
      />
    </>
  );
}
