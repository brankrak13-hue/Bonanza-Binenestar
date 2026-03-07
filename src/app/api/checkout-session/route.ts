
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    console.error('❌ ERROR: STRIPE_SECRET_KEY no encontrada en el archivo .env. Por favor añádela y reinicia el servidor.');
    return NextResponse.json(
      { error: 'Configuración de Stripe incompleta en el servidor.' },
      { status: 500 }
    );
  }

  const stripe = new Stripe(secretKey, {
    apiVersion: '2025-01-27',
  });

  try {
    const { items } = await req.json();
    const origin = req.headers.get('origin') || 'http://localhost:9002';
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'No se enviaron servicios para comprar' }, { status: 400 });
    }

    const line_items = items.map((item: any) => {
      if (!item.priceId) {
        throw new Error(`El servicio "${item.title}" no tiene un Price ID válido de Stripe.`);
      }
      return {
        price: item.priceId,
        quantity: item.quantity || 1,
      };
    });

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: 'payment',
      success_url: `${origin}/pedidos?status=success`,
      cancel_url: `${origin}/servicios?status=cancelled`,
      phone_number_collection: { enabled: true },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('❌ Error al crear sesión de Stripe:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
