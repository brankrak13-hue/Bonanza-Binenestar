
'use client';

import { useEffect, useState } from 'react';
import { useAuthContext } from '@/supabase/provider';
import { AlertTriangle, LogIn, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AuthModal from '@/components/AuthModal';

interface StripeBuyButtonProps {
  buttonId: string;
  publishableKey: string;
}

/**
 * Componente para renderizar el Botón de Compra oficial de Stripe.
 * Muestra advertencia si el usuario no está logueado.
 */
export default function StripeBuyButton({ buttonId, publishableKey }: StripeBuyButtonProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    if (document.querySelector('script[src="https://js.stripe.com/v3/buy-button.js"]')) {
      setIsLoaded(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/buy-button.js';
    script.async = true;
    script.onload = () => setIsLoaded(true);
    document.body.appendChild(script);
  }, []);

  const { user } = useAuthContext();

  if (!buttonId || !publishableKey) {
    return (
      <div className="p-4 rounded-xl bg-destructive/10 text-destructive text-xs italic">
        Configuración de Stripe incompleta (Falta Button ID o Key).
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Advertencia de sesión — solo si no está logueado */}
      {!user && (
        <div className="relative flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 text-sm animate-in fade-in duration-300">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-amber-500" />
          <div className="flex-1">
            <p className="font-bold mb-1">Inicia sesión para recibir tu código</p>
            <p className="text-xs text-amber-700 leading-relaxed">
              Para que te enviemos el <strong>código de reserva</strong> a tu correo después de la compra, necesitas estar logueado. 
              Puedes comprar sin cuenta, pero no recibirás el código por email.
            </p>
            <div className="flex gap-2 mt-3 flex-wrap">
              <Button 
                size="sm" 
                className="btn-primary h-8 text-xs rounded-full px-4"
                onClick={() => setAuthModalOpen(true)}
              >
                <LogIn className="w-3 h-3 mr-1.5" />
                Iniciar Sesión
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-8 text-xs rounded-full px-4 text-amber-700 hover:bg-amber-100"
                onClick={() => setShowWarning(true)}
              >
                Continuar sin cuenta
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Botón de Stripe — siempre visible */}
      <div className="w-full flex justify-center animate-in fade-in duration-500">
        {/* @ts-ignore */}
        <stripe-buy-button
          buy-button-id={buttonId}
          publishable-key={publishableKey}
          client-reference-id={user?.id || ''}
        />
      </div>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
}
