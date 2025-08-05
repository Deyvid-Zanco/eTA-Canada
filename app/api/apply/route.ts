import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    // Accept JSON body
    const data = await req.json();

    // Get reCAPTCHA token from JSON
    const recaptchaToken = data.recaptchaToken as string;

    if (!recaptchaToken) {
      return NextResponse.json({ error: 'reCAPTCHA verification required' }, { status: 400 });
    }

    // Verify reCAPTCHA v3
    const recaptchaResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
    });

    const recaptchaData = await recaptchaResponse.json();

    if (!recaptchaData.success || recaptchaData.score < 0.5) {
      console.log('reCAPTCHA verification failed:', {
        success: recaptchaData.success,
        score: recaptchaData.score,
        'error-codes': recaptchaData['error-codes']
      });
      return NextResponse.json({ 
        error: 'reCAPTCHA verification failed. Please try again.' 
      }, { status: 400 });
    }

    // Build email content from JSON data
    const formFields = Object.keys(data).filter(key => key !== 'recaptchaToken');

    let emailHtml = `
      <h2>New eTA Application Submission</h2>
      <p><strong>Submission Time:</strong> ${new Date().toLocaleString()}</p>
      <p><strong>reCAPTCHA Score:</strong> ${recaptchaData.score} (${recaptchaData.score >= 0.7 ? 'High confidence' : 'Medium confidence'})</p>
      <hr>
    `;

    formFields.forEach(field => {
      const value = data[field];
      if (value !== undefined && value !== null && value !== "") {
        const label = field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).replace(/_/g, ' ');
        emailHtml += `<p><strong>${label}:</strong> ${value}</p>`;
      }
    });

    // Send email via Resend (admin)
    await resend.emails.send({
      from: 'eTA Application 2 <noreply@immicenter-online.com>', // Replace with your verified domain
      to: process.env.ADMIN_EMAIL || 'admin@yourdomain.com',
      subject: `New eTA Application - ${data.given_name || ''} ${data.surname || ''}`,
      html: emailHtml,
    });

    // Send confirmation email to applicant
    if (data.email) {
      await resend.emails.send({
        from: 'IMMI CENTER <noreply@immicenter-online.com>',
        to: data.email,
        subject: 'We have received your response for CANADA ETA PERMIT AUTHORIZATION',
        html: `
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f7;padding:0;margin:0;">
  <tr>
    <td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.04);margin:40px 0;">
        <tr>
          <td style="padding:40px 32px 32px 32px;text-align:center;">
            <h1 style="color:#34A853;font-size:24px;margin-bottom:16px;">We have received your response for CANADA ETA PERMIT AUTHORIZATION</h1>
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

    return NextResponse.json({ success: true, message: 'Application submitted successfully' });

  } catch (error) {
    console.error('Form submission error:', error);
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 });
  }
} 