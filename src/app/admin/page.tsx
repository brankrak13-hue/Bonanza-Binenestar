
'use client';

import { useState } from 'react';
import { useUser, useFirestore, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import { useLanguage } from '@/context/LanguageContext';
import { collection, doc, setDoc } from 'firebase/firestore';
import { placeholderImages } from '@/lib/images';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Image as ImageIcon, LayoutDashboard, LogOut, Save, ExternalLink } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

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
          <Button asChild className="btn-primary">
              <button onClick={() => router.push('/admin/acceso')}>Ir a Acceso</button>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                  <div key={img.id} className="group animate-in fade-in slide-in-from-bottom-4 duration-500">
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
                        />
                      </div>
                      <div className="sm:col-span-2 space-y-4">
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">{t('admin.imageLabel')}</label>
                          <Input 
                            defaultValue={currentUrl} 
                            placeholder="https://..."
                            onBlur={(e) => handleUpdateImage(img.id, e.target.value)}
                            className="bg-secondary/10 border-transparent focus:border-primary/30 h-12 rounded-xl"
                          />
                        </div>
                        <Button 
                          className="w-full btn-primary h-12 rounded-xl text-xs" 
                          disabled={savingId === img.id}
                          onClick={() => {
                            const input = document.querySelector(`input[defaultValue="${currentUrl}"]`) as HTMLInputElement;
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

              {/* Aquí podrías añadir un registro de actividades o gestión de usuarios en el futuro */}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
