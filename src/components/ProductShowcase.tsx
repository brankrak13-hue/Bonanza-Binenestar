'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { ImagePlaceholder } from '@/lib/images';
import { useRouter } from 'next/navigation';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { Button as StatefulButton } from '@/components/ui/stateful-button';
import { CometCard } from '@/components/ui/comet-card';

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
  const router = useRouter();

  const handleAction = async () => {
    if (buttonLink) {
      // Simulamos una pequeña carga para que se vea el efecto stateful antes de navegar
      await new Promise((resolve) => setTimeout(resolve, 800));
      router.push(buttonLink);
    }
  };

  return (
    <section id={id} className="py-12">
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
            <CometCard>
              <div className="aspect-[4/3] relative overflow-hidden rounded-3xl shadow-2xl">
                <Image
                  src={currentImage.imageUrl}
                  alt={currentImage.description}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                  className="object-cover w-full h-full"
                  quality={90}
                  data-ai-hint={currentImage.imageHint}
                />
              </div>
            </CometCard>
          </div>
          <div
            className={cn(
              'text-center md:text-left space-y-6',
              reverse ? 'md:order-1' : 'md:order-2'
            )}
          >
            <p
              className="text-xs tracking-[0.15em] font-bold uppercase text-primary animate-slideIn font-headline italic"
              style={{ animationDelay: '100ms' }}
            >
              {subtitle}
            </p>
            <h2
              className="text-4xl lg:text-6xl font-bold text-gray-900 font-headline leading-tight animate-slideIn"
              style={{ animationDelay: '200ms' }}
            >
              {title}
            </h2>
            <p
              className="text-gray-500 max-w-md mx-auto md:mx-0 leading-relaxed text-lg font-light italic animate-slideIn"
              style={{ animationDelay: '300ms' }}
            >
              {description}
            </p>
            
            <div className="pt-4 animate-slideIn" style={{ animationDelay: '400ms' }}>
              <StatefulButton onClick={handleAction}>
                {buttonText}
              </StatefulButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}