'use client';

import { useState } from 'react';
import { 
  useUser, 
  useFirestore, 
  useDoc, 
  useCollection, 
  useMemoFirebase,
  collection,
  doc,
  setDoc
} from '@/firebase';
import { useLanguage } from '@/context/LanguageContext';
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
  Clock 
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

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
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const { t } = useLanguage();
  const { toast } = useToast();
  const router = useRouter();

  const adminRef = useMemoFirebase(() => (user && db ? doc(db, 'roles_admin', user.uid) : null), [user, db]);
  const { data: adminRole, isLoading: isAdminChecking } = useDoc(adminRef);

  const imagesCollectionRef = useMemoFirebase(() => (db ? collection(db, 'siteSettings', 'content', 'images') : null), [db]);
  const { data: imageOverrides } = useCollection(imagesCollectionRef);

  const pricesCollectionRef = useMemoFirebase(() => (db ? collection(db, 'siteSettings', 'content', 'prices') : null), [db]);
  const { data: priceOverrides } = useCollection(pricesCollectionRef);

  const [savingId, setSavingId] = useState<string | null>(null);

  const handleUpdateImage = async (id: string, url: string) => {
    if (!db || !url.trim()) return;
    setSavingId(id);
    try {
      await setDoc(doc(db, 'siteSettings', 'content', 'images', id), {
        url,
        updatedAt: new Date().toISOString(),
        updatedBy: user?.email
      });
      toast({ title: "Imagen actualizada con éxito" });
    } catch (err) {
      toast({ variant: "destructive", title: "Error al guardar" });
    } finally {
      setSavingId(null);
    }
  };

  const handleUpdatePrice = async (id: string, price: string) => {
    if (!db || !price.trim()) return;
    const numericPrice = Number(price);
    if (isNaN(numericPrice)) {
      toast({ variant: "destructive", title: "Precio inválido" });
      return;
    }
    
    setSavingId(id);
    try {
      await setDoc(doc(db, 'siteSettings', 'content', 'prices', id), {
        price: numericPrice,
        updatedAt: new Date().toISOString(),
        updatedBy: user?.email
      });
      toast({ title: "Precio actualizado con éxito" });
    } catch (err) {
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

  if (!user || !adminRole) {
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
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-12 h-14 p-1 rounded-full bg-white/50 backdrop-blur shadow-sm border border-white/40">
            <TabsTrigger value="images" className="rounded-full font-bold tracking-widest text-xs uppercase data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
              <ImageIcon className="w-4 h-4 mr-2" />
              {t('admin.imagesTab')}
            </TabsTrigger>
            <TabsTrigger value="prices" className="rounded-full font-bold tracking-widest text-xs uppercase data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
              <Banknote className="w-4 h-4 mr-2" />
              {t('admin.pricesTab')}
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
                      const override = imageOverrides?.find(o => o.id === img.id);
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
                              <Image 
                                src={currentUrl} 
                                alt={img.description} 
                                fill 
                                className="object-cover" 
                                sizes="(max-width: 768px) 100vw, 33vw"
                              />
                            </div>
                            <div className="sm:col-span-2 space-y-4">
                              <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">{t('admin.imageLabel')}</label>
                                <Input 
                                  defaultValue={currentUrl} 
                                  placeholder="https://..."
                                  id={`input-img-${img.id}`}
                                  className="bg-secondary/10 border-transparent focus:border-primary/30 h-12 rounded-xl"
                                />
                              </div>
                              <Button 
                                className="w-full btn-primary h-12 rounded-xl text-xs" 
                                disabled={savingId === img.id}
                                onClick={() => {
                                  const input = document.getElementById(`input-img-${img.id}`) as HTMLInputElement;
                                  if (input) handleUpdateImage(img.id, input.value);
                                }}
                              >
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
                      const override = priceOverrides?.find(o => o.id === service.id);
                      const currentPrice = override?.price !== undefined ? override.price : service.default;

                      return (
                        <div key={service.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-3xl bg-secondary/10 border border-transparent hover:border-primary/20 transition-all gap-6">
                          <div className="flex items-center gap-4">
                            <div className="bg-white p-3 rounded-full shadow-sm">
                              <Clock className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-800 tracking-tight">{service.name}</h3>
                              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">ID: {service.id}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">$</span>
                              <Input 
                                type="number"
                                defaultValue={currentPrice}
                                id={`input-price-${service.id}`}
                                className="w-32 bg-white border-transparent focus:border-primary/30 h-12 rounded-xl pl-8 font-bold text-primary"
                              />
                            </div>
                            <Button 
                              size="icon"
                              className="rounded-xl h-12 w-12 btn-primary p-0 flex items-center justify-center shrink-0" 
                              disabled={savingId === service.id}
                              onClick={() => {
                                const input = document.getElementById(`input-price-${service.id}`) as HTMLInputElement;
                                if (input) handleUpdatePrice(service.id, input.value);
                              }}
                            >
                              {savingId === service.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
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
                        <p className="font-mono mt-1 text-[10px] text-white/30">ID: {user.uid}</p>
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
