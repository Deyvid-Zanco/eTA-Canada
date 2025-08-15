import React from "react";
import Image from "next/image";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { US_VISA_NATIONALITIES, NATIONALITIES_LIST, COUNTRY_LIST } from "@/lib/constants";
import { UseFormRegister, UseFormWatch, FieldErrors } from "react-hook-form";
import { step1Schema } from "@/lib/schemas/step1Schema";
import { InferType } from 'yup';

type Step1FormData = InferType<typeof step1Schema>;

interface Step1Props {
  register: UseFormRegister<Step1FormData>;
  errors: FieldErrors<Step1FormData>;
  watch: UseFormWatch<Step1FormData>;
}

export function Step1({ register, errors, watch }: Step1Props) {
  const { t } = useLanguage();
  const nationality = watch('nationality') as string;
  const showTaiwanID = nationality === 'Taiwan (holders of passports containing a personal identification number)';
  const showUSVisaFields = US_VISA_NATIONALITIES.includes(nationality);
  const showMexicoVisaImage = nationality === 'Mexico';
  const showArgentinaVisaImage = showUSVisaFields && nationality !== 'Mexico';

  // Watch passport number fields for real-time validation
  const passportNumber = watch('passport_number') as string;
  const passportNumberConfirm = watch('passport_number_confirm') as string;
  const [passportMatchError, setPassportMatchError] = React.useState('');

  // Watch US visa number fields for real-time validation
  const usVisaNumber = watch('us_visa_number') as string;
  const usVisaNumberConfirm = watch('us_visa_number_confirm') as string;
  const [usVisaNumberConfirmError, setUsVisaNumberConfirmError] = React.useState('');

  // useEffect to check passport number match
  React.useEffect(() => {
    if (passportNumberConfirm && passportNumber !== passportNumberConfirm) {
      setPassportMatchError('Passport numbers do not match');
    } else {
      setPassportMatchError('');
    }
  }, [passportNumber, passportNumberConfirm]);

  // useEffect to check US visa number confirmation match
  React.useEffect(() => {
    if (usVisaNumberConfirm && showUSVisaFields) {
      if (usVisaNumber !== usVisaNumberConfirm) {
        setUsVisaNumberConfirmError('Visa numbers must match');
      } else {
        setUsVisaNumberConfirmError('');
      }
    } else {
      setUsVisaNumberConfirmError('');
    }
  }, [usVisaNumber, usVisaNumberConfirm, showUSVisaFields]);

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
      <h2 className="text-xl font-bold mb-4">Passport details of applicant</h2>
      
      {/* TRAVEL DOCUMENT */}
      <div className="mb-6 relative">
        <label className="block mb-1 font-medium">{t.formFields.travelDocument} <span className="text-red-600">*</span></label>
        <select {...register('travel_document')} className="w-full border rounded p-2 relative z-10" required>
          <option value="">{t.common.pleaseSelect}</option>
          <option value="Passport - ordinary/regular">{t.travelDocuments.passportOrdinary}</option>
          <option value="Passport - diplomatic">{t.travelDocuments.passportDiplomatic}</option>
          <option value="Passport - official">{t.travelDocuments.passportOfficial}</option>
          <option value="Passport - service">{t.travelDocuments.passportService}</option>
          <option value="Emergency/temporary travel document">{t.travelDocuments.emergencyTemporary}</option>
          <option value="Refugee travel document">{t.travelDocuments.refugeeTravel}</option>
          <option value="Alien passport/travel document issued for non-citizens">{t.travelDocuments.alienPassport}</option>
          <option value="Permit to re-enter the United States (I-327)">{t.travelDocuments.permitReenter}</option>
          <option value="U.S. Refugee travel document (I-571)">{t.travelDocuments.usRefugeeTravel}</option>
        </select>
        {errors.travel_document && <p className="text-red-600 text-sm">{t.common.required}</p>}
      </div>

      {/* WHAT IS THE NATIONALITY NOTED ON THIS PASSPORT? */}
      <div className="mb-6 relative">
        <label className="block mb-1 font-medium">{t.formFields.nationality} <span className="text-red-600">*</span></label>
        <select 
          {...register('nationality', { 
            required: true,
            onChange: (e: React.ChangeEvent<HTMLSelectElement>) => {
              console.log('Nationality selected:', e.target.value);
            }
          })} 
          className="w-full border rounded p-2 relative z-10" 
          required
          value={nationality || ''}
        >
          <option value="">{t.common.pleaseSelect}</option>
          {NATIONALITIES_LIST.map(country => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
        {errors.nationality && <p className="text-red-600 text-sm">{t.common.required}</p>}
      </div>

      {/* Taiwan National Identification Number (conditional) */}
      {showTaiwanID && (
        <div className="mb-6">
          <label className="block mb-1 font-medium">{t.formFields.taiwanId} <span className="text-red-600">*</span></label>
          <input type="text" {...(register as unknown as UseFormRegister<Record<string, unknown>>)('taiwan_id')} className="w-full border rounded p-2" required />
        </div>
      )}

      {/* US VISA NUMBER (conditional) */}
      {showUSVisaFields && (
        <>
          <div className="mb-2 text-sm text-gray-700">Enter your US visa number. The number is made up of just one letter and seven numbers. Found in the bottom right corner of the visa as in the example below.</div>
          <div className="mb-6">
            <label className="block mb-1 font-medium">{t.formFields.usVisaNumber} <span className="text-red-600">*</span></label>
            <input 
              type="text" 
              {...register('us_visa_number')} 
              className="w-full border rounded p-2"
              required={showUSVisaFields}
              placeholder="Enter visa number"
            />
            {errors.us_visa_number && <p className="text-red-600 text-sm">{(errors.us_visa_number as { message?: string })?.message || t.common.required}</p>}
          </div>
          <div className="mb-6">
            <label className="block mb-1 font-medium">{t.formFields.usVisaNumberConfirm} <span className="text-red-600">*</span></label>
            <input 
              type="text" 
              {...register('us_visa_number_confirm')} 
              className={`w-full border rounded p-2 ${usVisaNumberConfirmError ? 'border-red-500' : ''}`}
              required={showUSVisaFields}
              placeholder="Re-enter visa number"
            />
            {usVisaNumberConfirmError && <p className="text-red-600 text-sm">{usVisaNumberConfirmError}</p>}
            {errors.us_visa_number_confirm && !usVisaNumberConfirmError && <p className="text-red-600 text-sm">{(errors.us_visa_number_confirm as { message?: string })?.message || t.common.required}</p>}
          </div>
          <div className="mb-6">
            <label className="block mb-1 font-medium">{t.formFields.usVisaExpiryDate} <span className="text-red-600">*</span></label>
            <div className="flex gap-2">
              <select {...register('us_visa_expiry_month')} className="w-32 border rounded p-2" required>
                <option value="">{t.common.month}</option>
                {months.map((month, index) => <option key={month} value={monthNumbers[index]}>{month}</option>)}
              </select>
              <select {...register('us_visa_expiry_day')} className="w-16 border rounded p-2" required>
                <option value="">{t.common.day}</option>
                {days.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <select {...register('us_visa_expiry_year')} className="w-24 border rounded p-2" required>
                <option value="">{t.common.year}</option>
                {getYearOptions(currentYear, currentYear + 20).map(y => <option key={y} value={y}>{y}</option>)}
      </select>
            </div>
          </div>
          {/* Example image for US visa */}
          <div className="mb-6 flex justify-center">
            {showMexicoVisaImage && (
              <Image src="https://www.jotform.com/uploads/deyvidzancocontato/form_files/passaporte-mexico.66997689e89017.31889204.png" alt="US Visa Example - Mexico" width={320} height={200} className="max-w-xs rounded shadow" />
            )}
            {showArgentinaVisaImage && (
              <Image src="https://www.jotform.com/uploads/deyvidzancocontato/form_files/argentina.66996712cc7e16.63038575.jpg" alt="US Visa Example - Other" width={320} height={200} className="max-w-xs rounded shadow" />
            )}
          </div>
        </>
      )}

      {/* PASSPORT NUMBER */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">{t.formFields.passportNumber} <span className="text-red-600">*</span></label>
        <input type="text" {...register('passport_number')} className="w-full border rounded p-2" required />
        <span className="text-xs text-gray-500">Enter the passport number exactly as it appears on the passport information page.</span>
        {errors.passport_number && <p className="text-red-600 text-sm">{(errors.passport_number as { message?: string })?.message || t.common.required}</p>}
      </div>

      {/* PASSPORT NUMBER (RE-ENTER) */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">{t.formFields.passportNumberConfirm} <span className="text-red-600">*</span></label>
        <input type="text" {...register('passport_number_confirm')} className="w-full border rounded p-2" required />
        {passportMatchError ? (
          <p className="text-red-600 text-sm">{passportMatchError}</p>
        ) : (
          errors.passport_number_confirm && <p className="text-red-600 text-sm">{(errors.passport_number_confirm as { message?: string })?.message || t.common.required}</p>
        )}
      </div>

      {/* SURNAME(S) / LAST NAME(S) */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">{t.formFields.surname} <span className="text-red-600">*</span></label>
        <input type="text" {...register('surname')} className="w-full border rounded p-2" required />
        <span className="text-xs text-gray-500">Please enter exactly as shown on your passport or identity document.</span>
        {errors.surname && <p className="text-red-600 text-sm">{t.common.required}</p>}
      </div>

      {/* GIVEN NAME(S) / FIRST NAME(S) */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">{t.formFields.givenName} <span className="text-red-600">*</span></label>
        <input type="text" {...register('given_name')} className="w-full border rounded p-2" required />
        <span className="text-xs text-gray-500">Please enter exactly as shown on your passport or identity document.</span>
        {errors.given_name && <p className="text-red-600 text-sm">{t.common.required}</p>}
      </div>

      {/* DATE OF BIRTH */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">{t.formFields.dateOfBirth} <span className="text-red-600">*</span></label>
        <div className="flex gap-2">
          <select {...register('dob_month')} className="w-32 border rounded p-2" required>
            <option value="">{t.common.month}</option>
            {months.map((month, index) => <option key={month} value={monthNumbers[index]}>{month}</option>)}
          </select>
          <select {...register('dob_day')} className="w-16 border rounded p-2" required>
            <option value="">{t.common.day}</option>
            {days.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select {...register('dob_year')} className="w-24 border rounded p-2" required>
            <option value="">{t.common.year}</option>
            {getYearOptions(1900, currentYear).map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      {/* GENDER */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">{t.formFields.gender} <span className="text-red-600">*</span></label>
        <select {...register('gender')} className="w-full border rounded p-2" required>
          <option value="">{t.common.pleaseSelect}</option>
          <option value="Female">{t.formOptions.female}</option>
          <option value="Male">{t.formOptions.male}</option>
          <option value="Other">{t.formOptions.other}</option>
        </select>
        {errors.gender && <p className="text-red-600 text-sm">{t.common.required}</p>}
      </div>

      {/* COUNTRY/TERRITORY OF BIRTH */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">{t.formFields.birthCountry} <span className="text-red-600">*</span></label>
        <select {...register('birth_country')} className="w-full border rounded p-2" required>
          <option value="">{t.common.pleaseSelect}</option>
          {COUNTRY_LIST.map(country => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
        {errors.birth_country && <p className="text-red-600 text-sm">{t.common.required}</p>}
      </div>

      {/* CITY/TOWN OF BIRTH */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">{t.formFields.birthCity} <span className="text-red-600">*</span></label>
        <input type="text" {...register('birth_city')} className="w-full border rounded p-2" required />
        <span className="text-xs text-gray-500">If there is no city/town/village on your passport, enter the name of the city/town/village where you were born.</span>
        {errors.birth_city && <p className="text-red-600 text-sm">{t.common.required}</p>}
      </div>

      {/* DATE OF ISSUE OF PASSPORT */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">{t.formFields.passportIssueDate} <span className="text-red-600">*</span></label>
        <div className="flex gap-2">
          <select {...register('passport_issue_month')} className="w-32 border rounded p-2" required>
            <option value="">{t.common.month}</option>
            {months.map((month, index) => <option key={month} value={monthNumbers[index]}>{month}</option>)}
          </select>
          <select {...register('passport_issue_day')} className="w-16 border rounded p-2" required>
            <option value="">{t.common.day}</option>
            {days.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select {...register('passport_issue_year')} className="w-24 border rounded p-2" required>
            <option value="">{t.common.year}</option>
            {getYearOptions(currentYear - 20, currentYear).map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      {/* DATE OF EXPIRY OF PASSPORT */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">{t.formFields.passportExpiryDate} <span className="text-red-600">*</span></label>
        <div className="flex gap-2">
          <select {...register('passport_expiry_month')} className="w-32 border rounded p-2" required>
            <option value="">{t.common.month}</option>
            {months.map((month, index) => <option key={month} value={monthNumbers[index]}>{month}</option>)}
          </select>
          <select {...register('passport_expiry_day')} className="w-16 border rounded p-2" required>
            <option value="">{t.common.day}</option>
            {days.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select {...register('passport_expiry_year')} className="w-24 border rounded p-2" required>
            <option value="">{t.common.year}</option>
            {getYearOptions(currentYear, currentYear + 20).map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}
