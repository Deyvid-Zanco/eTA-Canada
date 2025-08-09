"use client";

import React from 'react';
import { useFormContext } from 'react-hook-form';

type TranslationObject = {
  [key: string]: string | TranslationObject;
};

interface Step2Props {
  t: TranslationObject;
}

const getTranslation = (obj: TranslationObject, path: string): string => {
    const keys = path.split('.');
    let current: string | TranslationObject = obj;
    for (const key of keys) {
        if (typeof current !== 'object' || current === null || !current[key]) {
            return '';
        }
        current = current[key];
    }
    return typeof current === 'string' ? current : '';
};

export const Step2AdditionalInfo = ({ t }: Step2Props) => {
  const { register, watch, formState: { errors, dirtyFields }, trigger } = useFormContext();

  const occupation = watch('occupation');
  const canadaVisaApplied = watch('canada_visa_applied');
  const additionalNationality = watch('additional_nationality');
  const knowsTravelDate = watch('do_you_know_travel_date');
  const previousVisaNumberConfirm = watch('previous_visa_number_confirm');

  const hideJobFields = ['Unemployed', 'Homemaker', 'Retired'].includes(occupation);

  const currentYear = new Date().getFullYear();
  const monthNumbers = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
  
  const months = [ getTranslation(t, 'common.january'), getTranslation(t, 'common.february'), getTranslation(t, 'common.march'), getTranslation(t, 'common.april'), getTranslation(t, 'common.may'), getTranslation(t, 'common.june'), getTranslation(t, 'common.july'), getTranslation(t, 'common.august'), getTranslation(t, 'common.september'), getTranslation(t, 'common.october'), getTranslation(t, 'common.november'), getTranslation(t, 'common.december') ];
  
  function getFutureYearOptions(start: number, end: number) {
    const years = [];
    for (let y = start; y <= end; y++) years.push(y);
    return years;
  }

  React.useEffect(() => {
    if (dirtyFields.previous_visa_number) {
      trigger("previous_visa_number_confirm");
    }
  }, [previousVisaNumberConfirm, dirtyFields.previous_visa_number, trigger]);

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Personal &amp; Employment Details</h2>
      <div className="mb-6">
        <label className="block mb-1 font-medium">{getTranslation(t, 'formFields.additionalNationality')} <span className="text-red-600">*</span></label>
        <div className="flex gap-6">
          <label className="inline-flex items-center gap-2">
            <input type="radio" value="No" {...register('additional_nationality')} /> {getTranslation(t, 'formOptions.no')}
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="radio" value="Yes" {...register('additional_nationality')} /> {getTranslation(t, 'formOptions.yes')}
          </label>
        </div>
        {errors.additional_nationality && <p className="text-red-600 text-sm">{errors.additional_nationality.message as string}</p>}
      </div>
      {additionalNationality === 'Yes' && (
        <div className="mb-6">
          <label className="block mb-1 font-medium">INDICATE WHICH COUNTRIES/TERRITORIES YOU ARE CITIZEN OF: <span className="text-red-600">*</span></label>
          <input type="text" {...register('additional_nationality_details')} className="w-full border rounded p-2" />
          {errors.additional_nationality_details && <p className="text-red-600 text-sm">{errors.additional_nationality_details.message as string}</p>}
        </div>
      )}
      <div className="mb-6">
        <label className="block mb-1 font-medium">{getTranslation(t, 'formFields.maritalStatus')} <span className="text-red-600">*</span></label>
        <select {...register('marital_status')} className="w-full border rounded p-2">
          <option value="">{getTranslation(t, 'common.pleaseSelect')}</option>
          <option value="Married">{getTranslation(t, 'formOptions.married')}</option>
          <option value="Legally Separated">{getTranslation(t, 'formOptions.legallySeparated')}</option>
          <option value="Divorced">{getTranslation(t, 'formOptions.divorced')}</option>
          <option value="Annulled Marriage">{getTranslation(t, 'formOptions.annulledMarriage')}</option>
          <option value="Widowed">{getTranslation(t, 'formOptions.widowed')}</option>
          <option value="Common-Law">{getTranslation(t, 'formOptions.commonLaw')}</option>
          <option value="Never Married/Single">{getTranslation(t, 'formOptions.neverMarried')}</option>
        </select>
        {errors.marital_status && <p className="text-red-600 text-sm">{errors.marital_status.message as string}</p>}
      </div>
      <div className="mb-6">
        <label className="block mb-1 font-medium">{getTranslation(t, 'formFields.canadaVisaApplied')} <span className="text-red-600">*</span></label>
        <div className="flex gap-6">
          <label className="inline-flex items-center gap-2">
            <input type="radio" value="No" {...register('canada_visa_applied')} /> {getTranslation(t, 'formOptions.no')}
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="radio" value="Yes" {...register('canada_visa_applied')} /> {getTranslation(t, 'formOptions.yes')}
          </label>
        </div>
        {errors.canada_visa_applied && <p className="text-red-600 text-sm">{errors.canada_visa_applied.message as string}</p>}
      </div>
      {canadaVisaApplied === 'Yes' && (
        <>
          <div className="mt-4 mb-6">
            <label className="block mb-1 font-medium">Unique client identifier (UCI) / Previous Canadian visa, eTA or permit number <span className="text-red-600">*</span></label>
            <input type="text" {...register('previous_visa_number')} className="w-full border rounded p-2" />
            {errors.previous_visa_number && <p className="text-red-600 text-sm">{errors.previous_visa_number.message as string}</p>}
          </div>
          <div className="mt-4 mb-6">
            <label className="block mb-1 font-medium">Unique client identifier (UCI) / Previous Canadian visa, eTA or permit number (re-enter) <span className="text-red-600">*</span></label>
            <input type="text" {...register('previous_visa_number_confirm')} className="w-full border rounded p-2" />
            {errors.previous_visa_number_confirm && <p className="text-red-600 text-sm">{errors.previous_visa_number_confirm.message as string}</p>}
          </div>
        </>
      )}

      <h3 className="text-xl font-bold mb-4 mt-8">Employment information</h3>
      <div className="mb-6">
        <label className="block mb-1 font-medium">{getTranslation(t, 'formFields.occupation')} <span className="text-red-600">*</span></label>
        <select {...register('occupation')} className="w-full border rounded p-2">
          <option value="">{getTranslation(t, 'common.pleaseSelect')}</option>
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
        {errors.occupation && <p className="text-red-600 text-sm">{errors.occupation.message as string}</p>}
      </div>
      {!hideJobFields && (
        <>
          <div className="mb-6">
            <label className="block mb-1 font-medium">Describe a bit more about your job <span className="text-red-600">*</span></label>
            <input type="text" {...register('job_description')} className="w-full border rounded p-2" />
            {errors.job_description && <p className="text-red-600 text-sm">{errors.job_description.message as string}</p>}
          </div>
          <div className="mb-6">
            <label className="block mb-1 font-medium">Name of employer or school, as appropriate <span className="text-red-600">*</span></label>
            <input type="text" {...register('employer_name')} className="w-full border rounded p-2" />
            {errors.employer_name && <p className="text-red-600 text-sm">{errors.employer_name.message as string}</p>}
          </div>
          <div className="mb-6">
            <label className="block mb-1 font-medium">COUNTRY/TERRITORY <span className="text-red-600">*</span></label>
            <select {...register('employment_country')} className="w-full border rounded p-2">
              <option value="">{getTranslation(t, 'common.pleaseSelect')}</option>
              <option value="Afghanistan">Afghanistan</option>
              <option value="Albania">Albania</option>
              <option value="Algeria">Algeria</option>
              <option value="American Samoa">American Samoa</option>
              <option value="Andorra">Andorra</option>
              <option value="Angola">Angola</option>
              <option value="Anguilla">Anguilla</option>
              <option value="Antigua and Barbuda">Antigua and Barbuda</option>
              <option value="Argentina">Argentina</option>
              <option value="Armenia">Armenia</option>
              <option value="Aruba">Aruba</option>
              <option value="Australia">Australia</option>
              <option value="Austria">Austria</option>
              <option value="Azerbaijan">Azerbaijan</option>
              <option value="The Bahamas">The Bahamas</option>
              <option value="Bahrain">Bahrain</option>
              <option value="Bangladesh">Bangladesh</option>
              <option value="Barbados">Barbados</option>
              <option value="Belarus">Belarus</option>
              <option value="Belgium">Belgium</option>
              <option value="Belize">Belize</option>
              <option value="Benin">Benin</option>
              <option value="Bermuda">Bermuda</option>
              <option value="Bhutan">Bhutan</option>
              <option value="Bolivia">Bolivia</option>
              <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
              <option value="Botswana">Botswana</option>
              <option value="Brazil">Brazil</option>
              <option value="Brunei">Brunei</option>
              <option value="Bulgaria">Bulgaria</option>
              <option value="Burkina Faso">Burkina Faso</option>
              <option value="Burundi">Burundi</option>
              <option value="Cambodia">Cambodia</option>
              <option value="Cameroon">Cameroon</option>
              <option value="Canada">Canada</option>
              <option value="Cape Verde">Cape Verde</option>
              <option value="Cayman Islands">Cayman Islands</option>
              <option value="Central African Republic">Central African Republic</option>
              <option value="Chad">Chad</option>
              <option value="Chile">Chile</option>
              <option value="China">China</option>
              <option value="Christmas Island">Christmas Island</option>
              <option value="Cocos (Keeling) Islands">Cocos (Keeling) Islands</option>
              <option value="Colombia">Colombia</option>
              <option value="Comoros">Comoros</option>
              <option value="Congo">Congo</option>
              <option value="Cook Islands">Cook Islands</option>
              <option value="Costa Rica">Costa Rica</option>
              <option value="Cote d'Ivoire">Cote d&apos;Ivoire</option>
              <option value="Croatia">Croatia</option>
              <option value="Cuba">Cuba</option>
              <option value="Cyprus">Cyprus</option>
              <option value="Czech Republic">Czech Republic</option>
              <option value="Democratic Republic of the Congo">Democratic Republic of the Congo</option>
              <option value="Denmark">Denmark</option>
              <option value="Djibouti">Djibouti</option>
              <option value="Dominica">Dominica</option>
              <option value="Dominican Republic">Dominican Republic</option>
              <option value="Ecuador">Ecuador</option>
              <option value="Egypt">Egypt</option>
              <option value="El Salvador">El Salvador</option>
              <option value="Equatorial Guinea">Equatorial Guinea</option>
              <option value="Eritrea">Eritrea</option>
              <option value="Estonia">Estonia</option>
              <option value="Eswatini">Eswatini</option>
              <option value="Ethiopia">Ethiopia</option>
              <option value="Faroe Islands">Faroe Islands</option>
              <option value="Fiji">Fiji</option>
              <option value="Finland">Finland</option>
              <option value="France">France</option>
              <option value="French Polynesia">French Polynesia</option>
              <option value="Gabon">Gabon</option>
              <option value="The Gambia">The Gambia</option>
              <option value="Georgia">Georgia</option>
              <option value="Germany">Germany</option>
              <option value="Ghana">Ghana</option>
              <option value="Gibraltar">Gibraltar</option>
              <option value="Greece">Greece</option>
              <option value="Greenland">Greenland</option>
              <option value="Grenada">Grenada</option>
              <option value="Guadeloupe">Guadeloupe</option>
              <option value="Guam">Guam</option>
              <option value="Guatemala">Guatemala</option>
              <option value="Guernsey">Guernsey</option>
              <option value="Guinea">Guinea</option>
              <option value="Guinea-Bissau">Guinea-Bissau</option>
              <option value="Guyana">Guyana</option>
              <option value="Haiti">Haiti</option>
              <option value="Honduras">Honduras</option>
              <option value="Hong Kong">Hong Kong</option>
              <option value="Hungary">Hungary</option>
              <option value="Iceland">Iceland</option>
              <option value="India">India</option>
              <option value="Indonesia">Indonesia</option>
              <option value="Iran">Iran</option>
              <option value="Iraq">Iraq</option>
              <option value="Ireland">Ireland</option>
              <option value="Israel">Israel</option>
              <option value="Italy">Italy</option>
              <option value="Jamaica">Jamaica</option>
              <option value="Japan">Japan</option>
              <option value="Jersey">Jersey</option>
              <option value="Jordan">Jordan</option>
              <option value="Kazakhstan">Kazakhstan</option>
              <option value="Kenya">Kenya</option>
              <option value="Kiribati">Kiribati</option>
              <option value="North Korea">North Korea</option>
              <option value="South Korea">South Korea</option>
              <option value="Kosovo">Kosovo</option>
              <option value="Kuwait">Kuwait</option>
              <option value="Kyrgyzstan">Kyrgyzstan</option>
              <option value="Laos">Laos</option>
              <option value="Latvia">Latvia</option>
              <option value="Lebanon">Lebanon</option>
              <option value="Lesotho">Lesotho</option>
              <option value="Liberia">Liberia</option>
              <option value="Libya">Libya</option>
              <option value="Liechtenstein">Liechtenstein</option>
              <option value="Lithuania">Lithuania</option>
              <option value="Luxembourg">Luxembourg</option>
              <option value="Macau">Macau</option>
              <option value="Madagascar">Madagascar</option>
              <option value="Malawi">Malawi</option>
              <option value="Malaysia">Malaysia</option>
              <option value="Maldives">Maldives</option>
              <option value="Mali">Mali</option>
              <option value="Malta">Malta</option>
              <option value="Marshall Islands">Marshall Islands</option>
              <option value="Mauritania">Mauritania</option>
              <option value="Mauritius">Mauritius</option>
              <option value="Mayotte">Mayotte</option>
              <option value="Mexico">Mexico</option>
              <option value="Micronesia">Micronesia</option>
              <option value="Moldova">Moldova</option>
              <option value="Monaco">Monaco</option>
              <option value="Mongolia">Mongolia</option>
              <option value="Montenegro">Montenegro</option>
              <option value="Montserrat">Montserrat</option>
              <option value="Morocco">Morocco</option>
              <option value="Mozambique">Mozambique</option>
              <option value="Myanmar (Burma)">Myanmar (Burma)</option>
              <option value="Nagorno-Karabakh">Nagorno-Karabakh</option>
              <option value="Namibia">Namibia</option>
              <option value="Nauru">Nauru</option>
              <option value="Nepal">Nepal</option>
              <option value="Netherlands">Netherlands</option>
              <option value="Netherlands Antilles">Netherlands Antilles</option>
              <option value="New Caledonia">New Caledonia</option>
              <option value="New Zealand">New Zealand</option>
              <option value="Nicaragua">Nicaragua</option>
              <option value="Niger">Niger</option>
              <option value="Nigeria">Nigeria</option>
              <option value="Niue">Niue</option>
              <option value="Norfolk Island">Norfolk Island</option>
              <option value="Northern Republic of Northern Cyprus">Northern Republic of Northern Cyprus</option>
              <option value="Northern Mariana Islands">Northern Mariana Islands</option>
              <option value="Norway">Norway</option>
              <option value="Oman">Oman</option>
              <option value="Pakistan">Pakistan</option>
              <option value="Palau">Palau</option>
              <option value="Palestine">Palestine</option>
              <option value="Panama">Panama</option>
              <option value="Papua New Guinea">Papua New Guinea</option>
              <option value="Paraguay">Paraguay</option>
              <option value="Peru">Peru</option>
              <option value="Philippines">Philippines</option>
              <option value="Pitcairn Islands">Pitcairn Islands</option>
              <option value="Poland">Poland</option>
              <option value="Portugal">Portugal</option>
              <option value="Puerto Rico">Puerto Rico</option>
              <option value="Republic of the Congo">Republic of the Congo</option>
              <option value="Romania">Romania</option>
              <option value="Russia">Russia</option>
              <option value="Rwanda">Rwanda</option>
              <option value="Saint Barthélemy">Saint Barthélemy</option>
              <option value="Saint Helena">Saint Helena</option>
              <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
              <option value="Saint Lucia">Saint Lucia</option>
              <option value="Saint Martin">Saint Martin</option>
              <option value="Saint Pierre and Miquelon">Saint Pierre and Miquelon</option>
              <option value="Saint Vincent and the Grenadines">Saint Vincent and the Grenadines</option>
              <option value="Samoa">Samoa</option>
              <option value="San Marino">San Marino</option>
              <option value="São Tomé and Príncipe">São Tomé and Príncipe</option>
              <option value="Saudi Arabia">Saudi Arabia</option>
              <option value="Senegal">Senegal</option>
              <option value="Serbia">Serbia</option>
              <option value="Seychelles">Seychelles</option>
              <option value="Sierra Leone">Sierra Leone</option>
              <option value="Singapore">Singapore</option>
              <option value="Sint Maarten">Sint Maarten</option>
              <option value="Slovakia">Slovakia</option>
              <option value="Slovenia">Slovenia</option>
              <option value="Solomon Islands">Solomon Islands</option>
              <option value="Somalia">Somalia</option>
              <option value="South Africa">South Africa</option>
              <option value="South Ossetia">South Ossetia</option>
              <option value="South Sudan">South Sudan</option>
              <option value="Spain">Spain</option>
              <option value="Sri Lanka">Sri Lanka</option>
              <option value="Sudan">Sudan</option>
              <option value="Suriname">Suriname</option>
              <option value="Sweden">Sweden</option>
              <option value="Switzerland">Switzerland</option>
              <option value="Syria">Syria</option>
              <option value="Taiwan">Taiwan</option>
              <option value="Tajikistan">Tajikistan</option>
              <option value="Tanzania">Tanzania</option>
              <option value="Thailand">Thailand</option>
              <option value="Timor-Leste">Timor-Leste</option>
              <option value="Togo">Togo</option>
              <option value="Tokelau">Tokelau</option>
              <option value="Tonga">Tonga</option>
              <option value="Transnistria Pridnestrovie">Transnistria Pridnestrovie</option>
              <option value="Trinidad and Tobago">Trinidad and Tobago</option>
              <option value="Tristan da Cunha">Tristan da Cunha</option>
              <option value="Tunisia">Tunisia</option>
              <option value="Turkey">Turkey</option>
              <option value="Turkmenistan">Turkmenistan</option>
              <option value="Turks and Caicos Islands">Turks and Caicos Islands</option>
              <option value="Tuvalu">Tuvalu</option>
              <option value="Uganda">Uganda</option>
              <option value="Ukraine">Ukraine</option>
              <option value="United Arab Emirates">United Arab Emirates</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="United States">United States</option>
              <option value="Uruguay">Uruguay</option>
              <option value="Uzbekistan">Uzbekistan</option>
              <option value="Vanuatu">Vanuatu</option>
              <option value="Vatican City">Vatican City</option>
              <option value="Venezuela">Venezuela</option>
              <option value="Vietnam">Vietnam</option>
              <option value="Western Sahara">Western Sahara</option>
              <option value="Yemen">Yemen</option>
              <option value="Zambia">Zambia</option>
              <option value="Zimbabwe">Zimbabwe</option>
            </select>
            {errors.employment_country && <p className="text-red-600 text-sm">{errors.employment_country.message as string}</p>}
          </div>
          <div className="mb-6">
            <label className="block mb-1 font-medium">City/town <span className="text-red-600">*</span></label>
            <input type="text" {...register('employer_city')} className="w-full border rounded p-2" />
            {errors.employer_city && <p className="text-red-600 text-sm">{errors.employer_city.message as string}</p>}
          </div>
          <div className="mb-6">
            <label className="block mb-1 font-medium">Since what year? <span className="text-red-600">*</span></label>
            <input type="text" {...register('employment_start_year')} className="w-full border rounded p-2" placeholder="YYYY" />
            {errors.employment_start_year && <p className="text-red-600 text-sm">{errors.employment_start_year.message as string}</p>}
          </div>
        </>
      )}

      <h3 className="text-xl font-bold mb-4 mt-8">Residential address</h3>
      <div className="text-sm text-gray-500 mb-4">Enter your permanent home address. Do not enter an address where you live temporarily.</div>
      <div className="mb-6">
        <label className="block mb-1 font-medium">APARTMENT NUMBER</label>
        <input type="text" {...register('apartment_number')} className="w-full border rounded p-2" />
      </div>
      <div className="mb-6">
        <label className="block mb-1 font-medium">STREET NUMBER <span className="text-red-600">*</span></label>
        <input type="text" {...register('street_number')} className="w-full border rounded p-2" />
        {errors.street_number && <p className="text-red-600 text-sm">{errors.street_number.message as string}</p>}
      </div>
      <div className="mb-6">
        <label className="block mb-1 font-medium">STREET NAME <span className="text-red-600">*</span></label>
        <input type="text" {...register('street_name')} className="w-full border rounded p-2" />
        {errors.street_name && <p className="text-red-600 text-sm">{errors.street_name.message as string}</p>}
      </div>
      <div className="mb-6">
        <label className="block mb-1 font-medium">CITY/TOWN <span className="text-red-600">*</span></label>
        <input type="text" {...register('city_town')} className="w-full border rounded p-2" />
        {errors.city_town && <p className="text-red-600 text-sm">{errors.city_town.message as string}</p>}
      </div>
      <div className="mb-6">
        <label className="block mb-1 font-medium">DISTRICT/REGION</label>
        <input type="text" {...register('district_region')} className="w-full border rounded p-2" />
      </div>
      <div className="mb-6">
        <label className="block mb-1 font-medium">COUNTRY/TERRITORY <span className="text-red-600">*</span></label>
        <select {...register('address_country')} className="w-full border rounded p-2">
          <option value="">{getTranslation(t, 'common.pleaseSelect')}</option>
          <option value="Afghanistan">Afghanistan</option>
          <option value="Albania">Albania</option>
          <option value="Algeria">Algeria</option>
          <option value="American Samoa">American Samoa</option>
          <option value="Andorra">Andorra</option>
          <option value="Angola">Angola</option>
          <option value="Anguilla">Anguilla</option>
          <option value="Antigua and Barbuda">Antigua and Barbuda</option>
          <option value="Argentina">Argentina</option>
          <option value="Armenia">Armenia</option>
          <option value="Aruba">Aruba</option>
          <option value="Australia">Australia</option>
          <option value="Austria">Austria</option>
          <option value="Azerbaijan">Azerbaijan</option>
          <option value="The Bahamas">The Bahamas</option>
          <option value="Bahrain">Bahrain</option>
          <option value="Bangladesh">Bangladesh</option>
          <option value="Barbados">Barbados</option>
          <option value="Belarus">Belarus</option>
          <option value="Belgium">Belgium</option>
          <option value="Belize">Belize</option>
          <option value="Benin">Benin</option>
          <option value="Bermuda">Bermuda</option>
          <option value="Bhutan">Bhutan</option>
          <option value="Bolivia">Bolivia</option>
          <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
          <option value="Botswana">Botswana</option>
          <option value="Brazil">Brazil</option>
          <option value="Brunei">Brunei</option>
          <option value="Bulgaria">Bulgaria</option>
          <option value="Burkina Faso">Burkina Faso</option>
          <option value="Burundi">Burundi</option>
          <option value="Cambodia">Cambodia</option>
          <option value="Cameroon">Cameroon</option>
          <option value="Canada">Canada</option>
          <option value="Cape Verde">Cape Verde</option>
          <option value="Cayman Islands">Cayman Islands</option>
          <option value="Central African Republic">Central African Republic</option>
          <option value="Chad">Chad</option>
          <option value="Chile">Chile</option>
          <option value="China">China</option>
          <option value="Christmas Island">Christmas Island</option>
          <option value="Cocos (Keeling) Islands">Cocos (Keeling) Islands</option>
          <option value="Colombia">Colombia</option>
          <option value="Comoros">Comoros</option>
          <option value="Congo">Congo</option>
          <option value="Cook Islands">Cook Islands</option>
          <option value="Costa Rica">Costa Rica</option>
          <option value="Cote d'Ivoire">Cote d&apos;Ivoire</option>
          <option value="Croatia">Croatia</option>
          <option value="Cuba">Cuba</option>
          <option value="Curaçao">Curaçao</option>
          <option value="Cyprus">Cyprus</option>
          <option value="Czech Republic">Czech Republic</option>
          <option value="Democratic Republic of the Congo">Democratic Republic of the Congo</option>
          <option value="Denmark">Denmark</option>
          <option value="Djibouti">Djibouti</option>
          <option value="Dominica">Dominica</option>
          <option value="Dominican Republic">Dominican Republic</option>
          <option value="Ecuador">Ecuador</option>
          <option value="Egypt">Egypt</option>
          <option value="El Salvador">El Salvador</option>
          <option value="Equatorial Guinea">Equatorial Guinea</option>
          <option value="Eritrea">Eritrea</option>
          <option value="Estonia">Estonia</option>
          <option value="Ethiopia">Ethiopia</option>
          <option value="Falkland Islands">Falkland Islands</option>
          <option value="Faroe Islands">Faroe Islands</option>
          <option value="Fiji">Fiji</option>
          <option value="Finland">Finland</option>
          <option value="France">France</option>
          <option value="French Polynesia">French Polynesia</option>
          <option value="Gabon">Gabon</option>
          <option value="The Gambia">The Gambia</option>
          <option value="Georgia">Georgia</option>
          <option value="Germany">Germany</option>
          <option value="Ghana">Ghana</option>
          <option value="Gibraltar">Gibraltar</option>
          <option value="Greece">Greece</option>
          <option value="Greenland">Greenland</option>
          <option value="Grenada">Grenada</option>
          <option value="Guadeloupe">Guadeloupe</option>
          <option value="Guam">Guam</option>
          <option value="Guatemala">Guatemala</option>
          <option value="Guernsey">Guernsey</option>
          <option value="Guinea">Guinea</option>
          <option value="Guinea-Bissau">Guinea-Bissau</option>
          <option value="Guyana">Guyana</option>
          <option value="Haiti">Haiti</option>
          <option value="Honduras">Honduras</option>
          <option value="Hong Kong">Hong Kong</option>
          <option value="Hungary">Hungary</option>
          <option value="Iceland">Iceland</option>
          <option value="India">India</option>
          <option value="Indonesia">Indonesia</option>
          <option value="Iran">Iran</option>
          <option value="Iraq">Iraq</option>
          <option value="Ireland">Ireland</option>
          <option value="Israel">Israel</option>
          <option value="Italy">Italy</option>
          <option value="Jamaica">Jamaica</option>
          <option value="Japan">Japan</option>
          <option value="Jersey">Jersey</option>
          <option value="Jordan">Jordan</option>
          <option value="Kazakhstan">Kazakhstan</option>
          <option value="Kenya">Kenya</option>
          <option value="Kiribati">Kiribati</option>
          <option value="North Korea">North Korea</option>
          <option value="South Korea">South Korea</option>
          <option value="Kosovo">Kosovo</option>
          <option value="Kuwait">Kuwait</option>
          <option value="Kyrgyzstan">Kyrgyzstan</option>
          <option value="Laos">Laos</option>
          <option value="Latvia">Latvia</option>
          <option value="Lebanon">Lebanon</option>
          <option value="Lesotho">Lesotho</option>
          <option value="Liberia">Liberia</option>
          <option value="Libya">Libya</option>
          <option value="Liechtenstein">Liechtenstein</option>
          <option value="Lithuania">Lithuania</option>
          <option value="Luxembourg">Luxembourg</option>
          <option value="Macau">Macau</option>
          <option value="Macedonia">Macedonia</option>
          <option value="Madagascar">Madagascar</option>
          <option value="Malawi">Malawi</option>
          <option value="Malaysia">Malaysia</option>
          <option value="Maldives">Maldives</option>
          <option value="Mali">Mali</option>
          <option value="Malta">Malta</option>
          <option value="Marshall Islands">Marshall Islands</option>
          <option value="Martinique">Martinique</option>
          <option value="Mauritania">Mauritania</option>
          <option value="Mauritius">Mauritius</option>
          <option value="Mayotte">Mayotte</option>
          <option value="Mexico">Mexico</option>
          <option value="Micronesia">Micronesia</option>
          <option value="Moldova">Moldova</option>
          <option value="Monaco">Monaco</option>
          <option value="Mongolia">Mongolia</option>
          <option value="Montenegro">Montenegro</option>
          <option value="Montserrat">Montserrat</option>
          <option value="Morocco">Morocco</option>
          <option value="Mozambique">Mozambique</option>
          <option value="Myanmar">Myanmar</option>
          <option value="Nagorno-Karabakh">Nagorno-Karabakh</option>
          <option value="Namibia">Namibia</option>
          <option value="Nauru">Nauru</option>
          <option value="Nepal">Nepal</option>
          <option value="Netherlands">Netherlands</option>
          <option value="Netherlands Antilles">Netherlands Antilles</option>
          <option value="New Caledonia">New Caledonia</option>
          <option value="New Zealand">New Zealand</option>
          <option value="Nicaragua">Nicaragua</option>
          <option value="Niger">Niger</option>
          <option value="Nigeria">Nigeria</option>
          <option value="Niue">Niue</option>
          <option value="Norfolk Island">Norfolk Island</option>
          <option value="Turkish Republic of Northern Cyprus">Turkish Republic of Northern Cyprus</option>
          <option value="Northern Mariana Islands">Northern Mariana Islands</option>
          <option value="Norway">Norway</option>
          <option value="Oman">Oman</option>
          <option value="Pakistan">Pakistan</option>
          <option value="Palau">Palau</option>
          <option value="Palestine">Palestine</option>
          <option value="Panama">Panama</option>
          <option value="Papua New Guinea">Papua New Guinea</option>
          <option value="Paraguay">Paraguay</option>
          <option value="Peru">Peru</option>
          <option value="Philippines">Philippines</option>
          <option value="Pitcairn Islands">Pitcairn Islands</option>
          <option value="Poland">Poland</option>
          <option value="Portugal">Portugal</option>
          <option value="Puerto Rico">Puerto Rico</option>
          <option value="Qatar">Qatar</option>
          <option value="Republic of the Congo">Republic of the Congo</option>
          <option value="Romania">Romania</option>
          <option value="Russia">Russia</option>
          <option value="Rwanda">Rwanda</option>
          <option value="Saint Barthelemy">Saint Barthelemy</option>
          <option value="Saint Helena">Saint Helena</option>
          <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
          <option value="Saint Lucia">Saint Lucia</option>
          <option value="Saint Martin">Saint Martin</option>
          <option value="Saint Pierre and Miquelon">Saint Pierre and Miquelon</option>
          <option value="Saint Vincent and the Grenadines">Saint Vincent and the Grenadines</option>
          <option value="Samoa">Samoa</option>
          <option value="San Marino">San Marino</option>
          <option value="São Tomé and Príncipe">São Tomé and Príncipe</option>
          <option value="Saudi Arabia">Saudi Arabia</option>
          <option value="Senegal">Senegal</option>
          <option value="Serbia">Serbia</option>
          <option value="Seychelles">Seychelles</option>
          <option value="Sierra Leone">Sierra Leone</option>
          <option value="Singapore">Singapore</option>
          <option value="Sint Maarten">Sint Maarten</option>
          <option value="Slovakia">Slovakia</option>
          <option value="Slovenia">Slovenia</option>
          <option value="Solomon Islands">Solomon Islands</option>
          <option value="Somalia">Somalia</option>
          <option value="South Africa">South Africa</option>
          <option value="South Ossetia">South Ossetia</option>
          <option value="South Sudan">South Sudan</option>
          <option value="Spain">Spain</option>
          <option value="Sri Lanka">Sri Lanka</option>
          <option value="Sudan">Sudan</option>
          <option value="Suriname">Suriname</option>
          <option value="Sweden">Sweden</option>
          <option value="Switzerland">Switzerland</option>
          <option value="Syria">Syria</option>
          <option value="Taiwan">Taiwan</option>
          <option value="Tajikistan">Tajikistan</option>
          <option value="Tanzania">Tanzania</option>
          <option value="Thailand">Thailand</option>
          <option value="Timor-Leste">Timor-Leste</option>
          <option value="Togo">Togo</option>
          <option value="Tokelau">Tokelau</option>
          <option value="Tonga">Tonga</option>
          <option value="Transnistria Pridnestrovie">Transnistria Pridnestrovie</option>
          <option value="Trinidad and Tobago">Trinidad and Tobago</option>
          <option value="Tristan da Cunha">Tristan da Cunha</option>
          <option value="Tunisia">Tunisia</option>
          <option value="Turkey">Turkey</option>
          <option value="Turkmenistan">Turkmenistan</option>
          <option value="Turks and Caicos Islands">Turks and Caicos Islands</option>
          <option value="Tuvalu">Tuvalu</option>
          <option value="Uganda">Uganda</option>
          <option value="Ukraine">Ukraine</option>
          <option value="United Arab Emirates">United Arab Emirates</option>
          <option value="United Kingdom">United Kingdom</option>
          <option value="United States">United States</option>
          <option value="Uruguay">Uruguay</option>
          <option value="Uzbekistan">Uzbekistan</option>
          <option value="Vanuatu">Vanuatu</option>
          <option value="Vatican City">Vatican City</option>
          <option value="Venezuela">Venezuela</option>
          <option value="Vietnam">Vietnam</option>
          <option value="Western Sahara">Western Sahara</option>
          <option value="Yemen">Yemen</option>
          <option value="Zambia">Zambia</option>
          <option value="Zimbabwe">Zimbabwe</option>
        </select>
        {errors.address_country && <p className="text-red-600 text-sm">{errors.address_country.message as string}</p>}
      </div>
      <div className="mb-6">
        <label className="block mb-1 font-medium">Zipcode <span className="text-red-600">*</span></label>
        <input type="text" {...register('zip_code')} className="w-full border rounded p-2" />
        {errors.zip_code && <p className="text-red-600 text-sm">{errors.zip_code.message as string}</p>}
      </div>
      <div className="mb-6">
        <label className="block mb-1 font-medium">{getTranslation(t, 'formFields.email')} <span className="text-red-600">*</span></label>
        <input type="email" {...register('email')} className="w-full border rounded p-2" placeholder="example@example.com" />
        {errors.email && <p className="text-red-600 text-sm">{errors.email.message as string}</p>}
      </div>
      <div className="mb-6">
        <label className="block mb-1 font-medium">Phone number (including area code) <span className="text-red-600">*</span></label>
        <input type="tel" {...register('phone')} className="w-full border rounded p-2" />
        <span className="text-xs text-gray-500">Favor inserir um número de telefone válido.</span>
        {errors.phone && <p className="text-red-600 text-sm">{errors.phone.message as string}</p>}
      </div>
      <hr className="my-8" />
      <h2 className="text-xl font-bold mb-4">Travel Information</h2>
      <div className="text-sm text-gray-500 mb-4">If you don&apos;t know, you may enter an approximate date/time</div>
      <div className="mb-6">
        <label className="block mb-1 font-medium">{getTranslation(t, 'formFields.doYouKnowTravelDate')} <span className="text-red-600">*</span></label>
        <div className="flex gap-6">
          <label className="inline-flex items-center gap-2">
            <input type="radio" value="No" {...register('do_you_know_travel_date')} /> {getTranslation(t, 'formOptions.no')}
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="radio" value="Yes" {...register('do_you_know_travel_date')} /> {getTranslation(t, 'formOptions.yes')}
          </label>
        </div>
        {errors.do_you_know_travel_date && <p className="text-red-600 text-sm">{errors.do_you_know_travel_date.message as string}</p>}
      </div>
      {knowsTravelDate === 'Yes' && (
        <div className="mb-6">
          <label className="block mb-1 font-medium">WHEN DO YOU PLAN TO TRAVEL TO CANADA? <span className="text-red-600">*</span></label>
          <div className="flex gap-2">
            <select {...register('travel_date_month')} className="w-32 border rounded p-2">
              <option value="">{getTranslation(t, 'common.month')}</option>
              {months.map((month, index) => <option key={month} value={monthNumbers[index]}>{month}</option>)}
            </select>
            <select {...register('travel_date_day')} className="w-16 border rounded p-2">
              <option value="">{getTranslation(t, 'common.day')}</option>
              {days.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <select {...register('travel_date_year')} className="w-24 border rounded p-2">
              <option value="">{getTranslation(t, 'common.year')}</option>
              {getFutureYearOptions(currentYear, currentYear + 5).map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          {(errors.travel_date_month || errors.travel_date_day || errors.travel_date_year) && <p className="text-red-600 text-sm">Please enter a valid date</p>}
        </div>
      )}
      <div className="mb-8 mt-8">
        <h2 className="text-xl font-bold mb-4">Consent And Declaration</h2>
        <div className="mb-4 text-gray-700 text-sm">
          Declaration of Applicant: The information I have provided in this application is truthful, complete and correct. I understand that misrepresentation is an offence under section 127 of the <a href="https://laws-lois.justice.gc.ca/eng/annualstatutes/2001_27/FullText.html" target="_blank" rel="nofollow" className="underline">Immigration and Refugee Protection Act</a> and may result in a finding of inadmissibility to Canada or removal from Canada. I also do agree that by checking the box below and clicking submit, I am electronically signing this application.
        </div>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" {...register('consent_declaration')} className="form-checkbox" />
          <span>I agree</span>
        </label>
        {errors.consent_declaration && <p className="text-red-600 text-sm">{errors.consent_declaration.message as string}</p>}
      </div>
    </div>
  )
}