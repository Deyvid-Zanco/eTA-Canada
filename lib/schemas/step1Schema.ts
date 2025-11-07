import * as yup from "yup";
import { US_VISA_NATIONALITIES } from "@/lib/constants";
import { 
  createDateFromParts, 
  isDateInPast, 
  isDateBefore,
  isValidDate,
  isDateWithinPastYears,
  createValidDateTest 
} from "@/lib/utils/dateValidation";

export const step1Schema = yup.object({
  travel_document: yup.string().required("Required"),
  nationality: yup.string().required("Required"),
  passport_number: yup.string().required("Required"),
  passport_number_confirm: yup.string()
    .required("Required")
    .oneOf([yup.ref("passport_number")], "Passport numbers must match"),
  surname: yup.string().required("Required"),
  given_name: yup.string().required("Required"),
  
  // Date of Birth - must be in past, not more than 120 years ago
  dob_month: yup.string()
    .nullable()
    .test("valid-date", "Invalid date", createValidDateTest("Invalid date of birth"))
    .test("past-date", "Date of birth must be in the past", function(value: string | null | undefined) {
      const date = createDateFromParts(
        value,
        this.parent.dob_day,
        this.parent.dob_year
      );
      if (!date || !isValidDate(date)) return true; // Let required handle empty
      return isDateInPast(date);
    })
    .test("not-too-old", "Please enter a valid date of birth", function(value: string | null | undefined) {
      const date = createDateFromParts(value, this.parent.dob_day, this.parent.dob_year);
      if (!date || !isValidDate(date)) return true;
      const maxAge = new Date();
      maxAge.setFullYear(maxAge.getFullYear() - 120);
      return date > maxAge;
    }),
  dob_day: yup.string()
    .nullable()
    .test("valid-date", "Invalid date", createValidDateTest("Invalid date of birth")),
  dob_year: yup.string()
    .nullable()
    .test("valid-date", "Invalid date", createValidDateTest("Invalid date of birth")),
  
  gender: yup.string().required("Required"),
  birth_country: yup.string().required("Required"),
  birth_city: yup.string().nullable(),

  us_visa_number: yup.string().when("nationality", {
    is: (val: string) => US_VISA_NATIONALITIES.includes(val),
    then: s => s.required("Required"),
    otherwise: s => s.notRequired().nullable()
  }),
  us_visa_number_confirm: yup.string().when("nationality", {
    is: (val: string) => US_VISA_NATIONALITIES.includes(val),
    then: s => s.required("Required").oneOf([yup.ref("us_visa_number")], "Must match"),
    otherwise: s => s.notRequired().nullable()
  }),
  
  // US Visa Expiry - must be in future
  us_visa_expiry_month: yup.string()
    .nullable()
    .when("nationality", {
      is: (val: string) => US_VISA_NATIONALITIES.includes(val),
      then: s => s
        .required("Required")
        .test("valid-date", "Invalid date", createValidDateTest("Invalid visa expiry date"))
        .test("future-date", "Visa expiry date must not be in the past", function(value: string | null | undefined) {
          const date = createDateFromParts(value, this.parent.us_visa_expiry_day, this.parent.us_visa_expiry_year);
          if (!date || !isValidDate(date)) return true;
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          date.setHours(0, 0, 0, 0);
          // Allow dates from today onwards
          return date >= today;
        }),
      otherwise: s => s.nullable()
    }),
  us_visa_expiry_day: yup.string()
    .nullable()
    .when("nationality", {
      is: (val: string) => US_VISA_NATIONALITIES.includes(val),
      then: s => s
        .required("Required")
        .test("valid-date", "Invalid date", createValidDateTest("Invalid visa expiry date")),
      otherwise: s => s.nullable()
    }),
  us_visa_expiry_year: yup.string()
    .nullable()
    .when("nationality", {
      is: (val: string) => US_VISA_NATIONALITIES.includes(val),
      then: s => s
        .required("Required")
        .test("valid-date", "Invalid date", createValidDateTest("Invalid visa expiry date")),
      otherwise: s => s.nullable()
    }),

  // Passport Issue Date - must be strictly in past (not today, not future), not more than 20 years ago
  passport_issue_month: yup.string()
    .nullable()
    .required("Required")
    .test("valid-date", "Invalid date", createValidDateTest("Invalid passport issue date"))
    .test("past-date", "Passport issue date must be in the past", function(value: string | null | undefined) {
      const date = createDateFromParts(value, this.parent.passport_issue_day, this.parent.passport_issue_year);
      if (!date || !isValidDate(date)) return true;
      // isDateInPast already ensures date is strictly before today (not today, not tomorrow)
      return isDateInPast(date);
    })
    .test("recent-enough", "Passport issue date seems too old", function(value: string | null | undefined) {
      const date = createDateFromParts(value, this.parent.passport_issue_day, this.parent.passport_issue_year);
      if (!date || !isValidDate(date)) return true;
      return isDateWithinPastYears(date, 20);
    }),
  passport_issue_day: yup.string()
    .nullable()
    .required("Required")
    .test("valid-date", "Invalid date", createValidDateTest("Invalid passport issue date")),
  passport_issue_year: yup.string()
    .nullable()
    .required("Required")
    .test("valid-date", "Invalid date", createValidDateTest("Invalid passport issue date")),
  
  // Passport Expiry - must be strictly in future (not today, not past) and after issue date
  passport_expiry_month: yup.string()
    .nullable()
    .required("Required")
    .test("valid-date", "Invalid date", createValidDateTest("Invalid passport expiry date"))
    .test("future-date", "Passport expiry date must be in the future", function(value: string | null | undefined) {
      const date = createDateFromParts(value, this.parent.passport_expiry_day, this.parent.passport_expiry_year);
      if (!date || !isValidDate(date)) return true;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      date.setHours(0, 0, 0, 0);
      // Must be strictly in the future (not today, not yesterday)
      return date > today;
    })
    .test("after-issue", "Passport expiry must be after issue date", function(value: string | null | undefined) {
      const issueDate = createDateFromParts(
        this.parent.passport_issue_month,
        this.parent.passport_issue_day,
        this.parent.passport_issue_year
      );
      const expiryDate = createDateFromParts(
        value,
        this.parent.passport_expiry_day,
        this.parent.passport_expiry_year
      );
      if (!issueDate || !expiryDate || !isValidDate(issueDate) || !isValidDate(expiryDate)) return true;
      return isDateBefore(issueDate, expiryDate);
    }),
  passport_expiry_day: yup.string()
    .nullable()
    .required("Required")
    .test("valid-date", "Invalid date", createValidDateTest("Invalid passport expiry date")),
  passport_expiry_year: yup.string()
    .nullable()
    .required("Required")
    .test("valid-date", "Invalid date", createValidDateTest("Invalid passport expiry date")),
});
