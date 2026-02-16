"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ShoppingBag, User, Menu, X, Star } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBannerVisible, setIsBannerVisible] = useState(true);

  const navItems = [
    { name: "PERFUME", href: "#perfume" },
    { name: "MAQUILLAJE", href: "#makeup" },
    { name: "TRATAMIENTO", href: "#skincare" },
    { name: "SPAS", href: "#spas" },
    { name: "SERVICIOS", href: "#services" },
    { name: "LA MAISON BONANZA", href: "#maison" },
  ];

  return (
    <>
      {isBannerVisible && (
        <div className="bg-black text-white text-center py-2.5 px-4 text-xs tracking-wide relative">
          <p>Descubre los nuevos tratamientos exclusivos de Bonanza - Envío gratuito en pedidos superiores a 50€</p>
          <button 
            type="button" 
            onClick={() => setIsBannerVisible(false)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:opacity-70"
            aria-label="Cerrar banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            <div className="lg:hidden">
              <button
                type="button"
                className="p-2 -ml-2 text-gray-700 hover:text-black transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Abrir menú"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 flex justify-center lg:justify-start">
              <Link href="/" className="flex items-center group">
                <span className="font-headline text-3xl font-semibold tracking-wider text-gray-900">BONANZA</span>
                <Star className="w-5 h-5 ml-2 text-primary group-hover:scale-110 transition-transform" fill="currentColor" />
              </Link>
            </div>

            <nav className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="nav-link text-xs tracking-widest font-medium text-gray-700 hover:text-black py-2"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="flex-1 flex items-center justify-end space-x-2 sm:space-x-4">
              <button type="button" className="p-2 text-gray-700 hover:text-black transition-colors">
                <Search className="w-5 h-5" />
              </button>

              <button type="button" className="p-2 text-gray-700 hover:text-black transition-colors relative">
                <ShoppingBag className="w-5 h-5" />
              </button>

              <button type="button" className="p-2 text-gray-700 hover:text-black transition-colors">
                <User className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`fixed inset-0 z-50 transform ${isMenuOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out lg:hidden`}>
          <div className="fixed inset-0 bg-black/30" onClick={() => setIsMenuOpen(false)}></div>
          <div className="relative w-4/5 max-w-xs h-full bg-white shadow-xl p-6">
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
