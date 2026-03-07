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

    // Convertimos los items del carrito al formato de Stripe Checkout
    const line_items = items.map((item: any) => ({
      price_data: {
        currency: 'mxn',
        product_data: {
          name: item.title,
          description: `${item.duration} minutos de bienestar - ${item.subtitle}`,
        },
        unit_amount: Math.round(item.price * 100), // Stripe usa centavos
      },
      quantity: item.quantity,
    }));

    // Creamos la sesión de Checkout hospedada en Stripe
    // Esto maneja automáticamente Google Pay, Apple Pay y Tarjetas.
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'], // Puedes añadir 'google_pay' si está activado en tu dashboard
      line_items,
      mode: 'payment',
      customer_email: userEmail,
      client_reference_id: userId,
      success_url: `${request.headers.get('origin')}/pedidos?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
      cancel_url: `${request.headers.get('origin')}/servicios`,
      metadata: {
        userId: userId || 'guest',
        orderId: orderId || ''
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Error creando sesión de Stripe:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
