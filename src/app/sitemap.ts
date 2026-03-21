
import type { MetadataRoute } from 'next';

/**
 * Genera el mapa del sitio (sitemap.xml) dinámicamente.
 * Ayuda a los motores de búsqueda a descubrir todas las páginas de Bonanza.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://bonanza-bienestar.web.app';
  
  // Lista de rutas principales del sitio
  const routes = [
    '',
    '/servicios',
    '/nosotros',
    '/agente-virtual',
    '/perfil',
    '/terminos',
    '/privacidad',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  return routes;
}
