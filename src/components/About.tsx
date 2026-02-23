'use client';

import Image from "next/image";
import { getPlaceholderImage } from "@/lib/images";
import { useLanguage } from "@/context/LanguageContext";

export default function About() {
  const { t } = useLanguage();
  const image = getPlaceholderImage("about-us");

  return (
    <section id="about" className="bg-white py-12 sm:py-16">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="animate-fadeIn">
            <div className="hover-zoom aspect-[4/3] rounded-lg overflow-hidden">
              <Image
                src={image.imageUrl}
                alt={image.description}
                width={800}
                height={600}
                className="object-cover w-full h-full"
                data-ai-hint={image.imageHint}
              />
            </div>
          </div>
          <div className="text-center md:text-left">
            <p className="text-sm tracking-widest uppercase text-primary animate-slideIn" style={{ animationDelay: '100ms' }}>
              {t('about.subtitle')}
            </p>
            <h2 className="text-4xl lg:text-5xl font-semibold my-4 text-gray-900 animate-slideIn" style={{ animationDelay: '200ms' }}>
              {t('about.title')}
            </h2>
            <p className="text-gray-600 max-w-md mx-auto md:mx-0 leading-relaxed animate-slideIn mb-6" style={{ animationDelay: '300ms' }}>
              {t('about.desc1')}
            </p>
             <p className="text-gray-600 max-w-md mx-auto md:mx-0 leading-relaxed animate-slideIn font-medium italic" style={{ animationDelay: '400ms' }}>
              "{t('about.desc2')}"
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}