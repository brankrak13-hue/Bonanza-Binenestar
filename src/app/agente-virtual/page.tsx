import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AiProductAdvisor from '@/components/AiProductAdvisor';

export const maxDuration = 60;

export default function AgenteVirtualPage() {
  return (
    <main className="min-h-screen bg-background animate-in fade-in duration-1000">
      <Header />
      <div className="py-12">
        <AiProductAdvisor />
      </div>
      <Footer />
    </main>
  );
}
