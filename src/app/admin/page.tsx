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
  CalendarDays,
  Megaphone,
  Upload
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
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [globalOrders, setGlobalOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  
  // State to track if each image is in 'url' or 'file' mode
  const [imageModes, setImageModes] = useState<Record<string, 'url' | 'file'>>({});

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
      
      if (imgData) {
        setImageOverrides(imgData);
        // Initialize modes based on whether the URL is from Supabase
        const modes: Record<string, 'url' | 'file'> = {};
        imgData.forEach(img => {
            modes[img.id] = img.url.includes('supabase.co') ? 'file' : 'url';
        });
        setImageModes(modes);
      }
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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingId(id);
    try {
      // Create a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${id}-${Date.now()}.${fileExt}`;
      const filePath = `images/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('site-assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('site-assets')
        .getPublicUrl(filePath);

      // Save URL to the database
      await handleUpdateImage(id, publicUrl);
      
      // Update local state to refresh UI immediately
      setImageOverrides(prev => {
        const exist = prev.find(p => p.id === id);
        if (exist) return prev.map(p => p.id === id ? { ...p, url: publicUrl } : p);
        return [...prev, { id, url: publicUrl }];
      });
      
      // Ensure it stays in 'file' mode
      setImageModes(prev => ({ ...prev, [id]: 'file' }));

      toast({ title: t('admin.uploadSuccess') });
    } catch (error) {
      console.error('Error uploading:', error);
      toast({ variant: "destructive", title: "Error al subir imagen" });
    } finally {
      setUploadingId(null);
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
          <TabsList className="grid w-full max-w-2xl grid-cols-4 mb-12 h-14 p-1 rounded-full bg-white/50 backdrop-blur shadow-sm border border-white/40">
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
            <TabsTrigger value="promos" className="rounded-full font-bold tracking-widest text-xs uppercase data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
              <Megaphone className="w-4 h-4 mr-2" />
              {t('admin.promoTab')}
            </TabsTrigger>
          </TabsList>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
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
                      const isSupabase = currentUrl.includes('supabase.co');
                      
                      // Get mode for current image
                      const currentMode = imageModes[img.id] || (isSupabase ? 'file' : 'url');

                      return (
                        <div key={img.id} className="group p-8 rounded-3xl bg-secondary/5 border border-transparent hover:border-primary/10 transition-all">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                            <div>
                                <h3 className="font-bold text-xl text-gray-800 capitalize tracking-tight">{img.id.replace(/-/g, ' ')}</h3>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{isSupabase ? '🔵 Archivo en la Nube' : '🌐 Enlace Externo'}</p>
                            </div>
                            <div className="flex bg-white/60 p-1 rounded-xl border border-gray-200 shadow-inner">
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => setImageModes(prev => ({ ...prev, [img.id]: 'url' }))}
                                    className={`rounded-lg px-4 h-9 text-[10px] font-bold tracking-widest transition-all duration-200 ${currentMode === 'url' ? 'bg-primary text-white shadow-sm scale-105' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    URL
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => setImageModes(prev => ({ ...prev, [img.id]: 'file' }))}
                                    className={`rounded-lg px-4 h-9 text-[10px] font-bold tracking-widest transition-all duration-200 ${currentMode === 'file' ? 'bg-primary text-white shadow-sm scale-105' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    ARCHIVO
                                </Button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                            <div className="md:col-span-4 lg:col-span-3">
                                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-white transform transition-transform group-hover:scale-[1.02]">
                                    <Image src={currentUrl} alt={img.description} fill className="object-cover" unoptimized />
                                </div>
                            </div>

                            <div className="md:col-span-8 lg:col-span-9 space-y-6">
                              <div className="min-h-[100px] flex flex-col justify-center">
                                {currentMode === 'url' ? (
                                    <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <div className="flex items-center justify-between">
                                            <label className="text-[10px] uppercase tracking-widest font-bold text-primary">Nueva URL de Imagen</label>
                                            <a href={currentUrl} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-primary transition-colors">
                                                <ExternalLink className="w-3.5 h-3.5" />
                                            </a>
                                        </div>
                                        <Input 
                                            key={currentUrl} 
                                            defaultValue={currentUrl} 
                                            placeholder="https://..." 
                                            id={`input-img-${img.id}`} 
                                            className="bg-white border-gray-100 focus:border-primary/40 h-11 rounded-xl text-sm font-medium shadow-sm transition-all" 
                                        />
                                    </div>
                                ) : (
                                    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        <div className="flex items-center justify-between">
                                            <label className="text-[10px] uppercase tracking-widest font-bold text-primary">Archivo Protegido</label>
                                            <span className="bg-primary/10 px-2 py-0.5 rounded text-[8px] font-bold text-primary uppercase">Seguro</span>
                                        </div>
                                        <div className="bg-white/80 p-4 rounded-xl border-2 border-dashed border-primary/20 text-xs text-gray-400 font-mono overflow-hidden whitespace-nowrap text-ellipsis flex items-center gap-2">
                                            <ImageIcon className="w-4 h-4 text-primary/40" />
                                            <span>{isSupabase ? currentUrl.split('/').pop()?.substring(0, 40) + '...' : 'No se ha subido archivo'}</span>
                                        </div>
                                    </div>
                                )}
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                {currentMode === 'url' ? (
                                    <Button className="w-full btn-primary h-11 rounded-xl font-bold text-xs shadow-md" disabled={savingId === img.id || uploadingId === img.id} onClick={() => { const input = document.getElementById(`input-img-${img.id}`) as HTMLInputElement; if (input) handleUpdateImage(img.id, input.value); }}>
                                        {savingId === img.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-3.5 h-3.5 mr-2" />}
                                        {t('admin.save')}
                                    </Button>
                                ) : (
                                    <div className="relative w-full">
                                        <input type="file" id={`upload-${img.id}`} accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, img.id)} />
                                        <Button variant="outline" className="w-full h-11 rounded-xl font-bold bg-white hover:bg-gray-50 border-gray-200 shadow-md flex items-center justify-center gap-2 group/btn text-xs" disabled={savingId === img.id || uploadingId === img.id} onClick={() => document.getElementById(`upload-${img.id}`)?.click()}>
                                            {uploadingId === img.id ? <Loader2 className="w-4 h-4 animate-spin text-primary" /> : <Upload className="w-3.5 h-3.5 text-primary transition-transform group-hover/btn:-translate-y-1" />}
                                            {uploadingId === img.id ? t('admin.uploading') : 'SUBIR DE PC'}
                                        </Button>
                                    </div>
                                )}
                              </div>
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
                              <Input type="number" defaultValue={currentPrice} id={`input-price-${service.id}`} className="w-32 bg-white border-transparent focus:border-primary/30 h-10 rounded-xl pl-8 font-bold text-primary" />
                            </div>
                            <Button size="icon" className="rounded-xl h-10 w-10 btn-primary" disabled={savingId === service.id} onClick={() => { const input = document.getElementById(`input-price-${service.id}`) as HTMLInputElement; if (input) handleUpdatePrice(service.id, input.value); }}>
                              {savingId === service.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="promos" className="m-0 animate-in fade-in slide-in-from-left-4 duration-500">
                <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
                  <CardHeader className="bg-primary/5 pb-8">
                    <div className="flex items-center gap-3">
                      <Megaphone className="w-6 h-6 text-primary" />
                      <CardTitle>{t('admin.promoTitle')}</CardTitle>
                    </div>
                    <CardDescription>{t('admin.promoDesc')}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-8 space-y-10">
                    <div className="flex flex-col sm:flex-row items-center justify-between p-8 rounded-3xl bg-secondary/10 border border-transparent hover:border-primary/20 transition-all gap-6">
                      <div className="flex items-center gap-4">
                        <div className="bg-white p-3 rounded-full shadow-sm"><Megaphone className="w-6 h-6 text-primary" /></div>
                        <div>
                          <h3 className="font-bold text-gray-800 tracking-tight">{t('admin.promoActive')}</h3>
                          <p className="text-xs text-gray-500">Activa o desactiva el popup global de promociones</p>
                        </div>
                      </div>
                      
                      <div className="flex bg-white/50 p-1.5 rounded-[1.2rem] border border-gray-200 shadow-sm backdrop-blur-sm">
                        {(() => {
                          const isActive = imageOverrides.find(o => o.id === 'promo-active')?.url === 'true';
                          return (
                            <>
                              <Button 
                                variant="ghost"
                                className={`h-11 px-6 rounded-[0.9rem] font-bold text-[10px] tracking-widest uppercase transition-all duration-300 ${
                                  !isActive 
                                    ? 'bg-red-500 text-white shadow-lg scale-105 hover:bg-red-600' 
                                    : 'text-gray-400 hover:text-gray-600'
                                }`}
                                onClick={() => {
                                  if (isActive) {
                                    handleUpdateImage('promo-active', 'false');
                                    setImageOverrides(prev => prev.map(p => p.id === 'promo-active' ? { ...p, url: 'false' } : p));
                                  }
                                }}
                                disabled={savingId === 'promo-active'}
                              >
                                APAGADO
                              </Button>
                              <Button 
                                variant="ghost"
                                className={`h-11 px-6 rounded-[0.9rem] font-bold text-[10px] tracking-widest uppercase transition-all duration-300 ${
                                  isActive 
                                    ? 'bg-green-500 text-white shadow-lg scale-105 hover:bg-green-600' 
                                    : 'text-gray-400 hover:text-gray-600'
                                }`}
                                onClick={() => {
                                  if (!isActive) {
                                    handleUpdateImage('promo-active', 'true');
                                    setImageOverrides(prev => prev.map(p => p.id === 'promo-active' ? { ...p, url: 'true' } : p));
                                  }
                                }}
                                disabled={savingId === 'promo-active'}
                              >
                                ACTIVADO
                              </Button>
                            </>
                          );
                        })()}
                      </div>
                    </div>

                    <div className="space-y-6 pt-6 border-t border-gray-100">
                      <div className="flex items-center gap-3 mb-2">
                        <ImageIcon className="w-5 h-5 text-primary" />
                        <h3 className="font-bold text-gray-800 tracking-tight">{t('admin.promoImage')}</h3>
                      </div>
                      
                      {(() => {
                        const promoImg = imageOverrides.find(o => o.id === 'promo-popup');
                        const currentUrl = promoImg?.url || 'https://images.unsplash.com/photo-1490750967868-88aa4486c946';
                        const isSupabase = currentUrl.includes('supabase.co');
                        return (
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-start p-6 rounded-3xl bg-secondary/5 border border-primary/10">
                            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-inner bg-secondary/20 border-2 border-white">
                                <Image src={currentUrl} alt="Promo" fill className="object-cover" unoptimized />
                            </div>
                            <div className="sm:col-span-2 space-y-4">
                              <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-primary">{isSupabase ? 'Archivo Subido a PC' : 'URL del Popup'}</label>
                                <Input key={currentUrl} defaultValue={currentUrl} placeholder="https://..." id={`input-img-promo-popup`} className="bg-white border-transparent focus:border-primary/30 h-10 rounded-xl shadow-sm text-xs" />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <Button className="w-full btn-primary h-10 rounded-xl font-bold shadow-md text-xs" disabled={savingId === 'promo-popup' || uploadingId === 'promo-popup'} onClick={() => { const input = document.getElementById(`input-img-promo-popup`) as HTMLInputElement; if (input) handleUpdateImage('promo-popup', input.value); }}>
                                  {savingId === 'promo-popup' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5 mr-2" />}
                                  {t('admin.save')}
                                </Button>
                                
                                <div className="relative">
                                  <input type="file" id="upload-promo-popup" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'promo-popup')} />
                                  <Button variant="outline" className="w-full h-10 rounded-xl font-bold shadow-sm bg-white hover:bg-gray-50 border-gray-200 text-xs" disabled={savingId === 'promo-popup' || uploadingId === 'promo-popup'} onClick={() => document.getElementById('upload-promo-popup')?.click()}>
                                    {uploadingId === 'promo-popup' ? <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" /> : <Upload className="w-3.5 h-3.5 mr-2 text-primary" />}
                                    {uploadingId === 'promo-popup' ? t('admin.uploading') : 'SUBIR DE PC'}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
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
