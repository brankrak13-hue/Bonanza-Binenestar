
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
import { Loader2, Lock, CheckCircle2, ShieldCheck, Stars, ArrowRight, ShieldAlert } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
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
          setErrorMsg("El enlace de seguridad ha expirado o ya ha sido utilizado.");
          setIsVerifyingCode(false);
        });
    } else {
      setIsVerifyingCode(false);
      setErrorMsg("No se encontró un código de seguridad válido.");
    }
  }, [searchParams, auth, toast]);

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
        title: "Seguridad insuficiente", 
        description: "La contraseña debe tener al menos 6 caracteres." 
      });
      return;
    }

    setIsLoading(true);
    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setIsSuccess(true);
      toast({ title: t('auth.passwordSuccess') });
      setTimeout(() => router.push('/'), 4000);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t('auth.passwordError'),
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerifyingCode) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-6">
        <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse" />
            <Loader2 className="w-16 h-16 animate-spin text-primary relative z-10" />
        </div>
        <p className="text-sm font-bold tracking-[0.3em] text-gray-400 animate-pulse uppercase">Validando Oráculo de Seguridad...</p>
      </div>
    );
  }

  return (
    <div className="max-w-screen-md mx-auto px-4 py-24 sm:py-32 flex flex-col items-center relative">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-full pointer-events-none z-0 overflow-hidden opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[100px]" />
      </div>

      <Card className="w-full border-none shadow-[0_50px_100px_-20px_rgba(41,102,84,0.15)] rounded-[4rem] overflow-hidden glass-card border border-white/40 relative z-10 animate-scaleIn">
        <CardHeader className="text-center pt-20 pb-10 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="mx-auto bg-white rounded-full p-6 w-fit mb-8 shadow-xl relative group transition-transform hover:scale-110 duration-500">
            <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping opacity-30 group-hover:animate-none" />
            {isSuccess ? (
              <CheckCircle2 className="w-12 h-12 text-green-500 animate-bounce relative z-10" />
            ) : errorMsg ? (
              <ShieldAlert className="w-12 h-12 text-destructive relative z-10" />
            ) : (
              <ShieldCheck className="w-12 h-12 text-primary relative z-10" />
            )}
          </div>
          
          <CardTitle className="text-5xl md:text-6xl font-headline font-bold text-gray-900 mb-4 px-4">
            {isSuccess ? "Ritual Completado" : errorMsg ? "Enlace Inválido" : "Recuperar tu Centro"}
          </CardTitle>
          
          <CardDescription className="max-w-sm mx-auto text-lg text-gray-500 font-body italic">
            {isSuccess 
              ? "Tu acceso ha sido restaurado con éxito. Redirigiendo a la calma..." 
              : errorMsg 
              ? "Este enlace de seguridad ya no tiene vibración. Por favor solicita uno nuevo."
              : `Crea una nueva llave de acceso para ${email}`}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-10 sm:p-20 pt-0">
          {!isSuccess && !errorMsg ? (
            <form onSubmit={handleReset} className="space-y-10">
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-[11px] uppercase tracking-[0.4em] font-bold text-primary/60 ml-2">
                    {t('auth.newPassword')}
                  </Label>
                  <div className="relative group">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <Input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="h-16 rounded-[1.5rem] bg-secondary/30 border-white/50 focus:border-primary/40 focus:bg-white pl-14 text-lg transition-all duration-500 shadow-inner"
                      required
                      autoFocus
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-[11px] uppercase tracking-[0.4em] font-bold text-primary/60 ml-2">
                    {t('auth.confirmNewPassword')}
                  </Label>
                  <div className="relative group">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-16 rounded-[1.5rem] bg-secondary/30 border-white/50 focus:border-primary/40 focus:bg-white pl-14 text-lg transition-all duration-500 shadow-inner"
                      required
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-20 btn-primary rounded-[2rem] text-sm tracking-[0.3em] shadow-[0_20px_40px_-10px_rgba(41,102,84,0.3)] group" 
                disabled={isLoading}
              >
                {isLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                    <span className="flex items-center gap-3">
                        {t('auth.updatePassword')}
                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
                    </span>
                )}
              </Button>
            </form>
          ) : errorMsg ? (
            <div className="text-center py-8 space-y-10">
              <div className="p-8 rounded-[2.5rem] bg-destructive/5 border border-destructive/10 text-destructive text-sm leading-relaxed">
                {errorMsg}
              </div>
              <Button asChild className="btn-primary rounded-full px-12 h-16 shadow-xl">
                <Link href="/" className="flex items-center gap-3">
                  VOLVER AL INICIO
                  <LotusIcon className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          ) : (
            <div className="text-center py-16 animate-in fade-in zoom-in-95 duration-1000">
                <div className="flex justify-center mb-8">
                    <Stars className="w-12 h-12 text-accent animate-spin-slow" />
                </div>
                <p className="text-gray-500 italic font-medium tracking-widest text-lg animate-pulse">
                    Tu nueva armonía está lista...
                </p>
                <div className="mt-10 h-1.5 w-48 bg-secondary/50 mx-auto rounded-full overflow-hidden">
                    <div className="h-full bg-primary animate-[loading_4s_ease-in-out_forwards]" />
                </div>
            </div>
          )}
        </CardContent>
      </Card>

      <style jsx global>{`
        @keyframes loading {
            0% { width: 0%; }
            100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}

export default function RestablecerPage() {
  return (
    <main className="min-h-screen bg-background selection:bg-primary/20">
      <Header />
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center py-40 gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-xs font-bold tracking-widest text-gray-400">CARGANDO...</p>
        </div>
      }>
        <RestablecerContent />
      </Suspense>
      <Footer />
    </main>
  );
}
