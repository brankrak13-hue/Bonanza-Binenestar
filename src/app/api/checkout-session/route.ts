
import { NextResponse } from 'next/server';

/**
 * RUTA ELIMINADA: Migrada a Enlaces de Pago Directos de Stripe (Stripe Payment Links).
 * Para evitar errores de validación y simplificar el flujo, ahora se usan 
 * los enlaces generados en el Dashboard de Stripe o el Stripe Buy Button.
 */
export async function GET() {
  return NextResponse.json({ 
    message: "Utiliza los enlaces de pago directos para mayor seguridad." 
  }, { status: 404 });
}
