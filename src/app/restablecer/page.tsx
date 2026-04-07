'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { supabase } from '@/supabase/client';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, Lock, CheckCircle2, ShieldAlert, ArrowRight, Sparkles } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

function RestablecerContent() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { getImage } = useSiteSettings();
  const router = useRouter();
  const searchParams = useSearchParams();

  const brandLogo = getImage('brand-logo');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  // Supabase handles token via the URL hash automatically - no manual code verification needed

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast({ variant: "destructive", title: t('auth.matchError') });
      return;
    }

    if (newPassword.length < 6) {
      toast({ variant: "destructive", title: "Energía insuficiente", description: "Tu nueva contraseña debe tener al menos 6 caracteres para ser segura." });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setIsSuccess(true);
      toast({ title: t('auth.passwordSuccess') });
      setTimeout(() => router.push('/'), 5000);
    } catch (error: any) {
      toast({ variant: "destructive", title: t('auth.passwordError'), description: error.message || "Hubo un problema al sintonizar tu nueva contraseña." });
    } finally {
      setIsLoading(false);
    }
  };

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
            ) : (
              <div className="relative w-10 h-10 z-10">
                <Image src={brandLogo.imageUrl} alt="" fill className="object-contain" />
              </div>
            )}
          </div>
          
          <CardTitle className="text-3xl md:text-4xl font-headline font-bold text-gray-900 mb-4 px-6 leading-tight">
            {isSuccess ? "Ritual Completado" : "Recuperar tu Centro"}
          </CardTitle>
          
          <CardDescription className="max-w-xs mx-auto text-sm text-gray-500 font-body italic leading-relaxed">
            {isSuccess 
              ? "Tu acceso ha sido restaurado. Redirigiendo a la calma de Bonanza..." 
              : "Crea una nueva llave de acceso segura para tu cuenta."}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-8 sm:p-12 pt-0">
          {!isSuccess ? (
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
                      className="h-14 rounded-2xl bg-secondary/20 border-white/60 focus:border-primary/20 focus:bg-white pl-14 text-lg transition-all duration-500"
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
                      className="h-14 rounded-2xl bg-secondary/20 border-white/60 focus:border-primary/20 focus:bg-white pl-14 text-lg transition-all duration-500"
                      required
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full h-16 btn-primary rounded-2xl text-[10px] tracking-[0.3em] shadow-lg group/btn relative overflow-hidden" disabled={isLoading}>
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