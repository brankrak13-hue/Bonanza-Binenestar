import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import Benefits from '@/components/Benefits';
import Footer from '@/components/Footer';
import ProductShowcase from '@/components/ProductShowcase';
import { getPlaceholderImage } from '@/lib/images';
import About from '@/components/About';
import Contact from '@/components/Contact';

export default function Home() {
  return (
    <main id="home" className="min-h-screen bg-background">
      <Header />
      <HeroSection
        title="Eleva tu Bienestar"
        subtitle="BONANZA ARTE & BIENESTAR"
        description="Descubre un santuario de paz interior a través de nuestros masajes faciales y terapias de sound healing."
        buttonText="Agenda tu Cita"
        buttonLink="#contact"
        image={getPlaceholderImage('hero-wellness')}
      />
      <Benefits />
      <div id="services" className="py-16 sm:py-24 bg-white">
        <div className="space-y-16 sm:space-y-24">
          <ProductShowcase
            subtitle="TÉCNICAS ANCESTRALES"
            title="El Arte de Restaurar"
            description="Manos intuitivas que liberan emociones cristalizadas en el cuerpo. Desde la fluidez del masaje sueco hasta la profundidad del tejido profundo, transformamos el dolor en relajación absoluta, permitiéndote soltar la carga y volver a tu centro."
            image={getPlaceholderImage('facial-massage')}
            buttonText="Ver Menú"
            buttonLink="/servicios"
          />
          <ProductShowcase
            subtitle="Vibraciones que Sanan"
            title="Terapia de Sound Healing"
            description="Sumérgete en un baño de sonidos armónicos con cuencos tibetanos y otros instrumentos. El sound healing equilibra tus centros energéticos, reduce el estrés y te guía hacia un estado de meditación profunda."
            image={getPlaceholderImage('sound-healing')}
            buttonText="Explorar Sesiones"
            reverse
          />
        </div>
      </div>
      <About />
      <Contact />
      <Footer />
    </main>
  );
}
