
"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import type { ImagePlaceholder } from "@/lib/images";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { useScroll, useTransform, m, AnimatePresence } from "framer-motion";

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
  duration: number;
  size: number;
  color: string;
  rotation: number;
  left: string;
  top: string;
};

export default function HeroSection({ title, subtitle, description, buttonText, buttonLink, image }: HeroSectionProps) {
  const { t } = useLanguage();
  const { getImage } = useSiteSettings();
  const [isHovered, setIsHovered] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  
  const currentImage = getImage(image.id);

  const generateParticles = () => {
    const colors = ["#FFFFFF", "hsl(var(--accent))", "hsl(var(--primary))", "#fef3c7", "#ffffffcc"];
    const newParticles = Array.from({ length: 60 }).map(() => ({
      x: `${(Math.random() - 0.5) * 500}px`,
      y: `${(Math.random() - 0.5) * 400}px`,
      duration: 0.8 + Math.random() * 1.2,
      size: 2 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      left: `50%`,
      top: `50%`,
    }));
    setParticles(newParticles);
  };

  useEffect(() => {
    if (isHovered) {
      generateParticles();
    }
  }, [isHovered]);

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  
  return (
    <section 
      ref={sectionRef}
      className="relative w-full h-[calc(100vh-120px)] min-h-[600px] flex items-center justify-center overflow-hidden"
      style={{ position: 'relative' }}
    >
      <m.div 
        style={{ y: parallaxY, scale }}
        className="absolute inset-0 z-0"
      >
        <Image
          src={currentImage.imageUrl}
          alt={currentImage.description}
          fill
          priority={true}
          fetchPriority="high"
          decoding="sync"
          quality={85}
          className="object-cover"
          data-ai-hint={currentImage.imageHint}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/45 backdrop-grayscale-[0.1]" />
      </m.div>
      
      <m.div 
        style={{ opacity }}
        className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto"
      >
        <p className="text-sm md:text-base tracking-[0.2em] font-bold text-accent mb-6 animate-fadeIn opacity-0 font-headline italic" style={{ animationDelay: '150ms' }}>
          {t('hero.subtitle')}
        </p>
        <h1 className="text-5xl md:text-7xl lg:text-9xl font-bold mb-8 leading-[1.1] animate-fadeIn opacity-0 font-headline" style={{ animationDelay: '300ms' }}>
          {t('hero.title')}
        </h1>
        <p className="text-lg md:text-xl text-gray-100/95 leading-relaxed mb-12 max-w-2xl mx-auto font-light animate-fadeIn opacity-0" style={{ animationDelay: '450ms' }}>
          {t('hero.description')}
        </p>
        <div className="animate-fadeIn opacity-0" style={{ animationDelay: '600ms' }}>
          <Link 
            href={buttonLink} 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="magnetic bg-primary text-white border-2 border-primary px-10 py-4 text-sm tracking-[0.2em] uppercase font-bold transition-all duration-500 rounded-full hover:bg-accent hover:border-accent hover:shadow-2xl hover:-translate-y-1 group inline-flex items-center gap-2 overflow-visible relative"
            aria-label={buttonText}
          >
            <span className="relative z-10">{t('hero.cta')}</span>
            <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">→</span>
            
            <div className="particles-field">
              <m.div 
                animate={isHovered ? { opacity: 0.6, scale: 1.4 } : { opacity: 0, scale: 1 }}
                className="absolute inset-0 bg-accent/30 blur-3xl rounded-full pointer-events-none" 
              />
              <AnimatePresence>
                {isHovered && particles.map((p, i) => (
                  <m.div
                    key={`${i}-${isHovered}`}
                    initial={{ x: 0, y: 0, opacity: 0, scale: 0, rotate: 0 }}
                    animate={{ 
                      x: p.x, 
                      y: p.y, 
                      opacity: [0, 1, 1, 0],
                      scale: [0, 1.5, 1, 0],
                      rotate: p.rotation
                    }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ 
                      duration: p.duration,
                      ease: [0.23, 1, 0.32, 1] // Custom ease out for more organic feel
                    }}
                    className="particle"
                    style={{
                      left: p.left,
                      top: p.top,
                      width: `${p.size}px`,
                      height: `${p.size}px`,
                      backgroundColor: p.color,
                      boxShadow: `0 0 15px ${p.color}aa`,
                      zIndex: 20
                    } as React.CSSProperties}
                  />
                ))}
              </AnimatePresence>
            </div>
          </Link>
        </div>
      </m.div>
      
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
        <div className="w-px h-12 bg-white/40 mx-auto" />
      </div>
    </section>
  );
}
