import React, { useState, useEffect } from 'react';
import type { Language } from '../types';
import { TRANSLATIONS } from '../translations';
import { LanguageContext } from './languageContextDef';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('udyog_setu_lang') as Language;
    return saved === 'mr' || saved === 'hi' || saved === 'en' ? saved : 'mr';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('udyog_setu_lang', lang);
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value = {
    language,
    setLanguage,
    t: TRANSLATIONS[language] || TRANSLATIONS.mr,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};
