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
export function Providers({ 
  children, 
  initialImages, 
  initialPrices 
}: { 
  children: ReactNode;
  initialImages?: Record<string, string>;
  initialPrices?: Record<string, number>;
}) {
  return (
    <SupabaseProvider>
      <LanguageProvider>
        <SiteSettingsProvider initialImages={initialImages} initialPrices={initialPrices}>
          <LazyMotion features={domAnimation} strict>
            {children}
            <Toaster />
          </LazyMotion>
        </SiteSettingsProvider>
      </LanguageProvider>
    </SupabaseProvider>
  );
}
