
'use client';

import { useState } from 'react';
import { useAuth } from '@/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Key, Mail, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

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
      // Firebase envía el correo automáticamente a la dirección proporcionada.
      // El correo incluye un enlace de seguridad (Out-of-band link).
      await sendPasswordResetEmail(auth, email);
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
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] rounded-[2rem]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline font-bold text-center">
            {view === 'auth' ? t('auth.title') : view === 'resetSuccess' ? "Verifica tu Email" : t('auth.resetTitle')}
          </DialogTitle>
          <DialogDescription className="text-center">
            {view === 'auth' ? t('auth.description') : view === 'resetSuccess' ? "Te enviamos un enlace de seguridad." : t('auth.resetDesc')}
          </DialogDescription>
        </DialogHeader>

        {view === 'auth' ? (
          <Tabs defaultValue="login" className="w-full mt-4">
            <TabsList className="grid w-full grid-cols-2 rounded-full h-12 p-1 bg-secondary/30">
              <TabsTrigger value="login" className="rounded-full text-[10px] uppercase font-bold tracking-widest">{t('auth.loginTab')}</TabsTrigger>
              <TabsTrigger value="register" className="rounded-full text-[10px] uppercase font-bold tracking-widest">{t('auth.registerTab')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4 py-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[10px] uppercase tracking-widest font-bold text-gray-400 ml-1">{t('auth.email')}</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="tu@email.com" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    className="h-12 rounded-xl bg-secondary/20 border-transparent focus:border-primary/30"
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-[10px] uppercase tracking-widest font-bold text-gray-400 ml-1">{t('auth.password')}</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    className="h-12 rounded-xl bg-secondary/20 border-transparent focus:border-primary/30"
                    required 
                  />
                </div>
                <div className="text-right">
                  <button 
                    type="button" 
                    onClick={() => setView('reset')}
                    className="text-[10px] uppercase tracking-widest font-bold text-primary hover:underline"
                  >
                    {t('auth.forgotPassword')}
                  </button>
                </div>
                <Button type="submit" className="w-full btn-primary h-14 rounded-xl" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : t('auth.loginButton')}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4 py-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[10px] uppercase tracking-widest font-bold text-gray-400 ml-1">{t('auth.name')}</Label>
                  <Input 
                    id="name" 
                    placeholder="Ej: Ana García" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    className="h-12 rounded-xl bg-secondary/20 border-transparent focus:border-primary/30"
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email" className="text-[10px] uppercase tracking-widest font-bold text-gray-400 ml-1">{t('auth.email')}</Label>
                  <Input 
                    id="register-email" 
                    type="email" 
                    placeholder="tu@email.com" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    className="h-12 rounded-xl bg-secondary/20 border-transparent focus:border-primary/30"
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password" className="text-[10px] uppercase tracking-widest font-bold text-gray-400 ml-1">{t('auth.password')}</Label>
                  <Input 
                    id="register-password" 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    className="h-12 rounded-xl bg-secondary/20 border-transparent focus:border-primary/30"
                    required 
                  />
                </div>
                <Button type="submit" className="w-full btn-primary h-14 rounded-xl" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : t('auth.registerButton')}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        ) : view === 'resetSuccess' ? (
          <div className="py-10 text-center space-y-6">
            <div className="mx-auto bg-green-50 rounded-full p-4 w-fit">
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            </div>
            <p className="text-sm text-gray-600 px-4 leading-relaxed">
              Hemos enviado un enlace a <strong>{email}</strong> para que puedas crear una nueva contraseña. Por favor, revisa tu carpeta de <strong>SPAM</strong> si no lo ves en unos minutos.
            </p>
            <Button variant="outline" className="rounded-full px-8" onClick={() => setView('auth')}>
              Volver al inicio
            </Button>
          </div>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-6 py-8">
            <div className="space-y-2">
              <Label htmlFor="reset-email" className="text-[10px] uppercase tracking-widest font-bold text-gray-400 ml-1">{t('auth.email')}</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input 
                  id="reset-email" 
                  type="email" 
                  placeholder="tu@email.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="h-14 rounded-2xl bg-secondary/20 border-transparent focus:border-primary/30 pl-12"
                  required 
                />
              </div>
            </div>
            <Button type="submit" className="w-full btn-primary h-14 rounded-2xl" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : t('auth.sendReset')}
            </Button>
            <div className="text-center">
              <button 
                type="button" 
                onClick={() => setView('auth')}
                className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground hover:text-primary transition-colors"
              >
                Volver al inicio de sesión
              </button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
