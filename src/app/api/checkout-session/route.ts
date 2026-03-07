
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(request: Request) {
  try {
    const { items, userId, userEmail, orderId } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'El carrito está vacío' }, { status: 400 });
    }

    // Verificación estricta de la llave secreta en el momento de la petición
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    
    if (!stripeKey || stripeKey === 'tu_sk_test_aqui') {
      console.error('❌ Error Crítico: STRIPE_SECRET_KEY no configurada correctamente en .env');
      return NextResponse.json({ 
        error: 'Error de configuración en el servidor: La clave secreta de Stripe es inválida. Por favor, verifica tu archivo .env.' 
      }, { status: 500 });
    }

    // Inicializamos Stripe dentro del handler para asegurar que use la llave fresca
    const stripe = new Stripe(stripeKey);

    const origin = request.headers.get('origin') || request.headers.get('referer') || 'http://localhost:9002';

    // Mapeamos los items del carrito a line_items de Stripe Checkout
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
