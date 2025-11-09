import Stripe from 'stripe';
import { NextResponse } from 'next/server';

// Initialize Stripe with production API key
const getStripe = () => {
  const apiKey = process.env.STRIPE_SECRET_KEY;
  
  if (!apiKey) {
    throw new Error('STRIPE_SECRET_KEY environment variable is not set');
  }
  
  return new Stripe(apiKey, {
    apiVersion: '2025-06-30.basil',
  });
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Optionally, collect applicant info for metadata
    const { email, name, product = 'canada', travel_method, travel_type } = body;

    // Determine price ID based on product type
    const priceId = product === 'philippines'
      ? process.env.STRIPE_TEST_PRICE_ID || 'price_1R9AEB04B98GMnQHPn08mr5L' // Philippines using test price ID
      : 'price_1R9AEB04B98GMnQHPn08mr5L'; // Canada price ID (current one)

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: product === 'philippines' 
        ? `${process.env.NEXT_PUBLIC_SITE_URL}/philippines/thanks?session_id={CHECKOUT_SESSION_ID}`
        : `${process.env.NEXT_PUBLIC_SITE_URL}/obrigado?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/`, // Or a specific cancel page
      metadata: {
        ...(email && { email }),
        ...(name && { name }),
        product, // Add product type to metadata
        ...(travel_method && { travel_method }),
        ...(travel_type && { travel_type }),
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
