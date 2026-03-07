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
import { Minus, Plus, Trash2, ShoppingCart, ShieldCheck, AlertCircle, Loader2, ArrowRight } from "lucide-react";
import { useUser } from "@/firebase";
import AuthModal from "@/components/AuthModal";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/hooks/use-toast";

interface CartSidebarProps { open: boolean; onOpenChange: (open: boolean) => void; }

export default function CartSidebar({ open, onOpenChange }: CartSidebarProps) {
  const { cartItems, removeFromCart, updateQuantity, totalPrice, cartCount } = useCart();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useUser();
  const { t } = useLanguage();
  const { toast } = useToast();

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    
    setIsProcessing(true);
    try {
      const response = await fetch('/api/checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cartItems }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Error al conectar con Stripe');
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error de pago",
        description: err.message,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent 
          className="flex flex-col sm:max-w-md w-full border-none shadow-2xl rounded-l-[2.5rem] bg-white p-0 overflow-hidden"
          aria-describedby={undefined}
        >
          <SheetHeader className="p-6 border-b bg-primary/5">
            <SheetTitle className="text-xl font-headline font-bold flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <ShoppingCart className="w-5 h-5 text-primary" />
              </div>
              {t('cart.title')}
              <span className="text-xs font-bold text-primary ml-auto uppercase tracking-widest bg-white px-3 py-1 rounded-full shadow-sm">
                {cartCount} items
              </span>
            </SheetTitle>
            <SheetDescription className="sr-only">
              Resumen de tus servicios de bienestar.
            </SheetDescription>
          </SheetHeader>
          
          {cartItems.length === 0 ? (
            <div className="flex-grow flex flex-col items-center justify-center p-12 text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full" />
                <ShoppingCart className="w-20 h-20 text-primary/10 relative z-10"/>
              </div>
              <p className="text-xl font-bold font-headline text-gray-800">{t('cart.empty')}</p>
              <SheetClose asChild>
                <Button variant="outline" className="mt-6 rounded-full px-10 h-12 border-primary/20 text-primary font-bold tracking-widest text-[10px] uppercase">
                  {t('cart.continue')}
                </Button>
              </SheetClose>
            </div>
          ) : (
            <>
              <div className="flex-grow overflow-y-auto p-6 space-y-6">
                {!user && (
                  <div className="p-5 bg-amber-50 border border-amber-200/50 rounded-2xl flex gap-4 items-start animate-in fade-in slide-in-from-top-2">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-amber-900 tracking-tight">Guarda tu ritual en tu cuenta</p>
                      <button onClick={() => setIsAuthModalOpen(true)} className="text-[10px] text-amber-700 font-bold underline uppercase tracking-widest hover:text-amber-800 transition-colors">Iniciar sesión aquí</button>
                    </div>
                  </div>
                )}
                
                <div className="space-y-4">
                  {cartItems.map(item => (
                    <div key={item.id} className="p-6 rounded-[2rem] bg-secondary/10 border border-transparent hover:border-primary/20 hover:bg-white hover:shadow-xl hover:shadow-primary/5 flex items-center justify-between transition-all duration-500 group">
                      <div className="flex-grow">
                        <h4 className="font-bold text-lg text-gray-900 tracking-tight leading-tight">{item.title}</h4>
                        <p className="text-[10px] text-primary/60 uppercase font-black tracking-widest mt-1 mb-3">{item.duration} {t('services.min')}</p>
                        <div className="flex items-center gap-5">
                          <div className="flex items-center gap-2 bg-white rounded-full border border-gray-100 p-1 shadow-sm">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary transition-colors" 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3"/>
                            </Button>
                            <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary transition-colors" 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3"/>
                            </Button>
                          </div>
                          <p className="text-2xl font-bold text-primary font-headline">${(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-gray-300 hover:text-destructive hover:bg-destructive/5 transition-all rounded-full shrink-0 h-10 w-10 ml-2" 
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <SheetFooter className="p-10 border-t bg-white flex flex-col gap-10 min-h-[280px]">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 block">Inversión Total</span>
                  <div className="flex items-baseline gap-3">
                    <span className="text-5xl font-bold font-headline text-primary">${totalPrice.toLocaleString()}</span>
                    <span className="text-sm font-bold text-gray-400">MXN</span>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <Button 
                    className="w-full btn-primary h-16 rounded-2xl text-xs flex items-center justify-center gap-3 shadow-[0_20px_40px_-10px_rgba(41,102,84,0.3)] hover:shadow-[0_25px_50px_-12px_rgba(41,102,84,0.4)] transition-all" 
                    disabled={isProcessing}
                    onClick={handleCheckout}
                  >
                    {isProcessing ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        CONFIRMAR Y PAGAR
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                  
                  <div className="flex flex-col items-center gap-4">
                    <p className="text-[10px] text-gray-400 italic text-center px-6 leading-relaxed">
                      "Al proceder, serás redirigido al portal seguro de Stripe para finalizar tu ritual."
                    </p>
                    <div className="flex justify-center items-center gap-2 opacity-40">
                      <ShieldCheck className="w-4 h-4 text-primary" />
                      <span className="text-[9px] font-black uppercase tracking-[0.2em]">Secured by Stripe</span>
                    </div>
                  </div>
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
