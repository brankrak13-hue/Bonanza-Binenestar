import Image from "next/image";
import { getPlaceholderImage } from "@/lib/images";
import { useLanguage } from "@/context/LanguageContext";

export default function ExclusiveExperience() {
  const { t } = useLanguage();
  const image = getPlaceholderImage("exclusive-experience");
  return (
    <section id="spas" className="relative py-32 sm:py-48 bg-gray-900">
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={image.imageUrl}
          alt={image.description || t('exclusive.title')}
          fill
          className="object-cover w-full h-full opacity-30"
          data-ai-hint={image.imageHint}
          sizes="100vw"
        />
      </div>
      <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm tracking-widest uppercase text-primary animate-fadeIn font-headline italic">
            {t('exclusive.subtitle')}
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold my-6 animate-fadeIn font-headline" style={{ animationDelay: '200ms' }}>
            {t('exclusive.title')}
          </h2>
          <p className="text-lg text-white/70 leading-relaxed animate-fadeIn font-body italic" style={{ animationDelay: '400ms' }}>
            {t('exclusive.desc')}
          </p>
          <button className="btn-primary mt-10 animate-fadeIn" style={{ animationDelay: '600ms' }}>
            {t('exclusive.cta')}
          </button>
        </div>
      </div>
    </section>
  );
}
