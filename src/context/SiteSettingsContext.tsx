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

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [imagesMap, setImagesMap] = useState<Record<string, string>>({});
  const [pricesMap, setPricesMap] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        const { data: imgData } = await supabase.from('site_images').select('id, url');
        const { data: priceData } = await supabase.from('site_prices').select('id, price');

        if (imgData) {
          const map: Record<string, string> = {};
          imgData.forEach((row: any) => { map[row.id] = row.url; });
          setImagesMap(map);
        }
        if (priceData) {
          const map: Record<string, number> = {};
          priceData.forEach((row: any) => { map[row.id] = Number(row.price); });
          setPricesMap(map);
        }
      } catch (err) {
        console.error('[SiteSettings] Error fetching settings:', err);
      }
      setIsLoading(false);
    };
    fetchSettings();
  }, []);

  const getImage = (id: string): ImagePlaceholder => {
    const defaultImg = placeholderImages.find(img => img.id === id);
    if (!defaultImg) {
      return {
        id: 'not-found',
        description: 'Image not found',
        imageUrl: imagesMap[id] || `https://picsum.photos/seed/${id}/1200/800`,
        imageHint: 'not found'
      };
    }
    return {
      ...defaultImg,
      imageUrl: imagesMap[id] || defaultImg.imageUrl
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
