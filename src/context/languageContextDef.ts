import { createContext } from 'react';
import type { Language } from '../types';
import { TRANSLATIONS } from '../translations';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (typeof TRANSLATIONS)['mr'];
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
