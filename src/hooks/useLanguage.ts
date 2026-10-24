import { useContext } from 'react';
import { LanguageContext } from '../context/languageContextDef';
import type { LanguageContextType } from '../context/languageContextDef';

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
