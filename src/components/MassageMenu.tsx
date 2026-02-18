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
import { Plus, Clock, Sparkles, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const massages = [
    {
        title: "Purificación Sutil",
        subtitle: "Drenaje",
        description: "Movimientos suaves que ayudan a mover líquidos del cuerpo para reducir inflamación y dar una sensación de ligereza.",
        prices: [
            { price: 1100, duration: 90 },
            { price: 900, duration: 60 }
        ]
    },
    {
        title: "Fluidez Esencial",
        subtitle: "Sueco",
        description: "Movimientos suaves y continuos que ayudan a soltar la tensión y llevar al cuerpo a un estado de calma profunda.",
        prices: [
            { price: 800, duration: 60 },
            { price: 1000, duration: 90 }
        ]
    },
    {
        title: "Liberación de Tensión",
        subtitle: "Tejido Profundo",
        description: "Técnica profunda que trabaja zonas rígidas para relajar, revitalizar y volver a sentir un alivio de la tensión muscular.",
        prices: [
            { price: 1100, duration: 90 },
            { price: 900, duration: 60 }
        ]
    },
    {
        title: "Despertar Vital",
        subtitle: "Quiromasaje",
        description: "Manos intuitivas que liberan emociones cristalizadas en la espalda y hombros, transformando el dolor en relajación por liberar la carga.",
        prices: [
            { price: 800, duration: 60 },
            { price: 1000, duration: 90 }
        ]
    },
    {
        title: "Re-inicia tu Mente",
        subtitle: "Cráneo Facial",
        description: "Un tratamiento que llega a lo más profundo del cuerpo, ayudando a disolver tensiones arraigadas y devolviendo una sensación de descanso interno y renovación.",
        prices: [
            { price: 700, duration: 60 }
        ]
    },
    {
        title: "Moldea tu figura",
        subtitle: "Reductivo",
        description: "Masaje intenso que activa tu cuerpo, apoya la eliminación de líquidos y aporta una forma más definida.",
        prices: [
            { price: 900, duration: 60 }
        ]
    }
];

export default function MassageMenu() {
    const { addToCart } = useCart();
    const [addedId, setAddedId] = useState<string | null>(null);

    const handleAddToCart = (item: any) => {
        const uniqueId = `${item.title}-${item.duration}`;
        addToCart(item);
        setAddedId(uniqueId);
        setTimeout(() => setAddedId(null), 2000);
    };

    return (
        <section id="massage-menu" className="py-20 sm:py-32 bg-white overflow-hidden">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16 animate-fadeIn opacity-0" style={{ animationDelay: '200ms' }}>
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 text-primary text-xs font-bold tracking-[0.2em] uppercase mb-6">
                        <Sparkles className="w-3.5 h-3.5" />
                        Bienestar Premium
                    </div>
                    <h1 className="text-5xl sm:text-7xl font-bold text-gray-900 mb-8 font-headline">Menú de Experiencias</h1>
                    <p className="mt-4 text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
                        Cada tratamiento es un ritual personalizado diseñado para restaurar tu armonía interior. Descubre el arte del bienestar en cada toque.
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
                                <div className="flex justify-between items-start mb-2">
                                    <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary/60">{massage.subtitle}</p>
                                </div>
                                <CardTitle className="text-3xl font-bold text-gray-900 group-hover:text-primary transition-colors duration-500 font-headline leading-tight">{massage.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col px-8 pb-8">
                                <CardDescription className="mb-2 text-gray-600 text-base leading-relaxed">
                                    {massage.description}
                                </CardDescription>
                                
                                <div className="space-y-4 mt-2">
                                    {massage.prices.map((p, i) => {
                                        const uniqueId = `${massage.title}-${p.duration}`;
                                        const isAdded = addedId === uniqueId;
                                        
                                        return (
                                            <div 
                                                key={i} 
                                                className={cn(
                                                    "flex justify-between items-center p-5 rounded-3xl bg-white/80 border transition-all duration-500 group/item relative overflow-hidden",
                                                    isAdded 
                                                        ? "border-accent shadow-[0_0_20px_rgba(201,168,76,0.2)]" 
                                                        : "border-transparent hover:border-primary/20 hover:shadow-xl hover:-translate-y-1"
                                                )}
                                            >
                                                <div className="flex items-center gap-3 z-10">
                                                    <Clock className="w-4 h-4 text-primary/50 group-hover/item:text-primary transition-colors" />
                                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] group-hover/item:text-gray-600 transition-colors">{p.duration} min</span>
                                                </div>
                                                <div className="flex items-center gap-4 z-10">
                                                    <span className="font-bold text-2xl text-primary font-headline tracking-tight">${p.price.toLocaleString()}</span>
                                                    <Button 
                                                        size="icon" 
                                                        variant="ghost" 
                                                        className={cn(
                                                            "rounded-full w-12 h-12 p-0 transition-all duration-500 active:scale-90 shadow-lg relative group/btn",
                                                            isAdded 
                                                                ? "bg-accent text-white scale-110 rotate-[360deg]" 
                                                                : "bg-primary text-white hover:bg-accent hover:shadow-accent/40"
                                                        )}
                                                        onClick={() => handleAddToCart({ title: massage.title, subtitle: massage.subtitle, price: p.price, duration: p.duration })}
                                                    >
                                                        <div className="relative w-full h-full flex items-center justify-center">
                                                            {isAdded ? (
                                                                <Check className="h-6 w-6 animate-scaleIn" />
                                                            ) : (
                                                                <Plus className="h-6 w-6 transition-transform duration-700 group-hover/btn:rotate-180" />
                                                            )}
                                                        </div>
                                                        {!isAdded && (
                                                            <span className="absolute inset-0 rounded-full bg-primary/20 animate-ping opacity-0 group-hover/btn:opacity-100 duration-1000"></span>
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
