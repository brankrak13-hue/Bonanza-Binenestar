
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(request: Request) {
  try {
    const { items, userId, userEmail, orderId } = await request.json();

    // Priorizamos la clave del archivo .env
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    
    if (!stripeKey || stripeKey === 'sk_test_51T4Cck3RNCg5DgsjY6K...') {
      console.warn('⚠️ STRIPE: Usando configuración de respaldo. Asegúrate de configurar STRIPE_SECRET_KEY en el archivo .env.');
    }

    const stripe = new Stripe(stripeKey || '', {
      apiVersion: '2025-01-27',
    });
    
    const origin = request.headers.get('origin') || 'http://localhost:9002';

    const line_items = items.map((item: any) => ({
      price_data: {
        currency: 'mxn',
        product_data: {
          name: item.title,
          description: `${item.duration} min - Ritual de Bienestar`,
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
      // Habilitamos Google Pay automáticamente
      payment_method_types: ['card'],
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('❌ Error en Stripe Checkout:', error.message);
    return NextResponse.json({ 
      error: `Error: ${error.message}` 
    }, { status: 500 });
  }
}
