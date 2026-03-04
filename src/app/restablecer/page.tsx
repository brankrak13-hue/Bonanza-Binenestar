
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/firebase';
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, Lock, CheckCircle2, ShieldCheck } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function RestablecerPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const auth = useAuth();

  const [oobCode, setOobCode] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(true);

  useEffect(() => {
    const code = searchParams.get('oobCode');
    if (code) {
      setOobCode(code);
      // Verificar si el código es válido
      verifyPasswordResetCode(auth, code)
        .then(() => setIsVerifyingCode(false))
        .catch(() => {
          toast({
            variant: "destructive",
            title: "Código inválido",
            description: t('auth.passwordError')
          });
          setIsVerifyingCode(false);
        });
    } else {
      setIsVerifyingCode(false);
    }
  }, [searchParams, auth, t, toast]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oobCode) return;

    if (newPassword !== confirmPassword) {
      toast({ variant: "destructive", title: t('auth.matchError') });
      return;
    }

    setIsLoading(true);
    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setIsSuccess(true);
      toast({ title: t('auth.passwordSuccess') });
      setTimeout(() => router.push('/'), 3000);
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
      <main className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-40">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="max-w-screen-md mx-auto px-4 py-24 sm:py-32 flex flex-col items-center">
        <Card className="w-full border-none shadow-2xl rounded-[3rem] overflow-hidden glass-card border border-white/40">
          <CardHeader className="text-center pt-16 pb-8 bg-primary/5">
            <div className="mx-auto bg-primary/10 rounded-full p-5 w-fit mb-6">
              {isSuccess ? (
                <CheckCircle2 className="w-10 h-10 text-green-500 animate-bounce" />
              ) : (
                <Lock className="w-10 h-10 text-primary" />
              )}
            </div>
            <CardTitle className="text-4xl font-headline font-bold">
              {isSuccess ? t('auth.passwordSuccess') : t('auth.confirmResetTitle')}
            </CardTitle>
            <CardDescription className="max-w-xs mx-auto text-lg mt-2">
              {isSuccess ? "Redirigiendo al inicio..." : t('auth.confirmResetDesc')}
            </CardDescription>
          </CardHeader>

          <CardContent className="p-10 sm:p-16">
            {!isSuccess ? (
              oobCode ? (
                <form onSubmit={handleReset} className="space-y-8">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 ml-1">
                        {t('auth.newPassword')}
                      </Label>
                      <div className="relative">
                        <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="h-14 rounded-2xl bg-secondary/20 border-transparent focus:border-primary/30 pl-12"
                          required
                          autoFocus
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 ml-1">
                        {t('auth.confirmNewPassword')}
                      </Label>
                      <div className="relative">
                        <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="h-14 rounded-2xl bg-secondary/20 border-transparent focus:border-primary/30 pl-12"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-16 btn-primary rounded-2xl text-base tracking-widest shadow-xl" 
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : t('auth.updatePassword')}
                  </Button>
                </form>
              ) : (
                <div className="text-center space-y-6">
                  <p className="text-muted-foreground italic">
                    Para restablecer tu contraseña, utiliza el enlace que enviamos a tu correo electrónico.
                  </p>
                  <Button asChild className="btn-primary rounded-2xl px-12 h-14">
                    <a href="/">{t('nav.home')}</a>
                  </Button>
                </div>
              )
            ) : (
              <div className="text-center py-10">
                <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
                <p className="text-gray-500 italic font-medium tracking-wide">Inicia sesión con tu nueva contraseña.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Footer />
    </main>
  );
}
