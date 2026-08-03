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
    const normalizedProduct = product === 'philippines' ? 'philippines' : 'canada';
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

    if (!siteUrl) {
      throw new Error('NEXT_PUBLIC_SITE_URL environment variable is not set');
    }

    // Determine price ID based on product type
    const priceId = normalizedProduct === 'philippines'
      ? process.env.STRIPE_PHILIPPINES_PRICE_ID
      : process.env.STRIPE_PRICE_ID || process.env.STRIPE_CANADA_PRICE_ID;

    if (!priceId) {
      throw new Error(`Stripe price is not configured for ${normalizedProduct}`);
    }

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
      success_url: normalizedProduct === 'philippines'
        ? `${siteUrl}/philippines/thanks?session_id={CHECKOUT_SESSION_ID}`
        : `${siteUrl}/obrigado?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: normalizedProduct === 'philippines'
        ? `${siteUrl}/philippines/apply`
        : `${siteUrl}/canada/apply`,
      metadata: {
        ...(email && { email }),
        ...(name && { name }),
        product: normalizedProduct,
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
