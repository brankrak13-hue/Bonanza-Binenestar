"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { ImagePlaceholder } from "@/lib/images";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useSiteSettings } from "@/context/SiteSettingsContext";

type HeroSectionProps = {
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  image: ImagePlaceholder;
};

type Particle = {
  x: string;
  y: string;
  duration: string;
  left: string;
  top: string;
};

export default function HeroSection({ title, subtitle, description, buttonText, buttonLink, image }: HeroSectionProps) {
  const { t } = useLanguage();
  const { getImage } = useSiteSettings();
  const [particles, setParticles] = useState<Particle[]>([]);
  
  // Usar la imagen del contexto (posiblemente sobreescrita por el admin)
  const currentImage = getImage(image.id);

  useEffect(() => {
    // Generamos los datos de las 50 partículas para la animación magnética
    const newParticles = Array.from({ length: 50 }).map(() => ({
      x: `${Math.random() * 200 - 100}px`,
      y: `${Math.random() * 200 - 100}px`,
      duration: `${1 + Math.random() * 2}s`,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
    }));
    setParticles(newParticles);
  }, []);
  
  return (
    <section className="relative w-full h-[calc(100vh-120px)] min-h-[600px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src={currentImage.imageUrl}
          alt={currentImage.description}
          fill
          priority
          className="object-cover animate-hero-zoom"
          data-ai-hint={currentImage.imageHint}
        />
        <div className="absolute inset-0 bg-black/40 backdrop-grayscale-[0.2]" />
      </div>
      
      <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
        <p className="text-sm md:text-base tracking-[0.4em] uppercase font-medium text-accent mb-6 animate-fadeIn opacity-0" style={{ animationDelay: '200ms' }}>
          {t('hero.subtitle')}
        </p>
        <h1 className="text-5xl md:text-7xl lg:text-9xl font-bold mb-8 leading-[1.1] animate-fadeIn opacity-0 font-headline" style={{ animationDelay: '400ms' }}>
          {t('hero.title')}
        </h1>
        <p className="text-lg md:text-xl text-gray-100/90 leading-relaxed mb-12 max-w-2xl mx-auto font-light animate-fadeIn opacity-0" style={{ animationDelay: '600ms' }}>
          {t('hero.description')}
        </p>
        <div className="animate-fadeIn opacity-0" style={{ animationDelay: '800ms' }}>
          <Link 
            href={buttonLink} 
            className="magnetic bg-primary text-white border-2 border-primary px-10 py-4 text-sm tracking-[0.2em] uppercase font-bold transition-all duration-500 rounded-full hover:bg-accent hover:border-accent hover:shadow-2xl hover:-translate-y-1 group inline-flex items-center gap-2"
          >
            <span className="relative z-10">{t('hero.cta')}</span>
            <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">→</span>
            
            {/* Particle Field Logic */}
            <div className="particles-field">
              {particles.map((p, i) => (
                <div
                  key={i}
                  className="particle"
                  style={{
                    '--x': p.x,
                    '--y': p.y,
                    animation: `particleFloat ${p.duration} infinite`,
                    left: p.left,
                    top: p.top,
                  } as React.CSSProperties}
                />
              ))}
            </div>
          </Link>
        </div>
      </div>
      
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
        <div className="w-px h-12 bg-white/40 mx-auto" />
      </div>
    </section>
  );
}
