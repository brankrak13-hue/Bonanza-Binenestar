
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/firebase';
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, Lock, CheckCircle2, ShieldCheck, Stars, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'link';
import { LotusIcon } from '@/components/icons/LotusIcon';

function RestablecerContent() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const auth = useAuth();

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
      // Redirección suave después de un ritual de éxito
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
            <div className="relative bg-white p-8 rounded-full shadow-2xl">
                <LotusIcon className="w-20 h-20 text-primary animate-spin-slow" />
            </div>
        </div>
        <div className="text-center space-y-2">
            <p className="text-sm font-bold tracking-[0.4em] text-primary/60 animate-pulse uppercase">Sincronizando con el Oráculo...</p>
            <p className="text-xs text-gray-400 italic">Validando tu esencia de seguridad</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-md mx-auto px-4 py-20 sm:py-32 flex flex-col items-center relative">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] h-full pointer-events-none z-0 overflow-hidden opacity-40">
          <div className="absolute top-[-10%] left-[20%] w-[40rem] h-[40rem] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[20%] w-[40rem] h-[40rem] bg-accent/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <Card className="w-full border-none shadow-[0_80px_150px_-30px_rgba(41,102,84,0.2)] rounded-[4.5rem] overflow-hidden glass-card border border-white/50 relative z-10 animate-scaleIn">
        <CardHeader className="text-center pt-24 pb-12 bg-gradient-to-b from-primary/5 via-transparent to-transparent">
          <div className="mx-auto bg-white rounded-full p-7 w-fit mb-10 shadow-[0_20px_40px_rgba(0,0,0,0.05)] relative group transition-all duration-700 hover:scale-110">
            <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping opacity-20 group-hover:animate-none" />
            {isSuccess ? (
              <CheckCircle2 className="w-14 h-14 text-green-500 animate-bounce relative z-10" />
            ) : errorMsg ? (
              <ShieldAlert className="w-14 h-14 text-destructive relative z-10" />
            ) : (
              <ShieldCheck className="w-14 h-14 text-primary relative z-10" />
            )}
          </div>
          
          <CardTitle className="text-5xl md:text-7xl font-headline font-bold text-gray-900 mb-6 px-6 leading-tight">
            {isSuccess ? "Ritual Completado" : errorMsg ? "Enlace Sin Vibración" : "Recuperar tu Centro"}
          </CardTitle>
          
          <CardDescription className="max-w-md mx-auto text-xl text-gray-500 font-body italic leading-relaxed">
            {isSuccess 
              ? "Tu acceso ha sido restaurado. Redirigiendo a la calma de Bonanza..." 
              : errorMsg 
              ? errorMsg
              : `Crea una nueva llave de acceso para conectar con ${email}`}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-10 sm:p-24 pt-0">
          {!isSuccess && !errorMsg ? (
            <form onSubmit={handleReset} className="space-y-12">
              <div className="space-y-8">
                <div className="space-y-4">
                  <Label className="text-[12px] uppercase tracking-[0.5em] font-bold text-primary/50 ml-3">
                    {t('auth.newPassword')}
                  </Label>
                  <div className="relative group">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center">
                        <Lock className="w-5 h-5 text-gray-300 group-focus-within:text-primary transition-colors" />
                    </div>
                    <Input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="h-20 rounded-[2rem] bg-secondary/30 border-white/60 focus:border-primary/30 focus:bg-white pl-16 text-xl transition-all duration-700 shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)]"
                      required
                      autoFocus
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-[12px] uppercase tracking-[0.5em] font-bold text-primary/50 ml-3">
                    {t('auth.confirmNewPassword')}
                  </Label>
                  <div className="relative group">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center">
                        <Lock className="w-5 h-5 text-gray-300 group-focus-within:text-primary transition-colors" />
                    </div>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-20 rounded-[2rem] bg-secondary/30 border-white/60 focus:border-primary/30 focus:bg-white pl-16 text-xl transition-all duration-700 shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)]"
                      required
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-24 btn-primary rounded-[2.5rem] text-sm tracking-[0.4em] shadow-[0_30px_60px_-15px_rgba(41,102,84,0.4)] group/btn relative overflow-hidden" 
                disabled={isLoading}
              >
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
                {isLoading ? (
                    <Loader2 className="w-8 h-8 animate-spin" />
                ) : (
                    <span className="flex items-center justify-center gap-4 relative z-10">
                        {t('auth.updatePassword')}
                        <ArrowRight className="w-6 h-6 transition-transform group-hover/btn:translate-x-2" />
                    </span>
                )}
              </Button>
            </form>
          ) : errorMsg ? (
            <div className="text-center py-10 space-y-12 animate-in fade-in slide-in-from-bottom-4">
              <div className="p-10 rounded-[3rem] bg-destructive/5 border border-destructive/10 text-destructive text-lg font-medium leading-relaxed italic">
                "{errorMsg}"
              </div>
              <Button asChild className="btn-primary rounded-full px-16 h-20 shadow-2xl">
                <Link href="/" className="flex items-center gap-4">
                  VOLVER AL INICIO
                  <LotusIcon className="w-6 h-6" />
                </Link>
              </Button>
            </div>
          ) : (
            <div className="text-center py-20 animate-in fade-in zoom-in-95 duration-1000">
                <div className="flex justify-center mb-12">
                    <div className="relative">
                        <Stars className="w-20 h-20 text-accent animate-spin-slow" />
                        <Sparkles className="w-10 h-10 text-primary absolute -top-4 -right-4 animate-pulse" />
                    </div>
                </div>
                <p className="text-gray-600 italic font-medium tracking-[0.2em] text-2xl animate-pulse">
                    Tu nueva armonía está lista...
                </p>
                <div className="mt-16 h-2 w-64 bg-secondary/50 mx-auto rounded-full overflow-hidden">
                    <div className="h-full bg-primary animate-[loading_5s_ease-in-out_forwards]" />
                </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-12 text-center text-[10px] uppercase tracking-[0.6em] text-primary/40 font-bold">
          Bonanza Arte & Bienestar • Ritual de Seguridad
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
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <p className="text-[10px] font-bold tracking-[0.5em] text-gray-400">PREPARANDO EL ESPACIO...</p>
        </div>
      }>
        <RestablecerContent />
      </Suspense>
      <Footer />
    </main>
  );
}
