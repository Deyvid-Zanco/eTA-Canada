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
import { useLanguage } from "../../lib/contexts/LanguageContext";

declare global {
  interface Window {
    grecaptcha: {
      execute(siteKey: string, options: { action: string }): Promise<string>;
    };
  }
}

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
  taiwan_id?: string | null;
  us_visa_number?: string | null;
  us_visa_number_confirm?: string | null;
  us_visa_expiry_month?: string | null;
  us_visa_expiry_day?: string | null;
  us_visa_expiry_year?: string | null;
  passport_number: string;
  passport_number_confirm: string;
  surname: string;
  given_name: string;
  dob_month: string;
  dob_day: string;
  dob_year: string;
  gender: string;
  birth_country: string;
  birth_city: string;
  passport_issue_month: string;
  passport_issue_day: string;
  passport_issue_year: string;
  passport_expiry_month: string;
  passport_expiry_day: string;
  passport_expiry_year: string;
  additional_nationality: string;
  additional_nationality_details?: string | null;
  marital_status: string;
  canada_visa_applied: string;
  previous_visa_number?: string | null;
  previous_visa_number_confirm?: string | null;
  occupation: string;
  job_description?: string | null;
  employer_name?: string | null;
  employment_country?: string | null;
  employer_city?: string | null;
  employment_start_year?: string | null;
  apartment_number?: string | null;
  street_number: string;
  street_name: string;
  city_town: string;
  district_region?: string | null;
  address_country: string;
  zip_code: string;
  email: string;
  phone: string;
  do_you_know_travel_date: string;
  travel_date_month?: string | null;
  travel_date_day?: string | null;
  travel_date_year?: string | null;
  consent_declaration: boolean;
};

const schema: yup.ObjectSchema<FormValues> = yup.object({
  travel_document: yup.string().required('This field is required'),
  nationality: yup.string().required('This field is required'),
  taiwan_id: yup.string().when('nationality', {
    is: 'Taiwan (holders of passports containing a personal identification number)',
    then: schema => schema.required('This field is required'),
    otherwise: schema => schema.notRequired().nullable(),
  }),
  us_visa_number: yup.string().when('nationality', {
    is: (val: string) => usVisaNationalities.includes(val),
    then: schema => schema.required('This field is required'),
    otherwise: schema => schema.notRequired().nullable(),
  }),
  us_visa_number_confirm: yup.string().when('nationality', {
    is: (val: string) => usVisaNationalities.includes(val),
    then: schema => schema.required('This field is required').oneOf([yup.ref('us_visa_number')], 'Visa numbers must match'),
    otherwise: schema => schema.notRequired().nullable(),
  }),
  us_visa_expiry_month: yup.string().when('nationality', {
    is: (val: string) => usVisaNationalities.includes(val),
    then: schema => schema.required('This field is required'),
    otherwise: schema => schema.notRequired().nullable(),
  }),
  us_visa_expiry_day: yup.string().when('nationality', {
    is: (val: string) => usVisaNationalities.includes(val),
    then: schema => schema.required('This field is required'),
    otherwise: schema => schema.notRequired().nullable(),
  }),
  us_visa_expiry_year: yup.string().when('nationality', {
    is: (val: string) => usVisaNationalities.includes(val),
    then: schema => schema.required('This field is required'),
    otherwise: schema => schema.notRequired().nullable(),
  }),
  passport_number: yup.string().required('This field is required'),
  passport_number_confirm: yup.string().required('This field is required').oneOf([yup.ref('passport_number')], 'Passport numbers must match'),
  surname: yup.string().required('This field is required'),
  given_name: yup.string().required('This field is required'),
  dob_month: yup.string().required('This field is required'),
  dob_day: yup.string().required('This field is required'),
  dob_year: yup.string().required('This field is required'),
  gender: yup.string().required('This field is required'),
  birth_country: yup.string().required('This field is required'),
  birth_city: yup.string().required('This field is required'),
  passport_issue_month: yup.string().required('This field is required'),
  passport_issue_day: yup.string().required('This field is required'),
  passport_issue_year: yup.string().required('This field is required'),
  passport_expiry_month: yup.string().required('This field is required'),
  passport_expiry_day: yup.string().required('This field is required'),
  passport_expiry_year: yup.string().required('This field is required'),
  additional_nationality: yup.string().required('This field is required'),
  additional_nationality_details: yup.string().when('additional_nationality', {
    is: 'Yes',
    then: schema => schema.required('This field is required'),
    otherwise: schema => schema.notRequired().nullable(),
  }),
  marital_status: yup.string().required('This field is required'),
  canada_visa_applied: yup.string().required('This field is required'),
  previous_visa_number: yup.string().when('canada_visa_applied', {
    is: 'Yes',
    then: schema => schema.required('This field is required'),
    otherwise: schema => schema.notRequired().nullable(),
  }),
  previous_visa_number_confirm: yup.string().when('canada_visa_applied', {
    is: 'Yes',
    then: schema => schema.required('This field is required').oneOf([yup.ref('previous_visa_number')], 'Numbers must match'),
    otherwise: schema => schema.notRequired().nullable(),
  }),
  occupation: yup.string().required('This field is required'),
  job_description: yup.string().when('occupation', {
    is: (val: string) => !['Unemployed', 'Homemaker', 'Retired'].includes(val),
    then: schema => schema.required('This field is required'),
    otherwise: schema => schema.notRequired().nullable(),
  }),
  employer_name: yup.string().when('occupation', {
    is: (val: string) => !['Unemployed', 'Homemaker', 'Retired'].includes(val),
    then: schema => schema.required('This field is required'),
    otherwise: schema => schema.notRequired().nullable(),
  }),
  employment_country: yup.string().when('occupation', {
    is: (val: string) => !['Unemployed', 'Homemaker', 'Retired'].includes(val),
    then: schema => schema.required('This field is required'),
    otherwise: schema => schema.notRequired().nullable(),
  }),
  employer_city: yup.string().when('occupation', {
    is: (val: string) => !['Unemployed', 'Homemaker', 'Retired'].includes(val),
    then: schema => schema.required('This field is required'),
    otherwise: schema => schema.notRequired().nullable(),
  }),
  employment_start_year: yup.string().when('occupation', {
    is: (val: string) => !['Unemployed', 'Homemaker', 'Retired'].includes(val),
    then: schema => schema.required('This field is required').matches(/^(19|20)\d{2}$/, 'Year must be in YYYY format'),
    otherwise: schema => schema.notRequired().nullable(),
  }),
  apartment_number: yup.string().notRequired().nullable(),
  street_number: yup.string().required('This field is required'),
  street_name: yup.string().required('This field is required'),
  city_town: yup.string().required('This field is required'),
  district_region: yup.string().notRequired().nullable(),
  address_country: yup.string().required('This field is required'),
  zip_code: yup.string().required('This field is required'),
  email: yup.string().email('Invalid email').required('This field is required'),
  phone: yup.string().required('This field is required'),
  do_you_know_travel_date: yup.string().required('This field is required'),
  travel_date_month: yup.string().when('do_you_know_travel_date', {
    is: 'Yes',
    then: schema => schema.required('Month is required'),
    otherwise: schema => schema.notRequired().nullable(),
  }),
  travel_date_day: yup.string().when('do_you_know_travel_date', {
    is: 'Yes',
    then: schema => schema.required('Day is required'),
    otherwise: schema => schema.notRequired().nullable(),
  }),
  travel_date_year: yup.string().when('do_you_know_travel_date', {
    is: 'Yes',
    then: schema => schema.required('Year is required'),
    otherwise: schema => schema.notRequired().nullable(),
  }),
  consent_declaration: yup.boolean().oneOf([true], 'You must agree to the declaration').required('You must agree to the declaration'),
});

function getYearOptions(start: number, end: number) {
  const years = [];
  for (let y = start; y >= end; y--) years.push(y);
  return years;
}

function getFutureYearOptions(start: number, end: number) {
  const years = [];
  for (let y = start; y <= end; y++) years.push(y);
  return years;
}
const currentYear = new Date().getFullYear();
const monthNumbers = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));

function ApplyFormMultiStep() {
  const [step, setStep] = useState(0);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isEligible, setIsEligible] = useState(true);
  const { t } = useLanguage();

  const methods = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: 'onSubmit',
  });

  const { handleSubmit, formState, watch, register, reset, trigger, setValue } = methods;

  const nationality = watch('nationality');
  const occupation = watch('occupation');
  const canadaVisaApplied = watch('canada_visa_applied');
  const additionalNationality = watch('additional_nationality');
  const knowsTravelDate = watch('do_you_know_travel_date');

  const watchedUSVisaNumber = watch("us_visa_number");
  const watchedPassportNumber = watch("passport_number");
  const watchedPreviousVisaNumber = watch("previous_visa_number");

  const showTaiwanID = nationality === 'Taiwan (holders of passports containing a personal identification number)';
  const showUSVisaFields = usVisaNationalities.includes(nationality);
  const showMexicoVisaImage = nationality === 'Mexico';
  const showArgentinaVisaImage = showUSVisaFields && !showMexicoVisaImage;
  const hideJobFields = ['Unemployed', 'Homemaker', 'Retired'].includes(occupation);

  const months = [
    t.common.january, t.common.february, t.common.march, t.common.april,
    t.common.may, t.common.june, t.common.july, t.common.august,
    t.common.september, t.common.october, t.common.november, t.common.december,
  ];

  const handleNationalityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setValue('nationality', value);
    if (value === 'OTHER') {
      setIsEligible(false);
    } else {
      setIsEligible(true);
    }
  };

  const onSubmit = async (data: FormValues) => {
    setSubmitStatus('idle');
    setErrorMessage('');
    try {
      let recaptchaToken = '';
      if (typeof window !== 'undefined' && window.grecaptcha) {
        recaptchaToken = await window.grecaptcha.execute(
          process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!,
          { action: 'submit' }
        );
      } else {
        throw new Error('reCAPTCHA not loaded');
      }

      const response = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, recaptchaToken }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to submit application');
      }

      const checkoutRes = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          name: data.given_name + ' ' + data.surname,
        }),
      });
      if (!checkoutRes.ok) {
        const errorData = await checkoutRes.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to initiate payment');
      }
      const { sessionId } = await checkoutRes.json();
      if (!sessionId) throw new Error('No sessionId returned from payment API');

      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
      if (!stripe) throw new Error('Stripe.js failed to load');
      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) throw new Error(error.message);

      setSubmitStatus('success');
      setHasSubmitted(true);
      reset();
    } catch (err: unknown) {
      setSubmitStatus('error');
      if (err instanceof Error) {
        setErrorMessage(err.message || 'Submission failed. Please try again.');
      } else {
        setErrorMessage('Submission failed. Please try again.');
      }
    }
  };

  const isDirty = formState.isDirty;
  React.useEffect(() => {
    if (isDirty) setHasSubmitted(false);
  }, [isDirty]);

  const formRef = React.useRef<HTMLFormElement>(null);
  const didMountRef = React.useRef(false);

  React.useLayoutEffect(() => {
    if (didMountRef.current) {
      const timeoutId = setTimeout(() => {
        if (formRef.current) {
          formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
      return () => clearTimeout(timeoutId);
    } else {
      didMountRef.current = true;
    }
  }, [step]);

  const handleNext = async () => {
    const fieldsToValidate: (keyof FormValues)[] = [
      'travel_document', 'nationality', 'taiwan_id', 'us_visa_number',
      'us_visa_number_confirm', 'us_visa_expiry_month', 'us_visa_expiry_day',
      'us_visa_expiry_year', 'passport_number', 'passport_number_confirm',
      'surname', 'given_name', 'dob_month', 'dob_day', 'dob_year', 'gender',
      'birth_country', 'birth_city', 'passport_issue_month', 'passport_issue_day',
      'passport_issue_year', 'passport_expiry_month', 'passport_expiry_day',
      'passport_expiry_year'
    ];
    
    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setStep(step + 1);
    }
  };

  const steps = [
    <div key="step-0" className="mb-8">
      <h2 className="text-xl font-bold mb-4">Passport details of applicant</h2>
      <div className="mb-6 relative">
        <label className="block mb-1 font-medium">{t.formFields.travelDocument} <span className="text-red-600">*</span></label>
        <select {...register('travel_document')} className="w-full border rounded p-2 relative z-10" required>
          <option value="">{t.common.pleaseSelect}</option>
          <option value="Passport - ordinary/regular">{t.travelDocuments.passportOrdinary}</option>
          <option value="Passport - diplomatic">{t.travelDocuments.passportDiplomatic}</option>
          <option value="Passport - official">{t.travelDocuments.passportOfficial}</option>
          <option value="Passport - service">{t.travelDocuments.passportService}</option>
          <option value="Emergency/temporary travel document">{t.travelDocuments.emergencyTemporary}</option>
          <option value="Refugee travel document">{t.travelDocuments.refugeeTravel}</option>
          <option value="Alien passport/travel document issued for non-citizens">{t.travelDocuments.alienPassport}</option>
          <option value="Permit to re-enter the United States (I-327)">{t.travelDocuments.permitReenter}</option>
          <option value="U.S. Refugee travel document (I-571)">{t.travelDocuments.usRefugeeTravel}</option>
        </select>
        {formState.errors.travel_document && <p className="text-red-600 text-sm">{formState.errors.travel_document.message}</p>}
      </div>
      <div className="mb-6 relative">
        <label className="block mb-1 font-medium">{t.formFields.nationality} <span className="text-red-600">*</span></label>
        <select {...register('nationality')} onChange={handleNationalityChange} className="w-full border rounded p-2 relative z-10" required>
          <option value="">{t.common.pleaseSelect}</option>
          <option value="Andorra">{t.nationalities.andorra}</option>
          <option value="Antigua and Barbuda">{t.nationalities.antiguaBarbuda}</option>
          <option value="Argentina">{t.nationalities.argentina}</option>
          <option value="Australia">{t.nationalities.australia}</option>
          <option value="Austria">{t.nationalities.austria}</option>
          <option value="Bahamas">{t.nationalities.bahamas}</option>
          <option value="Barbados">{t.nationalities.barbados}</option>
          <option value="Belgium">{t.nationalities.belgium}</option>
          <option value="Brazil">{t.nationalities.brazil}</option>
          <option value="Bulgaria">{t.nationalities.bulgaria}</option>
          <option value="Brunei Darussalam">{t.nationalities.bruneiDarussalam}</option>
          <option value="Chile">{t.nationalities.chile}</option>
          <option value="China (Hong Kong SAR)">{t.nationalities.chinaHongKong}</option>
          <option value="Croatia">{t.nationalities.croatia}</option>
          <option value="Costa Rica">{t.nationalities.costaRica}</option>
          <option value="Cyprus">{t.nationalities.cyprus}</option>
          <option value="Czech Republic">{t.nationalities.czechRepublic}</option>
          <option value="Denmark">{t.nationalities.denmark}</option>
          <option value="Estonia">{t.nationalities.estonia}</option>
          <option value="Finland">{t.nationalities.finland}</option>
          <option value="France">{t.nationalities.france}</option>
          <option value="Germany">{t.nationalities.germany}</option>
          <option value="Greece">{t.nationalities.greece}</option>
          <option value="Hungary">{t.nationalities.hungary}</option>
          <option value="Iceland">{t.nationalities.iceland}</option>
          <option value="Ireland">{t.nationalities.ireland}</option>
          <option value="Israel (holders of Israeli national passports)">{t.nationalities.israel}</option>
          <option value="Italy">{t.nationalities.italy}</option>
          <option value="Japan">{t.nationalities.japan}</option>
          <option value="Latvia">{t.nationalities.latvia}</option>
          <option value="Liechtenstein">{t.nationalities.liechtenstein}</option>
          <option value="Lithuania">{t.nationalities.lithuania}</option>
          <option value="Luxembourg">{t.nationalities.luxembourg}</option>
          <option value="Malta">{t.nationalities.malta}</option>
          <option value="Mexico">{t.nationalities.mexico}</option>
          <option value="Monaco">{t.nationalities.monaco}</option>
          <option value="Morocco">{t.nationalities.morocco}</option>
          <option value="Norway">{t.nationalities.norway}</option>
          <option value="New Zealand">{t.nationalities.newZealand}</option>
          <option value="Netherlands">{t.nationalities.netherlands}</option>
          <option value="Panama">{t.nationalities.panama}</option>
          <option value="Papua New Guinea">{t.nationalities.papuaNewGuinea}</option>
          <option value="Philippines">{t.nationalities.philippines}</option>
          <option value="Poland">{t.nationalities.poland}</option>
          <option value="Portugal">{t.nationalities.portugal}</option>
          <option value="Saint Kitts and Nevis">{t.nationalities.saintKittsNevis}</option>
          <option value="Saint Lucia">{t.nationalities.saintLucia}</option>
          <option value="Saint Vincent and the Grenadines">{t.nationalities.saintVincentGrenadines}</option>
          <option value="Samoa">{t.nationalities.samoa}</option>
          <option value="San Marino">{t.nationalities.sanMarino}</option>
          <option value="Seychelles">{t.nationalities.seychelles}</option>
          <option value="Singapore">{t.nationalities.singapore}</option>
          <option value="Slovakia">{t.nationalities.slovakia}</option>
          <option value="Slovenia">{t.nationalities.slovenia}</option>
          <option value="Solomon Islands">{t.nationalities.solomonIslands}</option>
          <option value="South Korea">{t.nationalities.southKorea}</option>
          <option value="Spain">{t.nationalities.spain}</option>
          <option value="Sweden">{t.nationalities.sweden}</option>
          <option value="Switzerland">{t.nationalities.switzerland}</option>
          <option value="Thailand">{t.nationalities.thailand}</option>
          <option value="Taiwan (holders of passports containing a personal identification number)">{t.nationalities.taiwan}</option>
          <option value="Trinidad and Tobago">{t.nationalities.trinidadTobago}</option>
          <option value="United Arab Emirates">{t.nationalities.uae}</option>
          <option value="United Kingdom">{t.nationalities.uk}</option>
          <option value="Uruguay">{t.nationalities.uruguay}</option>
          <option value="Vatican (holders of a passport or travel document issued by the Vatican)">{t.nationalities.vatican}</option>
          <option value="OTHER">{t.nationalities.other}</option>
        </select>
        <span className="text-xs text-gray-500">On your passport, look for a field named &quot;Code&quot;, Issuing country&quot;, &quot;Authority&quot; or &quot;Country code&quot;.</span>
        {formState.errors.nationality && <p className="text-red-600 text-sm">{formState.errors.nationality.message}</p>}
      </div>
      {!isEligible && (
        <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
          Based on your answers, you cannot apply for an eTA. You may need a visa or other type of travel document to travel to Canada.
        </div>
      )}
      {isEligible && (
        <>
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
                <label className="block mb-1 font-medium">{t.formFields.usVisaNumber} <span className="text-red-600">*</span></label>
                <input type="text" {...register('us_visa_number')} className="w-full border rounded p-2" />
                {formState.errors.us_visa_number && <p className="text-red-600 text-sm">{formState.errors.us_visa_number.message}</p>}
              </div>
              <div className="mb-6">
                <label className="block mb-1 font-medium">{t.formFields.usVisaNumberConfirm} <span className="text-red-600">*</span></label>
                <input type="text" {...register('us_visa_number_confirm', { validate: value => value === watchedUSVisaNumber || "Visa numbers must match" })} className="w-full border rounded p-2" />
                {formState.errors.us_visa_number_confirm && <p className="text-red-600 text-sm">{formState.errors.us_visa_number_confirm.message}</p>}
              </div>
              <div className="mb-6">
                <label className="block mb-1 font-medium">DATE OF EXPIRY <span className="text-red-600">*</span></label>
                <div className="flex gap-2">
                  <select {...register('us_visa_expiry_month')} className="w-32 border rounded p-2">
                    <option value="">{t.common.month}</option>
                    {months.map((month, index) => <option key={month} value={monthNumbers[index]}>{month}</option>)}
                  </select>
                  <select {...register('us_visa_expiry_day')} className="w-16 border rounded p-2">
                    <option value="">{t.common.day}</option>
                    {days.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <select {...register('us_visa_expiry_year')} className="w-24 border rounded p-2">
                    <option value="">{t.common.year}</option>
                    {getFutureYearOptions(currentYear, currentYear + 20).map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                {(formState.errors.us_visa_expiry_month || formState.errors.us_visa_expiry_day || formState.errors.us_visa_expiry_year) && <p className="text-red-600 text-sm">Please select a valid expiry date</p>}
              </div>
              <div className="mb-6 flex justify-center">
                {showMexicoVisaImage && (<Image src="https://www.jotform.com/uploads/deyvidzancocontato/form_files/passaporte-mexico.66997689e89017.31889204.png" alt="US Visa Example - Mexico" width={320} height={200} className="max-w-xs rounded shadow" />)}
                {showArgentinaVisaImage && (<Image src="https://www.jotform.com/uploads/deyvidzancocontato/form_files/argentina.66996712cc7e16.63038575.jpg" alt="US Visa Example - Other" width={320} height={200} className="max-w-xs rounded shadow" />)}
              </div>
            </>
          )}
          <div className="mb-6">
            <label className="block mb-1 font-medium">{t.formFields.passportNumber} <span className="text-red-600">*</span></label>
            <input type="text" {...register('passport_number')} className="w-full border rounded p-2" />
            <span className="text-xs text-gray-500">Enter the passport number exactly as it appears on the passport information page.</span>
            {formState.errors.passport_number && <p className="text-red-600 text-sm">{formState.errors.passport_number.message}</p>}
          </div>
          <div className="mb-6">
            <label className="block mb-1 font-medium">{t.formFields.passportNumberConfirm} <span className="text-red-600">*</span></label>
            <input type="text" {...register('passport_number_confirm', { validate: value => value === watchedPassportNumber || "Passport numbers must match" })} className="w-full border rounded p-2" />
            {formState.errors.passport_number_confirm && <p className="text-red-600 text-sm">{formState.errors.passport_number_confirm.message}</p>}
          </div>
          <div className="mb-6">
            <label className="block mb-1 font-medium">{t.formFields.surname} <span className="text-red-600">*</span></label>
            <input type="text" {...register('surname')} className="w-full border rounded p-2" />
            <span className="text-xs text-gray-500">Please enter exactly as shown on your passport or identity document.</span>
            {formState.errors.surname && <p className="text-red-600 text-sm">{formState.errors.surname.message}</p>}
          </div>
          <div className="mb-6">
            <label className="block mb-1 font-medium">{t.formFields.givenName} <span className="text-red-600">*</span></label>
            <input type="text" {...register('given_name')} className="w-full border rounded p-2" />
            <span className="text-xs text-gray-500">Please enter exactly as shown on your passport or identity document.</span>
            {formState.errors.given_name && <p className="text-red-600 text-sm">{formState.errors.given_name.message}</p>}
          </div>
          <div className="mb-6">
            <label className="block mb-1 font-medium">{t.formFields.dateOfBirth} <span className="text-red-600">*</span></label>
            <div className="flex gap-2">
              <select {...register('dob_month')} className="w-32 border rounded p-2">
                <option value="">{t.common.month}</option>
                {months.map((month, index) => <option key={month} value={monthNumbers[index]}>{month}</option>)}
              </select>
              <select {...register('dob_day')} className="w-16 border rounded p-2">
                <option value="">{t.common.day}</option>
                {days.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <select {...register('dob_year')} className="w-24 border rounded p-2">
                <option value="">{t.common.year}</option>
                {getYearOptions(currentYear, 1900).map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            {(formState.errors.dob_month || formState.errors.dob_day || formState.errors.dob_year) && <p className="text-red-600 text-sm">Please enter a valid date of birth</p>}
          </div>
          <div className="mb-6">
            <label className="block mb-1 font-medium">{t.formFields.gender} <span className="text-red-600">*</span></label>
            <select {...register('gender')} className="w-full border rounded p-2">
              <option value="">{t.common.pleaseSelect}</option>
              <option value="Female">{t.formOptions.female}</option>
              <option value="Male">{t.formOptions.male}</option>
              <option value="Other">{t.formOptions.other}</option>
            </select>
            {formState.errors.gender && <p className="text-red-600 text-sm">{formState.errors.gender.message}</p>}
          </div>
          <div className="mb-6">
            <label className="block mb-1 font-medium">{t.formFields.birthCountry} <span className="text-red-600">*</span></label>
            <select {...register('birth_country')} className="w-full border rounded p-2">
              <option value="">{t.common.pleaseSelect}</option>
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
              <option value="Curaçao">Curaçao</option>
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
              <option value="Equatorial Guinea">Equatorial Guinea</option>
              <option value="Eritrea">Eritrea</option>
              <option value="Estonia">Estonia</option>
              <option value="Ethiopia">Ethiopia</option>
              <option value="Falkland Islands">Falkland Islands</option>
              <option value="Faroe Islands">Faroe Islands</option>
              <option value="Fiji">Fiji</option>
              <option value="Finland">Finland</option>
              <option value="France">France</option>
              <option value="French Polynesia">French Polynesia</option>
              <option value="Gabon">Gabon</option>
              <option value="The Gambia">The Gambia</option>
              <option value="Georgia">Georgia</option>
              <option value="Germany">Germany</option>
              <option value="Ghana">Ghana</option>
              <option value="Gibraltar">Gibraltar</option>
              <option value="Greece">Greece</option>
              <option value="Greenland">Greenland</option>
              <option value="Grenada">Grenada</option>
              <option value="Guadeloupe">Guadeloupe</option>
              <option value="Guam">Guam</option>
              <option value="Guatemala">Guatemala</option>
              <option value="Guernsey">Guernsey</option>
              <option value="Guinea">Guinea</option>
              <option value="Guinea-Bissau">Guinea-Bissau</option>
              <option value="Guyana">Guyana</option>
              <option value="Haiti">Haiti</option>
              <option value="Honduras">Honduras</option>
              <option value="Hong Kong">Hong Kong</option>
              <option value="Hungary">Hungary</option>
              <option value="Iceland">Iceland</option>
              <option value="India">India</option>
              <option value="Indonesia">Indonesia</option>
              <option value="Iran">Iran</option>
              <option value="Iraq">Iraq</option>
              <option value="Ireland">Ireland</option>
              <option value="Israel">Israel</option>
              <option value="Italy">Italy</option>
              <option value="Jamaica">Jamaica</option>
              <option value="Japan">Japan</option>
              <option value="Jersey">Jersey</option>
              <option value="Jordan">Jordan</option>
              <option value="Kazakhstan">Kazakhstan</option>
              <option value="Kenya">Kenya</option>
              <option value="Kiribati">Kiribati</option>
              <option value="North Korea">North Korea</option>
              <option value="South Korea">South Korea</option>
              <option value="Kosovo">Kosovo</option>
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
              <option value="Macau">Macau</option>
              <option value="Macedonia">Macedonia</option>
              <option value="Madagascar">Madagascar</option>
              <option value="Malawi">Malawi</option>
              <option value="Malaysia">Malaysia</option>
              <option value="Maldives">Maldives</option>
              <option value="Mali">Mali</option>
              <option value="Malta">Malta</option>
              <option value="Marshall Islands">Marshall Islands</option>
              <option value="Martinique">Martinique</option>
              <option value="Mauritania">Mauritania</option>
              <option value="Mauritius">Mauritius</option>
              <option value="Mayotte">Mayotte</option>
              <option value="Mexico">Mexico</option>
              <option value="Micronesia">Micronesia</option>
              <option value="Moldova">Moldova</option>
              <option value="Monaco">Monaco</option>
              <option value="Mongolia">Mongolia</option>
              <option value="Montenegro">Montenegro</option>
              <option value="Montserrat">Montserrat</option>
              <option value="Morocco">Morocco</option>
              <option value="Mozambique">Mozambique</option>
              <option value="Myanmar">Myanmar</option>
              <option value="Nagorno-Karabakh">Nagorno-Karabakh</option>
              <option value="Namibia">Namibia</option>
              <option value="Nauru">Nauru</option>
              <option value="Nepal">Nepal</option>
              <option value="Netherlands">Netherlands</option>
              <option value="Netherlands Antilles">Netherlands Antilles</option>
              <option value="New Caledonia">New Caledonia</option>
              <option value="New Zealand">New Zealand</option>
              <option value="Nicaragua">Nicaragua</option>
              <option value="Niger">Niger</option>
              <option value="Nigeria">Nigeria</option>
              <option value="Niue">Niue</option>
              <option value="Norfolk Island">Norfolk Island</option>
              <option value="Turkish Republic of Northern Cyprus">Turkish Republic of Northern Cyprus</option>
              <option value="Northern Mariana">Northern Mariana</option>
              <option value="Norway">Norway</option>
              <option value="Oman">Oman</option>
              <option value="Pakistan">Pakistan</option>
              <option value="Palau">Palau</option>
              <option value="Palestine">Palestine</option>
              <option value="Panama">Panama</option>
              <option value="Papua New Guinea">Papua New Guinea</option>
              <option value="Paraguay">Paraguay</option>
              <option value="Peru">Peru</option>
              <option value="Philippines">Philippines</option>
              <option value="Pitcairn Islands">Pitcairn Islands</option>
              <option value="Poland">Poland</option>
              <option value="Portugal">Portugal</option>
              <option value="Puerto Rico">Puerto Rico</option>
              <option value="Qatar">Qatar</option>
              <option value="Republic of the Congo">Republic of the Congo</option>
              <option value="Romania">Romania</option>
              <option value="Russia">Russia</option>
              <option value="Rwanda">Rwanda</option>
              <option value="Saint Barthelemy">Saint Barthelemy</option>
              <option value="Saint Helena">Saint Helena</option>
              <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
              <option value="Saint Lucia">Saint Lucia</option>
              <option value="Saint Martin">Saint Martin</option>
              <option value="Saint Pierre and Miquelon">Saint Pierre and Miquelon</option>
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
              <option value="Somaliland">Somaliland</option>
              <option value="South Africa">South Africa</option>
              <option value="South Ossetia">South Ossetia</option>
              <option value="South Sudan">South Sudan</option>
              <option value="Spain">Spain</option>
              <option value="Sri Lanka">Sri Lanka</option>
              <option value="Sudan">Sudan</option>
              <option value="Suriname">Suriname</option>
              <option value="Svalbard">Svalbard</option>
              <option value="eSwatini">eSwatini</option>
              <option value="Sweden">Sweden</option>
              <option value="Switzerland">Switzerland</option>
              <option value="Syria">Syria</option>
              <option value="Taiwan">Taiwan</option>
              <option value="Tajikistan">Tajikistan</option>
              <option value="Tanzania">Tanzania</option>
              <option value="Thailand">Thailand</option>
              <option value="Timor-Leste">Timor-Leste</option>
              <option value="Togo">Togo</option>
              <option value="Tokelau">Tokelau</option>
              <option value="Tonga">Tonga</option>
              <option value="Transnistria Pridnestrovie">Transnistria Pridnestrovie</option>
              <option value="Trinidad and Tobago">Trinidad and Tobago</option>
              <option value="Tristan da Cunha">Tristan da Cunha</option>
              <option value="Tunisia">Tunisia</option>
              <option value="Turkey">Turkey</option>
              <option value="Turkmenistan">Turkmenistan</option>
              <option value="Turks and Caicos Islands">Turks and Caicos Islands</option>
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
              <option value="British Virgin Islands">British Virgin Islands</option>
              <option value="Isle of Man">Isle of Man</option>
              <option value="US Virgin Islands">US Virgin Islands</option>
              <option value="Wallis and Futuna">Wallis and Futuna</option>
              <option value="Western Sahara">Western Sahara</option>
              <option value="Yemen">Yemen</option>
              <option value="Zambia">Zambia</option>
              <option value="Zimbabwe">Zimbabwe</option>
            </select>
            {formState.errors.birth_country && <p className="text-red-600 text-sm">{formState.errors.birth_country.message}</p>}
          </div>
          <div className="mb-6">
            <label className="block mb-1 font-medium">{t.formFields.birthCity} <span className="text-red-600">*</span></label>
            <input type="text" {...register('birth_city')} className="w-full border rounded p-2" />
            <span className="text-xs text-gray-500">If there is no city/town/village on your passport, enter the name of the city/town/village where you were born.</span>
            {formState.errors.birth_city && <p className="text-red-600 text-sm">{formState.errors.birth_city.message}</p>}
          </div>
          <div className="mb-6">
            <label className="block mb-1 font-medium">{t.formFields.passportIssueDate} <span className="text-red-600">*</span></label>
            <div className="flex gap-2">
              <select {...register('passport_issue_month')} className="w-32 border rounded p-2">
                <option value="">{t.common.month}</option>
                {months.map((month, index) => <option key={month} value={monthNumbers[index]}>{month}</option>)}
              </select>
              <select {...register('passport_issue_day')} className="w-16 border rounded p-2">
                <option value="">{t.common.day}</option>
                {days.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <select {...register('passport_issue_year')} className="w-24 border rounded p-2">
                <option value="">{t.common.year}</option>
                {getYearOptions(currentYear, currentYear - 20).map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            {(formState.errors.passport_issue_month || formState.errors.passport_issue_day || formState.errors.passport_issue_year) && <p className="text-red-600 text-sm">Please enter a valid issue date</p>}
          </div>
          <div className="mb-6">
            <label className="block mb-1 font-medium">{t.formFields.passportExpiryDate} <span className="text-red-600">*</span></label>
            <div className="flex gap-2">
              <select {...register('passport_expiry_month')} className="w-32 border rounded p-2">
                <option value="">{t.common.month}</option>
                {months.map((month, index) => <option key={month} value={monthNumbers[index]}>{month}</option>)}
              </select>
              <select {...register('passport_expiry_day')} className="w-16 border rounded p-2">
                <option value="">{t.common.day}</option>
                {days.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <select {...register('passport_expiry_year')} className="w-24 border rounded p-2">
                <option value="">{t.common.year}</option>
                {getFutureYearOptions(currentYear, currentYear + 20).map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            {(formState.errors.passport_expiry_month || formState.errors.passport_expiry_day || formState.errors.passport_expiry_year) && <p className="text-red-600 text-sm">Please enter a valid expiry date</p>}
          </div>
        </>
      )}
    </div>,

    <div key="step-1" className="mb-8">
      <h2 className="text-xl font-bold mb-4">Personal &amp; Employment Details</h2>
      <div className="mb-6">
        <label className="block mb-1 font-medium">{t.formFields.additionalNationality} <span className="text-red-600">*</span></label>
        <div className="flex gap-6">
          <label className="inline-flex items-center gap-2">
            <input type="radio" value="No" {...register('additional_nationality')} /> {t.formOptions.no}
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="radio" value="Yes" {...register('additional_nationality')} /> {t.formOptions.yes}
          </label>
        </div>
        {formState.errors.additional_nationality && <p className="text-red-600 text-sm">{formState.errors.additional_nationality.message}</p>}
      </div>
      {additionalNationality === 'Yes' && (
        <div className="mb-6">
          <label className="block mb-1 font-medium">INDICATE WHICH COUNTRIES/TERRITORIES YOU ARE CITIZEN OF: <span className="text-red-600">*</span></label>
          <input type="text" {...register('additional_nationality_details')} className="w-full border rounded p-2" />
          {formState.errors.additional_nationality_details && <p className="text-red-600 text-sm">{formState.errors.additional_nationality_details.message}</p>}
        </div>
      )}
      <div className="mb-6">
        <label className="block mb-1 font-medium">{t.formFields.maritalStatus} <span className="text-red-600">*</span></label>
        <select {...register('marital_status')} className="w-full border rounded p-2">
          <option value="">{t.common.pleaseSelect}</option>
          <option value="Married">{t.formOptions.married}</option>
          <option value="Legally Separated">{t.formOptions.legallySeparated}</option>
          <option value="Divorced">{t.formOptions.divorced}</option>
          <option value="Annulled Marriage">{t.formOptions.annulledMarriage}</option>
          <option value="Widowed">{t.formOptions.widowed}</option>
          <option value="Common-Law">{t.formOptions.commonLaw}</option>
          <option value="Never Married/Single">{t.formOptions.neverMarried}</option>
        </select>
        {formState.errors.marital_status && <p className="text-red-600 text-sm">{formState.errors.marital_status.message}</p>}
      </div>
      <div className="mb-6">
        <label className="block mb-1 font-medium">{t.formFields.canadaVisaApplied} <span className="text-red-600">*</span></label>
        <div className="flex gap-6">
          <label className="inline-flex items-center gap-2">
            <input type="radio" value="No" {...register('canada_visa_applied')} /> {t.formOptions.no}
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="radio" value="Yes" {...register('canada_visa_applied')} /> {t.formOptions.yes}
          </label>
        </div>
        {formState.errors.canada_visa_applied && <p className="text-red-600 text-sm">{formState.errors.canada_visa_applied.message}</p>}
      </div>
      {canadaVisaApplied === 'Yes' && (
        <>
          <div className="mt-4 mb-6">
            <label className="block mb-1 font-medium">Unique client identifier (UCI) / Previous Canadian visa, eTA or permit number <span className="text-red-600">*</span></label>
            <input type="text" {...register('previous_visa_number')} className="w-full border rounded p-2" />
            {formState.errors.previous_visa_number && <p className="text-red-600 text-sm">{formState.errors.previous_visa_number.message}</p>}
          </div>
          <div className="mt-4 mb-6">
            <label className="block mb-1 font-medium">Unique client identifier (UCI) / Previous Canadian visa, eTA or permit number (re-enter) <span className="text-red-600">*</span></label>
            <input type="text" {...register('previous_visa_number_confirm', { validate: value => value === watchedPreviousVisaNumber || "Numbers must match" })} className="w-full border rounded p-2" />
            {formState.errors.previous_visa_number_confirm && <p className="text-red-600 text-sm">{formState.errors.previous_visa_number_confirm.message}</p>}
          </div>
        </>
      )}

      <h3 className="text-xl font-bold mb-4 mt-8">Employment information</h3>
      <div className="mb-6">
        <label className="block mb-1 font-medium">{t.formFields.occupation} <span className="text-red-600">*</span></label>
        <select {...register('occupation')} className="w-full border rounded p-2">
          <option value="">{t.common.pleaseSelect}</option>
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
            <label className="block mb-1 font-medium">COUNTRY/TERRITORY <span className="text-red-600">*</span></label>
            <select {...register('employment_country')} className="w-full border rounded p-2">
              <option value="">{t.common.pleaseSelect}</option>
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
              <option value="Equatorial Guinea">Equatorial Guinea</option>
              <option value="Eritrea">Eritrea</option>
              <option value="Estonia">Estonia</option>
              <option value="Eswatini">Eswatini</option>
              <option value="Ethiopia">Ethiopia</option>
              <option value="Faroe Islands">Faroe Islands</option>
              <option value="Fiji">Fiji</option>
              <option value="Finland">Finland</option>
              <option value="France">France</option>
              <option value="French Polynesia">French Polynesia</option>
              <option value="Gabon">Gabon</option>
              <option value="The Gambia">The Gambia</option>
              <option value="Georgia">Georgia</option>
              <option value="Germany">Germany</option>
              <option value="Ghana">Ghana</option>
              <option value="Gibraltar">Gibraltar</option>
              <option value="Greece">Greece</option>
              <option value="Greenland">Greenland</option>
              <option value="Grenada">Grenada</option>
              <option value="Guadeloupe">Guadeloupe</option>
              <option value="Guam">Guam</option>
              <option value="Guatemala">Guatemala</option>
              <option value="Guernsey">Guernsey</option>
              <option value="Guinea">Guinea</option>
              <option value="Guinea-Bissau">Guinea-Bissau</option>
              <option value="Guyana">Guyana</option>
              <option value="Haiti">Haiti</option>
              <option value="Honduras">Honduras</option>
              <option value="Hong Kong">Hong Kong</option>
              <option value="Hungary">Hungary</option>
              <option value="Iceland">Iceland</option>
              <option value="India">India</option>
              <option value="Indonesia">Indonesia</option>
              <option value="Iran">Iran</option>
              <option value="Iraq">Iraq</option>
              <option value="Ireland">Ireland</option>
              <option value="Israel">Israel</option>
              <option value="Italy">Italy</option>
              <option value="Jamaica">Jamaica</option>
              <option value="Japan">Japan</option>
              <option value="Jersey">Jersey</option>
              <option value="Jordan">Jordan</option>
              <option value="Kazakhstan">Kazakhstan</option>
              <option value="Kenya">Kenya</option>
              <option value="Kiribati">Kiribati</option>
              <option value="North Korea">North Korea</option>
              <option value="South Korea">South Korea</option>
              <option value="Kosovo">Kosovo</option>
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
              <option value="Macau">Macau</option>
              <option value="Madagascar">Madagascar</option>
              <option value="Malawi">Malawi</option>
              <option value="Malaysia">Malaysia</option>
              <option value="Maldives">Maldives</option>
              <option value="Mali">Mali</option>
              <option value="Malta">Malta</option>
              <option value="Marshall Islands">Marshall Islands</option>
              <option value="Mauritania">Mauritania</option>
              <option value="Mauritius">Mauritius</option>
              <option value="Mayotte">Mayotte</option>
              <option value="Mexico">Mexico</option>
              <option value="Micronesia">Micronesia</option>
              <option value="Moldova">Moldova</option>
              <option value="Monaco">Monaco</option>
              <option value="Mongolia">Mongolia</option>
              <option value="Montenegro">Montenegro</option>
              <option value="Montserrat">Montserrat</option>
              <option value="Morocco">Morocco</option>
              <option value="Mozambique">Mozambique</option>
              <option value="Myanmar (Burma)">Myanmar (Burma)</option>
              <option value="Nagorno-Karabakh">Nagorno-Karabakh</option>
              <option value="Namibia">Namibia</option>
              <option value="Nauru">Nauru</option>
              <option value="Nepal">Nepal</option>
              <option value="Netherlands">Netherlands</option>
              <option value="Netherlands Antilles">Netherlands Antilles</option>
              <option value="New Caledonia">New Caledonia</option>
              <option value="New Zealand">New Zealand</option>
              <option value="Nicaragua">Nicaragua</option>
              <option value="Niger">Niger</option>
              <option value="Nigeria">Nigeria</option>
              <option value="Niue">Niue</option>
              <option value="Norfolk Island">Norfolk Island</option>
              <option value="Northern Republic of Northern Cyprus">Northern Republic of Northern Cyprus</option>
              <option value="Northern Mariana Islands">Northern Mariana Islands</option>
              <option value="Norway">Norway</option>
              <option value="Oman">Oman</option>
              <option value="Pakistan">Pakistan</option>
              <option value="Palau">Palau</option>
              <option value="Palestine">Palestine</option>
              <option value="Panama">Panama</option>
              <option value="Papua New Guinea">Papua New Guinea</option>
              <option value="Paraguay">Paraguay</option>
              <option value="Peru">Peru</option>
              <option value="Philippines">Philippines</option>
              <option value="Pitcairn Islands">Pitcairn Islands</option>
              <option value="Poland">Poland</option>
              <option value="Portugal">Portugal</option>
              <option value="Puerto Rico">Puerto Rico</option>
              <option value="Republic of the Congo">Republic of the Congo</option>
              <option value="Romania">Romania</option>
              <option value="Russia">Russia</option>
              <option value="Rwanda">Rwanda</option>
              <option value="Saint Barthélemy">Saint Barthélemy</option>
              <option value="Saint Helena">Saint Helena</option>
              <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
              <option value="Saint Lucia">Saint Lucia</option>
              <option value="Saint Martin">Saint Martin</option>
              <option value="Saint Pierre and Miquelon">Saint Pierre and Miquelon</option>
              <option value="Saint Vincent and the Grenadines">Saint Vincent and the Grenadines</option>
              <option value="Samoa">Samoa</option>
              <option value="San Marino">San Marino</option>
              <option value="São Tomé and Príncipe">São Tomé and Príncipe</option>
              <option value="Saudi Arabia">Saudi Arabia</option>
              <option value="Senegal">Senegal</option>
              <option value="Serbia">Serbia</option>
              <option value="Seychelles">Seychelles</option>
              <option value="Sierra Leone">Sierra Leone</option>
              <option value="Singapore">Singapore</option>
              <option value="Sint Maarten">Sint Maarten</option>
              <option value="Slovakia">Slovakia</option>
              <option value="Slovenia">Slovenia</option>
              <option value="Solomon Islands">Solomon Islands</option>
              <option value="Somalia">Somalia</option>
              <option value="South Africa">South Africa</option>
              <option value="South Ossetia">South Ossetia</option>
              <option value="South Sudan">South Sudan</option>
              <option value="Spain">Spain</option>
              <option value="Sri Lanka">Sri Lanka</option>
              <option value="Sudan">Sudan</option>
              <option value="Suriname">Suriname</option>
              <option value="Sweden">Sweden</option>
              <option value="Switzerland">Switzerland</option>
              <option value="Syria">Syria</option>
              <option value="Taiwan">Taiwan</option>
              <option value="Tajikistan">Tajikistan</option>
              <option value="Tanzania">Tanzania</option>
              <option value="Thailand">Thailand</option>
              <option value="Timor-Leste">Timor-Leste</option>
              <option value="Togo">Togo</option>
              <option value="Tokelau">Tokelau</option>
              <option value="Tonga">Tonga</option>
              <option value="Transnistria Pridnestrovie">Transnistria Pridnestrovie</option>
              <option value="Trinidad and Tobago">Trinidad and Tobago</option>
              <option value="Tristan da Cunha">Tristan da Cunha</option>
              <option value="Tunisia">Tunisia</option>
              <option value="Turkey">Turkey</option>
              <option value="Turkmenistan">Turkmenistan</option>
              <option value="Turks and Caicos Islands">Turks and Caicos Islands</option>
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
              <option value="Western Sahara">Western Sahara</option>
              <option value="Yemen">Yemen</option>
              <option value="Zambia">Zambia</option>
              <option value="Zimbabwe">Zimbabwe</option>
            </select>
            {formState.errors.employment_country && <p className="text-red-600 text-sm">{formState.errors.employment_country.message}</p>}
          </div>
          <div className="mb-6">
            <label className="block mb-1 font-medium">City/town <span className="text-red-600">*</span></label>
            <input type="text" {...register('employer_city')} className="w-full border rounded p-2" />
            {formState.errors.employer_city && <p className="text-red-600 text-sm">{formState.errors.employer_city.message}</p>}
          </div>
          <div className="mb-6">
            <label className="block mb-1 font-medium">Since what year? <span className="text-red-600">*</span></label>
            <input type="text" {...register('employment_start_year')} className="w-full border rounded p-2" placeholder="YYYY" />
            {formState.errors.employment_start_year && <p className="text-red-600 text-sm">{formState.errors.employment_start_year.message}</p>}
          </div>
        </>
      )}

      <h3 className="text-xl font-bold mb-4 mt-8">Residential address</h3>
      <div className="text-sm text-gray-500 mb-4">Enter your permanent home address. Do not enter an address where you live temporarily.</div>
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
        <label className="block mb-1 font-medium">COUNTRY/TERRITORY <span className="text-red-600">*</span></label>
        <select {...register('address_country')} className="w-full border rounded p-2">
          <option value="">{t.common.pleaseSelect}</option>
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
          <option value="Curaçao">Curaçao</option>
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
          <option value="Equatorial Guinea">Equatorial Guinea</option>
          <option value="Eritrea">Eritrea</option>
          <option value="Estonia">Estonia</option>
          <option value="Ethiopia">Ethiopia</option>
          <option value="Falkland Islands">Falkland Islands</option>
          <option value="Faroe Islands">Faroe Islands</option>
          <option value="Fiji">Fiji</option>
          <option value="Finland">Finland</option>
          <option value="France">France</option>
          <option value="French Polynesia">French Polynesia</option>
          <option value="Gabon">Gabon</option>
          <option value="The Gambia">The Gambia</option>
          <option value="Georgia">Georgia</option>
          <option value="Germany">Germany</option>
          <option value="Ghana">Ghana</option>
          <option value="Gibraltar">Gibraltar</option>
          <option value="Greece">Greece</option>
          <option value="Greenland">Greenland</option>
          <option value="Grenada">Grenada</option>
          <option value="Guadeloupe">Guadeloupe</option>
          <option value="Guam">Guam</option>
          <option value="Guatemala">Guatemala</option>
          <option value="Guernsey">Guernsey</option>
          <option value="Guinea">Guinea</option>
          <option value="Guinea-Bissau">Guinea-Bissau</option>
          <option value="Guyana">Guyana</option>
          <option value="Haiti">Haiti</option>
          <option value="Honduras">Honduras</option>
          <option value="Hong Kong">Hong Kong</option>
          <option value="Hungary">Hungary</option>
          <option value="Iceland">Iceland</option>
          <option value="India">India</option>
          <option value="Indonesia">Indonesia</option>
          <option value="Iran">Iran</option>
          <option value="Iraq">Iraq</option>
          <option value="Ireland">Ireland</option>
          <option value="Israel">Israel</option>
          <option value="Italy">Italy</option>
          <option value="Jamaica">Jamaica</option>
          <option value="Japan">Japan</option>
          <option value="Jersey">Jersey</option>
          <option value="Jordan">Jordan</option>
          <option value="Kazakhstan">Kazakhstan</option>
          <option value="Kenya">Kenya</option>
          <option value="Kiribati">Kiribati</option>
          <option value="North Korea">North Korea</option>
          <option value="South Korea">South Korea</option>
          <option value="Kosovo">Kosovo</option>
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
          <option value="Macau">Macau</option>
          <option value="Macedonia">Macedonia</option>
          <option value="Madagascar">Madagascar</option>
          <option value="Malawi">Malawi</option>
          <option value="Malaysia">Malaysia</option>
          <option value="Maldives">Maldives</option>
          <option value="Mali">Mali</option>
          <option value="Malta">Malta</option>
          <option value="Marshall Islands">Marshall Islands</option>
          <option value="Martinique">Martinique</option>
          <option value="Mauritania">Mauritania</option>
          <option value="Mauritius">Mauritius</option>
          <option value="Mayotte">Mayotte</option>
          <option value="Mexico">Mexico</option>
          <option value="Micronesia">Micronesia</option>
          <option value="Moldova">Moldova</option>
          <option value="Monaco">Monaco</option>
          <option value="Mongolia">Mongolia</option>
          <option value="Montenegro">Montenegro</option>
          <option value="Montserrat">Montserrat</option>
          <option value="Morocco">Morocco</option>
          <option value="Mozambique">Mozambique</option>
          <option value="Myanmar">Myanmar</option>
          <option value="Nagorno-Karabakh">Nagorno-Karabakh</option>
          <option value="Namibia">Namibia</option>
          <option value="Nauru">Nauru</option>
          <option value="Nepal">Nepal</option>
          <option value="Netherlands">Netherlands</option>
          <option value="Netherlands Antilles">Netherlands Antilles</option>
          <option value="New Caledonia">New Caledonia</option>
          <option value="New Zealand">New Zealand</option>
          <option value="Nicaragua">Nicaragua</option>
          <option value="Niger">Niger</option>
          <option value="Nigeria">Nigeria</option>
          <option value="Niue">Niue</option>
          <option value="Norfolk Island">Norfolk Island</option>
          <option value="Turkish Republic of Northern Cyprus">Turkish Republic of Northern Cyprus</option>
          <option value="Northern Mariana">Northern Mariana</option>
          <option value="Norway">Norway</option>
          <option value="Oman">Oman</option>
          <option value="Pakistan">Pakistan</option>
          <option value="Palau">Palau</option>
          <option value="Palestine">Palestine</option>
          <option value="Panama">Panama</option>
          <option value="Papua New Guinea">Papua New Guinea</option>
          <option value="Paraguay">Paraguay</option>
          <option value="Peru">Peru</option>
          <option value="Philippines">Philippines</option>
          <option value="Pitcairn Islands">Pitcairn Islands</option>
          <option value="Poland">Poland</option>
          <option value="Portugal">Portugal</option>
          <option value="Puerto Rico">Puerto Rico</option>
          <option value="Qatar">Qatar</option>
          <option value="Republic of the Congo">Republic of the Congo</option>
          <option value="Romania">Romania</option>
          <option value="Russia">Russia</option>
          <option value="Rwanda">Rwanda</option>
          <option value="Saint Barthelemy">Saint Barthelemy</option>
          <option value="Saint Helena">Saint Helena</option>
          <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
          <option value="Saint Lucia">Saint Lucia</option>
          <option value="Saint Martin">Saint Martin</option>
          <option value="Saint Pierre and Miquelon">Saint Pierre and Miquelon</option>
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
          <option value="Somaliland">Somaliland</option>
          <option value="South Africa">South Africa</option>
          <option value="South Ossetia">South Ossetia</option>
          <option value="South Sudan">South Sudan</option>
          <option value="Spain">Spain</option>
          <option value="Sri Lanka">Sri Lanka</option>
          <option value="Sudan">Sudan</option>
          <option value="Suriname">Suriname</option>
          <option value="Svalbard">Svalbard</option>
          <option value="eSwatini">eSwatini</option>
          <option value="Sweden">Sweden</option>
          <option value="Switzerland">Switzerland</option>
          <option value="Syria">Syria</option>
          <option value="Taiwan">Taiwan</option>
          <option value="Tajikistan">Tajikistan</option>
          <option value="Tanzania">Tanzania</option>
          <option value="Thailand">Thailand</option>
          <option value="Timor-Leste">Timor-Leste</option>
          <option value="Togo">Togo</option>
          <option value="Tokelau">Tokelau</option>
          <option value="Tonga">Tonga</option>
          <option value="Transnistria Pridnestrovie">Transnistria Pridnestrovie</option>
          <option value="Trinidad and Tobago">Trinidad and Tobago</option>
          <option value="Tristan da Cunha">Tristan da Cunha</option>
          <option value="Tunisia">Tunisia</option>
          <option value="Turkey">Turkey</option>
          <option value="Turkmenistan">Turkmenistan</option>
          <option value="Turks and Caicos Islands">Turks and Caicos Islands</option>
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
          <option value="British Virgin Islands">British Virgin Islands</option>
          <option value="Isle of Man">Isle of Man</option>
          <option value="US Virgin Islands">US Virgin Islands</option>
          <option value="Wallis and Futuna">Wallis and Futuna</option>
          <option value="Western Sahara">Western Sahara</option>
          <option value="Yemen">Yemen</option>
          <option value="Zambia">Zambia</option>
          <option value="Zimbabwe">Zimbabwe</option>
        </select>
        {formState.errors.address_country && <p className="text-red-600 text-sm">{formState.errors.address_country.message}</p>}
      </div>
      <div className="mb-6">
        <label className="block mb-1 font-medium">Zipcode <span className="text-red-600">*</span></label>
        <input type="text" {...register('zip_code')} className="w-full border rounded p-2" />
        {formState.errors.zip_code && <p className="text-red-600 text-sm">{formState.errors.zip_code.message}</p>}
      </div>
      <div className="mb-6">
        <label className="block mb-1 font-medium">{t.formFields.email} <span className="text-red-600">*</span></label>
        <input type="email" {...register('email')} className="w-full border rounded p-2" placeholder="example@example.com" />
        {formState.errors.email && <p className="text-red-600 text-sm">{formState.errors.email.message}</p>}
      </div>
      <div className="mb-6">
        <label className="block mb-1 font-medium">Phone number (including area code) <span className="text-red-600">*</span></label>
        <input type="tel" {...register('phone')} className="w-full border rounded p-2" />
        <span className="text-xs text-gray-500">Favor inserir um número de telefone válido.</span>
        {formState.errors.phone && <p className="text-red-600 text-sm">{formState.errors.phone.message}</p>}
      </div>
      <hr className="my-8" />
      <h2 className="text-xl font-bold mb-4">Travel Information</h2>
      <div className="text-sm text-gray-500 mb-4">If you don&apos;t know, you may enter an approximate date/time</div>
      <div className="mb-6">
        <label className="block mb-1 font-medium">{t.formFields.doYouKnowTravelDate} <span className="text-red-600">*</span></label>
        <div className="flex gap-6">
          <label className="inline-flex items-center gap-2">
            <input type="radio" value="No" {...register('do_you_know_travel_date')} /> {t.formOptions.no}
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="radio" value="Yes" {...register('do_you_know_travel_date')} /> {t.formOptions.yes}
          </label>
        </div>
        {formState.errors.do_you_know_travel_date && <p className="text-red-600 text-sm">{formState.errors.do_you_know_travel_date.message}</p>}
      </div>
      {knowsTravelDate === 'Yes' && (
        <div className="mb-6">
          <label className="block mb-1 font-medium">WHEN DO YOU PLAN TO TRAVEL TO CANADA? <span className="text-red-600">*</span></label>
          <div className="flex gap-2">
            <select {...register('travel_date_month')} className="w-32 border rounded p-2">
              <option value="">{t.common.month}</option>
              {months.map((month, index) => <option key={month} value={monthNumbers[index]}>{month}</option>)}
            </select>
            <select {...register('travel_date_day')} className="w-16 border rounded p-2">
              <option value="">{t.common.day}</option>
              {days.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <select {...register('travel_date_year')} className="w-24 border rounded p-2">
              <option value="">{t.common.year}</option>
              {getFutureYearOptions(currentYear, currentYear + 5).map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          {(formState.errors.travel_date_month || formState.errors.travel_date_day || formState.errors.travel_date_year) && <p className="text-red-600 text-sm">Please enter a valid date</p>}
        </div>
      )}
      <div className="mb-8 mt-8">
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
        <div className="text-center flex justify-between mt-8">
          {step > 0 ? (
            <button type="button" className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-6 rounded-md font-semibold" onClick={() => setStep(step - 1)}>
              {t.common.back}
            </button>
          ) : (
            <div></div>
          )}
          {step < steps.length - 1 ? (
            <button type="button" className="bg-red-600 hover:bg-red-700 text-white py-2 px-12 rounded-md text-lg font-semibold" onClick={handleNext} disabled={!isEligible}>
              {t.common.next}
            </button>
          ) : (
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white py-2 px-12 rounded-md text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={formState.isSubmitting || hasSubmitted}
            >
              {formState.isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t.form.processing}
                </span>
              ) : (
                'Submit and Pay'
              )}
            </button>
          )}
        </div>
        {submitStatus === 'success' && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-medium">{t.form.submissionSuccess}</p>
          </div>
        )}
        {submitStatus === 'error' && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-medium">{t.form.submissionError}: {errorMessage}</p>
          </div>
        )}
      </form>
    </FormProvider>
  );
}

export default function ApplyPage() {
  const { t } = useLanguage();

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
      <Header />
      <main className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">
          {t.form.title}
        </h1>
        <div className="text-center mb-8">
          <p className="text-lg text-gray-700">
            {t.form.welcome}
          </p>
        </div>
        <div className="border-t border-gray-300 mb-8"></div>
        <div className="max-w-4xl mx-auto mb-8 text-center">
          <h2 className="text-lg font-bold text-gray-800 mb-4">{t.form.ifYouApply.title}</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3 justify-center">
              <div className="w-5 h-5 bg-green-600 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs">✓</span>
              </div>
              <p className="text-gray-700">{t.form.ifYouApply.point1}</p>
            </div>
            <div className="flex items-start gap-3 justify-center">
              <div className="w-5 h-5 bg-green-600 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs">✓</span>
              </div>
              <p className="text-gray-700">{t.form.ifYouApply.point2}</p>
            </div>
          </div>
        </div>
        <div className="max-w-4xl mx-auto mb-8 text-center">
          <h2 className="text-lg font-bold text-gray-800 mb-4">{t.form.permitRenewal.title}</h2>
          <div className="flex items-start gap-3 justify-center">
            <div className="w-5 h-5 bg-green-600 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs">✓</span>
            </div>
            <p className="text-gray-700">{t.form.permitRenewal.content}</p>
          </div>
        </div>
        <Suspense fallback={<div className="text-center py-12">{t.common.loading}</div>}>
          <ApplyFormMultiStep />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}