"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";
import { Plus, Clock, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import Link from "next/link";


export default function MassageMenu() {
    const { t } = useLanguage();

    const massageIds = ['purification', 'fluidity', 'release', 'awakening', 'reset', 'sculpt'];

    const massages = massageIds.map(id => ({
        id: id,
        title: t(`massages.${id}.title`),
        subtitle: t(`massages.${id}.sub`),
        description: t(`massages.${id}.desc`),
        prices: t(`massages.${id}.prices`) || [],
    }));

    const handleRedirectToStripe = (link: string) => {
        if (link) {
            window.open(link, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <section id="massage-menu" className="py-20 sm:py-32 bg-white overflow-hidden">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16 animate-fadeIn opacity-0" style={{ animationDelay: '200ms' }}>
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 text-primary text-xs font-bold tracking-[0.2em] uppercase mb-6 border border-primary/10">
                        <Sparkles className="w-3.5 h-3.5" />
                        {t('services.subtitle') || 'BIENESTAR PREMIUM'}
                    </div>
                    <h1 className="text-5xl sm:text-7xl font-bold text-gray-900 mb-8 font-headline leading-tight">{t('services.title')}</h1>
                    
                    <div className="max-w-2xl mx-auto">
                        <TextGenerateEffect 
                            words={t('services.desc') || 'Cada tratamiento es un ritual personalizado diseñado para restaurar tu armonía interior.'} 
                            className="text-gray-500 text-lg leading-relaxed font-light italic text-center"
                        />
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
                    {massages.map((massage, index) => {
                        return (
                            <Card 
                                key={massage.id} 
                                className="group flex flex-col bg-secondary/20 border-none shadow-none hover-lift animate-fadeIn opacity-0 rounded-[2.5rem] overflow-hidden"
                                style={{ animationDelay: `${400 + index * 100}ms` }}
                            >
                                <CardHeader className="pb-4 pt-10 px-8">
                                    <p className="text-[10px] uppercase tracking-[0.4em] font-black text-primary/60 mb-2">{massage.subtitle}</p>
                                    <CardTitle className="text-3xl font-bold text-gray-900 group-hover:text-primary transition-colors duration-500 font-headline leading-[1.1]">{massage.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="flex-grow flex flex-col px-8 pb-10">
                                    <CardDescription className="flex-grow mb-8 text-gray-600 text-base leading-relaxed">
                                        {massage.description}
                                    </CardDescription>
                                    
                                    <div className="space-y-4 mt-auto">
                                        {Array.isArray(massage.prices) && massage.prices.map((p: any, i: number) => {
                                            return (
                                                <button
                                                    key={i}
                                                    type="button"
                                                    className="w-full bg-white text-gray-900 group/item py-1 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20 mb-3"
                                                    onClick={() => handleRedirectToStripe(p.paymentLink)}
                                                >
                                                    <div className="flex items-center justify-between w-full p-3 px-4">
                                                        <div className="flex items-baseline gap-2">
                                                            <span className="font-medium text-2xl text-primary font-body tracking-tighter">${p.amount.toLocaleString()}</span>

                                                            <div className="flex items-center gap-1.5 py-1 px-2.5 rounded-full bg-gray-50 border border-gray-100">
                                                                <Clock className="w-3 h-3 text-primary/40" />
                                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{p.duration} {t('services.min')}</span>
                                                            </div>
                                                        </div>
                                                        <div className="h-10 w-10 rounded-full flex flex-shrink-0 items-center justify-center transition-all duration-500 shadow-md bg-primary text-white group-hover/item:rotate-90 group-hover/item:scale-110">
                                                            <Plus className="w-5 h-5" />
                                                        </div>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>

                <div className="mt-24 pt-16 border-t border-gray-100">
                    <div className="text-center mb-12 animate-fadeIn opacity-0" style={{ animationDelay: '200ms' }}>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C5A880]/10 text-[#C5A880] text-xs font-bold tracking-[0.2em] uppercase mb-6 border border-[#C5A880]/20">
                            <Sparkles className="w-3.5 h-3.5" />
                            EL REGALO PERFECTO
                        </div>
                        <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 font-headline leading-tight">Tarjetas de Regalo</h2>
                        <div className="max-w-2xl mx-auto">
                            <TextGenerateEffect 
                                words="Regala bienestar. Una tarjeta de regalo de Bonanza es más que un obsequio; es un ritual de paz interior." 
                                className="text-gray-500 text-lg leading-relaxed font-light italic text-center"
                            />
                        </div>
                    </div>
                    
                    <div className="animate-fadeIn opacity-0 max-w-4xl mx-auto mt-10" style={{ animationDelay: '400ms' }}>
                        <Link href="/regalos" className="block group relative rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-4 border-white">
                            {/* Abstract gradient background for the banner */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[#f0ebde] via-white to-[#e8ebf0] opacity-80" />
                            
                            <div className="flex flex-col md:flex-row items-center">
                                {/* The big Bonanza Gift Card image */}
                                <div className="w-full md:w-3/5 p-8 relative z-10">
                                    <img 
                                        src="/assets/gift-cards/presentacion para comprar tarjeta de regalo/tarjeta de regalo presentacion sin fondo.png" 
                                        alt="Bonanza Gift Card" 
                                        className="w-full drop-shadow-2xl rounded-2xl transform group-hover:scale-105 transition-transform duration-700"
                                    />
                                </div>
                                
                                {/* Call to action text & button */}
                                <div className="w-full md:w-2/5 p-8 md:p-12 flex flex-col justify-center items-center md:items-start text-center md:text-left z-10 bg-white/40 md:bg-transparent backdrop-blur-sm h-full rounded-b-[2.5rem] md:rounded-bl-none">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4 font-headline">Personaliza tu Tarjeta</h3>
                                    <p className="text-gray-600 mb-8 leading-relaxed font-light">Elige si la quieres vertical u horizontal, añade el nombre de a quien se la regalas y escribe un mensaje con dedicatoria desde el corazón.</p>
                                    
                                    <div className="inline-flex items-center justify-center bg-[#C5A880] text-white px-8 py-4 rounded-full font-bold shadow-lg group-hover:bg-[#b09672] transition-colors w-full sm:w-auto">
                                        Personalizar Tarjeta
                                        <Plus className="ml-2 w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>

            </div>
        </section>
    )
}
