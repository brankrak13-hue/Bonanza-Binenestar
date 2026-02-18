'use client';

import React, { useMemo, useEffect, type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const firebaseServices = useMemo(() => {
    // Initialize Firebase on the client side, once per component mount.
    return initializeFirebase();
  }, []); // Empty dependency array ensures this runs only once on mount

  useEffect(() => {
    // Human Verification & Bot Protection (reCAPTCHA Enterprise)
    // Note: In a real production environment, you would replace 'YOUR_SITE_KEY' 
    // with the real key from your Firebase Console.
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      try {
        initializeAppCheck(firebaseServices.firebaseApp, {
          provider: new ReCaptchaEnterpriseProvider('6LdWp9cqAAAAAEV-X0-pG_p9cqAAAAAEV-X0-pG'),
          isTokenAutoRefreshEnabled: true
        });
        console.log("Sistema de Seguridad Antihackeos (App Check) activado.");
      } catch (error) {
        console.warn("App Check failed to initialize. This is expected in local dev without a site key.", error);
      }
    }
  }, [firebaseServices]);

  return (
    <FirebaseProvider
      firebaseApp={firebaseServices.firebaseApp}
      auth={firebaseServices.auth}
      firestore={firebaseServices.firestore}
    >
      {children}
    </FirebaseProvider>
  );
}
