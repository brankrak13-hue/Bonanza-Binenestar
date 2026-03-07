import { NextResponse } from 'next/server';

/**
 * RUTA DEPRECADA
 * Hemos migrado a Stripe Checkout (Hospedado) para evitar errores de validación local
 * y proporcionar una experiencia de pago de lujo sin fallos de dominio.
 */
export async function POST() {
  return NextResponse.json({ 
    message: "Esta ruta ha sido migrada a /api/checkout-session para mayor seguridad." 
  }, { status: 410 });
}
