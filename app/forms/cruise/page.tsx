"use client";

import React, { useRef, useCallback, useState, Suspense } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { InferType } from 'yup';
import { cruiseDetailsSchema } from '@/lib/schemas/travelDetailsSchema';
import Webcam from "react-webcam";
import { PhilippinesHeader } from '../../components/Header';
import { PhilippinesFooter } from '../../components/Footer';
import { useSearchParams } from 'next/navigation';
import { COUNTRY_LIST } from '@/lib/constants';
import { getActiveCruiseLines } from '@/lib/cruiselines';
import { DocumentUpload } from '@/app/components/DocumentUpload';
import { useHybridFormPersistence } from '@/lib/hooks/useHybridFormPersistence';

// Add this for TypeScript to recognize grecaptcha on window
declare global {
  interface Window {
    grecaptcha: {
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

type CruiseFormData = InferType<typeof cruiseDetailsSchema>;

const videoConstraints = {
  width: 600,
  height: 480,
  facingMode: "user"
};

// Official Philippine Seaports from government data
const philippineSeaports = [
  { code: "PHBOR", name: "Boracay Seaport" },
  { code: "CLYISL", name: "Calayan Island" },
  { code: "TP128", name: "Claveria" },
  { code: "TP133", name: "Coron" },
  { code: "TP0109", name: "DAVAO TORIL FISHPORT COMPLEX" },
  { code: "TP132", name: "El Nido" },
  { code: "TP137", name: "Holiday Ocean Marina, IGACOS" },
  { code: "TP0106", name: "Lal-lo Seaport" },
  { code: "TP130", name: "Macapagal Port Terminal (MPT)" },
  { code: "TP131", name: "Macapagal Port Terminal Landbase (MPTL)" },
  { code: "TP0103", name: "Manila South Harbor" },
  { code: "ORCISL", name: "Ochid Island" },
  { code: "APARRI", name: "Port of Aparri" },
  { code: "TP119", name: "Port of Bacolod" },
  { code: "PHBSO", name: "Port of Basco" },
  { code: "PHBTN", name: "Port of Bataan (PHBTN)" },
  { code: "TP009", name: "Port of Batangas (PHBTG)" },
  { code: "TP116", name: "Port of Bislig" },
  { code: "PHTAG", name: "Port of Bohol" },
  { code: "TP-BSP", name: "Port of Bongao" },
  { code: "TP0013", name: "Port of Cagayan de Oro" },
  { code: "TP123", name: "Port of Calbayog" },
  { code: "CAMIGUIN", name: "Port of Camiguin" },
  { code: "TP0011", name: "Port of Cebu (PHCEB)" },
  { code: "TP122", name: "Port of Currimao (ONRI)" },
  { code: "TP0114", name: "Port of General Santos" },
  { code: "TP118", name: "Port of Iligan" },
  { code: "TP0015", name: "Port of Iloilo (PHILO)" },
  { code: "PHSAN", name: "Port of Irene" },
  { code: "TP0105", name: "Port of Laoag" },
  { code: "TP120", name: "Port of Legazpi" },
  { code: "LEGAZPI", name: "Port of Legazpi" },
  { code: "TP125", name: "Port of Masinloc" },
  { code: "TP121", name: "Port of Pangasinan" },
  { code: "TP0102", name: "Port of Puerto Princesa" },
  { code: "TP0101", name: "Port of Sasa, Davao Seaport" },
  { code: "TP124", name: "Port of Sta Cruz" },
  { code: "TP117", name: "Port of Surigao" },
  { code: "RMBLN", name: "Romblon" },
  { code: "TP129", name: "Salomague Port" },
  { code: "TP0107", name: "San Fernando International Seaport" },
  { code: "TP0017", name: "San Fernando, Luzon (PHSFE)" },
  { code: "TP0016", name: "Subic Bay (PHSFS)" },
  { code: "TP126", name: "Subic Bay Yacht Club" },
  { code: "TP136", name: "Subport of Sual" },
  { code: "TP0111", name: "Tabacco Seaport" },
  { code: "TP0113", name: "Tacloban Seaport" },
  { code: "TP0108", name: "Zamboanga Port" }
];

const purposeOfTravelOptions = [
  { value: "OFW", label: "OFW (Overseas Filipino Worker)" },
  { value: "business_professional", label: "Business/Professional" },
  { value: "convention_conference", label: "Convention/Conference" },
  { value: "education_training", label: "Education/Training/Studies" },
  { value: "government_official", label: "Government/Official Mission" },
  { value: "health_medical", label: "Health/Medical Reason" },
  { value: "holiday_vacation", label: "Holiday/Pleasure/Vacation" },
  { value: "incentive", label: "Incentive" },
  { value: "meetings", label: "Meetings" },
  { value: "others", label: "Others" },
  { value: "religion_pilgrimage", label: "Religion/Pilgrimage" },
  { value: "returning_resident", label: "Returning Resident" },
  { value: "trade_fair", label: "Trade Fair/Exhibition" },
  { value: "transit", label: "Transit" },
  { value: "visit_friends", label: "Visit Friends/Relatives" },
  { value: "work_employment", label: "Work/Employment" }
];

// Using the existing predetermined occupation options from Philippines forms
const occupationOptions = [
  "Agriculture",
  "Airline Crew",
  "Businessman",
  "Clerical/Sales",
  "Diplomat",
  "Domestic Helper",
  "Entertainer",
  "Housewife",
  "Military",
  "Professional/Technical/Administrative",
  "Retired",
  "Seaman",
  "Student/Minor",
  "Unemployed",
  "Worker/Laborer"
];

// Using comprehensive country list from constants
const countries = COUNTRY_LIST;
const activeCruiseLines = getActiveCruiseLines();

const suffixOptions = [
  "", "Jr.", "Sr.", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"
];

// Country code to flag emoji mapping for reliable display
const countryFlags: { [key: string]: string } = {
  'AF': '🇦🇫', 'AL': '🇦🇱', 'DZ': '🇩🇿', 'AD': '🇦🇩', 'AO': '🇦🇴', 'AR': '🇦🇷', 'AM': '🇦🇲', 'AU': '🇦🇺', 'AT': '🇦🇹', 'AZ': '🇦🇿',
  'BH': '🇧🇭', 'BD': '🇧🇩', 'BY': '🇧🇾', 'BE': '🇧🇪', 'BZ': '🇧🇿', 'BJ': '🇧🇯', 'BT': '🇧🇹', 'BO': '🇧🇴', 'BA': '🇧🇦', 'BW': '🇧🇼',
  'BR': '🇧🇷', 'BN': '🇧🇳', 'BG': '🇧🇬', 'BF': '🇧🇫', 'BI': '🇧🇮', 'KH': '🇰🇭', 'CM': '🇨🇲', 'CA': '🇨🇦', 'CV': '🇨🇻', 'CF': '🇨🇫',
  'TD': '🇹🇩', 'CL': '🇨🇱', 'CN': '🇨🇳', 'CO': '🇨🇴', 'KM': '🇰🇲', 'CG': '🇨🇬', 'CD': '🇨🇩', 'CR': '🇨🇷', 'CI': '🇨🇮', 'HR': '🇭🇷',
  'CU': '🇨🇺', 'CY': '🇨🇾', 'CZ': '🇨🇿', 'DK': '🇩🇰', 'DJ': '🇩🇯', 'DM': '🇩🇲', 'DO': '🇩🇴', 'EC': '🇪🇨', 'EG': '🇪🇬', 'SV': '🇸🇻',
  'GQ': '🇬🇶', 'ER': '🇪🇷', 'EE': '🇪🇪', 'ET': '🇪🇹', 'FJ': '🇫🇯', 'FI': '🇫🇮', 'FR': '🇫🇷', 'GA': '🇬🇦', 'GM': '🇬🇲', 'GE': '🇬🇪',
  'DE': '🇩🇪', 'GH': '🇬🇭', 'GR': '🇬🇷', 'GD': '🇬🇩', 'GT': '🇬🇹', 'GN': '🇬🇳', 'GW': '🇬🇼', 'GY': '🇬🇾', 'HT': '🇭🇹', 'HN': '🇭🇳',
  'HU': '🇭🇺', 'IS': '🇮🇸', 'IN': '🇮🇳', 'ID': '🇮🇩', 'IR': '🇮🇷', 'IQ': '🇮🇶', 'IE': '🇮🇪', 'IL': '🇮🇱', 'IT': '🇮🇹', 'JM': '🇯🇲',
  'JP': '🇯🇵', 'JO': '🇯🇴', 'KZ': '🇰🇿', 'KE': '🇰🇪', 'KI': '🇰🇮', 'KP': '🇰🇵', 'KR': '🇰🇷', 'KW': '🇰🇼', 'KG': '🇰🇬', 'LA': '🇱🇦',
  'LV': '🇱🇻', 'LB': '🇱🇧', 'LS': '🇱🇸', 'LR': '🇱🇷', 'LY': '🇱🇾', 'LI': '🇱🇮', 'LT': '🇱🇹', 'LU': '🇱🇺', 'MO': '🇲🇴', 'MK': '🇲🇰',
  'MG': '🇲🇬', 'MW': '🇲🇼', 'MY': '🇲🇾', 'MV': '🇲🇻', 'ML': '🇲🇱', 'MT': '🇲🇹', 'MH': '🇲🇭', 'MR': '🇲🇷', 'MU': '🇲🇺', 'MX': '🇲🇽',
  'FM': '🇫🇲', 'MD': '🇲🇩', 'MC': '🇲🇨', 'MN': '🇲🇳', 'ME': '🇲🇪', 'MA': '🇲🇦', 'MZ': '🇲🇿', 'MM': '🇲🇲', 'NA': '🇳🇦', 'NR': '🇳🇷',
  'NP': '🇳🇵', 'NL': '🇳🇱', 'NZ': '🇳🇿', 'NI': '🇳🇮', 'NE': '🇳🇪', 'NG': '🇳🇬', 'NO': '🇳🇴', 'OM': '🇴🇲', 'PK': '🇵🇰', 'PW': '🇵🇼',
  'PA': '🇵🇦', 'PG': '🇵🇬', 'PY': '🇵🇾', 'PE': '🇵🇪', 'PH': '🇵🇭', 'PL': '🇵🇱', 'PT': '🇵🇹', 'QA': '🇶🇦', 'RO': '🇷🇴', 'RU': '🇷🇺',
  'RW': '🇷🇼', 'KN': '🇰🇳', 'LC': '🇱🇨', 'VC': '🇻🇨', 'WS': '🇼🇸', 'SM': '🇸🇲', 'ST': '🇸🇹', 'SA': '🇸🇦', 'SN': '🇸🇳', 'RS': '🇷🇸',
  'SC': '🇸🇨', 'SL': '🇸🇱', 'SG': '🇸🇬', 'SK': '🇸🇰', 'SI': '🇸🇮', 'SB': '🇸🇧', 'SO': '🇸🇴', 'ZA': '🇿🇦', 'SS': '🇸🇸', 'ES': '🇪🇸',
  'LK': '🇱🇰', 'SD': '🇸🇩', 'SR': '🇸🇷', 'SZ': '🇸🇿', 'SE': '🇸🇪', 'CH': '🇨🇭', 'SY': '🇸🇾', 'TW': '🇹🇼', 'TJ': '🇹🇯', 'TZ': '🇹🇿',
  'TH': '🇹🇭', 'TL': '🇹🇱', 'TG': '🇹🇬', 'TO': '🇹🇴', 'TT': '🇹🇹', 'TN': '🇹🇳', 'TR': '🇹🇷', 'TM': '🇹🇲', 'TV': '🇹🇻', 'UG': '🇺🇬',
  'UA': '🇺🇦', 'AE': '🇦🇪', 'GB': '🇬🇧', 'US': '🇺🇸', 'UY': '🇺🇾', 'UZ': '🇺🇿', 'VU': '🇻🇺', 'VE': '🇻🇪', 'VN': '🇻🇳', 'YE': '🇾🇪',
  'ZM': '🇿🇲', 'ZW': '🇿🇼'
};

const mobileCountryCodes = [
  { code: '+93', country: 'AF', name: 'Afghanistan' },
  { code: '+355', country: 'AL', name: 'Albania' },
  { code: '+213', country: 'DZ', name: 'Algeria' },
  { code: '+376', country: 'AD', name: 'Andorra' },
  { code: '+244', country: 'AO', name: 'Angola' },
  { code: '+54', country: 'AR', name: 'Argentina' },
  { code: '+374', country: 'AM', name: 'Armenia' },
  { code: '+61', country: 'AU', name: 'Australia' },
  { code: '+43', country: 'AT', name: 'Austria' },
  { code: '+994', country: 'AZ', name: 'Azerbaijan' },
  { code: '+973', country: 'BH', name: 'Bahrain' },
  { code: '+880', country: 'BD', name: 'Bangladesh' },
  { code: '+375', country: 'BY', name: 'Belarus' },
  { code: '+32', country: 'BE', name: 'Belgium' },
  { code: '+501', country: 'BZ', name: 'Belize' },
  { code: '+229', country: 'BJ', name: 'Benin' },
  { code: '+975', country: 'BT', name: 'Bhutan' },
  { code: '+591', country: 'BO', name: 'Bolivia' },
  { code: '+387', country: 'BA', name: 'Bosnia and Herzegovina' },
  { code: '+267', country: 'BW', name: 'Botswana' },
  { code: '+55', country: 'BR', name: 'Brazil' },
  { code: '+673', country: 'BN', name: 'Brunei' },
  { code: '+359', country: 'BG', name: 'Bulgaria' },
  { code: '+226', country: 'BF', name: 'Burkina Faso' },
  { code: '+257', country: 'BI', name: 'Burundi' },
  { code: '+855', country: 'KH', name: 'Cambodia' },
  { code: '+237', country: 'CM', name: 'Cameroon' },
  { code: '+1', country: 'CA', name: 'Canada' },
  { code: '+238', country: 'CV', name: 'Cape Verde' },
  { code: '+236', country: 'CF', name: 'Central African Republic' },
  { code: '+235', country: 'TD', name: 'Chad' },
  { code: '+56', country: 'CL', name: 'Chile' },
  { code: '+86', country: 'CN', name: 'China' },
  { code: '+57', country: 'CO', name: 'Colombia' },
  { code: '+269', country: 'KM', name: 'Comoros' },
  { code: '+242', country: 'CG', name: 'Congo' },
  { code: '+243', country: 'CD', name: 'Democratic Republic of the Congo' },
  { code: '+506', country: 'CR', name: 'Costa Rica' },
  { code: '+225', country: 'CI', name: 'Cote d\'Ivoire' },
  { code: '+385', country: 'HR', name: 'Croatia' },
  { code: '+53', country: 'CU', name: 'Cuba' },
  { code: '+357', country: 'CY', name: 'Cyprus' },
  { code: '+420', country: 'CZ', name: 'Czech Republic' },
  { code: '+45', country: 'DK', name: 'Denmark' },
  { code: '+253', country: 'DJ', name: 'Djibouti' },
  { code: '+1767', country: 'DM', name: 'Dominica' },
  { code: '+1809', country: 'DO', name: 'Dominican Republic' },
  { code: '+593', country: 'EC', name: 'Ecuador' },
  { code: '+20', country: 'EG', name: 'Egypt' },
  { code: '+503', country: 'SV', name: 'El Salvador' },
  { code: '+240', country: 'GQ', name: 'Equatorial Guinea' },
  { code: '+291', country: 'ER', name: 'Eritrea' },
  { code: '+372', country: 'EE', name: 'Estonia' },
  { code: '+251', country: 'ET', name: 'Ethiopia' },
  { code: '+679', country: 'FJ', name: 'Fiji' },
  { code: '+358', country: 'FI', name: 'Finland' },
  { code: '+33', country: 'FR', name: 'France' },
  { code: '+241', country: 'GA', name: 'Gabon' },
  { code: '+220', country: 'GM', name: 'Gambia' },
  { code: '+995', country: 'GE', name: 'Georgia' },
  { code: '+49', country: 'DE', name: 'Germany' },
  { code: '+233', country: 'GH', name: 'Ghana' },
  { code: '+30', country: 'GR', name: 'Greece' },
  { code: '+1473', country: 'GD', name: 'Grenada' },
  { code: '+502', country: 'GT', name: 'Guatemala' },
  { code: '+224', country: 'GN', name: 'Guinea' },
  { code: '+245', country: 'GW', name: 'Guinea-Bissau' },
  { code: '+592', country: 'GY', name: 'Guyana' },
  { code: '+509', country: 'HT', name: 'Haiti' },
  { code: '+504', country: 'HN', name: 'Honduras' },
  { code: '+36', country: 'HU', name: 'Hungary' },
  { code: '+354', country: 'IS', name: 'Iceland' },
  { code: '+91', country: 'IN', name: 'India' },
  { code: '+62', country: 'ID', name: 'Indonesia' },
  { code: '+98', country: 'IR', name: 'Iran' },
  { code: '+964', country: 'IQ', name: 'Iraq' },
  { code: '+353', country: 'IE', name: 'Ireland' },
  { code: '+972', country: 'IL', name: 'Israel' },
  { code: '+39', country: 'IT', name: 'Italy' },
  { code: '+1876', country: 'JM', name: 'Jamaica' },
  { code: '+81', country: 'JP', name: 'Japan' },
  { code: '+962', country: 'JO', name: 'Jordan' },
  { code: '+7', country: 'KZ', name: 'Kazakhstan' },
  { code: '+254', country: 'KE', name: 'Kenya' },
  { code: '+686', country: 'KI', name: 'Kiribati' },
  { code: '+850', country: 'KP', name: 'North Korea' },
  { code: '+82', country: 'KR', name: 'South Korea' },
  { code: '+965', country: 'KW', name: 'Kuwait' },
  { code: '+996', country: 'KG', name: 'Kyrgyzstan' },
  { code: '+856', country: 'LA', name: 'Laos' },
  { code: '+371', country: 'LV', name: 'Latvia' },
  { code: '+961', country: 'LB', name: 'Lebanon' },
  { code: '+266', country: 'LS', name: 'Lesotho' },
  { code: '+231', country: 'LR', name: 'Liberia' },
  { code: '+218', country: 'LY', name: 'Libya' },
  { code: '+423', country: 'LI', name: 'Liechtenstein' },
  { code: '+370', country: 'LT', name: 'Lithuania' },
  { code: '+352', country: 'LU', name: 'Luxembourg' },
  { code: '+853', country: 'MO', name: 'Macao' },
  { code: '+389', country: 'MK', name: 'North Macedonia' },
  { code: '+261', country: 'MG', name: 'Madagascar' },
  { code: '+265', country: 'MW', name: 'Malawi' },
  { code: '+60', country: 'MY', name: 'Malaysia' },
  { code: '+960', country: 'MV', name: 'Maldives' },
  { code: '+223', country: 'ML', name: 'Mali' },
  { code: '+356', country: 'MT', name: 'Malta' },
  { code: '+692', country: 'MH', name: 'Marshall Islands' },
  { code: '+222', country: 'MR', name: 'Mauritania' },
  { code: '+230', country: 'MU', name: 'Mauritius' },
  { code: '+52', country: 'MX', name: 'Mexico' },
  { code: '+691', country: 'FM', name: 'Micronesia' },
  { code: '+373', country: 'MD', name: 'Moldova' },
  { code: '+377', country: 'MC', name: 'Monaco' },
  { code: '+976', country: 'MN', name: 'Mongolia' },
  { code: '+382', country: 'ME', name: 'Montenegro' },
  { code: '+212', country: 'MA', name: 'Morocco' },
  { code: '+258', country: 'MZ', name: 'Mozambique' },
  { code: '+95', country: 'MM', name: 'Myanmar' },
  { code: '+264', country: 'NA', name: 'Namibia' },
  { code: '+674', country: 'NR', name: 'Nauru' },
  { code: '+977', country: 'NP', name: 'Nepal' },
  { code: '+31', country: 'NL', name: 'Netherlands' },
  { code: '+64', country: 'NZ', name: 'New Zealand' },
  { code: '+505', country: 'NI', name: 'Nicaragua' },
  { code: '+227', country: 'NE', name: 'Niger' },
  { code: '+234', country: 'NG', name: 'Nigeria' },
  { code: '+47', country: 'NO', name: 'Norway' },
  { code: '+968', country: 'OM', name: 'Oman' },
  { code: '+92', country: 'PK', name: 'Pakistan' },
  { code: '+680', country: 'PW', name: 'Palau' },
  { code: '+507', country: 'PA', name: 'Panama' },
  { code: '+675', country: 'PG', name: 'Papua New Guinea' },
  { code: '+595', country: 'PY', name: 'Paraguay' },
  { code: '+51', country: 'PE', name: 'Peru' },
  { code: '+63', country: 'PH', name: 'Philippines' },
  { code: '+48', country: 'PL', name: 'Poland' },
  { code: '+351', country: 'PT', name: 'Portugal' },
  { code: '+974', country: 'QA', name: 'Qatar' },
  { code: '+40', country: 'RO', name: 'Romania' },
  { code: '+7', country: 'RU', name: 'Russia' },
  { code: '+250', country: 'RW', name: 'Rwanda' },
  { code: '+1869', country: 'KN', name: 'Saint Kitts and Nevis' },
  { code: '+1758', country: 'LC', name: 'Saint Lucia' },
  { code: '+1784', country: 'VC', name: 'Saint Vincent and the Grenadines' },
  { code: '+685', country: 'WS', name: 'Samoa' },
  { code: '+378', country: 'SM', name: 'San Marino' },
  { code: '+239', country: 'ST', name: 'Sao Tome and Principe' },
  { code: '+966', country: 'SA', name: 'Saudi Arabia' },
  { code: '+221', country: 'SN', name: 'Senegal' },
  { code: '+381', country: 'RS', name: 'Serbia' },
  { code: '+248', country: 'SC', name: 'Seychelles' },
  { code: '+232', country: 'SL', name: 'Sierra Leone' },
  { code: '+65', country: 'SG', name: 'Singapore' },
  { code: '+421', country: 'SK', name: 'Slovakia' },
  { code: '+386', country: 'SI', name: 'Slovenia' },
  { code: '+677', country: 'SB', name: 'Solomon Islands' },
  { code: '+252', country: 'SO', name: 'Somalia' },
  { code: '+27', country: 'ZA', name: 'South Africa' },
  { code: '+211', country: 'SS', name: 'South Sudan' },
  { code: '+34', country: 'ES', name: 'Spain' },
  { code: '+94', country: 'LK', name: 'Sri Lanka' },
  { code: '+249', country: 'SD', name: 'Sudan' },
  { code: '+597', country: 'SR', name: 'Suriname' },
  { code: '+268', country: 'SZ', name: 'Eswatini' },
  { code: '+46', country: 'SE', name: 'Sweden' },
  { code: '+41', country: 'CH', name: 'Switzerland' },
  { code: '+963', country: 'SY', name: 'Syria' },
  { code: '+886', country: 'TW', name: 'Taiwan' },
  { code: '+992', country: 'TJ', name: 'Tajikistan' },
  { code: '+255', country: 'TZ', name: 'Tanzania' },
  { code: '+66', country: 'TH', name: 'Thailand' },
  { code: '+670', country: 'TL', name: 'Timor-Leste' },
  { code: '+228', country: 'TG', name: 'Togo' },
  { code: '+676', country: 'TO', name: 'Tonga' },
  { code: '+1868', country: 'TT', name: 'Trinidad and Tobago' },
  { code: '+216', country: 'TN', name: 'Tunisia' },
  { code: '+90', country: 'TR', name: 'Turkey' },
  { code: '+993', country: 'TM', name: 'Turkmenistan' },
  { code: '+688', country: 'TV', name: 'Tuvalu' },
  { code: '+256', country: 'UG', name: 'Uganda' },
  { code: '+380', country: 'UA', name: 'Ukraine' },
  { code: '+971', country: 'AE', name: 'United Arab Emirates' },
  { code: '+44', country: 'GB', name: 'United Kingdom' },
  { code: '+1', country: 'US', name: 'United States' },
  { code: '+598', country: 'UY', name: 'Uruguay' },
  { code: '+998', country: 'UZ', name: 'Uzbekistan' },
  { code: '+678', country: 'VU', name: 'Vanuatu' },
  { code: '+58', country: 'VE', name: 'Venezuela' },
  { code: '+84', country: 'VN', name: 'Vietnam' },
  { code: '+967', country: 'YE', name: 'Yemen' },
  { code: '+260', country: 'ZM', name: 'Zambia' },
  { code: '+263', country: 'ZW', name: 'Zimbabwe' }
];

function CruiseFormContent() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitMessage, setSubmitMessage] = React.useState('');
   const [showErrorBanner, setShowErrorBanner] = React.useState(false);
  const [showWebcam, setShowWebcam] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [otherGoodsItems, setOtherGoodsItems] = useState<{id: string; quantity: number; description: string; amountUSD: number}[]>([]);
  const [gamblingItems, setGamblingItems] = useState<{id: string; quantity: number; description: string; amountUSD: number}[]>([]);
  const [cosmeticsItems, setCosmeticsItems] = useState<{id: string; quantity: number; description: string; amountUSD: number}[]>([]);
  const [drugsItems, setDrugsItems] = useState<{id: string; quantity: number; description: string; amountUSD: number}[]>([]);
  const [firearmsItems, setFirearmsItems] = useState<{id: string; quantity: number; description: string; amountUSD: number}[]>([]);
  const [alcoholItems, setAlcoholItems] = useState<{id: string; quantity: number; description: string; amountUSD: number}[]>([]);
  const [foodstuffItems, setFoodstuffItems] = useState<{id: string; quantity: number; description: string; amountUSD: number}[]>([]);
  const [mobileItems, setMobileItems] = useState<{id: string; quantity: number; description: string; amountUSD: number}[]>([]);
  const [cremainsItems, setCremainsItems] = useState<{id: string; quantity: number; description: string; amountUSD: number}[]>([]);
  const [jewelryItems, setJewelryItems] = useState<{id: string; quantity: number; description: string; amountUSD: number}[]>([]);
  const [currencyItems, setCurrencyItems] = useState<{id: string; currency: string; monetaryInstrument: string}[]>([]);
  const webcamRef = useRef<Webcam>(null);
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') || 'arrival';
  const isArrival = mode === 'arrival';

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    resetField,
    reset,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(cruiseDetailsSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  // Enhanced form persistence with intelligent storage strategy
  const {
    isLoading: persistenceLoading,
    saveStatus,
    saveError
  } = useHybridFormPersistence({
    formType: 'cruise',
    watch,
    reset,
    mode,
    autoSaveDelay: 5000, // Increased to 5 seconds to reduce save frequency
    maxLocalStorageSize: 2 * 1024 * 1024 // 2MB
  });

  // Update loading state
  React.useEffect(() => {
    setIsLoading(persistenceLoading);
  }, [persistenceLoading]);

  const watchedPicture = watch('picture');
  const watchedDestinationType = watch('destinationType');
  const watchedTravellerType = watch('travellerType');
  const watchedOtherGoods = watch('otherGoods');
  const watchedBaggageDeclaration = watch('hasBaggageTodeclare');
  const watchedGambling = watch('gamblingParaphernalia');
  const watchedCosmetics = watch('cosmeticsExcess');
  const watchedDrugs = watch('dangerousDrugs');
  const watchedFirearms = watch('firearmsExplosives');
  const watchedAlcohol = watch('alcoholTobacco');
  const watchedFoodstuff = watch('foodstuffAnimals');
  const watchedMobile = watch('mobileRadioExcess');
  const watchedCremains = watch('cremains');
  const watchedJewelry = watch('jewelry');
  const watchedCurrencyNotApplicable = watch('currencyNotApplicable');
  const watchedSourceOther = watch('sourceOther');
  const watchedPurposeOther = watch('purposeOther');

  // Generic helper functions for managing item arrays
  type ItemState = typeof otherGoodsItems;
  type ItemSetter = typeof setOtherGoodsItems;

  const createItemHelpers = (setter: ItemSetter) => ({
    add: () => setter(prev => [...prev, { id: Date.now().toString() + Math.random(), quantity: 1, description: '', amountUSD: 0 }]),
    update: (index: number, field: keyof ItemState[0], value: string | number) => 
      setter(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item)),
    remove: (index: number) => setter(prev => prev.filter((_, i) => i !== index))
  });

  const otherGoodsHelpers = createItemHelpers(setOtherGoodsItems);
  const gamblingHelpers = createItemHelpers(setGamblingItems);
  const cosmeticsHelpers = createItemHelpers(setCosmeticsItems);
  const drugsHelpers = createItemHelpers(setDrugsItems);
  const firearmsHelpers = createItemHelpers(setFirearmsItems);
  const alcoholHelpers = createItemHelpers(setAlcoholItems);
  const foodstuffHelpers = createItemHelpers(setFoodstuffItems);
  const mobileHelpers = createItemHelpers(setMobileItems);
  const cremainsHelpers = createItemHelpers(setCremainsItems);
  const jewelryHelpers = createItemHelpers(setJewelryItems);

  // Currency items helpers (different structure)
  const addCurrencyItem = () => {
    setCurrencyItems(prev => [...prev, { id: Date.now().toString() + Math.random(), currency: '', monetaryInstrument: '' }]);
  };

  const updateCurrencyItem = (index: number, field: 'currency' | 'monetaryInstrument', value: string) => {
    setCurrencyItems(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const removeCurrencyItem = (index: number) => {
    setCurrencyItems(prev => prev.filter((_, i) => i !== index));
  };

  // Update form data when arrays change
  React.useEffect(() => {
    setValue('otherGoodsItems', otherGoodsItems);
    setValue('currencyItems', currencyItems);
  }, [otherGoodsItems, currencyItems, setValue]);


  // Reusable table component
  const ItemTable = ({ 
    items, 
    helpers
  }: { 
    items: ItemState; 
    helpers: ReturnType<typeof createItemHelpers>;
  }) => (
    <div className="mt-4">
      <p className="text-blue-600 text-sm mb-3">If YES, please enumerate.</p>
      
      <button 
        type="button"
        onClick={helpers.add}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700"
      >
        Add Item
      </button>

      {items.length > 0 && (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium">Quantity</th>
                <th className="px-4 py-2 text-left font-medium">Description</th>
                <th className="px-4 py-2 text-left font-medium">Amount in USD</th>
                <th className="px-4 py-2 text-left font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.id} className="border-t">
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => helpers.update(index, 'quantity', parseInt(e.target.value) || 1)}
                      className="w-20 border rounded p-1"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => helpers.update(index, 'description', e.target.value)}
                      className="w-full border rounded p-1"
                      placeholder="Item description"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.amountUSD}
                      onChange={(e) => helpers.update(index, 'amountUSD', parseFloat(e.target.value) || 0)}
                      className="w-24 border rounded p-1"
                      placeholder="0.00"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <button
                      type="button"
                      onClick={() => helpers.remove(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const currentYear = new Date().getFullYear();
  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" }
  ];
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
  const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i);
  const futureYears = Array.from({ length: 20 }, (_, i) => currentYear + i + 1);
  
  // Travel date years - these are INTENDED travel dates for future travel
  // Both ARRIVAL and DEPARTURE forms are for future planned travel
  const travelDateYears = Array.from({ length: 3 }, (_, i) => currentYear + i); // Shows current year and next 2 years

  const capture = useCallback(async () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturedImage(imageSrc);
        // Store base64 image directly for email attachment
        setValue('picture', imageSrc, { shouldValidate: true });
        setShowWebcam(false);
        console.log('✅ Webcam image captured as base64');
      }
    }
  }, [webcamRef, setValue]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      // Convert to base64 for email attachment
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setCapturedImage(result);
        // Store base64 image directly for email attachment
        setValue('picture', result, { shouldValidate: true });
        setShowWebcam(false);
        console.log('✅ Image loaded as base64');
      };
      reader.readAsDataURL(file);
    }
  };

  const retakePicture = () => {
    setCapturedImage(null);
    resetField('picture', { keepError: false });
    setShowWebcam(true);
  };

  const selectNewFile = () => {
    setCapturedImage(null);
    resetField('picture', { keepError: false });
    setShowWebcam(false);
    // Trigger file input click
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  const onSubmit: SubmitHandler<CruiseFormData> = async (data) => {
    console.log('✅ Form validation passed! Starting submission...');
    setIsSubmitting(true);
    setSubmitMessage('');

    console.log('🚢 Starting cruise form submission...', { mode, data });

    const formData = new FormData();
    
    // Append all form data including base64 images as strings
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        // Handle arrays by stringifying them
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else if (typeof value === 'object') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      }
    });
    
    formData.append('formType', 'Cruise');
    formData.append('travelMode', mode);
    
    // Extract user email from URL params or localStorage
    const userEmail = searchParams.get('email') || localStorage.getItem('userEmail') || '';
    if (userEmail) {
      formData.append('userEmail', userEmail);
      console.log('✅ User email:', userEmail);
    } else {
      console.warn('⚠️ No user email found in URL or localStorage');
    }

    // Generate reCAPTCHA token
    let recaptchaToken = '';
    try {
      if (typeof window !== 'undefined' && window.grecaptcha) {
        console.log('🔐 Generating reCAPTCHA token...');
        recaptchaToken = await window.grecaptcha.execute(
          process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!,
          { action: 'submit_cruise_details' }
        );
        formData.append('recaptchaToken', recaptchaToken);
        console.log('✅ reCAPTCHA token generated');
      } else {
        throw new Error('reCAPTCHA not loaded');
      }
    } catch (error) {
      console.error('❌ reCAPTCHA error:', error);
      setSubmitMessage('Security verification failed. Please try again.');
      setIsSubmitting(false);
      return;
    }

    try {
      console.log('📤 Sending form data to API...');
      const response = await fetch('/api/forms/submit-details', {
        method: 'POST',
        body: formData,
      });

      console.log('📥 Response status:', response.status);
      const result = await response.json();
      
      if (!response.ok) {
        console.error('❌ API Error:', result);
        throw new Error(result.error || 'Something went wrong');
      }
      
      console.log('✅ Submission successful!', result);
      setSubmitMessage(`Your ${isArrival ? 'arrival' : 'departure'} cruise details have been submitted successfully!`);
      
      // Don't clear saved form data - keep it so user can see what they submitted
      // User can manually clear if needed or data persists for reference
      console.log('✅ Form submitted successfully - data kept for user reference');
    } catch (error: unknown) {
      console.error('❌ Submission error:', error);
      // Sanitize error message to prevent code leakage
      let errorMessage = 'An error occurred while submitting your form. Please try again.';
      if (error instanceof Error) {
        const rawMessage = error.message;
        // Only use error message if it's user-friendly (no stack traces, file paths, etc.)
        if (rawMessage && 
            !rawMessage.includes('at ') && 
            !rawMessage.includes('.ts') && 
            !rawMessage.includes('.js') &&
            !rawMessage.includes('Error:') &&
            rawMessage.length < 200) {
          errorMessage = rawMessage;
        }
      }
      setSubmitMessage(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>{isArrival ? 'Arrival' : 'Departure'} Cruise Details | IMMI WORLD®</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <PhilippinesHeader />
      
      {/* Removed session management UI - no longer using Supabase */}
      
      <main className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {submitMessage.includes('successfully') ? (
             <div className="p-8 text-center bg-green-50 border border-green-200 rounded-lg">
                <h2 className="text-2xl font-bold text-green-800">Thank You!</h2>
                <p className="mt-4 text-gray-700">{submitMessage}</p>
                <p className="mt-2 text-gray-700">We will review your details and be in touch shortly.</p>
             </div>
          ) : (
            <>
              <h1 className="text-3xl font-bold mb-8 text-center">
                {isArrival ? 'Arrival' : 'Departure'} Cruise Details Submission
              </h1>
              
              {isLoading && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="text-blue-800">Loading saved form data...</span>
                  </div>
                </div>
              )}

              {/* Save Status Indicator */}
              {saveStatus === 'saving' && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600"></div>
                    <span className="text-yellow-800">Saving form data...</span>
                  </div>
                </div>
              )}

              {saveStatus === 'saved' && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">✅</span>
                    <span className="text-green-800">Form data saved automatically</span>
                  </div>
                </div>
              )}

              {saveStatus === 'error' && saveError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-red-600">⚠️</span>
                    <span className="text-red-800">
                      Failed to save form data: {
                        saveError.includes('at ') || 
                        saveError.includes('.ts') || 
                        saveError.includes('.js') ||
                        saveError.length > 200
                          ? 'Please try again later.'
                          : saveError
                      }
                    </span>
                  </div>
                </div>
              )}
              
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 font-semibold">
                  🚢 You are submitting details for: <span className="underline">
                    {isArrival ? 'Arriving in the Philippines by Sea' : 'Departing from the Philippines by Sea'}
                  </span>
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit, async (validationErrors) => {
                // Safely log errors without circular references
                const errorCount = Object.keys(validationErrors).length;
                const errorFields = Object.entries(validationErrors).map(([key, error]) => ({
                  field: key,
                  message: error?.message || 'Validation error'
                }));
                
                console.error('❌ Form validation failed:', errorCount, 'errors');
                console.error('❌ Error fields:', errorFields.map(e => `${e.field}: ${e.message}`).join(', '));
                
                // Set error banner and message first
                setSubmitMessage(`Please fix ${errorCount} error(s) before submitting. See form fields below for details.`);
                setShowErrorBanner(true);
                
                // Trigger validation on all fields to ensure errors are displayed immediately in formState
                await trigger();
                
                // Scroll to top first to show error banner, then to first error
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setTimeout(() => {
                  const firstErrorField = Object.keys(validationErrors)[0];
                  if (firstErrorField) {
                    const element = document.querySelector(`[name="${firstErrorField}"]`);
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                  }
                }, 300);
              })} noValidate className="space-y-8">
                
                {/* Show validation errors summary */}
                {showErrorBanner && Object.keys(errors).length > 0 && (
                  <div className="bg-red-50 border-2 border-red-500 rounded-lg p-4 mb-4 sticky top-4 z-10">
                    <h3 className="text-red-800 font-bold mb-2">⚠️ Form has validation errors</h3>
                    <p className="text-red-700">Please fix the errors marked in red below before submitting.</p>
                    <p className="text-red-600 text-sm mt-1">
                      Error fields: {Object.keys(errors).slice(0, 5).join(', ')}
                      {Object.keys(errors).length > 5 && ` and ${Object.keys(errors).length - 5} more...`}
                    </p>
                  </div>
                )}
                
                {/* Photo Upload Section */}
                <div className="bg-white p-6 border rounded-lg">
                  <h2 className="text-xl font-semibold mb-4">Photo Submission</h2>
                  
                  {/* Show photo options only if no photo is selected */}
                  {!capturedImage && !(watchedPicture && typeof watchedPicture === 'object' && watchedPicture.length > 0) && (
                    <>
                      <div className="flex flex-col md:flex-row gap-4 mb-4">
                        <div className="flex-1">
                          <input 
                            type="file" 
                            {...register('picture', { onChange: handleFileUpload })}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
                            accept="image/png, image/jpeg, image/jpg, image/webp"
                          />
                        </div>
                        
                        <div className="md:w-auto">
                          <button 
                            type="button" 
                            onClick={() => setShowWebcam(true)} 
                            className="w-full bg-green-500 text-white p-2 rounded-lg font-bold hover:bg-green-600"
                          >
                            📸 Take Selfie
                          </button>
                        </div>
                      </div>
                      
                      <div className="text-center text-gray-600 text-sm">
                        Choose a file from your device or take a selfie using your camera
                      </div>
                    </>
                  )}

                  {showWebcam && (
                    <div className="mt-4 flex flex-col items-center">
                      <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/png"
                        videoConstraints={videoConstraints}
                        className="w-full max-w-sm rounded-lg shadow-lg"
                      />
                      <button 
                        type="button" 
                        onClick={capture} 
                        className="mt-4 bg-purple-600 text-white p-3 rounded-lg font-bold hover:bg-purple-700"
                      >
                        Capture Photo
                      </button>
                    </div>
                  )}

                  {/* Photo Preview Section */}
                  {(capturedImage || (watchedPicture && typeof watchedPicture === 'object' && watchedPicture.length > 0)) && (
                    <div className="mt-4 p-4 border rounded-lg bg-green-50 border-green-200">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-green-800">✅ Photo Selected</h3>
                        <span className="text-sm text-green-600">
                          {capturedImage ? '📸 Camera Photo' : '📁 Uploaded File'}
                        </span>
                      </div>
                      
                      <div className="flex flex-col items-center">
                        {capturedImage && (
                          <Image src={capturedImage} alt="Selected Photo" width={300} height={200} className="max-w-xs h-auto rounded-lg shadow mb-4" />
                        )}
                        {watchedPicture && typeof watchedPicture === 'object' && watchedPicture.length > 0 && !capturedImage && (
                          <Image src={URL.createObjectURL(watchedPicture[0])} alt="Selected Photo" width={300} height={200} className="max-w-xs h-auto rounded-lg shadow mb-4" />
                        )}
                        
                        <div className="flex flex-col sm:flex-row gap-3">
                          {capturedImage ? (
                            <button 
                              type="button" 
                              onClick={retakePicture}
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2"
                            >
                              📸 Retake Photo
                            </button>
                          ) : (
                            <button 
                              type="button" 
                              onClick={selectNewFile}
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2"
                            >
                              📁 Choose Different File
                            </button>
                          )}
                          
                          <button 
                            type="button" 
                            onClick={() => { setCapturedImage(null); resetField('picture', { keepError: false }); }}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 flex items-center gap-2"
                          >
                            🗑️ Remove Photo
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {errors.picture && <p className="text-red-600 text-sm mt-2">{errors.picture.message}</p>}
                </div>

                {/* Travel Details Section */}
                <div className="bg-white p-6 border rounded-lg">
                  <h2 className="text-xl font-semibold mb-4">Travel Details</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 font-medium">Purpose of Travel*</label>
                      <select {...register('purposeOfTravel')} className="w-full border rounded p-2">
                        <option value="">Select Purpose</option>
                        {purposeOfTravelOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                      {errors.purposeOfTravel && <p className="text-red-600 text-sm">{errors.purposeOfTravel.message}</p>}
                    </div>
                    <div>
                      <label className="block mb-1 font-medium">Traveller Type*</label>
                      <select {...register('travellerType')} className="w-full border rounded p-2">
                        <option value="">Select Type</option>
                        <option value="cruise_passenger">Cruise Passenger</option>
                        <option value="cruise_crew">Cruise Crew</option>
                        <option value="private_vessel">Private Vessel</option>
                      </select>
                      {errors.travellerType && <p className="text-red-600 text-sm">{errors.travellerType.message}</p>}
                    </div>
                  </div>
                </div>

                {/* Voyage Information Section - CRUISE SPECIFIC */}
                <div className="bg-white p-6 border rounded-lg">
                  <h2 className="text-xl font-semibold mb-4">🚢 Voyage Information</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block mb-1 font-medium">
                        {watchedTravellerType === 'private_vessel' ? 'Name of Vessel*' : 'Cruise Line / Shipping Company*'}
                      </label>
                      {watchedTravellerType === 'private_vessel' ? (
                        <input 
                          type="text" 
                          {...register('vesselName')} 
                          placeholder="Enter vessel name"
                          className="w-full border rounded p-2"
                        />
                      ) : (
                        <select {...register('vesselName')} className="w-full border rounded p-2">
                          <option value="">Select Cruise Line</option>
                          {activeCruiseLines.map(line => (
                            <option key={line.id} value={line.name}>
                              {line.name}
                            </option>
                          ))}
                        </select>
                      )}
                      {errors.vesselName && <p className="text-red-600 text-sm">{errors.vesselName.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-1 font-medium">
                          {isArrival ? 'Country of Origin*' : 'Origin (Philippines)*'}
                        </label>
                        {isArrival ? (
                          <select {...register('origin')} className="w-full border rounded p-2">
                            <option value="">Select Country</option>
                            {countries.map(country => <option key={country} value={country}>{country}</option>)}
                          </select>
                        ) : (
                          <input type="text" {...register('origin')} className="w-full border rounded p-2" value="Philippines" readOnly />
                        )}
                        {errors.origin && <p className="text-red-600 text-sm">{errors.origin.message}</p>}
                      </div>
                      <div>
                        <label className="block mb-1 font-medium">
                          {isArrival ? 'Seaport of Origin*' : 'Philippine Seaport of Origin*'}
                        </label>
                        {isArrival ? (
                          <input type="text" {...register('seaportOfOrigin')} className="w-full border rounded p-2" />
                        ) : (
                          <select {...register('seaportOfOrigin')} className="w-full border rounded p-2">
                            <option value="">Select Philippine Seaport</option>
                            {philippineSeaports.map(seaport => 
                              <option key={seaport.code} value={seaport.name}>{seaport.name}</option>
                            )}
                          </select>
                        )}
                        {errors.seaportOfOrigin && <p className="text-red-600 text-sm">{errors.seaportOfOrigin.message}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block mb-1 font-medium">
                        {isArrival ? 'Date of Departure (from origin)*' : 'Date of Departure (from Philippines)*'}
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <select {...register('departureMonth')} className="border rounded p-2">
                          <option value="">Month</option>
                          {months.map(month => <option key={month.value} value={month.value}>{month.label}</option>)}
                        </select>
                        <select {...register('departureDay')} className="border rounded p-2">
                          <option value="">Day</option>
                          {days.map(day => <option key={day} value={day}>{day}</option>)}
                        </select>
                        <select {...register('departureYear')} className="border rounded p-2">
                          <option value="">Year</option>
                          {travelDateYears.map(year => <option key={year} value={year}>{year}</option>)}
                        </select>
                      </div>
                      {(errors.departureMonth || errors.departureDay || errors.departureYear) && 
                        <p className="text-red-600 text-sm">Departure date is required</p>
                      }
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-1 font-medium">
                          {isArrival ? 'Destination*' : 'Country of Destination*'}
                        </label>
                        {isArrival ? (
                          <input type="text" {...register('destination')} className="w-full border rounded p-2" />
                        ) : (
                          <select {...register('destination')} className="w-full border rounded p-2">
                            <option value="">Select Country</option>
                            {countries.map(country => <option key={country} value={country}>{country}</option>)}
                          </select>
                        )}
                        {errors.destination && <p className="text-red-600 text-sm">{errors.destination.message}</p>}
                      </div>
                      <div>
                        <label className="block mb-1 font-medium">
                          {isArrival ? 'Philippine Seaport of Destination*' : 'Seaport of Destination*'}
                        </label>
                        {isArrival ? (
                          <select {...register('seaportOfDestination')} className="w-full border rounded p-2">
                            <option value="">Select Philippine Seaport</option>
                            {philippineSeaports.map(seaport => 
                              <option key={seaport.code} value={seaport.name}>{seaport.name}</option>
                            )}
                          </select>
                        ) : (
                          <input type="text" {...register('seaportOfDestination')} className="w-full border rounded p-2" />
                        )}
                        {errors.seaportOfDestination && <p className="text-red-600 text-sm">{errors.seaportOfDestination.message}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block mb-1 font-medium">
                        {isArrival ? 'Date of Arrival (to Philippines)*' : 'Date of Arrival (to destination)*'}
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <select {...register('arrivalMonth')} className="border rounded p-2">
                          <option value="">Month</option>
                          {months.map(month => <option key={month.value} value={month.value}>{month.label}</option>)}
                        </select>
                        <select {...register('arrivalDay')} className="border rounded p-2">
                          <option value="">Day</option>
                          {days.map(day => <option key={day} value={day}>{day}</option>)}
                        </select>
                        <select {...register('arrivalYear')} className="border rounded p-2">
                          <option value="">Year</option>
                          {travelDateYears.map(year => <option key={year} value={year}>{year}</option>)}
                        </select>
                      </div>
                      {(errors.arrivalMonth || errors.arrivalDay || errors.arrivalYear) && 
                        <p className="text-red-600 text-sm">Arrival date is required</p>
                      }
                    </div>
                  </div>
                </div>

                {/* Personal Information Section */}
                <div className="bg-white p-6 border rounded-lg">
                  <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
                  
                  <div className="space-y-6">
                    {/* Passport Type */}
                    <div>
                      <label className="block mb-1 font-medium">Passport Type*</label>
                      <div className="flex gap-6">
                        <label className="inline-flex items-center gap-2">
                          <input type="radio" value="philippines" {...register('passportType')} />
                          Philippines Passport Holder
                        </label>
                        <label className="inline-flex items-center gap-2">
                          <input type="radio" value="foreign" {...register('passportType')} />
                          Foreign Passport Holder
                        </label>
                      </div>
                      {errors.passportType && <p className="text-red-600 text-sm">{errors.passportType.message}</p>}
                    </div>

                    {/* Names */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-1 font-medium">First Name*</label>
                        <input type="text" {...register('firstName')} className="w-full border rounded p-2" />
                        {errors.firstName && <p className="text-red-600 text-sm">{errors.firstName.message}</p>}
                      </div>
                      <div>
                        <label className="block mb-1 font-medium">Middle Name</label>
                        <input type="text" {...register('middleName')} className="w-full border rounded p-2" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-1 font-medium">Last Name*</label>
                        <input type="text" {...register('lastName')} className="w-full border rounded p-2" />
                        {errors.lastName && <p className="text-red-600 text-sm">{errors.lastName.message}</p>}
                      </div>
                      <div>
                        <label className="block mb-1 font-medium">Suffix</label>
                        <select {...register('suffix')} className="w-full border rounded p-2">
                          <option value="">Select Suffix</option>
                          {suffixOptions.map(suffix => suffix && <option key={suffix} value={suffix}>{suffix}</option>)}
                        </select>
                      </div>
                    </div>

                    {/* Gender and Birth Date */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-1 font-medium">Sex*</label>
                        <select {...register('sex')} className="w-full border rounded p-2">
                          <option value="">Select Sex</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                        {errors.sex && <p className="text-red-600 text-sm">{errors.sex.message}</p>}
                      </div>
                      <div>
                        <label className="block mb-1 font-medium">Birth Date*</label>
                        <div className="grid grid-cols-3 gap-2">
                          <select {...register('birthMonth')} className="border rounded p-2">
                            <option value="">Month</option>
                            {months.map(month => <option key={month.value} value={month.value}>{month.label}</option>)}
                          </select>
                          <select {...register('birthDay')} className="border rounded p-2">
                            <option value="">Day</option>
                            {days.map(day => <option key={day} value={day}>{day}</option>)}
                          </select>
                          <select {...register('birthYear')} className="border rounded p-2">
                            <option value="">Year</option>
                            {years.map(year => <option key={year} value={year}>{year}</option>)}
                          </select>
                        </div>
                        {(errors.birthMonth || errors.birthDay || errors.birthYear) && 
                          <p className="text-red-600 text-sm">Birth date is required</p>
                        }
                      </div>
                    </div>

                    {/* Mobile Number */}
                    <div>
                      <label className="block mb-1 font-medium">Mobile Number*</label>
                      <div className="flex border rounded-lg overflow-hidden shadow-sm">
                        <select {...register('mobileCountryCode')} className="px-4 w-40 py-3 bg-gray-50 border-r text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option value="">Select Country</option>
                          {mobileCountryCodes.map(item => (
                            <option key={item.country} value={item.code}>
                              {countryFlags[item.country] || '🏳️'} {item.code} {item.country}
                            </option>
                          ))}
                        </select>
                        <input type="tel" {...register('mobileNumber')} className="flex-1 min-w-170 px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter phone number" />
                      </div>
                      {errors.mobileCountryCode && <p className="text-red-600 text-sm">{errors.mobileCountryCode.message}</p>}
                      {errors.mobileNumber && <p className="text-red-600 text-sm">{errors.mobileNumber.message}</p>}
                    </div>

                    {/* Citizenship, Birth Country, Passport Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-1 font-medium">Citizenship*</label>
                        <select {...register('citizenship')} className="w-full border rounded p-2">
                          <option value="">Select Country</option>
                          {countries.map(country => <option key={country} value={country}>{country}</option>)}
                        </select>
                        {errors.citizenship && <p className="text-red-600 text-sm">{errors.citizenship.message}</p>}
                      </div>
                      <div>
                        <label className="block mb-1 font-medium">Country of Birth*</label>
                        <select {...register('countryOfBirth')} className="w-full border rounded p-2">
                          <option value="">Select Country</option>
                          {countries.map(country => <option key={country} value={country}>{country}</option>)}
                        </select>
                        {errors.countryOfBirth && <p className="text-red-600 text-sm">{errors.countryOfBirth.message}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-1 font-medium">Passport Number*</label>
                        <input type="text" {...register('passportNumber')} className="w-full border rounded p-2" />
                        {errors.passportNumber && <p className="text-red-600 text-sm">{errors.passportNumber.message}</p>}
                      </div>
                      <div>
                        <label className="block mb-1 font-medium">Passport Issuing Authority*</label>
                        <select {...register('passportIssuingAuthority')} className="w-full border rounded p-2">
                          <option value="">Select Country</option>
                          {countries.map(country => <option key={country} value={country}>{country}</option>)}
                        </select>
                        {errors.passportIssuingAuthority && <p className="text-red-600 text-sm">{errors.passportIssuingAuthority.message}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-1 font-medium">Passport Issue Date*</label>
                        <div className="grid grid-cols-3 gap-2">
                          <select {...register('passportIssueMonth')} className="border rounded p-2">
                            <option value="">Month</option>
                            {months.map(month => <option key={month.value} value={month.value}>{month.label}</option>)}
                          </select>
                          <select {...register('passportIssueDay')} className="border rounded p-2">
                            <option value="">Day</option>
                            {days.map(day => <option key={day} value={day}>{day}</option>)}
                          </select>
                          <select {...register('passportIssueYear')} className="border rounded p-2">
                            <option value="">Year</option>
                            {years.map(year => <option key={year} value={year}>{year}</option>)}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block mb-1 font-medium">Passport Expiry Date*</label>
                        <div className="grid grid-cols-3 gap-2">
                          <select {...register('expiryMonth')} className="border rounded p-2">
                            <option value="">Month</option>
                            {months.map(month => <option key={month.value} value={month.value}>{month.label}</option>)}
                          </select>
                          <select {...register('expiryDay')} className="border rounded p-2">
                            <option value="">Day</option>
                            {days.map(day => <option key={day} value={day}>{day}</option>)}
                          </select>
                          <select {...register('expiryYear')} className="border rounded p-2">
                            <option value="">Year</option>
                            {futureYears.map(year => <option key={year} value={year}>{year}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block mb-1 font-medium">Occupation*</label>
                      <select {...register('occupation')} className="w-full border rounded p-2">
                        <option value="">Select Occupation</option>
                        {occupationOptions.map(occupation => (
                          <option key={occupation} value={occupation}>{occupation}</option>
                        ))}
                      </select>
                      {errors.occupation && <p className="text-red-600 text-sm">{errors.occupation.message}</p>}
                    </div>
                  </div>
                </div>

                {/* Permanent Address Section */}
                <div className="bg-white p-6 border rounded-lg">
                  <h2 className="text-xl font-semibold mb-4">Permanent Address</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block mb-1 font-medium">Permanent Country of Residence*</label>
                      <select {...register('permanentCountryOfResidence')} className="w-full border rounded p-2">
                        <option value="">Select Country</option>
                        {countries.map(country => <option key={country} value={country}>{country}</option>)}
                      </select>
                      {errors.permanentCountryOfResidence && <p className="text-red-600 text-sm">{errors.permanentCountryOfResidence.message}</p>}
                    </div>

                    <div>
                      <label className="block mb-1 font-medium">Country*</label>
                      <select {...register('residenceCountry')} className="w-full border rounded p-2">
                        <option value="">Select Country</option>
                        {countries.map(country => <option key={country} value={country}>{country}</option>)}
                      </select>
                      {errors.residenceCountry && <p className="text-red-600 text-sm">{errors.residenceCountry.message}</p>}
                    </div>

                    <div>
                      <label className="block mb-1 font-medium">No./Bldg./City/State/Province*</label>
                      <input type="text" {...register('residenceAddress')} className="w-full border rounded p-2" />
                      {errors.residenceAddress && <p className="text-red-600 text-sm">{errors.residenceAddress.message}</p>}
                    </div>

                    <div>
                      <label className="block mb-1 font-medium">Address Line 2</label>
                      <input type="text" {...register('residenceAddressLine2')} className="w-full border rounded p-2" />
                    </div>
                  </div>
                </div>

                {/* Destination Address Section */}
                <div className="bg-white p-6 border rounded-lg">
                  <h2 className="text-xl font-semibold mb-4">
                    {isArrival ? 'Destination Upon Arrival in the Philippines' : 'Destination Address'}
                  </h2>
                    
                    <div className="mb-4">
                      <label className="block mb-1 font-medium">Destination Type*</label>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2">
                          <input type="radio" value="residence" {...register('destinationType')} />
                          Residence
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="radio" value="hotel_resort" {...register('destinationType')} />
                          Hotel/Resort
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="radio" value="transit_airport" {...register('destinationType')} />
                          {isArrival ? 'Transit via Airport' : 'Transit'}
                        </label>
                      </div>
                      {errors.destinationType && <p className="text-red-600 text-sm">{errors.destinationType.message}</p>}
                    </div>

                    {(watchedDestinationType === 'residence' || watchedDestinationType === 'hotel_resort') && (
                      <div className="mt-4">
                        <label className="block mb-1 font-medium">
                          {watchedDestinationType === 'residence' ? 'Residence Address*' : 'Hotel/Resort Address*'}
                        </label>
                        <textarea 
                          {...register('destinationAddress')} 
                          className="w-full border rounded p-2 h-20"
                          placeholder="Complete address with contact details"
                        />
                        {errors.destinationAddress && <p className="text-red-600 text-sm">{errors.destinationAddress.message}</p>}
                      </div>
                    )}
                </div>

                {/* Health Declaration Section */}
                <div className="bg-white p-6 border rounded-lg">
                  <h2 className="text-xl font-semibold mb-4">Health Declaration</h2>
                  <div className="space-y-4">
                     <div>
                        <label className="block mb-1 font-medium">Country(ies) worked, visited and transited in the last 30 days</label>
                        <input type="text" {...register('countriesVisited')} className="w-full border rounded p-2" placeholder="e.g., Japan, Vietnam" />
                     </div>
                     
                     <div>
                        <label className="block mb-3 font-medium">Have you had any history of exposure to a person who is sick or known to have communicable/infectious disease in the past 30 days prior to travel?*</label>
                        <div className="flex gap-6">
                          <label className="inline-flex items-center gap-2">
                            <input type="radio" value="YES" {...register('exposureHistory')} />
                            Yes
                          </label>
                          <label className="inline-flex items-center gap-2">
                            <input type="radio" value="NO" {...register('exposureHistory')} />
                            No
                          </label>
                        </div>
                        {errors.exposureHistory && <p className="text-red-600 text-sm">{errors.exposureHistory.message}</p>}
                     </div>

                     <div>
                        <label className="block mb-3 font-medium">Have you been sick in the past 30 days?*</label>
                        <div className="flex gap-6">
                          <label className="inline-flex items-center gap-2">
                            <input type="radio" value="YES" {...register('isSick')} />
                            Yes
                          </label>
                          <label className="inline-flex items-center gap-2">
                            <input type="radio" value="NO" {...register('isSick')} />
                            No
                          </label>
                        </div>
                        {errors.isSick && <p className="text-red-600 text-sm">{errors.isSick.message}</p>}
                     </div>

                     {watch('isSick') === 'YES' && (
                       <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                         <h3 className="font-semibold mb-3">Symptoms</h3>
                         <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                           <label className="inline-flex items-center gap-2">
                             <input type="checkbox" {...register('symptomAlteredMental')} />
                             Altered Mental Status
                           </label>
                           <label className="inline-flex items-center gap-2">
                             <input type="checkbox" {...register('symptomColds')} />
                             Colds
                           </label>
                           <label className="inline-flex items-center gap-2">
                             <input type="checkbox" {...register('symptomCough')} />
                             Cough
                           </label>
                           <label className="inline-flex items-center gap-2">
                             <input type="checkbox" {...register('symptomDiarrhea')} />
                             Diarrhea
                           </label>
                           <label className="inline-flex items-center gap-2">
                             <input type="checkbox" {...register('symptomBreathing')} />
                             Difficulty of Breathing
                           </label>
                           <label className="inline-flex items-center gap-2">
                             <input type="checkbox" {...register('symptomDizziness')} />
                             Dizziness
                           </label>
                           <label className="inline-flex items-center gap-2">
                             <input type="checkbox" {...register('symptomFever')} />
                             Fever
                           </label>
                           <label className="inline-flex items-center gap-2">
                             <input type="checkbox" {...register('symptomHeadache')} />
                             Headache
                           </label>
                           <label className="inline-flex items-center gap-2">
                             <input type="checkbox" {...register('symptomAppetite')} />
                             Loss of appetite
                           </label>
                           <label className="inline-flex items-center gap-2">
                             <input type="checkbox" {...register('symptomSmell')} />
                             Loss of smell
                           </label>
                           <label className="inline-flex items-center gap-2">
                             <input type="checkbox" {...register('symptomTaste')} />
                             Loss of taste
                           </label>
                           <label className="inline-flex items-center gap-2">
                             <input type="checkbox" {...register('symptomMusclePain')} />
                             Muscle Pain
                           </label>
                           <label className="inline-flex items-center gap-2">
                             <input type="checkbox" {...register('symptomNausea')} />
                             Nausea
                           </label>
                           <label className="inline-flex items-center gap-2">
                             <input type="checkbox" {...register('symptomRashes')} />
                             Rashes, vesicles or blisters
                           </label>
                           <label className="inline-flex items-center gap-2">
                             <input type="checkbox" {...register('symptomSoreThroat')} />
                             Sore throat
                           </label>
                         </div>
                       </div>
                     )}
                  </div>
                </div>

                {/* Baggage Declaration Section */}
                <div className="bg-white p-6 border rounded-lg">
                  <h2 className="text-xl font-semibold mb-4 text-red-600">Important Information</h2>
                  <h3 className="text-lg font-semibold mb-4 text-blue-600">Baggage Declaration</h3>
                  
                  <div className="text-sm text-gray-700 space-y-3 mb-6">
                    <p>• <strong>All persons and baggage are subject to search at any time.</strong> (Section 222 and 223 of CMTA).</p>
                    <p>• <strong>Failure to declare any dutiable goods will subject the Traveler to payment of duties and taxes plus a surcharge of Thirty Percent (30%).</strong></p>
                  </div>

                  <div className="mb-4">
                    <p className="font-medium mb-3">By continuing, you confirm that you have read and understood the information above.</p>
                    <label className="inline-flex items-center gap-2">
                      <input type="checkbox" {...register('baggageDeclarationConfirm')} />
                      <span>I have read and understood the baggage declaration information</span>
                    </label>
                    {errors.baggageDeclarationConfirm && <p className="text-red-600 text-sm mt-1">{errors.baggageDeclarationConfirm.message}</p>}
                  </div>

                  <div className="mb-4">
                    <p className="font-medium mb-3">Do you have baggage or currency to declare?</p>
                    <div className="flex gap-6">
                      <label className="inline-flex items-center gap-2">
                        <input type="radio" value="NO" {...register('hasBaggageTodeclare')} />
                        No
                      </label>
                      <label className="inline-flex items-center gap-2">
                        <input type="radio" value="YES" {...register('hasBaggageTodeclare')} />
                        Yes
                      </label>
                    </div>
                    {errors.hasBaggageTodeclare && <p className="text-red-600 text-sm">{errors.hasBaggageTodeclare.message}</p>}
                  </div>

                  {/* Show helpful message when NO is selected */}
                  {watchedBaggageDeclaration === 'NO' && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-blue-600">ℹ️</span>
                        <div className="text-blue-800">
                          <p className="font-medium">Great! Since you have no baggage or currency to declare, you can mark &quot;No&quot; or leave blank most customs questions.</p>
                          <p className="text-sm mt-1">⚠️ <strong>Important:</strong> You still need to complete the document upload section below and take photos of the required declaration forms.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Other Travel Details Section */}
                <div className="bg-white p-6 border rounded-lg">
                  <h2 className="text-xl font-semibold mb-4">Other Travel Details</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-3">Accompanied family members</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block mb-1 text-sm font-medium">Below 18 yrs. old</label>
                          <input 
                            type="number" 
                            min="0" 
                            {...register('familyMembersBelow18', { valueAsNumber: true })} 
                            className="w-full border rounded p-2" 
                            defaultValue={0}
                          />
                        </div>
                        <div>
                          <label className="block mb-1 text-sm font-medium">18 yrs. old and above</label>
                          <input 
                            type="number" 
                            min="0" 
                            {...register('familyMembers18AndAbove', { valueAsNumber: true })} 
                            className="w-full border rounded p-2" 
                            defaultValue={0}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-3">No. of Baggage</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block mb-1 text-sm font-medium">Checked-in (pcs)</label>
                          <input 
                            type="number" 
                            min="0" 
                            {...register('baggageCheckedIn', { valueAsNumber: true })} 
                            className="w-full border rounded p-2" 
                            defaultValue={0}
                          />
                        </div>
                        <div>
                          <label className="block mb-1 text-sm font-medium">Hand-carried (pcs)</label>
                          <input 
                            type="number" 
                            min="0" 
                            {...register('baggageHandCarried', { valueAsNumber: true })} 
                            className="w-full border rounded p-2" 
                            defaultValue={0}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="font-medium mb-3">First time visiting Philippines?</p>
                      <div className="flex gap-6">
                        <label className="inline-flex items-center gap-2">
                          <input type="radio" value="YES" {...register('firstTimeVisiting')} />
                          Yes
                        </label>
                        <label className="inline-flex items-center gap-2">
                          <input type="radio" value="NO" {...register('firstTimeVisiting')} />
                          No
                        </label>
                      </div>
                      {errors.firstTimeVisiting && <p className="text-red-600 text-sm">{errors.firstTimeVisiting.message}</p>}
                    </div>
                  </div>
                </div>

                {/* Conditional Customs Sections - Only show if user has baggage/currency to declare */}
                {watchedBaggageDeclaration === 'YES' && (
                  <>
                    {/* For Customs - General Declaration Section (COMPLETE) */}
                <div className="bg-white p-6 border rounded-lg">
                  <h2 className="text-xl font-semibold mb-6 text-gray-800">For Customs - General Declaration</h2>
                  
                  <div className="mb-6">
                    <h3 className="font-medium mb-4">Total Amount of goods purchased and/or acquired abroad?</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block mb-1 text-sm font-medium">Currency</label>
                        <select {...register('goodsCurrency')} className="w-full border rounded p-2">
                          <option value="">Select Currency</option>
                          <option value="PHP">Philippine Peso</option>
                          <option value="USD">US Dollar</option>
                        </select>
                      </div>
                      <div>
                        <label className="block mb-1 text-sm font-medium">Amount</label>
                        <input type="number" min="0" step="0.01" {...register('goodsAmount', { valueAsNumber: true })} className="w-full border rounded p-2" defaultValue={0} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* ALL 12 COMPREHENSIVE DECLARATION ITEMS - Same as flight form */}
                    
                    {/* 1) Philippine Currency */}
                    <div className="pb-4 border-b border-gray-200">
                      <p className="mb-3 font-medium">1) Philippine Currency and/or any Philippine Monetary Instrument in excess of PhP 50,000.00;</p>
                      <div className="flex gap-6 mb-2">
                        <label className="inline-flex items-center gap-2">
                          <input type="radio" value="YES" {...register('philippineCurrency')} />
                          Yes
                        </label>
                        <label className="inline-flex items-center gap-2">
                          <input type="radio" value="NO" {...register('philippineCurrency')} />
                          No
                        </label>
                      </div>
                      <p className="text-sm text-gray-600">If YES, please submit authorization from Bangko Sentral ng Pilipinas.</p>
                    </div>

                    {/* 2) Foreign Currency */}
                    <div className="pb-4 border-b border-gray-200">
                      <p className="mb-3 font-medium">2) Foreign Currency and/or Foreign Monetary Instrument in excess of USD 10,000.00;</p>
                      <div className="flex gap-6 mb-2">
                        <label className="inline-flex items-center gap-2">
                          <input type="radio" value="YES" {...register('foreignCurrency')} />
                          Yes
                        </label>
                        <label className="inline-flex items-center gap-2">
                          <input type="radio" value="NO" {...register('foreignCurrency')} />
                          No
                        </label>
                      </div>
                      <p className="text-sm text-gray-600">If YES, fill out Foreign Currency Declaration Form.</p>
                    </div>

                    {/* 3) Gambling Paraphernalia with Table */}
                    <div className="pb-4 border-b border-gray-200">
                      <p className="mb-3 font-medium">3) Gambling Paraphernalia;</p>
                      <div className="flex gap-6 mb-2">
                        <label className="inline-flex items-center gap-2">
                          <input type="radio" value="YES" {...register('gamblingParaphernalia')} />
                          Yes
                        </label>
                        <label className="inline-flex items-center gap-2">
                          <input type="radio" value="NO" {...register('gamblingParaphernalia')} />
                          No
                        </label>
                      </div>
                      {errors.gamblingParaphernalia && <p className="text-red-600 text-sm">{errors.gamblingParaphernalia.message}</p>}
                      
                      {watchedGambling === 'YES' && (
                        <ItemTable 
                          items={gamblingItems} 
                          helpers={gamblingHelpers} 
                        />
                      )}
                    </div>

                    {/* 4) Cosmetics with Table */}
                    <div className="pb-4 border-b border-gray-200">
                      <p className="mb-3 font-medium">4) Cosmetics, skin care products, food supplements and medicines in excess of quantities for personal use;</p>
                      <div className="flex gap-6 mb-2">
                        <label className="inline-flex items-center gap-2">
                          <input type="radio" value="YES" {...register('cosmeticsExcess')} />
                          Yes
                        </label>
                        <label className="inline-flex items-center gap-2">
                          <input type="radio" value="NO" {...register('cosmeticsExcess')} />
                          No
                        </label>
                      </div>
                      {errors.cosmeticsExcess && <p className="text-red-600 text-sm">{errors.cosmeticsExcess.message}</p>}
                      
                      {watchedCosmetics === 'YES' && (
                        <ItemTable 
                          items={cosmeticsItems} 
                          helpers={cosmeticsHelpers} 
                        />
                      )}
                    </div>

                    {/* 5) Dangerous Drugs with Table */}
                    <div className="pb-4 border-b border-gray-200">
                      <p className="mb-3 font-medium">5) Dangerous drugs such as morphine, marijuana, opium, poppies or synthetic drugs;</p>
                      <div className="flex gap-6 mb-2">
                        <label className="inline-flex items-center gap-2">
                          <input type="radio" value="YES" {...register('dangerousDrugs')} />
                          Yes
                        </label>
                        <label className="inline-flex items-center gap-2">
                          <input type="radio" value="NO" {...register('dangerousDrugs')} />
                          No
                        </label>
                      </div>
                      {errors.dangerousDrugs && <p className="text-red-600 text-sm">{errors.dangerousDrugs.message}</p>}
                      
                      {watchedDrugs === 'YES' && (
                        <ItemTable 
                          items={drugsItems} 
                          helpers={drugsHelpers} 
                        />
                      )}
                    </div>

                    {/* 6) Firearms with Table */}
                    <div className="pb-4 border-b border-gray-200">
                      <p className="mb-3 font-medium">6) Firearms, ammunitions and explosives;</p>
                      <div className="flex gap-6 mb-2">
                        <label className="inline-flex items-center gap-2">
                          <input type="radio" value="YES" {...register('firearmsExplosives')} />
                          Yes
                        </label>
                        <label className="inline-flex items-center gap-2">
                          <input type="radio" value="NO" {...register('firearmsExplosives')} />
                          No
                        </label>
                      </div>
                      {errors.firearmsExplosives && <p className="text-red-600 text-sm">{errors.firearmsExplosives.message}</p>}
                      
                      {watchedFirearms === 'YES' && (
                        <ItemTable 
                          items={firearmsItems} 
                          helpers={firearmsHelpers} 
                        />
                      )}
                    </div>

                    {/* 7) Alcohol and Tobacco with Table */}
                    <div className="pb-4 border-b border-gray-200">
                      <p className="mb-3 font-medium">7) Alcohol and/or tobacco products in commercial quantities;</p>
                      <div className="flex gap-6 mb-2">
                        <label className="inline-flex items-center gap-2">
                          <input type="radio" value="YES" {...register('alcoholTobacco')} />
                          Yes
                        </label>
                        <label className="inline-flex items-center gap-2">
                          <input type="radio" value="NO" {...register('alcoholTobacco')} />
                          No
                        </label>
                      </div>
                      {errors.alcoholTobacco && <p className="text-red-600 text-sm">{errors.alcoholTobacco.message}</p>}
                      
                      {watchedAlcohol === 'YES' && (
                        <ItemTable 
                          items={alcoholItems} 
                          helpers={alcoholHelpers} 
                        />
                      )}
                    </div>

                    {/* 8) Foodstuff with Table */}
                    <div className="pb-4 border-b border-gray-200">
                      <p className="mb-3 font-medium">8) Foodstuff(s), fruit(s), vegetable(s), live animal(s), marine and aquatic products(s), plant(s) and/or their by-product(s);</p>
                      <div className="flex gap-6 mb-2">
                        <label className="inline-flex items-center gap-2">
                          <input type="radio" value="YES" {...register('foodstuffAnimals')} />
                          Yes
                        </label>
                        <label className="inline-flex items-center gap-2">
                          <input type="radio" value="NO" {...register('foodstuffAnimals')} />
                          No
                        </label>
                      </div>
                      {errors.foodstuffAnimals && <p className="text-red-600 text-sm">{errors.foodstuffAnimals.message}</p>}
                      
                      {watchedFoodstuff === 'YES' && (
                        <ItemTable 
                          items={foodstuffItems} 
                          helpers={foodstuffHelpers} 
                        />
                      )}
                    </div>

                    {/* 9) Mobile/Radio with Table */}
                    <div className="pb-4 border-b border-gray-200">
                      <p className="mb-3 font-medium">9) Mobile phones, hand-held radios and similar gadgets in excess of quantities for personal use, and radio communication equipments;</p>
                      <div className="flex gap-6 mb-2">
                        <label className="inline-flex items-center gap-2">
                          <input type="radio" value="YES" {...register('mobileRadioExcess')} />
                          Yes
                        </label>
                        <label className="inline-flex items-center gap-2">
                          <input type="radio" value="NO" {...register('mobileRadioExcess')} />
                          No
                        </label>
                      </div>
                      {errors.mobileRadioExcess && <p className="text-red-600 text-sm">{errors.mobileRadioExcess.message}</p>}
                      
                      {watchedMobile === 'YES' && (
                        <ItemTable 
                          items={mobileItems} 
                          helpers={mobileHelpers} 
                        />
                      )}
                    </div>

                    {/* 10) Cremains with Table */}
                    <div className="pb-4 border-b border-gray-200">
                      <p className="mb-3 font-medium">10) Cremains (human ashes), human organs or tissues;</p>
                      <div className="flex gap-6 mb-2">
                        <label className="inline-flex items-center gap-2">
                          <input type="radio" value="YES" {...register('cremains')} />
                          Yes
                        </label>
                        <label className="inline-flex items-center gap-2">
                          <input type="radio" value="NO" {...register('cremains')} />
                          No
                        </label>
                      </div>
                      {errors.cremains && <p className="text-red-600 text-sm">{errors.cremains.message}</p>}
                      
                      {watchedCremains === 'YES' && (
                        <ItemTable 
                          items={cremainsItems} 
                          helpers={cremainsHelpers} 
                        />
                      )}
                    </div>

                    {/* 11) Jewelry with Table */}
                    <div className="pb-4 border-b border-gray-200">
                      <p className="mb-3 font-medium">11) Jewelry, gold, precious metals or gems;</p>
                      <div className="flex gap-6 mb-2">
                        <label className="inline-flex items-center gap-2">
                          <input type="radio" value="YES" {...register('jewelry')} />
                          Yes
                        </label>
                        <label className="inline-flex items-center gap-2">
                          <input type="radio" value="NO" {...register('jewelry')} />
                          No
                        </label>
                      </div>
                      {errors.jewelry && <p className="text-red-600 text-sm">{errors.jewelry.message}</p>}
                      
                      {watchedJewelry === 'YES' && (
                        <ItemTable 
                          items={jewelryItems} 
                          helpers={jewelryHelpers} 
                        />
                      )}
                    </div>

                    {/* 12) Other Goods with Table */}
                    <div className="pb-4">
                      <p className="mb-3 font-medium">12) Other goods, not mentioned above;</p>
                      <div className="flex gap-6 mb-2">
                        <label className="inline-flex items-center gap-2">
                          <input type="radio" value="YES" {...register('otherGoods')} />
                          Yes
                        </label>
                        <label className="inline-flex items-center gap-2">
                          <input type="radio" value="NO" {...register('otherGoods')} />
                          No
                        </label>
                      </div>
                      {errors.otherGoods && <p className="text-red-600 text-sm">{errors.otherGoods.message}</p>}
                      
                      {watchedOtherGoods === 'YES' && (
                        <ItemTable 
                          items={otherGoodsItems} 
                          helpers={otherGoodsHelpers} 
                        />
                      )}
                      {errors.otherGoodsItems && <p className="text-red-600 text-sm mt-2">{errors.otherGoodsItems.message}</p>}
                    </div>
                  </div>
                </div>

                {/* For Customs - Currency Declaration Section (COMPLETE) */}
                <div className="bg-white p-6 border rounded-lg">
                  <h2 className="text-xl font-semibold mb-6 text-gray-800">For Customs - Currency Declaration</h2>
                  
                  <div className="mb-6">
                    <label className="inline-flex items-center gap-2">
                      <input type="checkbox" {...register('currencyNotApplicable')} />
                      <span className="font-medium">Not Applicable</span>
                    </label>
                  </div>

                  {!watchedCurrencyNotApplicable && (
                    <div className="space-y-8">
                      {/* Owner Details */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4 text-blue-600">Owner Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block mb-1 font-medium">Business Name</label>
                            <input type="text" {...register('ownerBusinessName')} className="w-full border rounded p-2" />
                          </div>
                          <div>
                            <label className="block mb-1 font-medium">First Name</label>
                            <input type="text" {...register('ownerFirstName')} className="w-full border rounded p-2" />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <label className="block mb-1 font-medium">Middle Name</label>
                            <input type="text" {...register('ownerMiddleName')} className="w-full border rounded p-2" />
                          </div>
                          <div>
                            <label className="block mb-1 font-medium">Last Name</label>
                            <input type="text" {...register('ownerLastName')} className="w-full border rounded p-2" />
                          </div>
                          <div>
                            <label className="block mb-1 font-medium">Suffix</label>
                            <input type="text" {...register('ownerSuffix')} className="w-full border rounded p-2" />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <label className="block mb-1 font-medium">Occupation</label>
                            <input type="text" {...register('ownerOccupation')} className="w-full border rounded p-2" />
                          </div>
                          <div>
                            <label className="block mb-1 font-medium">Country</label>
                            <select {...register('ownerCountry')} className="w-full border rounded p-2">
                              <option value="">Select Country</option>
                              {countries.map(country => <option key={country} value={country}>{country}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block mb-1 font-medium">Postal Code</label>
                            <input type="text" {...register('ownerPostalCode')} className="w-full border rounded p-2" />
                          </div>
                        </div>

                        <div>
                          <label className="block mb-1 font-medium">Address</label>
                          <textarea {...register('ownerAddress')} className="w-full border rounded p-2 h-20" />
                        </div>
                      </div>

                      {/* Recipient Details */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4 text-blue-600">Recipient Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block mb-1 font-medium">Business Name</label>
                            <input type="text" {...register('recipientBusinessName')} className="w-full border rounded p-2" />
                          </div>
                          <div>
                            <label className="block mb-1 font-medium">First Name</label>
                            <input type="text" {...register('recipientFirstName')} className="w-full border rounded p-2" />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <label className="block mb-1 font-medium">Middle Name</label>
                            <input type="text" {...register('recipientMiddleName')} className="w-full border rounded p-2" />
                          </div>
                          <div>
                            <label className="block mb-1 font-medium">Last Name</label>
                            <input type="text" {...register('recipientLastName')} className="w-full border rounded p-2" />
                          </div>
                          <div>
                            <label className="block mb-1 font-medium">Suffix</label>
                            <input type="text" {...register('recipientSuffix')} className="w-full border rounded p-2" />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <label className="block mb-1 font-medium">Occupation</label>
                            <input type="text" {...register('recipientOccupation')} className="w-full border rounded p-2" />
                          </div>
                          <div>
                            <label className="block mb-1 font-medium">Country</label>
                            <select {...register('recipientCountry')} className="w-full border rounded p-2">
                              <option value="">Select Country</option>
                              {countries.map(country => <option key={country} value={country}>{country}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block mb-1 font-medium">Postal Code</label>
                            <input type="text" {...register('recipientPostalCode')} className="w-full border rounded p-2" />
                          </div>
                        </div>

                        <div>
                          <label className="block mb-1 font-medium">Address</label>
                          <textarea {...register('recipientAddress')} className="w-full border rounded p-2 h-20" />
                        </div>
                      </div>

                      {/* Currency Information Table */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4 text-blue-600">Currency Information</h3>
                        
                        <button 
                          type="button"
                          onClick={addCurrencyItem}
                          className="mb-4 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700"
                        >
                          Add Currency Item
                        </button>

                        {currencyItems.length > 0 && (
                          <div className="border rounded-lg overflow-hidden mb-4">
                            <table className="w-full">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-4 py-2 text-left font-medium">Currency</th>
                                  <th className="px-4 py-2 text-left font-medium">Monetary Instrument</th>
                                  <th className="px-4 py-2 text-left font-medium">Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {currencyItems.map((item, index) => (
                                  <tr key={item.id} className="border-t">
                                    <td className="px-4 py-2">
                                      <input
                                        type="text"
                                        value={item.currency}
                                        onChange={(e) => updateCurrencyItem(index, 'currency', e.target.value)}
                                        className="w-full border rounded p-1"
                                        placeholder="e.g., USD, EUR"
                                      />
                                    </td>
                                    <td className="px-4 py-2">
                                      <input
                                        type="text"
                                        value={item.monetaryInstrument}
                                        onChange={(e) => updateCurrencyItem(index, 'monetaryInstrument', e.target.value)}
                                        className="w-full border rounded p-1"
                                        placeholder="e.g., Cash, Check"
                                      />
                                    </td>
                                    <td className="px-4 py-2">
                                      <button
                                        type="button"
                                        onClick={() => removeCurrencyItem(index)}
                                        className="text-red-600 hover:text-red-800"
                                      >
                                        Remove
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>

                      {/* BSP Authorization + Source + Purpose + Transfer Method */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* BSP Authorization Date */}
                        <div>
                          <h3 className="text-lg font-semibold mb-4 text-blue-600">BSP Authorization Date</h3>
                          <div className="grid grid-cols-3 gap-2">
                            <select {...register('bspAuthorizationDay')} className="border rounded p-2">
                              <option value="">Day</option>
                              {days.map(day => <option key={day} value={day}>{day}</option>)}
                            </select>
                            <select {...register('bspAuthorizationMonth')} className="border rounded p-2">
                              <option value="">Month</option>
                              {months.map(month => <option key={month.value} value={month.value}>{month.label}</option>)}
                            </select>
                            <select {...register('bspAuthorizationYear')} className="border rounded p-2">
                              <option value="">Year</option>
                              {years.map(year => <option key={year} value={year}>{year}</option>)}
                            </select>
                          </div>
                        </div>

                        {/* Transfer Method */}
                        <div>
                          <h3 className="text-lg font-semibold mb-4 text-blue-600">Transfer Method</h3>
                          <div className="flex flex-col gap-3">
                            <label className="inline-flex items-center gap-2">
                              <input type="radio" value="person" {...register('transferMethod')} />
                              In person
                            </label>
                            <label className="inline-flex items-center gap-2">
                              <input type="radio" value="courier" {...register('transferMethod')} />
                              Through courier
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Source and Purpose */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Source */}
                        <div>
                          <h3 className="text-lg font-semibold mb-4 text-blue-600">Source</h3>
                          <div className="space-y-3">
                            <label className="flex items-center gap-2">
                              <input type="checkbox" {...register('sourceSalary')} />
                              Salary
                            </label>
                            <label className="flex items-center gap-2">
                              <input type="checkbox" {...register('sourceBusiness')} />
                              Business
                            </label>
                            <label className="flex items-center gap-2">
                              <input type="checkbox" {...register('sourceOther')} />
                              Other
                            </label>
                            {watchedSourceOther && (
                              <div className="ml-6 mt-2">
                                <input 
                                  type="text" 
                                  {...register('sourceOtherSpecify')} 
                                  className="w-full border rounded p-2" 
                                  placeholder="Please specify other source"
                                />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Purpose */}
                        <div>
                          <h3 className="text-lg font-semibold mb-4 text-blue-600">Purpose</h3>
                          <div className="space-y-3">
                            <label className="flex items-center gap-2">
                              <input type="checkbox" {...register('purposeLeisure')} />
                              Leisure
                            </label>
                            <label className="flex items-center gap-2">
                              <input type="checkbox" {...register('purposeMedical')} />
                              Medical
                            </label>
                            <label className="flex items-center gap-2">
                              <input type="checkbox" {...register('purposePayables')} />
                              Payables
                            </label>
                            <label className="flex items-center gap-2">
                              <input type="checkbox" {...register('purposeEducation')} />
                              Education
                            </label>
                            <label className="flex items-center gap-2">
                              <input type="checkbox" {...register('purposeOther')} />
                              Other
                            </label>
                            {watchedPurposeOther && (
                              <div className="ml-6 mt-2">
                                <input 
                                  type="text" 
                                  {...register('purposeOtherSpecify')} 
                                  className="w-full border rounded p-2" 
                                  placeholder="Please specify other purpose"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                  </>
                )}

                {/* For Customs - Declaration Attachments and Signature */}
                <div className="bg-white p-6 border rounded-lg">
                  <h2 className="text-xl font-semibold mb-6 text-gray-800">For Customs - Declaration Attachments and Signature</h2>
                  
                  <div className="mb-8">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                      <div className="flex items-start gap-3">
                        <div className="text-blue-600 mt-1">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-semibold text-blue-800 mb-1">📄 Document Upload Required</h3>
                          <p className="text-blue-700 text-sm">
                            You must upload photos of BOTH completed and signed forms below to proceed. 
                            Each form requires a separate upload.
                          </p>
                          <p className="text-blue-600 text-xs mt-2">
                            💾 <strong>Don&apos;t worry:</strong> If you need to leave and come back to the form, your progress is automatically saved!
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Customs Declaration Form Upload */}
                      <DocumentUpload
                        label="Customs Baggage Declaration Form"
                        fieldName="customsDeclarationAttachment"
                        register={register as (...args: unknown[]) => unknown}
                        errors={errors as Record<string, { message?: string }>}
                        setValue={setValue as (...args: unknown[]) => void}
                        watch={watch as (...args: unknown[]) => unknown}
                      downloadUrl="/forms/Customs Baggage Declaration Fprm Phillippines.pdf"
                      downloadFileName="customs-baggage-declaration-form-philippines.pdf"
                      buttonColor="bg-blue-600"
                      icon="📋"
                      required={true}
                    />

                    {/* Currency Declaration Form Upload */}
                      <DocumentUpload
                        label="Currency Declaration Form"
                        fieldName="currencyDeclarationAttachment"
                        register={register as (...args: unknown[]) => unknown}
                        errors={errors as Record<string, { message?: string }>}
                        setValue={setValue as (...args: unknown[]) => void}
                        watch={watch as (...args: unknown[]) => unknown}
                      downloadUrl="/forms/Currencies Declaration Form Phillippines.pdf"
                      downloadFileName="currency-declaration-form-philippines.pdf"
                      buttonColor="bg-green-600"
                      icon="💰"
                      required={true}
                    />
                  </div>

                  {/* Digital Signature - Typed Name */}
                  <div className="mb-6">
                    <label className="block mb-2 font-medium">Digital Signature *</label>
                    <p className="text-sm text-gray-600 mb-2">Please type your full legal name as it appears on your passport</p>
                    <div className="relative">
                      <input 
                        type="text"
                        {...register('digitalSignature')}
                        placeholder="Type your full name here"
                        className="w-full border-b-2 border-gray-400 bg-transparent px-2 py-3 text-lg focus:border-blue-600 focus:outline-none"
                        style={{ 
                          fontFamily: 'cursive, serif',
                          letterSpacing: '0.5px'
                        }}
                      />
                      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-200"></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">This serves as your digital signature for this declaration</p>
                    {errors.digitalSignature && <p className="text-red-600 text-sm mt-1">{errors.digitalSignature.message}</p>}
                  </div>

                  {/* Final Certification */}
                  <div className="mb-6">
                    <p className="text-gray-700 mb-4">
                      By Clicking &quot;Submit&quot;, you hereby certify under pain of falsification that this 
                      declaration is true and correct to the best of my knowledge
                    </p>
                    <label className="inline-flex items-center gap-2">
                      <input type="checkbox" {...register('finalCertification')} />
                      <span className="font-medium">I certify that this declaration is true and correct</span>
                    </label>
                    {errors.finalCertification && (
                      <p className="text-red-600 text-sm mt-2 font-medium">{errors.finalCertification.message}</p>
                    )}
                  </div>
                </div>

                <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-400">
                  {isSubmitting ? 'Submitting...' : `Submit ${isArrival ? 'Arrival' : 'Departure'} Cruise Details`}
                </button>

                {submitMessage && !submitMessage.includes('successfully') && <p className="mt-4 text-center font-medium text-red-600">{submitMessage}</p>}
              </form>
            </>
          )}
        </div>
      </main>
      <PhilippinesFooter />
    </>
  );
}

export default function CruiseFormPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen"><div className="text-lg">Loading...</div></div>}>
      <CruiseFormContent />
    </Suspense>
  );
}