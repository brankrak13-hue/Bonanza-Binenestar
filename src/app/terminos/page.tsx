import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function TerminosPage() {
  return (
    <main className="min-h-screen bg-background animate-in fade-in duration-1000">
      <Header />
      <div className="max-w-screen-md mx-auto px-4 py-20 sm:py-32">
        <h1 className="text-4xl md:text-5xl font-bold mb-12 font-headline text-gray-900 border-b pb-6">Términos y Condiciones</h1>
        
        <div className="space-y-8 text-gray-600 leading-relaxed font-body">
          <section>
            <h2 className="text-xl font-bold text-primary tracking-widest uppercase mb-4">1. Aceptación de los Términos</h2>
            <p>Al acceder y utilizar los servicios de Bonanza Arte & Bienestar, usted acepta estar sujeto a estos Términos y Condiciones. Si no está de acuerdo con alguna parte de estos términos, le rogamos que no utilice nuestros servicios.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary tracking-widest uppercase mb-4">2. Descripción de Servicios</h2>
            <p>Bonanza Arte & Bienestar ofrece tratamientos de masaje facial, corporal y terapias de sonido (Sound Healing). Nos reservamos el derecho de modificar o interrumpir cualquier servicio en cualquier momento sin previo aviso.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary tracking-widest uppercase mb-4">3. Reservas y Cancelaciones</h2>
            <p>Para garantizar la disponibilidad, se recomienda reservar con antelación. Las cancelaciones deben realizarse con al menos 24 horas de anticipación. Las cancelaciones tardías o la no asistencia pueden estar sujetas a un cargo por servicio.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary tracking-widest uppercase mb-4">4. Salud y Bienestar</h2>
            <p>Es responsabilidad del cliente informar al terapeuta sobre cualquier condición médica, alergia o embarazo antes del inicio del tratamiento. Bonanza no se hace responsable de reacciones adversas derivadas de información omitida.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary tracking-widest uppercase mb-4">5. Pagos</h2>
            <p>Todos los pagos deben realizarse al momento de la reserva o inmediatamente después de recibir el servicio. Aceptamos efectivo, tarjetas y pagos digitales autorizados en nuestra plataforma.</p>
          </section>

          <section className="pt-8 border-t">
            <p className="text-sm italic">Última actualización: Febrero 2024</p>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
