
import type { Metadata } from 'next';
import { Montserrat, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

/**
 * Metadata oficial del sitio para SEO y configuración del navegador.
 * Next.js utilizará automáticamente los archivos robots.ts y sitemap.ts creados.
 */
export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

// Final metadata configuration for SEO and Browser
export const metadata: Metadata = {
  title: {
    default: 'Bonanza | Arte & Bienestar',
    template: '%s | Bonanza'
  },
  description: 'Santuario de bienestar holístico en Playa del Carmen. Masajes personalizados, Sound Healing y rituales de relajación profunda para el alma. Recupera tu equilibrio interior con técnicas ancestrales.',
  keywords: ['bienestar', 'masajes', 'sound healing', 'playa del carmen', 'holístico', 'relajación', 'bonanza bienestar', 'terapia de sonido'],
  authors: [{ name: 'Bonanza Arte & Bienestar' }],
  metadataBase: new URL('https://bonanza-bienestar.web.app'),
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Bonanza | Arte & Bienestar',
    description: 'Santuario de bienestar holístico en Playa del Carmen. Masajes personalizados y Sound Healing.',
    url: 'https://bonanza-bienestar.web.app',
    siteName: 'Bonanza',
    locale: 'es_MX',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`!scroll-smooth ${montserrat.variable} ${cormorant.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        {/* Preconnect to critical domains to improve LCP and connection times */}
        <link rel="preconnect" href="https://firestore.googleapis.com" />
        <link rel="preconnect" href="https://apis.google.com" />
        <link rel="preconnect" href="https://studio-9297324962-e23f7.firebaseapp.com" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://firestore.googleapis.com" />
        <link rel="dns-prefetch" href="https://apis.google.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
