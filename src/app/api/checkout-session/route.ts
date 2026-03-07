
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(request: Request) {
  try {
    const { items, userId, userEmail, orderId } = await request.json();

    const stripeKey = process.env.STRIPE_SECRET_KEY;
    
    if (!stripeKey || stripeKey.includes('tu_sk_test')) {
      console.error('❌ ERROR DE CONFIGURACIÓN: No has puesto una STRIPE_SECRET_KEY válida en el archivo .env');
      return NextResponse.json({ 
        error: 'Falta la clave secreta de Stripe. Por favor, revisa el archivo .env del proyecto.' 
      }, { status: 500 });
    }

    const stripe = new Stripe(stripeKey);
    const origin = request.headers.get('origin') || 'http://localhost:9002';

    const line_items = items.map((item: any) => ({
      price_data: {
        currency: 'mxn',
        product_data: {
          name: item.title,
          description: `${item.duration} min - ${item.subtitle}`,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

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

    console.log('✅ Sesión de Stripe creada:', session.id);
    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('❌ Error al conectar con Stripe:', error.message);
    return NextResponse.json({ 
      error: `Error de Stripe: ${error.message}` 
    }, { status: 500 });
  }
}
