'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useUser, useFirestore, useDoc, useMemoFirebase, updateDocumentNonBlocking } from '@/firebase';
import { useLanguage } from '@/context/LanguageContext';
import { doc, setDoc } from 'firebase/firestore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, User, Save, Phone, Mail } from 'lucide-react';

export default function PerfilPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const { t } = useLanguage();
  const { toast } = useToast();
  
  // Memorizamos la referencia para evitar bucles infinitos de renderizado
  const userProfileRef = useMemoFirebase(() => 
    (user && db ? doc(db, 'userProfiles', user.uid) : null), 
    [user, db]
  );
  
  const { data: profile, isLoading: isProfileLoading } = useDoc(userProfileRef);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName || '');
      setLastName(profile.lastName || '');
      setPhoneNumber(profile.phoneNumber || '');
    }
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !db) return;

    setIsSaving(true);
    const updatedData = {
      firstName,
      lastName,
      phoneNumber,
      email: user.email,
      updatedAt: new Date().toISOString(),
    };

    try {
      if (!profile) {
        // Crear perfil si no existe
        await setDoc(doc(db, 'userProfiles', user.uid), {
          ...updatedData,
          id: user.uid,
          externalAuthUserId: user.uid,
          createdAt: new Date().toISOString(),
        });
      } else {
        // Actualizar perfil existente
        updateDocumentNonBlocking(doc(db, 'userProfiles', user.uid), updatedData);
      }
      
      toast({
        title: t('profile.success'),
        description: t('profile.successDesc'),
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: t('profile.error'),
        description: t('profile.errorDesc'),
      });
    } finally {
      setIsSaving(false);
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

  return (
    <main className="min-h-screen bg-background animate-in fade-in duration-1000">
      <Header />
      <div className="max-w-screen-md mx-auto px-4 py-20 sm:py-32">
        <div className="text-center mb-12">
          <p className="text-sm tracking-widest uppercase text-primary font-bold mb-2">
            {t('profile.subtitle')}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-gray-900">
            {t('profile.title')}
          </h1>
        </div>

        <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden glass-card">
          <CardHeader className="bg-primary/5 pb-10 pt-12 text-center">
            <div className="mx-auto bg-white rounded-full p-4 w-fit mb-4 shadow-sm">
              <User className="w-10 h-10 text-primary" />
            </div>
            <CardTitle>{user.displayName || user.email}</CardTitle>
            <CardDescription>{t('profile.desc')}</CardDescription>
          </CardHeader>
          <CardContent className="p-8 sm:p-12">
            <form onSubmit={handleSave} className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label htmlFor="firstName" className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 ml-1">
                    {t('profile.firstName')}
                  </Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="bg-secondary/20 border-transparent focus:border-primary/30 h-14 rounded-2xl"
                    required
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="lastName" className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 ml-1">
                    {t('profile.lastName')}
                  </Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="bg-secondary/20 border-transparent focus:border-primary/30 h-14 rounded-2xl"
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="email" className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 ml-1">
                  {t('profile.email')}
                </Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="email"
                    value={user.email || ''}
                    disabled
                    className="bg-secondary/10 border-transparent h-14 rounded-2xl pl-12 cursor-not-allowed opacity-70"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="phone" className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 ml-1">
                  {t('profile.phone')}
                </Label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="phone"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="bg-secondary/20 border-transparent focus:border-primary/30 h-14 rounded-2xl pl-12"
                    placeholder="Ej: +52 984 000 0000"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full btn-primary h-16 text-sm" disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : (
                  <Save className="w-5 h-5 mr-2" />
                )}
                {isSaving ? t('profile.saving') : t('profile.save')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </main>
  );
}
