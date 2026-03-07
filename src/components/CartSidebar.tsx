
'use client';

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
  SheetDescription
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { Minus, Plus, Trash2, ShoppingCart, ShieldCheck, AlertCircle, Sparkles } from "lucide-react";
import { useUser } from "@/firebase";
import AuthModal from "@/components/AuthModal";
import { useLanguage } from "@/context/LanguageContext";
import StripeBuyButton from "@/components/StripeBuyButton";

interface CartSidebarProps { open: boolean; onOpenChange: (open: boolean) => void; }

export default function CartSidebar({ open, onOpenChange }: CartSidebarProps) {
  const { cartItems, removeFromCart, updateQuantity, totalPrice, cartCount } = useCart();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user } = useUser();
  const { t } = useLanguage();

  const stripeButtonId = "buy_btn_1T8Egc3RNCg5Dgsj5HcwJeIN";
  const stripePubKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_live_51T4Cck3RNCg5DgsjcSYMdryVssd0TIIZhJS1Suh38gZhDeHaHXdwptI3ou42x90huN7jMjonmZ4FGMBVwA7Dcn2A00pSB2Z1uH";

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent 
          className="flex flex-col sm:max-w-md w-full border-none shadow-2xl rounded-l-[2rem] bg-white p-0 overflow-hidden"
          aria-describedby={undefined}
        >
          <SheetHeader className="p-8 border-b bg-primary/5">
            <SheetTitle className="text-3xl font-headline font-bold flex items-center gap-3">
              <ShoppingCart className="w-6 h-6 text-primary" />
              {t('cart.title')}
              <span className="text-sm font-body font-normal text-muted-foreground ml-auto bg-white px-3 py-1 rounded-full border">
                {cartCount} items
              </span>
            </SheetTitle>
            <SheetDescription className="sr-only">
              Resumen de tus servicios de bienestar.
            </SheetDescription>
          </SheetHeader>
          
          {cartItems.length === 0 ? (
            <div className="flex-grow flex flex-col items-center justify-center p-12 text-center">
              <ShoppingCart className="w-20 h-20 text-primary/10 mb-6"/>
              <p className="text-2xl font-bold font-headline text-gray-800">{t('cart.empty')}</p>
              <SheetClose asChild>
                <Button variant="outline" className="mt-6 rounded-full px-10 h-12 border-primary/20 text-primary">
                  {t('cart.continue')}
                </Button>
              </SheetClose>
            </div>
          ) : (
            <>
              <div className="flex-grow overflow-y-auto p-6 space-y-6">
                {!user && (
                  <div className="p-6 bg-amber-50 border border-amber-200 rounded-[2rem] flex gap-4 items-start">
                    <AlertCircle className="w-5 h-5 text-amber-600 mt-1" />
                    <div className="space-y-2">
                      <p className="text-sm font-bold text-amber-900">Inicia sesión para guardar tu historial</p>
                      <Button variant="link" className="p-0 h-auto text-amber-700 font-bold underline" onClick={() => setIsAuthModalOpen(true)}>ENTRAR AQUÍ</Button>
                    </div>
                  </div>
                )}
                
                <div className="space-y-4">
                  {cartItems.map(item => (
                    <div key={item.id} className="p-5 rounded-[1.5rem] bg-secondary/10 border border-transparent hover:border-primary/10 flex items-center justify-between transition-all group">
                      <div className="flex-grow">
                        <h4 className="font-bold text-gray-900">{item.title}</h4>
                        <p className="text-[10px] text-primary/60 uppercase font-bold">{item.duration} {t('services.min')}</p>
                        <div className="flex items-center gap-4 mt-3">
                          <div className="flex items-center gap-2 bg-white rounded-full border p-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full" onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus className="h-3 w-3"/></Button>
                            <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full" onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus className="h-3 w-3"/></Button>
                          </div>
                          <p className="text-lg font-bold text-primary">${(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="text-gray-300 hover:text-destructive transition-colors" onClick={() => removeFromCart(item.id)}><Trash2 className="h-5 w-5" /></Button>
                    </div>
                  ))}
                </div>
              </div>

              <SheetFooter className="p-8 border-t bg-gray-50/50 flex flex-col gap-4">
                <div className="flex justify-between items-end border-b border-dashed pb-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Total a pagar</span>
                  <span className="text-4xl font-bold font-headline text-primary">${totalPrice.toLocaleString()} <span className="text-xs font-body font-normal">MXN</span></span>
                </div>
                
                <div className="space-y-4 text-center">
                  <p className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] mb-4 flex items-center justify-center gap-2">
                    <Sparkles className="w-3 h-3" />
                    Completa tu reserva segura
                    <Sparkles className="w-3 h-3" />
                  </p>
                  
                  {/* Botón de Compra Directo de Stripe */}
                  <StripeBuyButton buttonId={stripeButtonId} publishableKey={stripePubKey} />
                  
                  <p className="text-[9px] text-gray-400 italic mt-2">
                    "Al pagar, serás redirigido a la pasarela oficial de Stripe."
                  </p>
                </div>
                
                <div className="flex justify-center items-center gap-2 opacity-30 mt-4">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  <span className="text-[8px] font-bold uppercase tracking-widest">Protegido por Stripe Checkout</span>
                </div>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
}
