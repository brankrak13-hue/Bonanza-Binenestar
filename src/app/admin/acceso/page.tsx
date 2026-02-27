
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, setDoc } from 'firebase/firestore';
import { useUser, useFirestore } from '@/firebase';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ShieldAlert, Loader2, Key, CheckCircle2, AlertCircle } from 'lucide-react';
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
        toast({ 
          variant: "destructive", 
          title: "Sesión requerida", 
          description: "Debes iniciar sesión con tu cuenta personal antes de activar el modo admin." 
        });
        return;
    }

    setIsLoading(true);

    // Intentamos leer de la variable de entorno, si no existe usamos una de respaldo.
    // La variable DEBE tener el prefijo NEXT_PUBLIC_ para ser visible aquí.
    const masterKey = process.env.NEXT_PUBLIC_ADMIN_ACCESS_KEY || 'BonanzaAdmin2024';

    if (secretKey.trim() === masterKey.trim()) {
      try {
        // Creamos el documento en la colección protegida roles_admin
        // Esto activará tu rango de administrador en todo el sitio.
        await setDoc(doc(db, 'roles_admin', user.uid), {
          grantedAt: new Date().toISOString(),
          email: user.email,
          setupBy: 'Master Key System',
          role: 'admin'
        });
        
        setIsSuccess(true);
        toast({ 
          title: "Acceso Concedido", 
          description: "Tu cuenta ahora tiene privilegios de administrador." 
        });
        
        // Redirigimos al panel principal después de una breve pausa
        setTimeout(() => {
          router.push('/admin');
        }, 1500);
      } catch (err: any) {
        console.error("Error al guardar rol de admin:", err);
        toast({ 
          variant: "destructive", 
          title: "Error de Sistema", 
          description: "No se pudieron guardar los permisos. Verifica tu conexión." 
        });
      }
    } else {
      toast({ 
        variant: "destructive", 
        title: "Llave Incorrecta", 
        description: "La contraseña ingresada no coincide con la llave maestra." 
      });
    }
    setIsLoading(false);
  };

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="max-w-screen-md mx-auto px-4 py-32 flex flex-col items-center">
        <Card className="w-full border-none shadow-2xl rounded-[3rem] overflow-hidden glass-card border border-white/40">
          <CardHeader className="text-center pt-12 pb-8 bg-primary/5">
            <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-6">
              {isSuccess ? (
                <CheckCircle2 className="w-10 h-10 text-green-500 animate-bounce" />
              ) : (
                <ShieldAlert className="w-10 h-10 text-primary" />
              )}
            </div>
            <CardTitle className="text-3xl font-headline">
              {isSuccess ? "Acceso Autorizado" : "Puerta Administrativa"}
            </CardTitle>
            <CardDescription className="max-w-xs mx-auto">
              {isSuccess 
                ? "Sincronizando permisos con la base de datos..." 
                : "Ingresa la llave maestra de Bonanza para activar tus privilegios."}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-10">
            {!isSuccess ? (
              <form onSubmit={handleValidate} className="space-y-6">
                {!user && (
                  <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-800 text-sm mb-4">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <p><strong>Aviso:</strong> Primero debes entrar a tu cuenta (Login) para poder vincular la llave de administrador a tu perfil.</p>
                  </div>
                )}
                
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="password"
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    placeholder="Escribe la llave maestra aquí..."
                    className="h-16 pl-12 rounded-2xl bg-secondary/20 border-transparent focus:border-primary/30 text-lg"
                    required
                    autoFocus
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full h-16 btn-primary rounded-2xl text-base tracking-widest" 
                  disabled={isLoading || !user}
                >
                  {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : "ACTIVAR MODO ADMIN"}
                </Button>
                
                <p className="text-[10px] text-center text-gray-400 uppercase tracking-widest italic">
                  Área restringida. Todas las acciones son monitoreadas.
                </p>
              </form>
            ) : (
              <div className="text-center py-10">
                <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
                <p className="text-gray-500 italic font-medium tracking-wide">Abriendo el panel de control...</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Footer />
    </main>
  );
}
