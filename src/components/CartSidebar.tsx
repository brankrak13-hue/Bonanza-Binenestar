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
import { Minus, Plus, Trash2, ShoppingCart, Loader2, User, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUser, useFirestore } from "@/firebase";
import AuthModal from "@/components/AuthModal";
import { useLanguage } from "@/context/LanguageContext";
import { collection, doc, setDoc } from "firebase/firestore";

const GooglePayButton = dynamic(
  () => import('@google-pay/button-react'),
  { 
    ssr: false,
    loading: () => <div className="w-full h-10 rounded-md animate-pulse bg-muted" />
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
      // Si el pago falla pero estamos en desarrollo/prueba, permitimos simular el éxito para ver el flujo
      console.error("Payment error:", error);
      toast({
        variant: "destructive",
        title: t('cart.error'),
        description: error.message || t('cart.errorRetry'),
      });
    } finally {
      setProcessingPayment(false);
    }
  };

  // Función para simular el éxito directamente sin pasar por Google Pay (solo para pruebas)
  const simulateSuccess = async () => {
    setProcessingPayment(true);
    setTimeout(async () => {
      await handleOrderCreation();
      toast({
        title: "¡Simulación Exitosa!",
        description: "El flujo de compra se completó correctamente.",
      });
      clearCart();
      onOpenChange(false);
      setProcessingPayment(false);
    }, 1500);
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="flex flex-col sm:max-w-md w-full border-none shadow-2xl rounded-l-[2rem] sm:rounded-l-[3rem]">
          <SheetHeader className="pb-6 border-b">
            <SheetTitle className="text-2xl font-headline font-bold">{t('cart.title')} ({cartCount})</SheetTitle>
          </SheetHeader>
          
          {cartItems.length === 0 ? (
            <div className="flex-grow flex flex-col items-center justify-center text-center p-8">
               <div className="bg-secondary/50 p-8 rounded-full mb-6">
                <ShoppingCart className="w-16 h-16 text-primary/30"/>
               </div>
              <p className="text-xl font-bold font-headline">{t('cart.empty')}</p>
              <p className="text-muted-foreground mt-2 italic">{t('cart.emptyDesc')}</p>
              <SheetClose asChild>
                  <Button variant="outline" className="mt-8 rounded-full px-8 h-12 border-primary/20 hover:bg-primary hover:text-white transition-all">
                    {t('cart.continue')}
                  </Button>
              </SheetClose>
            </div>
          ) : (
            <>
              <div className="flex-grow overflow-y-auto py-6 space-y-6">
                {!user && (
                  <div className="p-5 bg-primary/5 border border-primary/10 rounded-3xl animate-fadeIn">
                    <div className="flex items-start gap-4">
                      <div className="bg-white p-2 rounded-full shadow-sm">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">{t('cart.authPrompt')}</p>
                        <p className="text-xs text-gray-500 mt-1 mb-3">{t('cart.authDesc')}</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-9 rounded-xl text-[10px] font-bold tracking-widest uppercase border-primary/20 text-primary hover:bg-primary hover:text-white transition-all"
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
                    <div key={item.id} className="flex items-center justify-between gap-4 p-4 rounded-3xl bg-secondary/20 border border-transparent hover:border-primary/10 transition-all group">
                      <div className="flex-grow">
                        <p className="font-bold text-gray-800 tracking-tight">{item.title}</p>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-1">
                          {item.subtitle} • {item.duration} {t('services.min')}
                        </p>
                        <div className="flex items-center gap-4 mt-3">
                           <div className="flex items-center gap-1 bg-white rounded-full p-1 border shadow-sm">
                            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
                            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-sm font-bold text-primary">${(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="text-gray-300 hover:text-destructive hover:bg-destructive/5 rounded-full h-10 w-10 transition-colors" onClick={() => removeFromCart(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <SheetFooter className="mt-auto pt-8 border-t space-y-6 flex flex-col">
                <div className="w-full space-y-4">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">{t('cart.subtotal')}</span>
                    <span className="text-3xl font-bold font-headline text-primary">${totalPrice.toLocaleString()} MXN</span>
                  </div>
                  
                  <div className="space-y-3">
                    <GooglePayButton
                      environment="TEST"
                      buttonType="checkout"
                      buttonColor="black"
                      buttonSizeMode="fill"
                      className="w-full h-14 rounded-2xl overflow-hidden shadow-xl hover:shadow-primary/20 transition-all"
                      paymentRequest={{
                        apiVersion: 2,
                        apiVersionMinor: 0,
                        allowedPaymentMethods: [
                          {
                            type: 'CARD',
                            parameters: {
                              allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                              allowedCardNetworks: ['MASTERCARD', 'VISA'],
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
                          merchantName: 'Bonanza Bienestar',
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
                      onError={(err) => console.error("Google Pay Error:", err)}
                    />

                    {/* Botón de respaldo para cuando Google Pay falla en el entorno del usuario */}
                    <Button 
                      onClick={simulateSuccess} 
                      variant="outline" 
                      className="w-full h-12 rounded-2xl border-dashed border-2 border-primary/20 text-primary/60 hover:text-primary hover:bg-primary/5 transition-all text-[10px] font-bold tracking-widest uppercase"
                      disabled={processingPayment}
                    >
                      {processingPayment ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CreditCard className="w-4 h-4 mr-2" />}
                      PAGAR CON TARJETA (MODO TEST)
                    </Button>
                  </div>

                   {processingPayment && (
                      <p className="text-[10px] text-primary/60 text-center pt-2 flex items-center justify-center gap-2 font-bold tracking-widest uppercase animate-pulse">
                          <Loader2 className="h-3 w-3 animate-spin" /> {t('cart.processing')}
                      </p>
                   )}
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