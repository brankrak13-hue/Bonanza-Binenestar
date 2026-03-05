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
import { Minus, Plus, Trash2, ShoppingCart, Loader2, User, CreditCard, ShieldCheck } from "lucide-react";
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

interface CartSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

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
    
    const orderData = {
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
    };

    try {
      await setDoc(orderRef, orderData);

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
    } catch (error) {
      console.error("Error creating order in Firestore:", error);
    }
  };

  const handlePayment = async (paymentData: any) => {
    if (totalPrice === 0) return;
    setProcessingPayment(true);
    
    try {
      const response = await fetch('/api/process-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentMethodData: paymentData?.paymentMethodData,
          amount: totalPrice,
          userId: user?.uid || 'guest',
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        await handleOrderCreation();
        toast({
          title: t('cart.success'),
          description: t('cart.successDesc'),
        });
        clearCart();
        onOpenChange(false);
      } else {
        throw new Error(result.message || t('cart.errorGeneric'));
      }
    } catch (error: any) {
      console.error("Payment error detail:", error);
      toast({
        variant: "destructive",
        title: t('cart.error'),
        description: error.message || t('cart.errorRetry'),
      });
      // En modo desarrollo, si el pago falla, permitimos la opción de simular el éxito
    } finally {
      setProcessingPayment(false);
    }
  };

  const simulateSuccess = async () => {
    if (totalPrice === 0) return;
    setProcessingPayment(true);
    
    // Simular latencia de red
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      await handleOrderCreation();
      toast({
        title: "¡Reserva Confirmada!",
        description: "Tu pago ha sido procesado exitosamente en modo prueba.",
      });
      clearCart();
      onOpenChange(false);
    } catch (err) {
      toast({ variant: "destructive", title: "Error al registrar el pedido" });
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
                {cartCount} {cartCount === 1 ? 'item' : 'items'}
              </span>
            </SheetTitle>
          </SheetHeader>
          
          {cartItems.length === 0 ? (
            <div className="flex-grow flex flex-col items-center justify-center text-center p-12 space-y-6">
               <div className="bg-secondary/30 p-10 rounded-full animate-pulse">
                <ShoppingCart className="w-20 h-20 text-primary/20"/>
               </div>
              <div>
                <p className="text-2xl font-bold font-headline text-gray-800">{t('cart.empty')}</p>
                <p className="text-muted-foreground mt-2 italic max-w-[240px] mx-auto">{t('cart.emptyDesc')}</p>
              </div>
              <SheetClose asChild>
                  <Button variant="outline" className="mt-4 rounded-full px-10 h-14 border-primary/20 text-primary hover:bg-primary hover:text-white transition-all font-bold tracking-widest uppercase text-xs">
                    {t('cart.continue')}
                  </Button>
              </SheetClose>
            </div>
          ) : (
            <>
              <div className="flex-grow overflow-y-auto p-6 space-y-6 custom-scrollbar">
                {!user && (
                  <div className="p-6 bg-amber-50/50 border border-amber-200 rounded-[2rem] animate-fadeIn">
                    <div className="flex items-start gap-4">
                      <div className="bg-white p-2.5 rounded-full shadow-sm">
                        <User className="w-5 h-5 text-amber-600" />
                      </div>
                      <div className="space-y-3">
                        <p className="text-sm font-bold text-amber-900">{t('cart.authPrompt')}</p>
                        <p className="text-xs text-amber-700/70 leading-relaxed">{t('cart.authDesc')}</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-10 rounded-xl text-[10px] font-bold tracking-[0.2em] uppercase border-amber-200 text-amber-700 hover:bg-amber-600 hover:text-white transition-all bg-white"
                          onClick={() => setIsAuthModalOpen(true)}
                        >
                          {t('cart.login')}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="space-y-4">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex items-center justify-between gap-4 p-5 rounded-[2rem] bg-secondary/10 border border-transparent hover:border-primary/10 transition-all group relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/20" />
                      <div className="flex-grow">
                        <h4 className="font-bold text-gray-900 tracking-tight text-lg">{item.title}</h4>
                        <p className="text-[10px] text-primary/60 uppercase tracking-[0.2em] font-bold mt-1">
                          {item.subtitle} • {item.duration} {t('services.min')}
                        </p>
                        <div className="flex items-center gap-4 mt-4">
                           <div className="flex items-center gap-2 bg-white rounded-full p-1.5 border border-gray-100 shadow-sm">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 rounded-full hover:bg-secondary" 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 rounded-full hover:bg-secondary" 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-lg font-bold text-primary font-headline">${(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-gray-300 hover:text-destructive hover:bg-destructive/5 rounded-full h-12 w-12 transition-all" 
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <SheetFooter className="mt-auto p-8 border-t bg-gray-50/50 space-y-6 flex flex-col">
                <div className="w-full space-y-6">
                  <div className="flex justify-between items-end border-b border-dashed border-gray-200 pb-4">
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">{t('cart.subtotal')}</span>
                    <span className="text-4xl font-bold font-headline text-primary">${totalPrice.toLocaleString()} <span className="text-xs font-body font-normal text-gray-400 ml-1">MXN</span></span>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <GooglePayButton
                      environment="TEST"
                      buttonType="checkout"
                      buttonColor="black"
                      buttonSizeMode="fill"
                      className="w-full h-16 rounded-2xl overflow-hidden shadow-xl hover:shadow-primary/20 transition-all"
                      paymentRequest={{
                        apiVersion: 2,
                        apiVersionMinor: 0,
                        allowedPaymentMethods: [
                          {
                            type: 'CARD',
                            parameters: {
                              allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                              allowedCardNetworks: ['AMEX', 'DISCOVER', 'INTERAC', 'JCB', 'MASTERCARD', 'VISA'],
                            },
                            tokenizationSpecification: {
                              type: 'PAYMENT_GATEWAY',
                              parameters: {
                                gateway: 'stripe',
                                'stripe:version': '2020-08-27',
                                'stripe:publishableKey': process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_TYooMQauvdEDq54NiTphI7jx',
                              },
                            },
                          },
                        ],
                        merchantInfo: {
                          merchantName: 'Bonanza Arte & Bienestar',
                        },
                        transactionInfo: {
                          totalPriceStatus: 'FINAL',
                          totalPriceLabel: 'Total',
                          totalPrice: totalPrice.toFixed(2),
                          currencyCode: 'MXN',
                          countryCode: 'MX',
                        },
                      }}
                      onLoadPaymentData={handlePayment}
                      onError={(err) => {
                        console.error("Google Pay Internal Error:", err);
                        // No mostramos el toast destructivo aquí porque a veces el error BIBED_08 se puede ignorar
                      }}
                    />

                    <Button 
                      onClick={simulateSuccess} 
                      className="w-full h-14 rounded-2xl bg-white border-2 border-primary/20 text-primary hover:bg-primary/5 hover:border-primary transition-all flex items-center justify-center gap-3 group shadow-sm"
                      disabled={processingPayment}
                    >
                      {processingPayment ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <CreditCard className="w-5 h-5 group-hover:scale-110 transition-transform" />
                          <span className="text-xs font-bold tracking-[0.2em] uppercase">Pagar con Tarjeta (TEST)</span>
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="flex items-center justify-center gap-3 opacity-40">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                    <span className="text-[8px] font-bold tracking-[0.4em] uppercase">Secure Ritual Encryption</span>
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
