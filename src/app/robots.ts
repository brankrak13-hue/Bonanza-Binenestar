
import type { MetadataRoute } from 'next';

/**
 * Genera el archivo robots.txt dinámicamente para guiar a los buscadores.
 * Esto resuelve los errores 404 detectados en los logs de despliegue.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'], // Protegemos las áreas administrativas y de API
    },
    sitemap: 'https://bonanza-bienestar.web.app/sitemap.xml',
  };
}
