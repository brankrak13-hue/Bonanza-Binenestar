import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { sendGiftCardEmail } from '../../../../lib/mail';
import { GiftCardTemplateId } from '../../../../lib/gift-cards';


export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-01-27.acacia' as any,
});

// Lazy initialize Supabase to avoid build-time errors
const getSupabaseAdmin = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function POST(req: Request) {
  try {
    const {
      templateId,
      recipientName,
      senderName,
      amount,
      message,
      message2,
      recipientEmail, // Optional: If the sender wants it emailed directly to recipient
      userEmail,      // Email of the logged-in buyer (fallback destination)
      isDevBypass     // Optional flag to bypass Stripe for developer testing
    } = await req.json();

    if (!templateId || !recipientName || !senderName || !amount) {
      return NextResponse.json({ error: 'Missing required configuration' }, { status: 400 });
    }

    const priceInCents = Math.round(Number(amount) * 100);

    if (isNaN(priceInCents) || priceInCents <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    if (senderName.toUpperCase() === 'TEST-GRATIS' || isDevBypass === true) {
      console.log('💳 Bypass Stripe activado (TEST/DEV Mode).');

      const reservationCode = 'BNZA-TEST-' + Math.random().toString(36).substring(2, 8).toUpperCase();
      // Destination: explicit recipient > logged-in buyer > fallback
      const targetEmail = recipientEmail || userEmail || 'bonanzabien.star@gmail.com';

      const orderDetails = {
        stripe_session_id: 'test_session_' + Date.now(),
        customer_email: targetEmail,
        order_date: new Date().toISOString(),
        status: 'paid',
        payment_status: 'paid',
        total_amount: Number(amount),
        currency: 'mxn',
        reservation_code: reservationCode,
        reservation_date: null,
      };

      const { error: dbError } = await getSupabaseAdmin().from('orders').insert(orderDetails);
      if (dbError) {
        console.error('Error en Supabase local (Test):', dbError);
      }

      await sendGiftCardEmail(targetEmail, {
        templateId: templateId as GiftCardTemplateId,
        recipientName,
        senderName: senderName || 'Sender de Prueba',
        amount: amount.toString(),
        message: message || '',
        message2: message2 || '',
        reservationCode,
      });

      return NextResponse.json({ url: '/success?session_id=' + orderDetails.stripe_session_id });
    }

    // Define the URL for the redirect
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://bonanza-bienestar.com';

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'mxn',
            product_data: {
              name: 'Tarjeta de Regalo - Bonanza | Bienestar',
              description: `De: ${senderName} Para: ${recipientName}`,
              images: [`${appUrl}/assets/logo.png`], // Fallback image if available, or omit
            },
            unit_amount: priceInCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/regalos`,
      metadata: {
        is_gift_card: 'true',
        templateId,
        recipientName,
        senderName,
        amount: amount.toString(),
        message: message || '',
        message2: message2 || '',
        recipientEmail: recipientEmail || '', // Store the recipient email if provided
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Error creating Stripe session:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
