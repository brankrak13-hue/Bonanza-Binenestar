
'use client';

import { useEffect, useState } from 'react';

interface StripeBuyButtonProps {
  buttonId: string;
  publishableKey: string;
}

/**
 * Componente para renderizar el Botón de Compra oficial de Stripe.
 * Este botón es ideal para pagos rápidos de servicios específicos.
 */
export default function StripeBuyButton({ buttonId, publishableKey }: StripeBuyButtonProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Evitamos cargar el script múltiples veces
    if (document.querySelector('script[src="https://js.stripe.com/v3/buy-button.js"]')) {
      setIsLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/buy-button.js';
    script.async = true;
    script.onload = () => setIsLoaded(true);
    document.body.appendChild(script);

    return () => {
      // No removemos el script globalmente para evitar romper otros botones si existieran
    };
  }, []);

  if (!buttonId || !publishableKey) {
    return (
      <div className="p-4 rounded-xl bg-destructive/10 text-destructive text-xs italic">
        Configuración de Stripe incompleta (Falta Button ID o Key).
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center animate-in fade-in duration-500">
      {/* @ts-ignore - Stripe Custom Elements no están en los tipos de React */}
      <stripe-buy-button
        buy-button-id={buttonId}
        publishable-key={publishableKey}
      />
    </div>
  );
}
