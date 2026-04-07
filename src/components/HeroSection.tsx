
"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { useScroll, useTransform, m } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  const { t } = useLanguage();
  const { getImage, isLoading } = useSiteSettings();
  
  // Re-vinculación total con el ID único para que no haya rastro del antiguo
  const heroImage = getImage('hero-wellness');

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });

  // Animaciones suaves y premium
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.1, 1.3]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.5], [0, 50]);

  // Si no hay imagen cargada pero no estamos en loading general, mostrar un fondo elegante
  if (!heroImage.imageUrl && !isLoading) {
    return (
        <section className="relative w-full h-screen bg-gray-900 flex items-center justify-center">
            <div className="animate-pulse text-white/20 font-bold uppercase tracking-widest text-sm">Cargando Experiencia...</div>
        </section>
    );
  }

  return (
    <section 
      ref={sectionRef}
      className="relative w-full h-[calc(100vh-120px)] min-h-[700px] flex items-center justify-center overflow-hidden bg-black"
    >
      {/* Background Layer with Ken Burns & Parallax */}
      <m.div 
        style={{ y: parallaxY }}
        className="absolute inset-0 z-0"
      >
        <m.div 
          style={{ scale: imageScale }}
          className="relative w-full h-[120%] -top-[10%]"
          initial={{ scale: 1.5, opacity: 0 }}
          animate={{ scale: 1.1, opacity: 1 }}
          transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            priority={true}
            fetchPriority="high"
            className="object-cover"
            unoptimized={heroImage.imageUrl.startsWith('http')} 
          />
          {/* Capa de atmósfera - Gradiente premium para texto legible */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70 backdrop-blur-[1px]" />
        </m.div>
      </m.div>

      {/* Content Layer */}
      <m.div 
        style={{ opacity: contentOpacity, y: contentY }}
        className="relative z-10 container mx-auto px-6 flex flex-col items-center text-center text-white"
      >
        <m.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="flex flex-col items-center"
        >
            <span className="text-xs md:text-sm uppercase tracking-[0.4em] font-bold text-accent mb-6 bg-white/10 px-4 py-2 rounded-full backdrop-blur-md">
                {t('hero.subtitle')}
            </span>
            
            <h1 className="text-5xl md:text-7xl lg:text-9xl font-bold mb-8 leading-[1.0] font-headline tracking-tight">
                {t('hero.title').split(' ').map((word, i) => (
                    <m.span 
                        key={i} 
                        className="inline-block mr-4 last:mr-0"
                        initial={{ opacity: 0, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, filter: 'blur(0px)' }}
                        transition={{ duration: 0.8, delay: 0.8 + i * 0.1 }}
                    >
                        {word}
                    </m.span>
                ))}
            </h1>

            <m.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.9 }}
                transition={{ duration: 1.5, delay: 1.2 }}
                className="text-lg md:text-xl text-gray-200/90 leading-relaxed mb-12 max-w-2xl font-light"
            >
                {t('hero.description')}
            </m.p>

            <m.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
            >
                <Link 
                    href="/reservar"
                    className="group relative flex items-center gap-4 bg-primary text-white border-2 border-primary hover:bg-accent hover:border-accent px-12 py-5 rounded-full text-xs font-bold tracking-[0.3em] uppercase transition-all duration-500 shadow-[0_0_40px_rgba(var(--primary-rgb),0.3)]"
                >
                    <span className="relative z-10">{t('hero.cta')}</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-2 relative z-10" />
                    
                    {/* Efecto de brillo líquido al pasar el mouse */}
                    <div className="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-md" />
                </Link>
            </m.div>
        </m.div>
      </m.div>

      {/* Indicador de Scroll minimalista */}
      <m.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Descubre más</span>
        <div className="w-px h-8 bg-gradient-to-b from-white to-transparent" />
      </m.div>
    </section>
  );
}
