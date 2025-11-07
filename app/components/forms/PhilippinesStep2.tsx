import React from "react";
import { UseFormRegister, UseFormWatch, FieldErrors } from "react-hook-form";
import { InferType } from "yup";
import { philippinesStep2Schema } from "@/lib/schemas/philippinesStep2Schema";
import { COUNTRY_LIST } from "@/lib/constants";

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
  const phoneCountryCode = watch('phone_country_code') as string;
  const travelType = watch('travel_type');
  const [emailMatchError, setEmailMatchError] = React.useState('');
  const [phoneHint, setPhoneHint] = React.useState('');

  // useEffect to check email match
  React.useEffect(() => {
    if (emailConfirm && email !== emailConfirm) {
      setEmailMatchError('Email addresses do not match');
    } else {
      setEmailMatchError('');
    }
  }, [email, emailConfirm]);

  // useEffect to update phone hint based on country code
  React.useEffect(() => {
    switch (phoneCountryCode) {
      case '+1':
        setPhoneHint('Enter 10 digits (area code + number, e.g., 1234567890)');
        break;
      case '+44':
        setPhoneHint('Enter UK number without leading zero (e.g., 7123456789)');
        break;
      case '+61':
        setPhoneHint('Enter Australian number without leading zero (e.g., 412345678)');
        break;
      case '+86':
        setPhoneHint('Enter Chinese mobile number (e.g., 13800138000)');
        break;
      case '+81':
        setPhoneHint('Enter Japanese number (e.g., 9012345678)');
        break;
      case '+65':
        setPhoneHint('Enter Singapore number (e.g., 81234567)');
        break;
      case '+63':
        setPhoneHint('Enter Philippine number (e.g., 9171234567)');
        break;
      default:
        setPhoneHint('Enter phone number without country code');
    }
  }, [phoneCountryCode]);

  const dateLabel = travelType === 'Departure' 
    ? 'Intended Date of Departure' 
    : 'Intended Date of Entry';

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

      {/* Mobile/Cell Telephone Section */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">
          Mobile/Cell Telephone <span className="text-red-600">*</span>
        </label>

        {/* Unified container with flexbox for side-by-side layout */}
        <div className="flex border rounded-lg overflow-hidden shadow-sm">
          
          {/* Country Code Selector */}
          <select
            {...register('phone_country_code')}
            className="px-4 w-40 py-3 bg-gray-50 border-r text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
      <option value="">Select Country</option>
      <option value="+1">&#127482;&#127480; +1 US/CA</option>
      <option value="+7">&#127479;&#127482; +7 RU/KA</option>
      <option value="+20">&#127466;&#127468; +20 EG</option>
      <option value="+27">&#127487;&#127462; +27 ZA</option>
      <option value="+30">&#127468;&#127479; +30 GR</option>
      <option value="+31">&#127475;&#127473; +31 NL</option>
      <option value="+32">&#127463;&#127466; +32 BE</option>
      <option value="+33">&#127467;&#127479; +33 FR</option>
      <option value="+34">&#127466;&#127480; +34 ES</option>
      <option value="+36">&#127469;&#127482; +36 HU</option>
      <option value="+39">&#127470;&#127481; +39 IT</option>
      <option value="+40">&#127479;&#127476; +40 RO</option>
      <option value="+41">&#127464;&#127469; +41 CH</option>
      <option value="+43">&#127462;&#127481; +43 AT</option>
      <option value="+44">&#127468;&#127463; +44 UK</option>
      <option value="+45">&#127465;&#127472; +45 DK</option>
      <option value="+46">&#127480;&#127466; +46 SE</option>
      <option value="+47">&#127475;&#127476; +47 NO</option>
      <option value="+48">&#127477;&#127473; +48 PL</option>
      <option value="+49">&#127465;&#127466; +49 DE</option>
      <option value="+51">&#127477;&#127466; +51 PE</option>
      <option value="+52">&#127474;&#127485; +52 MX</option>
      <option value="+53">&#127464;&#127482; +53 CU</option>
      <option value="+54">&#127462;&#127479; +54 AR</option>
      <option value="+55">&#127463;&#127479; +55 BR</option>
      <option value="+56">&#127464;&#127473; +56 CL</option>
      <option value="+57">&#127464;&#127476; +57 CO</option>
      <option value="+58">&#127483;&#127466; +58 VE</option>
      <option value="+60">&#127474;&#127486; +60 MY</option>
      <option value="+61">&#127462;&#127482; +61 AU</option>
      <option value="+62">&#127470;&#127465; +62 ID</option>
      <option value="+63">&#127477;&#127469; +63 PH</option>
      <option value="+64">&#127475;&#127487; +64 NZ</option>
      <option value="+65">&#127480;&#127468; +65 SG</option>
      <option value="+66">&#127481;&#127469; +66 TH</option>
      <option value="+81">&#127471;&#127477; +81 JP</option>
      <option value="+82">&#127472;&#127479; +82 KR</option>
      <option value="+84">&#127483;&#127475; +84 VN</option>
      <option value="+86">&#127464;&#127475; +86 CN</option>
      <option value="+90">&#127481;&#127479; +90 TR</option>
      <option value="+91">&#127470;&#127475; +91 IN</option>
      <option value="+92">&#127477;&#127472; +92 PK</option>
      <option value="+93">🇦🇫 +93 AF</option>
      <option value="+94">🇱🇰 +94 LK</option>
      <option value="+95">🇲🇲 +95 MM</option>
      <option value="+98">🇮🇷 +98 IR</option>
      <option value="+211">🇸🇸 +211 SS</option>
      <option value="+212">🇲🇦 +212 MA</option>
      <option value="+213">🇩🇿 +213 DZ</option>
      <option value="+216">🇹🇳 +216 TN</option>
      <option value="+218">🇱🇾 +218 LY</option>
      <option value="+220">🇬🇲 +220 GM</option>
      <option value="+221">🇸🇳 +221 SN</option>
      <option value="+222">🇲🇷 +222 MR</option>
      <option value="+223">🇲🇱 +223 ML</option>
      <option value="+224">🇬🇳 +224 GN</option>
      <option value="+225">🇨🇮 +225 CI</option>
      <option value="+226">🇧🇫 +226 BF</option>
      <option value="+227">🇳🇪 +227 NE</option>
      <option value="+228">🇹🇬 +228 TG</option>
      <option value="+229">🇧🇯 +229 BJ</option>
      <option value="+230">🇲🇺 +230 MU</option>
      <option value="+231">🇱🇷 +231 LR</option>
      <option value="+232">🇸🇱 +232 SL</option>
      <option value="+233">🇬🇭 +233 GH</option>
      <option value="+234">🇳🇬 +234 NG</option>
      <option value="+235">🇹🇩 +235 TD</option>
      <option value="+236">🇨🇫 +236 CF</option>
      <option value="+237">🇨🇲 +237 CM</option>
      <option value="+238">🇨🇻 +238 CV</option>
      <option value="+239">🇸🇹 +239 ST</option>
      <option value="+240">🇦🇴 +240 AO</option>
      <option value="+241">🇬🇶 +241 GQ</option>
      <option value="+242">🇨🇬 +242 CG</option>
      <option value="+243">🇨🇩 +243 CD</option>
      <option value="+244">🇦🇴 +244 AO</option>
      <option value="+245">🇬🇼 +245 GW</option>
      <option value="+246">🇮🇴 +246 IO</option>
      <option value="+247">🇦🇨 +247 AC</option>
      <option value="+248">🇸🇨 +248 SC</option>
      <option value="+249">🇸🇩 +249 SD</option>
      <option value="+250">🇷🇼 +250 RW</option>
      <option value="+251">🇪🇹 +251 ET</option>
      <option value="+252">🇸🇴 +252 SO</option>
      <option value="+253">🇩🇯 +253 DJ</option>
      <option value="+254">🇰🇪 +254 KE</option>
      <option value="+255">🇹🇿 +255 TZ</option>
      <option value="+256">🇺🇬 +256 UG</option>
      <option value="+257">🇧🇮 +257 BI</option>
      <option value="+258">🇲🇿 +258 MZ</option>
      <option value="+260">🇿🇲 +260 ZM</option>
      <option value="+261">🇲🇬 +261 MG</option>
      <option value="+262">🇷🇪 +262 RE/YT</option>
      <option value="+263">🇿🇼 +263 ZW</option>
      <option value="+264">🇳🇦 +264 NA</option>
      <option value="+265">🇲🇼 +265 MW</option>
      <option value="+266">🇱🇸 +266 LS</option>
      <option value="+267">🇧🇼 +267 BW</option>
      <option value="+268">🇸🇿 +268 SZ</option>
      <option value="+269">🇰🇲 +269 KM</option>
      <option value="+290">🇸🇭 +290 SH</option>
      <option value="+291">🇪🇷 +291 ER</option>
      <option value="+297">🇦🇼 +297 AW</option>
      <option value="+298">🇫🇴 +298 FO</option>
      <option value="+299">🇬🇱 +299 GL</option>
      <option value="+350">🇬🇮 +350 GI</option>
      <option value="+351">🇵🇹 +351 PT</option>
      <option value="+352">🇱🇺 +352 LU</option>
      <option value="+353">🇮🇪 +353 IE</option>
      <option value="+354">🇮🇸 +354 IS</option>
      <option value="+355">🇦🇱 +355 AL</option>
      <option value="+356">🇲🇹 +356 MT</option>
      <option value="+357">🇨🇾 +357 CY</option>
      <option value="+358">🇫🇮 +358 FI/AX</option>
      <option value="+359">🇧🇬 +359 BG</option>
      <option value="+370">🇱🇹 +370 LT</option>
      <option value="+371">🇱🇻 +371 LV</option>
      <option value="+372">🇪🇪 +372 EE</option>
      <option value="+373">🇲🇩 +373 MD</option>
      <option value="+374">🇦🇲 +374 AM</option>
      <option value="+375">🇧🇾 +375 BY</option>
      <option value="+376">🇦🇩 +376 AD</option>
      <option value="+377">🇲🇨 +377 MC</option>
      <option value="+378">🇸🇲 +378 SM</option>
      <option value="+379">🇻🇦 +379 VA</option>
      <option value="+380">🇺🇦 +380 UA</option>
      <option value="+381">🇷🇸 +381 RS</option>
      <option value="+382">🇲🇪 +382 ME</option>
      <option value="+383">🇽🇰 +383 XK</option>
      <option value="+385">🇭🇷 +385 HR</option>
      <option value="+386">🇸🇮 +386 SI</option>
      <option value="+387">🇧🇦 +387 BA</option>
      <option value="+389">🇲🇰 +389 MK</option>
      <option value="+420">🇨🇿 +420 CZ</option>
      <option value="+421">🇸🇰 +421 SK</option>
      <option value="+423">🇱🇮 +423 LI</option>
      <option value="+500">🇫🇰 +500 FK</option>
      <option value="+501">🇧🇿 +501 BZ</option>
      <option value="+502">🇬🇹 +502 GT</option>
      <option value="+503">🇸🇻 +503 SV</option>
      <option value="+504">🇭🇳 +504 HN</option>
      <option value="+505">🇳🇮 +505 NI</option>
      <option value="+506">🇨🇷 +506 CR</option>
      <option value="+507">🇵🇦 +507 PA</option>
      <option value="+508">🇵🇲 +508 PM</option>
      <option value="+509">🇭🇹 +509 HT</option>
      <option value="+590">🇬🇵 +590 GP/BL/MF</option>
      <option value="+591">🇧🇴 +591 BO</option>
      <option value="+592">🇬🇾 +592 GY</option>
      <option value="+593">🇪🇨 +593 EC</option>
      <option value="+594">🇬🇫 +594 GF</option>
      <option value="+595">🇵🇾 +595 PY</option>
      <option value="+596">🇲🇶 +596 MQ</option>
      <option value="+597">🇸🇷 +597 SR</option>
      <option value="+598">🇺🇾 +598 UY</option>
      <option value="+599">🇨🇼 +599 CW/BQ</option>
      <option value="+670">🇹🇱 +670 TL</option>
      <option value="+672">🇦🇶 +672 AQ</option>
      <option value="+673">🇧🇳 +673 BN</option>
      <option value="+674">🇳🇷 +674 NR</option>
      <option value="+675">🇵🇬 +675 PG</option>
      <option value="+676">🇹🇴 +676 TO</option>
      <option value="+677">🇸🇧 +677 SB</option>
      <option value="+678">🇻🇺 +678 VU</option>
      <option value="+679">🇫🇯 +679 FJ</option>
      <option value="+680">🇵🇼 +680 PW</option>
      <option value="+681">🇼🇫 +681 WF</option>
      <option value="+682">🇨🇰 +682 CK</option>
      <option value="+683">🇳🇺 +683 NU</option>
      <option value="+684">🇦🇸 +684 AS</option>
      <option value="+685">🇼🇸 +685 WS</option>
      <option value="+686">🇰🇮 +686 KI</option>
      <option value="+687">🇳🇨 +687 NC</option>
      <option value="+688">🇹🇻 +688 TV</option>
      <option value="+689">🇵🇫 +689 PF</option>
      <option value="+690">🇹🇰 +690 TK</option>
      <option value="+691">🇫🇲 +691 FM</option>
      <option value="+692">🇲🇭 +692 MH</option>
      <option value="+850">🇰🇵 +850 KP</option>
      <option value="+852">🇭🇰 +852 HK</option>
      <option value="+853">🇲🇴 +853 MO</option>
      <option value="+855">🇰🇭 +855 KH</option>
      <option value="+856">🇱🇦 +856 LA</option>
      <option value="+880">🇧🇩 +880 BD</option>
      <option value="+886">🇹🇼 +886 TW</option>
      <option value="+960">🇲🇻 +960 MV</option>
      <option value="+961">🇱🇧 +961 LB</option>
      <option value="+962">🇯🇴 +962 JO</option>
      <option value="+963">🇸🇾 +963 SY</option>
      <option value="+964">🇮🇶 +964 IQ</option>
      <option value="+965">🇰🇼 +965 KW</option>
      <option value="+966">🇸🇦 +966 SA</option>
      <option value="+967">🇾🇪 +967 YE</option>
      <option value="+968">🇴🇲 +968 OM</option>
      <option value="+970">🇵🇸 +970 PS</option>
      <option value="+971">🇦🇪 +971 AE</option>
      <option value="+972">🇮🇱 +972 IL</option>
      <option value="+973">🇧🇭 +973 BH</option>
      <option value="+974">🇶🇦 +974 QA</option>
      <option value="+975">🇧🇹 +975 BT</option>
      <option value="+976">🇲🇳 +976 MN</option>
      <option value="+977">🇳🇵 +977 NP</option>
      <option value="+992">🇹🇯 +992 TJ</option>
      <option value="+993">🇹🇲 +993 TM</option>
      <option value="+994">🇦🇿 +994 AZ</option>
      <option value="+995">🇬🇪 +995 GE</option>
      <option value="+996">🇰🇬 +996 KG</option>
      <option value="+998">🇺🇿 +998 UZ</option>
    </select>
    
    {/* Phone Number Input (takes up remaining space) */}
    <input
      type="tel"
      {...register('phone_number')}
      className="flex-1 min-w-170 px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      required
      placeholder="Enter phone number"
    />
  </div>
  
  {/* Optional hint/error message area */}
  {phoneHint && (
    <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
      <span className="text-sm text-blue-700 font-medium">{phoneHint}</span>
    </div>
  )}
</div>

      <h2 className="text-xl font-bold mb-4 mt-8">Residential Address</h2>

      {/* Apartment number */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">Apartment Number</label>
        <input
          type="text"
          {...register('apartment_number')}
          className="w-full border rounded p-2"
          placeholder="Optional"
        />
      </div>

      {/* Street number */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">Street Number <span className="text-red-600">*</span></label>
        <input
          type="text"
          {...register('street_number')}
          className="w-full border rounded p-2"
          required
          placeholder="Enter street number"
        />
        {errors.street_number && <p className="text-red-600 text-sm">This field is required</p>}
      </div>

      {/* Street name */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">Street Name <span className="text-red-600">*</span></label>
        <input
          type="text"
          {...register('street_name')}
          className="w-full border rounded p-2"
          required
          placeholder="Enter street name"
        />
        {errors.street_name && <p className="text-red-600 text-sm">This field is required</p>}
      </div>

      {/* City/town */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">City/Town <span className="text-red-600">*</span></label>
        <input
          type="text"
          {...register('city_town')}
          className="w-full border rounded p-2"
          required
          placeholder="Enter city or town"
        />
        {errors.city_town && <p className="text-red-600 text-sm">This field is required</p>}
      </div>

      {/* District/region */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">District/Region</label>
        <input
          type="text"
          {...register('district_region')}
          className="w-full border rounded p-2"
          placeholder="Optional"
        />
      </div>

      {/* ZIP Code */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">ZIP Code <span className="text-red-600">*</span></label>
        <input
          type="text"
          {...register('zip_code')}
          className="w-full border rounded p-2"
          required
          placeholder="Enter ZIP code"
        />
        {errors.zip_code && <p className="text-red-600 text-sm">This field is required</p>}
      </div>

      {/* Country/territory */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">Country/Territory <span className="text-red-600">*</span></label>
        <select {...register('address_country')} className="w-full border rounded p-2" required>
          <option value="">Please select</option>
          {COUNTRY_LIST.map(country => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
        {errors.address_country && <p className="text-red-600 text-sm">This field is required</p>}
      </div>

      <h2 className="text-xl font-bold mb-4 mt-8">Travel Details</h2>

      {/* ============== TRAVEL METHOD ============== */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">How will you be traveling? <span className="text-red-600">*</span></label>
        <div className="flex gap-6">
          <label className="inline-flex items-center gap-2">
            <input type="radio" value="Flight" {...register('travel_method')} required /> By Air (Flight)
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="radio" value="Cruise" {...register('travel_method')} required /> By Sea (Cruise)
          </label>
        </div>
        {errors.travel_method && <p className="text-red-600 text-sm">This field is required</p>}
      </div>
      {/* ================================================= */}

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

      {/* Intended Date Section */}
      <div className="mb-6">
        {/* CHANGED: The label now uses the dynamic dateLabel variable */}
        <label className="block mb-1 font-medium">{dateLabel} <span className="text-red-600">*</span></label>
        <div className="flex gap-2">
          <select {...register('entry_month')} className="w-32 border rounded p-2" required>
            <option value="">Month</option>
            {months.map((month, index) => <option key={month} value={monthNumbers[index]}>{month}</option>)}
          </select>
          <select {...register('entry_day')} className="w-16 border rounded p-2" required>
            <option value="">Day</option>
            {days.map(d => <option key={d} value={d}>{d}</option>)}
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
