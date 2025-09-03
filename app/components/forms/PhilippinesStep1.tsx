import React from "react";
import { COUNTRY_LIST } from "@/lib/constants";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { InferType } from "yup";
import { philippinesStep1Schema } from "@/lib/schemas/philippinesStep1Schema";

type PhilippinesStep1FormData = InferType<typeof philippinesStep1Schema>;

interface PhilippinesStep1Props {
  register: UseFormRegister<PhilippinesStep1FormData>;
  errors: FieldErrors<PhilippinesStep1FormData>;
}

export function PhilippinesStep1({ register, errors }: PhilippinesStep1Props) {
  const currentYear = new Date().getFullYear();
  const monthNumbers = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  function getYearOptions(start: number, end: number) {
    const years = [];
    for (let y = start; y <= end; y++) years.push(y);
    return years;
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Personal Details</h2>
      
      {/* Surname */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">Surname <span className="text-red-600">*</span></label>
        <input 
          type="text" 
          {...register('surname')} 
          className="w-full border rounded p-2" 
          required 
          placeholder="Enter your Surname exactly as shown in your passport"
        />
        <span className="text-xs text-gray-500">Enter your Surname exactly as shown in your passport.</span>
        {errors.surname && <p className="text-red-600 text-sm">This field is required</p>}
      </div>

      {/* Given Name(s) */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">Given Name(s) <span className="text-red-600">*</span></label>
        <input 
          type="text" 
          {...register('given_name')} 
          className="w-full border rounded p-2" 
          required 
          placeholder="Enter your Given Name(s) as shown in your passport"
        />
        <span className="text-xs text-gray-500">Enter your Given Name(s) as shown in your passport.</span>
        {errors.given_name && <p className="text-red-600 text-sm">This field is required</p>}
      </div>

      {/* Middle Name */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">Middle Name</label>
        <input 
          type="text" 
          {...register('middle_name')} 
          className="w-full border rounded p-2" 
          placeholder="Enter your Middle Name as shown in your passport"
        />
        <span className="text-xs text-gray-500">Enter your Middle Name as shown in your passport. If you do not have a middle name, you can leave this field blank.</span>
      </div>

      {/* Gender */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">Gender <span className="text-red-600">*</span></label>
        <div className="flex gap-6">
          <label className="inline-flex items-center gap-2">
            <input type="radio" value="Male" {...register('gender')} required /> Male
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="radio" value="Female" {...register('gender')} required /> Female
          </label>
        </div>
        {errors.gender && <p className="text-red-600 text-sm">This field is required</p>}
      </div>

      {/* Date of Birth */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">Date of Birth <span className="text-red-600">*</span></label>
        <div className="flex gap-2">
          <select {...register('dob_day')} className="w-16 border rounded p-2" required>
            <option value="">Day</option>
            {days.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select {...register('dob_month')} className="w-32 border rounded p-2" required>
            <option value="">Month</option>
            {months.map((month, index) => <option key={month} value={monthNumbers[index]}>{month}</option>)}
          </select>
          <select {...register('dob_year')} className="w-24 border rounded p-2" required>
            <option value="">Year</option>
            {getYearOptions(1900, currentYear).map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        {errors.dob_day && <p className="text-red-600 text-sm">This field is required</p>}
      </div>

      {/* Country of Citizenship */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">Country of Citizenship <span className="text-red-600">*</span></label>
        <select {...register('citizenship')} className="w-full border rounded p-2" required>
          <option value="">Please select</option>
          {COUNTRY_LIST.map(country => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
        {errors.citizenship && <p className="text-red-600 text-sm">This field is required</p>}
      </div>

      <h2 className="text-xl font-bold mb-4 mt-8">Passport Details</h2>
      <p className="text-sm text-gray-600 mb-4">Provide details of the passport that you will use to travel. Enter these details exactly as they appear in your passport.</p>

      {/* Country of Passport */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">Country of Passport <span className="text-red-600">*</span></label>
        <select {...register('passport_country')} className="w-full border rounded p-2" required>
          <option value="">Please select</option>
          {COUNTRY_LIST.map(country => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
        {errors.passport_country && <p className="text-red-600 text-sm">This field is required</p>}
      </div>

      {/* Passport Number */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">Passport Number <span className="text-red-600">*</span></label>
        <input 
          type="text" 
          {...register('passport_number')} 
          className="w-full border rounded p-2" 
          required 
          placeholder="Enter passport number"
        />
        <span className="text-xs text-gray-500">Be careful with letter &ldquo;O&rdquo; and number &ldquo;0&rdquo;; and letter &ldquo;I&rdquo; and number &ldquo;1&rdquo;</span>
        {errors.passport_number && <p className="text-red-600 text-sm">This field is required</p>}
      </div>

      {/* Date of Issue */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">Date of Issue <span className="text-red-600">*</span></label>
        <div className="flex gap-2">
          <select {...register('passport_issue_day')} className="w-16 border rounded p-2" required>
            <option value="">Day</option>
            {days.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select {...register('passport_issue_month')} className="w-32 border rounded p-2" required>
            <option value="">Month</option>
            {months.map((month, index) => <option key={month} value={monthNumbers[index]}>{month}</option>)}
          </select>
          <select {...register('passport_issue_year')} className="w-24 border rounded p-2" required>
            <option value="">Year</option>
            {getYearOptions(currentYear - 20, currentYear).map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        {errors.passport_issue_day && <p className="text-red-600 text-sm">This field is required</p>}
      </div>

      {/* Expiry Date */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">Expiry Date <span className="text-red-600">*</span></label>
        <div className="flex gap-2">
          <select {...register('passport_expiry_day')} className="w-16 border rounded p-2" required>
            <option value="">Day</option>
            {days.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select {...register('passport_expiry_month')} className="w-32 border rounded p-2" required>
            <option value="">Month</option>
            {months.map((month, index) => <option key={month} value={monthNumbers[index]}>{month}</option>)}
          </select>
          <select {...register('passport_expiry_year')} className="w-24 border rounded p-2" required>
            <option value="">Year</option>
            {getYearOptions(currentYear, currentYear + 20).map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        {errors.passport_expiry_day && <p className="text-red-600 text-sm">This field is required</p>}
      </div>
    </div>
  );
}
