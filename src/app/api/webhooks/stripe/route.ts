import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { sendOrderConfirmation, sendGiftCardEmail } from '@/lib/mail';
import { GiftCardTemplateId } from '@/lib/gift-cards';

export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-01-27.acacia' as any,
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Lazy initialize Supabase to avoid build-time errors
const getSupabaseAdmin = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature || !endpointSecret) {
    return NextResponse.json(
      { error: 'Falta la firma de Stripe o el Webhook Secret no está configurado.' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
  } catch (err: any) {
    console.error(`⚠️  Webhook signature verification failed.`, err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.client_reference_id;
    const customerEmail = session.customer_details?.email || null;

    try {
      // Generate unique reservation code
      const reservationCode = 'BNZA-' + Math.random().toString(36).substring(2, 8).toUpperCase();

      const orderDetails = {
        stripe_session_id: session.id,
        user_id: userId || null,
        customer_email: customerEmail,
        order_date: new Date().toISOString(),
        status: 'paid',
        payment_status: session.payment_status,
        total_amount: session.amount_total ? session.amount_total / 100 : 0,
        currency: session.currency,
        reservation_code: reservationCode,
        reservation_date: null,
      };

      const { error } = await getSupabaseAdmin().from('orders').insert(orderDetails);

      if (error) {
        console.error('Error guardando en Supabase:', error);
        return NextResponse.json({ error: 'Error interno guardando datos' }, { status: 500 });
      }

      console.log(`✅ Compra registrada con éxito. Código: ${reservationCode}`);

      if (customerEmail) {
        if (session.metadata?.is_gift_card === 'true') {
          // Send the specific gift card email
          const targetEmail = session.metadata.recipientEmail || customerEmail;
          console.log(`🎁 Sending gift card email to: ${targetEmail}`);
          await sendGiftCardEmail(targetEmail, {
            templateId: session.metadata.templateId as GiftCardTemplateId,
            recipientName: session.metadata.recipientName,
            senderName: session.metadata.senderName,
            amount: session.metadata.amount,
            message: session.metadata.message,
            message2: session.metadata.message2,
            reservationCode: reservationCode,
          });
        } else {
          // Send the normal order confirmation email
          await sendOrderConfirmation(customerEmail, { ...orderDetails, reservationCode });
        }
      }

    } catch (error) {
      console.error('Error en webhook:', error);
      return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
