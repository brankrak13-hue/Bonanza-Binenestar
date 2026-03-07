'use client';

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { Minus, Plus, Trash2, ShoppingCart, Loader2, CreditCard, ShieldCheck, AlertCircle, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUser, useFirestore } from "@/firebase";
import AuthModal from "@/components/AuthModal";
import { useLanguage } from "@/context/LanguageContext";
import { collection, doc, setDoc } from "firebase/firestore";

interface CartSidebarProps { open: boolean; onOpenChange: (open: boolean) => void; }

export default function CartSidebar({ open, onOpenChange }: CartSidebarProps) {
  const { cartItems, removeFromCart, updateQuantity, totalPrice, cartCount } = useCart();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const { t } = useLanguage();

  /**
   * Crea un registro de pedido preventivo en Firestore antes de ir a Stripe.
   * Esto nos permite rastrear intentos de compra y asociarlos con la sesión.
   */
  const handleOrderCreation = async () => {
    if (!user || !db) return null;
    const orderId = `order_${Date.now()}`;
    const orderRef = doc(db, 'userProfiles', user.uid, 'orders', orderId);
    
    const orderData = {
      id: orderId,
      userProfileId: user.uid,
      orderDate: new Date().toISOString(),
      totalAmount: totalPrice,
      status: 'pending', // Se actualizará a 'shipped' (confirmada) vía Webhook o redirección exitosa
      paymentStatus: 'pending_stripe',
      items: cartItems.map(item => ({
        productId: item.id,
        name: item.title,
        quantity: item.quantity,
        price: item.price
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await setDoc(orderRef, orderData);
      return orderId;
    } catch (err) {
      console.error("Error al pre-registrar pedido:", err);
      return null;
    }
  };

  /**
   * Inicia el flujo de Stripe Checkout (Página de pago hospedada)
   */
  const handleStripeCheckout = async () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    setIsRedirecting(true);
    
    try {
      // 1. Pre-registramos el pedido en nuestra base de datos
      const orderId = await handleOrderCreation();
      if (!orderId) throw new Error("No se pudo iniciar el proceso de reserva.");

      // 2. Solicitamos a nuestra API la URL de la página de pago de Stripe
      const response = await fetch('/api/checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems,
          userId: user.uid,
          userEmail: user.email,
          orderId: orderId
        }),
      });

      const data = await response.json();
      
      if (data.url) {
        // Redirigimos al usuario a la pasarela segura de Stripe
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Error al conectar con la pasarela de pagos.');
      }
    } catch (error: any) {
      toast({ 
        variant: "destructive", 
        title: "Error de Conexión", 
        description: error.message || "No se pudo conectar con Stripe. Intenta de nuevo."
      });
      setIsRedirecting(false);
    }
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="flex flex-col sm:max-w-md w-full border-none shadow-2xl rounded-l-[2.5rem] bg-white p-0 overflow-hidden">
          <SheetHeader className="p-8 border-b bg-primary/5">
            <SheetTitle className="text-3xl font-headline font-bold flex items-center gap-3">
              <ShoppingCart className="w-6 h-6 text-primary" />
              {t('cart.title')}
              <span className="text-sm font-body font-normal text-muted-foreground ml-auto bg-white px-3 py-1 rounded-full border">
                {cartCount} items
              </span>
            </SheetTitle>
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
                  <div className="p-6 bg-amber-50 border border-amber-200 rounded-[2rem] flex gap-4 items-start animate-in fade-in slide-in-from-top-4">
                    <AlertCircle className="w-5 h-5 text-amber-600 mt-1" />
                    <div className="space-y-2">
                      <p className="text-sm font-bold text-amber-900">Inicia sesión para finalizar tu reserva</p>
                      <Button variant="link" className="p-0 h-auto text-amber-700 font-bold underline" onClick={() => setIsAuthModalOpen(true)}>ENTRAR AQUÍ</Button>
                    </div>
                  </div>
                )}
                
                <div className="space-y-4">
                  {cartItems.map(item => (
                    <div key={item.id} className="p-5 rounded-[2rem] bg-secondary/10 border border-transparent hover:border-primary/10 flex items-center justify-between transition-all group">
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
                
                <div className="space-y-3">
                  <Button 
                    onClick={handleStripeCheckout} 
                    className="w-full h-16 rounded-2xl btn-primary shadow-[0_20px_40px_-10px_rgba(41,102,84,0.4)] flex items-center justify-center gap-3"
                    disabled={isRedirecting || cartItems.length === 0}
                  >
                    {isRedirecting ? (
                      <>
                        <Loader2 className="animate-spin w-5 h-5" />
                        Abriendo Pasarela de Pago...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" /> 
                        Proceder al Pago
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </Button>
                  
                  <p className="text-[9px] text-center text-gray-400 uppercase tracking-widest px-4">
                    Serás redirigido a la plataforma segura de Stripe para completar tu pago con Tarjeta o Google Pay.
                  </p>
                </div>
                <div className="flex justify-center items-center gap-2 opacity-30 mt-2">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  <span className="text-[8px] font-bold uppercase tracking-widest">Ritual de Pago Encriptado por Stripe</span>
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
