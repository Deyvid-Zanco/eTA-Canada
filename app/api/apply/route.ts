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

    // Send email via Resend
    await resend.emails.send({
      from: 'eTA Application <noreply@yourdomain.com>', // Replace with your verified domain
      to: process.env.ADMIN_EMAIL || 'admin@yourdomain.com',
      subject: `New eTA Application - ${data.given_name || ''} ${data.surname || ''}`,
      html: emailHtml,
    });

    return NextResponse.json({ success: true, message: 'Application submitted successfully' });

  } catch (error) {
    console.error('Form submission error:', error);
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 });
  }
} 