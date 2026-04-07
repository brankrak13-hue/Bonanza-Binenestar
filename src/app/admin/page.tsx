'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/supabase/client';
import { useAuthContext } from '@/supabase/provider';
import { placeholderImages } from '@/lib/images';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Loader2, 
  Image as ImageIcon, 
  LayoutDashboard, 
  LogOut, 
  Save, 
  ExternalLink, 
  ShieldAlert, 
  Banknote, 
  Clock,
  CalendarDays
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// List of services for price management
const SERVICES_LIST = [
  { id: 'purification-90', name: 'Purificación Sutil (90 min)', default: 1100 },
  { id: 'purification-60', name: 'Purificación Sutil (60 min)', default: 900 },
  { id: 'fluidity-60', name: 'Fluidez Esencial (60 min)', default: 800 },
  { id: 'fluidity-90', name: 'Fluidez Esencial (90 min)', default: 1000 },
  { id: 'release-90', name: 'Liberación de Tensión (90 min)', default: 1100 },
  { id: 'release-60', name: 'Liberación de Tensión (60 min)', default: 900 },
  { id: 'awakening-60', name: 'Despertar Vital (60 min)', default: 800 },
  { id: 'awakening-90', name: 'Despertar Vital (90 min)', default: 1000 },
  { id: 'reset-60', name: 'Re-inicia tu Mente (60 min)', default: 700 },
  { id: 'sculpt-60', name: 'Moldea tu figura (60 min)', default: 900 },
];

export default function AdminDashboard() {
  const { user, loading: isUserLoading } = useAuthContext();
  const { t } = useLanguage();
  const { toast } = useToast();
  const router = useRouter();

  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminChecking, setIsAdminChecking] = useState(true);
  const [imageOverrides, setImageOverrides] = useState<any[]>([]);
  const [priceOverrides, setPriceOverrides] = useState<any[]>([]);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [globalOrders, setGlobalOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    if (isUserLoading) return;
    if (!user) { setIsAdminChecking(false); return; }

    const init = async () => {
      // Check admin role
      const { data: adminData } = await supabase
        .from('admin_roles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
      const admin = !!adminData;
      setIsAdmin(admin);
      setIsAdminChecking(false);

      if (!admin) return;

      // Fetch site images & prices
      const { data: imgData } = await supabase.from('site_images').select('id, url');
      const { data: priceData } = await supabase.from('site_prices').select('id, price');
      if (imgData) setImageOverrides(imgData);
      if (priceData) setPriceOverrides(priceData);

      // Fetch all orders (Stripe purchases)
      setOrdersLoading(true);
      const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .order('order_date', { ascending: false });
      
      // Fetch test reservations (PRUEBA codes)
      const { data: testReservations } = await supabase
        .from('reservations')
        .select('*')
        .eq('is_dummy', true)
        .order('reservation_date', { ascending: false });

      // Combine: real orders first, then test reservations as pseudo-orders
      const testAsOrders = (testReservations || []).map((r: any) => ({
        id: r.id,
        customer_email: '⚠️ Reserva de Prueba',
        reservation_date: r.reservation_date,
        order_date: r.reservation_date,
        total_amount: 0,
        reservation_code: 'PRUEBA',
        status: 'test',
      }));

      setGlobalOrders([...(orders || []), ...testAsOrders]);
      setOrdersLoading(false);
    };
    init();
  }, [user, isUserLoading]);

  const handleUpdateImage = async (id: string, url: string) => {
    if (!url.trim()) return;
    setSavingId(id);
    try {
      await supabase.from('site_images').upsert({ id, url, updated_by: user?.email, updated_at: new Date().toISOString() });
      toast({ title: "Imagen actualizada con éxito" });
    } catch {
      toast({ variant: "destructive", title: "Error al guardar" });
    } finally {
      setSavingId(null);
    }
  };

  const handleUpdatePrice = async (id: string, price: string) => {
    const numericPrice = Number(price);
    if (isNaN(numericPrice)) {
      toast({ variant: "destructive", title: "Precio inválido" });
      return;
    }
    setSavingId(id);
    try {
      await supabase.from('site_prices').upsert({ id, price: numericPrice, updated_by: user?.email, updated_at: new Date().toISOString() });
      toast({ title: "Precio actualizado con éxito" });
    } catch {
      toast({ variant: "destructive", title: "Error al guardar precio" });
    } finally {
      setSavingId(null);
    }
  };

  if (isUserLoading || isAdminChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="max-w-screen-md mx-auto px-4 py-40 text-center">
          <LayoutDashboard className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-4">Acceso Denegado</h1>
          <p className="text-muted-foreground mb-8">Esta área es solo para administradores de Bonanza.</p>
          <Button onClick={() => router.push('/admin/acceso')} className="btn-primary">
            Ir a Acceso
          </Button>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-secondary/10">
      <Header />
      <div className="max-w-screen-xl mx-auto px-4 py-20">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <div>
            <p className="text-sm tracking-widest uppercase text-primary font-bold mb-2">{t('admin.subtitle')}</p>
            <h1 className="text-4xl md:text-5xl font-bold font-headline">{t('admin.title')}</h1>
          </div>
          <Button variant="outline" className="rounded-full px-8 h-12" onClick={() => router.push('/')}>
            <LogOut className="w-4 h-4 mr-2" />
            {t('admin.logout')}
          </Button>
        </div>

        <Tabs defaultValue="images" className="w-full">
          <TabsList className="grid w-full max-w-2xl grid-cols-3 mb-12 h-14 p-1 rounded-full bg-white/50 backdrop-blur shadow-sm border border-white/40">
            <TabsTrigger value="images" className="rounded-full font-bold tracking-widest text-xs uppercase data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
              <ImageIcon className="w-4 h-4 mr-2" />
              {t('admin.imagesTab')}
            </TabsTrigger>
            <TabsTrigger value="prices" className="rounded-full font-bold tracking-widest text-xs uppercase data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
              <Banknote className="w-4 h-4 mr-2" />
              {t('admin.pricesTab')}
            </TabsTrigger>
            <TabsTrigger value="orders" className="rounded-full font-bold tracking-widest text-xs uppercase data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
              <CalendarDays className="w-4 h-4 mr-2" />
              RESERVAS
            </TabsTrigger>
          </TabsList>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <TabsContent value="images" className="m-0 animate-in fade-in slide-in-from-left-4 duration-500">
                <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
                  <CardHeader className="bg-primary/5 pb-8">
                    <div className="flex items-center gap-3">
                      <ImageIcon className="w-6 h-6 text-primary" />
                      <CardTitle>{t('admin.imagesTitle')}</CardTitle>
                    </div>
                    <CardDescription>{t('admin.imagesDesc')}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-8 space-y-12">
                    {placeholderImages.map((img) => {
                      const override = imageOverrides.find(o => o.id === img.id);
                      const currentUrl = override?.url || img.imageUrl;
                      return (
                        <div key={img.id} className="group">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-lg text-gray-800 capitalize tracking-tight">{img.id.replace(/-/g, ' ')}</h3>
                            <a href={currentUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline text-xs flex items-center gap-1 font-bold">
                              <ExternalLink className="w-3 h-3" />
                              Ver original
                            </a>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-start">
                            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-inner bg-secondary/20">
                              <Image src={currentUrl} alt={img.description} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                            </div>
                            <div className="sm:col-span-2 space-y-4">
                              <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">{t('admin.imageLabel')}</label>
                                <Input defaultValue={currentUrl} placeholder="https://..." id={`input-img-${img.id}`} className="bg-secondary/10 border-transparent focus:border-primary/30 h-12 rounded-xl" />
                              </div>
                              <Button className="w-full btn-primary h-12 rounded-xl text-xs" disabled={savingId === img.id} onClick={() => { const input = document.getElementById(`input-img-${img.id}`) as HTMLInputElement; if (input) handleUpdateImage(img.id, input.value); }}>
                                {savingId === img.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                {t('admin.save')}
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="prices" className="m-0 animate-in fade-in slide-in-from-left-4 duration-500">
                <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
                  <CardHeader className="bg-primary/5 pb-8">
                    <div className="flex items-center gap-3">
                      <Banknote className="w-6 h-6 text-primary" />
                      <CardTitle>{t('admin.pricesTitle')}</CardTitle>
                    </div>
                    <CardDescription>{t('admin.pricesDesc')}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-8 space-y-8">
                    {SERVICES_LIST.map((service) => {
                      const override = priceOverrides.find(o => o.id === service.id);
                      const currentPrice = override?.price !== undefined ? override.price : service.default;
                      return (
                        <div key={service.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-3xl bg-secondary/10 border border-transparent hover:border-primary/20 transition-all gap-6">
                          <div className="flex items-center gap-4">
                            <div className="bg-white p-3 rounded-full shadow-sm"><Clock className="w-5 h-5 text-primary" /></div>
                            <div>
                              <h3 className="font-bold text-gray-800 tracking-tight">{service.name}</h3>
                              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">ID: {service.id}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">$</span>
                              <Input type="number" defaultValue={currentPrice} id={`input-price-${service.id}`} className="w-32 bg-white border-transparent focus:border-primary/30 h-12 rounded-xl pl-8 font-bold text-primary" />
                            </div>
                            <Button size="icon" className="rounded-xl h-12 w-12 btn-primary" disabled={savingId === service.id} onClick={() => { const input = document.getElementById(`input-price-${service.id}`) as HTMLInputElement; if (input) handleUpdatePrice(service.id, input.value); }}>
                              {savingId === service.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="orders" className="m-0 animate-in fade-in slide-in-from-left-4 duration-500">
                <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
                  <CardHeader className="bg-primary/5 pb-8">
                    <div className="flex items-center gap-3">
                      <CalendarDays className="w-6 h-6 text-primary" />
                      <CardTitle>Reservas y Pedidos</CardTitle>
                    </div>
                    <CardDescription>Visualiza todos los paquetes comprados y su estado de agenda.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-8 space-y-6">
                    {ordersLoading ? (
                      <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
                    ) : globalOrders.length === 0 ? (
                      <div className="text-center py-12 text-gray-500 font-bold">No hay ninguna compra registrada todavía.</div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {globalOrders.map((o) => (
                          <div key={o.id} className="bg-secondary/10 p-5 rounded-3xl border border-transparent hover:border-primary/20 transition-all">
                            <div className="flex justify-between items-start mb-2">
                              <p className="font-bold text-gray-800 text-sm truncate">{o.customer_email}</p>
                              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${o.reservation_date ? 'bg-primary/20 text-primary' : 'bg-gray-200 text-gray-500'}`}>
                                {o.reservation_date ? 'Agendado' : 'Por Agendar'}
                              </span>
                            </div>
                            <p className="text-2xl font-bold font-headline mb-1">${o.total_amount} MXN</p>
                            <div className="space-y-1 mb-4 mt-4 text-xs font-mono">
                              <p className="text-gray-500">Código: <span className="font-bold text-gray-800 tracking-widest">{o.reservation_code || 'N/A'}</span></p>
                              <p className="text-gray-500">Comprado: {new Date(o.order_date).toLocaleDateString()}</p>
                              {o.reservation_date && (
                                <p className="text-primary font-bold bg-primary/10 p-2 rounded-lg mt-2 text-center w-full block">
                                  Cita: {new Date(o.reservation_date).toLocaleString()}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </div>

            <div className="space-y-8">
              <Card className="border-none shadow-xl rounded-[2.5rem] bg-primary text-white overflow-hidden">
                <CardContent className="p-10 flex flex-col items-center text-center">
                  <ShieldAlert className="w-12 h-12 mb-6 text-white/40" />
                  <h2 className="text-2xl font-bold mb-4 font-headline">Zona de Alta Seguridad</h2>
                  <p className="text-white/70 text-sm leading-relaxed mb-8 italic">
                    "Cualquier cambio aquí se reflejará instantáneamente en el oráculo digital y en todas las dimensiones de Bonanza."
                  </p>
                  <div className="w-full bg-white/10 rounded-2xl p-6 text-xs text-left">
                    <p className="font-bold uppercase tracking-widest mb-2 text-white/50">Tu Identidad:</p>
                    <p className="font-mono">{user.email}</p>
                    <p className="font-mono mt-1 text-[10px] text-white/30">ID: {user.id}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </Tabs>
      </div>
      <Footer />
    </main>
  );
}
