"use client";
import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useSearchParams } from "next/navigation";
import { COUNTRIES } from "../../lib/countries"; // path from app folder
import { useState, Suspense } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useEffect } from 'react';
//add somthing for new commit
// 1. Define all field names and validation schema
const travelDocumentOptions = [
  'Passport - ordinary/regular',
  'Passport - diplomatic',
  'Passport - official',
  'Passport - service',
  'Emergency/temporary travel document',
  'Refugee travel document',
  'Alien passport/travel document issued for non-citizens',
  'Permit to re-enter the United States (I-327)',
  'U.S. Refugee travel document (I-571)',
];

const nationalityOptions = [
  // ... (copy all options from JotForm nationality dropdown)
  'Andorra', 'Antigua and Barbuda', 'Argentina', 'Australia', 'Austria', 'Bahamas', 'Barbados', 'Belgium', 'Brazil', 'Bulgaria', 'Brunei Darussalam', 'Chile', 'China (Hong Kong SAR)', 'Croatia', 'Costa Rica', 'Cyprus', 'Czech Republic', 'Denmark', 'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Hungary', 'Iceland', 'Ireland', 'Israel (holders of Israeli national passports)', 'Italy', 'Japan', 'Latvia', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Malta', 'Mexico', 'Monaco', 'Morocco', 'Norway', 'New Zealand', 'Netherlands', 'Panama', 'Papua New Guinea', 'Philippines', 'Poland', 'Portugal', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Seychelles', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'South Korea', 'Spain', 'Sweden', 'Switzerland', 'Thailand', 'Taiwan (holders of passports containing a personal identification number)', 'Trinidad and Tobago', 'United Arab Emirates', 'United Kingdom', 'Uruguay', 'Vatican (holders of a passport or travel document issued by the Vatican)', 'OTHER',
];
// ... (define all other options as per JotForm)

// 2. Define validation schema with conditional logic
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
  job_description: string;
  employer_name: string;
  employment_country: string;
  apartment_number?: string | null | undefined;
  street_number: string;
  street_name: string;
  city_town: string;
  district_region?: string | null | undefined;
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
  // ... add other fields as needed
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
  job_description: yup.string().required('This field is required'),
  employer_name: yup.string().required('This field is required'),
  employment_country: yup.string().required('This field is required'),
  apartment_number: yup.string().nullable().notRequired(),
  street_number: yup.string().required('This field is required'),
  street_name: yup.string().required('This field is required'),
  city_town: yup.string().required('This field is required'),
  district_region: yup.string().nullable().notRequired(),
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
  // ... add other fields as needed
});

// 3. Multi-step logic
const steps = [
  // ... define step field groupings as per JotForm page breaks ...
];

function getYearOptions(start: number, end: number) {
  const years = [];
  for (let y = start; y <= end; y++) years.push(y);
  return years;
}
const currentYear = new Date().getFullYear();
const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));

function ApplyFormMultiStep() {
  const [step, setStep] = useState(0);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const methods = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: 'onTouched',
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
      job_description: '',
      employer_name: '',
      employment_country: '',
      apartment_number: '',
      street_number: '',
      street_name: '',
      city_town: '',
      district_region: '',
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
    },
  });
  const { handleSubmit, formState, watch, register, reset, trigger } = methods;
  const nationality = watch('nationality');

  // Conditional logic
  const showTaiwanID = nationality === 'Taiwan (holders of passports containing a personal identification number)';
  const showUSVisaFields = usVisaNationalities.includes(nationality);
  const showMexicoVisaImage = nationality === 'Mexico';
  const showArgentinaVisaImage = showUSVisaFields && nationality !== 'Mexico';

  const onSubmit = async (data: FormValues) => {
    setSubmitStatus('idle');
    setErrorMessage('');
    try {
      // Add reCAPTCHA and POST logic as before
      // ...
      setSubmitStatus('success');
      reset();
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage('Submission failed. Please try again.');
    }
  };

  // Step content definitions
  const steps = [
    // Step 0: Passport and personal details (combine previous steps 0 and 1)
    <div key="passport-personal-details" className="mb-8">
      <h2 className="text-xl font-bold mb-4">Passport details of applicant</h2>
      {/* TRAVEL DOCUMENT */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">TRAVEL DOCUMENT <span className="text-red-600">*</span></label>
        <select {...register('travel_document')} className="w-full border rounded p-2" required>
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
        {formState.errors.travel_document && <p className="text-red-600 text-sm">This field is required</p>}
      </div>
      {/* WHAT IS THE NATIONALITY NOTED ON THIS PASSPORT? */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">WHAT IS THE NATIONALITY NOTED ON THIS PASSPORT? <span className="text-red-600">*</span></label>
        <select {...register('nationality')} className="w-full border rounded p-2" required>
          <option value="">Please select</option>
          {/* Add all options as per the source */}
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
        <span className="text-xs text-gray-500">On your passport, look for a field named "Code", Issuing country", "Authority" or "Country code".</span>
        {formState.errors.nationality && <p className="text-red-600 text-sm">This field is required</p>}
      </div>
      {/* Taiwan National Identification Number (conditional) */}
      {showTaiwanID && (
        <div className="mb-6">
          <label className="block mb-1 font-medium">Taiwan National Identification Number <span className="text-red-600">*</span></label>
          <input type="text" {...register('taiwan_id')} className="w-full border rounded p-2" required />
        </div>
      )}
      {/* US VISA NUMBER (conditional) */}
      {showUSVisaFields && (
        <>
          <div className="mb-2 text-sm text-gray-700">Enter your US visa number. The number is made up of just one letter and seven numbers. Found in the bottom right corner of the visa as in the example below.</div>
          <div className="mb-6">
            <label className="block mb-1 font-medium">US VISA NUMBER <span className="text-red-600">*</span></label>
            <input type="text" {...register('us_visa_number')} className="w-full border rounded p-2" required={showUSVisaFields} />
            {formState.errors.us_visa_number && <p className="text-red-600 text-sm">{formState.errors.us_visa_number.message}</p>}
          </div>
          <div className="mb-6">
            <label className="block mb-1 font-medium">US VISA NUMBER (RE-ENTER) <span className="text-red-600">*</span></label>
            <input type="text" {...register('us_visa_number_confirm')} className="w-full border rounded p-2" required={showUSVisaFields} />
            {formState.errors.us_visa_number_confirm && <p className="text-red-600 text-sm">{formState.errors.us_visa_number_confirm.message}</p>}
          </div>
          <div className="mb-6">
            <label className="block mb-1 font-medium">DATE OF EXPIRY <span className="text-red-600">*</span></label>
            <div className="flex gap-2">
              <select {...register('us_visa_expiry_month')} className="w-16 border rounded p-2" required>
                <option value="">MM</option>
                {months.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <select {...register('us_visa_expiry_day')} className="w-16 border rounded p-2" required>
                <option value="">DD</option>
                {days.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <select {...register('us_visa_expiry_year')} className="w-24 border rounded p-2" required>
                <option value="">YYYY</option>
                {getYearOptions(currentYear, currentYear + 20).map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>
          {/* Example image for US visa */}
          <div className="mb-6 flex justify-center">
            {showMexicoVisaImage && (
              <img src="https://www.jotform.com/uploads/deyvidzancocontato/form_files/passaporte-mexico.66997689e89017.31889204.png" alt="US Visa Example - Mexico" className="max-w-xs rounded shadow" />
            )}
            {showArgentinaVisaImage && (
              <img src="https://www.jotform.com/uploads/deyvidzancocontato/form_files/argentina.66996712cc7e16.63038575.jpg" alt="US Visa Example - Other" className="max-w-xs rounded shadow" />
            )}
          </div>
        </>
      )}
      {/* PASSPORT NUMBER */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">PASSPORT NUMBER <span className="text-red-600">*</span></label>
        <input type="text" {...register('passport_number')} className="w-full border rounded p-2" required />
        <span className="text-xs text-gray-500">Enter the passport number exactly as it appears on the passport information page.</span>
        {formState.errors.passport_number && <p className="text-red-600 text-sm">{formState.errors.passport_number.message}</p>}
      </div>
      {/* PASSPORT NUMBER (RE-ENTER) */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">PASSPORT NUMBER (RE-ENTER) <span className="text-red-600">*</span></label>
        <input type="text" {...register('passport_number_confirm')} className="w-full border rounded p-2" required />
        {formState.errors.passport_number_confirm && <p className="text-red-600 text-sm">{formState.errors.passport_number_confirm.message}</p>}
      </div>
      {/* SURNAME(S) / LAST NAME(S) */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">SURNAME(S) / LAST NAME(S) <span className="text-red-600">*</span></label>
        <input type="text" {...register('surname')} className="w-full border rounded p-2" required />
        <span className="text-xs text-gray-500">Please enter exactly as shown on your passport or identity document.</span>
        {formState.errors.surname && <p className="text-red-600 text-sm">This field is required</p>}
      </div>
      {/* GIVEN NAME(S) / FIRST NAME(S) */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">GIVEN NAME(S) / FIRST NAME(S) <span className="text-red-600">*</span></label>
        <input type="text" {...register('given_name')} className="w-full border rounded p-2" required />
        <span className="text-xs text-gray-500">Please enter exactly as shown on your passport or identity document.</span>
        {formState.errors.given_name && <p className="text-red-600 text-sm">This field is required</p>}
      </div>
      {/* DATE OF BIRTH */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">DATE OF BIRTH <span className="text-red-600">*</span></label>
        <div className="flex gap-2">
          <select {...register('dob_month')} className="w-16 border rounded p-2" required>
            <option value="">MM</option>
            {months.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <select {...register('dob_day')} className="w-16 border rounded p-2" required>
            <option value="">DD</option>
            {days.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select {...register('dob_year')} className="w-24 border rounded p-2" required>
            <option value="">YYYY</option>
            {getYearOptions(1900, currentYear).map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>
      {/* GENDER */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">GENDER <span className="text-red-600">*</span></label>
        <select {...register('gender')} className="w-full border rounded p-2" required>
          <option value="">Please select</option>
          <option value="Female">Female</option>
          <option value="Male">Male</option>
          <option value="Other">Other</option>
        </select>
        {formState.errors.gender && <p className="text-red-600 text-sm">This field is required</p>}
      </div>
      {/* COUNTRY/TERRITORY OF BIRTH */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">COUNTRY/TERRITORY OF BIRTH <span className="text-red-600">*</span></label>
        <select {...register('birth_country')} className="w-full border rounded p-2" required>
          <option value="">Please select</option>
          {/* Add all options as per the source */}
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
          <option value="Cote d'Ivoire">Cote d'Ivoire</option>
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
          {/* ... more options ... */}
        </select>
        {formState.errors.birth_country && <p className="text-red-600 text-sm">This field is required</p>}
      </div>
      {/* CITY/TOWN OF BIRTH */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">CITY/TOWN OF BIRTH <span className="text-red-600">*</span></label>
        <input type="text" {...register('birth_city')} className="w-full border rounded p-2" required />
        <span className="text-xs text-gray-500">If there is no city/town/village on your passport, enter the name of the city/town/village where you were born.</span>
        {formState.errors.birth_city && <p className="text-red-600 text-sm">This field is required</p>}
      </div>
      {/* DATE OF ISSUE OF PASSPORT */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">DATE OF ISSUE OF PASSPORT <span className="text-red-600">*</span></label>
        <div className="flex gap-2">
          <select {...register('passport_issue_month')} className="w-16 border rounded p-2" required>
            <option value="">MM</option>
            {months.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <select {...register('passport_issue_day')} className="w-16 border rounded p-2" required>
            <option value="">DD</option>
            {days.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select {...register('passport_issue_year')} className="w-24 border rounded p-2" required>
            <option value="">YYYY</option>
            {getYearOptions(currentYear - 20, currentYear).map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>
      {/* DATE OF EXPIRY OF PASSPORT */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">DATE OF EXPIRY OF PASSPORT <span className="text-red-600">*</span></label>
        <div className="flex gap-2">
          <select {...register('passport_expiry_month')} className="w-16 border rounded p-2" required>
            <option value="">MM</option>
            {months.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <select {...register('passport_expiry_day')} className="w-16 border rounded p-2" required>
            <option value="">DD</option>
            {days.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select {...register('passport_expiry_year')} className="w-24 border rounded p-2" required>
            <option value="">YYYY</option>
            {getYearOptions(currentYear, currentYear + 20).map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>
    </div>,
    // Step 1: All other fields (employment, address, contact, travel, consent)
    <div key="all-other-fields" className="mb-8">
      <h2 className="text-xl font-bold mb-4">Additional Information</h2>
      {/* ARE YOU A CITIZEN OF ANY ADDITIONAL NATIONALITIES? */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">ARE YOU A CITIZEN OF ANY ADDITIONAL NATIONALITIES? <span className="text-red-600">*</span></label>
        <div className="flex gap-6">
          <label className="inline-flex items-center gap-2">
            <input type="radio" value="No" {...register('additional_nationality')} required /> No
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="radio" value="Yes" {...register('additional_nationality')} required /> Yes
          </label>
        </div>
        {formState.errors.additional_nationality && <p className="text-red-600 text-sm">This field is required</p>}
      </div>
      {/* INDICATE WHICH COUNTRIES/TERRITORIES YOU ARE CITIZEN OF: (conditional) */}
      {watch('additional_nationality') === 'Yes' && (
        <div className="mb-6">
          <label className="block mb-1 font-medium">INDICATE WHICH COUNTRIES/TERRITORIES YOU ARE CITIZEN OF: <span className="text-red-600">*</span></label>
          <input type="text" {...register('additional_nationality_details')} className="w-full border rounded p-2" required />
          {formState.errors.additional_nationality_details && <p className="text-red-600 text-sm">This field is required</p>}
        </div>
      )}
      {/* Marital status */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">Marital status <span className="text-red-600">*</span></label>
        <select {...register('marital_status')} className="w-full border rounded p-2" required>
          <option value="">Please select</option>
          <option value="Married">Married</option>
          <option value="Legally Separated">Legally Separated</option>
          <option value="Divorced">Divorced</option>
          <option value="Annulled Marriage">Annulled Marriage</option>
          <option value="Widowed">Widowed</option>
          <option value="Common-Law">Common-Law</option>
          <option value="Never Married/Single">Never Married/Single</option>
        </select>
        {formState.errors.marital_status && <p className="text-red-600 text-sm">This field is required</p>}
      </div>
      {/* HAVE YOU EVER APPLIED FOR OR OBTAINED A VISA, AN ETA OR A PERMIT TO VISIT, LIVE, WORK OR STUDY IN CANADA? */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">HAVE YOU EVER APPLIED FOR OR OBTAINED A VISA, AN ETA OR A PERMIT TO VISIT, LIVE, WORK OR STUDY IN CANADA? <span className="text-red-600">*</span></label>
        <div className="flex gap-6">
          <label className="inline-flex items-center gap-2">
            <input type="radio" value="No" {...register('canada_visa_applied')} required /> No
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="radio" value="Yes" {...register('canada_visa_applied')} required /> Yes
          </label>
        </div>
        {formState.errors.canada_visa_applied && <p className="text-red-600 text-sm">This field is required</p>}
      </div>
      {/* Occupation */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">Occupation <span className="text-red-600">*</span></label>
        <select {...register('occupation')} className="w-full border rounded p-2" required>
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
      {/* Describe a bit more about your job */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">Describe a bit more about your job <span className="text-red-600">*</span></label>
        <input type="text" {...register('job_description')} className="w-full border rounded p-2" required />
        {formState.errors.job_description && <p className="text-red-600 text-sm">{formState.errors.job_description.message}</p>}
      </div>
      {/* Name of employer or school, as appropriate */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">Name of employer or school, as appropriate <span className="text-red-600">*</span></label>
        <input type="text" {...register('employer_name')} className="w-full border rounded p-2" required />
        {formState.errors.employer_name && <p className="text-red-600 text-sm">{formState.errors.employer_name.message}</p>}
      </div>
      {/* COUNTRY/TERRITORY */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">COUNTRY/TERRITORY <span className="text-red-600">*</span></label>
        <select {...register('employment_country')} className="w-full border rounded p-2" required>
          <option value="">Please select</option>
          {/* Add all country options as in previous country dropdowns */}
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
          <option value="Cote d'Ivoire">Cote d'Ivoire</option>
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
          {/* ... more options ... */}
        </select>
        {formState.errors.employment_country && <p className="text-red-600 text-sm">{formState.errors.employment_country.message}</p>}
      </div>
      {/* Apartment number */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">APARTMENT NUMBER</label>
        <input type="text" {...register('apartment_number')} className="w-full border rounded p-2" />
      </div>
      {/* Street number */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">STREET NUMBER <span className="text-red-600">*</span></label>
        <input type="text" {...register('street_number')} className="w-full border rounded p-2" required />
        {formState.errors.street_number && <p className="text-red-600 text-sm">{formState.errors.street_number.message}</p>}
      </div>
      {/* Street name */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">STREET NAME <span className="text-red-600">*</span></label>
        <input type="text" {...register('street_name')} className="w-full border rounded p-2" required />
        {formState.errors.street_name && <p className="text-red-600 text-sm">{formState.errors.street_name.message}</p>}
      </div>
      {/* City/town */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">CITY/TOWN <span className="text-red-600">*</span></label>
        <input type="text" {...register('city_town')} className="w-full border rounded p-2" required />
        {formState.errors.city_town && <p className="text-red-600 text-sm">{formState.errors.city_town.message}</p>}
      </div>
      {/* District/region */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">DISTRICT/REGION</label>
        <input type="text" {...register('district_region')} className="w-full border rounded p-2" />
      </div>
      {/* Country/territory */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">COUNTRY/TERRITORY <span className="text-red-600">*</span></label>
        <select {...register('address_country')} className="w-full border rounded p-2" required>
          <option value="">Please select</option>
          {/* Add all country options as in previous country dropdowns */}
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
          <option value="Cote d'Ivoire">Cote d'Ivoire</option>
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
          {/* ... more options ... */}
        </select>
        {formState.errors.address_country && <p className="text-red-600 text-sm">{formState.errors.address_country.message}</p>}
      </div>
      {/* Email */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">Email address <span className="text-red-600">*</span></label>
        <input type="email" {...register('email')} className="w-full border rounded p-2" required />
        {formState.errors.email && <p className="text-red-600 text-sm">{formState.errors.email.message}</p>}
      </div>
      {/* Email confirm */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">Confirm email address <span className="text-red-600">*</span></label>
        <input type="email" {...register('email_confirm')} className="w-full border rounded p-2" required />
        {formState.errors.email_confirm && <p className="text-red-600 text-sm">{formState.errors.email_confirm.message}</p>}
      </div>
      {/* Phone */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">Phone number <span className="text-red-600">*</span></label>
        <input type="text" {...register('phone')} className="w-full border rounded p-2" required />
        {formState.errors.phone && <p className="text-red-600 text-sm">{formState.errors.phone.message}</p>}
      </div>
      {/* Alternative phone */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">Alternative phone number</label>
        <input type="text" {...register('alt_phone')} className="w-full border rounded p-2" />
      </div>
      {/* Preferred language */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">Preferred language of correspondence <span className="text-red-600">*</span></label>
        <select {...register('preferred_language')} className="w-full border rounded p-2" required>
          <option value="">Please select</option>
          <option value="English">English</option>
          <option value="French">French</option>
        </select>
        {formState.errors.preferred_language && <p className="text-red-600 text-sm">{formState.errors.preferred_language.message}</p>}
      </div>
      {/* Do you know when you will travel? */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">DO YOU KNOW WHEN YOU WILL TRAVEL TO CANADA? <span className="text-red-600">*</span></label>
        <div className="flex gap-6">
          <label className="inline-flex items-center gap-2">
            <input type="radio" value="No" {...register('do_you_know_travel_date')} required /> No
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="radio" value="Yes" {...register('do_you_know_travel_date')} required /> Yes
          </label>
        </div>
        {formState.errors.do_you_know_travel_date && <p className="text-red-600 text-sm">{formState.errors.do_you_know_travel_date.message}</p>}
      </div>
      {/* If Yes, show date pickers */}
      {watch('do_you_know_travel_date') === 'Yes' && (
        <div className="mb-6">
          <label className="block mb-1 font-medium">WHEN DO YOU PLAN TO TRAVEL TO CANADA? <span className="text-red-600">*</span></label>
          <div className="flex gap-2">
            <select {...register('travel_date_month')} className="w-16 border rounded p-2" required>
              <option value="">MM</option>
              {months.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <select {...register('travel_date_day')} className="w-16 border rounded p-2" required>
              <option value="">DD</option>
              {days.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <select {...register('travel_date_year')} className="w-24 border rounded p-2" required>
              <option value="">YYYY</option>
              {getYearOptions(currentYear, currentYear + 2).map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          {(formState.errors.travel_date_month || formState.errors.travel_date_day || formState.errors.travel_date_year) && (
            <p className="text-red-600 text-sm">Please enter a valid date</p>
          )}
        </div>
      )}
      {/* Consent/Declaration */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Consent And Declaration</h2>
        <div className="mb-4 text-gray-700 text-sm">
          Declaration of Applicant: The information I have provided in this application is truthful, complete and correct. I understand that misrepresentation is an offence under section 127 of the <a href="https://laws-lois.justice.gc.ca/eng/annualstatutes/2001_27/FullText.html" target="_blank" rel="nofollow" className="underline">Immigration and Refugee Protection Act</a> and may result in a finding of inadmissibility to Canada or removal from Canada. I also do agree that by checking the box below and clicking submit, I am electronically signing this application.
        </div>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" {...register('consent_declaration')} className="form-checkbox" required />
          <span>I agree</span>
        </label>
        {formState.errors.consent_declaration && <p className="text-red-600 text-sm">{formState.errors.consent_declaration.message}</p>}
      </div>
    </div>,
  ];

  return (
    <FormProvider {...methods}>
      <form className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8 space-y-8" onSubmit={handleSubmit(onSubmit)}>
        {steps[step]}
        <div className="text-center flex justify-between mt-8">
          {step > 0 && (
            <button type="button" className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-6 rounded-md font-semibold" onClick={() => setStep(step - 1)}>
              Back
            </button>
          )}
          {step < steps.length - 1 ? (
            <button type="button" className="bg-red-600 hover:bg-red-700 text-white py-2 px-12 rounded-md text-lg font-semibold" onClick={async () => {
              const valid = await trigger();
              if (valid) setStep(step + 1);
            }}>
              Next
            </button>
          ) : (
            <button type="submit" className="bg-red-600 hover:bg-red-700 text-white py-2 px-12 rounded-md text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
              Submit Application
            </button>
          )}
        </div>
        {submitStatus === 'success' && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-medium">✅ Application submitted successfully!</p>
          </div>
        )}
        {submitStatus === 'error' && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-medium">❌ Error: {errorMessage}</p>
          </div>
        )}
      </form>
    </FormProvider>
  );
}

export default function ApplyPage() {
  return (
    <>
      <Head>
        <title>eTA Application Form | canada-eta.visasyst.com</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <Header />
      <main className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">
          CANADA ETA PERMIT AUTHORIZATION
        </h1>
        <Suspense fallback={<div className="text-center py-12">Loading form...</div>}>
          <ApplyFormMultiStep />
        </Suspense>
      </main>
      <Footer />
    </>
  );
} 