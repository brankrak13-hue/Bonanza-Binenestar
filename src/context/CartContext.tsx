
'use client';
import React, { createContext, useContext, ReactNode } from 'react';

// Este archivo se mantiene vacío para evitar errores de importación en otros archivos,
// pero la funcionalidad de carrito ha sido eliminada.
const CartContext = createContext<any>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  return (
    <CartContext.Provider value={{}}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return {};
}
