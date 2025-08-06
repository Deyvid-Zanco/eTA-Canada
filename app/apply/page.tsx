"use client";
import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState, Suspense } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Image from 'next/image';
import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import Script from 'next/script'; // Ensure Next.js Script is imported

// Add this for TypeScript to recognize grecaptcha on window
declare global {
  interface Window {
    grecaptcha: {
      execute(siteKey: string, options: { action: string }): Promise<string>;
    };
  }
}

// Define validation schema with conditional logic
const usVisaNationalities = [
  'Mexico',
  'Brazil',
  'Costa Rica',
  'Panama',
  'Philippines',
  'Saint Kitts and Nevis',
  'Saint Lucia',
  'Saint Vincent and the Grenadines',
  'Seychelles',
  'Thailand',
  'Trinidad and Tobago',
  'Uruguay',
  'Antigua and Barbuda',
  'Morocco',
  'Argentina',
];

type FormValues = {
  travel_document: string;
  nationality: string;
  passport_number: string;
  passport_number_confirm: string;
  surname: string;
  given_name: string;
  dob?: string | null;
  gender: string;
  birth_country: string;
  birth_city?: string | null;
  passport_issue_date?: string | null;
  passport_expiry_date?: string | null;
  passport_issue_month?: string | null;
  passport_issue_day?: string | null;
  passport_issue_year?: string | null;
  passport_expiry_month?: string | null;
  passport_expiry_day?: string | null;
  passport_expiry_year?: string | null;
  additional_nationality?: string | null;
  additional_nationality_details?: string | null;
  us_visa_number?: string | null;
  us_visa_number_confirm?: string | null;
  taiwan_id?: string | null;
  us_visa_expiry_month?: string | null;
  us_visa_expiry_day?: string | null;
  us_visa_expiry_year?: string | null;
  dob_month?: string | null;
  dob_day?: string | null;
  dob_year?: string | null;
  marital_status?: string | null;
  canada_visa_applied?: string | null;
  occupation: string;
  job_description?: string;
  employer_name?: string;
  employment_country?: string;
  apartment_number?: string | null | undefined;
  street_number: string;
  street_name: string;
  city_town: string;
  district_region?: string | null | undefined;
  zip_code: string;
  address_country: string;
  email: string;
  email_confirm: string;
  phone: string;
  alt_phone?: string | null | undefined;
  preferred_language: string;
  do_you_know_travel_date: string;
  travel_date_month?: string | null | undefined;
  travel_date_day?: string | null | undefined;
  travel_date_year?: string | null | undefined;
  consent_declaration?: boolean;
  previous_visa_number?: string;
  employment_start_date?: string;
};

const schema: yup.ObjectSchema<FormValues> = yup.object({
  travel_document: yup.string().required('This field is required'),
  nationality: yup.string().required('This field is required'),
  passport_number: yup.string().required('This field is required'),
  passport_number_confirm: yup.string()
    .required('This field is required')
    .oneOf([yup.ref('passport_number')], 'Passport numbers must match'),
  surname: yup.string().required('This field is required'),
  given_name: yup.string().required('This field is required'),
  dob: yup.string().nullable().notRequired(),
  dob_month: yup.string().nullable().notRequired(),
  dob_day: yup.string().nullable().notRequired(),
  dob_year: yup.string().nullable().notRequired(),
  gender: yup.string().required('This field is required'),
  birth_country: yup.string().required('This field is required'),
  birth_city: yup.string().nullable().notRequired(),
  passport_issue_date: yup.string().nullable().notRequired(),
  passport_expiry_date: yup.string().nullable().notRequired(),
  passport_issue_month: yup.string().nullable().notRequired(),
  passport_issue_day: yup.string().nullable().notRequired(),
  passport_issue_year: yup.string().nullable().notRequired(),
  passport_expiry_month: yup.string().nullable().notRequired(),
  passport_expiry_day: yup.string().nullable().notRequired(),
  passport_expiry_year: yup.string().nullable().notRequired(),
  additional_nationality: yup.string().nullable().notRequired(),
  additional_nationality_details: yup.string().nullable().notRequired(),
  us_visa_number: yup.string()
    .when('nationality', {
      is: (val: string) => usVisaNationalities.includes(val),
      then: (schema) => schema
        .required('This field is required')
        .matches(/^[A-Za-z][0-9]{7}$/, 'Visa number must be 1 letter followed by 7 digits (e.g. A1234567)')
        .length(8, 'Visa number must be exactly 8 characters'),
      otherwise: (schema) => schema.notRequired().nullable(),
    }),
  us_visa_number_confirm: yup.string()
    .when('nationality', {
      is: (val: string) => usVisaNationalities.includes(val),
      then: (schema) => schema
        .required('This field is required')
        .oneOf([yup.ref('us_visa_number')], 'Visa numbers must match'),
      otherwise: (schema) => schema.notRequired().nullable(),
    }),
  us_visa_expiry_month: yup.string().nullable().notRequired(),
  us_visa_expiry_day: yup.string().nullable().notRequired(),
  us_visa_expiry_year: yup.string().nullable().notRequired(),
  taiwan_id: yup.string().nullable().notRequired(),
  marital_status: yup.string().nullable().notRequired(),
  canada_visa_applied: yup.string().nullable().notRequired(),
  occupation: yup.string().required('This field is required'),
  job_description: yup.string().optional(),
  employer_name: yup.string().optional(),
  employment_country: yup.string().optional(),
  apartment_number: yup.string().nullable().notRequired(),
  street_number: yup.string().required('This field is required'),
  street_name: yup.string().required('This field is required'),
  city_town: yup.string().required('This field is required'),
  district_region: yup.string().nullable().notRequired(),
  zip_code: yup.string().required('This field is required'),
  address_country: yup.string().required('This field is required'),
  email: yup.string().email('Invalid email').required('This field is required'),
  email_confirm: yup.string().oneOf([yup.ref('email')], 'Emails must match').required('This field is required'),
  phone: yup.string().required('This field is required'),
  alt_phone: yup.string().nullable().notRequired(),
  preferred_language: yup.string().required('This field is required'),
  do_you_know_travel_date: yup.string().required('This field is required'),
  travel_date_month: yup.string().nullable().when('do_you_know_travel_date', {
    is: 'Yes',
    then: (schema) => schema.required('Month is required'),
    otherwise: (schema) => schema.notRequired().nullable(),
  }),
  travel_date_day: yup.string().nullable().when('do_you_know_travel_date', {
    is: 'Yes',
    then: (schema) => schema.required('Day is required'),
    otherwise: (schema) => schema.notRequired().nullable(),
  }),
  travel_date_year: yup.string().nullable().when('do_you_know_travel_date', {
    is: 'Yes',
    then: (schema) => schema.required('Year is required'),
    otherwise: (schema) => schema.notRequired().nullable(),
  }),
  consent_declaration: yup.boolean().oneOf([true], 'You must agree to the declaration').required('You must agree to the declaration'),
  previous_visa_number: yup.string().when('canada_visa_applied', {
    is: 'Yes',
    then: (schema) => schema.required('Please enter your previous Canadian visa/permit/ETA number'),
    otherwise: (schema) => schema.notRequired().nullable(),
  }),
  employment_start_date: yup.string().optional(),
});

function getYearOptions(start: number, end: number) {
  const years = [];
  for (let y = start; y <= end; y++) years.push(y);
  return years;
}
const currentYear = new Date().getFullYear();
const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const monthNumbers = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));

function ApplyFormMultiStep() {
  const [step, setStep] = useState(0);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const methods = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: 'onSubmit',
    defaultValues: {
      travel_document: '',
      nationality: '',
      passport_number: '',
      passport_number_confirm: '',
      surname: '',
      given_name: '',
      dob: '',
      gender: '',
      birth_country: '',
      birth_city: '',
      passport_issue_date: '',
      passport_expiry_date: '',
      passport_issue_month: '',
      passport_issue_day: '',
      passport_issue_year: '',
      passport_expiry_month: '',
      passport_expiry_day: '',
      passport_expiry_year: '',
      additional_nationality: '',
      additional_nationality_details: '',
      us_visa_number: '',
      us_visa_number_confirm: '',
      taiwan_id: '',
      us_visa_expiry_month: '',
      us_visa_expiry_day: '',
      us_visa_expiry_year: '',
      dob_month: '',
      dob_day: '',
      dob_year: '',
      marital_status: '',
      canada_visa_applied: '',
      occupation: '',
      job_description: undefined,
      employer_name: undefined,
      employment_country: undefined,
      apartment_number: '',
      street_number: '',
      street_name: '',
      city_town: '',
      district_region: '',
      zip_code: '',
      address_country: '',
      email: '',
      email_confirm: '',
      phone: '',
      alt_phone: '',
      preferred_language: '',
      do_you_know_travel_date: '',
      travel_date_month: null,
      travel_date_day: null,
      travel_date_year: null,
      consent_declaration: false,
      previous_visa_number: '',
      employment_start_date: undefined,
    },
  });
  const { handleSubmit, formState, watch, register, reset, trigger, setValue } = methods;
  const nationality = watch('nationality');
  const additional_nationality = watch('additional_nationality');
  const do_you_know_travel_date = watch('do_you_know_travel_date');
  const showTaiwanID = nationality === 'Taiwan (holders of passports containing a personal identification number)';
  const showUSVisaFields = usVisaNationalities.includes(nationality);
  const showMexicoVisaImage = nationality === 'Mexico';
  const showArgentinaVisaImage = showUSVisaFields && nationality !== 'Mexico';
  const occupation = watch('occupation');
  const canadaVisaApplied = watch('canada_visa_applied');
  const hideJobFields = ['Unemployed', 'Homemaker', 'Retired', 'Military/armed forces'].includes(occupation);

  // Clear job fields when occupation changes to hide them
  React.useEffect(() => {
    if (hideJobFields) {
      setValue('job_description', undefined);
      setValue('employer_name', undefined);
      setValue('employment_start_date', undefined);
      setValue('employment_country', undefined);
    }
  }, [occupation, hideJobFields, setValue]);

  // **FIXED**: `stepFields` array now correctly groups `employment_country` inside the conditional block.
  const stepFields: (keyof FormValues)[][] = [
    [
      'travel_document',
      'nationality',
      ...(showTaiwanID ? ['taiwan_id'] as (keyof FormValues)[] : []),
      ...(showUSVisaFields ? [
        'us_visa_number',
        'us_visa_number_confirm',
        'us_visa_expiry_month',
        'us_visa_expiry_day',
        'us_visa_expiry_year',
      ] as (keyof FormValues)[] : []),
      'passport_number',
      'passport_number_confirm',
      'surname',
      'given_name',
      'dob_month',
      'dob_day',
      'dob_year',
      'gender',
      'birth_country',
      'birth_city',
      'passport_issue_month',
      'passport_issue_day',
      'passport_issue_year',
      'passport_expiry_month',
      'passport_expiry_day',
      'passport_expiry_year',
    ],
    [
      'additional_nationality',
      ...(additional_nationality === 'Yes' ? ['additional_nationality_details'] as (keyof FormValues)[] : []),
      'marital_status',
      'canada_visa_applied',
      'occupation',
      ...(!hideJobFields ? [
        'job_description',
        'employer_name',
        'employment_start_date',
        'employment_country',
      ] as (keyof FormValues)[] : []),
      'apartment_number',
      'street_number',
      'street_name',
      'city_town',
      'district_region',
      'zip_code',
      'address_country',
      'email',
      'email_confirm',
      'phone',
      'alt_phone',
      'preferred_language',
      'do_you_know_travel_date',
      ...(do_you_know_travel_date === 'Yes' ? [
        'travel_date_month',
        'travel_date_day',
        'travel_date_year',
      ] as (keyof FormValues)[] : []),
      'consent_declaration',
      ...(canadaVisaApplied === 'Yes' ? ['previous_visa_number'] as (keyof FormValues)[] : []),
    ],
  ];

  const onSubmit = async (data: FormValues) => {
    console.log('🚀 Form submission started');
    console.log('📋 Form data:', data);
    console.log('🔍 Form validation state:', formState.errors);
    console.log('📊 Form state:', {
      isDirty: formState.isDirty,
      isValid: formState.isValid,
      isSubmitting: formState.isSubmitting,
      submitCount: formState.submitCount
    });
    
    // Check if there are any validation errors
    if (Object.keys(formState.errors).length > 0) {
      console.log('❌ Validation errors found:', formState.errors);
      console.log('🔍 Current occupation:', occupation);
      console.log('🔍 hideJobFields:', hideJobFields);
      setErrorMessage('Please fix all validation errors before submitting.');
      setSubmitStatus('error');
      return;
    }
    
    setSubmitStatus('idle');
    setErrorMessage('');
    setPaymentError('');
    try {
      // 1. Run reCAPTCHA v3
      console.log('🔍 Starting reCAPTCHA verification...');
      let recaptchaToken = '';
      if (typeof window !== 'undefined' && window.grecaptcha) {
        recaptchaToken = await window.grecaptcha.execute(
          process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!,
          { action: 'submit' }
        );
        console.log('✅ reCAPTCHA token obtained:', recaptchaToken ? 'Token received' : 'No token');
      } else {
        throw new Error('reCAPTCHA not loaded. Please ensure the reCAPTCHA script is on the page.');
      }

      // 2. POST to /api/apply with form data and recaptcha token
      console.log('📤 Sending data to /api/apply...');
      const response = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, recaptchaToken }),
      });

      console.log('📥 API response status:', response.status);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.log('❌ API error:', errorData);
        throw new Error(errorData.message || 'Failed to submit application');
      }

      console.log('✅ API submission successful');

      // 3. Create Stripe Checkout session
      console.log('💳 Creating Stripe checkout session...');
      const checkoutRes = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          name: data.given_name + ' ' + data.surname,
        }),
      });
      console.log('📥 Stripe response status:', checkoutRes.status);
      if (!checkoutRes.ok) {
        const errorData = await checkoutRes.json().catch(() => ({}));
        console.log('❌ Stripe error:', errorData);
        throw new Error(errorData.error || 'Failed to initiate payment');
      }
      const { sessionId } = await checkoutRes.json();
      console.log('✅ Stripe session created:', sessionId ? 'Session ID received' : 'No session ID');
      if (!sessionId) throw new Error('No sessionId returned from payment API');

      // 4. Redirect to Stripe Checkout
      console.log('🔄 Redirecting to Stripe...');
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
      if (!stripe) throw new Error('Stripe.js failed to load');
      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) throw new Error(error.message);

      console.log('✅ Stripe redirect successful');
      setSubmitStatus('success');
      setHasSubmitted(true);
      reset();
    } catch (err: unknown) {
      console.log('❌ Form submission error:', err);
      setSubmitStatus('error');
      if (err instanceof Error) {
        setErrorMessage(err.message || 'Submission failed. Please try again.');
        setPaymentError(err.message || 'Payment initiation failed.');
      } else {
        setErrorMessage('An unknown error occurred. Please try again.');
        setPaymentError('An unknown payment error occurred.');
      }
    }
  };

  // Reset hasSubmitted if the user changes any field
  const isDirty = formState.isDirty;
  React.useEffect(() => {
    if (isDirty) setHasSubmitted(false);
  }, [isDirty]);

  const formRef = React.useRef<HTMLFormElement>(null);
  const didMountRef = React.useRef(false);

  // Scroll to top of form when step changes, but not on initial mount
  React.useLayoutEffect(() => {
    if (didMountRef.current) {
      const timeoutId = setTimeout(() => {
        if (formRef.current) {
          formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
      
      return () => clearTimeout(timeoutId);
    } else {
      didMountRef.current = true;
    }
  }, [step]);

  const steps = [
    // Step 0: Passport and personal details
    <div key="passport-personal-details" className="mb-8">
      <h2 className="text-xl font-bold mb-4">Passport details of applicant</h2>
      <div className="mb-6">
        <label className="block mb-1 font-medium">TRAVEL DOCUMENT <span className="text-red-600">*</span></label>
        <select {...register('travel_document')} className="w-full border rounded p-2">
          <option value="">Please select</option>
          <option value="Passport - ordinary/regular">Passport - ordinary/regular</option>
          <option value="Passport - diplomatic">Passport - diplomatic</option>
          <option value="Passport - official">Passport - official</option>
          <option value="Passport - service">Passport - service</option>
          <option value="Emergency/temporary travel document">Emergency/temporary travel document</option>
          <option value="Refugee travel document">Refugee travel document</option>
          <option value="Alien passport/travel document issued for non-citizens">Alien passport/travel document issued for non-citizens</option>
          <option value="Permit to re-enter the United States (I-327)">Permit to re-enter the United States (I-327)</option>
          <option value="U.S. Refugee travel document (I-571)">U.S. Refugee travel document (I-571)</option>
        </select>
        {formState.errors.travel_document && <p className="text-red-600 text-sm">{formState.errors.travel_document.message}</p>}
      </div>
      <div className="mb-6">
        <label className="block mb-1 font-medium">WHAT IS THE NATIONALITY NOTED ON THIS PASSPORT? <span className="text-red-600">*</span></label>
        <select {...register('nationality')} className="w-full border rounded p-2">
          <option value="">Please select</option>
          <option value="Andorra">Andorra</option>
          <option value="Antigua and Barbuda">Antigua and Barbuda</option>
          <option value="Argentina">Argentina</option>
          <option value="Australia">Australia</option>
          <option value="Austria">Austria</option>
          <option value="Bahamas">Bahamas</option>
          <option value="Barbados">Barbados</option>
          <option value="Belgium">Belgium</option>
          <option value="Brazil">Brazil</option>
          <option value="Bulgaria">Bulgaria</option>
          <option value="Brunei Darussalam">Brunei Darussalam</option>
          <option value="Chile">Chile</option>
          <option value="China (Hong Kong SAR)">China (Hong Kong SAR)</option>
          <option value="Croatia">Croatia</option>
          <option value="Costa Rica">Costa Rica</option>
          <option value="Cyprus">Cyprus</option>
          <option value="Czech Republic">Czech Republic</option>
          <option value="Denmark">Denmark</option>
          <option value="Estonia">Estonia</option>
          <option value="Finland">Finland</option>
          <option value="France">France</option>
          <option value="Germany">Germany</option>
          <option value="Greece">Greece</option>
          <option value="Hungary">Hungary</option>
          <option value="Iceland">Iceland</option>
          <option value="Ireland">Ireland</option>
          <option value="Israel (holders of Israeli national passports)">Israel (holders of Israeli national passports)</option>
          <option value="Italy">Italy</option>
          <option value="Japan">Japan</option>
          <option value="Latvia">Latvia</option>
          <option value="Liechtenstein">Liechtenstein</option>
          <option value="Lithuania">Lithuania</option>
          <option value="Luxembourg">Luxembourg</option>
          <option value="Malta">Malta</option>
          <option value="Mexico">Mexico</option>
          <option value="Monaco">Monaco</option>
          <option value="Morocco">Morocco</option>
          <option value="Norway">Norway</option>
          <option value="New Zealand">New Zealand</option>
          <option value="Netherlands">Netherlands</option>
          <option value="Panama">Panama</option>
          <option value="Papua New Guinea">Papua New Guinea</option>
          <option value="Philippines">Philippines</option>
          <option value="Poland">Poland</option>
          <option value="Portugal">Portugal</option>
          <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
          <option value="Saint Lucia">Saint Lucia</option>
          <option value="Saint Vincent and the Grenadines">Saint Vincent and the Grenadines</option>
          <option value="Samoa">Samoa</option>
          <option value="San Marino">San Marino</option>
          <option value="Seychelles">Seychelles</option>
          <option value="Singapore">Singapore</option>
          <option value="Slovakia">Slovakia</option>
          <option value="Slovenia">Slovenia</option>
          <option value="Solomon Islands">Solomon Islands</option>
          <option value="South Korea">South Korea</option>
          <option value="Spain">Spain</option>
          <option value="Sweden">Sweden</option>
          <option value="Switzerland">Switzerland</option>
          <option value="Thailand">Thailand</option>
          <option value="Taiwan (holders of passports containing a personal identification number)">Taiwan (holders of passports containing a personal identification number)</option>
          <option value="Trinidad and Tobago">Trinidad and Tobago</option>
          <option value="United Arab Emirates">United Arab Emirates</option>
          <option value="United Kingdom">United Kingdom</option>
          <option value="Uruguay">Uruguay</option>
          <option value="Vatican (holders of a passport or travel document issued by the Vatican)">Vatican (holders of a passport or travel document issued by the Vatican)</option>
          <option value="OTHER">OTHER</option>
        </select>
        <span className="text-xs text-gray-500">On your passport, look for a field named &quot;Code&quot;, Issuing country&quot;, &quot;Authority&quot; or &quot;Country code&quot;.</span>
        {formState.errors.nationality && <p className="text-red-600 text-sm">{formState.errors.nationality.message}</p>}
        </div>
      {showTaiwanID && (
        <div className="mb-6">
          <label className="block mb-1 font-medium">Taiwan National Identification Number <span className="text-red-600">*</span></label>
          <input type="text" {...register('taiwan_id')} className="w-full border rounded p-2" />
          {formState.errors.taiwan_id && <p className="text-red-600 text-sm">{formState.errors.taiwan_id.message}</p>}
        </div>
      )}
      {showUSVisaFields && (
        <>
          <div className="mb-2 text-sm text-gray-700">Enter your US visa number. The number is made up of just one letter and seven numbers. Found in the bottom right corner of the visa as in the example below.</div>
          <div className="mb-6">
            <label className="block mb-1 font-medium">US VISA NUMBER <span className="text-red-600">*</span></label>
            <input type="text" {...register('us_visa_number')} className="w-full border rounded p-2" />
            {formState.errors.us_visa_number && <p className="text-red-600 text-sm">{formState.errors.us_visa_number.message}</p>}
          </div>
          <div className="mb-6">
            <label className="block mb-1 font-medium">US VISA NUMBER (RE-ENTER) <span className="text-red-600">*</span></label>
            <input type="text" {...register('us_visa_number_confirm')} className="w-full border rounded p-2" />
            {formState.errors.us_visa_number_confirm && <p className="text-red-600 text-sm">{formState.errors.us_visa_number_confirm.message}</p>}
          </div>
          <div className="mb-6">
            <label className="block mb-1 font-medium">DATE OF EXPIRY <span className="text-red-600">*</span></label>
            <div className="flex gap-2">
              <select {...register('us_visa_expiry_month')} className="w-32 border rounded p-2">
                <option value="">Month</option>
                {months.map((month, index) => <option key={month} value={monthNumbers[index]}>{month}</option>)}
              </select>
              <select {...register('us_visa_expiry_day')} className="w-16 border rounded p-2">
                <option value="">DD</option>
                {days.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <select {...register('us_visa_expiry_year')} className="w-24 border rounded p-2">
                <option value="">YYYY</option>
                {getYearOptions(currentYear, currentYear + 20).map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            {(formState.errors.us_visa_expiry_month || formState.errors.us_visa_expiry_day || formState.errors.us_visa_expiry_year) && <p className="text-red-600 text-sm">Please provide a full expiry date.</p>}
          </div>
          <div className="mb-6 flex justify-center">
            {showMexicoVisaImage && (
              <Image src="https://www.jotform.com/uploads/deyvidzancocontato/form_files/passaporte-mexico.66997689e89017.31889204.png" alt="US Visa Example - Mexico" width={320} height={200} className="max-w-xs rounded shadow" />
            )}
            {showArgentinaVisaImage && (
              <Image src="https://www.jotform.com/uploads/deyvidzancocontato/form_files/argentina.66996712cc7e16.63038575.jpg" alt="US Visa Example - Other" width={320} height={200} className="max-w-xs rounded shadow" />
            )}
          </div>
        </>
      )}
      <div className="mb-6">
        <label className="block mb-1 font-medium">PASSPORT NUMBER <span className="text-red-600">*</span></label>
        <input type="text" {...register('passport_number')} className="w-full border rounded p-2" />
        <span className="text-xs text-gray-500">Enter the passport number exactly as it appears on the passport information page.</span>
        {formState.errors.passport_number && <p className="text-red-600 text-sm">{formState.errors.passport_number.message}</p>}
        </div>
      <div className="mb-6">
        <label className="block mb-1 font-medium">PASSPORT NUMBER (RE-ENTER) <span className="text-red-600">*</span></label>
        <input type="text" {...register('passport_number_confirm')} className="w-full border rounded p-2" />
        {formState.errors.passport_number_confirm && <p className="text-red-600 text-sm">{formState.errors.passport_number_confirm.message}</p>}
          </div>
      <div className="mb-6">
        <label className="block mb-1 font-medium">SURNAME(S) / LAST NAME(S) <span className="text-red-600">*</span></label>
        <input type="text" {...register('surname')} className="w-full border rounded p-2" />
        <span className="text-xs text-gray-500">Please enter exactly as shown on your passport or identity document.</span>
        {formState.errors.surname && <p className="text-red-600 text-sm">{formState.errors.surname.message}</p>}
          </div>
      <div className="mb-6">
        <label className="block mb-1 font-medium">GIVEN NAME(S) / FIRST NAME(S) <span className="text-red-600">*</span></label>
        <input type="text" {...register('given_name')} className="w-full border rounded p-2" />
        <span className="text-xs text-gray-500">Please enter exactly as shown on your passport or identity document.</span>
        {formState.errors.given_name && <p className="text-red-600 text-sm">{formState.errors.given_name.message}</p>}
        </div>
      <div className="mb-6">
        <label className="block mb-1 font-medium">DATE OF BIRTH <span className="text-red-600">*</span></label>
        <div className="flex gap-2">
          <select {...register('dob_month')} className="w-32 border rounded p-2">
            <option value="">Month</option>
            {months.map((month, index) => <option key={month} value={monthNumbers[index]}>{month}</option>)}
          </select>
          <select {...register('dob_day')} className="w-16 border rounded p-2">
            <option value="">DD</option>
            {days.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select {...register('dob_year')} className="w-24 border rounded p-2">
            <option value="">YYYY</option>
            {getYearOptions(1900, currentYear).map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        {(formState.errors.dob_month || formState.errors.dob_day || formState.errors.dob_year) && <p className="text-red-600 text-sm">Please provide a full date of birth.</p>}
        </div>
      <div className="mb-6">
        <label className="block mb-1 font-medium">GENDER <span className="text-red-600">*</span></label>
        <select {...register('gender')} className="w-full border rounded p-2">
          <option value="">Please select</option>
          <option value="Female">Female</option>
          <option value="Male">Male</option>
          <option value="Other">Other</option>
        </select>
        {formState.errors.gender && <p className="text-red-600 text-sm">{formState.errors.gender.message}</p>}
      </div>
      <div className="mb-6">
        <label className="block mb-1 font-medium">COUNTRY/TERRITORY OF BIRTH <span className="text-red-600">*</span></label>
        <select {...register('birth_country')} className="w-full border rounded p-2">
          <option value="">Please select</option>
          <option value="Afghanistan">Afghanistan</option>
          <option value="Albania">Albania</option>
          <option value="Algeria">Algeria</option>
          <option value="American Samoa">American Samoa</option>
          <option value="Andorra">Andorra</option>
          <option value="Angola">Angola</option>
          <option value="Anguilla">Anguilla</option>
          <option value="Antigua and Barbuda">Antigua and Barbuda</option>
          <option value="Argentina">Argentina</option>
          <option value="Armenia">Armenia</option>
          <option value="Aruba">Aruba</option>
          <option value="Australia">Australia</option>
          <option value="Austria">Austria</option>
          <option value="Azerbaijan">Azerbaijan</option>
          <option value="The Bahamas">The Bahamas</option>
          <option value="Bahrain">Bahrain</option>
          <option value="Bangladesh">Bangladesh</option>
          <option value="Barbados">Barbados</option>
          <option value="Belarus">Belarus</option>
          <option value="Belgium">Belgium</option>
          <option value="Belize">Belize</option>
          <option value="Benin">Benin</option>
          <option value="Bermuda">Bermuda</option>
          <option value="Bhutan">Bhutan</option>
          <option value="Bolivia">Bolivia</option>
          <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
          <option value="Botswana">Botswana</option>
          <option value="Brazil">Brazil</option>
          <option value="Brunei">Brunei</option>
          <option value="Bulgaria">Bulgaria</option>
          <option value="Burkina Faso">Burkina Faso</option>
          <option value="Burundi">Burundi</option>
          <option value="Cambodia">Cambodia</option>
          <option value="Cameroon">Cameroon</option>
          <option value="Canada">Canada</option>
          <option value="Cape Verde">Cape Verde</option>
          <option value="Cayman Islands">Cayman Islands</option>
          <option value="Central African Republic">Central African Republic</option>
          <option value="Chad">Chad</option>
          <option value="Chile">Chile</option>
          <option value="China">China</option>
          <option value="Christmas Island">Christmas Island</option>
          <option value="Cocos (Keeling) Islands">Cocos (Keeling) Islands</option>
          <option value="Colombia">Colombia</option>
          <option value="Comoros">Comoros</option>
          <option value="Congo">Congo</option>
          <option value="Cook Islands">Cook Islands</option>
          <option value="Costa Rica">Costa Rica</option>
          <option value="Cote d'Ivoire">Cote d&apos;Ivoire</option>
          <option value="Croatia">Croatia</option>
          <option value="Cuba">Cuba</option>
          <option value="Cyprus">Cyprus</option>
          <option value="Czech Republic">Czech Republic</option>
          <option value="Democratic Republic of the Congo">Democratic Republic of the Congo</option>
          <option value="Denmark">Denmark</option>
          <option value="Djibouti">Djibouti</option>
          <option value="Dominica">Dominica</option>
          <option value="Dominican Republic">Dominican Republic</option>
          <option value="Ecuador">Ecuador</option>
          <option value="Egypt">Egypt</option>
          <option value="El Salvador">El Salvador</option>
        </select>
        {formState.errors.birth_country && <p className="text-red-600 text-sm">{formState.errors.birth_country.message}</p>}
          </div>
      <div className="mb-6">
        <label className="block mb-1 font-medium">CITY/TOWN OF BIRTH <span className="text-red-600">*</span></label>
        <input type="text" {...register('birth_city')} className="w-full border rounded p-2" />
        <span className="text-xs text-gray-500">If there is no city/town/village on your passport, enter the name of the city/town/village where you were born.</span>
        {formState.errors.birth_city && <p className="text-red-600 text-sm">{formState.errors.birth_city.message}</p>}
          </div>
      <div className="mb-6">
        <label className="block mb-1 font-medium">DATE OF ISSUE OF PASSPORT <span className="text-red-600">*</span></label>
        <div className="flex gap-2">
          <select {...register('passport_issue_month')} className="w-32 border rounded p-2">
            <option value="">Month</option>
            {months.map((month, index) => <option key={month} value={monthNumbers[index]}>{month}</option>)}
          </select>
          <select {...register('passport_issue_day')} className="w-16 border rounded p-2">
            <option value="">DD</option>
            {days.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select {...register('passport_issue_year')} className="w-24 border rounded p-2">
            <option value="">YYYY</option>
            {getYearOptions(currentYear - 20, currentYear).map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        {(formState.errors.passport_issue_month || formState.errors.passport_issue_day || formState.errors.passport_issue_year) && <p className="text-red-600 text-sm">Please provide a full issue date.</p>}
          </div>
      <div className="mb-6">
        <label className="block mb-1 font-medium">DATE OF EXPIRY OF PASSPORT <span className="text-red-600">*</span></label>
        <div className="flex gap-2">
          <select {...register('passport_expiry_month')} className="w-32 border rounded p-2">
            <option value="">Month</option>
            {months.map((month, index) => <option key={month} value={monthNumbers[index]}>{month}</option>)}
          </select>
          <select {...register('passport_expiry_day')} className="w-16 border rounded p-2">
            <option value="">DD</option>
            {days.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select {...register('passport_expiry_year')} className="w-24 border rounded p-2">
            <option value="">YYYY</option>
            {getYearOptions(currentYear, currentYear + 20).map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        {(formState.errors.passport_expiry_month || formState.errors.passport_expiry_day || formState.errors.passport_expiry_year) && <p className="text-red-600 text-sm">Please provide a full expiry date.</p>}
      </div>
    </div>,
    // Step 1: All other fields
    <div key="all-other-fields" className="mb-8">
      <h2 className="text-xl font-bold mb-4">Additional Information</h2>
      <div className="mb-6">
        <label className="block mb-1 font-medium">ARE YOU A CITIZEN OF ANY ADDITIONAL NATIONALITIES? <span className="text-red-600">*</span></label>
          <div className="flex gap-6">
            <label className="inline-flex items-center gap-2">
            <input type="radio" value="No" {...register('additional_nationality')} /> No
            </label>
            <label className="inline-flex items-center gap-2">
            <input type="radio" value="Yes" {...register('additional_nationality')} /> Yes
            </label>
          </div>
        {formState.errors.additional_nationality && <p className="text-red-600 text-sm">{formState.errors.additional_nationality.message}</p>}
      </div>
      {watch('additional_nationality') === 'Yes' && (
        <div className="mb-6">
          <label className="block mb-1 font-medium">INDICATE WHICH COUNTRIES/TERRITORIES YOU ARE CITIZEN OF: <span className="text-red-600">*</span></label>
          <input type="text" {...register('additional_nationality_details')} className="w-full border rounded p-2" />
          {formState.errors.additional_nationality_details && <p className="text-red-600 text-sm">{formState.errors.additional_nationality_details.message}</p>}
        </div>
      )}
      <div className="mb-6">
        <label className="block mb-1 font-medium">Marital status <span className="text-red-600">*</span></label>
        <select {...register('marital_status')} className="w-full border rounded p-2">
          <option value="">Please select</option>
          <option value="Married">Married</option>
          <option value="Legally Separated">Legally Separated</option>
          <option value="Divorced">Divorced</option>
          <option value="Annulled Marriage">Annulled Marriage</option>
          <option value="Widowed">Widowed</option>
          <option value="Common-Law">Common-Law</option>
          <option value="Never Married/Single">Never Married/Single</option>
          </select>
        {formState.errors.marital_status && <p className="text-red-600 text-sm">{formState.errors.marital_status.message}</p>}
        </div>
      <div className="mb-6">
        <label className="block mb-1 font-medium">HAVE YOU EVER APPLIED FOR OR OBTAINED A VISA, AN ETA OR A PERMIT TO VISIT, LIVE, WORK OR STUDY IN CANADA? <span className="text-red-600">*</span></label>
          <div className="flex gap-6">
            <label className="inline-flex items-center gap-2">
            <input type="radio" value="No" {...register('canada_visa_applied')} /> No
            </label>
            <label className="inline-flex items-center gap-2">
            <input type="radio" value="Yes" {...register('canada_visa_applied')} /> Yes
            </label>
        </div>
        {formState.errors.canada_visa_applied && <p className="text-red-600 text-sm">{formState.errors.canada_visa_applied.message}</p>}
        {canadaVisaApplied === 'Yes' && (
          <div className="mt-4">
            <label className="block mb-1 font-medium">Please enter your previous Canadian visa/permit/ETA number <span className="text-red-600">*</span></label>
            <input type="text" {...register('previous_visa_number')} className="w-full border rounded p-2" />
            {formState.errors.previous_visa_number && <p className="text-red-600 text-sm">{formState.errors.previous_visa_number.message}</p>}
          </div>
        )}
        </div>
      <div className="mb-6">
        <label className="block mb-1 font-medium">Occupation <span className="text-red-600">*</span></label>
        <select {...register('occupation')} className="w-full border rounded p-2">
          <option value="">Please select</option>
          <option value="Art, culture, recreation and sport occupations">Art, culture, recreation and sport occupations</option>
          <option value="Business, finance and administration occupations">Business, finance and administration occupations</option>
          <option value="Education, law and social, community and government services occupations">Education, law and social, community and government services occupations</option>
          <option value="Health occupations">Health occupations</option>
          <option value="Homemaker">Homemaker</option>
          <option value="Management occupations">Management occupations</option>
          <option value="Manufacturing and utilities occupations">Manufacturing and utilities occupations</option>
          <option value="Military/armed forces">Military/armed forces</option>
          <option value="Natural and applied sciences and related occupations">Natural and applied sciences and related occupations</option>
          <option value="Natural resources, agriculture and related production occupations">Natural resources, agriculture and related production occupations</option>
          <option value="Retired">Retired</option>
          <option value="Sales and service occupations">Sales and service occupations</option>
          <option value="Student">Student</option>
          <option value="Trades, transport and equipment operators and related occupations">Trades, transport and equipment operators and related occupations</option>
          <option value="Unemployed">Unemployed</option>
          </select>
        {formState.errors.occupation && <p className="text-red-600 text-sm">{formState.errors.occupation.message}</p>}
        </div>
      {!hideJobFields && (
        <>
          <div className="mb-6">
            <label className="block mb-1 font-medium">Describe a bit more about your job <span className="text-red-600">*</span></label>
            <input type="text" {...register('job_description')} className="w-full border rounded p-2" />
            {formState.errors.job_description && <p className="text-red-600 text-sm">{formState.errors.job_description.message}</p>}
          </div>
          <div className="mb-6">
            <label className="block mb-1 font-medium">Name of employer or school, as appropriate <span className="text-red-600">*</span></label>
            <input type="text" {...register('employer_name')} className="w-full border rounded p-2" />
            {formState.errors.employer_name && <p className="text-red-600 text-sm">{formState.errors.employer_name.message}</p>}
          </div>
          <div className="mb-6">
            <label className="block mb-1 font-medium">Since when do you work at this location? (MM/YYYY) <span className="text-red-600">*</span></label>
            <input type="text" {...register('employment_start_date')} className="w-full border rounded p-2" placeholder="MM/YYYY" />
            {formState.errors.employment_start_date && <p className="text-red-600 text-sm">{formState.errors.employment_start_date.message}</p>}
          </div>
          <div className="mb-6">
            <label className="block mb-1 font-medium">Country of Employment <span className="text-red-600">*</span></label>
            <select {...register('employment_country')} className="w-full border rounded p-2">
              <option value="">Please select</option>
              <option value="Afghanistan">Afghanistan</option>
              <option value="Albania">Albania</option>
              <option value="Algeria">Algeria</option>
              <option value="Andorra">Andorra</option>
              <option value="Angola">Angola</option>
              <option value="Antigua and Barbuda">Antigua and Barbuda</option>
              <option value="Argentina">Argentina</option>
              <option value="Armenia">Armenia</option>
              <option value="Australia">Australia</option>
              <option value="Austria">Austria</option>
              <option value="Azerbaijan">Azerbaijan</option>
              <option value="Bahamas">Bahamas</option>
              <option value="Bahrain">Bahrain</option>
              <option value="Bangladesh">Bangladesh</option>
              <option value="Barbados">Barbados</option>
              <option value="Belarus">Belarus</option>
              <option value="Belgium">Belgium</option>
              <option value="Belize">Belize</option>
              <option value="Benin">Benin</option>
              <option value="Bhutan">Bhutan</option>
              <option value="Bolivia">Bolivia</option>
              <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
              <option value="Botswana">Botswana</option>
              <option value="Brazil">Brazil</option>
              <option value="Brunei">Brunei</option>
              <option value="Bulgaria">Bulgaria</option>
              <option value="Burkina Faso">Burkina Faso</option>
              <option value="Burundi">Burundi</option>
              <option value="Cambodia">Cambodia</option>
              <option value="Cameroon">Cameroon</option>
              <option value="Canada">Canada</option>
              <option value="Cape Verde">Cape Verde</option>
              <option value="Central African Republic">Central African Republic</option>
              <option value="Chad">Chad</option>
              <option value="Chile">Chile</option>
              <option value="China">China</option>
              <option value="Colombia">Colombia</option>
              <option value="Comoros">Comoros</option>
              <option value="Congo">Congo</option>
              <option value="Costa Rica">Costa Rica</option>
              <option value="Croatia">Croatia</option>
              <option value="Cuba">Cuba</option>
              <option value="Cyprus">Cyprus</option>
              <option value="Czech Republic">Czech Republic</option>
              <option value="Democratic Republic of the Congo">Democratic Republic of the Congo</option>
              <option value="Denmark">Denmark</option>
              <option value="Djibouti">Djibouti</option>
              <option value="Dominica">Dominica</option>
              <option value="Dominican Republic">Dominican Republic</option>
              <option value="East Timor">East Timor</option>
              <option value="Ecuador">Ecuador</option>
              <option value="Egypt">Egypt</option>
              <option value="El Salvador">El Salvador</option>
              <option value="Equatorial Guinea">Equatorial Guinea</option>
              <option value="Eritrea">Eritrea</option>
              <option value="Estonia">Estonia</option>
              <option value="Ethiopia">Ethiopia</option>
              <option value="Fiji">Fiji</option>
              <option value="Finland">Finland</option>
              <option value="France">France</option>
              <option value="Gabon">Gabon</option>
              <option value="Gambia">Gambia</option>
              <option value="Georgia">Georgia</option>
              <option value="Germany">Germany</option>
              <option value="Ghana">Ghana</option>
              <option value="Greece">Greece</option>
              <option value="Grenada">Grenada</option>
              <option value="Guatemala">Guatemala</option>
              <option value="Guinea">Guinea</option>
              <option value="Guinea-Bissau">Guinea-Bissau</option>
              <option value="Guyana">Guyana</option>
              <option value="Haiti">Haiti</option>
              <option value="Honduras">Honduras</option>
              <option value="Hungary">Hungary</option>
              <option value="Iceland">Iceland</option>
              <option value="India">India</option>
              <option value="Indonesia">Indonesia</option>
              <option value="Iran">Iran</option>
              <option value="Iraq">Iraq</option>
              <option value="Ireland">Ireland</option>
              <option value="Israel">Israel</option>
              <option value="Italy">Italy</option>
              <option value="Ivory Coast">Ivory Coast</option>
              <option value="Jamaica">Jamaica</option>
              <option value="Japan">Japan</option>
              <option value="Jordan">Jordan</option>
              <option value="Kazakhstan">Kazakhstan</option>
              <option value="Kenya">Kenya</option>
              <option value="Kiribati">Kiribati</option>
              <option value="Kuwait">Kuwait</option>
              <option value="Kyrgyzstan">Kyrgyzstan</option>
              <option value="Laos">Laos</option>
              <option value="Latvia">Latvia</option>
              <option value="Lebanon">Lebanon</option>
              <option value="Lesotho">Lesotho</option>
              <option value="Liberia">Liberia</option>
              <option value="Libya">Libya</option>
              <option value="Liechtenstein">Liechtenstein</option>
              <option value="Lithuania">Lithuania</option>
              <option value="Luxembourg">Luxembourg</option>
              <option value="Macedonia">Macedonia</option>
              <option value="Madagascar">Madagascar</option>
              <option value="Malawi">Malawi</option>
              <option value="Malaysia">Malaysia</option>
              <option value="Maldives">Maldives</option>
              <option value="Mali">Mali</option>
              <option value="Malta">Malta</option>
              <option value="Marshall Islands">Marshall Islands</option>
              <option value="Mauritania">Mauritania</option>
              <option value="Mauritius">Mauritius</option>
              <option value="Mexico">Mexico</option>
              <option value="Micronesia">Micronesia</option>
              <option value="Moldova">Moldova</option>
              <option value="Monaco">Monaco</option>
              <option value="Mongolia">Mongolia</option>
              <option value="Montenegro">Montenegro</option>
              <option value="Morocco">Morocco</option>
              <option value="Mozambique">Mozambique</option>
              <option value="Myanmar">Myanmar</option>
              <option value="Namibia">Namibia</option>
              <option value="Nauru">Nauru</option>
              <option value="Nepal">Nepal</option>
              <option value="Netherlands">Netherlands</option>
              <option value="New Zealand">New Zealand</option>
              <option value="Nicaragua">Nicaragua</option>
              <option value="Niger">Niger</option>
              <option value="Nigeria">Nigeria</option>
              <option value="North Korea">North Korea</option>
              <option value="Norway">Norway</option>
              <option value="Oman">Oman</option>
              <option value="Pakistan">Pakistan</option>
              <option value="Palau">Palau</option>
              <option value="Panama">Panama</option>
              <option value="Papua New Guinea">Papua New Guinea</option>
              <option value="Paraguay">Paraguay</option>
              <option value="Peru">Peru</option>
              <option value="Philippines">Philippines</option>
              <option value="Poland">Poland</option>
              <option value="Portugal">Portugal</option>
              <option value="Qatar">Qatar</option>
              <option value="Romania">Romania</option>
              <option value="Russia">Russia</option>
              <option value="Rwanda">Rwanda</option>
              <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
              <option value="Saint Lucia">Saint Lucia</option>
              <option value="Saint Vincent and the Grenadines">Saint Vincent and the Grenadines</option>
              <option value="Samoa">Samoa</option>
              <option value="San Marino">San Marino</option>
              <option value="Sao Tome and Principe">Sao Tome and Principe</option>
              <option value="Saudi Arabia">Saudi Arabia</option>
              <option value="Senegal">Senegal</option>
              <option value="Serbia">Serbia</option>
              <option value="Seychelles">Seychelles</option>
              <option value="Sierra Leone">Sierra Leone</option>
              <option value="Singapore">Singapore</option>
              <option value="Slovakia">Slovakia</option>
              <option value="Slovenia">Slovenia</option>
              <option value="Solomon Islands">Solomon Islands</option>
              <option value="Somalia">Somalia</option>
              <option value="South Africa">South Africa</option>
              <option value="South Korea">South Korea</option>
              <option value="South Sudan">South Sudan</option>
              <option value="Spain">Spain</option>
              <option value="Sri Lanka">Sri Lanka</option>
              <option value="Sudan">Sudan</option>
              <option value="Suriname">Suriname</option>
              <option value="Swaziland">Swaziland</option>
              <option value="Sweden">Sweden</option>
              <option value="Switzerland">Switzerland</option>
              <option value="Syria">Syria</option>
              <option value="Taiwan">Taiwan</option>
              <option value="Tajikistan">Tajikistan</option>
              <option value="Tanzania">Tanzania</option>
              <option value="Thailand">Thailand</option>
              <option value="Togo">Togo</option>
              <option value="Tonga">Tonga</option>
              <option value="Trinidad and Tobago">Trinidad and Tobago</option>
              <option value="Tunisia">Tunisia</option>
              <option value="Turkey">Turkey</option>
              <option value="Turkmenistan">Turkmenistan</option>
              <option value="Tuvalu">Tuvalu</option>
              <option value="Uganda">Uganda</option>
              <option value="Ukraine">Ukraine</option>
              <option value="United Arab Emirates">United Arab Emirates</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="United States">United States</option>
              <option value="Uruguay">Uruguay</option>
              <option value="Uzbekistan">Uzbekistan</option>
              <option value="Vanuatu">Vanuatu</option>
              <option value="Vatican City">Vatican City</option>
              <option value="Venezuela">Venezuela</option>
              <option value="Vietnam">Vietnam</option>
              <option value="Yemen">Yemen</option>
              <option value="Zambia">Zambia</option>
              <option value="Zimbabwe">Zimbabwe</option>
            </select>
            {formState.errors.employment_country && <p className="text-red-600 text-sm">{formState.errors.employment_country.message}</p>}
          </div>
        </>
      )}
      <div className="mb-6">
        <label className="block mb-1 font-medium">APARTMENT NUMBER</label>
        <input type="text" {...register('apartment_number')} className="w-full border rounded p-2" />
      </div>
      <div className="mb-6">
        <label className="block mb-1 font-medium">STREET NUMBER <span className="text-red-600">*</span></label>
        <input type="text" {...register('street_number')} className="w-full border rounded p-2" />
        {formState.errors.street_number && <p className="text-red-600 text-sm">{formState.errors.street_number.message}</p>}
          </div>
      <div className="mb-6">
        <label className="block mb-1 font-medium">STREET NAME <span className="text-red-600">*</span></label>
        <input type="text" {...register('street_name')} className="w-full border rounded p-2" />
        {formState.errors.street_name && <p className="text-red-600 text-sm">{formState.errors.street_name.message}</p>}
          </div>
      <div className="mb-6">
        <label className="block mb-1 font-medium">CITY/TOWN <span className="text-red-600">*</span></label>
        <input type="text" {...register('city_town')} className="w-full border rounded p-2" />
        {formState.errors.city_town && <p className="text-red-600 text-sm">{formState.errors.city_town.message}</p>}
          </div>
      <div className="mb-6">
        <label className="block mb-1 font-medium">DISTRICT/REGION</label>
        <input type="text" {...register('district_region')} className="w-full border rounded p-2" />
        </div>
      <div className="mb-6">
        <label className="block mb-1 font-medium">ZIP CODE <span className="text-red-600">*</span></label>
        <input type="text" {...register('zip_code')} className="w-full border rounded p-2" />
        {formState.errors.zip_code && <p className="text-red-600 text-sm">{formState.errors.zip_code.message}</p>}
      </div>
      <div className="mb-6">
        <label className="block mb-1 font-medium">COUNTRY/TERRITORY <span className="text-red-600">*</span></label>
        <select {...register('address_country')} className="w-full border rounded p-2">
        <option value="">Please select</option>
          <option value="Andorra">Andorra</option>
          <option value="Antigua and Barbuda">Antigua and Barbuda</option>
          <option value="Argentina">Argentina</option>
          <option value="Australia">Australia</option>
          <option value="Austria">Austria</option>
          <option value="Bahamas">Bahamas</option>
          <option value="Barbados">Barbados</option>
          <option value="Belgium">Belgium</option>
          <option value="Brazil">Brazil</option>
          <option value="Bulgaria">Bulgaria</option>
          <option value="Brunei Darussalam">Brunei Darussalam</option>
          <option value="Chile">Chile</option>
          <option value="China (Hong Kong SAR)">China (Hong Kong SAR)</option>
          <option value="Croatia">Croatia</option>
          <option value="Costa Rica">Costa Rica</option>
          <option value="Cyprus">Cyprus</option>
          <option value="Czech Republic">Czech Republic</option>
          <option value="Denmark">Denmark</option>
          <option value="Estonia">Estonia</option>
          <option value="Finland">Finland</option>
          <option value="France">France</option>
          <option value="Germany">Germany</option>
          <option value="Greece">Greece</option>
          <option value="Hungary">Hungary</option>
          <option value="Iceland">Iceland</option>
          <option value="Ireland">Ireland</option>
          <option value="Israel (holders of Israeli national passports)">Israel (holders of Israeli national passports)</option>
          <option value="Italy">Italy</option>
          <option value="Japan">Japan</option>
          <option value="Latvia">Latvia</option>
          <option value="Liechtenstein">Liechtenstein</option>
          <option value="Lithuania">Lithuania</option>
          <option value="Luxembourg">Luxembourg</option>
          <option value="Malta">Malta</option>
          <option value="Mexico">Mexico</option>
          <option value="Monaco">Monaco</option>
          <option value="Morocco">Morocco</option>
          <option value="Norway">Norway</option>
          <option value="New Zealand">New Zealand</option>
          <option value="Netherlands">Netherlands</option>
          <option value="Panama">Panama</option>
          <option value="Papua New Guinea">Papua New Guinea</option>
          <option value="Philippines">Philippines</option>
          <option value="Poland">Poland</option>
          <option value="Portugal">Portugal</option>
          <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
          <option value="Saint Lucia">Saint Lucia</option>
          <option value="Saint Vincent and the Grenadines">Saint Vincent and the Grenadines</option>
          <option value="Samoa">Samoa</option>
          <option value="San Marino">San Marino</option>
          <option value="Seychelles">Seychelles</option>
          <option value="Singapore">Singapore</option>
          <option value="Slovakia">Slovakia</option>
          <option value="Slovenia">Slovenia</option>
          <option value="Solomon Islands">Solomon Islands</option>
          <option value="South Korea">South Korea</option>
          <option value="Spain">Spain</option>
          <option value="Sweden">Sweden</option>
          <option value="Switzerland">Switzerland</option>
          <option value="Thailand">Thailand</option>
          <option value="Taiwan (holders of passports containing a personal identification number)">Taiwan (holders of passports containing a personal identification number)</option>
          <option value="Trinidad and Tobago">Trinidad and Tobago</option>
          <option value="United Arab Emirates">United Arab Emirates</option>
          <option value="United Kingdom">United Kingdom</option>
          <option value="Uruguay">Uruguay</option>
          <option value="Vatican (holders of a passport or travel document issued by the Vatican)">Vatican (holders of a passport or travel document issued by the Vatican)</option>
          <option value="OTHER">OTHER</option>
        </select>
        {formState.errors.address_country && <p className="text-red-600 text-sm">{formState.errors.address_country.message}</p>}
      </div>
      <div className="mb-6">
        <label className="block mb-1 font-medium">Email address <span className="text-red-600">*</span></label>
        <input type="email" {...register('email')} className="w-full border rounded p-2" />
        {formState.errors.email && <p className="text-red-600 text-sm">{formState.errors.email.message}</p>}
      </div>
      <div className="mb-6">
        <label className="block mb-1 font-medium">Confirm email address <span className="text-red-600">*</span></label>
        <input type="email" {...register('email_confirm')} className="w-full border rounded p-2" />
        {formState.errors.email_confirm && <p className="text-red-600 text-sm">{formState.errors.email_confirm.message}</p>}
          </div>
      <div className="mb-6">
        <label className="block mb-1 font-medium">Phone number <span className="text-red-600">*</span></label>
        <input type="text" {...register('phone')} className="w-full border rounded p-2" />
        {formState.errors.phone && <p className="text-red-600 text-sm">{formState.errors.phone.message}</p>}
          </div>
      <div className="mb-6">
        <label className="block mb-1 font-medium">Alternative phone number</label>
        <input type="text" {...register('alt_phone')} className="w-full border rounded p-2" />
        </div>
      <div className="mb-6">
        <label className="block mb-1 font-medium">Preferred language of correspondence <span className="text-red-600">*</span></label>
        <select {...register('preferred_language')} className="w-full border rounded p-2">
          <option value="">Please select</option>
          <option value="English">English</option>
          <option value="French">French</option>
        </select>
        {formState.errors.preferred_language && <p className="text-red-600 text-sm">{formState.errors.preferred_language.message}</p>}
          </div>
      <div className="mb-6">
        <label className="block mb-1 font-medium">DO YOU KNOW WHEN YOU WILL TRAVEL TO CANADA? <span className="text-red-600">*</span></label>
            <div className="flex gap-6">
              <label className="inline-flex items-center gap-2">
            <input type="radio" value="No" {...register('do_you_know_travel_date')} /> No
              </label>
              <label className="inline-flex items-center gap-2">
            <input type="radio" value="Yes" {...register('do_you_know_travel_date')} /> Yes
              </label>
            </div>
        {formState.errors.do_you_know_travel_date && <p className="text-red-600 text-sm">{formState.errors.do_you_know_travel_date.message}</p>}
      </div>
      {watch('do_you_know_travel_date') === 'Yes' && (
        <div className="mb-6">
          <label className="block mb-1 font-medium">WHEN DO YOU PLAN TO TRAVEL TO CANADA? <span className="text-red-600">*</span></label>
          <div className="flex gap-2">
            <select {...register('travel_date_month')} className="w-32 border rounded p-2">
              <option value="">Month</option>
              {months.map((month, index) => <option key={month} value={monthNumbers[index]}>{month}</option>)}
            </select>
            <select {...register('travel_date_day')} className="w-16 border rounded p-2">
              <option value="">DD</option>
              {days.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <select {...register('travel_date_year')} className="w-24 border rounded p-2">
              <option value="">YYYY</option>
              {getYearOptions(currentYear, currentYear + 2).map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          {(formState.errors.travel_date_month || formState.errors.travel_date_day || formState.errors.travel_date_year) && (
            <p className="text-red-600 text-sm">Please enter a valid date</p>
          )}
        </div>
      )}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Consent And Declaration</h2>
        <div className="mb-4 text-gray-700 text-sm">
          Declaration of Applicant: The information I have provided in this application is truthful, complete and correct. I understand that misrepresentation is an offence under section 127 of the <a href="https://laws-lois.justice.gc.ca/eng/annualstatutes/2001_27/FullText.html" target="_blank" rel="nofollow" className="underline">Immigration and Refugee Protection Act</a> and may result in a finding of inadmissibility to Canada or removal from Canada. I also do agree that by checking the box below and clicking submit, I am electronically signing this application.
        </div>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" {...register('consent_declaration')} className="form-checkbox" />
          <span>I agree</span>
        </label>
        {formState.errors.consent_declaration && <p className="text-red-600 text-sm">{formState.errors.consent_declaration.message}</p>}
      </div>
    </div>,
  ];

  return (
    <FormProvider {...methods}>
      <form ref={formRef} className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8 space-y-8" onSubmit={handleSubmit(onSubmit)}>
        {steps[step]}
        <div className="flex justify-between items-center mt-8">
          <div>
            {step > 0 && (
              <button type="button" className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-6 rounded-md font-semibold" onClick={() => setStep(step - 1)}>
                Back
              </button>
            )}
          </div>
          <div>
            {step < steps.length - 1 ? (
              <button type="button" className="bg-red-600 hover:bg-red-700 text-white py-2 px-12 rounded-md text-lg font-semibold ml-auto" onClick={async () => {
                const valid = await trigger(stepFields[step]);
                if (valid) {
                  setStep(step + 1);
                }
              }}>
                Next
              </button>
            ) : (
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white py-2 px-12 rounded-md text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
              disabled={formState.isSubmitting || hasSubmitted}
            >
              {formState.isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                "Submit Application"
              )}
            </button>
            )}
          </div>
        </div>
        {submitStatus === 'error' && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-medium">❌ Submission Error: {errorMessage}</p>
          </div>
        )}
        {paymentError && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 font-medium">⚠️ Payment Notice: {paymentError}</p>
          </div>
        )}
        {submitStatus === 'success' && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-medium">✅ Application submitted successfully! Redirecting to payment...</p>
          </div>
        )}
      </form>
    </FormProvider>
  );
}

export default function ApplyPage() {
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  return (
    <>
      <Head>
        <title>eTA Application Form | canada-eta.visasyst.com</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      
      {/* Essential reCAPTCHA script for form submission */}
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
        strategy="beforeInteractive"
      />

      <Header />
      <main className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">
          CANADA ETA PERMIT AUTHORIZATION
        </h1>
        <Suspense fallback={<div className="text-center py-12 text-lg">Loading Application Form...</div>}>
          <ApplyFormMultiStep />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}