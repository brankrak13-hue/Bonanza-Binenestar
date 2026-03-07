
"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { Plus, Clock, Sparkles, Check, ExternalLink, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function MassageMenu() {
    const { t } = useLanguage();
    const { addToCart } = useCart();
    const { getPrice } = useSiteSettings();
    const { toast } = useToast();
    const [addedId, setAddedId] = useState<string | null>(null);
    const [loadingId, setLoadingId] = useState<string | null>(null);

    const massages = [
        {
            id: 'purification',
            title: t('massages.purification.title'),
            subtitle: t('massages.purification.sub'),
            description: t('massages.purification.desc'),
            stripeUrl: t('massages.purification.stripeUrl'),
            priceId: t('massages.purification.priceId'),
            prices: [
                { price: getPrice('purification-90', 1100), duration: 90 },
                { price: getPrice('purification-60', 900), duration: 60 }
            ]
        },
        {
            id: 'fluidity',
            title: t('massages.fluidity.title'),
            subtitle: t('massages.fluidity.sub'),
            description: t('massages.fluidity.desc'),
            stripeUrl: t('massages.fluidity.stripeUrl'),
            priceId: t('massages.fluidity.priceId'),
            prices: [
                { price: getPrice('fluidity-60', 800), duration: 60 },
                { price: getPrice('fluidity-90', 1000), duration: 90 }
            ]
        },
        {
            id: 'release',
            title: t('massages.release.title'),
            subtitle: t('massages.release.sub'),
            description: t('massages.release.desc'),
            stripeUrl: t('massages.release.stripeUrl'),
            priceId: t('massages.release.priceId'),
            prices: [
                { price: getPrice('release-90', 1100), duration: 90 },
                { price: getPrice('release-60', 900), duration: 60 }
            ]
        },
        {
            id: 'awakening',
            title: t('massages.awakening.title'),
            subtitle: t('massages.awakening.sub'),
            description: t('massages.awakening.desc'),
            stripeUrl: t('massages.awakening.stripeUrl'),
            priceId: t('massages.awakening.priceId'),
            prices: [
                { price: getPrice('awakening-60', 800), duration: 60 },
                { price: getPrice('awakening-90', 1000), duration: 90 }
            ]
        },
        {
            id: 'reset',
            title: t('massages.reset.title'),
            subtitle: t('massages.reset.sub'),
            description: t('massages.reset.desc'),
            stripeUrl: t('massages.reset.stripeUrl'),
            priceId: t('massages.reset.priceId'),
            prices: [
                { price: getPrice('reset-60', 700), duration: 60 }
            ]
        },
        {
            id: 'sculpt',
            title: t('massages.sculpt.title'),
            subtitle: t('massages.sculpt.sub'),
            description: t('massages.sculpt.desc'),
            stripeUrl: t('massages.sculpt.stripeUrl'),
            priceId: t('massages.sculpt.priceId'),
            prices: [
                { price: getPrice('sculpt-60', 900), duration: 60 }
            ]
        }
    ];

    const handleAddToCart = (item: any) => {
        const uniqueId = `${item.title}-${item.duration}`;
        addToCart(item);
        setAddedId(uniqueId);
        setTimeout(() => setAddedId(null), 2000);
    };

    const handleDirectBuy = async (massage: any) => {
        if (!massage.priceId) {
            // Si no hay ID de precio, intentamos usar la URL manual
            window.open(massage.stripeUrl, '_blank');
            return;
        }

        setLoadingId(massage.id);
        try {
            const response = await fetch('/api/checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ priceId: massage.priceId }),
            });

            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error(data.error || 'Error al conectar con Stripe');
            }
        } catch (err: any) {
            toast({
                variant: "destructive",
                title: "Error de pago",
                description: err.message,
            });
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <section id="massage-menu" className="py-20 sm:py-32 bg-white overflow-hidden">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16 animate-fadeIn opacity-0" style={{ animationDelay: '200ms' }}>
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 text-primary text-xs font-bold tracking-[0.2em] uppercase mb-6">
                        <Sparkles className="w-3.5 h-3.5" />
                        {t('services.subtitle')}
                    </div>
                    <h1 className="text-5xl sm:text-7xl font-bold text-gray-900 mb-8 font-headline">{t('services.title')}</h1>
                    <p className="mt-4 text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
                        {t('services.desc')}
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {massages.map((massage, index) => (
                        <Card 
                            key={index} 
                            className="group flex flex-col bg-secondary/20 border-none shadow-none hover-lift animate-fadeIn opacity-0 rounded-[2rem] overflow-hidden"
                            style={{ animationDelay: `${400 + index * 100}ms` }}
                        >
                            <CardHeader className="pb-4 pt-8 px-8">
                                <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary/60">{massage.subtitle}</p>
                                <CardTitle className="text-3xl font-bold text-gray-900 group-hover:text-primary transition-colors duration-500 font-headline leading-tight">{massage.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-grow flex flex-col px-8 pb-8">
                                <CardDescription className="flex-grow mb-6 text-gray-600 text-base leading-relaxed">
                                    {massage.description}
                                </CardDescription>
                                
                                <div className="space-y-4 mt-auto">
                                    <Button 
                                        variant="outline" 
                                        className="w-full rounded-2xl h-12 border-primary/20 text-primary hover:bg-primary hover:text-white transition-all font-bold text-[10px] tracking-widest uppercase mb-4"
                                        disabled={loadingId === massage.id}
                                        onClick={() => handleDirectBuy(massage)}
                                    >
                                        {loadingId === massage.id ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                {t('services.buy')}
                                                <ExternalLink className="w-3 h-3" />
                                            </span>
                                        )}
                                    </Button>

                                    <div className="border-t border-gray-100 pt-4 space-y-3">
                                        {massage.prices.map((p, i) => {
                                            const uniqueId = `${massage.title}-${p.duration}`;
                                            const isAdded = addedId === uniqueId;
                                            
                                            return (
                                                <div 
                                                    key={i} 
                                                    className={cn(
                                                        "flex justify-between items-center p-4 rounded-3xl bg-white/80 border transition-all duration-500",
                                                        isAdded ? "border-accent shadow-md scale-[1.02]" : "border-transparent"
                                                    )}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-3.5 h-3.5 text-primary/50" />
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">{p.duration} {t('services.min')}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="font-bold text-xl text-primary font-headline">${p.price.toLocaleString()}</span>
                                                        <Button 
                                                            size="icon" 
                                                            className={cn(
                                                                "rounded-full w-9 h-9 p-0 transition-all duration-300 transform",
                                                                isAdded 
                                                                    ? "bg-accent rotate-0 scale-110" 
                                                                    : "bg-primary hover:rotate-90 hover:scale-110 active:scale-90"
                                                            )}
                                                            onClick={() => handleAddToCart({ title: massage.title, subtitle: massage.subtitle, price: p.price, duration: p.duration })}
                                                        >
                                                            {isAdded ? (
                                                                <Check className="h-4 w-4 animate-in zoom-in duration-300" />
                                                            ) : (
                                                                <Plus className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
