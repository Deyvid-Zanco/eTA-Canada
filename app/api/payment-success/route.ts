import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Resend } from 'resend';

// Initialize Stripe with API key (fallback for build time)
const getStripe = () => {
  const apiKey = process.env.STRIPE_SECRET_KEY || '';
  if (!apiKey) {
    throw new Error('STRIPE_SECRET_KEY environment variable is not set');
  }
  return new Stripe(apiKey, {
    apiVersion: '2025-06-30.basil',
  });
};

// Initialize Resend with API key (fallback to empty string for build time)
const getResend = () => {
  const apiKey = process.env.RESEND_API_KEY || '';
  return new Resend(apiKey);
};

export async function POST(req: NextRequest) {
  try {
    const { session_id } = await req.json();
    console.log('🔍 Payment success API called with session_id:', session_id);
    
    if (!session_id) {
      console.error('❌ Missing session_id in request');
      return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });
    }

    // Retrieve the Stripe Checkout Session
    console.log('🔍 Retrieving Stripe session...');
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (!session) {
      console.error('❌ Session not found:', session_id);
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }
    
    console.log('🔍 Session retrieved. Payment status:', session.payment_status);
    console.log('🔍 Session metadata:', session.metadata);
    
    if (session.payment_status !== 'paid') {
      console.error('❌ Payment not completed. Status:', session.payment_status);
      return NextResponse.json({ error: 'Payment not completed' }, { status: 400 });
    }

    // Use session.customer_email or session.metadata
    const email = session.customer_email || session.customer_details?.email || session.metadata?.email;
    const product = session.metadata?.product || 'canada';
    const travel_method = session.metadata?.travel_method;
    const travel_type = session.metadata?.travel_type;

    console.log('🔍 Extracted data:', { email, product, travel_method, travel_type });

    if (!email) {
      console.error('❌ No email found for session:', session_id);
      return NextResponse.json({ error: 'No email found for this session' }, { status: 400 });
    }

    // Idempotency: Only send if not already sent (use session metadata flag)
    if (session.metadata?.payment_email_sent === 'true') {
      console.log('✅ Email already sent for session:', session_id);
      return NextResponse.json({ success: true, message: 'Email already sent' });
    }

    // Send payment success email
    try {
      const resend = getResend();
      let emailResult;
      console.log('📧 Starting email sending process for product:', product);
      
      if (product === 'philippines' && travel_method && travel_type) {
        console.log('📧 Sending Philippines email with travel details:', { travel_method, travel_type });
        // Generate form URL based on travel choices
        let formUrl = process.env.NEXT_PUBLIC_SITE_URL;
        const mode = travel_type.toLowerCase(); // Use the actual travel type selected
        
        if (travel_method === 'Flight') {
          formUrl += `/forms/flight?mode=${mode}&session_id=${session_id}`;
        } else if (travel_method === 'Cruise') {
          formUrl += `/forms/cruise?mode=${mode}&session_id=${session_id}`;
        }
        
        emailResult = await resend.emails.send({
          from: 'IMMI CENTER <noreply@immicenter-online.com>',
          to: email,
          subject: 'Payment Received for Philippines eTravel Authorization - Next Steps',
          html: `
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f7;padding:0;margin:0;">
  <tr>
    <td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.04);margin:40px 0;">
        <tr>
          <td style="padding:40px 32px 32px 32px;text-align:center;">
            <h1 style="color:#34A853;font-size:24px;margin-bottom:16px;">PURCHASE ORDER COMPLETED!</h1>
            <p style="font-size:16px;color:#222;margin-bottom:16px;">Hello!</p>
            <p style="font-size:16px;color:#222;margin-bottom:16px;">We have received your request for the Philippines eTravel Authorization.</p>
            <p style="font-size:16px;color:#222;margin-bottom:16px;">Your application will be processed shortly.<br/>
              <span style="font-weight:600;">Processing time may take a few minutes or up to 72 hours.</span>
            </p>
            <div style="background:#f8f9fa;border:1px solid #dee2e6;border-radius:8px;padding:24px;margin:24px 0;">
              <h2 style="color:#495057;font-size:18px;margin-bottom:16px;">📋 NEXT STEP REQUIRED</h2>
              <p style="font-size:16px;color:#222;margin-bottom:16px;">To complete your Philippines eTravel application, please click the link below to provide your ${travel_method.toLowerCase()} details:</p>
              <a href="${formUrl}" style="display:inline-block;background:#007bff;color:white;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:bold;margin:8px 0;">Complete Your ${travel_method} Details</a>
              <p style="font-size:14px;color:#6c757d;margin-top:16px;">Travel Type: ${travel_type} (${travel_type === 'Arrival' ? 'Entering' : 'Leaving'} the Philippines)</p>
            </div>
            <p style="font-size:20px;color:#222;font-weight:700;margin-bottom:8px;">IMPORTANT INFORMATION:</p>
            <p style="font-size:16px;color:#222;margin-bottom:16px;">
              We suggest keeping an eye on your email inbox as <span style="font-weight:bold;">well as your SPAM folder</span>, as mentioned during the application process, for future communications and updates regarding your application.
            </p>
            <p style="font-size:16px;color:#222;margin-bottom:16px;">Best regards,<br/>Applicant Support – Philippines eTravel Support</p>
            <p style="font-size:13px;color:#888;margin-top:32px;">&copy; IMMI CENTER</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
          `,
        });
      } else {
        // Canada ETA (original logic)
        emailResult = await resend.emails.send({
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
      }
      
      console.log('✅ Payment success email sent:', { email, result: emailResult });
    } catch (emailError) {
      console.error('❌ Failed to send payment success email:', emailError);
      return NextResponse.json({ error: 'Failed to send payment confirmation email' }, { status: 500 });
    }

    // Optionally, update the session metadata to mark email as sent (requires Stripe API write access)
    try {
      await stripe.checkout.sessions.update(session_id, {
        metadata: { ...session.metadata, payment_email_sent: 'true' },
      });
    } catch {
      // Ignore update errors, email is still sent
    }

    console.log('✅ Payment success flow completed successfully');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ Payment success email error:', error);
    return NextResponse.json({ error: 'Failed to send payment confirmation email' }, { status: 500 });
  }
} 