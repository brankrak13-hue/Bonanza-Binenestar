import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Inicializamos Stripe sin versión fija para usar la de la cuenta (según blueprint)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

export async function POST(request: Request) {
  try {
    const { items, userId, userEmail, orderId } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'El carrito está vacío' }, { status: 400 });
    }

    // Verificación estricta de la llave secreta
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'tu_sk_test_aqui') {
      console.error('❌ Error: STRIPE_SECRET_KEY no configurada correctamente en .env');
      return NextResponse.json({ 
        error: 'Error de configuración: La clave secreta de Stripe es inválida o no ha sido cargada. Revisa tu archivo .env.' 
      }, { status: 500 });
    }

    const origin = request.headers.get('origin') || request.headers.get('referer') || 'http://localhost:9002';

    // Mapeamos los items del carrito a line_items de Stripe Checkout (Paso 2 del blueprint)
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

    // Creamos la sesión de Checkout siguiendo el blueprint
    const session = await stripe.checkout.sessions.create({
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

    console.log('✅ Sesión de Stripe creada con éxito:', session.id);
    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('❌ Error crítico al crear sesión de Stripe:', error);
    return NextResponse.json({ 
      error: `Error de la API de Stripe: ${error.message}` 
    }, { status: 500 });
  }
}
