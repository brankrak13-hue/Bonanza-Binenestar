import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { ImagePlaceholder } from '@/lib/images';
import Link from 'next/link';

type ProductShowcaseProps = {
  id?: string;
  subtitle: string;
  title: string;
  description: string;
  image: ImagePlaceholder;
  buttonText: string;
  buttonLink?: string;
  reverse?: boolean;
};

export default function ProductShowcase({
  id,
  subtitle,
  title,
  description,
  image,
  buttonText,
  buttonLink,
  reverse = false,
}: ProductShowcaseProps) {
  return (
    <section id={id} className="py-16 sm:py-24 bg-white">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            'grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center'
          )}
        >
          <div
            className={cn(
              'animate-fadeIn',
              reverse ? 'md:order-2' : 'md:order-1'
            )}
          >
            <div className="hover-zoom aspect-w-4 aspect-h-3">
              <Image
                src={image.imageUrl}
                alt={image.description}
                width={800}
                height={600}
                className="object-cover w-full h-full rounded-lg shadow-xl"
                data-ai-hint={image.imageHint}
              />
            </div>
          </div>
          <div
            className={cn(
              'text-center md:text-left',
              reverse ? 'md:order-1' : 'md:order-2'
            )}
          >
            <p
              className="text-sm tracking-widest uppercase text-primary animate-slideIn"
              style={{ animationDelay: '100ms' }}
            >
              {subtitle}
            </p>
            <h2
              className="text-4xl lg:text-5xl font-semibold my-4 text-gray-900 animate-slideIn"
              style={{ animationDelay: '200ms' }}
            >
              {title}
            </h2>
            <p
              className="text-gray-600 max-w-md mx-auto md:mx-0 leading-relaxed animate-slideIn"
              style={{ animationDelay: '300ms' }}
            >
              {description}
            </p>
            {buttonLink ? (
              <Link
                href={buttonLink}
                className="btn-primary mt-8 animate-slideIn"
                style={{ animationDelay: '400ms' }}
              >
                {buttonText}
              </Link>
            ) : (
              <button
                className="btn-primary mt-8 animate-slideIn"
                style={{ animationDelay: '400ms' }}
              >
                {buttonText}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
