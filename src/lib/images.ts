import placeholderData from './placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

export const placeholderImages: ImagePlaceholder[] = placeholderData.placeholderImages;

export function getPlaceholderImage(id: string): ImagePlaceholder {
  const image = placeholderImages.find((img) => img.id === id);
  if (!image) {
    console.warn(`Image with id "${id}" not found.`);
    return {
        id: 'not-found',
        description: 'Image not found',
        imageUrl: `https://picsum.photos/seed/${id}/1200/800`,
        imageHint: 'not found'
    };
  }
  return image;
}
