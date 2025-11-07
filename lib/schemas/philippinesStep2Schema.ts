import * as yup from "yup";
import { 
  createDateFromParts, 
  isValidDate,
  isDateWithinFutureYears,
  createValidDateTest 
} from "@/lib/utils/dateValidation";

export const philippinesStep2Schema = yup.object({
  apartment_number: yup.string().nullable(),
  street_number: yup.string().required("Required"),
  street_name: yup.string().required("Required"),
  city_town: yup.string().required("Required"),
  district_region: yup.string().nullable(),
  zip_code: yup.string().required("Required"),
  address_country: yup.string().required("Required"),
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
  
  // Entry Date - must be today or future, but not more than 2 years in future
  entry_day: yup.string()
    .required("Required")
    .test("valid-date", "Invalid date", createValidDateTest("Invalid entry date")),
  travel_method: yup.string().required('Please select your method of travel'),
  entry_month: yup.string()
    .required("Required")
    .test("valid-date", "Invalid date", createValidDateTest("Invalid entry date"))
    .test("not-past", "Arrival date cannot be in the past", function(value: string | null | undefined) {
      const date = createDateFromParts(value, this.parent.entry_day, this.parent.entry_year);
      if (!date || !isValidDate(date)) return true;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      date.setHours(0, 0, 0, 0);
      return date >= today;
    })
    .test("not-too-future", "Arrival date cannot be more than 2 years in the future", function(value: string | null | undefined) {
      const date = createDateFromParts(value, this.parent.entry_day, this.parent.entry_year);
      if (!date || !isValidDate(date)) return true;
      return isDateWithinFutureYears(date, 2);
    }),
  entry_year: yup.string()
    .required("Required")
    .test("valid-date", "Invalid date", createValidDateTest("Invalid entry date")),
  
  consent_declaration: yup.boolean().oneOf([true], "Must agree").required(),
});
