"use client";

import Image from "next/image";
import type { ImagePlaceholder } from "@/lib/images";
import Link from "next/link";

type HeroSectionProps = {
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  image: ImagePlaceholder;
};

export default function HeroSection({ title, subtitle, description, buttonText, buttonLink, image }: HeroSectionProps) {
  return (
    <section className="relative w-full h-[calc(100vh-120px)] min-h-[600px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src={image.imageUrl}
          alt={image.description}
          fill
          priority
          className="object-cover animate-hero-zoom scale-110 hover:scale-100"
          data-ai-hint={image.imageHint}
        />
        <div className="absolute inset-0 bg-black/40 backdrop-grayscale-[0.2]" />
      </div>
      
      <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
        <p className="text-sm md:text-base tracking-[0.4em] uppercase font-medium text-accent mb-6 animate-fadeIn opacity-0" style={{ animationDelay: '200ms' }}>
          {subtitle}
        </p>
        <h1 className="text-5xl md:text-7xl lg:text-9xl font-bold mb-8 leading-[1.1] animate-fadeIn opacity-0 font-headline" style={{ animationDelay: '400ms' }}>
          {title}
        </h1>
        <p className="text-lg md:text-xl text-gray-100/90 leading-relaxed mb-12 max-w-2xl mx-auto font-light animate-fadeIn opacity-0" style={{ animationDelay: '600ms' }}>
          {description}
        </p>
        <div className="animate-fadeIn opacity-0" style={{ animationDelay: '800ms' }}>
          <Link href={buttonLink} className="bg-primary text-white border-2 border-primary px-10 py-4 text-sm tracking-[0.2em] uppercase font-bold transition-all duration-500 rounded-full hover:bg-accent hover:border-accent hover:shadow-2xl hover:-translate-y-1 group inline-flex items-center gap-2">
            {buttonText}
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
      
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
        <div className="w-px h-12 bg-white/40 mx-auto" />
      </div>
    </section>
  );
}
