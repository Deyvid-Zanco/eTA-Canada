import React from "react";
import { UseFormRegister, UseFormWatch, FieldErrors } from "react-hook-form";
import { InferType } from "yup";
import { philippinesStep2Schema } from "@/lib/schemas/philippinesStep2Schema";

type PhilippinesStep2FormData = InferType<typeof philippinesStep2Schema>;

interface PhilippinesStep2Props {
  register: UseFormRegister<PhilippinesStep2FormData>;
  errors: FieldErrors<PhilippinesStep2FormData>;
  watch: UseFormWatch<PhilippinesStep2FormData>;
}

export function PhilippinesStep2({ register, errors, watch }: PhilippinesStep2Props) {
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

  // Watch email fields for real-time validation
  const email = watch('email') as string;
  const emailConfirm = watch('email_confirm') as string;
  const [emailMatchError, setEmailMatchError] = React.useState('');

  // useEffect to check email match
  React.useEffect(() => {
    if (emailConfirm && email !== emailConfirm) {
      setEmailMatchError('Email addresses do not match');
    } else {
      setEmailMatchError('');
    }
  }, [email, emailConfirm]);

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Contact Details</h2>
      
      {/* Email Address */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">Email Address <span className="text-red-600">*</span></label>
        <input 
          type="email" 
          {...register('email')} 
          className="w-full border rounded p-2" 
          required 
          placeholder="Enter your email address"
        />
        <span className="text-xs text-gray-500">Primary Contact Method, double check it</span>
        {errors.email && <p className="text-red-600 text-sm">This field is required</p>}
      </div>

      {/* Confirm Email Address */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">Confirm Email Address <span className="text-red-600">*</span></label>
        <input 
          type="email" 
          {...register('email_confirm')} 
          className="w-full border rounded p-2" 
          required 
          placeholder="Re-enter your email address"
        />
        {emailMatchError && <p className="text-red-600 text-sm">{emailMatchError}</p>}
        {errors.email_confirm && !emailMatchError && <p className="text-red-600 text-sm">This field is required</p>}
      </div>

      {/* Mobile/Cell Telephone */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">Mobile/Cell Telephone <span className="text-red-600">*</span></label>
        <div className="flex gap-2">
          <select {...register('phone_country_code')} className="w-32 border rounded p-2" required>
            <option value="">Code</option>
            <option value="+1">+1 (US/CA)</option>
            <option value="+44">+44 (UK)</option>
            <option value="+49">+49 (DE)</option>
            <option value="+33">+33 (FR)</option>
            <option value="+39">+39 (IT)</option>
            <option value="+34">+34 (ES)</option>
            <option value="+31">+31 (NL)</option>
            <option value="+32">+32 (BE)</option>
            <option value="+41">+41 (CH)</option>
            <option value="+43">+43 (AT)</option>
            <option value="+45">+45 (DK)</option>
            <option value="+46">+46 (SE)</option>
            <option value="+47">+47 (NO)</option>
            <option value="+48">+48 (PL)</option>
            <option value="+351">+351 (PT)</option>
            <option value="+30">+30 (GR)</option>
            <option value="+90">+90 (TR)</option>
            <option value="+7">+7 (RU)</option>
            <option value="+86">+86 (CN)</option>
            <option value="+81">+81 (JP)</option>
            <option value="+82">+82 (KR)</option>
            <option value="+65">+65 (SG)</option>
            <option value="+60">+60 (MY)</option>
            <option value="+66">+66 (TH)</option>
            <option value="+84">+84 (VN)</option>
            <option value="+63">+63 (PH)</option>
            <option value="+61">+61 (AU)</option>
            <option value="+64">+64 (NZ)</option>
            <option value="+27">+27 (ZA)</option>
            <option value="+55">+55 (BR)</option>
            <option value="+52">+52 (MX)</option>
            <option value="+54">+54 (AR)</option>
            <option value="+56">+56 (CL)</option>
            <option value="+57">+57 (CO)</option>
            <option value="+51">+51 (PE)</option>
            <option value="+591">+591 (BO)</option>
            <option value="+598">+598 (UY)</option>
            <option value="+595">+595 (PY)</option>
            <option value="+593">+593 (EC)</option>
            <option value="+58">+58 (VE)</option>
            <option value="+592">+592 (GY)</option>
            <option value="+597">+597 (SR)</option>
            <option value="+594">+594 (GF)</option>
          </select>
          <input 
            type="tel" 
            {...register('phone_number')} 
            className="flex-1 border rounded p-2" 
            required 
            placeholder="Enter phone number"
          />
        </div>
        {errors.phone_country_code && <p className="text-red-600 text-sm">Country code is required</p>}
        {errors.phone_number && <p className="text-red-600 text-sm">Phone number is required</p>}
      </div>

      <h2 className="text-xl font-bold mb-4 mt-8">Travel Details</h2>

      {/* Travel Type */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">Travel Type <span className="text-red-600">*</span></label>
        <div className="flex gap-6">
          <label className="inline-flex items-center gap-2">
            <input type="radio" value="Arrival" {...register('travel_type')} required /> Arrival (Entering the Philippines)
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="radio" value="Departure" {...register('travel_type')} required /> Departure (Leaving the Philippines)
          </label>
        </div>
        {errors.travel_type && <p className="text-red-600 text-sm">This field is required</p>}
      </div>

      {/* Intended Date of Entry */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">Intended Date of Entry <span className="text-red-600">*</span></label>
        <div className="flex gap-2">
          <select {...register('entry_day')} className="w-16 border rounded p-2" required>
            <option value="">Day</option>
            {days.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select {...register('entry_month')} className="w-32 border rounded p-2" required>
            <option value="">Month</option>
            {months.map((month, index) => <option key={month} value={monthNumbers[index]}>{month}</option>)}
          </select>
          <select {...register('entry_year')} className="w-24 border rounded p-2" required>
            <option value="">Year</option>
            {getYearOptions(currentYear, currentYear + 2).map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        {errors.entry_day && <p className="text-red-600 text-sm">This field is required</p>}
      </div>

      {/* Declaration of Applicant */}
      <div className="mb-8 mt-8">
        <h2 className="text-xl font-bold mb-4">Declaration of Applicant</h2>
        <div className="mb-4 text-gray-700 text-sm">
          I declare that the information I have given in this application is truthful, complete and correct.
        </div>
        <div className="mb-4 text-gray-700 text-sm">
          I have read and understood the Terms and Conditions, and the Privacy Policy.
        </div>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" {...register('consent_declaration')} className="form-checkbox" required />
          <span>I agree to the terms and conditions</span>
        </label>
        {errors.consent_declaration && <p className="text-red-600 text-sm">You must agree to the terms and conditions</p>}
      </div>
    </div>
  );
}
