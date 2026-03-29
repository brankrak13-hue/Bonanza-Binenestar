'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/firebase';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, Lock, CheckCircle2, ShieldCheck, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

function RestablecerContent() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { getImage } = useSiteSettings();
  const router = useRouter();
  const searchParams = useSearchParams();
  const auth = useAuth();

  const brandLogo = getImage('brand-logo');

  const [oobCode, setOobCode] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get('oobCode');
    if (code) {
      setOobCode(code);
      verifyPasswordResetCode(auth, code)
        .then((emailAddress) => {
          setEmail(emailAddress);
          setIsVerifyingCode(false);
        })
        .catch((error) => {
          console.error("Error al verificar código:", error);
          setErrorMsg("El oráculo de seguridad indica que este enlace ha expirado o ya fue utilizado.");
          setIsVerifyingCode(false);
        });
    } else {
      setIsVerifyingCode(false);
      setErrorMsg("No se encontró una llave de seguridad válida en el enlace.");
    }
  }, [searchParams, auth]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oobCode) return;

    if (newPassword !== confirmPassword) {
      toast({ variant: "destructive", title: t('auth.matchError') });
      return;
    }

    if (newPassword.length < 6) {
      toast({ 
        variant: "destructive", 
        title: "Energía insuficiente", 
        description: "Tu nueva contraseña debe tener al menos 6 caracteres para ser segura." 
      });
      return;
    }

    setIsLoading(true);
    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setIsSuccess(true);
      toast({ title: t('auth.passwordSuccess') });
      setTimeout(() => router.push('/'), 5000);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t('auth.passwordError'),
        description: "Hubo un problema al sintonizar tu nueva contraseña."
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerifyingCode) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-8">
        <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
            <div className="relative bg-white p-6 rounded-full shadow-xl">
                <div className="relative w-16 h-16 animate-spin-slow">
                    <Image src={brandLogo.imageUrl} alt="" fill className="object-contain" />
                </div>
            </div>
        </div>
        <div className="text-center space-y-2">
            <p className="text-xs font-bold tracking-[0.4em] text-primary/60 animate-pulse uppercase">Sincronizando con el Oráculo...</p>
            <p className="text-[10px] text-gray-400 italic">Validando tu esencia de seguridad</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-md mx-auto px-4 py-16 sm:py-24 flex flex-col items-center relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] h-full pointer-events-none z-0 overflow-hidden opacity-30">
          <div className="absolute top-[-10%] left-[20%] w-[30rem] h-[30rem] bg-primary/10 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[20%] w-[30rem] h-[30rem] bg-accent/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <Card className="w-full max-w-[540px] border-none shadow-[0_30px_100px_-20px_rgba(41,102,84,0.15)] rounded-[2.5rem] overflow-hidden glass-card border border-white/40 relative z-10 animate-scaleIn">
        <CardHeader className="text-center pt-16 pb-8 bg-gradient-to-b from-primary/5 via-transparent to-transparent">
          <div className="mx-auto bg-white rounded-full p-5 w-fit mb-8 shadow-sm relative group transition-all duration-700 hover:scale-105">
            <div className="absolute inset-0 bg-primary/5 rounded-full animate-ping opacity-20 group-hover:animate-none" />
            {isSuccess ? (
              <CheckCircle2 className="w-10 h-10 text-green-500 animate-bounce relative z-10" />
            ) : errorMsg ? (
              <ShieldAlert className="w-10 h-10 text-destructive relative z-10" />
            ) : (
              <div className="relative w-10 h-10 z-10">
                  <Image src={brandLogo.imageUrl} alt="" fill className="object-contain" />
              </div>
            )}
          </div>
          
          <CardTitle className="text-3xl md:text-4xl font-headline font-bold text-gray-900 mb-4 px-6 leading-tight">
            {isSuccess ? "Ritual Completado" : errorMsg ? "Enlace Sin Vibración" : "Recuperar tu Centro"}
          </CardTitle>
          
          <CardDescription className="max-w-xs mx-auto text-sm text-gray-500 font-body italic leading-relaxed">
            {isSuccess 
              ? "Tu acceso ha sido restaurado. Redirigiendo a la calma de Bonanza..." 
              : errorMsg 
              ? errorMsg
              : `Crea una nueva llave de acceso para conectar con ${email}`}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-8 sm:p-12 pt-0">
          {!isSuccess && !errorMsg ? (
            <form onSubmit={handleReset} className="space-y-8">
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-[10px] uppercase tracking-[0.4em] font-bold text-primary/50 ml-2">
                    {t('auth.newPassword')}
                  </Label>
                  <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center">
                        <Lock className="w-4 h-4 text-gray-300 group-focus-within:text-primary transition-colors" />
                    </div>
                    <Input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="h-14 rounded-2xl bg-secondary/20 border-white/60 focus:border-primary/20 focus:bg-white pl-14 text-lg transition-all duration-500 shadow-[inset_0_2px_4px_rgba(0,0,0,0.01)]"
                      required
                      autoFocus
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-[10px] uppercase tracking-[0.4em] font-bold text-primary/50 ml-2">
                    {t('auth.confirmNewPassword')}
                  </Label>
                  <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center">
                        <Lock className="w-4 h-4 text-gray-300 group-focus-within:text-primary transition-colors" />
                    </div>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-14 rounded-2xl bg-secondary/20 border-white/60 focus:border-primary/20 focus:bg-white pl-14 text-lg transition-all duration-500 shadow-[inset_0_2px_4px_rgba(0,0,0,0.01)]"
                      required
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-16 btn-primary rounded-2xl text-[10px] tracking-[0.3em] shadow-lg group/btn relative overflow-hidden" 
                disabled={isLoading}
              >
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
                {isLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                    <span className="flex items-center justify-center gap-3 relative z-10">
                        {t('auth.updatePassword')}
                        <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </span>
                )}
              </Button>
            </form>
          ) : errorMsg ? (
            <div className="text-center py-6 space-y-8 animate-in fade-in slide-in-from-bottom-2">
              <div className="p-6 rounded-2xl bg-destructive/5 border border-destructive/10 text-destructive text-sm font-medium leading-relaxed italic">
                "{errorMsg}"
              </div>
              <Button asChild className="btn-primary rounded-full px-10 h-14 shadow-lg">
                <Link href="/" className="flex items-center gap-3 text-xs tracking-widest">
                  VOLVER AL INICIO
                  <div className="relative w-5 h-5">
                      <Image src={brandLogo.imageUrl} alt="" fill className="object-contain" />
                  </div>
                </Link>
              </Button>
            </div>
          ) : (
            <div className="text-center py-12 animate-in fade-in zoom-in-95 duration-1000">
                <div className="flex justify-center mb-8">
                    <div className="relative">
                        <Sparkles className="w-12 h-12 text-accent animate-spin-slow" />
                        <Sparkles className="w-6 h-6 text-primary absolute -top-2 -right-2 animate-pulse" />
                    </div>
                </div>
                <p className="text-gray-600 italic font-medium tracking-[0.1em] text-lg animate-pulse">
                    Tu nueva armonía está lista...
                </p>
                <div className="mt-10 h-1.5 w-48 bg-secondary/50 mx-auto rounded-full overflow-hidden">
                    <div className="h-full bg-primary animate-[loading_5s_ease-in-out_forwards]" />
                </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-8 text-center text-[9px] uppercase tracking-[0.5em] text-primary/30 font-bold">
          Bonanza Paz y Bienestar • Ritual de Seguridad
      </div>

      <style jsx global>{`
        @keyframes loading {
            0% { width: 0%; }
            100% { width: 100%; }
        }
        .animate-spin-slow {
            animation: spin 12s linear infinite;
        }
      `}</style>
    </div>
  );
}

export default function RestablecerPage() {
  return (
    <main className="min-h-screen bg-background selection:bg-primary/20 overflow-x-hidden">
      <Header />
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center py-40 gap-6">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-[9px] font-bold tracking-[0.4em] text-gray-400 uppercase">Preparando el espacio...</p>
        </div>
      }>
        <RestablecerContent />
      </Suspense>
      <Footer />
    </main>
  );
}