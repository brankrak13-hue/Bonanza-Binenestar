"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ShoppingBag, User, Menu, X } from "lucide-react";
import { LotusIcon } from "@/components/icons/LotusIcon";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBannerVisible, setIsBannerVisible] = useState(true);

  const navItems = [
    { name: "INICIO", href: "#home" },
    { name: "SERVICIOS", href: "#services" },
    { name: "SOBRE NOSOTROS", href: "#about" },
    { name: "CONTACTO", href: "#contact" },
  ];

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

      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
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

              <button type="button" className="p-2 text-foreground/80 hover:text-foreground transition-colors relative">
                <ShoppingBag className="w-5 h-5" />
              </button>

              <button type="button" className="p-2 text-foreground/80 hover:text-foreground transition-colors">
                <User className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`fixed inset-0 z-50 transform ${isMenuOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out lg:hidden`}>
          <div className="fixed inset-0 bg-black/30" onClick={() => setIsMenuOpen(false)}></div>
          <div className="relative w-4/5 max-w-xs h-full bg-background shadow-xl p-6">
            <button
              type="button"
              className="absolute top-5 right-5 p-2 text-gray-700 hover:text-black"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Cerrar menú"
            >
              <X className="w-6 h-6" />
            </button>
            <nav className="flex flex-col space-y-6 mt-16">
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
      </header>
    </>
  );
}
