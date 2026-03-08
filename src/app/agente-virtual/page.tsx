import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Skeleton } from '@/components/ui/skeleton';

// Optimizamos la carga del asesor: habilitamos SSR para mejorar el FCP
// pero mantenemos la carga dinámica para separar el bundle de IA
const AiProductAdvisor = dynamic(() => import('@/components/AiProductAdvisor'), {
  loading: () => (
    <div className="max-w-screen-md mx-auto px-4 py-20 space-y-8">
      <div className="flex flex-col items-center space-y-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <Skeleton className="h-12 w-3/4 rounded-2xl" />
        <Skeleton className="h-6 w-1/2 rounded-xl" />
      </div>
      <Skeleton className="h-40 w-full rounded-[2.5rem]" />
      <Skeleton className="h-16 w-full rounded-2xl" />
    </div>
  ),
  ssr: true // Habilitamos SSR para reducir el tiempo percibido de carga
});

export default function AgenteVirtualPage() {
  return (
    <main className="min-h-screen bg-background animate-in fade-in duration-500">
      <Header />
      <div className="py-12">
        <AiProductAdvisor />
      </div>
      <Footer />
    </main>
  );
}
