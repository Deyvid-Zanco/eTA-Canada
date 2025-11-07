/**
 * Comprehensive email templates for Philippines eTravel applications
 * Matches actual form field names from PhilippinesStep1 and PhilippinesStep2
 */

interface ApplicationData extends Record<string, unknown> {
  // Personal Information (from PhilippinesStep1)
  surname?: string;
  given_name?: string;
  middle_name?: string;
  gender?: string;
  dob_month?: string;
  dob_day?: string;
  dob_year?: string;
  citizenship?: string;
  occupation?: string;
  
  // Contact Information (from PhilippinesStep2)
  email?: string;
  phone_country_code?: string;
  phone_number?: string;
  
  // Passport Information (from PhilippinesStep1)
  passport_country?: string;
  passport_number?: string;
  passport_issue_month?: string;
  passport_issue_day?: string;
  passport_issue_year?: string;
  passport_expiry_month?: string;
  passport_expiry_day?: string;
  passport_expiry_year?: string;
  
  // Address Information (from PhilippinesStep2)
  apartment_number?: string;
  street_number?: string;
  street_name?: string;
  city_town?: string;
  district_region?: string;
  zip_code?: string;
  address_country?: string;
  
  // Travel Information (from PhilippinesStep2)
  travel_type?: string;
  entry_month?: string;
  entry_day?: string;
  entry_year?: string;
  travel_method?: string; // "Cruise" or "Flight"
  
  // Cruise-specific
  cruise_line?: string;
  vessel_name?: string;
  port_embarkation?: string;
  port_disembarkation?: string;
  
  // Flight-specific
  airline?: string;
  flight_number?: string;
  origin_airport?: string;
  destination_airport?: string;
  
  // Declaration Items
  otherGoodsItems?: string;
  currencyItems?: string;
  consent_declaration?: boolean;
  
  // Documents
  picture?: string;
  customsDeclarationAttachment?: string;
  currencyDeclarationAttachment?: string;
  
  // Form metadata
  formType?: string;
  travelMode?: string; // "arrival" or "departure"
  userEmail?: string;
  recaptchaScore?: number;
  
  // Flight/Cruise form fields
  firstName?: string;
  middleName?: string;
  lastName?: string;
  suffix?: string;
  sex?: string;
  birthMonth?: string;
  birthDay?: string;
  birthYear?: string;
  mobileCountryCode?: string;
  mobileNumber?: string;
  passportType?: string;
  passportNumber?: string;
  countryOfBirth?: string;
  passportIssuingAuthority?: string;
  passportIssueMonth?: string;
  passportIssueDay?: string;
  passportIssueYear?: string;
  expiryMonth?: string;
  expiryDay?: string;
  expiryYear?: string;
  permanentCountryOfResidence?: string;
  residenceCountry?: string;
  residenceAddress?: string;
  residenceAddressLine2?: string;
  purposeOfTravel?: string;
  travellerType?: string;
  airlineName?: string;
  flightNumber?: string;
  originCountry?: string;
  airportOfOrigin?: string;
  destinationCountry?: string;
  airportOfDestination?: string;
  origin?: string;
  seaportOfOrigin?: string;
  destination?: string;
  seaportOfDestination?: string;
  departureMonth?: string;
  departureDay?: string;
  departureYear?: string;
  arrivalMonth?: string;
  arrivalDay?: string;
  arrivalYear?: string;
  destinationType?: string;
  destinationAddress?: string;
  countriesVisited?: string;
  exposureHistory?: string;
  isSick?: string;
  symptomAlteredMental?: boolean;
  symptomColds?: boolean;
  symptomCough?: boolean;
  symptomDiarrhea?: boolean;
  symptomBreathing?: boolean;
  symptomDizziness?: boolean;
  symptomFever?: boolean;
  symptomHeadache?: boolean;
  symptomAppetite?: boolean;
  symptomSmell?: boolean;
  symptomTaste?: boolean;
  symptomMusclePain?: boolean;
  symptomNausea?: boolean;
  symptomRashes?: boolean;
  symptomSoreThroat?: boolean;
  hasBaggageTodeclare?: string;
  digitalSignature?: string;
}

function formatDate(month?: string, day?: string, year?: string): string {
  if (!month || !day || !year) return 'Not provided';
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  const monthName = monthNames[parseInt(month) - 1] || month;
  return `${monthName} ${day}, ${year}`;
}

function renderField(label: string, value: unknown): string {
  if (!value || value === '' || value === 'Not provided') return '';
  return `
    <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px;">
      <span style="font-weight: 500; color: #374151; min-width: 200px;">${label}:</span>
      <span style="color: #111827;">${value}</span>
    </div>
  `;
}

export function generateAdminNotificationEmail(
  data: ApplicationData,
  submissionTime: string,
  imageAttachments?: Array<{filename: string, url?: string}>
): string {
  const birthDate = formatDate(data.dob_month, data.dob_day, data.dob_year);
  const passportIssueDate = formatDate(data.passport_issue_month, data.passport_issue_day, data.passport_issue_year);
  const passportExpiryDate = formatDate(data.passport_expiry_month, data.passport_expiry_day, data.passport_expiry_year);
  const entryDate = formatDate(data.entry_month, data.entry_day, data.entry_year);
  const phoneNumber = [data.phone_country_code, data.phone_number].filter(Boolean).join(' ');
  
  const isComplete = !!(data.picture && data.customsDeclarationAttachment && data.currencyDeclarationAttachment);

  return `
<table width="100%" cellpadding="0" cellspacing="0" style="background: #f9fafb; padding: 0; margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <tr>
    <td align="center" style="padding: 40px 20px;">
      <table width="800" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); margin: 0 auto;">
        
        <!-- Header -->
        <tr>
          <td style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); padding: 32px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: #ffffff; font-size: 28px; font-weight: 700; margin: 0 0 8px 0;">
              🚨 NEW PHILIPPINES ETRAVEL APPLICATION
            </h1>
            <p style="color: #fecaca; font-size: 16px; margin: 0; font-weight: 500;">
              Immediate Admin Review Required
            </p>
          </td>
        </tr>

        <!-- Status Alert -->
        <tr>
          <td style="padding: 32px;">
            <div style="background: ${isComplete ? '#ecfdf5' : '#fef3c7'}; border: 2px solid ${isComplete ? '#10b981' : '#f59e0b'}; border-radius: 8px; padding: 20px; margin-bottom: 32px;">
              <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                <span style="font-size: 32px;">${isComplete ? '✅' : '⚠️'}</span>
                <h2 style="color: ${isComplete ? '#065f46' : '#92400e'}; font-size: 22px; font-weight: 700; margin: 0;">
                  ${isComplete ? 'COMPLETE APPLICATION' : 'INCOMPLETE - ACTION REQUIRED'}
                </h2>
              </div>
              <p style="color: ${isComplete ? '#047857' : '#b45309'}; margin: 0; font-size: 15px; font-weight: 500;">
                ${isComplete 
                  ? '✓ All documents uploaded and ready for processing' 
                  : '⚠ Missing required documents - Follow up with applicant'}
              </p>
            </div>

            <!-- Submission Info -->
            <div style="background: #f3f4f6; border-radius: 8px; padding: 20px; margin-bottom: 32px;">
              <h3 style="color: #1f2937; font-size: 18px; font-weight: 600; margin: 0 0 16px 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">
                📋 Submission Information
              </h3>
              ${renderField('Submission Time', submissionTime)}
              ${renderField('Travel Method', data.formType || data.travel_method)}
              ${renderField('Applicant Email', data.email || data.userEmail)}
              ${data.recaptchaScore ? renderField('reCAPTCHA Score', `${data.recaptchaScore} ${data.recaptchaScore >= 0.7 ? '(High confidence)' : '(Medium confidence)'}`) : ''}
            </div>

            <!-- Personal & Contact Details -->
            <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
              <h3 style="color: #1f2937; font-size: 18px; font-weight: 600; margin: 0 0 16px 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">
                👤 Personal & Contact Details
              </h3>
              ${renderField('Surname(s) / Last Name(s)', data.surname)}
              ${renderField('Given Name(s) / First Name(s)', data.given_name)}
              ${renderField('Middle Name', data.middle_name)}
              ${renderField('Gender', data.gender)}
              ${renderField('Date of Birth', birthDate)}
              ${renderField('Email of Applicant', data.email)}
              ${renderField('Phone Number', phoneNumber)}
              ${renderField('Country of Citizenship', data.citizenship)}
              ${renderField('Occupation', data.occupation)}
            </div>

            <!-- Passport Information -->
            <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
              <h3 style="color: #1f2937; font-size: 18px; font-weight: 600; margin: 0 0 16px 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">
                🛂 Passport Information
              </h3>
              ${renderField('Country of Passport', data.passport_country)}
              ${renderField('Passport Number', data.passport_number)}
              ${renderField('Passport Issue Date', passportIssueDate)}
              ${renderField('Passport Expiry Date', passportExpiryDate)}
            </div>

            <!-- Residential Address -->
            <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
              <h3 style="color: #1f2937; font-size: 18px; font-weight: 600; margin: 0 0 16px 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">
                🏠 Residential Address
              </h3>
              ${renderField('Apartment Number', data.apartment_number)}
              ${renderField('Street Number', data.street_number)}
              ${renderField('Street Name', data.street_name)}
              ${renderField('City/Town', data.city_town)}
              ${renderField('District/Region', data.district_region)}
              ${renderField('ZIP Code', data.zip_code)}
              ${renderField('Country/Territory', data.address_country)}
            </div>

            <!-- Travel Information -->
            <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
              <h3 style="color: #1f2937; font-size: 18px; font-weight: 600; margin: 0 0 16px 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">
                ✈️ Travel Information
              </h3>
              ${renderField('Travel Type', data.travel_type)}
              ${renderField('Intended Date of Entry/Departure', entryDate)}
              ${renderField('Method of Travel', data.formType || data.travel_method)}
              ${data.cruise_line ? renderField('Cruise Line', data.cruise_line) : ''}
              ${data.vessel_name ? renderField('Vessel Name', data.vessel_name) : ''}
              ${data.port_embarkation ? renderField('Port of Embarkation', data.port_embarkation) : ''}
              ${data.port_disembarkation ? renderField('Port of Disembarkation', data.port_disembarkation) : ''}
              ${data.airline ? renderField('Airline', data.airline) : ''}
              ${data.flight_number ? renderField('Flight Number', data.flight_number) : ''}
              ${data.origin_airport ? renderField('Origin Airport', data.origin_airport) : ''}
              ${data.destination_airport ? renderField('Destination Airport', data.destination_airport) : ''}
            </div>

            ${data.consent_declaration ? renderField('Consent and Declaration', 'Agreed') : ''}

            <!-- Image Attachments -->
            ${imageAttachments && imageAttachments.length > 0 ? `
            <div style="background: #eff6ff; border: 1px solid #3b82f6; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
              <h3 style="color: #1e40af; font-size: 18px; font-weight: 600; margin: 0 0 16px 0;">
                📎 Attached Documents (${imageAttachments.length})
              </h3>
              ${imageAttachments.map(img => `
                <div style="background: white; padding: 12px; border-radius: 6px; margin-bottom: 8px;">
                  <span style="font-weight: 500; color: #374151;">✓ ${img.filename}</span>
                  ${img.url ? `<a href="${img.url}" style="margin-left: 12px; color: #3b82f6; text-decoration: none;">View File</a>` : '<span style="margin-left: 12px; color: #6b7280;">Attached to email</span>'}
                </div>
              `).join('')}
            </div>
            ` : ''}

            <!-- Admin Action Box -->
            <div style="background: #fef2f2; border: 2px solid #ef4444; border-radius: 8px; padding: 24px; text-align: center;">
              <h3 style="color: #dc2626; font-size: 20px; font-weight: 700; margin: 0 0 12px 0;">
                ⚡ ADMIN ACTION REQUIRED
              </h3>
              <p style="color: #b91c1c; margin: 0 0 16px 0; font-size: 15px; font-weight: 500;">
                ${isComplete 
                  ? 'This complete application is ready for immediate processing.' 
                  : 'Contact applicant to complete missing documents.'}
              </p>
              <p style="color: #991b1b; margin: 0; font-size: 13px;">
                Review all details carefully and process according to Philippines eTravel authorization procedures.
              </p>
            </div>

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 12px 12px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 12px; margin: 0;">
              🔒 CONFIDENTIAL - Admin Notification Only<br/>
              IMMI CENTER Philippines eTravel Processing System
            </p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
  `;
}

/**
 * Initial Application Email Template (for /philippines/apply - before payment)
 * This is sent when customer completes Step 1 & 2 BEFORE going to payment
 */
export function generateInitialApplicationEmail(
  data: ApplicationData,
  submissionTime: string,
  recaptchaScore?: number
): string {
  const fullName = [data.given_name, data.middle_name, data.surname].filter(Boolean).join(' ') || 'Unknown Applicant';
  const birthDate = formatDate(data.dob_month, data.dob_day, data.dob_year);
  const passportIssueDate = formatDate(data.passport_issue_month, data.passport_issue_day, data.passport_issue_year);
  const passportExpiryDate = formatDate(data.passport_expiry_month, data.passport_expiry_day, data.passport_expiry_year);
  const entryDate = formatDate(data.entry_month, data.entry_day, data.entry_year);
  const phoneNumber = [data.phone_country_code, data.phone_number].filter(Boolean).join(' ');

  return `
<table width="100%" cellpadding="0" cellspacing="0" style="background: #f9fafb; padding: 0; margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <tr>
    <td align="center" style="padding: 40px 20px;">
      <table width="800" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); margin: 0 auto;">
        
        <!-- Header -->
        <tr>
          <td style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 32px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: #ffffff; font-size: 28px; font-weight: 700; margin: 0 0 8px 0;">
              📋 NEW INITIAL APPLICATION SUBMITTED
            </h1>
            <p style="color: #fef3c7; font-size: 16px; margin: 0; font-weight: 500;">
              Customer proceeding to payment - Admin notification
            </p>
          </td>
        </tr>

        <!-- Status -->
        <tr>
          <td style="padding: 32px;">
            <div style="background: #fff7ed; border: 2px solid #f59e0b; border-radius: 8px; padding: 20px; margin-bottom: 32px;">
              <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                <span style="font-size: 32px;">⏳</span>
                <h2 style="color: #92400e; font-size: 22px; font-weight: 700; margin: 0;">
                  INITIAL APPLICATION - PAYMENT PENDING
                </h2>
              </div>
              <p style="color: #b45309; margin: 0; font-size: 15px; font-weight: 500;">
                Customer has completed initial information and is being redirected to payment. Documents will be submitted after payment confirmation.
              </p>
            </div>

            <!-- Submission Info -->
            <div style="background: #f3f4f6; border-radius: 8px; padding: 20px; margin-bottom: 32px;">
              <h3 style="color: #1f2937; font-size: 18px; font-weight: 600; margin: 0 0 16px 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">
                📋 Submission Information
              </h3>
              ${renderField('Submission Time', submissionTime)}
              ${renderField('Applicant Name', fullName)}
              ${renderField('Applicant Email', data.email)}
              ${renderField('Travel Method', data.travel_method)}
              ${renderField('Travel Type', data.travel_type)}
              ${recaptchaScore ? renderField('reCAPTCHA Score', `${recaptchaScore} ${recaptchaScore >= 0.7 ? '(High confidence)' : '(Medium confidence)'}`) : ''}
            </div>

            <!-- Personal Details -->
            <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
              <h3 style="color: #1f2937; font-size: 18px; font-weight: 600; margin: 0 0 16px 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">
                👤 Personal Details
              </h3>
              ${renderField('Surname(s) / Last Name(s)', data.surname)}
              ${renderField('Given Name(s) / First Name(s)', data.given_name)}
              ${renderField('Middle Name', data.middle_name)}
              ${renderField('Gender', data.gender)}
              ${renderField('Date of Birth', birthDate)}
              ${renderField('Country of Citizenship', data.citizenship)}
              ${renderField('Occupation', data.occupation)}
            </div>

            <!-- Contact Details -->
            <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
              <h3 style="color: #1f2937; font-size: 18px; font-weight: 600; margin: 0 0 16px 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">
                📞 Contact Information
              </h3>
              ${renderField('Email Address', data.email)}
              ${renderField('Phone Number', phoneNumber)}
            </div>

            <!-- Passport Information -->
            <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
              <h3 style="color: #1f2937; font-size: 18px; font-weight: 600; margin: 0 0 16px 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">
                🛂 Passport Information
              </h3>
              ${renderField('Country of Passport', data.passport_country)}
              ${renderField('Passport Number', data.passport_number)}
              ${renderField('Passport Issue Date', passportIssueDate)}
              ${renderField('Passport Expiry Date', passportExpiryDate)}
            </div>

            <!-- Residential Address -->
            <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
              <h3 style="color: #1f2937; font-size: 18px; font-weight: 600; margin: 0 0 16px 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">
                🏠 Residential Address
              </h3>
              ${renderField('Apartment Number', data.apartment_number)}
              ${renderField('Street Number', data.street_number)}
              ${renderField('Street Name', data.street_name)}
              ${renderField('City/Town', data.city_town)}
              ${renderField('District/Region', data.district_region)}
              ${renderField('ZIP Code', data.zip_code)}
              ${renderField('Country/Territory', data.address_country)}
            </div>

            <!-- Travel Information -->
            <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
              <h3 style="color: #1f2937; font-size: 18px; font-weight: 600; margin: 0 0 16px 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">
                ✈️ Travel Information
              </h3>
              ${renderField('Travel Type', data.travel_type)}
              ${renderField('Intended Date of Entry/Departure', entryDate)}
              ${renderField('Method of Travel', data.travel_method)}
              ${renderField('Consent and Declaration', data.consent_declaration ? 'Agreed' : 'Not Agreed')}
            </div>

            <!-- Next Steps -->
            <div style="background: #fef3c7; border: 2px solid #f59e0b; border-radius: 8px; padding: 24px; text-align: center;">
              <h3 style="color: #92400e; font-size: 20px; font-weight: 700; margin: 0 0 12px 0;">
                ⏳ NEXT STEPS
              </h3>
              <p style="color: #b45309; margin: 0 0 8px 0; font-size: 15px; font-weight: 500;">
                Customer is proceeding to payment gateway
              </p>
              <p style="color: #92400e; margin: 0; font-size: 13px;">
                After successful payment, customer will receive email with link to complete ${data.travel_method} details and upload required documents.
              </p>
            </div>

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 12px 12px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 12px; margin: 0;">
              🔒 ADMIN NOTIFICATION - Initial Application Stage<br/>
              IMMI CENTER Philippines eTravel Processing System
            </p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
  `;
}

/**
 * Comprehensive Application Email Template (for /forms/flight and /forms/cruise - after payment)
 * This includes ALL form data from the detailed flight/cruise forms
 */
export function generateComprehensiveApplicationEmail(
  data: ApplicationData,
  submissionTime: string
): string {
  const fullName = [data.given_name || data.firstName, data.middle_name || data.middleName, data.surname || data.lastName].filter(Boolean).join(' ') || 'Unknown Applicant';
  const formType = (data.formType || data.travel_method || 'Unknown').toUpperCase();
  const travelMode = (data.travelMode || data.travel_type || 'arrival').toUpperCase();
  
  const isComplete = !!(data.picture && data.customsDeclarationAttachment && data.currencyDeclarationAttachment);

  return `
<table width="100%" cellpadding="0" cellspacing="0" style="background: #f9fafb; padding: 0; margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <tr>
    <td align="center" style="padding: 40px 20px;">
      <table width="900" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); margin: 0 auto;">
        
        <!-- Header -->
        <tr>
          <td style="background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); padding: 32px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: #ffffff; font-size: 32px; font-weight: 700; margin: 0 0 8px 0;">
              🚨 ${formType} ${travelMode} APPLICATION SUBMITTED
            </h1>
            <p style="color: #dbeafe; font-size: 18px; margin: 0; font-weight: 500;">
              Complete ${formType === 'FLIGHT' ? 'Flight ✈️' : 'Cruise 🚢'} Details - ${travelMode === 'ARRIVAL' ? 'Arriving in' : 'Departing from'} Philippines
            </p>
          </td>
        </tr>

        <!-- Status -->
        <tr>
          <td style="padding: 32px;">
            <div style="background: ${isComplete ? '#ecfdf5' : '#fef3c7'}; border: 2px solid ${isComplete ? '#10b981' : '#f59e0b'}; border-radius: 8px; padding: 20px; margin-bottom: 32px;">
              <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                <span style="font-size: 32px;">${isComplete ? '✅' : '⚠️'}</span>
                <h2 style="color: ${isComplete ? '#065f46' : '#92400e'}; font-size: 22px; font-weight: 700; margin: 0;">
                  ${isComplete ? 'COMPLETE APPLICATION' : 'INCOMPLETE - DOCUMENTS MISSING'}
                </h2>
              </div>
              <p style="color: ${isComplete ? '#047857' : '#b45309'}; margin: 0; font-size: 15px; font-weight: 500;">
                ${isComplete 
                  ? '✓ All required documents uploaded - Ready for processing' 
                  : '⚠ Missing profile picture or declaration forms - Contact applicant'}
              </p>
            </div>

            <!-- Submission Info -->
            <div style="background: #f3f4f6; border-radius: 8px; padding: 20px; margin-bottom: 32px;">
              <h3 style="color: #1f2937; font-size: 18px; font-weight: 600; margin: 0 0 16px 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">
                📋 Submission Details
              </h3>
              ${renderField('Submission Time', submissionTime)}
              ${renderField('Application Type', `${formType} ${travelMode}`)}
              ${renderField('Applicant Name', fullName)}
              ${renderField('Applicant Email', data.userEmail || data.email)}
              ${data.recaptchaScore ? renderField('reCAPTCHA Score', `${data.recaptchaScore} ${data.recaptchaScore >= 0.7 ? '(High confidence)' : '(Medium confidence)'}`) : ''}
            </div>

            <!-- All form data follows below with proper sections -->
            <div style="font-size: 14px;">
              <!-- Personal Information -->
              ${(data.firstName || data.middleName || data.lastName || data.sex || data.birthMonth) ? `
              <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
                <h3 style="color: #1f2937; font-size: 18px; font-weight: 600; margin: 0 0 16px 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">
                  👤 Personal Information
                </h3>
                ${renderField('First Name', data.firstName)}
                ${renderField('Middle Name', data.middleName)}
                ${renderField('Last Name', data.lastName)}
                ${renderField('Suffix', data.suffix)}
                ${renderField('Sex', data.sex)}
                ${renderField('Date of Birth', formatDate(data.birthMonth, data.birthDay, data.birthYear))}
              </div>
              ` : ''}

              <!-- Contact Information -->
              ${(data.mobileCountryCode || data.mobileNumber) ? `
              <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
                <h3 style="color: #1f2937; font-size: 18px; font-weight: 600; margin: 0 0 16px 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">
                  📞 Contact Information
                </h3>
                ${renderField('Mobile Number', `${data.mobileCountryCode || ''} ${data.mobileNumber || ''}`.trim())}
              </div>
              ` : ''}

              <!-- Passport Information -->
              ${(data.passportType || data.passportNumber || data.citizenship) ? `
              <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
                <h3 style="color: #1f2937; font-size: 18px; font-weight: 600; margin: 0 0 16px 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">
                  🛂 Passport Information
                </h3>
                ${renderField('Passport Type', data.passportType)}
                ${renderField('Passport Number', data.passportNumber)}
                ${renderField('Citizenship', data.citizenship)}
                ${renderField('Country of Birth', data.countryOfBirth)}
                ${renderField('Passport Issuing Authority', data.passportIssuingAuthority)}
                ${renderField('Passport Issue Date', formatDate(data.passportIssueMonth, data.passportIssueDay, data.passportIssueYear))}
                ${renderField('Passport Expiry Date', formatDate(data.expiryMonth, data.expiryDay, data.expiryYear))}
                ${renderField('Occupation', data.occupation)}
              </div>
              ` : ''}

              <!-- Permanent Address -->
              ${(data.permanentCountryOfResidence || data.residenceAddress) ? `
              <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
                <h3 style="color: #1f2937; font-size: 18px; font-weight: 600; margin: 0 0 16px 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">
                  🏠 Permanent Address
                </h3>
                ${renderField('Permanent Country of Residence', data.permanentCountryOfResidence)}
                ${renderField('Country', data.residenceCountry)}
                ${renderField('Address', data.residenceAddress)}
                ${renderField('Address Line 2', data.residenceAddressLine2)}
              </div>
              ` : ''}

              <!-- Travel Details (Flight/Cruise Specific) -->
              ${(data.purposeOfTravel || data.travellerType) ? `
              <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
                <h3 style="color: #1f2937; font-size: 18px; font-weight: 600; margin: 0 0 16px 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">
                  ${formType === 'FLIGHT' ? '✈️' : '🚢'} Travel Details
                </h3>
                ${renderField('Purpose of Travel', data.purposeOfTravel)}
                ${renderField('Traveller Type', data.travellerType)}
                
                ${formType === 'FLIGHT' ? `
                  ${renderField('Airline Name', data.airlineName)}
                  ${renderField('Flight Number', data.flightNumber)}
                  ${renderField('Origin Country', data.originCountry)}
                  ${renderField('Origin Airport', data.airportOfOrigin)}
                  ${renderField('Destination Country', data.destinationCountry)}
                  ${renderField('Destination Airport', data.airportOfDestination)}
                ` : `
                  ${renderField('Cruise Line', data.vesselName)}
                  ${renderField('Origin', data.origin)}
                  ${renderField('Seaport of Origin', data.seaportOfOrigin)}
                  ${renderField('Destination', data.destination)}
                  ${renderField('Seaport of Destination', data.seaportOfDestination)}
                `}
                
                ${renderField('Departure Date', formatDate(data.departureMonth, data.departureDay, data.departureYear))}
                ${renderField('Arrival Date', formatDate(data.arrivalMonth, data.arrivalDay, data.arrivalYear))}
              </div>
              ` : ''}

              <!-- Destination Address -->
              ${(data.destinationType || data.destinationAddress) ? `
              <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
                <h3 style="color: #1f2937; font-size: 18px; font-weight: 600; margin: 0 0 16px 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">
                  📍 Destination in Philippines
                </h3>
                ${renderField('Destination Type', data.destinationType)}
                ${renderField('Destination Address', data.destinationAddress)}
              </div>
              ` : ''}

              <!-- Health Declaration -->
              ${(data.countriesVisited || data.exposureHistory || data.isSick) ? `
              <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
                <h3 style="color: #1f2937; font-size: 18px; font-weight: 600; margin: 0 0 16px 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">
                  🏥 Health Declaration
                </h3>
                ${renderField('Countries Visited (Last 30 days)', data.countriesVisited)}
                ${renderField('Exposure to Infectious Disease', data.exposureHistory)}
                ${renderField('Been Sick in Past 30 Days', data.isSick)}
                ${data.isSick === 'YES' ? `
                <div style="margin-left: 20px; margin-top: 12px;">
                  <strong>Symptoms:</strong> ${data.symptoms 
                    ? (data.symptoms === 'None selected (but marked as sick)' 
                      ? '<span style="color: #ef4444; font-weight: 500;">None selected (⚠️ Applicant marked as sick but did not specify symptoms)</span>'
                      : `<span style="color: #059669; font-weight: 500;">${data.symptoms}</span>`)
                    : '<span style="color: #ef4444; font-weight: 500;">Not specified</span>'}
                </div>
                ` : ''}
              </div>
              ` : ''}

              <!-- Baggage Declaration -->
              ${renderField('Has Baggage to Declare', data.hasBaggageTodeclare)}

              <!-- Documents -->
              <div style="background: #eff6ff; border: 1px solid #3b82f6; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                <h3 style="color: #1e40af; font-size: 18px; font-weight: 600; margin: 0 0 16px 0;">
                  📎 Uploaded Documents
                </h3>
                <div style="display: grid; gap: 12px;">
                  <div style="background: white; padding: 12px; border-radius: 6px;">
                    <span style="font-weight: 500; color: #374151;">Profile Picture:</span>
                    <span style="margin-left: 12px; color: ${data.picture ? '#10b981' : '#ef4444'};">
                      ${data.picture ? '✓ Attached to email' : '❌ Missing'}
                    </span>
                  </div>
                  <div style="background: white; padding: 12px; border-radius: 6px;">
                    <span style="font-weight: 500; color: #374151;">Customs Declaration Form:</span>
                    <span style="margin-left: 12px; color: ${data.customsDeclarationAttachment ? '#10b981' : '#ef4444'};">
                      ${data.customsDeclarationAttachment ? '✓ Attached to email' : '❌ Missing'}
                    </span>
                  </div>
                  <div style="background: white; padding: 12px; border-radius: 6px;">
                    <span style="font-weight: 500; color: #374151;">Currency Declaration Form:</span>
                    <span style="margin-left: 12px; color: ${data.currencyDeclarationAttachment ? '#10b981' : '#ef4444'};">
                      ${data.currencyDeclarationAttachment ? '✓ Attached to email' : '❌ Missing'}
                    </span>
                  </div>
                  <div style="background: white; padding: 12px; border-radius: 6px;">
                    <span style="font-weight: 500; color: #374151;">Digital Signature:</span>
                    <span style="margin-left: 12px; color: ${data.digitalSignature ? '#10b981' : '#ef4444'};">
                      ${data.digitalSignature ? `✓ Signed: ${data.digitalSignature}` : '❌ Missing'}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Admin Action -->
              <div style="background: #fef2f2; border: 2px solid #ef4444; border-radius: 8px; padding: 24px; text-align: center;">
                <h3 style="color: #dc2626; font-size: 20px; font-weight: 700; margin: 0 0 12px 0;">
                  ⚡ ADMIN ACTION REQUIRED
                </h3>
                <p style="color: #b91c1c; margin: 0; font-size: 15px; font-weight: 500;">
                  ${isComplete 
                    ? 'Application is complete and ready for processing.' 
                    : 'Contact applicant to provide missing documents.'}
                </p>
              </div>

            </div>

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 12px 12px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 12px; margin: 0;">
              🔒 ADMIN NOTIFICATION - ${formType} ${travelMode} Application<br/>
              IMMI CENTER Philippines eTravel Processing System
            </p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
  `;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function generateCustomerConfirmationEmail(data: ApplicationData, _submissionTime: string): string {
  const fullName = [data.given_name, data.middle_name, data.surname].filter(Boolean).join(' ') || 'Valued Customer';
  
  return `
<table width="100%" cellpadding="0" cellspacing="0" style="background: #f9fafb; padding: 0; margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <tr>
    <td align="center" style="padding: 40px 20px;">
      <table width="600" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); margin: 0 auto;">
        
        <!-- Header -->
        <tr>
          <td style="background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); padding: 32px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: #ffffff; font-size: 24px; font-weight: 700; margin: 0 0 8px 0;">
              ✅ Application Submitted Successfully!
            </h1>
            <p style="color: #dbeafe; font-size: 16px; margin: 0; font-weight: 500;">
              🇵🇭 Philippines eTravel Authorization
            </p>
          </td>
        </tr>

        <!-- Content -->
        <tr>
          <td style="padding: 32px;">
            <p style="font-size: 18px; color: #1f2937; margin: 0 0 16px 0; font-weight: 600;">
              Hello ${fullName}!
            </p>
            
            <p style="font-size: 16px; color: #374151; margin: 0 0 24px 0; line-height: 1.6;">
              Thank you for submitting your Philippines eTravel application details. We have successfully received all your information and required documents.
            </p>

            <!-- Processing Info -->
            <div style="background: #eff6ff; border: 1px solid #3b82f6; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
              <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                <span style="font-size: 24px;">⏱️</span>
                <h3 style="color: #1e40af; font-size: 18px; font-weight: 600; margin: 0;">Processing Timeline</h3>
              </div>
              <p style="color: #1e3a8a; margin: 0; font-size: 16px; line-height: 1.6;">
                Your application will be processed within <strong>48 hours</strong>. We will notify you via email once your Philippines eTravel authorization is ready.
              </p>
            </div>

            <!-- Important Notes -->
            <div style="background: #fef7cd; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
              <h3 style="color: #92400e; font-size: 16px; font-weight: 600; margin: 0 0 12px 0;">📧 Keep an Eye on Your Email</h3>
              <p style="color: #b45309; margin: 0; font-size: 14px; line-height: 1.5;">
                Please monitor your email inbox <strong>and SPAM folder</strong> for updates. We will send your completed authorization document once processing is finished.
              </p>
            </div>

            <!-- Support -->
            <p style="font-size: 14px; color: #6b7280; margin: 0; line-height: 1.6;">
              If you have any questions or need assistance, please don't hesitate to contact our support team.
            </p>

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background: #f9fafb; padding: 24px 32px; text-align: center; border-radius: 0 0 12px 12px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px; margin: 0 0 8px 0; font-weight: 500;">
              Best regards,<br/>The IMMI CENTER Team
            </p>
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              &copy; ${new Date().getFullYear()} IMMI CENTER - Philippines eTravel Services
            </p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
  `;
}
