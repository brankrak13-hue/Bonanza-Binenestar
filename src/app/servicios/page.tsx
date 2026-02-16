import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MassageMenu from '@/components/MassageMenu';
import AiProductAdvisor from '@/components/AiProductAdvisor';

export default function ServiciosPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <AiProductAdvisor />
      <MassageMenu />
      <Footer />
    </main>
  );
}
