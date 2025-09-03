import Stripe from 'stripe';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Optionally, collect applicant info for metadata
    const { email, name, product = 'canada' } = body;

    // Determine price ID based on product type
    const priceId = product === 'philippines'
      ? process.env.STRIPE_PHILIPPINES_PRICE_ID || 'price_1R9AEB04B98GMnQHPn08mr5L' // Add your Philippines price ID here
      : 'price_1R9AEB04B98GMnQHPn08mr5L'; // Canada price ID (current one)

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/obrigado?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/`, // Or a specific cancel page
      metadata: {
        ...(email && { email }),
        ...(name && { name }),
        product, // Add product type to metadata
      },
      customer_email: email, // Optional: pre-fill email in Stripe Checkout
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Payment failed' },
      { status: 500 }
    );
  }
}
