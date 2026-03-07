
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
            window.location.href = link;
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
                    <p className="mt-4 text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed font-light italic">
                        {t('services.desc') || 'Cada tratamiento es un ritual personalizado diseñado para tu armonía.'}
                    </p>
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
                                        {massage.prices.map((p: any, i: number) => {
                                            return (
                                                <div 
                                                    key={i} 
                                                    className={cn(
                                                        "flex items-center justify-between p-5 rounded-[2.5rem] bg-white border-2 transition-all duration-500 cursor-pointer group/item",
                                                        "border-transparent shadow-sm hover:border-primary/20 hover:scale-[1.03] active:scale-95"
                                                    )}
                                                    onClick={() => handleRedirectToStripe(p.paymentLink)}
                                                >
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="w-3 h-3 text-primary/40" />
                                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">{p.duration} {t('services.min')}</span>
                                                        </div>
                                                        <span className="font-bold text-2xl text-primary font-headline">${p.amount.toLocaleString()}</span>
                                                    </div>
                                                    
                                                    <div 
                                                        className="h-12 w-12 rounded-full flex items-center justify-center transition-all duration-700 shadow-lg bg-primary text-white group-hover/item:rotate-90 group-hover/item:scale-110"
                                                    >
                                                        <Plus className="w-6 h-6" />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
