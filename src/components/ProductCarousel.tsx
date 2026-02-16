"use client";

import * as React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import ProductCard from './ProductCard';
import { getPlaceholderImage } from '@/lib/images';

const products = [
  {
    id: 1,
    name: "Parfum d'Or",
    category: 'Perfume',
    price: 180,
    image: getPlaceholderImage('carousel-product-1'),
  },
  {
    id: 2,
    name: 'Velvet Kiss',
    category: 'Maquillaje',
    price: 45,
    image: getPlaceholderImage('carousel-product-2'),
  },
  {
    id: 3,
    name: 'Sérum de Jouvence',
    category: 'Tratamiento',
    price: 250,
    image: getPlaceholderImage('carousel-product-3'),
  },
  {
    id: 4,
    name: 'Palette des Rêves',
    category: 'Maquillaje',
    price: 95,
    image: getPlaceholderImage('carousel-product-4'),
  },
  {
    id: 5,
    name: 'Crème Céleste',
    category: 'Tratamiento',
    price: 310,
    image: getPlaceholderImage('carousel-product-5'),
  },
];

export default function ProductCarousel() {
  return (
    <section className="py-16 sm:py-24 bg-gray-50">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-semibold text-gray-900">Nuestra Selección</h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Descubre los productos más deseados y las últimas novedades de Bonanza.
          </p>
        </div>
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {products.map((product) => (
              <CarouselItem key={product.id} className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                <ProductCard product={product} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-8 bg-white/80 hover:bg-white text-foreground hidden lg:inline-flex" />
          <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-8 bg-white/80 hover:bg-white text-foreground hidden lg:inline-flex" />
        </Carousel>
      </div>
    </section>
  );
}
