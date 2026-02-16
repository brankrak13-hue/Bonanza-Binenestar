"use client";

import * as React from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { getPlaceholderImage } from "@/lib/images";

const heroSlides = [
  {
    id: 1,
    subtitle: "AQUA ALLEGORIA",
    title: "FLORABLOOM",
    image: getPlaceholderImage("hero-1"),
    gradient: "from-pink-200/30 via-purple-200/20 to-transparent",
  },
  {
    id: 2,
    subtitle: "ABEILLE ROYALE",
    title: "TRATAMIENTO DE OJOS",
    image: getPlaceholderImage("hero-2"),
    gradient: "from-amber-300/30 via-yellow-200/20 to-transparent",
  },
  {
    id: 3,
    subtitle: "L'ART & LA MATIERE",
    title: "VELA PERFUMADA",
    image: getPlaceholderImage("hero-3"),
    gradient: "from-stone-400/30 via-amber-200/20 to-transparent",
  },
];

export default function HeroSection() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    const handleSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", handleSelect);

    return () => {
      api.off("select", handleSelect);
    };
  }, [api]);

  return (
    <section className="relative w-full h-[calc(100vh-104px)] min-h-[600px] overflow-hidden">
      <Carousel
        setApi={setApi}
        plugins={[
          Autoplay({
            delay: 5000,
            stopOnInteraction: true,
          }),
        ]}
        className="w-full h-full"
        opts={{
          loop: true,
        }}
      >
        <CarouselContent className="h-full">
          {heroSlides.map((slide, index) => (
            <CarouselItem key={slide.id} className="relative h-full">
              <Image
                src={slide.image.imageUrl}
                alt={slide.image.description}
                fill
                priority={index === 0}
                className="object-cover transition-transform duration-500 ease-in-out"
                data-ai-hint={slide.image.imageHint}
                style={{
                  transform: `scale(${current === index ? 1.05 : 1})`,
                }}
              />
              <div
                className={`absolute inset-0 bg-gradient-to-t ${slide.gradient}`}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white p-8 bg-black/20 backdrop-blur-sm rounded-lg animate-fadeIn">
                  <p className="text-lg tracking-widest uppercase font-light animate-fadeIn" style={{ animationDelay: '200ms' }}>
                    {slide.subtitle}
                  </p>
                  <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold my-4 animate-fadeIn" style={{ animationDelay: '400ms' }}>
                    {slide.title}
                  </h1>
                  <button className="btn-outline mt-6 animate-fadeIn" style={{ animationDelay: '600ms' }}>Descubrir</button>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              current === index ? 'bg-white scale-125' : 'bg-white/50'
            }`}
            aria-label={`Ir a la diapositiva ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
