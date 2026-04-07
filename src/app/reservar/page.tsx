'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/supabase/client';
import { Calendar as CalendarIcon, Clock, CheckCircle } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function ReservarPage() {
  const { toast } = useToast();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [step, setStep] = useState(1); // 1: Ingrese código, 2: Calendario, 3: Éxito

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;
    setLoading(true);

    try {
      const cleanCode = code.trim().toUpperCase();


      // Look up order by reservation_code in Supabase
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('reservation_code', cleanCode)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        toast({ title: 'Código inválido', description: 'No encontramos ninguna compra con este código.', variant: 'destructive' });
        setLoading(false);
        return;
      }

      if (data.reservation_date) {
        toast({ title: 'Reserva existente', description: 'Este código ya tiene una reserva asociada.', variant: 'destructive' });
        setLoading(false);
        return;
      }

      setOrder(data);
      setStep(2);
    } catch (err) {
      console.error(err);
      toast({ title: 'Error interno', description: 'Por favor, contacta a soporte.', variant: 'destructive' });
    }
    setLoading(false);
  };

  const getAvailableTimes = (date: Date) => {
    const day = date.getDay();
    const times = [];
    // Lunes a Viernes: 10:00 AM - 8:00 PM | Sábado y Domingo: 10:00 AM - 8:00 PM
    for (let i = 10; i <= 20; i++) times.push(`${i}:00`);
    return times;
  };

  const handleReserve = async () => {
    if (!selectedDate || !selectedTime || !order) return;
    setLoading(true);
    try {
      // Fix timezone: construir la fecha en hora local (México) para que Supabase la guarde correctamente
      const [hours, minutes] = selectedTime.split(':').map(Number);
      const localDate = new Date(selectedDate);
      localDate.setHours(hours, minutes || 0, 0, 0);
      const dateTimeString = localDate.toISOString();

      // Update the order with the reservation date
      await supabase.from('orders').update({ reservation_date: dateTimeString, status: 'scheduled' }).eq('id', order.id);
      // Create a reservation record
      await supabase.from('reservations').insert({ order_id: order.id, reservation_date: dateTimeString });

      setStep(3);
    } catch (err) {
      console.error(err);
      toast({ title: 'Hubo un error al guardar', variant: 'destructive' });
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 w-full bg-[#f8faf9] relative z-10 pt-24 pb-12 px-4 mb-[600px] md:mb-[500px] shadow-[0_50px_100px_-50px_rgba(0,0,0,0.1)] flex items-center justify-center">
        <div className="w-full max-w-lg mx-auto">
          
          {step === 1 && (
            <Card className="border-none shadow-xl rounded-[2rem] bg-white overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
              <CardHeader className="text-center space-y-4 pb-8 bg-primary/5">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <CalendarIcon className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <CardTitle className="font-headline text-3xl">Agenda Tu Cita</CardTitle>
                  <CardDescription className="text-sm mt-2">
                    Ingresa el código secreto que te enviamos por correo electrónico luego de tu compra.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleVerifyCode} className="space-y-6">
                  <div>
                    <Input 
                      placeholder="Ej: BNZ-XXXXXX" 
                      value={code} 
                      onChange={(e) => setCode(e.target.value)}
                      className="text-center text-lg h-14 tracking-[0.2em] uppercase font-bold"
                      required
                    />
                  </div>
                  <Button type="submit" disabled={loading} className="w-full h-14 btn-primary rounded-xl text-lg relative overflow-hidden group">
                    <span className="relative z-10">{loading ? 'Verificando...' : 'Validar Entrada'}</span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card className="border-none shadow-xl rounded-[2rem] bg-white overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
              <CardHeader className="text-center space-y-2 bg-primary/5 border-b border-primary/10">
                <CardTitle className="font-headline text-2xl tracking-wide">Elige tu Momento</CardTitle>
                <CardDescription>
                  Has desbloqueado el acceso para organizar tu paz interior. 
                  <br/><strong className="text-primary mt-2 block">Lun-Dom: 10:00 AM – 8:00 PM</strong>
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="bg-secondary/10 rounded-3xl p-4 flex justify-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    locale={es}
                    disabled={(date) => date < new Date()}
                    className="bg-transparent"
                  />
                </div>

                {selectedDate && (
                  <div className="space-y-4 animate-in fade-in duration-300">
                    <h3 className="text-base sm:text-lg font-bold text-center text-gray-800 font-sans tracking-wide border-b pb-2">
                      Horarios para el <span className="text-primary capitalize">{format(selectedDate, "dd 'de' MMMM", { locale: es })}</span>
                    </h3>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {getAvailableTimes(selectedDate).map(time => (
                        <div 
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`
                            py-3 px-2 rounded-xl text-center font-bold text-sm cursor-pointer transition-all border
                            ${selectedTime === time 
                              ? 'bg-primary text-white border-primary shadow-lg scale-105' 
                              : 'bg-white text-gray-700 border-gray-100 hover:border-primary/30 hover:bg-primary/5'}
                          `}
                        >
                          {time}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Button 
                  onClick={handleReserve} 
                  disabled={!selectedTime || loading} 
                  className="w-full h-14 btn-primary rounded-xl text-lg mt-6"
                >
                  <Clock className="w-5 h-5 mr-2" />
                  {loading ? 'Agendando...' : 'Confirmar Cita'}
                </Button>
              </CardContent>
            </Card>
          )}

          {step === 3 && (
            <Card className="border-none shadow-xl rounded-[2rem] bg-white overflow-hidden text-center animate-in zoom-in-95 duration-500">
              <CardContent className="p-12 space-y-6">
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-12 h-12 text-green-500" />
                </div>
                <h2 className="text-3xl font-headline text-gray-800">¡Equilibrio Sellado!</h2>
                <p className="text-gray-500 leading-relaxed max-w-sm mx-auto">
                  Tu agenda está lista. Te esperamos el día seleccionado para iniciar tu viaje en Bonanza. Puedes revisar tu cita en tu perfil.
                </p>
                <div className="pt-6">
                  <Button variant="outline" className="rounded-full w-full max-w-xs mx-auto" onClick={() => window.location.href = '/perfil'}>
                    Ver Mi Perfil
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

        </div>
      </div>
      <Footer />
    </main>
  );
}
