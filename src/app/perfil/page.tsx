'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuthContext } from '@/supabase/provider';
import { supabase } from '@/supabase/client';
import { useLanguage } from '@/context/LanguageContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, User, Save, Phone, Mail, AlertTriangle, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteUserAccount } from '@/app/actions/delete-account';

export default function PerfilPage() {
  const { user, loading: isUserLoading } = useAuthContext();
  const { t } = useLanguage();
  const { toast } = useToast();

  const [profile, setProfile] = useState<any>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Delete Account States
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteStep, setDeleteStep] = useState(1);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!user) { setIsProfileLoading(false); return; }
    const fetch = async () => {
      const { data } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      if (data) {
        setProfile(data);
        setFirstName(data.first_name || user?.user_metadata?.full_name?.split(' ')[0] || '');
        setLastName(data.last_name || user?.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '');
        setPhoneNumber(data.phone_number || '');
      } else {
        setFirstName(user?.user_metadata?.full_name?.split(' ')[0] || '');
        setLastName(user?.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '');
      }
      setIsProfileLoading(false);
    };
    fetch();
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);

    const payload = {
      user_id: user.id,
      first_name: firstName,
      last_name: lastName,
      phone_number: phoneNumber,
      email: user.email,
      updated_at: new Date().toISOString(),
    };

    try {
      await supabase.from('user_profiles').upsert(payload, { onConflict: 'user_id' });
      toast({ title: t('profile.success'), description: t('profile.successDesc') });
    } catch {
      toast({ variant: "destructive", title: t('profile.error'), description: t('profile.errorDesc') });
    } finally {
      setIsSaving(false);
      setIsEditing(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    setIsDeleting(true);
    try {
      const result = await deleteUserAccount(user.id);
      if (result.success) {
        toast({ title: "Cuenta eliminada", description: "Tu información ha sido borrada permanentemente." });
        await supabase.auth.signOut();
        window.location.href = '/';
      } else {
        throw new Error(result.error);
      }
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error al eliminar", description: err.message || "No se pudo eliminar la cuenta." });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  if (isUserLoading || isProfileLoading) {
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

  if (!user) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="max-w-screen-md mx-auto px-4 py-40 text-center">
          <User className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-4">{t('profile.noAuth')}</h1>
        </div>
        <Footer />
      </main>
    );
  }

  const displayName = firstName ? `${firstName} ${lastName}` : (user.user_metadata?.full_name || user.email);

  return (
    <main className="min-h-screen bg-[#fcfcfc] animate-in fade-in duration-1000">
      <Header />
      <div className="max-w-screen-md mx-auto px-4 py-24 sm:py-32">
        <div className="text-center mb-12">
          <p className="text-sm tracking-widest uppercase text-primary font-bold mb-2">{t('profile.subtitle')}</p>
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-gray-900">{t('profile.title')}</h1>
        </div>

        <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white mb-10">
          <CardHeader className="bg-primary/5 pb-10 pt-12 text-center relative overflow-hidden">
            <div className="mx-auto bg-white rounded-full p-4 w-20 h-20 mb-4 shadow-xl border-4 border-white flex items-center justify-center">
              <User className="w-10 h-10 text-primary" />
            </div>
            <CardTitle className="text-2xl font-headline tracking-wide">{displayName}</CardTitle>
            <CardDescription className="opacity-70">{t('profile.desc')}</CardDescription>
            
            {!isEditing && (
                <Button 
                    type="button"
                    onClick={() => setIsEditing(true)} 
                    className="absolute top-6 right-6 rounded-full bg-white text-primary border border-primary/20 hover:bg-primary hover:text-white transition-colors"
                    variant="outline"
                >
                    Modificar
                </Button>
            )}
          </CardHeader>
          <CardContent className="p-8 sm:p-12">
            <form onSubmit={handleSave} className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label htmlFor="firstName" className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 ml-1">{t('profile.firstName')}</Label>
                  <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} disabled={!isEditing} className="bg-secondary/10 border-transparent focus:border-primary/20 h-14 rounded-2xl shadow-inner outline-none disabled:opacity-75 disabled:cursor-not-allowed" placeholder="Paz" required />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="lastName" className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 ml-1">{t('profile.lastName')}</Label>
                  <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} disabled={!isEditing} className="bg-secondary/10 border-transparent focus:border-primary/20 h-14 rounded-2xl shadow-inner outline-none disabled:opacity-75 disabled:cursor-not-allowed" placeholder="Bienestar" required />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="email" className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 ml-1">{t('profile.email')}</Label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input id="email" value={user.email || ''} disabled className="bg-secondary/5 border-transparent h-14 rounded-2xl pl-14 cursor-not-allowed opacity-60" />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="phone" className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 ml-1">{t('profile.phone')}</Label>
                <div className="relative">
                  <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input id="phone" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} disabled={!isEditing} className="bg-secondary/10 border-transparent focus:border-primary/20 h-14 rounded-2xl pl-14 shadow-inner outline-none disabled:opacity-75 disabled:cursor-not-allowed" placeholder="+52 984 000 0000" />
                </div>
              </div>

              {isEditing && (
                  <Button type="submit" className="w-full btn-primary h-16 rounded-2xl text-md font-bold shadow-xl shadow-primary/10 transition-all hover:scale-[1.01]" disabled={isSaving}>
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
                    {isSaving ? t('profile.saving') : t('profile.save')}
                  </Button>
              )}
            </form>
          </CardContent>
        </Card>

        {/* DANGER ZONE */}
        <Card className="border border-red-100 shadow-xl rounded-[2rem] overflow-hidden bg-white/50 animate-in slide-in-from-bottom-8 duration-700 delay-300">
           <CardHeader className="bg-red-50/50 p-8 border-b border-red-50">
             <div className="flex items-center space-x-3 text-red-600">
               <AlertTriangle className="w-6 h-6" />
               <CardTitle className="text-xl font-headline tracking-wide uppercase">{t('profile.dangerZone')}</CardTitle>
             </div>
             <CardDescription className="text-red-800/60 mt-1">{t('profile.deleteDesc')}</CardDescription>
           </CardHeader>
           <CardContent className="p-8">
             <p className="text-sm text-gray-600 mb-6 leading-relaxed">
               Si decides eliminar tu cuenta, todos tus registros de compras, perfil y reservas activas desaparecerán. No enviamos confirmación de borrado, la acción es inmediata y total.
             </p>
             <Button 
               variant="outline" 
               className="h-14 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-2xl transition-all font-bold px-8"
               onClick={() => {
                 setDeleteStep(1);
                 setShowDeleteDialog(true);
               }}
             >
               <Trash2 className="w-5 h-5 mr-2" />
               {t('profile.deleteAccount')}
             </Button>
           </CardContent>
        </Card>

        {/* DELETE ACCOUNT DIALOG */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent className="rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden max-w-sm sm:max-w-md">
            <div className="bg-red-50/80 p-8 pt-10 text-center border-b border-red-100">
                <div className="mx-auto bg-white rounded-full p-4 w-16 h-16 mb-4 shadow-sm flex items-center justify-center">
                    <Trash2 className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-2xl font-headline font-bold text-red-700">
                    {deleteStep === 1 ? "¿Borrar todo?" : "¡Última advertencia!"}
                </h3>
            </div>
            
            <div className="p-8 space-y-4">
                <AlertDialogDescription className="text-gray-700 text-base leading-relaxed text-center">
                    {deleteStep === 1 
                        ? "¿Estás seguro de que deseas eliminar permanentemente tu cuenta de Bonanza? Esta acción borrará todas tus preferencias y datos personales."
                        : "Si tienes reservas o citas activas, perderás el acceso a los códigos de confirmación y a la información de tus sesiones. No hay vuelta atrás."
                    }
                </AlertDialogDescription>
            </div>

            <AlertDialogFooter className="p-8 pt-0 flex flex-col-reverse sm:flex-row gap-3">
              <AlertDialogCancel 
                className="h-14 rounded-2xl border-gray-100 flex-1 m-0" 
                onClick={() => setShowDeleteDialog(false)}
              >
                Cancelar
              </AlertDialogCancel>
              
              {deleteStep === 1 ? (
                  <Button 
                    className="h-14 btn-primary rounded-2xl flex-1 bg-red-600 hover:bg-red-700 text-white" 
                    onClick={() => setDeleteStep(2)}
                  >
                    Confirmar paso 1
                  </Button>
              ) : (
                  <AlertDialogAction 
                    className="h-14 rounded-2xl flex-1 bg-red-700 hover:bg-red-800 text-white m-0" 
                    onClick={(e) => {
                        e.preventDefault();
                        handleDeleteAccount();
                    }}
                    disabled={isDeleting}
                  >
                    {isDeleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}
                    BORRAR AHORA
                  </AlertDialogAction>
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </div>
      <Footer />
      
      <style jsx global>{`
        .btn-primary {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border: none;
        }
        .btn-primary:hover {
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
          transform: translateY(-2px);
        }
      `}</style>
    </main>
  );
}
