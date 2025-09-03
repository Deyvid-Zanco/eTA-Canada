import * as yup from "yup";

export const philippinesStep2Schema = yup.object({
  email: yup.string().email("Invalid email").required("Required"),
  email_confirm: yup.string()
    .oneOf([yup.ref("email")], "Email addresses must match")
    .required("Required"),
  phone_country_code: yup.string().required("Required"),
  phone_number: yup.string()
    .required("Required")
    .when("phone_country_code", {
      is: (val: string) => val === "+1",
      then: s => s.matches(/^\d{10}$/, "US phone numbers must be 10 digits (area code + number)"),
      otherwise: s => s.min(6, "Phone number must be at least 6 digits").max(15, "Phone number must be at most 15 digits")
    }),
  travel_type: yup.string().required("Required"),
  entry_day: yup.string().required("Required"),
  entry_month: yup.string().required("Required"),
  entry_year: yup.string().required("Required"),
  consent_declaration: yup.boolean().oneOf([true], "Must agree").required(),
});
