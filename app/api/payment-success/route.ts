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
    const email = session.customer_email || session.customer_details?.email || session.metadata?.email;

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
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f7;padding:0;margin:0;">
  <tr>
    <td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.04);margin:40px 0;">
        <tr>
          <td style="padding:40px 32px 32px 32px;text-align:center;">
            <h1 style="color:#34A853;font-size:24px;margin-bottom:16px;">PURCHASE ORDER COMPLETED!</h1>
            <p style="font-size:16px;color:#222;margin-bottom:16px;">Hello!</p>
            <p style="font-size:16px;color:#222;margin-bottom:16px;">We have received your request for the issuance of the Electronic Travel Authorization (eTA) for Canada.</p>
            <p style="font-size:16px;color:#222;margin-bottom:16px;">Your application will be processed shortly.<br/>
              <span style="font-weight:600;">Processing time may take a few minutes or up to 72 hours.</span>
            </p>
            <p style="font-size:20px;color:#222;font-weight:700;margin-bottom:8px;">IMPORTANT INFORMATION:</p>
            <p style="font-size:16px;color:#222;margin-bottom:16px;">
              We suggest keeping an eye on your email inbox as <span style="font-weight:bold;">well as your SPAM folder</span>, as mentioned during the application process, for future communications and updates regarding your application.
            </p>
            <p style="font-size:16px;color:#222;margin-bottom:16px;">Best regards,<br/>Applicant Support – eTA Canada Support</p>
            <p style="font-size:13px;color:#888;margin-top:32px;">&copy; IMMI CENTER</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
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