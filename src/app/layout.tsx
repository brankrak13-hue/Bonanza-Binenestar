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
 * Nota: Next.js detectará automáticamente un archivo favicon.ico en /app o /public.
 */
export const metadata: Metadata = {
  title: {
    default: 'Bonanza | Arte & Bienestar',
    template: '%s | Bonanza'
  },
  description: 'Santuario de bienestar holístico en Playa del Carmen. Masajes personalizados, Sound Healing y rituales de relajación profunda para el alma.',
  keywords: ['bienestar', 'masajes', 'sound healing', 'playa del carmen', 'holístico', 'relajación'],
  authors: [{ name: 'Bonanza' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`!scroll-smooth ${montserrat.variable} ${cormorant.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="font-body antialiased" suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
