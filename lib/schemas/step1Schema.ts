import * as yup from "yup";
import { US_VISA_NATIONALITIES } from "@/lib/constants";

export const step1Schema = yup.object({
  travel_document: yup.string().required("Required"),
  nationality: yup.string().required("Required"),
  passport_number: yup.string().required("Required"),
  passport_number_confirm: yup.string()
    .required("Required")
    .oneOf([yup.ref("passport_number")], "Passport numbers must match"),
  surname: yup.string().required("Required"),
  given_name: yup.string().required("Required"),
  dob_month: yup.string().nullable(),
  dob_day: yup.string().nullable(),
  dob_year: yup.string().nullable(),
  gender: yup.string().required("Required"),
  birth_country: yup.string().required("Required"),
  birth_city: yup.string().nullable(),

  us_visa_number: yup.string().when("nationality", {
    is: (val: string) => US_VISA_NATIONALITIES.includes(val),
    then: s => s.required("Required")
      .matches(/^[A-Za-z][0-9]{7}$/, "1 letter + 7 digits")
      .length(8, "Must be 8 chars"),
    otherwise: s => s.notRequired().nullable()
  }),
  us_visa_number_confirm: yup.string().when("nationality", {
    is: (val: string) => US_VISA_NATIONALITIES.includes(val),
    then: s => s.required("Required").oneOf([yup.ref("us_visa_number")], "Must match"),
    otherwise: s => s.notRequired().nullable()
  }),
  us_visa_expiry_month: yup.string().nullable(),
  us_visa_expiry_day: yup.string().nullable(),
  us_visa_expiry_year: yup.string().nullable(),

  passport_issue_month: yup.string().nullable(),
  passport_issue_day: yup.string().nullable(),
  passport_issue_year: yup.string().nullable(),
  passport_expiry_month: yup.string().nullable(),
  passport_expiry_day: yup.string().nullable(),
  passport_expiry_year: yup.string().nullable(),
});
