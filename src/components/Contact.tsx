'use client';

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Instagram, MapPin, Phone, Calendar as CalendarIcon, MessageCircle, Clock, ShieldCheck, Sun, Moon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { useLanguage } from "@/context/LanguageContext";
import { m } from "framer-motion";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";

export default function Contact() {
  const { t, language } = useLanguage();
  const [date, setDate] = React.useState<Date>();
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);
  const [selectedTime, setSelectedTime] = React.useState<string>("7:30 AM");

  // State to track mouse position for the yellow spotlight effect
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const whatsappLink = "https://wa.me/529843143457?text=Hola,%20quisiera%20reservar%20una%20sesión%20de%20Sound%20Healing%20o%20Masaje.";
  const currentLocale = language === 'es' ? es : enUS;

  const handleDateSelect = (d: Date | undefined) => {
    setDate(d);
    setIsCalendarOpen(false);
  };

  return (
    <section id="contact" className="bg-secondary/30 py-16 sm:py-24 scroll-mt-24">
      <div className="max-w-screen-md mx-auto px-4 sm:px-6 lg:px-8">
        <m.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground font-headline mb-4">{t('contact.title')}</h2>
          <p className="mt-4 text-gray-600 text-lg font-medium">{t('contact.desc')}</p>
        </m.div>

        <m.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-12 p-6 bg-white rounded-3xl shadow-sm border border-primary/10"
        >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                        <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 uppercase tracking-widest text-sm">{t('contact.bannerTitle')}</h3>
                        <p className="text-gray-600 text-sm font-medium">{t('contact.bannerDesc')}</p>
                    </div>
                </div>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-accent text-gray-950 font-black h-12 px-8 flex items-center gap-2 rounded-full transition-transform hover:scale-105 shadow-lg uppercase text-xs tracking-widest"
                >
                  <MessageCircle className="w-5 h-5" />
                  {t('contact.whatsapp')}
                </a>
            </div>
        </m.div>

        <m.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="mb-12 flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-12 text-center"
        >
            <a href="tel:9843143457" className="flex items-center gap-3 text-gray-600 hover:text-primary transition-all duration-300 hover:scale-105 group">
                <Phone className="w-5 h-5 group-hover:rotate-12 transition-transform"/>
                <span className="font-bold">984 314 3457</span>
            </a>
            <a href="https://www.instagram.com/bonanzabienstar" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-700 hover:text-primary transition-all duration-300 hover:scale-105 group" aria-label="Visitar nuestro perfil de Instagram">
                <Instagram className="w-5 h-5 group-hover:rotate-12 transition-transform"/>
                <span className="font-bold">@bonanzabienstar</span>
            </a>
            <a href="https://maps.app.goo.gl/vZpV5rLkXj7HgXjZ7" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-600 hover:text-primary transition-all duration-300 hover:scale-105 group">
                <MapPin className="w-5 h-5 group-hover:rotate-12 transition-transform"/>
                <span className="font-bold">{t('contact.location')}</span>
            </a>
        </m.div>

        <m.form 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="space-y-8 bg-white p-8 sm:p-12 rounded-[3rem] shadow-2xl border border-white/40"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-500 ml-1">{t('contact.name')}</label>
                <Input type="text" placeholder="Elena Garro" className="bg-secondary/10 border-transparent focus:border-primary/30 focus:bg-white h-14 rounded-2xl transition-all duration-300 px-6 font-medium" />
            </div>
            <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-500 ml-1">{t('contact.contactInfo')}</label>
                <Input type="text" placeholder="tu@email.com / 984 000 0000" className="bg-secondary/10 border-transparent focus:border-primary/30 focus:bg-white h-14 rounded-2xl transition-all duration-300 px-6 font-medium" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-500 ml-1">{t('contact.when')}</label>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-bold bg-secondary/10 border-transparent h-16 rounded-2xl px-6 hover:bg-white hover:border-primary/20 transition-all",
                      !date && "text-gray-500"
                    )}
                  >
                    <CalendarIcon className="mr-3 h-5 w-5 text-gray-500" />
                    {date ? (
                        <span className="font-bold text-gray-900">{format(date, "PPP", { locale: currentLocale })}</span>
                    ) : (
                        <span>{t('contact.selectDate')}</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 border-none shadow-2xl rounded-3xl overflow-hidden" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateSelect}
                    initialFocus
                    locale={currentLocale}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-500 ml-1">{t('contact.session')}</label>
              <RadioGroup 
                value={selectedTime} 
                onValueChange={setSelectedTime} 
                className="grid grid-cols-2 gap-4"
              >
                <Label
                    htmlFor="morning"
                    className={cn(
                      "flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all cursor-pointer gap-2 group/time",
                      selectedTime === "7:30 AM" ? "border-primary bg-primary/5 shadow-md scale-[1.02]" : "border-secondary/40 hove:border-primary/20"
                    )}
                >
                    <RadioGroupItem value="7:30 AM" id="morning" className="sr-only" />
                    <Sun className={cn("w-5 h-5 transition-transform group-hover/time:rotate-12", selectedTime === "7:30 AM" ? "text-primary" : "text-gray-500")} />
                    <span className="text-[10px] font-bold tracking-widest uppercase text-center">{t('contact.morning')}</span>
                    <span className="text-[9px] text-gray-500 font-bold">7:30 AM</span>
                </Label>
                
                <Label
                    htmlFor="evening"
                    className={cn(
                      "flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all cursor-pointer gap-2 group/time",
                      selectedTime === "8:00 PM" ? "border-primary bg-primary/5 shadow-md scale-[1.02]" : "border-secondary/40 hover:border-primary/20"
                    )}
                >
                    <RadioGroupItem value="8:00 PM" id="evening" className="sr-only" />
                    <Moon className={cn("w-5 h-5 transition-transform group-hover/time:rotate-12", selectedTime === "8:00 PM" ? "text-primary" : "text-gray-500")} />
                    <span className="text-[10px] font-bold tracking-widest uppercase text-center">{t('contact.evening')}</span>
                    <span className="text-[9px] text-gray-500 font-bold">8:00 PM</span>
                </Label>
              </RadioGroup>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-500 ml-1">{t('contact.message')}</label>
            <Textarea 
                placeholder={t('contact.messagePlaceholder')} 
                className="bg-secondary/10 border-transparent focus:border-primary/30 focus:bg-white min-h-[140px] rounded-3xl transition-all duration-300 px-6 py-4 resize-none font-medium" 
            />
          </div>

          <div className="flex flex-col items-center gap-8 pt-6">
            <m.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-gray-500 bg-gray-50/80 px-6 py-3 rounded-full border border-gray-100/50 shadow-sm transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-primary" />
              {t('contact.security')}
            </m.div>

            <Button 
              type="submit" 
              size="lg" 
              onMouseMove={handleMouseMove}
              className="relative group w-full sm:w-auto px-16 h-16 text-sm bg-white text-primary border border-primary/20 shadow-xl hover:shadow-primary/5 transition-all duration-500 font-bold tracking-[0.15em] uppercase flex items-center justify-center rounded-full overflow-hidden"
            >
              {/* Capa de animación: Destello amarillo que sigue al cursor */}
              <div 
                className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
                style={{
                  background: `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 215, 0, 0.35), transparent 70%)`,
                }}
              />
              
              {/* Contenido del botón (Z-10 para estar sobre el destello) */}
              <span className="relative z-10 flex items-center justify-center gap-2">
                {t('contact.submit')}
                <MessageCircle className="w-4 h-4" />
              </span>
            </Button>
          </div>
        </m.form>
      </div>
    </section>
  );
}
