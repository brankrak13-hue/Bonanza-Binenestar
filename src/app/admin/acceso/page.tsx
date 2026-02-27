'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, setDoc } from 'firebase/firestore';
import { useUser, useFirestore } from '@/firebase';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ShieldAlert, Loader2, Key, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AdminAccessPage() {
  const { user } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [secretKey, setSecretKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleValidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !db) {
        toast({ variant: "destructive", title: "Error", description: "Debes iniciar sesión primero." });
        return;
    }

    setIsLoading(true);

    // En producción, esto se valida en el cliente contra la llave maestra.
    // La llave real se define en .env, por defecto usamos una de respaldo.
    const masterKey = process.env.NEXT_PUBLIC_ADMIN_ACCESS_KEY || 'Bonanza_Master_Secret_2024_Security_Key_Long_Password_12345';

    if (secretKey === masterKey) {
      try {
        await setDoc(doc(db, 'roles_admin', user.uid), {
          grantedAt: new Date().toISOString(),
          email: user.email,
          setupBy: 'Master Key System'
        });
        
        setIsSuccess(true);
        toast({ title: t('admin.accessSuccess') });
        
        setTimeout(() => {
          router.push('/admin');
        }, 2000);
      } catch (err: any) {
        toast({ 
          variant: "destructive", 
          title: "Error de Permisos", 
          description: "Asegúrate de haber iniciado sesión correctamente." 
        });
      }
    } else {
      toast({ variant: "destructive", title: t('admin.accessError') });
    }
    setIsLoading(false);
  };

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="max-w-screen-md mx-auto px-4 py-32 flex flex-col items-center">
        <Card className="w-full border-none shadow-2xl rounded-[3rem] overflow-hidden glass-card">
          <CardHeader className="text-center pt-12 pb-8 bg-primary/5">
            <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-6">
              {isSuccess ? (
                <CheckCircle2 className="w-10 h-10 text-green-500 animate-bounce" />
              ) : (
                <ShieldAlert className="w-10 h-10 text-primary" />
              )}
            </div>
            <CardTitle className="text-3xl font-headline">
              {isSuccess ? "Acceso Autorizado" : t('admin.accessTitle')}
            </CardTitle>
            <CardDescription className="max-w-xs mx-auto">
              {isSuccess ? "Redirigiendo al panel de control..." : t('admin.accessDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-10">
            {!isSuccess ? (
              <form onSubmit={handleValidate} className="space-y-6">
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="password"
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    placeholder={t('admin.accessPlaceholder')}
                    className="h-16 pl-12 rounded-2xl bg-secondary/20 border-transparent focus:border-primary/30 text-lg"
                    required
                  />
                </div>
                <Button type="submit" className="w-full h-16 btn-primary rounded-2xl" disabled={isLoading || !user}>
                  {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : t('admin.accessButton')}
                </Button>
                {!user && (
                  <div className="text-center p-4 bg-destructive/5 rounded-xl border border-destructive/10">
                    <p className="text-destructive font-bold text-xs uppercase tracking-widest">
                      Debes iniciar sesión para activar el modo admin
                    </p>
                  </div>
                )}
              </form>
            ) : (
              <div className="text-center py-10">
                <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
                <p className="text-gray-500 italic">Cargando dimensiones administrativas...</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Footer />
    </main>
  );
}
