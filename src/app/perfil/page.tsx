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
import { Loader2, User, Save, Phone, Mail } from 'lucide-react';

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
        setFirstName(data.first_name || '');
        setLastName(data.last_name || '');
        setPhoneNumber(data.phone_number || '');
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

  const displayName = user.user_metadata?.full_name || user.email;

  return (
    <main className="min-h-screen bg-background animate-in fade-in duration-1000">
      <Header />
      <div className="max-w-screen-md mx-auto px-4 py-20 sm:py-32">
        <div className="text-center mb-12">
          <p className="text-sm tracking-widest uppercase text-primary font-bold mb-2">{t('profile.subtitle')}</p>
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-gray-900">{t('profile.title')}</h1>
        </div>

        <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden glass-card">
          <CardHeader className="bg-primary/5 pb-10 pt-12 text-center">
            <div className="mx-auto bg-white rounded-full p-4 w-fit mb-4 shadow-sm">
              <User className="w-10 h-10 text-primary" />
            </div>
            <CardTitle>{displayName}</CardTitle>
            <CardDescription>{t('profile.desc')}</CardDescription>
          </CardHeader>
          <CardContent className="p-8 sm:p-12">
            <form onSubmit={handleSave} className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label htmlFor="firstName" className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 ml-1">{t('profile.firstName')}</Label>
                  <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="bg-secondary/20 border-transparent focus:border-primary/30 h-14 rounded-2xl" required />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="lastName" className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 ml-1">{t('profile.lastName')}</Label>
                  <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} className="bg-secondary/20 border-transparent focus:border-primary/30 h-14 rounded-2xl" required />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="email" className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 ml-1">{t('profile.email')}</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input id="email" value={user.email || ''} disabled className="bg-secondary/10 border-transparent h-14 rounded-2xl pl-12 cursor-not-allowed opacity-70" />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="phone" className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 ml-1">{t('profile.phone')}</Label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input id="phone" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="bg-secondary/20 border-transparent focus:border-primary/30 h-14 rounded-2xl pl-12" placeholder="Ej: +52 984 000 0000" />
                </div>
              </div>

              <Button type="submit" className="w-full btn-primary h-16 text-sm" disabled={isSaving}>
                {isSaving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
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
