'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import About from '@/components/About';

export default function NosotrosPage() {
  return (
    <main className="min-h-screen bg-background animate-in fade-in duration-1000">
      <Header />
      <div className="py-12">
        <About />
      </div>
      <Footer />
    </main>
  );
}
