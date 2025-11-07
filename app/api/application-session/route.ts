import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabase } from '@/lib/supabase';

// Initialize Stripe with API key (fallback for build time)
const getStripe = () => {
  const apiKey = process.env.STRIPE_SECRET_TEST_KEY || 'sk_test_placeholder';
  return new Stripe(apiKey, {
    apiVersion: '2025-06-30.basil',
  });
};

/**
 * Initialize application session from Stripe payment data
 */
export async function POST(request: NextRequest) {
  try {
    const { stripeSessionId, formSessionToken } = await request.json();

    if (!stripeSessionId || !formSessionToken) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Check if we already have this application session
    const { data: existingSession } = await supabase
      .from('application_sessions')
      .select('*')
      .eq('stripe_session_id', stripeSessionId)
      .single();

    if (existingSession) {
      return NextResponse.json({
        success: true,
        existingSession: {
          form_session_token: existingSession.form_session_token,
          customer_email: existingSession.customer_email,
          customer_name: existingSession.customer_name,
          travel_method: existingSession.travel_method,
          travel_type: existingSession.travel_type
        }
      });
    }

    // Retrieve payment details from Stripe
    const stripe = getStripe();
    const stripeSession = await stripe.checkout.sessions.retrieve(stripeSessionId);
    
    if (stripeSession.payment_status !== 'paid') {
      return NextResponse.json(
        { success: false, error: 'Payment not completed' },
        { status: 400 }
      );
    }

    const email = stripeSession.customer_email || stripeSession.customer_details?.email;
    const name = stripeSession.metadata?.name;
    const travelMethod = stripeSession.metadata?.travel_method as 'Flight' | 'Cruise';
    const travelType = stripeSession.metadata?.travel_type as 'arrival' | 'departure';

    if (!email || !travelMethod || !travelType) {
      return NextResponse.json(
        { success: false, error: 'Incomplete payment metadata' },
        { status: 400 }
      );
    }

    // Create new application session
    const applicationData = {
      stripe_session_id: stripeSessionId,
      customer_email: email,
      customer_name: name,
      travel_method: travelMethod,
      travel_type: travelType,
      form_session_token: formSessionToken,
      form_data: {},
      current_step: 'started',
      expires_at: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)).toISOString(),
      completed: false
    };

    const { error: insertError } = await supabase
      .from('application_sessions')
      .insert(applicationData);

    if (insertError) {
      throw insertError;
    }

    return NextResponse.json({
      success: true,
      applicationDetails: {
        customerEmail: email,
        customerName: name,
        travelMethod,
        travelType
      }
    });

  } catch (error) {
    console.error('Error initializing application session:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
