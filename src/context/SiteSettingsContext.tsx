'use client';

import React, { createContext, useContext, ReactNode, useMemo, useState, useEffect } from 'react';
import { supabase } from '@/supabase/client';
import { placeholderImages, type ImagePlaceholder } from '@/lib/images';

interface SiteSettingsContextType {
  images: Record<string, string>;
  prices: Record<string, number>;
  getImage: (id: string) => ImagePlaceholder;
  getPrice: (id: string, defaultPrice: number) => number;
  isLoading: boolean;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

interface SiteSettingsProviderProps {
  children: ReactNode;
  initialImages?: Record<string, string>;
  initialPrices?: Record<string, number>;
}

export function SiteSettingsProvider({ children, initialImages, initialPrices }: SiteSettingsProviderProps) {
  // Inicialización segura para hidratación: prioridad al servidor (props) -> fallback placeholders
  const [imagesMap, setImagesMap] = useState<Record<string, string>>(() => {
    const defaultMap = Object.fromEntries(placeholderImages.map(img => [img.id, img.imageUrl]));
    return { ...defaultMap, ...(initialImages || {}) };
  });

  const [pricesMap, setPricesMap] = useState<Record<string, number>>(() => {
    return initialPrices || {};
  });

  const [isLoading, setIsLoading] = useState(!initialImages);

  useEffect(() => {
    // Si no recibimos datos del servidor, intentar recuperar de localStorage para velocidad UI
    if (!initialImages) {
        const cachedImages = localStorage.getItem('bonanza_site_images');
        const cachedPrices = localStorage.getItem('bonanza_site_prices');
        if (cachedImages) setImagesMap(prev => ({ ...prev, ...JSON.parse(cachedImages) }));
        if (cachedPrices) setPricesMap(JSON.parse(cachedPrices));
    }

    const fetchSettings = async () => {
      try {
        const { data: imgData } = await supabase.from('site_images').select('id, url');

        const { data: priceData } = await supabase.from('site_prices').select('id, price');

        if (imgData) {
          const defaultMap = Object.fromEntries(placeholderImages.map(img => [img.id, img.imageUrl]));
          const map: Record<string, string> = { ...defaultMap };
          const badUrlPatterns = [
            'photo-1595433261422-cd66de8368a3', 
            '.imgix.net',                        
          ];
          const newPremiumStones = 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1200';

          for (const row of imgData) {
            const isBadHero = row.id === 'hero-wellness' && badUrlPatterns.some(p => row.url.includes(p));
            if (isBadHero) {
              await supabase.from('site_images').update({ url: newPremiumStones }).eq('id', 'hero-wellness');
              map['hero-wellness'] = newPremiumStones;
            } else {
              map[row.id] = row.url;
            }
          }

          setImagesMap(map);
          localStorage.setItem('bonanza_site_images', JSON.stringify(map));
        }
        if (priceData) {
          const map: Record<string, number> = {};
          priceData.forEach((row: any) => { map[row.id] = Number(row.price); });
          setPricesMap(map);
          localStorage.setItem('bonanza_site_prices', JSON.stringify(map));
        }
      } catch (err) {
        console.error('[SiteSettings] Error fetching settings:', err);
      }
      setIsLoading(false);
    };

    fetchSettings();

    // Suscripción en tiempo real
    const channel = supabase
      .channel('site-settings-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'site_images' },
        (payload: any) => {
          console.log('[SiteSettings] Nueva imagen detectada:', payload);
          if (payload.new && payload.new.id) {
            setImagesMap((prev) => ({
              ...prev,
              [payload.new.id]: payload.new.url,
            }));
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'site_prices' },
        (payload: any) => {
          console.log('[SiteSettings] Nuevo precio detectado:', payload);
          if (payload.new && payload.new.id) {
            setPricesMap((prev) => ({
              ...prev,
              [payload.new.id]: Number(payload.new.price),
            }));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getImage = (id: string): ImagePlaceholder => {
    const defaultImg = placeholderImages.find(img => img.id === id);
    const storedUrl = imagesMap[id];
    // Rechazar URLs problemáticas aunque estén en caché
    const badPatterns = ['.imgix.net', 'photo-1595433261422-cd66de8368a3'];
    const isBadUrl = storedUrl && badPatterns.some(p => storedUrl.includes(p));
    if (!defaultImg) {
      return {
        id: 'not-found',
        description: 'Image not found',
        imageUrl: (!isBadUrl && storedUrl) || `https://picsum.photos/seed/${id}/1200/800`,
        imageHint: 'not found'
      };
    }
    return {
      ...defaultImg,
      imageUrl: (!isBadUrl && storedUrl) || defaultImg.imageUrl
    };
  };

  const getPrice = (id: string, defaultPrice: number): number => {
    return pricesMap[id] !== undefined ? pricesMap[id] : defaultPrice;
  };

  return (
    <SiteSettingsContext.Provider value={{ images: imagesMap, prices: pricesMap, getImage, getPrice, isLoading }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext);
  if (context === undefined) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return context;
}
