import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { generateCustomerConfirmationEmail, generateComprehensiveApplicationEmail } from '@/lib/email-templates';

// Initialize Resend with API key (fallback to empty string for build time)
const getResend = () => {
  const apiKey = process.env.RESEND_API_KEY || '';
  return new Resend(apiKey);
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // 1. Get reCAPTCHA token and validate
    const recaptchaToken = formData.get('recaptchaToken') as string | null;

    if (!recaptchaToken) {
      return NextResponse.json({ error: 'reCAPTCHA verification required' }, { status: 400 });
    }

    if (!process.env.RECAPTCHA_SECRET_KEY) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // 2. Verify reCAPTCHA token
    console.log('🔍 reCAPTCHA verification starting...');
    console.log('Token length:', recaptchaToken.length);
    console.log('Secret key exists:', !!process.env.RECAPTCHA_SECRET_KEY);
    
    const recaptchaResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
    });

    const recaptchaData = await recaptchaResponse.json();
    console.log('🔍 reCAPTCHA response:', recaptchaData);

    if (!recaptchaData.success || recaptchaData.score < 0.5) {
      console.log('❌ reCAPTCHA failed:', {
        success: recaptchaData.success,
        score: recaptchaData.score,
        errorCodes: recaptchaData['error-codes']
      });
      return NextResponse.json({
        error: 'reCAPTCHA verification failed. Please try again.'
      }, { status: 400 });
    }

    console.log('✅ reCAPTCHA passed with score:', recaptchaData.score);

    // 3. Get form data
    const formType = formData.get('formType') as 'Flight' | 'Cruise';
    const userEmail = formData.get('userEmail') as string | null;
    const submissionTime = new Date().toLocaleString();

    // Prepare comprehensive form data for email template
    const applicationData: Record<string, unknown> = {
      formType,
      userEmail,
      recaptchaScore: recaptchaData.score,
    };

    // Extract all form data including base64 images and PDFs
    const base64Images: { fieldName: string; base64Data: string; filename: string }[] = [];
    
    // Track symptoms if isSick is YES
    const symptoms: string[] = [];
    
    for (const [key, value] of formData.entries()) {
      if (key !== 'userEmail' && key !== 'recaptchaToken' && key !== 'formType' && key !== 'travelMode') {
        const stringValue = value as string;
        
        // Check if this is a symptom field
        if (key.startsWith('symptom')) {
          console.log(`🔍 Processing symptom: ${key} = ${stringValue}`);
          // Convert string 'true'/'on' to boolean, handle both checkbox formats
          const isChecked = stringValue === 'true' || stringValue === 'on';
          if (isChecked) {
            // Map symptom field names to readable labels
            const symptomLabels: Record<string, string> = {
              'symptomAlteredMental': 'Altered Mental Status',
              'symptomColds': 'Colds',
              'symptomCough': 'Cough',
              'symptomDiarrhea': 'Diarrhea',
              'symptomBreathing': 'Difficulty of Breathing',
              'symptomDizziness': 'Dizziness',
              'symptomFever': 'Fever',
              'symptomHeadache': 'Headache',
              'symptomAppetite': 'Loss of appetite',
              'symptomSmell': 'Loss of smell',
              'symptomTaste': 'Loss of taste',
              'symptomMusclePain': 'Muscle Pain',
              'symptomNausea': 'Nausea',
              'symptomRashes': 'Rashes, vesicles or blisters',
              'symptomSoreThroat': 'Sore throat'
            };
            symptoms.push(symptomLabels[key] || key);
            console.log(`✅ Added symptom: ${symptomLabels[key] || key}`);
          }
        }
        
        // Check if this is a base64 file (image or PDF)
        if (typeof stringValue === 'string' && (stringValue.startsWith('data:image') || stringValue.startsWith('data:application/pdf'))) {
          // Determine file extension from mime type
          let extension = '.png'; // default
          if (stringValue.startsWith('data:image/jpeg') || stringValue.startsWith('data:image/jpg')) {
            extension = '.jpg';
          } else if (stringValue.startsWith('data:image/webp')) {
            extension = '.webp';
          } else if (stringValue.startsWith('data:application/pdf')) {
            extension = '.pdf';
          }
          
          // Extract file data
          base64Images.push({
            fieldName: key,
            base64Data: stringValue.split(',')[1], // Get base64 part without data:xxx;base64,
            filename: `${key}${extension}`
          });
          applicationData[key] = 'Uploaded'; // Show as uploaded in email
          console.log(`📎 Extracted ${key}${extension} for email attachment`);
        } else if (!key.startsWith('symptom')) {
          // Only add non-symptom fields to applicationData
          // Symptoms will be added as a combined list
          applicationData[key] = value;
        }
      }
    }
    
    // Add symptoms summary to application data if any were reported
    if (symptoms.length > 0) {
      applicationData['symptoms'] = symptoms.join(', ');
      console.log(`📋 Symptoms summary: ${applicationData['symptoms']}`);
    } else if (applicationData['isSick'] === 'YES') {
      applicationData['symptoms'] = 'None selected (but marked as sick)';
      console.log('⚠️ User marked as sick but no symptoms selected');
    } else {
      console.log('ℹ️ No health issues reported');
    }

    // Validate that we have at least the profile picture
    const hasPicture = base64Images.some(img => img.fieldName === 'picture');
    if (!hasPicture) {
      return NextResponse.json({ error: 'Profile picture is required.' }, { status: 400 });
    }

    // Generate professional email templates
    const adminEmailHtml = generateComprehensiveApplicationEmail(applicationData, submissionTime);
    const customerEmailHtml = generateCustomerConfirmationEmail(applicationData, submissionTime);
    
    // Get applicant name for email subject
    const applicantName = [
      applicationData.given_name || applicationData.firstName,
      applicationData.surname || applicationData.lastName
    ].filter(Boolean).join(' ') || 'Unknown Applicant';
    
    const resend = getResend();
    // Send comprehensive email to admin with all image attachments
    console.log(`📧 Sending admin email with ${base64Images.length} attachment(s)`);
    await resend.emails.send({
      from: 'Philippines eTravel <noreply@immicenter-online.com>',
      to: process.env.ADMIN_EMAIL || 'admin@yourdomain.com',
      subject: `🚨 NEW ${formType} APPLICATION - ${applicantName}`,
      html: adminEmailHtml,
      attachments: base64Images.map(img => ({
        filename: img.filename,
        content: img.base64Data, // Resend expects base64 string without the data:image prefix
      })),
    });

    // Send simple confirmation email to the customer
    if (userEmail) {
      await resend.emails.send({
        from: 'IMMI CENTER <noreply@immicenter-online.com>',
        to: userEmail,
        subject: `✅ Philippines eTravel Application Submitted - Processing within 48 hours`,
        html: customerEmailHtml,
      });
    }

    return NextResponse.json({ success: true, message: 'Details submitted successfully.' });

  } catch (error) {
    console.error('Submission failed:', error);
    return NextResponse.json({ error: 'Failed to submit details.' }, { status: 500 });
  }
}