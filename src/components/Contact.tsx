import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Contact() {
  return (
    <section className="bg-secondary py-16 sm:py-24">
      <div className="max-w-screen-md mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-semibold text-foreground">Agenda Tu Experiencia</h2>
          <p className="mt-4 text-muted-foreground">
            ¿Lista para comenzar tu viaje hacia el bienestar? Contáctanos para agendar tu cita o para cualquier consulta.
          </p>
        </div>
        <form className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input type="text" placeholder="Nombre" className="bg-background" />
            <Input type="email" placeholder="Correo Electrónico" className="bg-background" />
          </div>
          <Textarea placeholder="Tu mensaje..." className="bg-background min-h-[150px]" />
          <div className="text-center">
            <Button type="submit" size="lg" className="btn-primary">
              Enviar Mensaje
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
