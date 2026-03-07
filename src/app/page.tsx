'use client';

import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import Benefits from '@/components/Benefits';
import Footer from '@/components/Footer';
import ProductShowcase from '@/components/ProductShowcase';
import { getPlaceholderImage } from '@/lib/images';
import Contact from '@/components/Contact';
import { useLanguage } from '@/context/LanguageContext';

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
