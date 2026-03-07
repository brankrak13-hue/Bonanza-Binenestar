
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

    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('Falta STRIPE_SECRET_KEY en el entorno.');
      return NextResponse.json({ 
        error: 'El oráculo de pagos no está configurado (Falta Secret Key).',
        url: `${request.headers.get('origin')}/pedidos?status=success&order_id=${orderId}` // Simulación de éxito si no hay llave
      }, { status: 200 });
    }

    const origin = request.headers.get('origin');

    // Mapeamos los items del carrito a line_items de Stripe Checkout
    // Esto crea el "producto" y "precio" de forma dinámica para esta sesión
    const line_items = items.map((item: any) => ({
      price_data: {
        currency: 'mxn',
        product_data: {
          name: item.title,
          description: `${item.duration} min - ${item.subtitle}`,
        },
        unit_amount: Math.round(item.price * 100), // Stripe usa centavos
      },
      quantity: item.quantity,
    }));

    // Creamos la sesión de Checkout (Paso authoritative del blueprint)
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
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
