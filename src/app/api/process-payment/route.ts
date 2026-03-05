import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-01-27',
});

export async function POST(request: Request) {
  try {
    const paymentData = await request.json();
    const { paymentMethodData, amount, userId } = paymentData;

    console.log("💳 Iniciando procesamiento de pago para usuario:", userId);

    if (!paymentMethodData || !paymentMethodData.tokenizationData) {
      throw new Error("No se recibieron datos de pago válidos de Google Pay.");
    }

    const tokenData = paymentMethodData.tokenizationData.token;

    // Si no hay llave de Stripe, simulamos éxito para permitir el flujo de la app en desarrollo
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === '') {
      console.warn("⚠️ STRIPE_SECRET_KEY no configurada. Simulando pago exitoso en el backend.");
      await new Promise(resolve => setTimeout(resolve, 1500));
      return NextResponse.json({ 
        success: true, 
        message: "SIMULACIÓN: Pago aceptado correctamente." 
      });
    }

    // 2. Crear el cargo en Stripe usando el token obtenido
    // Nota: Para Google Pay con Stripe, el token recibido es un JSON string que contiene el ID del token
    const tokenObj = JSON.parse(tokenData);
    const tokenId = tokenObj.id;

    const charge = await stripe.charges.create({
      amount: Math.round(amount * 100), // Stripe usa centavos
      currency: 'mxn',
      source: tokenId,
      description: `Bonanza Arte & Bienestar - Compra de ${userId}`,
      metadata: {
        userId: userId,
      }
    });

    console.log("✅ Pago procesado exitosamente en Stripe:", charge.id);

    return NextResponse.json({ 
      success: true, 
      chargeId: charge.id,
      message: "Pago procesado exitosamente." 
    });

  } catch (error: any) {
    console.error("❌ Error procesando el pago:", error.message);
    return NextResponse.json({ 
      success: false, 
      message: error.message || "Error al procesar el pago." 
    }, { status: 500 });
  }
}