import { GiftCardWizard } from '@/components/wizard/GiftCardWizard';
export const metadata = {
  title: 'Tarjetas de Regalo | Bonanza',
  description: 'Regala bienestar. Personaliza y adquiere tarjetas de regalo para días especiales o para mamá.',
};

export default function TarjetasDeRegaloPage() {
  return (
    <main className="min-h-screen overflow-hidden pt-[120px] pb-24" style={{ background: 'linear-gradient(160deg, #f9f3e8 0%, #fdfaf5 40%, #f4ebd0 100%)' }}>
      {/* Background gradients */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[40rem] h-[40rem] rounded-full bg-[#f4ebd0] opacity-50 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-full h-[50rem] bg-gradient-to-t from-[#f4ebd0]/30 to-transparent pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-light text-[#2e4d41] mb-6">Regala <span className="text-[#C5A880] italic">Bienestar</span></h1>
          <p className="text-lg text-gray-600">
            Una tarjeta de regalo de Bonanza es más que un obsequio; es una invitación a la relajación, el equilibrio y la paz interior. Configura tu regalo a continuación.
          </p>
        </div>

        <GiftCardWizard />
      </div>

    </main>
  );
}
