'use client';

import { ReactNode } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { SupabaseProvider } from '@/supabase/provider';
import { LanguageProvider } from '@/context/LanguageContext';
import { SiteSettingsProvider } from '@/context/SiteSettingsContext';
import { LazyMotion, domAnimation } from 'framer-motion';

/**
 * Componente que envuelve la aplicación con todos los proveedores necesarios
 * en el lado del cliente.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <SupabaseProvider>
      <LanguageProvider>
        <SiteSettingsProvider>
          <LazyMotion features={domAnimation} strict>
            {children}
            <Toaster />
          </LazyMotion>
        </SiteSettingsProvider>
      </LanguageProvider>
    </SupabaseProvider>
  );
}
