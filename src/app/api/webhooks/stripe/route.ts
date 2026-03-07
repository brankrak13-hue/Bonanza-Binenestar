
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-01-27',
});

// El secreto de firma del webhook sirve para verificar que Stripe es quien envía el mensaje.
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  const body = await req.text();
  const sig = (await headers()).get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    if (!endpointSecret || !sig) {
      // SI NO HAY SECRETO: Procesamos el evento sin verificar la firma (solo para desarrollo inicial).
      // IMPORTANTE: En producción esto es un riesgo de seguridad.
      console.warn('⚠️ WEBHOOK: Procesando sin verificación de firma (STRIPE_WEBHOOK_SECRET no configurado).');
      event = JSON.parse(body);
    } else {
      // CON SECRETO: Stripe valida que el mensaje es auténtico.
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    }
  } catch (err: any) {
    console.error(`❌ Error en Webhook de Stripe: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Manejamos el evento de pago completado
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;
    const userId = session.metadata?.userId;

    console.log(`✅ PAGO CONFIRMADO: Orden ${orderId} para el usuario ${userId}`);
    
    // Aquí es donde actualizarías el estado en tu base de datos a "Pagado" de forma oficial.
  }

  return NextResponse.json({ received: true });
}
