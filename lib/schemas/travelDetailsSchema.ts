import * as yup from 'yup';
import { createDateFromParts, isDateInPast, isValidDate, isDateBefore, isDateBeforeOrEqual } from '@/lib/utils/dateValidation';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'];

const healthDeclarationSchema = {
  countriesVisited: yup.string().optional(),
  exposureHistory: yup.string().required('This field is required'),
  isSick: yup.string().required('This field is required'),
  
  // Symptoms (only required if isSick is YES)
  symptomAlteredMental: yup.boolean().optional(),
  symptomColds: yup.boolean().optional(),
  symptomCough: yup.boolean().optional(),
  symptomDiarrhea: yup.boolean().optional(),
  symptomBreathing: yup.boolean().optional(),
  symptomDizziness: yup.boolean().optional(),
  symptomFever: yup.boolean().optional(),
  symptomHeadache: yup.boolean().optional(),
  symptomAppetite: yup.boolean().optional(),
  symptomSmell: yup.boolean().optional(),
  symptomTaste: yup.boolean().optional(),
  symptomMusclePain: yup.boolean().optional(),
  symptomNausea: yup.boolean().optional(),
  symptomRashes: yup.boolean().optional(),
  symptomSoreThroat: yup.boolean().optional(),
};

const baggageDeclarationSchema = {
  hasBaggageTodeclare: yup.string().oneOf(['YES', 'NO'], 'Please select an option').required('This field is required'),
  baggageDeclarationConfirm: yup.boolean().oneOf([true], 'You must confirm you have read and understood the information').required('This field is required'),
};

const otherTravelDetailsSchema = {
  familyMembersBelow18: yup.number().min(0, 'Must be 0 or greater').required('This field is required'),
  familyMembers18AndAbove: yup.number().min(0, 'Must be 0 or greater').required('This field is required'),
  baggageCheckedIn: yup.number().min(0, 'Must be 0 or greater').required('This field is required'),
  baggageHandCarried: yup.number().min(0, 'Must be 0 or greater').required('This field is required'),
  firstTimeVisiting: yup.string().oneOf(['YES', 'NO'], 'Please select an option').required('This field is required'),
};

const customsGeneralDeclarationSchema = {
  // Total amount of goods purchased/acquired abroad - only required if user has baggage to declare
  goodsCurrency: yup.string().oneOf(['PHP', 'USD', ''], 'Please select currency').when('hasBaggageTodeclare', {
    is: 'YES',
    then: schema => schema.required('Currency selection is required'),
    otherwise: schema => schema.optional()
  }),
  goodsAmount: yup.number().min(0, 'Amount must be 0 or greater').when('hasBaggageTodeclare', {
    is: 'YES',
    then: schema => schema.required('Amount is required'),
    otherwise: schema => schema.optional()
  }),

  // Philippine Currency/Monetary Instrument in excess of PhP 50,000
  philippineCurrency: yup.string().nullable().when('hasBaggageTodeclare', {
    is: 'YES',
    then: schema => schema.required('This field is required').oneOf(['YES', 'NO'], 'Please select YES or NO'),
    otherwise: schema => schema.notRequired()
  }),
  
  // Foreign Currency/Monetary Instrument in excess of USD 10,000
  foreignCurrency: yup.string().nullable().when('hasBaggageTodeclare', {
    is: 'YES',
    then: schema => schema.required('This field is required').oneOf(['YES', 'NO'], 'Please select YES or NO'),
    otherwise: schema => schema.notRequired()
  }),
  
  // Gambling Paraphernalia
  gamblingParaphernalia: yup.string().nullable().when('hasBaggageTodeclare', {
    is: 'YES',
    then: schema => schema.required('This field is required').oneOf(['YES', 'NO'], 'Please select YES or NO'),
    otherwise: schema => schema.notRequired()
  }),
  
  // Cosmetics, skin care products, food supplements and medicines in excess
  cosmeticsExcess: yup.string().nullable().when('hasBaggageTodeclare', {
    is: 'YES',
    then: schema => schema.required('This field is required').oneOf(['YES', 'NO'], 'Please select YES or NO'),
    otherwise: schema => schema.notRequired()
  }),
  
  // Dangerous drugs
  dangerousDrugs: yup.string().nullable().when('hasBaggageTodeclare', {
    is: 'YES',
    then: schema => schema.required('This field is required').oneOf(['YES', 'NO'], 'Please select YES or NO'),
    otherwise: schema => schema.notRequired()
  }),
  
  // Firearms, ammunitions and explosives
  firearmsExplosives: yup.string().nullable().when('hasBaggageTodeclare', {
    is: 'YES',
    then: schema => schema.required('This field is required').oneOf(['YES', 'NO'], 'Please select YES or NO'),
    otherwise: schema => schema.notRequired()
  }),
  
  // Alcohol and/or tobacco products in commercial quantities
  alcoholTobacco: yup.string().nullable().when('hasBaggageTodeclare', {
    is: 'YES',
    then: schema => schema.required('This field is required').oneOf(['YES', 'NO'], 'Please select YES or NO'),
    otherwise: schema => schema.notRequired()
  }),
  
  // Foodstuff, fruits, vegetables, live animals, marine products, plants
  foodstuffAnimals: yup.string().nullable().when('hasBaggageTodeclare', {
    is: 'YES',
    then: schema => schema.required('This field is required').oneOf(['YES', 'NO'], 'Please select YES or NO'),
    otherwise: schema => schema.notRequired()
  }),
  
  // Mobile phones, radios and communication equipment in excess
  mobileRadioExcess: yup.string().nullable().when('hasBaggageTodeclare', {
    is: 'YES',
    then: schema => schema.required('This field is required').oneOf(['YES', 'NO'], 'Please select YES or NO'),
    otherwise: schema => schema.notRequired()
  }),
  
  // Cremains, human organs or tissues
  cremains: yup.string().nullable().when('hasBaggageTodeclare', {
    is: 'YES',
    then: schema => schema.required('This field is required').oneOf(['YES', 'NO'], 'Please select YES or NO'),
    otherwise: schema => schema.notRequired()
  }),
  
  // Jewelry, gold, precious metals or gems
  jewelry: yup.string().nullable().when('hasBaggageTodeclare', {
    is: 'YES',
    then: schema => schema.required('This field is required').oneOf(['YES', 'NO'], 'Please select YES or NO'),
    otherwise: schema => schema.notRequired()
  }),
  
  // Other goods not mentioned above
  otherGoods: yup.string().nullable().when('hasBaggageTodeclare', {
    is: 'YES',
    then: schema => schema.required('This field is required').oneOf(['YES', 'NO'], 'Please select YES or NO'),
    otherwise: schema => schema.notRequired()
  }),
  
  // Dynamic other goods items (array of objects)
  otherGoodsItems: yup.array().of(
    yup.object({
      quantity: yup.number().min(1, 'Quantity must be at least 1').required('Quantity is required'),
      description: yup.string().required('Description is required'),
      amountUSD: yup.number().min(0, 'Amount must be 0 or greater').required('Amount in USD is required'),
    })
  ).when('otherGoods', {
    is: 'YES',
    then: schema => schema.min(1, 'At least one item is required when "Yes" is selected'),
    otherwise: schema => schema.optional()
  })
};

const currencyDeclarationSchema = {
  // Not applicable option
  currencyNotApplicable: yup.boolean().optional(),
  
  // Owner details
  ownerBusinessName: yup.string().optional(),
  ownerFirstName: yup.string().when('currencyNotApplicable', {
    is: false,
    then: schema => schema.required('Owner first name is required'),
    otherwise: schema => schema.notRequired().nullable()
  }),
  ownerMiddleName: yup.string().optional(),
  ownerLastName: yup.string().when('currencyNotApplicable', {
    is: false,
    then: schema => schema.required('Owner last name is required'),
    otherwise: schema => schema.notRequired().nullable()
  }),
  ownerSuffix: yup.string().optional(),
  ownerOccupation: yup.string().when('currencyNotApplicable', {
    is: false,
    then: schema => schema.required('Owner occupation is required'),
    otherwise: schema => schema.notRequired().nullable()
  }),
  ownerCountry: yup.string().when('currencyNotApplicable', {
    is: false,
    then: schema => schema.required('Owner country is required'),
    otherwise: schema => schema.notRequired().nullable()
  }),
  ownerAddress: yup.string().when('currencyNotApplicable', {
    is: false,
    then: schema => schema.required('Owner address is required'),
    otherwise: schema => schema.notRequired().nullable()
  }),
  ownerPostalCode: yup.string().optional(),

  // Recipient details
  recipientBusinessName: yup.string().optional(),
  recipientFirstName: yup.string().when('currencyNotApplicable', {
    is: false,
    then: schema => schema.required('Recipient first name is required'),
    otherwise: schema => schema.notRequired().nullable()
  }),
  recipientMiddleName: yup.string().optional(),
  recipientLastName: yup.string().when('currencyNotApplicable', {
    is: false,
    then: schema => schema.required('Recipient last name is required'),
    otherwise: schema => schema.notRequired().nullable()
  }),
  recipientSuffix: yup.string().optional(),
  recipientOccupation: yup.string().when('currencyNotApplicable', {
    is: false,
    then: schema => schema.required('Recipient occupation is required'),
    otherwise: schema => schema.notRequired().nullable()
  }),
  recipientCountry: yup.string().when('currencyNotApplicable', {
    is: false,
    then: schema => schema.required('Recipient country is required'),
    otherwise: schema => schema.notRequired().nullable()
  }),
  recipientAddress: yup.string().when('currencyNotApplicable', {
    is: false,
    then: schema => schema.required('Recipient address is required'),
    otherwise: schema => schema.notRequired().nullable()
  }),
  recipientPostalCode: yup.string().optional(),

  // Currency information
  currencyItems: yup.array().of(
    yup.object({
      currency: yup.string().required('Currency is required'),
      monetaryInstrument: yup.string().required('Monetary instrument is required'),
    })
  ).when('currencyNotApplicable', {
    is: false,
    then: schema => schema.min(1, 'At least one currency item is required'),
    otherwise: schema => schema.notRequired().nullable()
  }),

  // BSP authorization date
  bspAuthorizationDay: yup.string().optional(),
  bspAuthorizationMonth: yup.string().optional(), 
  bspAuthorizationYear: yup.string().optional(),

  // Sources
  sourceSalary: yup.boolean().optional(),
  sourceBusiness: yup.boolean().optional(),
  sourceOther: yup.boolean().optional(),
  sourceOtherSpecify: yup.string().when('sourceOther', {
    is: true,
    then: schema => schema.required('Please specify other source'),
    otherwise: schema => schema.optional()
  }),

  // Purposes
  purposeLeisure: yup.boolean().optional(),
  purposeMedical: yup.boolean().optional(),
  purposePayables: yup.boolean().optional(),
  purposeEducation: yup.boolean().optional(),
  purposeOther: yup.boolean().optional(),
  purposeOtherSpecify: yup.string().when('purposeOther', {
    is: true,
    then: schema => schema.required('Please specify other purpose'),
    otherwise: schema => schema.optional()
  }),

  // Transfer method
  transferMethod: yup.string().when('currencyNotApplicable', {
    is: false,
    then: schema => schema.oneOf(['person', 'courier'], 'Please select transfer method').required('Transfer method is required'),
    otherwise: schema => schema.notRequired().nullable()
  })
};

const declarationAttachmentsSchema = {
  // Separate attachment uploads for each required form
  customsDeclarationAttachment: yup.mixed().required('Customs Declaration Form photo is required'),
  currencyDeclarationAttachment: yup.mixed().required('Currency Declaration Form photo is required'),
  
  // Digital signature
  digitalSignature: yup.string().required('Digital signature is required'),
  
  // Final certification
  finalCertification: yup.boolean().oneOf([true], 'You must certify the declaration').required('Final certification is required')
};

// --- MODIFIED: To allow base64 string, URLs, or FileList for picture ---
const pictureSchema = yup
  .mixed<FileList | string>() // Allow FileList, string (base64), or URLs
  .nullable()
  .test('required', 'A picture is required', function(value) {
    if (typeof value === 'string' && value.length > 0) return true; // If string (base64 or URL), check if not empty
    if (value && typeof value === 'object' && 'length' in value && value.length > 0) return true; // If FileList, check if it has files
    return false;
  })
  .test(
    'fileSize',
    'The file is too large (max 5MB)',
    function(value) {
      if (typeof value === 'string') return true; // File size check only for FileList
      if (value && typeof value === 'object' && 'length' in value && value.length > 0) {
        const file = (value as FileList)[0];
        return file && file.size <= MAX_FILE_SIZE;
      }
      return true;
    }
  )
  .test(
    'fileType',
    'Unsupported file format',
    function(value) {
      if (typeof value === 'string') return true; // File type check only for FileList
      if (value && typeof value === 'object' && 'length' in value && value.length > 0) {
        const file = (value as FileList)[0];
        return file && SUPPORTED_FORMATS.includes(file.type);
      }
      return true;
    }
  );


export const flightDetailsSchema = yup.object({
  // Personal Information
  picture: pictureSchema,
  passportType: yup.string().oneOf(['philippines', 'foreign'], 'Please select passport type').required('Passport type is required'),
  firstName: yup.string().required('First name is required'),
  middleName: yup.string().optional(),
  lastName: yup.string().required('Last name is required'),
  suffix: yup.string().optional(),
  sex: yup.string().oneOf(['Male', 'Female'], 'Please select sex').required('Sex is required'),
  birthMonth: yup.string().required('Birth month is required'),
  birthDay: yup.string().required('Birth day is required'),
  birthYear: yup.string().required('Birth year is required'),
  mobileCountryCode: yup.string().required('Country code is required'),
  mobileNumber: yup.string().required('Mobile number is required'),
  citizenship: yup.string().required('Citizenship is required'),
  countryOfBirth: yup.string().required('Country of birth is required'),
  passportNumber: yup.string().required('Passport number is required'),
  passportIssuingAuthority: yup.string().required('Passport issuing authority is required'),
  // Passport Issue Date - must be strictly in past (not today, not future)
  passportIssueMonth: yup.string()
    .required('Passport issue month is required')
    .test("past-date", "Passport issue date must be in the past", function(value: string | null | undefined) {
      const date = createDateFromParts(value, this.parent.passportIssueDay, this.parent.passportIssueYear);
      if (!date || !isValidDate(date)) return true;
      return isDateInPast(date);
    }),
  passportIssueDay: yup.string().required('Passport issue day is required'),
  passportIssueYear: yup.string().required('Passport issue year is required'),
  // Passport Expiry Date - must be strictly in future (not today, not past) and after issue date
  expiryMonth: yup.string()
    .required('Passport expiry month is required')
    .test("future-date", "Passport expiry date must be in the future", function(value: string | null | undefined) {
      const date = createDateFromParts(value, this.parent.expiryDay, this.parent.expiryYear);
      if (!date || !isValidDate(date)) return true;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      date.setHours(0, 0, 0, 0);
      return date > today;
    })
    .test("after-issue", "Passport expiry must be after issue date", function(value: string | null | undefined) {
      const issueDate = createDateFromParts(this.parent.passportIssueMonth, this.parent.passportIssueDay, this.parent.passportIssueYear);
      const expiryDate = createDateFromParts(value, this.parent.expiryDay, this.parent.expiryYear);
      if (!issueDate || !expiryDate || !isValidDate(issueDate) || !isValidDate(expiryDate)) return true;
      return isDateBefore(issueDate, expiryDate);
    }),
  expiryDay: yup.string().required('Passport expiry day is required'),
  expiryYear: yup.string().required('Passport expiry year is required'),
  occupation: yup.string().required('Occupation is required'),

  // Address Information
  permanentCountryOfResidence: yup.string().required('Permanent country of residence is required'),
  residenceCountry: yup.string().required('Country is required'),
  residenceAddress: yup.string().required('Address is required'),
  residenceAddressLine2: yup.string().optional(),

  // Travel Details
  purposeOfTravel: yup.string().required('Purpose of travel is required'),
  travellerType: yup.string().oneOf(['aircraft_passenger', 'flight_crew'], 'Please select traveller type').required('Traveller type is required'),

  // Flight Information
  airline: yup.string().required('Airline is required'),
  flightNumber: yup.string().required('Flight number is required'),
  countryOfOrigin: yup.string().required('Country of origin is required'),
  airportOfOrigin: yup.string().required('Airport of origin is required'),
  // Departure date - must be today or future (not past), up to 2 years
  departureMonth: yup.string()
    .nullable()
    .test("required", "Departure month is required", function(value: string | null | undefined) {
      const day = this.parent?.departureDay;
      const year = this.parent?.departureYear;
      const hasMonth = value && String(value).trim() !== '';
      const hasDay = day && String(day).trim() !== '';
      const hasYear = year && String(year).trim() !== '';
      
      // If all three are empty, allow empty state (but will be required on submit)
      if (!hasMonth && !hasDay && !hasYear) {
        return true;
      }
      // If any part is filled, ALL three must be filled
      // If this field is empty but others are filled, require it
      if (!hasMonth && (hasDay || hasYear)) {
        return false;
      }
      // If this field is filled but others are empty, require them
      if (hasMonth && (!hasDay || !hasYear)) {
        return false;
      }
      // All three are filled
      return true;
    })
    .test("not-past", "Departure date cannot be in the past", function(value: string | null | undefined) {
      // Check if current field is empty - if so, skip (let required handle it)
      if (!value || String(value).trim() === '') {
        return true;
      }
      // Check if other date parts exist - if not, skip (they'll be caught by their own required)
      const day = this.parent?.departureDay;
      const year = this.parent?.departureYear;
      if (!day || String(day).trim() === '' || !year || String(year).trim() === '') {
        return true;
      }
      const date = createDateFromParts(String(value), String(day), String(year));
      if (!date || !isValidDate(date)) return true;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      date.setHours(0, 0, 0, 0);
      return date >= today;
    })
    .test("not-too-future", "Departure date cannot be more than 2 years from now", function(value: string | null | undefined) {
      // Check if current field is empty - if so, skip (let required handle it)
      if (!value || String(value).trim() === '') {
        return true;
      }
      // Check if other date parts exist - if not, skip (they'll be caught by their own required)
      const day = this.parent?.departureDay;
      const year = this.parent?.departureYear;
      if (!day || String(day).trim() === '' || !year || String(year).trim() === '') {
        return true;
      }
      const date = createDateFromParts(String(value), String(day), String(year));
      if (!date || !isValidDate(date)) return true;
      const twoYearsFromNow = new Date();
      twoYearsFromNow.setFullYear(twoYearsFromNow.getFullYear() + 2);
      date.setHours(23, 59, 59, 999);
      twoYearsFromNow.setHours(23, 59, 59, 999);
      return date <= twoYearsFromNow;
    }),
  departureDay: yup.string()
    .nullable()
    .test("required", "Departure day is required", function(value: string | null | undefined) {
      const month = this.parent?.departureMonth;
      const year = this.parent?.departureYear;
      const hasMonth = month && String(month).trim() !== '';
      const hasDay = value && String(value).trim() !== '';
      const hasYear = year && String(year).trim() !== '';
      
      if (!hasMonth && !hasDay && !hasYear) {
        return true;
      }
      if (!hasDay && (hasMonth || hasYear)) {
        return false;
      }
      if (hasDay && (!hasMonth || !hasYear)) {
        return false;
      }
      return true;
    }),
  departureYear: yup.string()
    .nullable()
    .test("required", "Departure year is required", function(value: string | null | undefined) {
      const month = this.parent?.departureMonth;
      const day = this.parent?.departureDay;
      const hasMonth = month && String(month).trim() !== '';
      const hasDay = day && String(day).trim() !== '';
      const hasYear = value && String(value).trim() !== '';
      
      if (!hasMonth && !hasDay && !hasYear) {
        return true;
      }
      if (!hasYear && (hasMonth || hasDay)) {
        return false;
      }
      if (hasYear && (!hasMonth || !hasDay)) {
        return false;
      }
      return true;
    }),
  destination: yup.string().required('Destination is required'),
  airportOfDestination: yup.string().required('Airport of destination is required'),
  // Arrival date - must be today or future (not past), up to 2 years, and after departure
  arrivalMonth: yup.string()
    .nullable()
    .test("required", "Arrival month is required", function(value: string | null | undefined) {
      const day = this.parent?.arrivalDay;
      const year = this.parent?.arrivalYear;
      const hasMonth = value && String(value).trim() !== '';
      const hasDay = day && String(day).trim() !== '';
      const hasYear = year && String(year).trim() !== '';
      
      if (!hasMonth && !hasDay && !hasYear) {
        return true;
      }
      if (!hasMonth && (hasDay || hasYear)) {
        return false;
      }
      if (hasMonth && (!hasDay || !hasYear)) {
        return false;
      }
      return true;
    })
    .test("not-past", "Arrival date cannot be in the past", function(value: string | null | undefined) {
      // Check if current field is empty - if so, skip (let required handle it)
      if (!value || String(value).trim() === '') {
        return true;
      }
      // Check if other date parts exist - if not, skip (they'll be caught by their own required)
      const day = this.parent?.arrivalDay;
      const year = this.parent?.arrivalYear;
      if (!day || String(day).trim() === '' || !year || String(year).trim() === '') {
        return true;
      }
      const arrivalDate = createDateFromParts(String(value), String(day), String(year));
      if (!arrivalDate || !isValidDate(arrivalDate)) return true;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      arrivalDate.setHours(0, 0, 0, 0);
      return arrivalDate >= today;
    })
    .test("not-too-future", "Arrival date cannot be more than 2 years from now", function(value: string | null | undefined) {
      // Check if current field is empty - if so, skip (let required handle it)
      if (!value || String(value).trim() === '') {
        return true;
      }
      // Check if other date parts exist - if not, skip (they'll be caught by their own required)
      const day = this.parent?.arrivalDay;
      const year = this.parent?.arrivalYear;
      if (!day || String(day).trim() === '' || !year || String(year).trim() === '') {
        return true;
      }
      const arrivalDate = createDateFromParts(String(value), String(day), String(year));
      if (!arrivalDate || !isValidDate(arrivalDate)) return true;
      const twoYearsFromNow = new Date();
      twoYearsFromNow.setFullYear(twoYearsFromNow.getFullYear() + 2);
      arrivalDate.setHours(23, 59, 59, 999);
      twoYearsFromNow.setHours(23, 59, 59, 999);
      return arrivalDate <= twoYearsFromNow;
    })
    .test("after-departure", "Arrival date must be on or after departure date", function(value: string | null | undefined) {
      // Check if current field is empty - if so, skip (let required handle it)
      if (!value || String(value).trim() === '') {
        return true;
      }
      // Check if other arrival date parts exist
      const arrivalDay = this.parent?.arrivalDay;
      const arrivalYear = this.parent?.arrivalYear;
      if (!arrivalDay || String(arrivalDay).trim() === '' || !arrivalYear || String(arrivalYear).trim() === '') {
        return true;
      }
      // Check if departure date parts exist
      const departureMonth = this.parent?.departureMonth;
      const departureDay = this.parent?.departureDay;
      const departureYear = this.parent?.departureYear;
      if (!departureMonth || String(departureMonth).trim() === '' || !departureDay || String(departureDay).trim() === '' || !departureYear || String(departureYear).trim() === '') {
        return true; // Can't compare if departure date is incomplete
      }
      const departureDate = createDateFromParts(String(departureMonth), String(departureDay), String(departureYear));
      const arrivalDate = createDateFromParts(String(value), String(arrivalDay), String(arrivalYear));
      if (!departureDate || !arrivalDate || !isValidDate(departureDate) || !isValidDate(arrivalDate)) return true;
      return isDateBeforeOrEqual(departureDate, arrivalDate);
    }),
  arrivalDay: yup.string()
    .nullable()
    .test("required", "Arrival day is required", function(value: string | null | undefined) {
      const month = this.parent?.arrivalMonth;
      const year = this.parent?.arrivalYear;
      const hasMonth = month && String(month).trim() !== '';
      const hasDay = value && String(value).trim() !== '';
      const hasYear = year && String(year).trim() !== '';
      
      if (!hasMonth && !hasDay && !hasYear) {
        return true;
      }
      if (!hasDay && (hasMonth || hasYear)) {
        return false;
      }
      if (hasDay && (!hasMonth || !hasYear)) {
        return false;
      }
      return true;
    }),
  arrivalYear: yup.string()
    .nullable()
    .test("required", "Arrival year is required", function(value: string | null | undefined) {
      const month = this.parent?.arrivalMonth;
      const day = this.parent?.arrivalDay;
      const hasMonth = month && String(month).trim() !== '';
      const hasDay = day && String(day).trim() !== '';
      const hasYear = value && String(value).trim() !== '';
      
      if (!hasMonth && !hasDay && !hasYear) {
        return true;
      }
      if (!hasYear && (hasMonth || hasDay)) {
        return false;
      }
      if (hasYear && (!hasMonth || !hasDay)) {
        return false;
      }
      return true;
    }),

  // Destination Details
  destinationType: yup.string().oneOf(['residence', 'hotel_resort', 'transit_airport'], 'Please select destination type').required('Destination type is required'),
  destinationAddress: yup.string().when('destinationType', {
    is: (val: string) => val === 'residence' || val === 'hotel_resort',
    then: schema => schema.required('Destination address is required'),
    otherwise: schema => schema.optional()
  }),

  ...healthDeclarationSchema,
  ...baggageDeclarationSchema,
  ...otherTravelDetailsSchema,
  ...customsGeneralDeclarationSchema,
  ...currencyDeclarationSchema,
  ...declarationAttachmentsSchema,
});

export const cruiseDetailsSchema = yup.object({
  // Personal Information (same as flight)
  picture: pictureSchema,
  passportType: yup.string().oneOf(['philippines', 'foreign'], 'Please select passport type').required('Passport type is required'),
  firstName: yup.string().required('First name is required'),
  middleName: yup.string().optional(),
  lastName: yup.string().required('Last name is required'),
  suffix: yup.string().optional(),
  sex: yup.string().oneOf(['Male', 'Female'], 'Please select sex').required('Sex is required'),
  birthMonth: yup.string().required('Birth month is required'),
  birthDay: yup.string().required('Birth day is required'),
  birthYear: yup.string().required('Birth year is required'),
  mobileCountryCode: yup.string().required('Country code is required'),
  mobileNumber: yup.string().required('Mobile number is required'),
  citizenship: yup.string().required('Citizenship is required'),
  countryOfBirth: yup.string().required('Country of birth is required'),
  passportNumber: yup.string().required('Passport number is required'),
  passportIssuingAuthority: yup.string().required('Passport issuing authority is required'),
  // Passport Issue Date - must be strictly in past (not today, not future)
  passportIssueMonth: yup.string()
    .required('Passport issue month is required')
    .test("past-date", "Passport issue date must be in the past", function(value: string | null | undefined) {
      const date = createDateFromParts(value, this.parent.passportIssueDay, this.parent.passportIssueYear);
      if (!date || !isValidDate(date)) return true;
      return isDateInPast(date);
    }),
  passportIssueDay: yup.string().required('Passport issue day is required'),
  passportIssueYear: yup.string().required('Passport issue year is required'),
  // Passport Expiry Date - must be strictly in future (not today, not past) and after issue date
  expiryMonth: yup.string()
    .required('Passport expiry month is required')
    .test("future-date", "Passport expiry date must be in the future", function(value: string | null | undefined) {
      const date = createDateFromParts(value, this.parent.expiryDay, this.parent.expiryYear);
      if (!date || !isValidDate(date)) return true;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      date.setHours(0, 0, 0, 0);
      return date > today;
    })
    .test("after-issue", "Passport expiry must be after issue date", function(value: string | null | undefined) {
      const issueDate = createDateFromParts(this.parent.passportIssueMonth, this.parent.passportIssueDay, this.parent.passportIssueYear);
      const expiryDate = createDateFromParts(value, this.parent.expiryDay, this.parent.expiryYear);
      if (!issueDate || !expiryDate || !isValidDate(issueDate) || !isValidDate(expiryDate)) return true;
      return isDateBefore(issueDate, expiryDate);
    }),
  expiryDay: yup.string().required('Passport expiry day is required'),
  expiryYear: yup.string().required('Passport expiry year is required'),
  occupation: yup.string().required('Occupation is required'),

  // Address Information (same as flight)
  permanentCountryOfResidence: yup.string().required('Permanent country of residence is required'),
  residenceCountry: yup.string().required('Country is required'),
  residenceAddress: yup.string().required('Address is required'),
  residenceAddressLine2: yup.string().optional(),

  // Travel Details (same purpose, different traveller types)
  purposeOfTravel: yup.string().required('Purpose of travel is required'),
  travellerType: yup.string().oneOf(['cruise_passenger', 'cruise_crew', 'private_vessel'], 'Please select traveller type').required('Traveller type is required'),

  // Voyage Information (cruise-specific)
  vesselName: yup.string().required('Vessel name is required'),
  origin: yup.string().required('Origin is required'),
  seaportOfOrigin: yup.string().required('Seaport of origin is required'),
  // Departure date - must be today or future (not past), up to 2 years
  departureMonth: yup.string()
    .nullable()
    .test("required", "Departure month is required", function(value: string | null | undefined) {
      const day = this.parent?.departureDay;
      const year = this.parent?.departureYear;
      const hasMonth = value && String(value).trim() !== '';
      const hasDay = day && String(day).trim() !== '';
      const hasYear = year && String(year).trim() !== '';
      
      if (!hasMonth && !hasDay && !hasYear) {
        return true;
      }
      if (!hasMonth && (hasDay || hasYear)) {
        return false;
      }
      if (hasMonth && (!hasDay || !hasYear)) {
        return false;
      }
      return true;
    })
    .test("not-past", "Departure date cannot be in the past", function(value: string | null | undefined) {
      // Check if current field is empty - if so, skip (let required handle it)
      if (!value || String(value).trim() === '') {
        return true;
      }
      // Check if other date parts exist - if not, skip (they'll be caught by their own required)
      const day = this.parent?.departureDay;
      const year = this.parent?.departureYear;
      if (!day || String(day).trim() === '' || !year || String(year).trim() === '') {
        return true;
      }
      const date = createDateFromParts(String(value), String(day), String(year));
      if (!date || !isValidDate(date)) return true;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      date.setHours(0, 0, 0, 0);
      return date >= today;
    })
    .test("not-too-future", "Departure date cannot be more than 2 years from now", function(value: string | null | undefined) {
      // Check if current field is empty - if so, skip (let required handle it)
      if (!value || String(value).trim() === '') {
        return true;
      }
      // Check if other date parts exist - if not, skip (they'll be caught by their own required)
      const day = this.parent?.departureDay;
      const year = this.parent?.departureYear;
      if (!day || String(day).trim() === '' || !year || String(year).trim() === '') {
        return true;
      }
      const date = createDateFromParts(String(value), String(day), String(year));
      if (!date || !isValidDate(date)) return true;
      const twoYearsFromNow = new Date();
      twoYearsFromNow.setFullYear(twoYearsFromNow.getFullYear() + 2);
      date.setHours(23, 59, 59, 999);
      twoYearsFromNow.setHours(23, 59, 59, 999);
      return date <= twoYearsFromNow;
    }),
  departureDay: yup.string()
    .nullable()
    .test("required", "Departure day is required", function(value: string | null | undefined) {
      const month = this.parent?.departureMonth;
      const year = this.parent?.departureYear;
      const hasMonth = month && String(month).trim() !== '';
      const hasDay = value && String(value).trim() !== '';
      const hasYear = year && String(year).trim() !== '';
      
      if (!hasMonth && !hasDay && !hasYear) {
        return true;
      }
      if (!hasDay && (hasMonth || hasYear)) {
        return false;
      }
      if (hasDay && (!hasMonth || !hasYear)) {
        return false;
      }
      return true;
    }),
  departureYear: yup.string()
    .nullable()
    .test("required", "Departure year is required", function(value: string | null | undefined) {
      const month = this.parent?.departureMonth;
      const day = this.parent?.departureDay;
      const hasMonth = month && String(month).trim() !== '';
      const hasDay = day && String(day).trim() !== '';
      const hasYear = value && String(value).trim() !== '';
      
      if (!hasMonth && !hasDay && !hasYear) {
        return true;
      }
      if (!hasYear && (hasMonth || hasDay)) {
        return false;
      }
      if (hasYear && (!hasMonth || !hasDay)) {
        return false;
      }
      return true;
    }),
  destination: yup.string().required('Destination is required'),
  seaportOfDestination: yup.string().required('Seaport of destination is required'),
  // Arrival date - must be today or future (not past), up to 2 years, and after departure
  arrivalMonth: yup.string()
    .nullable()
    .test("required", "Arrival month is required", function(value: string | null | undefined) {
      const day = this.parent?.arrivalDay;
      const year = this.parent?.arrivalYear;
      const hasMonth = value && String(value).trim() !== '';
      const hasDay = day && String(day).trim() !== '';
      const hasYear = year && String(year).trim() !== '';
      
      if (!hasMonth && !hasDay && !hasYear) {
        return true;
      }
      if (!hasMonth && (hasDay || hasYear)) {
        return false;
      }
      if (hasMonth && (!hasDay || !hasYear)) {
        return false;
      }
      return true;
    })
    .test("not-past", "Arrival date cannot be in the past", function(value: string | null | undefined) {
      // Check if current field is empty - if so, skip (let required handle it)
      if (!value || String(value).trim() === '') {
        return true;
      }
      // Check if other date parts exist - if not, skip (they'll be caught by their own required)
      const day = this.parent?.arrivalDay;
      const year = this.parent?.arrivalYear;
      if (!day || String(day).trim() === '' || !year || String(year).trim() === '') {
        return true;
      }
      const arrivalDate = createDateFromParts(String(value), String(day), String(year));
      if (!arrivalDate || !isValidDate(arrivalDate)) return true;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      arrivalDate.setHours(0, 0, 0, 0);
      return arrivalDate >= today;
    })
    .test("not-too-future", "Arrival date cannot be more than 2 years from now", function(value: string | null | undefined) {
      // Check if current field is empty - if so, skip (let required handle it)
      if (!value || String(value).trim() === '') {
        return true;
      }
      // Check if other date parts exist - if not, skip (they'll be caught by their own required)
      const day = this.parent?.arrivalDay;
      const year = this.parent?.arrivalYear;
      if (!day || String(day).trim() === '' || !year || String(year).trim() === '') {
        return true;
      }
      const arrivalDate = createDateFromParts(String(value), String(day), String(year));
      if (!arrivalDate || !isValidDate(arrivalDate)) return true;
      const twoYearsFromNow = new Date();
      twoYearsFromNow.setFullYear(twoYearsFromNow.getFullYear() + 2);
      arrivalDate.setHours(23, 59, 59, 999);
      twoYearsFromNow.setHours(23, 59, 59, 999);
      return arrivalDate <= twoYearsFromNow;
    })
    .test("after-departure", "Arrival date must be on or after departure date", function(value: string | null | undefined) {
      // Check if current field is empty - if so, skip (let required handle it)
      if (!value || String(value).trim() === '') {
        return true;
      }
      // Check if other arrival date parts exist
      const arrivalDay = this.parent?.arrivalDay;
      const arrivalYear = this.parent?.arrivalYear;
      if (!arrivalDay || String(arrivalDay).trim() === '' || !arrivalYear || String(arrivalYear).trim() === '') {
        return true;
      }
      // Check if departure date parts exist
      const departureMonth = this.parent?.departureMonth;
      const departureDay = this.parent?.departureDay;
      const departureYear = this.parent?.departureYear;
      if (!departureMonth || String(departureMonth).trim() === '' || !departureDay || String(departureDay).trim() === '' || !departureYear || String(departureYear).trim() === '') {
        return true; // Can't compare if departure date is incomplete
      }
      const departureDate = createDateFromParts(String(departureMonth), String(departureDay), String(departureYear));
      const arrivalDate = createDateFromParts(String(value), String(arrivalDay), String(arrivalYear));
      if (!departureDate || !arrivalDate || !isValidDate(departureDate) || !isValidDate(arrivalDate)) return true;
      return isDateBeforeOrEqual(departureDate, arrivalDate);
    }),
  arrivalDay: yup.string()
    .nullable()
    .test("required", "Arrival day is required", function(value: string | null | undefined) {
      const month = this.parent?.arrivalMonth;
      const year = this.parent?.arrivalYear;
      const hasMonth = month && String(month).trim() !== '';
      const hasDay = value && String(value).trim() !== '';
      const hasYear = year && String(year).trim() !== '';
      
      if (!hasMonth && !hasDay && !hasYear) {
        return true;
      }
      if (!hasDay && (hasMonth || hasYear)) {
        return false;
      }
      if (hasDay && (!hasMonth || !hasYear)) {
        return false;
      }
      return true;
    }),
  arrivalYear: yup.string()
    .nullable()
    .test("required", "Arrival year is required", function(value: string | null | undefined) {
      const month = this.parent?.arrivalMonth;
      const day = this.parent?.arrivalDay;
      const hasMonth = month && String(month).trim() !== '';
      const hasDay = day && String(day).trim() !== '';
      const hasYear = value && String(value).trim() !== '';
      
      if (!hasMonth && !hasDay && !hasYear) {
        return true;
      }
      if (!hasYear && (hasMonth || hasDay)) {
        return false;
      }
      if (hasYear && (!hasMonth || !hasDay)) {
        return false;
      }
      return true;
    }),

  // Destination Details (same as flight)
  destinationType: yup.string().oneOf(['residence', 'hotel_resort', 'transit_airport'], 'Please select destination type').required('Destination type is required'),
  destinationAddress: yup.string().when('destinationType', {
    is: (val: string) => val === 'residence' || val === 'hotel_resort',
    then: schema => schema.required('Destination address is required'),
    otherwise: schema => schema.optional()
  }),

  ...healthDeclarationSchema,
  ...baggageDeclarationSchema,
  ...otherTravelDetailsSchema,
  ...customsGeneralDeclarationSchema,
  ...currencyDeclarationSchema,
  ...declarationAttachmentsSchema,
});