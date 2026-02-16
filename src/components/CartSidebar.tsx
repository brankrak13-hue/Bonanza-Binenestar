'use client';

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
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";

interface CartSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CartSidebar({ open, onOpenChange }: CartSidebarProps) {
  const { cartItems, removeFromCart, updateQuantity, totalPrice, cartCount } = useCart();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Tu Carrito ({cartCount})</SheetTitle>
        </SheetHeader>
        {cartItems.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center text-center">
             <ShoppingCart className="w-16 h-16 text-muted-foreground mb-4"/>
            <p className="text-xl font-semibold">Tu carrito está vacío</p>
            <p className="text-muted-foreground">Agrega servicios para verlos aquí.</p>
            <SheetClose asChild>
                <Button variant="outline" className="mt-6">Seguir comprando</Button>
            </SheetClose>
          </div>
        ) : (
          <>
            <div className="flex-grow overflow-y-auto -mx-6 px-6">
              <div className="space-y-4">
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-start justify-between gap-4">
                    <div className="flex-grow">
                      <p className="font-semibold">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.subtitle} - {item.duration} min</p>
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
                  <span>Subtotal</span>
                  <span>${totalPrice.toLocaleString()}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Los impuestos y costos de envío se calculan al finalizar la compra.
                </p>
                <Button className="w-full">
                  Proceder al Pago
                </Button>
                {/* Google Pay Button Placeholder */}
                <div className="relative flex items-center justify-center my-2">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t"></span>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">O</span>
                    </div>
                </div>
                <Button variant="outline" className="w-full">
                    <Image src="https://www.gstatic.com/instantbuy/svg/dark_gpay.svg" alt="Google Pay" width={60} height={24} />
                </Button>
                 <p className="text-xs text-muted-foreground text-center pt-2">
                  La integración de Google Pay requiere configuración adicional en el backend. Este es un botón de marcador de posición.
                </p>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
