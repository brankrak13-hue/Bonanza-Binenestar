
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, setDoc } from 'firebase/firestore';
import { useUser, useFirestore } from '@/firebase';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ShieldAlert, Loader2, Key } from 'lucide-react';
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

  const handleValidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !db) {
        toast({ variant: "destructive", title: "Error", description: "Debes iniciar sesión primero." });
        return;
    }

    setIsLoading(true);

    // En producción, esto debería validarse contra una Function de Firebase o similar,
    // pero para este prototipo usaremos la variable de entorno expuesta de forma segura.
    // La llave real se define en el archivo .env
    const masterKey = process.env.ADMIN_ACCESS_KEY || 'Bonanza_Master_Secret_2024_Security_Key_Long_Password_12345';

    if (secretKey === masterKey) {
      try {
        await setDoc(doc(db, 'roles_admin', user.uid), {
          grantedAt: new Date().toISOString(),
          email: user.email,
          setupBy: 'Master Key System'
        });
        
        toast({ title: t('admin.accessSuccess') });
        router.push('/admin');
      } catch (err) {
        toast({ variant: "destructive", title: "Error", description: "Error al actualizar roles." });
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
              <ShieldAlert className="w-10 h-10 text-primary" />
            </div>
            <CardTitle className="text-3xl font-headline">{t('admin.accessTitle')}</CardTitle>
            <CardDescription className="max-w-xs mx-auto">{t('admin.accessDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="p-10">
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
              {!user && <p className="text-center text-xs text-destructive font-bold uppercase tracking-widest mt-4">Inicia sesión primero</p>}
            </form>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </main>
  );
}
