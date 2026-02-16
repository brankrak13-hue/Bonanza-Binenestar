import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AiProductAdvisor from '@/components/AiProductAdvisor';

export default function AgenteVirtualPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="py-16 sm:py-24">
        <AiProductAdvisor />
      </div>
      <Footer />
    </main>
  );
}
