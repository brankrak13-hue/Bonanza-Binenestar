"use client";

import Image from "next/image";
import type { ImagePlaceholder } from "@/lib/images";

type HeroSectionProps = {
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  image: ImagePlaceholder;
};

export default function HeroSection({ title, subtitle, description, buttonText, image }: HeroSectionProps) {
  return (
    <section className="relative w-full h-[calc(100vh-120px)] min-h-[500px] sm:min-h-[600px] flex items-center justify-center">
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={image.imageUrl}
          alt={image.description}
          fill
          priority
          className="object-cover"
          data-ai-hint={image.imageHint}
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>
      <div className="relative z-10 text-center text-white p-8 max-w-3xl mx-auto">
        <p className="text-lg tracking-widest uppercase font-light animate-fadeIn" style={{ animationDelay: '200ms' }}>
          {subtitle}
        </p>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold my-4 animate-fadeIn" style={{ animationDelay: '400ms' }}>
          {title}
        </h1>
        <p className="text-lg text-gray-200 leading-relaxed mb-8 animate-fadeIn" style={{ animationDelay: '600ms' }}>
          {description}
        </p>
        <button className="btn-outline mt-6 animate-fadeIn" style={{ animationDelay: '800ms' }}>
            {buttonText}
        </button>
      </div>
    </section>
  );
}
