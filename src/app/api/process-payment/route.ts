
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-01-27', // O la versión más reciente
});

export async function POST(request: Request) {
  try {
    const paymentData = await request.json();
    const { paymentMethodData, amount, userId } = paymentData;

    // 1. Validar que tengamos el token de Google Pay (que Stripe interpreta como un token de fuente)
    const googlePayToken = paymentMethodData.tokenizationData.token;

    if (!process.env.STRIPE_SECRET_KEY) {
      console.warn("⚠️ STRIPE_SECRET_KEY no configurada. Usando modo simulación.");
      return NextResponse.json({ 
        success: true, 
        message: "Simulación: Pago recibido correctamente sin procesador real." 
      });
    }

    // 2. Crear el cargo en Stripe
    // Nota: El 'amount' debe estar en centavos para Stripe (ej: $10.00 -> 1000)
    const charge = await stripe.charges.create({
      amount: Math.round(amount * 100),
      currency: 'mxn',
      source: JSON.parse(googlePayToken).id, // El token de Google Pay contiene el ID necesario
      description: `Compra en Bonanza - Usuario: ${userId}`,
    });

    console.log("✅ Pago procesado exitosamente en Stripe:", charge.id);

    return NextResponse.json({ 
      success: true, 
      chargeId: charge.id,
      message: "Pago procesado exitosamente a través de Stripe." 
    });

  } catch (error: any) {
    console.error("❌ Error procesando el pago:", error);
    return NextResponse.json({ 
      success: false, 
      message: error.message || "Error al procesar el pago con el banco." 
    }, { status: 500 });
  }
}
