'use client';

import { Hand, Heart, Leaf, Waves } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';
import { HoverEffect } from './ui/card-hover-effect';

export default function Benefits({ className }: { className?: string }) {
  const { t } = useLanguage();

  const benefits = [
    {
      icon: Leaf,
      title: t('benefits.b1_title'),
      description: t('benefits.b1_desc'),
    },
    {
      icon: Hand,
      title: t('benefits.b2_title'),
      description: t('benefits.b2_desc'),
    },
    {
      icon: Heart,
      title: t('benefits.b3_title'),
      description: t('benefits.b3_desc'),
    },
    {
      icon: Waves,
      title: t('benefits.b4_title'),
      description: t('benefits.b4_desc'),
    },
  ];

  return (
    <section id="why-us" className={cn("bg-secondary/20 border-y py-12 sm:py-20", className)}>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-gray-900">
            {t('benefits.title')}
          </h2>
          <div className="w-20 h-1 bg-primary/20 mx-auto mt-4 rounded-full" />
        </div>
        <HoverEffect items={benefits} />
      </div>
    </section>
  );
}
