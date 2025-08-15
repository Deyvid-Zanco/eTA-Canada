import * as yup from "yup";

export const step2Schema = yup.object({
  additional_nationality: yup.string().nullable(),
  additional_nationality_details: yup.string().when("additional_nationality", {
    is: "Yes",
    then: s => s.required("Required"),
    otherwise: s => s.notRequired()
  }),
  marital_status: yup.string().nullable(),
  canada_visa_applied: yup.string().nullable(),
  previous_visa_number: yup.string().when("canada_visa_applied", {
    is: "Yes",
    then: s => s.required("Required"),
    otherwise: s => s.notRequired().nullable()
  }),
  occupation: yup.string().required("Required"),
  job_description: yup.string().when("occupation", {
    is: (val: string) => !["Unemployed", "Homemaker", "Retired", "Student", "Military/armed forces"].includes(val),
    then: s => s.required("Required"),
    otherwise: s => s.notRequired()
  }),
  employer_name: yup.string().when("occupation", {
    is: (val: string) => !["Unemployed", "Homemaker", "Retired", "Student", "Military/armed forces"].includes(val),
    then: s => s.required("Required"),
    otherwise: s => s.notRequired()
  }),
  employment_country: yup.string().when("occupation", {
    is: (val: string) => !["Unemployed", "Homemaker", "Retired", "Student", "Military/armed forces"].includes(val),
    then: s => s.required("Required"),
    otherwise: s => s.notRequired()
  }),
  apartment_number: yup.string().nullable(),
  street_number: yup.string().required("Required"),
  street_name: yup.string().required("Required"),
  city_town: yup.string().required("Required"),
  district_region: yup.string().nullable(),
  zip_code: yup.string().required("Required"),
  address_country: yup.string().required("Required"),
  email: yup.string().email("Invalid").required("Required"),
  email_confirm: yup.string().oneOf([yup.ref("email")], "Must match").required("Required"),
  phone: yup.string().required("Required"),
  alt_phone: yup.string().nullable(),
  preferred_language: yup.string().required("Required"),
  do_you_know_travel_date: yup.string().required("Required"),
  travel_date_month: yup.string().when("do_you_know_travel_date", {
    is: "Yes",
    then: s => s.required("Required"),
    otherwise: s => s.notRequired().nullable()
  }),
  travel_date_day: yup.string().when("do_you_know_travel_date", {
    is: "Yes",
    then: s => s.required("Required"),
    otherwise: s => s.notRequired().nullable()
  }),
  travel_date_year: yup.string().when("do_you_know_travel_date", {
    is: "Yes",
    then: s => s.required("Required"),
    otherwise: s => s.notRequired().nullable()
  }),
  consent_declaration: yup.boolean().oneOf([true], "Must agree").required(),
});
