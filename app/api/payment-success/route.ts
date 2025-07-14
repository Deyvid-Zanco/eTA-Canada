import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Resend } from 'resend';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { session_id } = await req.json();
    if (!session_id) {
      return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });
    }

    // Retrieve the Stripe Checkout Session
    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }
    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 400 });
    }

    // Use session.customer_email or session.metadata
    const email = session.customer_email;

    if (!email) {
      return NextResponse.json({ error: 'No email found for this session' }, { status: 400 });
    }

    // Idempotency: Only send if not already sent (use session metadata flag)
    if (session.metadata?.payment_email_sent === 'true') {
      return NextResponse.json({ success: true, message: 'Email already sent' });
    }

    // Send payment success email
    await resend.emails.send({
      from: 'IMMI CENTER <noreply@immicenter-online.com>',
      to: email,
      subject: 'Payment Received for CANADA ETA PERMIT AUTHORIZATION',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <p>Hello!</p>
          <p>We have received your payment for your Canada eTA application. Your application is now being processed.</p>
          <p>Processing time may take a few minutes or up to 72 hours.</p>
          <p>If you have any questions or concerns, please do not hesitate to contact us by replying to this email.</p>
        </div>
      `,
    });

    // Optionally, update the session metadata to mark email as sent (requires Stripe API write access)
    try {
      await stripe.checkout.sessions.update(session_id, {
        metadata: { ...session.metadata, payment_email_sent: 'true' },
      });
    } catch {
      // Ignore update errors, email is still sent
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Payment success email error:', error);
    return NextResponse.json({ error: 'Failed to send payment confirmation email' }, { status: 500 });
  }
} 