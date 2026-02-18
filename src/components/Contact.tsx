'use client';

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Instagram, MapPin, Phone, Calendar as CalendarIcon, MessageCircle, Clock } from "lucide-react";
import Image from "next/image";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function Contact() {
  const [date, setDate] = React.useState<Date>();

  const whatsappLink = "https://wa.me/529843143457?text=Hola,%20quisiera%20reservar%20una%20sesión%20de%20Sound%20Healing%20o%20Masaje.";

  return (
    <section id="contact" className="bg-secondary/30 py-16 sm:py-24">
      <div className="max-w-screen-md mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fadeIn">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground font-headline mb-4">Agenda Tu Experiencia</h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Inicia tu viaje hacia el bienestar profundo. Elige tu fecha ideal o contáctanos directamente.
          </p>
        </div>

        {/* Sound Healing Schedule Banner */}
        <div className="mb-12 p-6 bg-white rounded-3xl shadow-sm border border-primary/10 animate-scaleIn">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                        <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 uppercase tracking-widest text-sm">Sesiones de Sound Healing</h3>
                        <p className="text-gray-500 text-sm">Todos los días a las <span className="text-primary font-bold">7:30 AM</span> y <span className="text-primary font-bold">8:00 PM</span></p>
                    </div>
                </div>
                <Button asChild className="btn-primary h-12 rounded-full px-8 bg-accent hover:bg-accent/90">
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                        <MessageCircle className="w-5 h-5" />
                        Reservar por WhatsApp
                    </a>
                </Button>
            </div>
        </div>

        <div className="mb-12 flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-12 text-center">
            <a href="tel:9843143457" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-all duration-300">
                <Phone className="w-5 h-5"/>
                <span className="font-medium">984 314 3457</span>
            </a>
            <a href="https://www.instagram.com/bonanzaarteybienestar/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-all duration-300">
                <Instagram className="w-5 h-5"/>
                <span className="font-medium">@bonanzaarteybienestar</span>
            </a>
            <a href="https://maps.app.goo.gl/vZpV5rLkXj7HgXjZ7" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-all duration-300">
                <MapPin className="w-5 h-5"/>
                <span className="font-medium">Nuestra Ubicación</span>
            </a>
        </div>

        <form className="space-y-6 bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-xl border border-white/20 animate-fadeIn" style={{ animationDelay: '200ms' }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 ml-1">Tu Nombre</label>
                <Input type="text" placeholder="Ej: Elena Garro" className="bg-secondary/20 border-transparent focus:bg-white h-12 rounded-xl" />
            </div>
            <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 ml-1">Tu Correo</label>
                <Input type="email" placeholder="tu@email.com" className="bg-secondary/20 border-transparent focus:bg-white h-12 rounded-xl" />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 ml-1">¿Cuándo quieres visitarnos?</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal bg-secondary/20 border-transparent h-12 rounded-xl",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP", { locale: es }) : <span>Selecciona una fecha</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  locale={es}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 ml-1">Mensaje o Preferencias</label>
            <Textarea placeholder="Cuéntanos un poco sobre lo que buscas..." className="bg-secondary/20 border-transparent focus:bg-white min-h-[120px] rounded-xl" />
          </div>

          <div className="text-center pt-4">
            <Button type="submit" size="lg" className="btn-primary w-full sm:w-auto px-12 h-14">
              Solicitar Disponibilidad
            </Button>
          </div>
        </form>

        <div className="mt-16 pt-12 border-t border-border text-center animate-fadeIn" style={{ animationDelay: '400ms' }}>
            <h3 className="text-2xl font-semibold text-foreground mb-4 font-headline">Acceso Directo a Agenda</h3>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                Escanea el código QR para ver nuestra disponibilidad en tiempo real o haz{' '}
                <a href="https://scanned.page/p/G9vdm4" target="_blank" rel="noopener noreferrer" className="text-primary font-bold underline hover:text-accent transition-colors">
                    clic aquí
                </a>.
            </p>
            <div className="flex justify-center group">
                <a href="https://scanned.page/p/G9vdm4" target="_blank" rel="noopener noreferrer" className="relative">
                    <div className="absolute -inset-4 bg-primary/5 rounded-[2rem] scale-90 group-hover:scale-100 transition-transform duration-500 -z-10"></div>
                    <Image
                      src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://scanned.page/p/G9vdm4"
                      alt="Código QR para agendar cita"
                      width={200}
                      height={200}
                      className="rounded-2xl shadow-2xl transition-transform duration-500 group-hover:scale-105"
                    />
                </a>
            </div>
        </div>

      </div>
    </section>
  );
}
