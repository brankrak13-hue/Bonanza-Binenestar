
'use client';

import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { Users, Wind, Sparkles, ShieldCheck, Award } from "lucide-react";
import { WobbleCard } from "@/components/ui/wobble-card";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { m } from "framer-motion";

export default function About() {
  const { t } = useLanguage();
  const { getImage } = useSiteSettings();
  
  const image = getImage("about-us");

  return (
    <section id="about" className="bg-background py-20 sm:py-32 overflow-hidden">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* BLOQUE 1: Identidad y Propósito con Efecto de Revelado */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          <div className="relative">
            <CardContainer className="inter-var w-full">
              <CardBody className="relative group/card w-full h-auto">
                <CardItem translateZ="100" className="w-full">
                  <div className="relative z-10 aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl">
                    <Image
                      src={image.imageUrl}
                      alt={image.description}
                      fill
                      className="object-cover"
                      data-ai-hint={image.imageHint}
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </CardItem>
              </CardBody>
            </CardContainer>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-0 animate-pulse" />
          </div>

          <div className="space-y-8">
            <m.div 
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
              className="inline-flex items-center px-8 py-3 rounded-full bg-primary/5 text-primary text-[10px] sm:text-xs font-black tracking-[0.3em] uppercase border border-primary/20 font-headline relative overflow-hidden group/badge backdrop-blur-sm shadow-lg"
            >
              {/* Shimmer Effect */}
              <m.div 
                animate={{ 
                  left: ['-100%', '200%'],
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  repeatDelay: 1
                }}
                className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-25deg] pointer-events-none"
              />
              
              <div className="relative z-10 flex">
                {t('about.subtitle').split('').map((char: string, i: number) => (
                  <m.span 
                    key={i} 
                    variants={{
                      initial: { opacity: 0, y: 15, filter: "blur(4px)" },
                      animate: { opacity: 1, y: 0, filter: "blur(0px)" }
                    }}
                    transition={{ 
                      duration: 0.4, 
                      delay: i * 0.03, 
                      ease: [0.215, 0.61, 0.355, 1] 
                    }}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </m.span>
                ))}
              </div>
            </m.div>

            <m.h2 
              initial={{ opacity: 0, scale: 0.95, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-5xl lg:text-7xl font-bold text-gray-900 font-headline leading-[1.1] tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-gray-900 via-gray-800 to-primary/60"
            >
              {t('about.title')}
            </m.h2>
            
            <div className="space-y-10">
              <m.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
                className="relative pl-8 border-l-2 border-primary/20 group"
              >
                <div className="absolute left-[-2px] top-0 h-0 w-0.5 bg-primary transition-all duration-1000 group-hover:h-full" />
                <h3 className="text-2xl font-bold text-primary font-headline mb-4">
                  {t('about.identity_q')}
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {t('about.identity_a')}
                </p>
              </m.div>

              <m.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                viewport={{ once: true }}
                className="relative pl-8 border-l-2 border-accent/20 group"
              >
                <div className="absolute left-[-2px] top-0 h-0 w-0.5 bg-accent transition-all duration-1000 group-hover:h-full" />
                <h3 className="text-2xl font-bold text-accent font-headline mb-4">
                  {t('about.vision_t')}
                </h3>
                <p className="text-gray-600 italic leading-relaxed text-lg">
                  "{t('about.vision_d')}"
                </p>
              </m.div>
            </div>
          </div>
        </div>

        {/* BLOQUE 2: Valores */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 font-headline mb-4">{t('about.values_t')}</h2>
            <div className="w-24 h-1 bg-accent/30 mx-auto rounded-full" />
          </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: Users, title: t('about.v1_t'), desc: t('about.v1_d') },
                { icon: Wind, title: t('about.v2_t'), desc: t('about.v2_d') },
                { icon: Sparkles, title: t('about.v3_t'), desc: t('about.v3_d') },
              ].map((value, idx) => (
                <m.div 
                  key={idx} 
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: idx * 0.15,
                    type: 'spring',
                    stiffness: 150,
                    damping: 12
                  }}
                  viewport={{ once: true }}
                  className="p-10 rounded-[2.5rem] bg-white border border-gray-100/50 hover:border-primary/20 shadow-[0_20px_50px_rgba(0,0,0,0.03)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.08)] transition-all duration-500 group text-center"
                >
                  <div className="w-16 h-16 bg-secondary/50 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:bg-primary group-hover:text-white transition-colors duration-500 shadow-inner group-hover:shadow-lg">
                    <value.icon className="w-8 h-8 text-primary group-hover:text-white transition-transform duration-500 group-hover:rotate-12" strokeWidth={1.5} />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 font-headline mb-4">{value.title}</h4>
                  <p className="text-gray-500 leading-relaxed text-sm">
                    {value.desc}
                  </p>
                </m.div>
              ))}
            </div>
        </div>

        {/* BLOQUE 3: Ecosistema y Trayectoria (Timeline Visual) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-screen-xl mx-auto w-full">
          <WobbleCard
            containerClassName="col-span-1 lg:col-span-2 h-full bg-primary min-h-[400px]"
            className="flex flex-col justify-center"
          >
            <div className="max-w-lg relative z-10">
              <h2 className="text-left text-balance text-3xl md:text-4xl lg:text-5xl font-bold font-headline text-white mb-6 leading-tight">
                {t('about.ecosystem_t')}
              </h2>
              <p className="text-left text-lg text-white/80 italic leading-relaxed">
                {t('about.ecosystem_d')}
              </p>
            </div>
            <ShieldCheck className="absolute -right-10 -bottom-10 w-64 h-64 text-white/10 z-0" />
          </WobbleCard>

          <WobbleCard 
            containerClassName="col-span-1 bg-accent min-h-[400px]" 
            className="flex flex-col justify-center"
          >
            <div className="relative z-10">
              <Award className="w-12 h-12 text-white/40 mb-6" />
              <h2 className="text-left text-balance text-2xl font-bold font-headline text-white mb-6">
                {t('about.trayectory_t')}
              </h2>
              <div className="flex flex-col gap-2 mb-8">
                 <p className="text-6xl font-bold text-white font-headline">22+</p>
                 <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/60">{t('about.trayectory_l')}</p>
              </div>
              <p className="text-left text-sm text-white/90 leading-relaxed italic">
                "{t('about.trayectory_q')}"
              </p>
            </div>
          </WobbleCard>

          <WobbleCard 
            containerClassName="col-span-1 lg:col-span-3 bg-secondary min-h-[250px]" 
            className="flex items-center justify-center p-4 sm:p-0"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 w-full max-w-5xl">
              {[
                { val: "100%", label: t('about.stat_1') },
                { val: "Elite", label: t('about.stat_2') },
                { val: "Flex", label: t('about.stat_3') },
                { val: "24/7", label: t('about.stat_4') },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center group/item">
                  <p className="text-4xl md:text-5xl font-bold font-headline text-primary mb-2 transition-transform duration-500 group-hover/item:scale-110">
                    {item.val}
                  </p>
                  <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] font-black text-gray-400">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </WobbleCard>
        </div>

      </div>
    </section>
  );
}
