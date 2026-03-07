
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
import { Plus, Clock, Sparkles, Check, ExternalLink, Loader2, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function MassageMenu() {
    const { t } = useLanguage();
    const { addToCart } = useCart();
    const { toast } = useToast();
    const [addedId, setAddedId] = useState<string | null>(null);
    const [loadingId, setLoadingId] = useState<string | null>(null);

    const massageIds = ['purification', 'fluidity', 'release', 'awakening', 'reset', 'sculpt'];

    const massages = massageIds.map(id => ({
        id: id,
        title: t(`massages.${id}.title`),
        subtitle: t(`massages.${id}.sub`),
        description: t(`massages.${id}.desc`),
        prices: t(`massages.${id}.prices`) || [],
    }));

    const handleAddToCart = (item: any) => {
        const uniqueId = item.priceId || `${item.title}-${item.duration}`;
        addToCart(item);
        setAddedId(uniqueId);
        setTimeout(() => setAddedId(null), 2000);
    };

    const handleDirectBuy = async (priceId: string, uniqueId: string) => {
        if (!priceId) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "No hay un ID de producto para comprar.",
            });
            return;
        }

        setLoadingId(uniqueId);
        try {
            const response = await fetch('/api/checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ priceId: priceId }),
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
                    {massages.map((massage, index) => {
                        return (
                            <Card 
                                key={massage.id} 
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
                                    
                                    <div className="space-y-3 mt-auto">
                                        {massage.prices.map((p: any, i: number) => {
                                            const uniqueId = p.priceId || `${massage.title}-${p.duration}`;
                                            const isAdded = addedId === uniqueId;
                                            const isLoading = loadingId === uniqueId;
                                            
                                            return (
                                                <div 
                                                    key={i} 
                                                    className={cn(
                                                        "flex flex-col p-4 rounded-3xl bg-white/80 border transition-all duration-500 gap-3",
                                                        isAdded ? "border-accent shadow-md scale-[1.02]" : "border-transparent"
                                                    )}
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="w-3.5 h-3.5 text-primary/50" />
                                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">{p.duration} {t('services.min')}</span>
                                                        </div>
                                                        <span className="font-bold text-xl text-primary font-headline">${p.amount.toLocaleString()}</span>
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <Button 
                                                            variant="outline" 
                                                            size="sm"
                                                            className="rounded-xl h-10 border-primary/10 text-primary hover:bg-primary/5 text-[9px] font-bold tracking-widest uppercase"
                                                            onClick={() => handleAddToCart({
                                                                id: massage.id,
                                                                title: massage.title,
                                                                subtitle: massage.subtitle,
                                                                price: p.amount,
                                                                duration: p.duration,
                                                                priceId: p.priceId,
                                                                image: ''
                                                            })}
                                                        >
                                                            {isAdded ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3 mr-1" />}
                                                            {isAdded ? t('services.added') : t('services.add')}
                                                        </Button>
                                                        
                                                        <Button 
                                                            size="sm"
                                                            className="rounded-xl h-10 btn-primary p-0 text-[9px] font-bold"
                                                            disabled={isLoading}
                                                            onClick={() => handleDirectBuy(p.priceId, uniqueId)}
                                                        >
                                                            {isLoading ? (
                                                                <Loader2 className="w-3 h-3 animate-spin" />
                                                            ) : (
                                                                <span className="flex items-center gap-1">
                                                                    {t('services.buy')}
                                                                    <ExternalLink className="w-2.5 h-3" />
                                                                </span>
                                                            )}
                                                        </Button>
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
