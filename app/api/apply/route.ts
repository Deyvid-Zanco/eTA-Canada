import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    
    // Get reCAPTCHA token
    const recaptchaToken = formData.get('g-recaptcha-response') as string;
    
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
    
    // reCAPTCHA v3 returns a score (0.0 to 1.0)
    // 0.0 = very likely a bot, 1.0 = very likely a human
    // Typically, scores above 0.5 are considered human
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
    
    // Build email content from form data
    const formFields = [
      'travel_document', 'nationality', 'passport_number', 'passport_number_confirm',
      'surname', 'given_name', 'dob', 'gender', 'birth_country', 'birth_city',
      'passport_issue_date', 'passport_expiry_date', 'additional_nationality',
      'marital_status', 'previous_application', 'occupation', 'apartment_number',
      'street_number', 'street_name', 'city', 'district', 'zipcode',
      'address_country', 'email', 'phone_number', 'knows_travel_date'
    ];
    
    let emailHtml = `
      <h2>New eTA Application Submission</h2>
      <p><strong>Submission Time:</strong> ${new Date().toLocaleString()}</p>
      <p><strong>reCAPTCHA Score:</strong> ${recaptchaData.score} (${recaptchaData.score >= 0.7 ? 'High confidence' : 'Medium confidence'})</p>
      <hr>
    `;
    
    formFields.forEach(field => {
      const value = formData.get(field);
      if (value) {
        const label = field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).replace(/_/g, ' ');
        emailHtml += `<p><strong>${label}:</strong> ${value}</p>`;
      }
    });
    
    // Send email via Resend
    await resend.emails.send({
      from: 'eTA Application <noreply@yourdomain.com>', // Replace with your verified domain
      to: process.env.ADMIN_EMAIL || 'admin@yourdomain.com',
      subject: `New eTA Application - ${formData.get('given_name')} ${formData.get('surname')}`,
      html: emailHtml,
    });
    
    return NextResponse.json({ success: true, message: 'Application submitted successfully' });
    
  } catch (error) {
    console.error('Form submission error:', error);
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 });
  }
} 