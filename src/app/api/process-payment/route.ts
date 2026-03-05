
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-01-27',
});

export async function POST(request: Request) {
  try {
    const paymentData = await request.json();
    const { paymentMethodData, amount, userId } = paymentData;

    if (!paymentMethodData || !paymentMethodData.tokenizationData) {
      throw new Error("No se recibieron datos de pago válidos de Google Pay.");
    }

    const googlePayToken = paymentMethodData.tokenizationData.token;

    if (!process.env.STRIPE_SECRET_KEY) {
      console.warn("⚠️ STRIPE_SECRET_KEY no configurada. Usando modo simulación exitosa.");
      // Simulamos un retraso de red
      await new Promise(resolve => setTimeout(resolve, 1000));
      return NextResponse.json({ 
        success: true, 
        message: "Simulación: Pago recibido correctamente sin procesador real." 
      });
    }

    // 2. Crear el cargo en Stripe
    const charge = await stripe.charges.create({
      amount: Math.round(amount * 100),
      currency: 'mxn',
      source: JSON.parse(googlePayToken).id,
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
