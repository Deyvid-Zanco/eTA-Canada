import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { generateInitialApplicationEmail } from '@/lib/email-templates';

// Initialize Resend with API key (fallback to empty string for build time)
const getResend = () => {
  const apiKey = process.env.RESEND_API_KEY || '';
  return new Resend(apiKey);
};

export async function POST(req: NextRequest) {
  try {
    // 1. Get form data and the reCAPTCHA token
    const data = await req.json();
    const recaptchaToken = data.recaptchaToken as string;

    if (!recaptchaToken) {
      return NextResponse.json({ error: 'reCAPTCHA verification required' }, { status: 400 });
    }

    if (!process.env.RECAPTCHA_SECRET_KEY) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // 2. Verify the token and define the `recaptchaData` variable
    const recaptchaResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
    });

    const recaptchaData = await recaptchaResponse.json();

    if (!recaptchaData.success || recaptchaData.score < 0.5) {
      return NextResponse.json({
        error: 'reCAPTCHA verification failed. Please try again.'
      }, { status: 400 });
    }

    // 3. Generate comprehensive admin email using professional template
    const submissionTime = new Date().toLocaleString('en-US', {
      dateStyle: 'full',
      timeStyle: 'long'
    });

    const adminEmailHtml = generateInitialApplicationEmail(
      data,
      submissionTime,
      recaptchaData.score
    );

    const resend = getResend();
    // Send the email to the admin
    await resend.emails.send({
      from: 'Philippines eTravel <noreply@immicenter-online.com>',
      to: process.env.ADMIN_EMAIL || 'admin@yourdomain.com',
      subject: `📋 INITIAL APPLICATION - ${data.given_name || ''} ${data.surname || ''} - Payment Pending`,
      html: adminEmailHtml,
    });

    // 4. Send the initial confirmation email to the user (without flight/cruise links)
    if (data.email) {

      await resend.emails.send({
        from: 'IMMI WORLD® <noreply@immi-world.com>',
        to: data.email,
        subject: 'We have received your Philippines eTravel Application',
        html: `
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f7;padding:0;margin:0;">
  <tr>
    <td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.04);margin:40px 0;">
        <tr>
          <td style="padding:40px 32px 32px 32px;text-align:center;">
            <h1 style="color:#34A853;font-size:24px;margin-bottom:16px;">We have received your Philippines eTravel Application</h1>
            <p style="font-size:16px;color:#222;margin-bottom:16px;">Hello ${data.given_name || ''},</p>
            <p style="font-size:16px;color:#222;margin-bottom:16px;">Thank you for submitting your request for the Electronic Travel Authorization (eTravel) for the Philippines.</p>
            <p style="font-size:16px;color:#222;margin-bottom:16px;">Your application has been received and you will be redirected to complete your payment.</p>
            
            <div style="background:#f8f9fa;border:1px solid #dee2e6;border-radius:8px;padding:24px;margin:24px 0;">
              <h2 style="color:#495057;font-size:18px;margin-bottom:16px;">📋 NEXT STEPS</h2>
              <p style="font-size:16px;color:#222;margin-bottom:16px;">1. Complete your payment in the next step</p>
              <p style="font-size:16px;color:#222;margin-bottom:16px;">2. After payment confirmation, you will receive detailed instructions to complete your ${data.travel_method.toLowerCase()} information</p>
            </div>

            <p style="font-size:16px;color:#222;margin-top:32px;margin-bottom:16px;">Please keep an eye on your email inbox (including your SPAM folder) for updates.</p>
            <p style="font-size:16px;color:#222;margin-bottom:16px;">Best regards,<br/>The IMMI WORLD® Team</p>
            <p style="font-size:13px;color:#888;margin-top:32px;">&copy; IMMI WORLD®</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
        `,
      });
    }

    return NextResponse.json({ success: true, message: 'Application submitted successfully' });

  } catch (error) {
    console.error('Submission failed:', error);
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 });
  }
}