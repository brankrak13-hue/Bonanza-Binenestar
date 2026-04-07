
'use client';

import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import Footer from '@/components/Footer';
import ProductShowcase from '@/components/ProductShowcase';
import { getPlaceholderImage } from '@/lib/images';
import { useLanguage } from '@/context/LanguageContext';
import { Skeleton } from '@/components/ui/skeleton';
import PromoPopup from '@/components/PromoPopup';

// Carga dinámica de componentes pesados o que están debajo del pliegue
const Benefits = dynamic(() => import('@/components/Benefits'), {
  loading: () => <div className="h-64 flex items-center justify-center"><Skeleton className="h-40 w-full max-w-4xl rounded-3xl" /></div>,
  ssr: true
});

const Contact = dynamic(() => import('@/components/Contact'), {
  loading: () => <div className="h-96 flex items-center justify-center"><Skeleton className="h-80 w-full max-w-2xl rounded-[3rem]" /></div>,
  ssr: false // Deshabilitamos SSR para el formulario debido al calendario y radio groups pesados
});

export default function Home() {
  const { t } = useLanguage();

  return (
    <main id="home" className="min-h-screen bg-background">
      <PromoPopup />
      <Header />
      <HeroSection />
      
      <Benefits className="relative z-10 bg-background border-y-0" />
      
      <div id="services" className="relative z-10 py-16 sm:py-24 bg-white shadow-[0_-50px_100px_-50px_rgba(0,0,0,0.1)]">
        <div className="space-y-12 sm:space-y-16">
          <ProductShowcase
            subtitle={t('home.facial.subtitle')}
            title={t('home.facial.title')}
            description={t('home.facial.description')}
            image={getPlaceholderImage('facial-massage')}
            buttonText={t('home.facial.button')}
            buttonLink="/servicios"
          />
          <ProductShowcase
            subtitle={t('home.sound.subtitle')}
            title={t('home.sound.title')}
            description={t('home.sound.description')}
            image={getPlaceholderImage('sound-healing')}
            buttonText={t('home.sound.button')}
            buttonLink="#contact"
            reverse
          />
        </div>
      </div>
      
      <div className="relative z-10 bg-background shadow-[0_50px_100px_-50px_rgba(0,0,0,0.1)] mb-[600px] md:mb-[500px]">
        <Contact />
      </div>
      <Footer />
    </main>
  );
}
