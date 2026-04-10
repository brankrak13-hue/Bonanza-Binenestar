"use client";

import Link from "next/link";
import { CheckCircle, Home, Gift } from "lucide-react";
import { useEffect } from "react";

export default function SuccessPage() {
  // Limpiar el localStorage o sessionStorage del carrito/wizard al llegar al success
  useEffect(() => {
    try {
      sessionStorage.removeItem('bonanza_giftcard_data');
      sessionStorage.removeItem('bonanza_giftcard_step');
    } catch (e) {
      console.warn("No se pudo limpiar la sesión del wizard", e);
    }
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center bg-[#fdfaf5] px-4 overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 rounded-full bg-[#C5A880] blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 rounded-full bg-[#2e4d41] blur-[120px]"></div>
      </div>

      <div className="bg-white p-12 rounded-[40px] shadow-2xl max-w-xl w-full text-center border border-gray-100 relative z-10">
        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-10 relative">
          <div className="absolute inset-0 bg-green-200 animate-ping rounded-full opacity-30"></div>
          <div className="absolute inset-[-10px] border border-green-100 rounded-full animate-pulse"></div>
          <CheckCircle className="w-12 h-12 text-green-500 relative z-10" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-headline text-[#2e4d41] mb-6 tracking-tight">¡Regalo Enviado!</h1>
        <p className="text-gray-600 mb-10 text-lg leading-relaxed">
          Tu pago se ha procesado correctamente. La tarjeta de regalo personalizada ha sido generada y enviada por correo electrónico.
        </p>

        <div className="bg-[#fcf9f4] rounded-3xl p-6 mb-10 border border-[#C5A880]/10">
          <p className="text-[#C5A880] font-bold text-sm uppercase tracking-widest mb-2">Próximo Paso</p>
          <p className="text-gray-500 text-sm">
            Revisa tu bandeja de entrada (y la carpeta de spam por si acaso). ¡La sorpresa ya está en camino!
          </p>
        </div>
        
        <div className="flex flex-col gap-4">
          <Link href="/regalos" className="w-full py-5 rounded-full bg-[#2e4d41] text-white font-bold text-lg hover:bg-[#1a2e27] transition-all shadow-lg hover:shadow-[#2e4d41]/20 flex items-center justify-center gap-3 active:scale-95">
            <Gift className="w-5 h-5" />
            Crear Otro Regalo
          </Link>
          <Link href="/" className="w-full py-4 rounded-full border border-gray-100 text-gray-500 font-bold text-sm hover:bg-gray-50 hover:text-gray-800 transition-all flex items-center justify-center gap-2">
            <Home className="w-4 h-4" />
            Volver al Inicio de Bonanza
          </Link>
        </div>
      </div>

      <p className="mt-8 text-gray-400 text-sm font-medium animate-bounce">
        Gracias por regalar bienestar ✨
      </p>
    </div>
  );
}
