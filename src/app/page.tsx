import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ProductShowcase from '@/components/ProductShowcase';
import ProductCarousel from '@/components/ProductCarousel';
import Categories from '@/components/Categories';
import ExclusiveExperience from '@/components/ExclusiveExperience';
import Benefits from '@/components/Benefits';
import Footer from '@/components/Footer';

import { getPlaceholderImage } from '@/lib/images';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />

      <HeroSection />

      <ProductShowcase
        id="skincare"
        subtitle="NUEVA TECNOLOGIA CON MULTIPLES PATENTES"
        title="EL TRATAMIENTO DE OJOS REPARADOR DE JUVENTUD"
        description="Descubre el poder de la miel y la jalea real en nuestro nuevo tratamiento avanzado para el contorno de ojos, que reduce visiblemente las arrugas y las ojeras."
        image={getPlaceholderImage('abeille-royale-eye-treatment')}
        buttonText="Descubrir"
      />

      <ProductShowcase
        subtitle="L'ART & LA MATIERE"
        title="LA VELA PERFUMADA PERSONALIZABLE"
        description="Crea un ambiente único con nuestra colección de velas perfumadas. Elige tu fragancia y personaliza el estuche para un objeto de arte en tu hogar."
        image={getPlaceholderImage('customizable-scented-candle')}
        buttonText="Personalizar"
        reverse
      />

      <ProductShowcase
        id="makeup"
        subtitle="EDICIÓN LIMITADA"
        title="TERRACOTTA LIGHT"
        description="La icónica luz de terracota en una nueva edición limitada. Un velo de sol para un brillo saludable y natural durante todo el año."
        image={getPlaceholderImage('terracotta-light')}
        buttonText="Comprar ahora"
      />

      <ProductCarousel />

      <ProductShowcase
        subtitle="ORCHIDÉE IMPÉRIALE"
        title="LA NUEVA CREMA LIGERA DE LONGEVIDAD"
        description="El poder de la orquídea en una nueva textura ligera. Una crema excepcional que combate los signos del envejecimiento y revela una piel radiante."
        image={getPlaceholderImage('orchidee-imperiale')}
        buttonText="Ver la colección"
        reverse
      />

      <ProductShowcase
        subtitle="CREACIONES DE EXCEPCIÓN"
        title="CHERRY BLOSSOM"
        description="Una celebración de la primavera en una botella. La delicada fragancia del cerezo en flor capturada en una edición poética y limitada."
        image={getPlaceholderImage('cherry-blossom-product')}
        buttonText="Explorar"
      />

      <Categories />

      <ExclusiveExperience />

      <Benefits />

      <Footer />
    </main>
  );
}
