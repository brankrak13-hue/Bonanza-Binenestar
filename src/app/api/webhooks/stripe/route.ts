
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-01-27',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  const body = await req.text();
  const sig = (await headers()).get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    if (!endpointSecret || !sig) {
      // En desarrollo sin secreto configurado, procesamos el evento directamente
      console.warn('⚠️ Webhook sin verificación de firma activa.');
      event = JSON.parse(body);
    } else {
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    }
  } catch (err: any) {
    console.error(`❌ Webhook Error: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Manejamos el evento de éxito (Paso 3 del blueprint)
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;
    const userId = session.metadata?.userId;

    console.log(`✅ Pago confirmado para la orden: ${orderId} del usuario ${userId}`);
    
    // Aquí se actualizaría el estado de la orden en Firestore a 'pagado'
    // Como esta es una función de servidor pura de NextJS, usaríamos el Admin SDK o similar.
  }

  return NextResponse.json({ received: true });
}
