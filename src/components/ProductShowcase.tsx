
'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { ImagePlaceholder } from '@/lib/images';
import Link from 'next/link';
import { useSiteSettings } from '@/context/SiteSettingsContext';

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
  const { getImage } = useSiteSettings();
  const currentImage = getImage(image.id);

  return (
    <section id={id}>
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
            <div className="hover-zoom aspect-[4/3]">
              <Image
                src={currentImage.imageUrl}
                alt={currentImage.description}
                width={800}
                height={600}
                className="object-cover w-full h-full rounded-lg shadow-xl"
                data-ai-hint={currentImage.imageHint}
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
                className="relative mt-10 inline-flex h-14 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 animate-slideIn"
                style={{ animationDelay: '400ms' }}
              >
                <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-white px-10 py-1 text-[10px] font-bold tracking-[0.2em] uppercase text-primary backdrop-blur-3xl transition-all duration-500 hover:bg-slate-950 hover:text-white">
                  {buttonText}
                </span>
              </Link>
            ) : (
              <button
                className="relative mt-10 inline-flex h-14 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 animate-slideIn"
                style={{ animationDelay: '400ms' }}
              >
                <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-white px-10 py-1 text-[10px] font-bold tracking-[0.2em] uppercase text-primary backdrop-blur-3xl transition-all duration-500 hover:bg-slate-950 hover:text-white">
                  {buttonText}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
