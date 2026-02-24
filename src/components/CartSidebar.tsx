
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
import { Minus, Plus, Trash2, ShoppingCart, Loader2, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/firebase";
import AuthModal from "@/components/AuthModal";
import { useLanguage } from "@/context/LanguageContext";

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
  const { toast } = useToast();
  const { t } = useLanguage();

  const handlePayment = async (paymentRequest: google.payments.api.PaymentData) => {
    if (totalPrice === 0) return;
    setProcessingPayment(true);
    try {
      const response = await fetch('/api/process-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...paymentRequest,
          amount: totalPrice,
          userId: user?.uid || 'guest',
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
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
      toast({
        variant: "destructive",
        title: t('cart.error'),
        description: error.message || t('cart.errorRetry'),
      });
    } finally {
      setProcessingPayment(false);
    }
  };


  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="flex flex-col">
          <SheetHeader>
            <SheetTitle>{t('cart.title')} ({cartCount})</SheetTitle>
          </SheetHeader>
          {cartItems.length === 0 ? (
            <div className="flex-grow flex flex-col items-center justify-center text-center">
               <ShoppingCart className="w-16 h-16 text-muted-foreground mb-4"/>
              <p className="text-xl font-semibold">{t('cart.empty')}</p>
              <p className="text-muted-foreground">{t('cart.emptyDesc')}</p>
              <SheetClose asChild>
                  <Button variant="outline" className="mt-6">{t('cart.continue')}</Button>
              </SheetClose>
            </div>
          ) : (
            <>
              <div className="flex-grow overflow-y-auto -mx-6 px-6">
                {!user && (
                  <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <User className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">{t('cart.authPrompt')}</p>
                        <p className="text-xs text-muted-foreground mb-2">{t('cart.authDesc')}</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-7 text-xs"
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
                    <div key={item.id} className="flex items-start justify-between gap-4">
                      <div className="flex-grow">
                        <p className="font-semibold">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.subtitle} - {item.duration} {t('services.min')}</p>
                        <p className="text-sm font-semibold text-primary">${item.price.toLocaleString()}</p>
                         <div className="flex items-center gap-2 mt-2">
                          <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-6 text-center">{item.quantity}</span>
                          <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive h-8 w-8" onClick={() => removeFromCart(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              <SheetFooter className="mt-auto pt-6 border-t">
                <div className="w-full space-y-4">
                  <div className="flex justify-between font-semibold">
                    <span>{t('cart.subtotal')}</span>
                    <span>${totalPrice.toLocaleString()}</span>
                  </div>
                  
                  <GooglePayButton
                    environment="TEST" // CAMBIAR A "PRODUCTION" cuando tengas el merchantId
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
                              'stripe:version': '2025-01-27',
                              'stripe:publishableKey': 'pk_test_TU_LLAVE_PUBLICA_AQUI',
                            },
                          },
                        },
                      ],
                      merchantInfo: {
                        merchantId: '12345678901234567890', // TU ID DE COMERCIANTE DE GOOGLE CONSOLE
                        merchantName: 'Bonanza Arte & Bienestar',
                      },
                      transactionInfo: {
                        totalPriceStatus: 'FINAL',
                        totalPriceLabel: t('cart.subtotal'),
                        totalPrice: totalPrice.toFixed(2),
                        currencyCode: 'MXN',
                        countryCode: 'MX',
                      },
                    }}
                    onLoadPaymentData={handlePayment}
                    buttonType="pay"
                    buttonColor="black"
                    className="w-full"
                    disabled={processingPayment || cartCount === 0}
                  />
                   {processingPayment && (
                      <p className="text-xs text-muted-foreground text-center pt-2 flex items-center justify-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" /> {t('cart.processing')}
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
