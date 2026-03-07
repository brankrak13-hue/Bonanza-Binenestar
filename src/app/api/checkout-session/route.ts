
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-01-27',
});

export async function POST(req: Request) {
  try {
    const { priceId, items } = await req.json();

    const origin = req.headers.get('origin') || 'http://localhost:9002';
    
    let line_items = [];

    // Si viene un solo ID (Compra Directa)
    if (priceId) {
      line_items = [{ price: priceId, quantity: 1 }];
    } 
    // Si viene el carrito completo
    else if (items && Array.isArray(items)) {
      line_items = items.map((item: any) => ({
        price: item.priceId,
        quantity: item.quantity,
      }));
    }

    if (line_items.length === 0) {
      return NextResponse.json({ error: 'No se enviaron productos para comprar' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      line_items,
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
