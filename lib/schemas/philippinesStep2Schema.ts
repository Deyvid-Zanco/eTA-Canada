import * as yup from "yup";

export const philippinesStep2Schema = yup.object({
  email: yup.string().email("Invalid email").required("Required"),
  email_confirm: yup.string()
    .oneOf([yup.ref("email")], "Email addresses must match")
    .required("Required"),
  phone_country_code: yup.string().required("Required"),
  phone_number: yup.string().required("Required"),
  travel_type: yup.string().required("Required"),
  entry_day: yup.string().required("Required"),
  entry_month: yup.string().required("Required"),
  entry_year: yup.string().required("Required"),
  consent_declaration: yup.boolean().oneOf([true], "Must agree").required(),
});
