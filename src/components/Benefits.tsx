'use client';

import { Hand, Heart, Leaf, Waves } from 'lucide-react';
import { HoverEffect } from './ui/card-hover-effect';

const benefits = [
  {
    icon: Leaf,
    title: 'Ingredientes Naturales',
    description: 'Usamos solo productos orgánicos y de alta calidad para tu cuidado.',
  },
  {
    icon: Hand,
    title: 'Terapeutas Expertos',
    description: 'Profesionales certificados con años de experiencia en bienestar.',
  },
  {
    icon: Heart,
    title: 'Enfoque Holístico',
    description: 'Tratamos cuerpo, mente y espíritu como un todo armónico.',
  },
  {
    icon: Waves,
    title: 'Ambiente Relajante',
    description: 'Un espacio diseñado exclusivamente para tu paz y tranquilidad.',
  },
];

export default function Benefits() {
  return (
    <section id="why-us" className="bg-secondary/20 border-y py-12 sm:py-20">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-gray-900">
            ¿Por qué elegir Bonanza?
          </h2>
          <div className="w-20 h-1 bg-primary/20 mx-auto mt-4 rounded-full" />
        </div>
        <HoverEffect items={benefits} />
      </div>
    </section>
  );
}
