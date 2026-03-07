'use client';

import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { Users, Wind, Sparkles, ShieldCheck } from "lucide-react";
import { WobbleCard } from "@/components/ui/wobble-card";

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
              <Sparkles className="w-3.5 h-3.5" />
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

        {/* BLOQUE 3: Propuesta de Valor y Ecosistema - ADAPTADO CON WOBBLE CARD */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-screen-xl mx-auto w-full">
          <WobbleCard
            containerClassName="col-span-1 lg:col-span-2 h-full bg-primary min-h-[400px]"
            className="p-10 flex flex-col justify-center"
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
            className="p-10 flex flex-col justify-center"
          >
            <div className="relative z-10">
              <h2 className="text-left text-balance text-2xl font-bold font-headline text-white mb-6">
                Trayectoria Garantizada
              </h2>
              <div className="flex flex-col gap-2 mb-8">
                 <p className="text-6xl font-bold text-white font-headline">17+</p>
                 <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/60">Años de Experiencia</p>
              </div>
              <p className="text-left text-sm text-white/90 leading-relaxed italic">
                "Excelencia certificada en el sector del bienestar holístico."
              </p>
            </div>
            <Sparkles className="absolute -right-8 -top-8 w-32 h-32 text-white/10" />
          </WobbleCard>

          <WobbleCard 
            containerClassName="col-span-1 lg:col-span-3 bg-secondary min-h-[250px]" 
            className="p-10 flex items-center justify-center"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 w-full max-w-5xl">
              {[
                { val: "100%", label: "Personalizado" },
                { val: "Elite", label: "Terapeutas" },
                { val: "Flex", label: "Ubicaciones" },
                { val: "24/7", label: "Sintonía" },
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
