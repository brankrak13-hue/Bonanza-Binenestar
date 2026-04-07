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
    // WIPE CACHE DE RASTROS ANTIGUOS (Piedras Unsplash)
    let cachedImages = localStorage.getItem('bonanza_site_images');
    const cachedPrices = localStorage.getItem('bonanza_site_prices');
    
    if (cachedImages) {
        let imagesObj = JSON.parse(cachedImages);
        const oldStonesUrl = 'photo-1595433261422-cd66de8368a3';
        if (imagesObj['hero-wellness'] && imagesObj['hero-wellness'].includes(oldStonesUrl)) {
            console.log('[SiteSettings] Detectada imagen antigua en caché. Limpiando rastro...');
            delete imagesObj['hero-wellness'];
            localStorage.setItem('bonanza_site_images', JSON.stringify(imagesObj));
            cachedImages = JSON.stringify(imagesObj);
        }
        setImagesMap(imagesObj);
    }
    if (cachedPrices) setPricesMap(JSON.parse(cachedPrices));

    const fetchSettings = async () => {
      // Solo mostramos loading si no hay nada en caché
      if (!cachedImages && !cachedPrices) setIsLoading(true);
      
      try {
        const { data: imgData } = await supabase.from('site_images').select('id, url');
        const { data: priceData } = await supabase.from('site_prices').select('id, price');

        if (imgData) {
          const map: Record<string, string> = {};
          const oldStonesUrl = 'photo-1595433261422-cd66de8368a3';
          const newPremiumStones = 'https://images.unsplash.com/photo-1545208393-596371BA9a3e?auto=format&fit=crop&q=80&w=1200';
          
          for (const row of imgData) {
            // AUTO-CURACIÓN: Si la DB tiene el link roto, lo arreglamos en caliente
            if (row.id === 'hero-wellness' && row.url.includes(oldStonesUrl)) {
              console.log('[SiteSettings] SANANDO BASE DE DATOS: Detectada URL antigua. Actualizando...');
              // Actualizamos en Supabase para que no vuelva a ocurrir
              await supabase.from('site_images').update({ url: newPremiumStones }).eq('id', 'hero-wellness');
              map[row.id] = newPremiumStones;
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
