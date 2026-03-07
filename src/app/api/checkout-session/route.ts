
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    console.error('❌ ERROR: STRIPE_SECRET_KEY no encontrada en el archivo .env');
    return NextResponse.json(
      { error: 'Configuración del servidor incompleta. Falta la API Key de Stripe.' },
      { status: 500 }
    );
  }

  const stripe = new Stripe(secretKey, {
    apiVersion: '2025-01-27',
  });

  try {
    const { priceId, items } = await req.json();
    const origin = req.headers.get('origin') || 'http://localhost:9002';
    
    let line_items = [];

    // Lógica para Compra Directa (un solo ID)
    if (priceId) {
      line_items = [{ price: priceId, quantity: 1 }];
    } 
    // Lógica para Carrito Completo
    else if (items && Array.isArray(items)) {
      line_items = items.map((item: any) => {
        if (!item.priceId) {
          throw new Error(`El servicio "${item.title}" no tiene un ID de precio válido.`);
        }
        return {
          price: item.priceId,
          quantity: item.quantity,
        };
      });
    }

    if (line_items.length === 0) {
      return NextResponse.json({ error: 'No se enviaron productos para comprar' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: 'payment',
      success_url: `${origin}/pedidos?status=success`,
      cancel_url: `${origin}/servicios?status=cancelled`,
      // Permitir que el usuario ponga su teléfono en la pasarela
      phone_number_collection: { enabled: true },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('❌ Error al crear sesión de Stripe:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
