'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';

export default function TerminosPage() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-background animate-in fade-in duration-1000">
      <Header />
      <div className="max-w-screen-md mx-auto px-4 py-20 sm:py-32">
        <h1 className="text-4xl md:text-5xl font-bold mb-12 font-headline text-gray-900 border-b pb-6">
          {t('legal.terms.title')}
        </h1>
        
        <div className="space-y-8 text-gray-600 leading-relaxed font-body">
          <section>
            <h2 className="text-xl font-bold text-primary tracking-widest uppercase mb-4">
              {t('legal.terms.s1_title')}
            </h2>
            <p>{t('legal.terms.s1_desc')}</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary tracking-widest uppercase mb-4">
              {t('legal.terms.s2_title')}
            </h2>
            <p>{t('legal.terms.s2_desc')}</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary tracking-widest uppercase mb-4">
              {t('legal.terms.s3_title')}
            </h2>
            <p>{t('legal.terms.s3_desc')}</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary tracking-widest uppercase mb-4">
              {t('legal.terms.s4_title')}
            </h2>
            <p>{t('legal.terms.s4_desc')}</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary tracking-widest uppercase mb-4">
              {t('legal.terms.s5_title')}
            </h2>
            <p>{t('legal.terms.s5_desc')}</p>
          </section>

          <section className="pt-8 border-t">
            <p className="text-sm italic">{t('legal.terms.updated')}</p>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
