'use client';

import { useState } from "react";
import dynamic from 'next/dynamic';
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
import { Minus, Plus, Trash2, ShoppingCart, Loader2, User, CreditCard, ShieldCheck, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUser, useFirestore } from "@/firebase";
import AuthModal from "@/components/AuthModal";
import { useLanguage } from "@/context/LanguageContext";
import { collection, doc, setDoc } from "firebase/firestore";

const GooglePayButton = dynamic(
  () => import('@google-pay/button-react'),
  { 
    ssr: false,
    loading: () => <div className="w-full h-14 rounded-2xl animate-pulse bg-secondary/50" />
  }
);

interface CartSidebarProps { open: boolean; onOpenChange: (open: boolean) => void; }

export default function CartSidebar({ open, onOpenChange }: CartSidebarProps) {
  const { cartItems, removeFromCart, updateQuantity, totalPrice, cartCount, clearCart } = useCart();
  const [processingPayment, setProcessingPayment] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleOrderCreation = async () => {
    if (!user || !db) return;
    const orderId = `order_${Date.now()}`;
    const orderRef = doc(db, 'userProfiles', user.uid, 'orders', orderId);
    
    await setDoc(orderRef, {
      id: orderId,
      userProfileId: user.uid,
      orderDate: new Date().toISOString(),
      totalAmount: totalPrice,
      status: 'pending',
      paymentStatus: 'paid',
      shippingAddressId: 'digital_service',
      billingAddressId: 'digital_service',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    for (const item of cartItems) {
      const itemRef = doc(collection(orderRef, 'orderItems'));
      await setDoc(itemRef, {
        id: itemRef.id,
        orderId: orderId,
        productId: item.id,
        productName: item.title,
        quantity: item.quantity,
        priceAtPurchase: item.price,
        duration: item.duration,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  };

  const handlePaymentSuccess = async (paymentData?: any) => {
    setProcessingPayment(true);
    try {
      const response = await fetch('/api/process-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethodData: paymentData?.paymentMethodData,
          amount: totalPrice,
          userId: user?.uid || 'guest',
        }),
      });

      const result = await response.json();
      if (result.success) {
        await handleOrderCreation();
        toast({ title: "¡Ritual Confirmado!", description: "Tu reserva ha sido registrada con éxito." });
        clearCart();
        onOpenChange(false);
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error en proceso", description: error.message });
    } finally {
      setProcessingPayment(false);
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
                    <div key={item.id} className="p-5 rounded-[2rem] bg-secondary/10 border border-transparent hover:border-primary/10 flex items-center justify-between">
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
                      <Button variant="ghost" size="icon" className="text-gray-300 hover:text-destructive" onClick={() => removeFromCart(item.id)}><Trash2 className="h-5 w-5" /></Button>
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
                  <GooglePayButton
                    environment="TEST"
                    buttonType="buy"
                    buttonColor="black"
                    buttonSizeMode="fill"
                    className="w-full h-14 rounded-2xl overflow-hidden shadow-lg"
                    paymentRequest={{
                      apiVersion: 2,
                      apiVersionMinor: 0,
                      allowedPaymentMethods: [{
                        type: 'CARD',
                        parameters: {
                          allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                          allowedCardNetworks: ['VISA', 'MASTERCARD', 'AMEX'],
                        },
                        tokenizationSpecification: {
                          type: 'PAYMENT_GATEWAY',
                          parameters: {
                            'gateway': 'stripe',
                            'stripe:version': '2020-08-27',
                            'stripe:publishableKey': process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_TYooMQauvdEDq54NiTphI7jx'
                          }
                        }
                      }],
                      merchantInfo: { merchantName: 'Bonanza Bienestar' },
                      transactionInfo: {
                        totalPriceStatus: 'FINAL',
                        totalPriceLabel: 'Total',
                        totalPrice: totalPrice.toFixed(2),
                        currencyCode: 'MXN',
                        countryCode: 'MX',
                      },
                    }}
                    onLoadPaymentData={handlePaymentSuccess}
                    onError={(err) => console.log("Google Pay log:", err)}
                  />

                  <Button 
                    onClick={() => handlePaymentSuccess()} 
                    className="w-full h-14 rounded-2xl bg-white border-2 border-primary/20 text-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-3 font-bold uppercase text-[10px] tracking-widest"
                    disabled={processingPayment}
                  >
                    {processingPayment ? <Loader2 className="animate-spin w-5 h-5" /> : <><CreditCard className="w-5 h-5" /> Pago con Tarjeta (TEST)</>}
                  </Button>
                </div>
                <div className="flex justify-center items-center gap-2 opacity-30 mt-2">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  <span className="text-[8px] font-bold uppercase tracking-widest">Ritual de Pago Encriptado</span>
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