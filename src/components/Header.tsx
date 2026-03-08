"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { User, Menu, X, LogOut, Languages, LayoutDashboard } from "lucide-react";
import { LotusIcon } from "@/components/icons/LotusIcon";
import { useLanguage } from "@/context/LanguageContext";
import AuthModal from "@/components/AuthModal";
import { useUser, useAuth, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { signOut } from "firebase/auth";
import { doc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  const { user, isUserLoading } = useUser();
  const { t, language, setLanguage } = useLanguage();
  const auth = useAuth();
  const db = useFirestore();
  const { toast } = useToast();

  const adminRef = useMemoFirebase(() => (user && db ? doc(db, 'roles_admin', user.uid) : null), [user, db]);
  const { data: adminRole } = useDoc(adminRef);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: t('nav.home'), href: "/" },
    { name: t('nav.services'), href: "/servicios" },
    { name: t('nav.advisor'), href: "/agente-virtual" },
    { name: t('nav.about'), href: "/nosotros" },
    { name: t('nav.contact'), href: "/#contact" },
  ];

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast({ title: t('nav.signOut') });
    } catch (error) {
      toast({ variant: "destructive", title: "Error" });
    }
  };

  const toggleLanguage = useCallback(() => {
    setLanguage(language === 'es' ? 'en' : 'es');
  }, [language, setLanguage]);

  return (
    <>
      {isBannerVisible && (
        <div className="bg-primary text-primary-foreground text-center py-2 px-4 text-[10px] md:text-xs tracking-[0.2em] uppercase font-bold relative z-50">
          <p>{language === 'es' ? 'Experimenta la sanación holística. ¡Agenda hoy!' : 'Experience holistic healing. Book today!'}</p>
          <button 
            type="button" 
            onClick={() => setIsBannerVisible(false)}
            className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
            aria-label="Cerrar banner"
          >
            <X className="w-3 h-3 md:w-4 h-4" />
          </button>
        </div>
      )}

      <header className={cn(
        "sticky top-0 z-40 transition-all duration-500",
        scrolled ? "bg-background/95 backdrop-blur-md shadow-lg h-20" : "bg-background h-24"
      )}>
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            
            <div className="lg:hidden flex-1">
              <button
                type="button"
                className="p-2 -ml-2 text-foreground/70 hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Abrir menú"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 flex justify-center lg:justify-start">
                <Link href="/" className="flex flex-col items-center group" aria-label="Bonanza Home">
                    <div className="flex items-center">
                        <LotusIcon className="w-7 h-7 md:w-8 h-8 text-primary transition-transform duration-700 group-hover:rotate-[360deg]" />
                        <span className="font-headline text-2xl md:text-3xl lg:text-4xl font-bold tracking-wider text-foreground ml-2">BONANZA</span>
                    </div>
                    <span className="text-[8px] md:text-[10px] font-bold tracking-[0.3em] text-primary -mt-1">{language === 'es' ? 'ARTE & BIENESTAR' : 'ART & WELLNESS'}</span>
                </Link>
            </div>

            <nav 
              className="hidden lg:flex items-center space-x-1"
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {navItems.map((item, idx) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  className="relative px-5 py-2.5 text-sm tracking-[0.1em] font-bold font-headline text-foreground/80 hover:text-primary transition-colors duration-300"
                >
                  <span className="relative z-10">{item.name}</span>
                  <AnimatePresence>
                    {hoveredIndex === idx && (
                      <motion.span
                        layoutId="nav-glow"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className="absolute inset-0 bg-primary/5 border border-primary/10 rounded-full shadow-[0_0_15px_rgba(41,102,84,0.1)]"
                      />
                    )}
                  </AnimatePresence>
                </Link>
              ))}
            </nav>

            <div className="flex-1 flex items-center justify-end space-x-1 md:space-x-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleLanguage} 
                className="text-foreground/80 hover:text-primary transition-all rounded-full"
                aria-label={`Cambiar a ${language === 'es' ? 'Inglés' : 'Español'}`}
              >
                <span className="text-[10px] font-bold">{language.toUpperCase()}</span>
              </Button>

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button 
                      type="button" 
                      className="p-2 text-primary hover:text-primary/80 transition-all duration-300 hover:scale-110"
                      aria-label="Perfil de usuario"
                    >
                      <User className="w-5 h-5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 p-2 glass-card animate-scaleIn">
                    <DropdownMenuLabel className="pb-3">
                      <p className="text-sm font-bold text-foreground">{language === 'es' ? 'Hola' : 'Hello'}, {user.displayName || 'User'}</p>
                      <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider truncate">{user.email}</p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    
                    {adminRole && (
                      <>
                        <DropdownMenuItem asChild className="cursor-pointer focus:bg-primary/10 rounded-md py-2 px-3 text-primary">
                          <Link href="/admin" className="w-full text-xs font-bold tracking-wider flex items-center gap-2">
                            <LayoutDashboard className="w-4 h-4" />
                            {t('admin.title')}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}

                    <DropdownMenuItem asChild className="cursor-pointer focus:bg-primary/10 rounded-md py-2 px-3">
                      <Link href="/perfil" className="w-full text-xs font-bold tracking-wider">{t('nav.myProfile')}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer focus:bg-primary/10 rounded-md py-2 px-3">
                      <Link href="/pedidos" className="w-full text-xs font-bold tracking-wider">{t('nav.myAppointments')}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-destructive cursor-pointer focus:bg-destructive/10 rounded-md py-2 px-3 font-bold text-xs tracking-wider">
                      <LogOut className="mr-2 h-4 w-4" />
                      {t('nav.signOut')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <button 
                  type="button" 
                  className="p-2 text-foreground/80 hover:text-primary transition-all duration-300 hover:scale-110"
                  onClick={() => setIsAuthModalOpen(true)}
                  disabled={isUserLoading}
                  aria-label="Iniciar sesión"
                >
                  <User className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div 
        className={cn(
          "fixed inset-0 z-[60] bg-black/60 transition-opacity duration-500 lg:hidden",
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsMenuOpen(false)}
      ></div>

      <div className={cn(
        "fixed inset-y-0 left-0 z-[70] w-[85%] max-w-sm transform bg-background shadow-2xl transition-transform duration-500 ease-in-out lg:hidden h-full flex flex-col",
        isMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-8 flex flex-col h-full">
          <div className="flex justify-between items-center mb-12">
            <div className="flex items-center">
              <LotusIcon className="w-6 h-6 text-primary" />
              <span className="font-headline text-xl font-bold ml-2">BONANZA</span>
            </div>
            <button
              type="button"
              className="p-2 text-foreground hover:bg-secondary rounded-full transition-colors"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Cerrar menú"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <nav className="flex flex-col gap-8">
            {navItems.map((item, idx) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-xl font-headline font-bold tracking-wide text-foreground/90 hover:text-primary transition-colors animate-fadeIn"
                style={{ animationDelay: `${idx * 100}ms` }}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {adminRole && (
               <Link
                href="/admin"
                className="text-xl font-headline font-bold text-primary flex items-center gap-2 animate-fadeIn"
                style={{ animationDelay: '500ms' }}
                onClick={() => setIsMenuOpen(false)}
              >
                <LayoutDashboard className="w-6 h-6" />
                {t('admin.title')}
              </Link>
            )}

            <Button variant="outline" onClick={toggleLanguage} className="mt-4 justify-start gap-3 rounded-full h-12 border-primary/20 text-primary font-bold">
              <Languages className="w-5 h-5 text-primary" />
              <span className="font-bold">{language === 'es' ? 'English (EN)' : 'Español (ES)'}</span>
            </Button>
          </nav>
        </div>
      </div>
      
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
}
