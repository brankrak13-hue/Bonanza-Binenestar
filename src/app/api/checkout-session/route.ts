
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-01-27',
});

export async function POST(request: Request) {
  try {
    const { items, userId, userEmail, orderId } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'El carrito está vacío' }, { status: 400 });
    }

    const origin = request.headers.get('origin');

    // Mapeamos los items del carrito a line_items de Stripe
    const line_items = items.map((item: any) => ({
      price_data: {
        currency: 'mxn',
        product_data: {
          name: item.title,
          description: `${item.duration} min - ${item.subtitle}`,
        },
        unit_amount: Math.round(item.price * 100), // Centavos
      },
      quantity: item.quantity,
    }));

    // Creamos la sesión de Checkout siguiendo el blueprint
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'], // Google Pay/Apple Pay se activan en el dashboard de Stripe
      line_items,
      mode: 'payment',
      customer_email: userEmail,
      client_reference_id: userId,
      success_url: `${origin}/pedidos?status=success&session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
      cancel_url: `${origin}/servicios?status=cancelled`,
      metadata: {
        orderId: orderId || '',
        userId: userId || ''
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Error al crear sesión de Stripe:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
