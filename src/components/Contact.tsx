'use client';

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Instagram, MapPin, Phone, Calendar as CalendarIcon, MessageCircle, Clock, ShieldCheck, Sun, Moon } from "lucide-react";
import Image from "next/image";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function Contact() {
  const [date, setDate] = React.useState<Date>();
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);
  const [selectedTime, setSelectedTime] = React.useState<string>("7:30 AM");

  const whatsappLink = "https://wa.me/529843143457?text=Hola,%20quisiera%20reservar%20una%20sesión%20de%20Sound%20Healing%20o%20Masaje.";

  const handleDateSelect = (d: Date | undefined) => {
    setDate(d);
    setIsCalendarOpen(false);
  };

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
                        <p className="text-gray-500 text-sm">Sesiones todos los días a las <span className="text-primary font-bold">7:30 AM</span> y <span className="text-primary font-bold">8:00 PM</span></p>
                    </div>
                </div>
                <Button asChild className="btn-primary h-12 rounded-full px-8 bg-accent hover:bg-accent/90 shadow-lg hover:shadow-accent/40 transition-all">
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                        <MessageCircle className="w-5 h-5" />
                        Reservar por WhatsApp
                    </a>
                </Button>
            </div>
        </div>

        <div className="mb-12 flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-12 text-center">
            <a href="tel:9843143457" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-105">
                <Phone className="w-5 h-5"/>
                <span className="font-medium">984 314 3457</span>
            </a>
            <a href="https://www.instagram.com/bonanzaarteybienestar/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-105">
                <Instagram className="w-5 h-5"/>
                <span className="font-medium">@bonanzaarteybienestar</span>
            </a>
            <a href="https://maps.app.goo.gl/vZpV5rLkXj7HgXjZ7" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-105">
                <MapPin className="w-5 h-5"/>
                <span className="font-medium">Nuestra Ubicación</span>
            </a>
        </div>

        <form className="space-y-8 bg-white p-8 sm:p-12 rounded-[3rem] shadow-2xl border border-white/40 animate-fadeIn" style={{ animationDelay: '200ms' }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 ml-1">Tu Nombre</label>
                <Input type="text" placeholder="Ej: Elena Garro" className="bg-secondary/10 border-transparent focus:border-primary/30 focus:bg-white h-14 rounded-2xl transition-all duration-300 px-6" />
            </div>
            <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 ml-1">Correo o Número de contacto</label>
                <Input type="text" placeholder="tu@email.com o 984 000 0000" className="bg-secondary/10 border-transparent focus:border-primary/30 focus:bg-white h-14 rounded-2xl transition-all duration-300 px-6" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 ml-1">¿Cuándo quieres visitarnos?</label>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal bg-secondary/10 border-transparent h-16 rounded-2xl px-6 hover:bg-white hover:border-primary/20 transition-all group",
                      !date && "text-muted-foreground",
                      isCalendarOpen && "border-primary/30 bg-white"
                    )}
                  >
                    <CalendarIcon className={cn("mr-3 h-5 w-5 transition-colors", isCalendarOpen ? "text-primary" : "text-gray-400")} />
                    {date ? (
                        <span className="font-semibold text-gray-900">{format(date, "PPP", { locale: es })}</span>
                    ) : (
                        <span>Selecciona una fecha</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 border-none shadow-2xl rounded-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-300" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateSelect}
                    initialFocus
                    locale={es}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 ml-1">Sesión Preferida</label>
              <RadioGroup 
                value={selectedTime} 
                onValueChange={setSelectedTime} 
                className="grid grid-cols-2 gap-4"
              >
                <Label
                    htmlFor="morning"
                    className={cn(
                        "flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-500 cursor-pointer gap-2 group/time overflow-hidden relative",
                        selectedTime === "7:30 AM"
                            ? "border-primary bg-primary/5 shadow-[inset_0_2px_10px_rgba(41,102,84,0.1)]"
                            : "border-secondary/40 bg-transparent hover:border-primary/20 hover:bg-gray-50/50"
                    )}
                >
                    <RadioGroupItem value="7:30 AM" id="morning" className="sr-only" />
                    <Sun className={cn("w-5 h-5 transition-all duration-500", selectedTime === "7:30 AM" ? "text-primary scale-110" : "text-gray-400 group-hover/time:text-primary/60")} />
                    <div className="flex flex-col items-center">
                        <span className={cn("text-[10px] font-bold tracking-widest uppercase mb-0.5 transition-colors", selectedTime === "7:30 AM" ? "text-primary" : "text-gray-500")}>
                            Mañana
                        </span>
                        <span className="text-[9px] text-gray-400 font-medium">7:30 AM</span>
                    </div>
                    {selectedTime === "7:30 AM" && (
                        <div className="absolute top-1 right-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        </div>
                    )}
                </Label>
                
                <Label
                    htmlFor="evening"
                    className={cn(
                        "flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-500 cursor-pointer gap-2 group/time overflow-hidden relative",
                        selectedTime === "8:00 PM"
                            ? "border-primary bg-primary/5 shadow-[inset_0_2px_10px_rgba(41,102,84,0.1)]"
                            : "border-secondary/40 bg-transparent hover:border-primary/20 hover:bg-gray-50/50"
                    )}
                >
                    <RadioGroupItem value="8:00 PM" id="evening" className="sr-only" />
                    <Moon className={cn("w-5 h-5 transition-all duration-500", selectedTime === "8:00 PM" ? "text-primary scale-110" : "text-gray-400 group-hover/time:text-primary/60")} />
                    <div className="flex flex-col items-center">
                        <span className={cn("text-[10px] font-bold tracking-widest uppercase mb-0.5 transition-colors", selectedTime === "8:00 PM" ? "text-primary" : "text-gray-500")}>
                            Noche
                        </span>
                        <span className="text-[9px] text-gray-400 font-medium">8:00 PM</span>
                    </div>
                    {selectedTime === "8:00 PM" && (
                        <div className="absolute top-1 right-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        </div>
                    )}
                </Label>
              </RadioGroup>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 ml-1">Mensaje o Preferencias</label>
            <Textarea 
                placeholder="Cuéntanos un poco sobre lo que buscas para personalizar tu ritual..." 
                className="bg-secondary/10 border-transparent focus:border-primary/30 focus:bg-white min-h-[140px] rounded-3xl transition-all duration-300 px-6 py-4 resize-none" 
            />
          </div>

          <div className="flex flex-col items-center gap-6 pt-6">
            <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-gray-400 bg-gray-50/80 px-5 py-2.5 rounded-full border border-gray-100/50">
              <ShieldCheck className="w-4 h-4 text-primary" />
              PROTECCIÓN HUMANA ACTIVA (APP CHECK)
            </div>
            <Button type="submit" size="lg" className="btn-primary w-full sm:w-auto px-16 h-16 text-sm group">
              Solicitar Disponibilidad
              <MessageCircle className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </form>

        <div className="mt-20 pt-16 border-t border-primary/5 text-center animate-fadeIn" style={{ animationDelay: '400ms' }}>
            <h3 className="text-2xl font-semibold text-foreground mb-4 font-headline tracking-wide uppercase">Acceso Directo a Agenda</h3>
            <p className="text-muted-foreground mb-10 max-w-lg mx-auto leading-relaxed">
                Escanea el código QR para ver nuestra disponibilidad en tiempo real o haz{' '}
                <a href="https://scanned.page/p/G9vdm4" target="_blank" rel="noopener noreferrer" className="text-primary font-bold underline decoration-primary/30 underline-offset-4 hover:text-accent hover:decoration-accent transition-all">
                    clic aquí
                </a>.
            </p>
            <div className="flex justify-center group">
                <a href="https://scanned.page/p/G9vdm4" target="_blank" rel="noopener noreferrer" className="relative p-2">
                    <div className="absolute -inset-4 bg-primary/5 rounded-[2.5rem] scale-90 group-hover:scale-100 transition-transform duration-700 -z-10 blur-sm"></div>
                    <Image
                      src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://scanned.page/p/G9vdm4"
                      alt="Código QR para agendar cita"
                      width={200}
                      height={200}
                      className="rounded-3xl shadow-2xl transition-all duration-700 group-hover:scale-105 group-hover:rotate-1"
                    />
                </a>
            </div>
        </div>

      </div>
    </section>
  );
}
