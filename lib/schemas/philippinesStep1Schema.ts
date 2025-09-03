import * as yup from "yup";

export const philippinesStep1Schema = yup.object({
  surname: yup.string().required("Required"),
  given_name: yup.string().required("Required"),
  middle_name: yup.string().nullable(),
  gender: yup.string().required("Required"),
  dob_day: yup.string().required("Required"),
  dob_month: yup.string().required("Required"),
  dob_year: yup.string().required("Required"),
  citizenship: yup.string().required("Required"),
  passport_country: yup.string().required("Required"),
  passport_number: yup.string().required("Required"),
  passport_issue_day: yup.string().required("Required"),
  passport_issue_month: yup.string().required("Required"),
  passport_issue_year: yup.string().required("Required"),
  passport_expiry_day: yup.string().required("Required"),
  passport_expiry_month: yup.string().required("Required"),
  passport_expiry_year: yup.string().required("Required"),
});
