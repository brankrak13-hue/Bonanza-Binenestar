import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PrivacidadPage() {
  return (
    <main className="min-h-screen bg-background animate-in fade-in duration-1000">
      <Header />
      <div className="max-w-screen-md mx-auto px-4 py-20 sm:py-32">
        <h1 className="text-4xl md:text-5xl font-bold mb-12 font-headline text-gray-900 border-b pb-6">Política de Privacidad</h1>
        
        <div className="space-y-8 text-gray-600 leading-relaxed font-body">
          <section>
            <h2 className="text-xl font-bold text-primary tracking-widest uppercase mb-4">1. Recopilación de Información</h2>
            <p>En Bonanza Arte & Bienestar, recopilamos información personal básica como su nombre, correo electrónico y número de teléfono únicamente cuando usted la proporciona voluntariamente al agendar una cita o suscribirse a nuestro boletín.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary tracking-widest uppercase mb-4">2. Uso de la Información</h2>
            <p>La información recolectada se utiliza exclusivamente para gestionar sus citas, procesar pagos, mejorar nuestros servicios y enviarle comunicaciones relacionadas con su bienestar y promociones de Bonanza.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary tracking-widest uppercase mb-4">3. Protección de Datos</h2>
            <p>Implementamos medidas de seguridad técnicas y organizativas para proteger sus datos personales contra el acceso no autorizado, la pérdida o la alteración. Sus datos nunca serán vendidos a terceros.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary tracking-widest uppercase mb-4">4. Sus Derechos</h2>
            <p>Usted tiene derecho a acceder, rectificar o eliminar sus datos personales en cualquier momento. Puede ejercer estos derechos enviándonos un correo electrónico a través de nuestra sección de contacto.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary tracking-widest uppercase mb-4">5. Cookies</h2>
            <p>Nuestro sitio utiliza cookies para mejorar su experiencia de navegación y analizar el tráfico de forma anónima. Puede configurar su navegador para rechazar las cookies si lo desea.</p>
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
