import { en } from './en';
import { es } from './es';

export type Language = 'en' | 'es';

export const translations = {
  en,
  es,
} as const;

export type Translation = typeof en;

export function getTranslation(language: Language): Translation {
  return translations[language];
} 