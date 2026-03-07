
'use client';

import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { Users, Wind, Sparkles, ShieldCheck, Stars } from "lucide-react";

export default function About() {
  const { t } = useLanguage();
  const { getImage } = useSiteSettings();
  
  const image = getImage("about-us");

  return (
    <section id="about" className="bg-background py-20 sm:py-32 overflow-hidden">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* BLOQUE 1: Identidad y Propósito */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          <div className="relative animate-fadeIn">
            <div className="relative z-10 aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl">
              <Image
                src={image.imageUrl}
                alt={image.description}
                fill
                className="object-cover"
                data-ai-hint={image.imageHint}
              />
            </div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-0 animate-pulse" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border border-primary/20 rounded-[3rem] translate-x-6 translate-y-6 -z-10" />
          </div>

          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 text-primary text-xs font-bold tracking-[0.2em] uppercase border border-primary/10">
              <Stars className="w-3.5 h-3.5" />
              {t('about.subtitle')}
            </div>
            <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 font-headline leading-tight">
              {t('about.title')}
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-primary font-headline mb-3 flex items-center gap-3">
                  <div className="w-8 h-px bg-primary/30" />
                  {t('about.identity_q')}
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {t('about.identity_a')}
                </p>
              </div>

              <div className="p-8 rounded-[2.5rem] bg-white shadow-xl border border-primary/5">
                <h3 className="text-xl font-bold text-gray-900 font-headline mb-3">
                  {t('about.vision_t')}
                </h3>
                <p className="text-gray-600 italic leading-relaxed">
                  "{t('about.vision_d')}"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* BLOQUE 2: Filosofía Bonanza (Valores) */}
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
              <div 
                key={idx} 
                className="p-10 rounded-[2.5rem] bg-white border border-transparent hover:border-primary/20 hover:shadow-2xl transition-all duration-500 group text-center"
              >
                <div className="w-16 h-16 bg-secondary/50 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                  <value.icon className="w-8 h-8 text-primary group-hover:text-white" strokeWidth={1.5} />
                </div>
                <h4 className="text-2xl font-bold text-gray-900 font-headline mb-4">{value.title}</h4>
                <p className="text-gray-500 leading-relaxed text-sm">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* BLOQUE 3: Propuesta de Valor y Ecosistema */}
        <div className="relative p-12 sm:p-20 rounded-[4rem] bg-primary text-white overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-2xl -translate-x-1/2 translate-y-1/2" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold font-headline mb-6">
                {t('about.ecosystem_t')}
              </h2>
              <p className="text-primary-foreground/80 text-lg leading-relaxed mb-8 italic">
                {t('about.ecosystem_d')}
              </p>
              <div className="flex items-center gap-4 py-4 px-6 bg-white/10 rounded-2xl border border-white/10 w-fit">
                <ShieldCheck className="w-8 h-8 text-accent" />
                <div>
                  <p className="text-xs uppercase tracking-widest font-bold text-white/60">Trayectoria Garantizada</p>
                  <p className="text-xl font-bold font-headline">17+ Años de Experiencia</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square rounded-3xl bg-white/5 border border-white/10 flex flex-col items-center justify-center p-6 text-center backdrop-blur-sm">
                <p className="text-3xl font-bold font-headline mb-1">100%</p>
                <p className="text-[10px] uppercase tracking-widest font-medium opacity-60">Personalizado</p>
              </div>
              <div className="aspect-square rounded-3xl bg-accent/20 border border-white/10 flex flex-col items-center justify-center p-6 text-center backdrop-blur-sm">
                <p className="text-3xl font-bold font-headline mb-1">Elite</p>
                <p className="text-[10px] uppercase tracking-widest font-medium opacity-60">Terapeutas</p>
              </div>
              <div className="aspect-square rounded-3xl bg-white/5 border border-white/10 flex flex-col items-center justify-center p-6 text-center backdrop-blur-sm">
                <p className="text-3xl font-bold font-headline mb-1">Flex</p>
                <p className="text-[10px] uppercase tracking-widest font-medium opacity-60">Ubicaciones</p>
              </div>
              <div className="aspect-square rounded-3xl bg-white/5 border border-white/10 flex flex-col items-center justify-center p-6 text-center backdrop-blur-sm">
                <p className="text-3xl font-bold font-headline mb-1">24/7</p>
                <p className="text-[10px] uppercase tracking-widest font-medium opacity-60">Sintonía</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
