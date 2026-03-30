"use client";

import { useState } from "react";
import {
  useAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail
} from "@/firebase";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Key, Mail, CheckCircle2, ArrowRight, ShieldCheck, UserCircle, User } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const auth = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [view, setView] = useState<'auth' | 'reset' | 'resetSuccess'>('auth');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: t('auth.successLoginTitle'),
        description: t('auth.successLoginDesc')
      });
      onClose();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: t('auth.errorLoginTitle'),
        description: t('auth.errorLoginDesc')
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      toast({
        title: t('auth.successRegisterTitle'),
        description: t('auth.successRegisterDesc')
      });
      onClose();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: t('auth.errorRegisterTitle'),
        description: error.message || t('auth.errorRegisterDesc')
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const actionCodeSettings = {
        url: window.location.origin + '/restablecer',
        handleCodeInApp: true,
      };

      await sendPasswordResetEmail(auth, email, actionCodeSettings);
      setView('resetSuccess');
      toast({
        title: t('auth.resetSuccess'),
        description: "Se ha enviado un enlace de seguridad a tu correo."
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: "Error",
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
        setTimeout(() => setView('auth'), 300); // Reset view after closing
      }
    }}>
      <DialogContent
        className="w-[calc(100%-2rem)] sm:max-w-[440px] rounded-3xl sm:rounded-[2.5rem] border-none shadow-[0_40px_100px_-20px_rgba(41,102,84,0.3)] glass-card overflow-hidden animate-in fade-in zoom-in-95 duration-500 p-0"
      >
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />

        <div className="p-6 sm:p-10 max-h-[90vh] overflow-y-auto custom-scrollbar">
          <DialogHeader className="pt-2 sm:pt-4">
            <div className="mx-auto bg-primary/5 rounded-full p-4 w-fit mb-4 sm:mb-6 animate-in slide-in-from-top-4 duration-700">
              {view === 'resetSuccess' ? (
                <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
              ) : view === 'reset' ? (
                <Key className="w-8 h-8 sm:w-10 sm:h-10 text-primary animate-pulse" />
              ) : (
                <div className="flex items-center justify-center">
                  <UserCircle className="w-10 h-10 sm:w-12 sm:h-12 text-primary/80" />
                </div>
              )}
            </div>
            <DialogTitle className="text-2xl sm:text-3xl font-headline font-bold text-center text-gray-900 leading-tight">
              {view === 'auth' ? t('auth.title') : view === 'resetSuccess' ? "Verifica tu Email" : t('auth.resetTitle')}
            </DialogTitle>
            <DialogDescription className="text-center text-gray-500 font-body italic px-2 sm:px-6 mt-2 text-xs sm:text-sm">
              {view === 'auth' ? t('auth.description') : view === 'resetSuccess' ? "Te enviamos un enlace de seguridad." : t('auth.resetDesc')}
            </DialogDescription>
          </DialogHeader>

          {view === 'auth' ? (
            <Tabs defaultValue="login" className="w-full mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <TabsList className="grid w-full grid-cols-2 rounded-full h-12 sm:h-14 p-1.5 bg-secondary/40 backdrop-blur-sm border border-white/40 shadow-inner">
                <TabsTrigger value="login" className="rounded-full text-[9px] sm:text-[10px] uppercase font-bold tracking-[0.2em] transition-all duration-500 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-md">
                  {t('auth.loginTab')}
                </TabsTrigger>
                <TabsTrigger value="register" className="rounded-full text-[9px] sm:text-[10px] uppercase font-bold tracking-[0.2em] transition-all duration-500 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-md">
                  {t('auth.registerTab')}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="animate-in fade-in duration-500">
                <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5 py-6 sm:py-8">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 ml-2">{t('auth.email')}</Label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-primary transition-colors" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="tu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-12 sm:h-14 rounded-2xl bg-secondary/20 border-transparent focus:border-primary/20 focus:bg-white pl-11 text-sm sm:text-base transition-all duration-300"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 ml-2">{t('auth.password')}</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 sm:h-14 rounded-2xl bg-secondary/20 border-transparent focus:border-primary/20 focus:bg-white px-6 text-sm sm:text-base transition-all duration-300"
                      required
                    />
                  </div>
                  <div className="text-right px-1">
                    <button
                      type="button"
                      onClick={() => setView('reset')}
                      className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-bold text-primary hover:text-accent transition-colors underline-offset-4 hover:underline"
                    >
                      {t('auth.forgotPassword')}
                    </button>
                  </div>
                  <Button type="submit" className="w-full btn-primary h-14 sm:h-16 rounded-2xl text-[10px] sm:text-xs tracking-[0.3em] shadow-xl hover:shadow-primary/20 active:scale-95 transition-all" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : t('auth.loginButton')}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register" className="animate-in fade-in duration-500">
                <form onSubmit={handleRegister} className="space-y-4 sm:space-y-5 py-6 sm:py-8">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 ml-2">{t('auth.name')}</Label>
                    <Input
                      id="name"
                      placeholder="Ej: Ana García"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-12 sm:h-14 rounded-2xl bg-secondary/20 border-transparent focus:border-primary/20 focus:bg-white px-6 text-sm sm:text-base transition-all duration-300"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email" className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 ml-2">{t('auth.email')}</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="tu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 sm:h-14 rounded-2xl bg-secondary/20 border-transparent focus:border-primary/20 focus:bg-white px-6 text-sm sm:text-base transition-all duration-300"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password" className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 ml-2">{t('auth.password')}</Label>
                    <Input
                      id="register-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 sm:h-14 rounded-2xl bg-secondary/20 border-transparent focus:border-primary/20 focus:bg-white px-6 text-sm sm:text-base transition-all duration-300"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full btn-primary h-14 sm:h-16 rounded-2xl text-[10px] sm:text-xs tracking-[0.3em] shadow-xl hover:shadow-primary/20 active:scale-95 transition-all" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : t('auth.registerButton')}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          ) : view === 'resetSuccess' ? (
            <div className="py-8 sm:py-12 text-center space-y-6 sm:space-y-8 animate-in zoom-in-95 duration-700">
              <div className="mx-auto relative">
                <div className="absolute inset-0 bg-green-100/50 rounded-full blur-2xl animate-pulse" />
                <div className="relative bg-green-50 rounded-full p-6 sm:p-8 w-fit mx-auto shadow-[0_15px_30px_-10px_rgba(34,197,94,0.3)]">
                  <CheckCircle2 className="w-10 h-10 sm:w-14 sm:h-14 text-green-500 animate-bounce" />
                </div>
              </div>
              <div className="space-y-3 px-2">
                <p className="text-gray-700 font-medium leading-relaxed text-sm sm:text-base">
                  Hemos enviado un enlace sagrado a <strong>{email}</strong>.
                </p>
                <p className="text-[10px] sm:text-xs text-gray-400 italic">
                  Recuerda revisar tu carpeta de <strong>SPAM</strong> si no aparece en unos instantes.
                </p>
              </div>
              <Button variant="outline" className="rounded-full px-10 sm:px-12 h-12 sm:h-14 border-primary/20 text-primary hover:bg-primary hover:text-white transition-all duration-500 font-bold tracking-[0.2em] text-[9px] sm:text-[10px] uppercase shadow-md" onClick={() => setView('auth')}>
                Volver al inicio
              </Button>
            </div>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-6 sm:space-y-8 py-6 sm:py-10 animate-in slide-in-from-bottom-4 duration-700">
              <div className="space-y-3">
                <Label htmlFor="reset-email" className="text-[10px] sm:text-[11px] uppercase tracking-[0.15em] font-semibold text-primary/70 ml-2 font-headline italic">{t('auth.email')}</Label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-primary transition-all duration-500" />
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 sm:h-14 rounded-2xl bg-secondary/30 border-transparent focus:border-primary/20 focus:bg-white pl-13 text-sm sm:text-base transition-all duration-500 shadow-sm"
                    required
                  />
                </div>
              </div>
              <div className="space-y-6">
                <Button type="submit" className="w-full btn-primary h-12 sm:h-14 rounded-2xl text-[10px] sm:text-xs tracking-[0.2em] shadow-lg hover:shadow-primary/20 active:scale-95 transition-all group/btn overflow-hidden relative" disabled={isLoading}>
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
                  {isLoading ? (
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                  ) : (
                    <span className="flex items-center gap-3 relative z-10">
                      {t('auth.sendReset')}
                      <ArrowRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-2" />
                    </span>
                  )}
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setView('auth')}
                    className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-bold text-gray-400 hover:text-primary transition-all duration-500 flex items-center justify-center gap-2 mx-auto"
                  >
                    <User className="w-3 h-3 opacity-40" />
                    {t('auth.backToLogin') || "VOLVER AL INICIO"}
                  </button>
                </div>
              </div>

              <div className="pt-4 sm:pt-6 flex justify-center gap-2 items-center opacity-30 grayscale pointer-events-none">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[8px] font-bold tracking-[0.3em] uppercase">Security Protocol v2.5</span>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}