'use client';

import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { useToast } from "@/hooks/use-toast";

export interface CartItem {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  duration: number;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity' | 'id'>) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  cartCount: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  const addToCart = (itemToAdd: Omit<CartItem, 'quantity' | 'id'>) => {
    setCartItems(prevItems => {
      const uniqueId = `${itemToAdd.title}-${itemToAdd.duration}`;
      const existingItem = prevItems.find(item => item.id === uniqueId);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === uniqueId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...itemToAdd, id: uniqueId, quantity: 1 }];
    });
    toast({
        title: "Servicio agregado",
        description: `${itemToAdd.title} (${itemToAdd.duration} min) fue agregado a tu carrito.`,
    });
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      ).filter(item => item.quantity > 0)
    );
  };
  
  const cartCount = useMemo(() => cartItems.reduce((count, item) => count + item.quantity, 0), [cartItems]);

  const totalPrice = useMemo(() => cartItems.reduce((total, item) => total + item.price * item.quantity, 0), [cartItems]);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, cartCount, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
