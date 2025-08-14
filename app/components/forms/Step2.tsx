import React from "react";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { COUNTRY_LIST } from "@/lib/constants";
import { UseFormRegister, UseFormWatch, FieldErrors } from "react-hook-form";
import { step2Schema } from "@/lib/schemas/step2Schema";
import { InferType } from 'yup';

type Step2FormData = InferType<typeof step2Schema>;

interface Step2Props {
  register: UseFormRegister<Step2FormData>;
  errors: FieldErrors<Step2FormData>;
  watch: UseFormWatch<Step2FormData>;
}

export function Step2({ register, errors, watch }: Step2Props) {
  const { t } = useLanguage();
  const occupation = watch('occupation') as string;
  const canadaVisaApplied = watch('canada_visa_applied') as string;
  const hideJobFields = ['Unemployed', 'Homemaker', 'Retired', 'Military/armed forces'].includes(occupation);

  // Create months array using translation keys
  const months = [
    t.common.january,
    t.common.february,
    t.common.march,
    t.common.april,
    t.common.may,
    t.common.june,
    t.common.july,
    t.common.august,
    t.common.september,
    t.common.october,
    t.common.november,
    t.common.december,
  ];

  const currentYear = new Date().getFullYear();
  const monthNumbers = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));

  function getYearOptions(start: number, end: number) {
    const years = [];
    for (let y = start; y <= end; y++) years.push(y);
    return years;
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Additional Information</h2>
      
      {/* ARE YOU A CITIZEN OF ANY ADDITIONAL NATIONALITIES? */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">{t.formFields.additionalNationality} <span className="text-red-600">*</span></label>
        <div className="flex gap-6">
          <label className="inline-flex items-center gap-2">
            <input type="radio" value="No" {...register('additional_nationality')} required /> {t.formOptions.no}
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="radio" value="Yes" {...register('additional_nationality')} required /> {t.formOptions.yes}
          </label>
        </div>
        {errors.additional_nationality && <p className="text-red-600 text-sm">{t.common.required}</p>}
      </div>

      {/* INDICATE WHICH COUNTRIES/TERRITORIES YOU ARE CITIZEN OF: (conditional) */}
      {watch('additional_nationality') === 'Yes' && (
        <div className="mb-6">
          <label className="block mb-1 font-medium">{t.formFields.additionalNationalityDetails} <span className="text-red-600">*</span></label>
          <input type="text" {...register('additional_nationality_details')} className="w-full border rounded p-2" required />
          {errors.additional_nationality_details && <p className="text-red-600 text-sm">{t.common.required}</p>}
        </div>
      )}

      {/* Marital status */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">{t.formFields.maritalStatus} <span className="text-red-600">*</span></label>
        <select {...register('marital_status')} className="w-full border rounded p-2" required>
          <option value="">{t.common.pleaseSelect}</option>
          <option value="Married">{t.formOptions.married}</option>
          <option value="Legally Separated">{t.formOptions.legallySeparated}</option>
          <option value="Divorced">{t.formOptions.divorced}</option>
          <option value="Annulled Marriage">{t.formOptions.annulledMarriage}</option>
          <option value="Widowed">{t.formOptions.widowed}</option>
          <option value="Common-Law">{t.formOptions.commonLaw}</option>
          <option value="Never Married/Single">{t.formOptions.neverMarried}</option>
        </select>
        {errors.marital_status && <p className="text-red-600 text-sm">{t.common.required}</p>}
      </div>

      {/* HAVE YOU EVER APPLIED FOR OR OBTAINED A VISA, AN ETA OR A PERMIT TO VISIT, LIVE, WORK OR STUDY IN CANADA? */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">{t.formFields.canadaVisaApplied} <span className="text-red-600">*</span></label>
        <div className="flex gap-6">
          <label className="inline-flex items-center gap-2">
            <input type="radio" value="No" {...register('canada_visa_applied')} required /> {t.formOptions.no}
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="radio" value="Yes" {...register('canada_visa_applied')} required /> {t.formOptions.yes}
          </label>
        </div>
        {errors.canada_visa_applied && <p className="text-red-600 text-sm">{t.common.required}</p>}
        {canadaVisaApplied === 'Yes' && (
          <div className="mt-4">
            <label className="block mb-1 font-medium">{t.formFields.previousVisaNumber} <span className="text-red-600">*</span></label>
            <input type="text" {...register('previous_visa_number')} className="w-full border rounded p-2" required />
            {errors.previous_visa_number && <p className="text-red-600 text-sm">{(errors.previous_visa_number as { message?: string })?.message || t.common.required}</p>}
          </div>
        )}
      </div>

      {/* Occupation */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">{t.formFields.occupation} <span className="text-red-600">*</span></label>
        <select {...register('occupation')} className="w-full border rounded p-2" required>
          <option value="">{t.common.pleaseSelect}</option>
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
        {errors.occupation && <p className="text-red-600 text-sm">{(errors.occupation as { message?: string })?.message || t.common.required}</p>}
      </div>

      {/* Describe a bit more about your job */}
      {!hideJobFields && (
        <div className="mb-6">
          <label className="block mb-1 font-medium">{t.formFields.jobDescription} <span className="text-red-600">*</span></label>
          <input type="text" {...register('job_description')} className="w-full border rounded p-2" required />
          {errors.job_description && <p className="text-red-600 text-sm">{(errors.job_description as { message?: string })?.message || t.common.required}</p>}
        </div>
      )}

      {/* Name of employer or school, as appropriate */}
      {!hideJobFields && (
        <div className="mb-6">
          <label className="block mb-1 font-medium">{t.formFields.employerName} <span className="text-red-600">*</span></label>
          <input type="text" {...register('employer_name')} className="w-full border rounded p-2" required />
          {errors.employer_name && <p className="text-red-600 text-sm">{(errors.employer_name as { message?: string })?.message || t.common.required}</p>}
        </div>
      )}

      {/* Since when do you work at this location? (YYYY) */}
      {!hideJobFields && (
        <div className="mb-6">
          <label className="block mb-1 font-medium">{t.formFields.employmentStartDate} <span className="text-red-600">*</span></label>
          <input type="text" {...(register as unknown as UseFormRegister<Record<string, unknown>>)('employment_start_date')} className="w-full border rounded p-2" placeholder="YYYY" required />
          {(errors as unknown as FieldErrors<Record<string, unknown>>).employment_start_date && <p className="text-red-600 text-sm">{(errors as unknown as FieldErrors<Record<string, unknown>>).employment_start_date?.message || t.common.required}</p>}
          </div>
      )}

      {/* COUNTRY/TERRITORY */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">{t.formFields.employmentCountry} <span className="text-red-600">*</span></label>
        <select {...register('employment_country')} className="w-full border rounded p-2" required>
          <option value="">{t.common.pleaseSelect}</option>
          {COUNTRY_LIST.map(country => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
        {errors.employment_country && <p className="text-red-600 text-sm">{(errors.employment_country as { message?: string })?.message || t.common.required}</p>}
      </div>

      {/* Apartment number */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">{t.formFields.apartmentNumber}</label>
        <input type="text" {...register('apartment_number')} className="w-full border rounded p-2" />
      </div>

      {/* Street number */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">{t.formFields.streetNumber} <span className="text-red-600">*</span></label>
        <input type="text" {...register('street_number')} className="w-full border rounded p-2" required />
        {errors.street_number && <p className="text-red-600 text-sm">{(errors.street_number as { message?: string })?.message || t.common.required}</p>}
      </div>

      {/* Street name */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">{t.formFields.streetName} <span className="text-red-600">*</span></label>
        <input type="text" {...register('street_name')} className="w-full border rounded p-2" required />
        {errors.street_name && <p className="text-red-600 text-sm">{(errors.street_name as { message?: string })?.message || t.common.required}</p>}
      </div>

      {/* City/town */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">{t.formFields.cityTown} <span className="text-red-600">*</span></label>
        <input type="text" {...register('city_town')} className="w-full border rounded p-2" required />
        {errors.city_town && <p className="text-red-600 text-sm">{(errors.city_town as { message?: string })?.message || t.common.required}</p>}
      </div>

      {/* District/region */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">{t.formFields.districtRegion}</label>
        <input type="text" {...register('district_region')} className="w-full border rounded p-2" />
      </div>

      {/* ZIP Code */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">{t.formFields.zipCode} <span className="text-red-600">*</span></label>
        <input type="text" {...register('zip_code')} className="w-full border rounded p-2" required />
        {errors.zip_code && <p className="text-red-600 text-sm">{(errors.zip_code as { message?: string })?.message || t.common.required}</p>}
      </div>

      {/* Country/territory */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">{t.formFields.addressCountry} <span className="text-red-600">*</span></label>
        <select {...register('address_country')} className="w-full border rounded p-2" required>
          <option value="">{t.common.pleaseSelect}</option>
          {COUNTRY_LIST.map(country => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
        {errors.address_country && <p className="text-red-600 text-sm">{(errors.address_country as { message?: string })?.message || t.common.required}</p>}
      </div>

      {/* Email */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">{t.formFields.email} <span className="text-red-600">*</span></label>
        <input type="email" {...register('email')} className="w-full border rounded p-2" required />
        {errors.email && <p className="text-red-600 text-sm">{(errors.email as { message?: string })?.message || t.common.required}</p>}
      </div>

      {/* Email confirm */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">{t.formFields.emailConfirm} <span className="text-red-600">*</span></label>
        <input type="email" {...register('email_confirm')} className="w-full border rounded p-2" required />
        {errors.email_confirm && <p className="text-red-600 text-sm">{(errors.email_confirm as { message?: string })?.message || t.common.required}</p>}
      </div>

      {/* Phone */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">{t.formFields.phone} <span className="text-red-600">*</span></label>
        <input type="text" {...register('phone')} className="w-full border rounded p-2" required />
        {errors.phone && <p className="text-red-600 text-sm">{(errors.phone as { message?: string })?.message || t.common.required}</p>}
      </div>

      {/* Alternative phone */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">{t.formFields.altPhone}</label>
        <input type="text" {...register('alt_phone')} className="w-full border rounded p-2" />
      </div>

      {/* Preferred language */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">{t.formFields.preferredLanguage} <span className="text-red-600">*</span></label>
        <select {...register('preferred_language')} className="w-full border rounded p-2" required>
          <option value="">{t.common.pleaseSelect}</option>
          <option value="English">{t.formOptions.english}</option>
          <option value="French">{t.formOptions.french}</option>
        </select>
        {errors.preferred_language && <p className="text-red-600 text-sm">{(errors.preferred_language as { message?: string })?.message || t.common.required}</p>}
      </div>

      {/* Do you know when you will travel? */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">{t.formFields.doYouKnowTravelDate} <span className="text-red-600">*</span></label>
        <div className="flex gap-6">
          <label className="inline-flex items-center gap-2">
            <input type="radio" value="No" {...register('do_you_know_travel_date')} required /> {t.formOptions.no}
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="radio" value="Yes" {...register('do_you_know_travel_date')} required /> {t.formOptions.yes}
          </label>
        </div>
        {errors.do_you_know_travel_date && <p className="text-red-600 text-sm">{(errors.do_you_know_travel_date as { message?: string })?.message || t.common.required}</p>}
      </div>

      {/* If Yes, show date pickers */}
      {watch('do_you_know_travel_date') === 'Yes' && (
        <div className="mb-6">
          <label className="block mb-1 font-medium">{t.formFields.travelDate} <span className="text-red-600">*</span></label>
          <div className="flex gap-2">
            <select {...register('travel_date_month')} className="w-32 border rounded p-2" required>
              <option value="">{t.common.month}</option>
              {months.map((month, index) => <option key={month} value={monthNumbers[index]}>{month}</option>)}
            </select>
            <select {...register('travel_date_day')} className="w-16 border rounded p-2" required>
              <option value="">{t.common.day}</option>
              {days.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <select {...register('travel_date_year')} className="w-24 border rounded p-2" required>
              <option value="">{t.common.year}</option>
              {getYearOptions(currentYear, currentYear + 2).map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          {(errors.travel_date_month || errors.travel_date_day || errors.travel_date_year) && (
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
          <span>{t.formFields.consentDeclaration}</span>
        </label>
        {errors.consent_declaration && <p className="text-red-600 text-sm">{(errors.consent_declaration as { message?: string })?.message || t.common.required}</p>}
      </div>
    </div>
  );
}
