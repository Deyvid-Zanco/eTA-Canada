"use client";

import React from 'react';
import { useFormContext } from 'react-hook-form';
import Image from 'next/image';

const usVisaNationalities = [ 'Mexico', 'Brazil', 'Costa Rica', 'Panama', 'Philippines', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Seychelles', 'Thailand', 'Trinidad and Tobago', 'Uruguay', 'Antigua and Barbuda', 'Morocco', 'Argentina' ];
const currentYear = new Date().getFullYear();
const monthNumbers = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));

function getYearOptions(start: number, end: number) {
  const years = [];
  for (let y = start; y >= end; y--) years.push(y);
  return years;
}

function getFutureYearOptions(start: number, end: number) {
  const years = [];
  for (let y = start; y <= end; y++) years.push(y);
  return years;
}

type TranslationObject = {
  [key: string]: string | TranslationObject;
};

interface Step1Props {
  t: TranslationObject;
  isEligible: boolean;
  onNationalityChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
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

export const Step1PassportDetails = ({ t, isEligible, onNationalityChange }: Step1Props) => {
  const { register, watch, formState: { errors, dirtyFields }, trigger } = useFormContext();

  const nationality = watch('nationality');
  const passportNumberConfirm = watch('passport_number_confirm');
  const usVisaNumberConfirm = watch('us_visa_number_confirm');

  const showTaiwanID = nationality === 'Taiwan (holders of passports containing a personal identification number)';
  const showUSVisaFields = usVisaNationalities.includes(nationality);
  const showMexicoVisaImage = nationality === 'Mexico';
  const showArgentinaVisaImage = showUSVisaFields && !showMexicoVisaImage;
  
  const months = [ getTranslation(t, 'common.january'), getTranslation(t, 'common.february'), getTranslation(t, 'common.march'), getTranslation(t, 'common.april'), getTranslation(t, 'common.may'), getTranslation(t, 'common.june'), getTranslation(t, 'common.july'), getTranslation(t, 'common.august'), getTranslation(t, 'common.september'), getTranslation(t, 'common.october'), getTranslation(t, 'common.november'), getTranslation(t, 'common.december') ];

  React.useEffect(() => {
    if (dirtyFields.passport_number) {
      trigger("passport_number_confirm");
    }
  }, [passportNumberConfirm, dirtyFields.passport_number, trigger]);

  React.useEffect(() => {
    if (dirtyFields.us_visa_number) {
      trigger("us_visa_number_confirm");
    }
  }, [usVisaNumberConfirm, dirtyFields.us_visa_number, trigger]);

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Passport details of applicant</h2>
      <div className="mb-6 relative">
        <label className="block mb-1 font-medium">{getTranslation(t, 'formFields.travelDocument')} <span className="text-red-600">*</span></label>
        <select {...register('travel_document')} className="w-full border rounded p-2 relative z-10" required>
          <option value="">{getTranslation(t, 'common.pleaseSelect')}</option>
          <option value="Passport - ordinary/regular">{getTranslation(t, 'travelDocuments.passportOrdinary')}</option>
          <option value="Passport - diplomatic">{getTranslation(t, 'travelDocuments.passportDiplomatic')}</option>
          <option value="Passport - official">{getTranslation(t, 'travelDocuments.passportOfficial')}</option>
          <option value="Passport - service">{getTranslation(t, 'travelDocuments.passportService')}</option>
          <option value="Emergency/temporary travel document">{getTranslation(t, 'travelDocuments.emergencyTemporary')}</option>
          <option value="Refugee travel document">{getTranslation(t, 'travelDocuments.refugeeTravel')}</option>
          <option value="Alien passport/travel document issued for non-citizens">{getTranslation(t, 'travelDocuments.alienPassport')}</option>
          <option value="Permit to re-enter the United States (I-327)">{getTranslation(t, 'travelDocuments.permitReenter')}</option>
          <option value="U.S. Refugee travel document (I-571)">{getTranslation(t, 'travelDocuments.usRefugeeTravel')}</option>
        </select>
        {errors.travel_document && <p className="text-red-600 text-sm">{errors.travel_document.message as string}</p>}
      </div>
      <div className="mb-6 relative">
        <label className="block mb-1 font-medium">{getTranslation(t, 'formFields.nationality')} <span className="text-red-600">*</span></label>
        <select {...register('nationality')} onChange={onNationalityChange} className="w-full border rounded p-2 relative z-10" required>
          <option value="">{getTranslation(t, 'common.pleaseSelect')}</option>
          <option value="Andorra">{getTranslation(t, 'nationalities.andorra')}</option>
          <option value="Antigua and Barbuda">{getTranslation(t, 'nationalities.antiguaBarbuda')}</option>
          <option value="Argentina">{getTranslation(t, 'nationalities.argentina')}</option>
          <option value="Australia">{getTranslation(t, 'nationalities.australia')}</option>
          <option value="Austria">{getTranslation(t, 'nationalities.austria')}</option>
          <option value="Bahamas">{getTranslation(t, 'nationalities.bahamas')}</option>
          <option value="Barbados">{getTranslation(t, 'nationalities.barbados')}</option>
          <option value="Belgium">{getTranslation(t, 'nationalities.belgium')}</option>
          <option value="Brazil">{getTranslation(t, 'nationalities.brazil')}</option>
          <option value="Bulgaria">{getTranslation(t, 'nationalities.bulgaria')}</option>
          <option value="Brunei Darussalam">{getTranslation(t, 'nationalities.bruneiDarussalam')}</option>
          <option value="Chile">{getTranslation(t, 'nationalities.chile')}</option>
          <option value="China (Hong Kong SAR)">{getTranslation(t, 'nationalities.chinaHongKong')}</option>
          <option value="Croatia">{getTranslation(t, 'nationalities.croatia')}</option>
          <option value="Costa Rica">{getTranslation(t, 'nationalities.costaRica')}</option>
          <option value="Cyprus">{getTranslation(t, 'nationalities.cyprus')}</option>
          <option value="Czech Republic">{getTranslation(t, 'nationalities.czechRepublic')}</option>
          <option value="Denmark">{getTranslation(t, 'nationalities.denmark')}</option>
          <option value="Estonia">{getTranslation(t, 'nationalities.estonia')}</option>
          <option value="Finland">{getTranslation(t, 'nationalities.finland')}</option>
          <option value="France">{getTranslation(t, 'nationalities.france')}</option>
          <option value="Germany">{getTranslation(t, 'nationalities.germany')}</option>
          <option value="Greece">{getTranslation(t, 'nationalities.greece')}</option>
          <option value="Hungary">{getTranslation(t, 'nationalities.hungary')}</option>
          <option value="Iceland">{getTranslation(t, 'nationalities.iceland')}</option>
          <option value="Ireland">{getTranslation(t, 'nationalities.ireland')}</option>
          <option value="Israel (holders of Israeli national passports)">{getTranslation(t, 'nationalities.israel')}</option>
          <option value="Italy">{getTranslation(t, 'nationalities.italy')}</option>
          <option value="Japan">{getTranslation(t, 'nationalities.japan')}</option>
          <option value="Latvia">{getTranslation(t, 'nationalities.latvia')}</option>
          <option value="Liechtenstein">{getTranslation(t, 'nationalities.liechtenstein')}</option>
          <option value="Lithuania">{getTranslation(t, 'nationalities.lithuania')}</option>
          <option value="Luxembourg">{getTranslation(t, 'nationalities.luxembourg')}</option>
          <option value="Malta">{getTranslation(t, 'nationalities.malta')}</option>
          <option value="Mexico">{getTranslation(t, 'nationalities.mexico')}</option>
          <option value="Monaco">{getTranslation(t, 'nationalities.monaco')}</option>
          <option value="Morocco">{getTranslation(t, 'nationalities.morocco')}</option>
          <option value="Norway">{getTranslation(t, 'nationalities.norway')}</option>
          <option value="New Zealand">{getTranslation(t, 'nationalities.newZealand')}</option>
          <option value="Netherlands">{getTranslation(t, 'nationalities.netherlands')}</option>
          <option value="Panama">{getTranslation(t, 'nationalities.panama')}</option>
          <option value="Papua New Guinea">{getTranslation(t, 'nationalities.papuaNewGuinea')}</option>
          <option value="Philippines">{getTranslation(t, 'nationalities.philippines')}</option>
          <option value="Poland">{getTranslation(t, 'nationalities.poland')}</option>
          <option value="Portugal">{getTranslation(t, 'nationalities.portugal')}</option>
          <option value="Saint Kitts and Nevis">{getTranslation(t, 'nationalities.saintKittsNevis')}</option>
          <option value="Saint Lucia">{getTranslation(t, 'nationalities.saintLucia')}</option>
          <option value="Saint Vincent and the Grenadines">{getTranslation(t, 'nationalities.saintVincentGrenadines')}</option>
          <option value="Samoa">{getTranslation(t, 'nationalities.samoa')}</option>
          <option value="San Marino">{getTranslation(t, 'nationalities.sanMarino')}</option>
          <option value="Seychelles">{getTranslation(t, 'nationalities.seychelles')}</option>
          <option value="Singapore">{getTranslation(t, 'nationalities.singapore')}</option>
          <option value="Slovakia">{getTranslation(t, 'nationalities.slovakia')}</option>
          <option value="Slovenia">{getTranslation(t, 'nationalities.slovenia')}</option>
          <option value="Solomon Islands">{getTranslation(t, 'nationalities.solomonIslands')}</option>
          <option value="South Korea">{getTranslation(t, 'nationalities.southKorea')}</option>
          <option value="Spain">{getTranslation(t, 'nationalities.spain')}</option>
          <option value="Sweden">{getTranslation(t, 'nationalities.sweden')}</option>
          <option value="Switzerland">{getTranslation(t, 'nationalities.switzerland')}</option>
          <option value="Thailand">{getTranslation(t, 'nationalities.thailand')}</option>
          <option value="Taiwan (holders of passports containing a personal identification number)">{getTranslation(t, 'nationalities.taiwan')}</option>
          <option value="Trinidad and Tobago">{getTranslation(t, 'nationalities.trinidadTobago')}</option>
          <option value="United Arab Emirates">{getTranslation(t, 'nationalities.uae')}</option>
          <option value="United Kingdom">{getTranslation(t, 'nationalities.uk')}</option>
          <option value="Uruguay">{getTranslation(t, 'nationalities.uruguay')}</option>
          <option value="Vatican (holders of a passport or travel document issued by the Vatican)">{getTranslation(t, 'nationalities.vatican')}</option>
          <option value="OTHER">{getTranslation(t, 'nationalities.other')}</option>
        </select>
        <span className="text-xs text-gray-500">On your passport, look for a field named &quot;Code&quot;, Issuing country&quot;, &quot;Authority&quot; or &quot;Country code&quot;.</span>
        {errors.nationality && <p className="text-red-600 text-sm">{errors.nationality.message as string}</p>}
      </div>
      {!isEligible && (
        <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
          Based on your answers, you cannot apply for an eTA. You may need a visa or other type of travel document to travel to Canada.
        </div>
      )}
      {isEligible && (
        <>
          {showTaiwanID && (
            <div className="mb-6">
              <label className="block mb-1 font-medium">Taiwan National Identification Number <span className="text-red-600">*</span></label>
              <input type="text" {...register('taiwan_id')} className="w-full border rounded p-2" />
              {errors.taiwan_id && <p className="text-red-600 text-sm">{errors.taiwan_id.message as string}</p>}
            </div>
          )}
          {showUSVisaFields && (
            <>
              <div className="mb-2 text-sm text-gray-700">Enter your US visa number. The number is made up of just one letter and seven numbers. Found in the bottom right corner of the visa as in the example below.</div>
              <div className="mb-6">
                <label className="block mb-1 font-medium">{getTranslation(t, 'formFields.usVisaNumber')} <span className="text-red-600">*</span></label>
                <input type="text" {...register('us_visa_number')} className="w-full border rounded p-2" />
                {errors.us_visa_number && <p className="text-red-600 text-sm">{errors.us_visa_number.message as string}</p>}
              </div>
              <div className="mb-6">
                <label className="block mb-1 font-medium">{getTranslation(t, 'formFields.usVisaNumberConfirm')} <span className="text-red-600">*</span></label>
                <input type="text" {...register('us_visa_number_confirm')} className="w-full border rounded p-2" />
                {errors.us_visa_number_confirm && <p className="text-red-600 text-sm">{errors.us_visa_number_confirm.message as string}</p>}
              </div>
              <div className="mb-6">
                <label className="block mb-1 font-medium">DATE OF EXPIRY <span className="text-red-600">*</span></label>
                <div className="flex gap-2">
                  <select {...register('us_visa_expiry_month')} className="w-32 border rounded p-2">
                    <option value="">{getTranslation(t, 'common.month')}</option>
                    {months.map((month, index) => <option key={month} value={monthNumbers[index]}>{month}</option>)}
                  </select>
                  <select {...register('us_visa_expiry_day')} className="w-16 border rounded p-2">
                    <option value="">{getTranslation(t, 'common.day')}</option>
                    {days.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <select {...register('us_visa_expiry_year')} className="w-24 border rounded p-2">
                    <option value="">{getTranslation(t, 'common.year')}</option>
                    {getFutureYearOptions(currentYear, currentYear + 20).map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                {(errors.us_visa_expiry_month || errors.us_visa_expiry_day || errors.us_visa_expiry_year) && <p className="text-red-600 text-sm">Please select a valid expiry date</p>}
              </div>
              <div className="mb-6 flex justify-center">
                {showMexicoVisaImage && (<Image src="https://www.jotform.com/uploads/deyvidzancocontato/form_files/passaporte-mexico.66997689e89017.31889204.png" alt="US Visa Example - Mexico" width={320} height={200} className="max-w-xs rounded shadow" />)}
                {showArgentinaVisaImage && (<Image src="https://www.jotform.com/uploads/deyvidzancocontato/form_files/argentina.66996712cc7e16.63038575.jpg" alt="US Visa Example - Other" width={320} height={200} className="max-w-xs rounded shadow" />)}
              </div>
            </>
          )}
          <div className="mb-6">
            <label className="block mb-1 font-medium">{getTranslation(t, 'formFields.passportNumber')} <span className="text-red-600">*</span></label>
            <input type="text" {...register('passport_number')} className="w-full border rounded p-2" />
            <span className="text-xs text-gray-500">Enter the passport number exactly as it appears on the passport information page.</span>
            {errors.passport_number && <p className="text-red-600 text-sm">{errors.passport_number.message as string}</p>}
          </div>
          <div className="mb-6">
            <label className="block mb-1 font-medium">{getTranslation(t, 'formFields.passportNumberConfirm')} <span className="text-red-600">*</span></label>
            <input type="text" {...register('passport_number_confirm')} className="w-full border rounded p-2" />
            {errors.passport_number_confirm && <p className="text-red-600 text-sm">{errors.passport_number_confirm.message as string}</p>}
          </div>
          <div className="mb-6">
            <label className="block mb-1 font-medium">{getTranslation(t, 'formFields.surname')} <span className="text-red-600">*</span></label>
            <input type="text" {...register('surname')} className="w-full border rounded p-2" />
            <span className="text-xs text-gray-500">Please enter exactly as shown on your passport or identity document.</span>
            {errors.surname && <p className="text-red-600 text-sm">{errors.surname.message as string}</p>}
          </div>
          <div className="mb-6">
            <label className="block mb-1 font-medium">{getTranslation(t, 'formFields.givenName')} <span className="text-red-600">*</span></label>
            <input type="text" {...register('given_name')} className="w-full border rounded p-2" />
            <span className="text-xs text-gray-500">Please enter exactly as shown on your passport or identity document.</span>
            {errors.given_name && <p className="text-red-600 text-sm">{errors.given_name.message as string}</p>}
          </div>
          <div className="mb-6">
            <label className="block mb-1 font-medium">{getTranslation(t, 'formFields.dateOfBirth')} <span className="text-red-600">*</span></label>
            <div className="flex gap-2">
              <select {...register('dob_month')} className="w-32 border rounded p-2">
                <option value="">{getTranslation(t, 'common.month')}</option>
                {months.map((month, index) => <option key={month} value={monthNumbers[index]}>{month}</option>)}
              </select>
              <select {...register('dob_day')} className="w-16 border rounded p-2">
                <option value="">{getTranslation(t, 'common.day')}</option>
                {days.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <select {...register('dob_year')} className="w-24 border rounded p-2">
                <option value="">{getTranslation(t, 'common.year')}</option>
                {getYearOptions(currentYear, 1900).map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            {(errors.dob_month || errors.dob_day || errors.dob_year) && <p className="text-red-600 text-sm">Please enter a valid date of birth</p>}
          </div>
          <div className="mb-6">
            <label className="block mb-1 font-medium">{getTranslation(t, 'formFields.gender')} <span className="text-red-600">*</span></label>
            <select {...register('gender')} className="w-full border rounded p-2">
              <option value="">{getTranslation(t, 'common.pleaseSelect')}</option>
              <option value="Female">{getTranslation(t, 'formOptions.female')}</option>
              <option value="Male">{getTranslation(t, 'formOptions.male')}</option>
              <option value="Other">{getTranslation(t, 'formOptions.other')}</option>
            </select>
            {errors.gender && <p className="text-red-600 text-sm">{errors.gender.message as string}</p>}
          </div>
          <div className="mb-6">
            <label className="block mb-1 font-medium">{getTranslation(t, 'formFields.birthCountry')} <span className="text-red-600">*</span></label>
            <select {...register('birth_country')} className="w-full border rounded p-2">
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
              <option value="Northern Mariana">Northern Mariana</option>
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
              <option value="Sao Tome and Principe">Sao Tome and Principe</option>
              <option value="Saudi Arabia">Saudi Arabia</option>
              <option value="Senegal">Senegal</option>
              <option value="Serbia">Serbia</option>
              <option value="Seychelles">Seychelles</option>
              <option value="Sierra Leone">Sierra Leone</option>
              <option value="Singapore">Singapore</option>
              <option value="Slovakia">Slovakia</option>
              <option value="Slovenia">Slovenia</option>
              <option value="Solomon Islands">Solomon Islands</option>
              <option value="Somalia">Somalia</option>
              <option value="Somaliland">Somaliland</option>
              <option value="South Africa">South Africa</option>
              <option value="South Ossetia">South Ossetia</option>
              <option value="South Sudan">South Sudan</option>
              <option value="Spain">Spain</option>
              <option value="Sri Lanka">Sri Lanka</option>
              <option value="Sudan">Sudan</option>
              <option value="Suriname">Suriname</option>
              <option value="Svalbard">Svalbard</option>
              <option value="eSwatini">eSwatini</option>
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
              <option value="British Virgin Islands">British Virgin Islands</option>
              <option value="Isle of Man">Isle of Man</option>
              <option value="US Virgin Islands">US Virgin Islands</option>
              <option value="Wallis and Futuna">Wallis and Futuna</option>
              <option value="Western Sahara">Western Sahara</option>
              <option value="Yemen">Yemen</option>
              <option value="Zambia">Zambia</option>
              <option value="Zimbabwe">Zimbabwe</option>
            </select>
            {errors.birth_country && <p className="text-red-600 text-sm">{errors.birth_country.message as string}</p>}
          </div>
          <div className="mb-6">
            <label className="block mb-1 font-medium">{getTranslation(t, 'formFields.birthCity')} <span className="text-red-600">*</span></label>
            <input type="text" {...register('birth_city')} className="w-full border rounded p-2" />
            <span className="text-xs text-gray-500">If there is no city/town/village on your passport, enter the name of the city/town/village where you were born.</span>
            {errors.birth_city && <p className="text-red-600 text-sm">{errors.birth_city.message as string}</p>}
          </div>
          <div className="mb-6">
            <label className="block mb-1 font-medium">{getTranslation(t, 'formFields.passportIssueDate')} <span className="text-red-600">*</span></label>
            <div className="flex gap-2">
              <select {...register('passport_issue_month')} className="w-32 border rounded p-2">
                <option value="">{getTranslation(t, 'common.month')}</option>
                {months.map((month, index) => <option key={month} value={monthNumbers[index]}>{month}</option>)}
              </select>
              <select {...register('passport_issue_day')} className="w-16 border rounded p-2">
                <option value="">{getTranslation(t, 'common.day')}</option>
                {days.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <select {...register('passport_issue_year')} className="w-24 border rounded p-2">
                <option value="">{getTranslation(t, 'common.year')}</option>
                {getYearOptions(currentYear, currentYear - 20).map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            {(errors.passport_issue_month || errors.passport_issue_day || errors.passport_issue_year) && <p className="text-red-600 text-sm">Please enter a valid issue date</p>}
          </div>
          <div className="mb-6">
            <label className="block mb-1 font-medium">{getTranslation(t, 'formFields.passportExpiryDate')} <span className="text-red-600">*</span></label>
            <div className="flex gap-2">
              <select {...register('passport_expiry_month')} className="w-32 border rounded p-2">
                <option value="">{getTranslation(t, 'common.month')}</option>
                {months.map((month, index) => <option key={month} value={monthNumbers[index]}>{month}</option>)}
              </select>
              <select {...register('passport_expiry_day')} className="w-16 border rounded p-2">
                <option value="">{getTranslation(t, 'common.day')}</option>
                {days.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <select {...register('passport_expiry_year')} className="w-24 border rounded p-2">
                <option value="">{getTranslation(t, 'common.year')}</option>
                {getFutureYearOptions(currentYear, currentYear + 20).map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            {(errors.passport_expiry_month || errors.passport_expiry_day || errors.passport_expiry_year) && <p className="text-red-600 text-sm">Please enter a valid expiry date</p>}
          </div>
        </>
      )}
    </div>
  )
}