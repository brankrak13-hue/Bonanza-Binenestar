
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Inicializamos Stripe con la llave secreta del archivo .env
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

    const origin = request.headers.get('origin');

    // Creamos la sesión de Checkout hospedada en Stripe
    // Stripe manejará automáticamente Google Pay si está configurado en tu dashboard
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'], 
      line_items,
      mode: 'payment',
      customer_email: userEmail,
      client_reference_id: userId,
      success_url: `${origin}/pedidos?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}&status=success`,
      cancel_url: `${origin}/servicios?payment=cancelled`,
      metadata: {
        userId: userId || 'guest',
        orderId: orderId || ''
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Error creando sesión de Stripe:', error);
    return NextResponse.json({ 
      error: 'No se pudo iniciar el pago. Verifica que la STRIPE_SECRET_KEY en el archivo .env sea correcta.' 
    }, { status: 500 });
  }
}
