
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
      // En modo desarrollo sin secreto configurado, procesamos sin verificar firma
      console.warn('⚠️ Webhook sin verificación de firma (configura STRIPE_WEBHOOK_SECRET)');
      event = JSON.parse(body);
    } else {
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    }
  } catch (err: any) {
    console.error(`❌ Webhook Error: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Manejamos el evento de éxito del blueprint
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log(`✅ Pago confirmado para la orden: ${session.metadata?.orderId}`);
    
    // Aquí podrías actualizar el estado en Firestore a 'pagado'
    // utilizando el orderId guardado en metadata.
  }

  return NextResponse.json({ received: true });
}
