
import type { Metadata } from 'next';
import { Montserrat, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Script from 'next/script';

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
    default: 'Bonanza | Bienestar y Spa en Playa del Carmen',
    template: '%s | Bonanza'
  },
  description: 'Descubre Bonanza, tu santuario de bienestar holístico en Playa del Carmen. Especialistas en masajes personalizados, terapias de Sound Healing y rituales de relajación profunda para recuperar tu equilibrio interior.',
  keywords: ['Masajes Playa del Carmen', 'Bienestar Playa del Carmen', 'Sound Healing Playa del Carmen', 'Bonanza Playa del Carmen', 'Bonanza Spa', 'Bonanza Masajes', 'Meditacion Playa del Carmen', 'Relajación en Playa del Carmen', 'Masajes', 'Sound Healing', 'spa playa del carmen', 'terapias relajantes'],
  authors: [{ name: 'Bonanza | Bienestar' }],
  metadataBase: new URL('https://www.bonanzabienestar.com'),
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/logo-bonanza.png', type: 'image/png' },
      // Añadimos explícitamente tamaños recomendados por Google
      { url: '/logo-bonanza.png', type: 'image/png', sizes: '48x48' },
      { url: '/logo-bonanza.png', type: 'image/png', sizes: '96x96' },
      { url: '/logo-bonanza.png', type: 'image/png', sizes: '144x144' },
      { url: '/logo-bonanza.png', type: 'image/png', sizes: '192x192' }
    ],
    apple: [
      { url: '/logo-bonanza.png', type: 'image/png' }
    ]
  },
  openGraph: {
    title: 'Bonanza | Bienestar y Spa en Playa del Carmen',
    description: 'Santuario de bienestar holístico en Playa del Carmen: masajes, rituales y Sound Healing.',
    url: 'https://www.bonanzabienestar.com',
    siteName: 'Bonanza Bienestar',
    images: [
      {
        url: '/logo-bonanza.png',
        width: 800,
        height: 600,
        alt: 'Bonanza Bienestar Logo',
      }
    ],
    locale: 'es_MX',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bonanza | Bienestar',
    description: 'Santuario de bienestar holístico en Playa del Carmen.',
    images: ['/logo-bonanza.png'],
  }
};

// Datos Estructurados (Schema.org) para ayudar a Google a entender qué es el negocio
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HealthAndBeautyBusiness",
  "name": "Bonanza Bienestar",
  "image": "https://www.bonanzabienestar.com/logo-bonanza.png",
  "@id": "https://www.bonanzabienestar.com",
  "url": "https://www.bonanzabienestar.com",
  "telephone": "",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Playa del Carmen",
    "addressRegion": "Q.R.",
    "addressCountry": "MX"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 20.6295586,
    "longitude": -87.0738851
  },
  "description": "Santuario de bienestar holístico en Playa del Carmen. Especialistas en masajes y sound healing."
};

import { supabase } from '@/supabase/client';
import { placeholderImages } from '@/lib/images';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch site settings on the server to avoid hydration mismatch
  let initialImages: Record<string, string> = {};
  let initialPrices: Record<string, number> = {};

  try {
    const { data: imgData } = await supabase.from('site_images').select('id, url');
    const { data: priceData } = await supabase.from('site_prices').select('id, price');

    if (imgData) {
      initialImages = Object.fromEntries(imgData.map(img => [img.id, img.url]));
    }
    if (priceData) {
      initialPrices = Object.fromEntries(priceData.map(p => [p.id, Number(p.price)]));
    }
  } catch (e) {
    console.error('[RootLayout] Error fetching SSR settings:', e);
  }

  return (
    <html lang="es" className={`!scroll-smooth ${montserrat.variable} ${cormorant.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        {/* Google Tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-18077139994"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'AW-18077139994');
          `}
        </Script>
        {/* Preconnect to critical domains */}
        <link rel="preconnect" href="https://pqmlwfeobainscuxtoaa.supabase.co" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://pqmlwfeobainscuxtoaa.supabase.co" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        <Providers initialImages={initialImages} initialPrices={initialPrices}>
          {children}
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
