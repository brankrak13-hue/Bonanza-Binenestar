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
    // PROTECCIÓN ANTI-HACKEOS: Activación de Firebase App Check (reCAPTCHA Enterprise)
    // Este sistema verifica que cada petición provenga de tu aplicación real y no de un bot o atacante.
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      try {
        initializeAppCheck(firebaseServices.firebaseApp, {
          provider: new ReCaptchaEnterpriseProvider('6LdWp9cqAAAAAEV-X0-pG_p9cqAAAAAEV-X0-pG'),
          isTokenAutoRefreshEnabled: true
        });
        console.log("🛡️ Sistema de Seguridad Antihackeos (App Check) activado con éxito.");
      } catch (error) {
        console.warn("⚠️ App Check no se pudo inicializar en desarrollo local sin llave de sitio válida.", error);
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
