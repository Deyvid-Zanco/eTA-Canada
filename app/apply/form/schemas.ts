import * as yup from 'yup';

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

export type FormValues = {
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

export const schema: yup.ObjectSchema<FormValues> = yup.object({
  travel_document: yup.string().required('This field is required'),
  nationality: yup.string().required('This field is required'),
  taiwan_id: yup.string().when('nationality', {
    is: 'Taiwan (holders of passports containing a personal identification number)',
    then: (schema) => schema.required('This field is required'),
    otherwise: (schema) => schema.notRequired().nullable(),
  }),
  us_visa_number: yup.string().when('nationality', {
    is: (val: string) => usVisaNationalities.includes(val),
    then: (schema) => schema.required('This field is required'),
    otherwise: (schema) => schema.notRequired().nullable(),
  }),
  us_visa_number_confirm: yup.string().when('nationality', {
    is: (val: string) => usVisaNationalities.includes(val),
    then: (schema) => schema.required('This field is required').oneOf([yup.ref('us_visa_number')], 'Visa numbers must match'),
    otherwise: (schema) => schema.notRequired().nullable(),
  }),
  us_visa_expiry_month: yup.string().when('nationality', {
    is: (val: string) => usVisaNationalities.includes(val),
    then: (schema) => schema.required('This field is required'),
    otherwise: (schema) => schema.notRequired().nullable(),
  }),
  us_visa_expiry_day: yup.string().when('nationality', {
    is: (val: string) => usVisaNationalities.includes(val),
    then: (schema) => schema.required('This field is required'),
    otherwise: (schema) => schema.notRequired().nullable(),
  }),
  us_visa_expiry_year: yup.string().when('nationality', {
    is: (val: string) => usVisaNationalities.includes(val),
    then: (schema) => schema.required('This field is required'),
    otherwise: (schema) => schema.notRequired().nullable(),
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
    then: (schema) => schema.required('This field is required'),
    otherwise: (schema) => schema.notRequired().nullable(),
  }),
  marital_status: yup.string().required('This field is required'),
  canada_visa_applied: yup.string().required('This field is required'),
  previous_visa_number: yup.string().when('canada_visa_applied', {
    is: 'Yes',
    then: (schema) => schema.required('This field is required'),
    otherwise: (schema) => schema.notRequired().nullable(),
  }),
  previous_visa_number_confirm: yup.string().when('canada_visa_applied', {
    is: 'Yes',
    then: (schema) => schema.required('This field is required').oneOf([yup.ref('previous_visa_number')], 'Numbers must match'),
    otherwise: (schema) => schema.notRequired().nullable(),
  }),
  occupation: yup.string().required('This field is required'),
  job_description: yup.string().when('occupation', {
    is: (val: string) => !['Unemployed', 'Homemaker', 'Retired'].includes(val),
    then: (schema) => schema.required('This field is required'),
    otherwise: (schema) => schema.notRequired().nullable(),
  }),
  employer_name: yup.string().when('occupation', {
    is: (val: string) => !['Unemployed', 'Homemaker', 'Retired'].includes(val),
    then: (schema) => schema.required('This field is required'),
    otherwise: (schema) => schema.notRequired().nullable(),
  }),
  employment_country: yup.string().when('occupation', {
    is: (val: string) => !['Unemployed', 'Homemaker', 'Retired'].includes(val),
    then: (schema) => schema.required('This field is required'),
    otherwise: (schema) => schema.notRequired().nullable(),
  }),
  employer_city: yup.string().when('occupation', {
    is: (val: string) => !['Unemployed', 'Homemaker', 'Retired'].includes(val),
    then: (schema) => schema.required('This field is required'),
    otherwise: (schema) => schema.notRequired().nullable(),
  }),
  employment_start_year: yup.string().when('occupation', {
    is: (val: string) => !['Unemployed', 'Homemaker', 'Retired'].includes(val),
    then: (schema) => schema.required('This field is required').matches(/^(19|20)\d{2}$/, 'Year must be in YYYY format'),
    otherwise: (schema) => schema.notRequired().nullable(),
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
    then: (schema) => schema.required('Month is required'),
    otherwise: (schema) => schema.notRequired().nullable(),
  }),
  travel_date_day: yup.string().when('do_you_know_travel_date', {
    is: 'Yes',
    then: (schema) => schema.required('Day is required'),
    otherwise: (schema) => schema.notRequired().nullable(),
  }),
  travel_date_year: yup.string().when('do_you_know_travel_date', {
    is: 'Yes',
    then: (schema) => schema.required('Year is required'),
    otherwise: (schema) => schema.notRequired().nullable(),
  }),
  consent_declaration: yup.boolean().oneOf([true], 'You must agree to the declaration').required('You must agree to the declaration'),
});