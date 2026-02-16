import Image from 'next/image';
import type { ImagePlaceholder } from '@/lib/images';

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  image: ImagePlaceholder;
};

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-lg bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl">
      <div className="aspect-square w-full overflow-hidden">
        <Image
          src={product.image.imageUrl}
          alt={product.image.description}
          width={600}
          height={600}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          data-ai-hint={product.image.imageHint}
        />
      </div>
      <div className="p-4 text-center">
        <p className="text-xs text-primary tracking-wider uppercase">{product.category}</p>
        <h3 className="mt-1 font-headline text-lg font-medium text-gray-900">
          <a href="#">
            <span aria-hidden="true" className="absolute inset-0" />
            {product.name}
          </a>
        </h3>
        <p className="mt-2 text-sm text-gray-700">{product.price.toFixed(2)}€</p>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white via-white/80 to-transparent transition-opacity duration-300 opacity-0 group-hover:opacity-100 flex items-end justify-center pb-4">
        <button className="btn-primary py-2 px-6 text-xs">Añadir a la cesta</button>
      </div>
    </div>
  );
}
