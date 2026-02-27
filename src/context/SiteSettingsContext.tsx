
'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { placeholderImages, type ImagePlaceholder } from '@/lib/images';

interface SiteSettingsContextType {
  images: Record<string, string>;
  getImage: (id: string) => ImagePlaceholder;
  isLoading: boolean;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const db = useFirestore();

  const imagesQuery = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, 'siteSettings', 'content', 'images');
  }, [db]);

  const { data: imageOverrides, isLoading } = useCollection(imagesQuery);

  const imagesMap = React.useMemo(() => {
    const map: Record<string, string> = {};
    if (imageOverrides) {
      imageOverrides.forEach((doc: any) => {
        map[doc.id] = doc.url;
      });
    }
    return map;
  }, [imageOverrides]);

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

  return (
    <SiteSettingsContext.Provider value={{ images: imagesMap, getImage, isLoading }}>
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
