
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-01-27',
});

export async function POST(req: Request) {
  try {
    const { priceId } = await req.json();

    if (!priceId) {
      return NextResponse.json({ error: 'Falta el ID de precio' }, { status: 400 });
    }

    const origin = req.headers.get('origin') || 'http://localhost:9002';

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/pedidos?status=success`,
      cancel_url: `${origin}/servicios?status=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Error al crear sesión de Stripe:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
