'use client';

import React, { useMemo, useEffect, type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase, initializeGuardedAppCheck } from '@/firebase';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const firebaseServices = useMemo(() => {
    // Initialize Firebase on the client side, once per component mount.
    return initializeFirebase();
  }, []); // Empty dependency array ensures this runs only once on mount

  useEffect(() => {
    // PROTECCIÓN ANTI-HACKEOS: Activación de Firebase App Check (reCAPTCHA Enterprise)
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production' && firebaseServices.firebaseApp?.options?.apiKey) {
      try {
        const { ReCaptchaEnterpriseProvider: ReCapClass } = require('firebase/app-check');
        initializeGuardedAppCheck(firebaseServices.firebaseApp, new ReCapClass('6LdWp9cqAAAAAEV-X0-pG_p9cqAAAAAEV-X0-pG'));
        console.log("🛡️ Sistema de Seguridad Antihackeos (App Check) activado con éxito.");
      } catch (error) {
        console.warn("⚠️ App Check no se pudo inicializar.", error);
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
