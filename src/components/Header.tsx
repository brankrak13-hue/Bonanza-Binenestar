"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ShoppingBag, User, Menu, X, LogOut } from "lucide-react";
import { LotusIcon } from "@/components/icons/LotusIcon";
import { useCart } from "@/context/CartContext";
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

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { cartCount } = useCart();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const { toast } = useToast();

  const navItems = [
    { name: "INICIO", href: "/" },
    { name: "SERVICIOS", href: "/servicios" },
    { name: "ASESOR IA", href: "/agente-virtual" },
    { name: "SOBRE NOSOTROS", href: "/#about" },
    { name: "CONTACTO", href: "/#contact" },
  ];

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast({ title: "Sesión cerrada", description: "Vuelve pronto." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "No se pudo cerrar la sesión." });
    }
  };

  return (
    <>
      {isBannerVisible && (
        <div className="bg-primary text-primary-foreground text-center py-2.5 px-4 text-xs tracking-wide relative">
          <p>Experimenta la sanación holística. ¡Agenda tu cita hoy!</p>
          <button 
            type="button" 
            onClick={() => setIsBannerVisible(false)}
            className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-70"
            aria-label="Cerrar banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-24">
            
            <div className="lg:hidden">
              <button
                type="button"
                className="p-2 -ml-2 text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Abrir menú"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 flex justify-center lg:justify-start">
                <Link href="/" className="flex flex-col items-center group -my-4">
                    <div className="flex items-center">
                        <LotusIcon className="w-8 h-8 text-primary transition-transform group-hover:rotate-12" />
                        <span className="font-headline text-4xl font-bold tracking-wider text-foreground ml-2">BONANZA</span>
                    </div>
                    <span className="text-xs font-medium tracking-[0.2em] text-foreground/80 -mt-1">ARTE & BIENESTAR</span>
                </Link>
            </div>

            <nav className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="nav-link text-sm tracking-widest font-medium text-foreground/80 hover:text-foreground py-2"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="flex-1 flex items-center justify-end space-x-2 sm:space-x-4">
              <button type="button" className="p-2 text-foreground/80 hover:text-foreground transition-colors">
                <Search className="w-5 h-5" />
              </button>

              <button type="button" className="p-2 text-foreground/80 hover:text-foreground transition-colors relative" onClick={() => setIsCartOpen(true)}>
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                    {cartCount}
                  </Badge>
                )}
              </button>

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button type="button" className="p-2 text-primary hover:text-primary/80 transition-colors">
                      <User className="w-5 h-5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <p className="text-sm font-medium">Hola, {user.displayName || 'Cliente'}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/perfil" className="cursor-pointer">Mi Perfil</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/pedidos" className="cursor-pointer">Mis Citas</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-destructive cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      Cerrar Sesión
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <button 
                  type="button" 
                  className="p-2 text-foreground/80 hover:text-foreground transition-colors"
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
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMenuOpen(false)}
      ></div>

      {/* Mobile Menu Drawer */}
      <div className={`fixed inset-y-0 left-0 z-50 w-3/4 max-w-xs transform bg-[#F3EFE8] shadow-xl transition-transform duration-300 ease-in-out lg:hidden ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} h-screen`}>
        <div className="p-6 h-full flex flex-col">
          <button
            type="button"
            className="absolute top-5 right-5 p-2 text-gray-700 hover:text-black"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Cerrar menú"
          >
            <X className="w-6 h-6" />
          </button>
          <nav className="flex flex-col gap-6 mt-16">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-4 py-2 text-base tracking-wider font-medium text-gray-800 hover:bg-gray-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      
      <CartSidebar open={isCartOpen} onOpenChange={setIsCartOpen} />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
}
