'use client';

import { useState, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { X, Gift, Copy, Check } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/supabase/client';
import Image from 'next/image';
import { Button } from './ui/button';

export default function PromoPopup() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [promoData, setPromoData] = useState<{ active: boolean; imageUrl: string }>({
    active: false,
    imageUrl: '',
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchPromoSettings = async () => {
      try {
        // Fetch active status and image URL
        const { data: imgData } = await supabase
          .from('site_images')
          .select('id, url')
          .in('id', ['promo-popup', 'promo-active']);

        const activeSetting = imgData?.find(item => item.id === 'promo-active')?.url === 'true';
        const imageUrl = imgData?.find(item => item.id === 'promo-popup')?.url || '';

        if (activeSetting && imageUrl) {
          setPromoData({ active: true, imageUrl });
          // Show after a small delay
          setTimeout(() => setIsOpen(true), 1500);
        }
      } catch (err) {
        console.error('Error fetching promo settings:', err);
      }
    };

    fetchPromoSettings();
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText('ABRIL20');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <m.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-[2.5rem] overflow-hidden shadow-2xl"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              aria-label="Cerrar promoción"
              className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur hover:bg-white rounded-full shadow-lg transition-all"
            >
              <X className="w-5 h-5 text-gray-800" />
            </button>

            <div className="relative aspect-square w-full">
              <Image
                src={promoData.imageUrl}
                alt="Promoción de Primavera"
                fill
                sizes="(max-width: 640px) 100vw, 512px"
                className="object-cover"
                priority
              />
            </div>

            {/* Copy Button Area */}
            <div className="p-6 bg-white flex flex-col items-center border-t border-gray-100">
              <Button 
                onClick={handleCopy}
                className={`w-full h-12 rounded-2xl font-bold transition-all shadow-md flex items-center justify-center gap-2 ${copied ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-primary text-white hover:bg-primary/90'}`}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? '¡Código copiado!' : t('admin.copyCode')}
              </Button>
              <p className="mt-3 text-[10px] text-gray-600 font-bold uppercase tracking-widest">CÓDIGO: ABRIL20</p>
            </div>
          </m.div>
        </div>
      )}
    </AnimatePresence>
  );
}
