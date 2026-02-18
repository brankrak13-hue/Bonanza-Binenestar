
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
        title: "Re-inicia tu Mente",
        subtitle: "Cráneo Facial",
        description: "Un tratamiento que llega a lo más profundo del cuerpo, ayudando a disolver tensiones arraigadas y devolviendo una sensación de descanso interno y renovación.",
        prices: [
            { price: 700, duration: 60 }
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
                <div className="text-center mb-20 animate-fadeIn opacity-0" style={{ animationDelay: '200ms' }}>
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 text-primary text-xs font-bold tracking-[0.2em] uppercase mb-6">
                        <Sparkles className="w-3.5 h-3.5" />
                        Bienestar Premium
                    </div>
                    <h1 className="text-5xl sm:text-7xl font-bold text-gray-900 mb-8 font-headline">Menú de Experiencias</h1>
                    <p className="mt-4 text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
                        Cada tratamiento es un ritual personalizado diseñado para restaurar tu armonía interior. Descubre el arte del bienestar en cada toque.
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {massages.map((massage, index) => (
                        <Card 
                            key={index} 
                            className="group flex flex-col bg-secondary/30 border-none shadow-none hover-lift animate-fadeIn opacity-0"
                            style={{ animationDelay: `${400 + index * 100}ms` }}
                        >
                            <CardHeader className="pb-4">
                                <div className="flex justify-between items-start mb-2">
                                    <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary/70">{massage.subtitle}</p>
                                </div>
                                <CardTitle className="text-3xl font-bold text-gray-900 group-hover:text-primary transition-colors duration-500 font-headline">{massage.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-grow flex flex-col justify-between">
                                <CardDescription className="mb-8 text-gray-600 text-base leading-relaxed">{massage.description}</CardDescription>
                                
                                <div className="space-y-3">
                                    {massage.prices.map((p, i) => {
                                        const uniqueId = `${massage.title}-${p.duration}`;
                                        const isAdded = addedId === uniqueId;
                                        
                                        return (
                                            <div 
                                                key={i} 
                                                className={cn(
                                                    "flex justify-between items-center p-4 rounded-2xl bg-white/50 border transition-all duration-300 group/item",
                                                    isAdded ? "border-accent bg-white" : "border-transparent hover:border-primary/20 hover:bg-white"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Clock className="w-4 h-4 text-primary/60" />
                                                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-widest">{p.duration} min</span>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className="font-bold text-2xl text-primary font-headline">${p.price.toLocaleString()}</span>
                                                    <Button 
                                                        size="sm" 
                                                        variant="ghost" 
                                                        className={cn(
                                                            "rounded-full w-10 h-10 p-0 transition-all duration-500 active:scale-95",
                                                            isAdded 
                                                                ? "bg-accent text-white scale-110" 
                                                                : "bg-primary text-white hover:bg-accent"
                                                        )}
                                                        onClick={() => handleAddToCart({ title: massage.title, subtitle: massage.subtitle, price: p.price, duration: p.duration })}
                                                    >
                                                        {isAdded ? (
                                                            <Check className="h-5 w-5 animate-scaleIn" />
                                                        ) : (
                                                            <Plus className="h-5 w-5" />
                                                        )}
                                                        <span className="sr-only">Añadir</span>
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
