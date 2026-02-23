"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingBag, User, Menu, X, LogOut, Languages } from "lucide-react";
import { LotusIcon } from "@/components/icons/LotusIcon";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import CartSidebar from "@/components/CartSidebar";
import AuthModal from "@/components/AuthModal";
import { Badge } from "@/components/ui/badge";
import { useUser, useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
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
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { cartCount } = useCart();
  const { user, isUserLoading } = useUser();
  const { t, language, setLanguage } = useLanguage();
  const auth = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: t('nav.home'), href: "/" },
    { name: t('nav.services'), href: "/servicios" },
    { name: t('nav.advisor'), href: "/agente-virtual" },
    { name: t('nav.about'), href: "/#about" },
    { name: t('nav.contact'), href: "/#contact" },
  ];

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast({ title: t('nav.signOut'), description: "..." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "..." });
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'es' ? 'en' : 'es');
  };

  return (
    <>
      {isBannerVisible && (
        <div className="bg-primary text-primary-foreground text-center py-2 px-4 text-[10px] md:text-xs tracking-[0.2em] uppercase font-semibold relative z-50">
          <p>{language === 'es' ? 'Experimenta la sanación holística. ¡Agenda hoy!' : 'Experience holistic healing. Book today!'}</p>
          <button 
            type="button" 
            onClick={() => setIsBannerVisible(false)}
            className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
            aria-label="Close banner"
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
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 flex justify-center lg:justify-start">
                <Link href="/" className="flex flex-col items-center group">
                    <div className="flex items-center">
                        <LotusIcon className="w-7 h-7 md:w-8 h-8 text-primary transition-transform duration-700 group-hover:rotate-[360deg]" />
                        <span className="font-headline text-2xl md:text-3xl lg:text-4xl font-bold tracking-wider text-foreground ml-2">BONANZA</span>
                    </div>
                    <span className="text-[8px] md:text-[10px] font-semibold tracking-[0.3em] text-primary/80 -mt-1">{language === 'es' ? 'ARTE & BIENESTAR' : 'ART & WELLNESS'}</span>
                </Link>
            </div>

            <nav className="hidden lg:flex items-center space-x-10">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="nav-link text-[11px] tracking-[0.2em] font-bold text-foreground/60 hover:text-primary py-2"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="flex-1 flex items-center justify-end space-x-1 md:space-x-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleLanguage} 
                className="text-foreground/60 hover:text-primary transition-all rounded-full"
              >
                <span className="text-[10px] font-bold">{language.toUpperCase()}</span>
              </Button>

              <button 
                type="button" 
                className="p-2 text-foreground/60 hover:text-primary transition-all duration-300 hover:scale-110 relative" 
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[8px] animate-in zoom-in-50 duration-300">
                    {cartCount}
                  </Badge>
                )}
              </button>

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button type="button" className="p-2 text-primary hover:text-primary/80 transition-all duration-300 hover:scale-110">
                      <User className="w-5 h-5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 p-2 glass-card animate-scaleIn">
                    <DropdownMenuLabel className="pb-3">
                      <p className="text-sm font-bold text-foreground">{language === 'es' ? 'Hola' : 'Hello'}, {user.displayName || 'User'}</p>
                      <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider truncate">{user.email}</p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="cursor-pointer focus:bg-primary/10 rounded-md py-2 px-3">
                      <Link href="/perfil" className="w-full text-xs font-semibold tracking-wider">{t('nav.myProfile')}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer focus:bg-primary/10 rounded-md py-2 px-3">
                      <Link href="/pedidos" className="w-full text-xs font-semibold tracking-wider">{t('nav.myAppointments')}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-destructive cursor-pointer focus:bg-destructive/10 rounded-md py-2 px-3 font-semibold text-xs tracking-wider">
                      <LogOut className="mr-2 h-4 w-4" />
                      {t('nav.signOut')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <button 
                  type="button" 
                  className="p-2 text-foreground/60 hover:text-primary transition-all duration-300 hover:scale-110"
                  onClick={() => setIsAuthModalOpen(true)}
                  disabled={isUserLoading}
                >
                  <User className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div 
        className={cn(
          "fixed inset-0 z-[60] bg-black/60 transition-opacity duration-500 lg:hidden",
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsMenuOpen(false)}
      ></div>

      {/* Mobile Menu Drawer */}
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
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <nav className="flex flex-col gap-8">
            {navItems.map((item, idx) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-xl font-headline font-semibold tracking-wide text-foreground/80 hover:text-primary transition-colors animate-fadeIn"
                style={{ animationDelay: `${idx * 100}ms` }}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Button variant="outline" onClick={toggleLanguage} className="mt-4 justify-start gap-3 rounded-full h-12">
              <Languages className="w-5 h-5 text-primary" />
              <span className="font-bold">{language === 'es' ? 'English (EN)' : 'Español (ES)'}</span>
            </Button>
          </nav>
        </div>
      </div>
      
      <CartSidebar open={isCartOpen} onOpenChange={setIsCartOpen} />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
}
