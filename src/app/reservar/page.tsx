'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/supabase/client';
import { useLanguage } from '@/context/LanguageContext';
import { useAuthContext } from '@/supabase/provider';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle, 
  MapPin, 
  Home, 
  Users, 
  Info, 
  HelpCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function ReservarPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user } = useAuthContext();
  
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Code, 2: Location, 3: Details, 4: Calendar, 5: Success
  
  // Saved data from profile
  const [savedProfileData, setSavedProfileData] = useState<any>(null);
  const [shouldSaveAddress, setShouldSaveAddress] = useState(false);
  
  // Step 1: Code
  const [code, setCode] = useState('');
  const [order, setOrder] = useState<any>(null);
  
  // Step 2: Location
  const [locationType, setLocationType] = useState<'local' | 'domicilio'>('local');
  
  // Step 3: Details
  const [address, setAddress] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [mapsUrl, setMapsUrl] = useState('');
  const [numPeople, setNumPeople] = useState('1');
  const [hasGatedCommunity, setHasGatedCommunity] = useState(false);
  
  // Step 4: Calendar
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>('');

  const isGoogleMapsUrl = (url: string) => {
    return url.toLowerCase().includes('google.com/maps') || url.toLowerCase().includes('goo.gl/maps');
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;
    setLoading(true);

    try {
      const cleanCode = code.trim().toUpperCase();
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('reservation_code', cleanCode)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        toast({ title: t('auth.errorRegisterTitle'), description: t('reserve.codePlaceholder'), variant: 'destructive' });
        setLoading(false);
        return;
      }

      if (data.reservation_date) {
        toast({ title: t('appointments.status.shipped'), description: t('reserve.successDesc'), variant: 'destructive' });
        setLoading(false);
        return;
      }

      setOrder(data);
      
      // Fetch saved address if user is logged in
      if (user) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('saved_address, saved_neighborhood, saved_zip_code, saved_maps_url')
          .eq('id', user.id)
          .maybeSingle();
        
        if (profile && profile.saved_address) {
          setSavedProfileData(profile);
        }
      }
      
      setStep(2);
    } catch (err) {
      console.error(err);
      toast({ title: t('ai.error'), variant: 'destructive' });
    }
    setLoading(false);
  };

  const handleUseSavedAddress = () => {
    if (!savedProfileData) return;
    setAddress(savedProfileData.saved_address || '');
    setNeighborhood(savedProfileData.saved_neighborhood || '');
    setZipCode(savedProfileData.saved_zip_code || '');
    setMapsUrl(savedProfileData.saved_maps_url || '');
    toast({ title: t('profile.success'), description: t('profile.savedAddress') });
  };

  const getAvailableTimes = (date: Date) => {
    const times = [];
    for (let i = 10; i <= 20; i++) times.push(`${i}:00`);
    return times;
  };

  const handleReserve = async () => {
    if (!selectedDate || !selectedTime || !order) return;
    
    // Validation for Home service
    if (locationType === 'domicilio') {
      if (!address || !neighborhood || !zipCode || !mapsUrl) {
        toast({ title: t('profile.error'), description: t('reserve.detailsDesc'), variant: 'destructive' });
        return;
      }
      if (!isGoogleMapsUrl(mapsUrl)) {
        toast({ title: t('profile.error'), description: t('reserve.mapsHelp'), variant: 'destructive' });
        return;
      }
    }

    setLoading(true);
    try {
      const [hours, minutes] = selectedTime.split(':').map(Number);
      const localDate = new Date(selectedDate);
      localDate.setHours(hours, minutes || 0, 0, 0);
      const dateTimeString = localDate.toISOString();

      const reservationData = {
        order_id: order.id,
        reservation_date: dateTimeString,
        location_type: locationType,
        address: locationType === 'domicilio' ? `${address}, ${neighborhood}, CP ${zipCode}` : 'Local Bonanza',
        google_maps_url: locationType === 'domicilio' ? mapsUrl : null,
        num_people: parseInt(numPeople),
        gated_community_notes: hasGatedCommunity ? 'Tiene caseta/seguridad' : null,
      };

      // Update the order
      await supabase.from('orders').update({ 
        reservation_date: dateTimeString, 
        status: 'scheduled' 
      }).eq('id', order.id);
      
      // Create reservation record
      await supabase.from('reservations').insert(reservationData);

      // Save address if requested
      if (shouldSaveAddress && user) {
        await supabase.from('user_profiles').upsert({
          id: user.id,
          saved_address: address,
          saved_neighborhood: neighborhood,
          saved_zip_code: zipCode,
          saved_maps_url: mapsUrl,
          updated_at: new Date().toISOString(),
        });
      }

      setStep(5);
    } catch (err) {
      console.error(err);
      toast({ title: t('profile.error'), variant: 'destructive' });
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#fdfdfd]">
      <Header />
      <div className="flex-1 w-full bg-[#f8faf9] relative z-10 pt-24 pb-12 px-4 shadow-[0_50px_100px_-50px_rgba(0,0,0,0.1)] flex items-center justify-center overflow-hidden">
        
        {/* Background Decorative Element */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full pointer-events-none opacity-20">
          <div className="absolute top-20 left-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse pointer-events-none" />
        </div>

        <div className="w-full max-w-xl mx-auto relative z-20">
          
          {/* STEP 1: VERIFY CODE */}
          {step === 1 && (
            <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
              <CardHeader className="text-center space-y-4 pb-10 pt-12 bg-primary/5">
                <div className="mx-auto w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg animate-bounce">
                  <CalendarIcon className="w-10 h-10 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary mb-2">{t('reserve.subtitle')}</p>
                  <CardTitle className="font-headline text-4xl">{t('reserve.title')}</CardTitle>
                  <CardDescription className="text-gray-500 max-w-xs mx-auto mt-3">
                    {t('reserve.codeDesc')}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-10">
                <form onSubmit={handleVerifyCode} className="space-y-8">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 ml-1">{t('reserve.codePlaceholder')}</Label>
                    <Input 
                      placeholder="BNZ-XXXXXX" 
                      value={code} 
                      onChange={(e) => setCode(e.target.value)}
                      className="text-center text-2xl h-20 tracking-[0.25em] uppercase font-bold rounded-2xl border-2 border-primary/10 focus:border-primary/40 bg-secondary/5"
                      required
                    />
                  </div>
                  <HoverBorderGradient
                    as="button"
                    type="submit"
                    disabled={loading}
                    containerClassName="rounded-2xl w-full h-16"
                    className="text-base shadow-xl"
                    style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
                  >
                    {loading ? t('reserve.verifying') : 'Verificar Cita'}
                  </HoverBorderGradient>
                </form>
              </CardContent>
            </Card>
          )}

          {/* STEP 2: LOCATION SELECTION */}
          {step === 2 && (
            <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden animate-in fade-in slide-in-from-right-8 duration-500">
              <CardHeader className="text-center space-y-4 pb-10 pt-12 bg-primary/5">
                <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary mb-1">PROCESO DE RESERVA</p>
                <CardTitle className="font-headline text-3xl">{t('reserve.locationTitle')}</CardTitle>
                <CardDescription className="max-w-xs mx-auto">{t('reserve.locationDesc')}</CardDescription>
              </CardHeader>
              <CardContent className="p-10 space-y-6">
                <div 
                  onClick={() => setLocationType('local')}
                  className={`p-6 rounded-3xl border-2 transition-all cursor-pointer flex items-center space-x-6 ${locationType === 'local' ? 'border-primary bg-primary/5 shadow-md' : 'border-gray-100 opacity-60 hover:opacity-100 hover:border-primary/20'}`}
                >
                  <div className={`p-4 rounded-2xl ${locationType === 'local' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>
                    <MapPin className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{t('reserve.optionLocal')}</h3>
                    <p className="text-sm text-gray-500">{t('reserve.optionLocalDesc')}</p>
                  </div>
                </div>

                <div 
                  onClick={() => setLocationType('domicilio')}
                  className={`p-6 rounded-3xl border-2 transition-all cursor-pointer flex items-center space-x-6 relative ${locationType === 'domicilio' ? 'border-primary bg-primary/5 shadow-md' : 'border-gray-100 opacity-60 hover:opacity-100 hover:border-primary/20'}`}
                >
                  <div className={`p-4 rounded-2xl ${locationType === 'domicilio' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>
                    <Home className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{t('reserve.optionHome')}</h3>
                    <p className="text-sm text-gray-500">{t('reserve.optionHomeDesc')}</p>
                    <div className="mt-2 inline-flex items-center text-[10px] bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-bold uppercase tracking-wider">
                      <Info className="w-3 h-3 mr-1" /> Extra $300 MXN / $15 USD
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex space-x-4">
                  <Button variant="outline" className="flex-1 h-14 rounded-2xl" onClick={() => setStep(1)}>
                    <ChevronLeft className="w-4 h-4 mr-2" /> {t('reserve.back')}
                  </Button>
                  <Button className="flex-2 h-14 btn-primary rounded-2xl px-8" onClick={() => setStep(3)}>
                    {t('reserve.next')} <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* STEP 3: DETAILS FORM */}
          {step === 3 && (
            <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden animate-in fade-in slide-in-from-right-8 duration-500">
              <CardHeader className="text-center space-y-2 pb-8 pt-12 bg-primary/5">
                <CardTitle className="font-headline text-3xl">{t('reserve.detailsTitle')}</CardTitle>
                <CardDescription>{t('reserve.detailsDesc')}</CardDescription>
              </CardHeader>
              <CardContent className="p-10 space-y-6">
                
                {locationType === 'domicilio' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                    {/* Saved Address Button */}
                    {savedProfileData && (
                      <Button 
                        variant="secondary" 
                        onClick={handleUseSavedAddress}
                        className="w-full h-12 rounded-2xl bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 font-bold text-xs uppercase tracking-widest mb-4 transition-all"
                      >
                        <MapPin className="w-4 h-4 mr-2" />
                        {t('profile.useSavedAddress')}
                      </Button>
                    )}

                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 ml-1">{t('reserve.addressLabel')}</Label>
                      <Input value={address} onChange={e => setAddress(e.target.value)} placeholder={t('reserve.addressPlaceholder')} className="h-14 rounded-2xl bg-secondary/5 border-transparent focus:border-primary/20" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 ml-1">{t('reserve.coloniaLabel')}</Label>
                        <Input value={neighborhood} onChange={e => setNeighborhood(e.target.value)} className="h-14 rounded-2xl bg-secondary/5 border-transparent focus:border-primary/20" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 ml-1">{t('reserve.cpLabel')}</Label>
                        <Input value={zipCode} onChange={e => setZipCode(e.target.value)} className="h-14 rounded-2xl bg-secondary/5 border-transparent focus:border-primary/20" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 ml-1">{t('reserve.mapsLabel')}</Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="p-1 cursor-pointer text-primary hover:bg-primary/10 rounded-full transition-colors">
                                <HelpCircle className="w-4 h-4 text-primary" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="bg-gray-900 text-white p-3 rounded-xl max-w-[220px] text-xs">
                              <p>{t('reserve.mapsHelp')}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input value={mapsUrl} onChange={e => setMapsUrl(e.target.value)} placeholder={t('reserve.mapsPlaceholder')} className="h-14 rounded-2xl bg-secondary/5 border-transparent focus:border-primary/20" />
                    </div>
                    <div className="flex items-start space-x-3 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                      <Checkbox id="caseta" checked={hasGatedCommunity} onCheckedChange={(val) => setHasGatedCommunity(!!val)} className="mt-1 border-amber-300 data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600" />
                      <Label htmlFor="caseta" className="text-xs text-amber-800 leading-relaxed cursor-pointer font-medium">
                        {t('reserve.gatedLabel')}
                      </Label>
                    </div>

                    {/* Save for future checkbox */}
                    {user && (
                      <div className="flex items-center space-x-3 p-4 bg-secondary/10 rounded-2xl border border-gray-100 mt-2">
                        <Checkbox id="save-address" checked={shouldSaveAddress} onCheckedChange={(val) => setShouldSaveAddress(!!val)} className="border-gray-300" />
                        <Label htmlFor="save-address" className="text-xs text-gray-700 leading-relaxed cursor-pointer">
                          {t('profile.saveForFuture')}
                        </Label>
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 ml-1">{t('reserve.peopleLabel')}</Label>
                  <div className="flex items-center space-x-4">
                    <Users className="w-5 h-5 text-gray-400" />
                    <Input 
                      type="number" 
                      min="1" 
                      max="10" 
                      value={numPeople} 
                      onChange={e => setNumPeople(e.target.value)} 
                      className="h-14 rounded-2xl bg-secondary/5 border-transparent focus:border-primary/20 w-32 text-center text-lg font-bold" 
                    />
                  </div>
                </div>

                <div className="pt-4 flex space-x-4">
                  <Button variant="outline" className="flex-1 h-14 rounded-2xl" onClick={() => setStep(2)}>
                    <ChevronLeft className="w-4 h-4 mr-2" /> {t('reserve.back')}
                  </Button>
                  <Button 
                    className="flex-2 h-14 btn-primary rounded-2xl px-8" 
                    onClick={() => {
                        if (locationType === 'domicilio' && (!address || !neighborhood || !zipCode || !mapsUrl)) {
                          toast({ title: t('profile.error'), description: 'Por favor completa todos los campos de dirección.', variant: 'destructive' });
                          return;
                        }
                        if (locationType === 'domicilio' && !isGoogleMapsUrl(mapsUrl)) {
                          toast({ title: t('profile.error'), description: t('reserve.mapsHelp'), variant: 'destructive' });
                          return;
                        }
                        setStep(4);
                    }}
                  >
                    {t('reserve.next')} <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* STEP 4: CALENDAR & TIME */}
          {step === 4 && (
            <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden animate-in fade-in slide-in-from-right-8 duration-500">
              <CardHeader className="text-center space-y-2 bg-primary/5 border-b border-primary/10 pt-10">
                <CardTitle className="font-headline text-3xl tracking-wide">{t('reserve.timeTitle')}</CardTitle>
                <CardDescription className="max-w-xs mx-auto">
                  {t('reserve.timeDesc')}
                  <br/><strong className="text-primary mt-2 block font-sans text-sm tracking-widest uppercase">Lun - Dom: 10:00 AM – 8:00 PM</strong>
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="bg-secondary/10 rounded-[2rem] p-6 flex justify-center shadow-inner">
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
                  <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
                    <h3 className="text-lg font-bold text-center text-gray-800 font-headline tracking-wide border-b border-gray-100 pb-3">
                      {format(selectedDate, "EEEE, dd 'de' MMMM", { locale: es })}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {getAvailableTimes(selectedDate).map(time => (
                        <div 
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`
                            py-4 px-2 rounded-2xl text-center font-bold text-sm cursor-pointer transition-all border-2
                            ${selectedTime === time 
                              ? 'bg-primary text-white border-primary shadow-lg scale-105' 
                              : 'bg-white text-gray-700 border-gray-100 hover:border-primary/30 hover:bg-primary/5 shadow-sm'}
                          `}
                        >
                          {time}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex space-x-4 pt-4">
                  <Button variant="outline" className="flex-1 h-14 rounded-2xl" onClick={() => setStep(3)}>
                    <ChevronLeft className="w-4 h-4 mr-2" /> {t('reserve.back')}
                  </Button>
                  <Button 
                    onClick={handleReserve} 
                    disabled={!selectedTime || loading} 
                    className="flex-2 h-14 btn-primary rounded-2xl px-10 text-lg shadow-xl"
                  >
                    {loading ? <Clock className="w-5 h-5 mr-2 animate-spin" /> : <Clock className="w-5 h-5 mr-2" />}
                    {loading ? t('reserve.booking') : t('reserve.confirmButton')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* STEP 5: SUCCESS */}
          {step === 5 && (
            <Card className="border-none shadow-[0_30px_100px_rgba(0,0,0,0.15)] rounded-[3rem] bg-white overflow-hidden text-center animate-in zoom-in-90 duration-700">
              <CardContent className="p-16 space-y-8">
                <div className="w-32 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                  <div className="absolute inset-0 bg-green-500/10 rounded-full animate-ping" />
                  <CheckCircle className="w-16 h-16 text-green-500 relative z-10" />
                </div>
                <div className="space-y-3">
                  <h2 className="text-4xl font-headline text-gray-900">{t('reserve.successTitle')}</h2>
                  <p className="text-gray-500 leading-relaxed max-w-sm mx-auto text-lg">
                    {t('reserve.successDesc')}
                  </p>
                </div>
                
                <div className="pt-6 space-y-4">
                  <div className="p-6 bg-secondary/5 rounded-3xl border border-gray-100 mb-8 inline-block w-full">
                    <p className="text-xs uppercase tracking-[0.2em] font-bold text-gray-400 mb-2">UBICACIÓN SELECCIONADA</p>
                    <p className="text-xl font-bold text-gray-800">{locationType === 'local' ? t('reserve.optionLocal') : t('reserve.optionHome')}</p>
                    {locationType === 'domicilio' && <p className="text-sm text-gray-500 mt-1">{address}</p>}
                  </div>

                  <Button className="rounded-2xl w-full h-14 btn-primary text-lg" onClick={() => window.location.href = '/perfil'}>
                    {t('reserve.viewProfile')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

        </div>
      </div>
      <Footer />
      
      <style jsx global>{`
        .btn-primary {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border: none;
        }
        .btn-primary:hover {
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
          transform: translateY(-2px);
        }
      `}</style>
    </main>
  );
}
