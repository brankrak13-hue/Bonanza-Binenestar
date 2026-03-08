
'use client';

import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import Footer from '@/components/Footer';
import ProductShowcase from '@/components/ProductShowcase';
import { getPlaceholderImage } from '@/lib/images';
import { useLanguage } from '@/context/LanguageContext';
import { Skeleton } from '@/components/ui/skeleton';

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
      <Header />
      <HeroSection
        title={t('hero.title')}
        subtitle={t('hero.subtitle')}
        description={t('hero.description')}
        buttonText={t('hero.cta')}
        buttonLink="#contact"
        image={getPlaceholderImage('hero-wellness')}
      />
      
      <Benefits />
      
      <div id="services" className="py-16 sm:py-24 bg-white">
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
      
      <Contact />
      <Footer />
    </main>
  );
}
