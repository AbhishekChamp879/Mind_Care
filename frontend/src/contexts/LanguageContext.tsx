// @ts-nocheck
import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { errorMessages as enMessages } from '@/translations/en';
import { errorMessages as hiMessages } from '@/translations/hi';
import { errorMessages as esMessages } from '@/translations/es';

type Language = 'en' | 'hi' | 'es';
type ErrorMessageCategory = keyof typeof enMessages;
type ErrorMessageKey<T extends ErrorMessageCategory> = keyof (typeof enMessages)[T];

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
  t: <T extends ErrorMessageCategory>(category: T, key: ErrorMessageKey<T>) => string;
}

const LanguageContext = React.createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [currentLanguage, setCurrentLanguage] = React.useState<Language>('en');

  const messages = {
    en: enMessages,
    hi: hiMessages,
    es: esMessages,
  };

  const setLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
    document.documentElement.lang = lang;
    localStorage.setItem('preferred-language', lang);
  };

  const t = <T extends ErrorMessageCategory>(category: T, key: ErrorMessageKey<T>): string => {
    return messages[currentLanguage][category][key as keyof (typeof messages)[typeof currentLanguage][T]];
  };

  React.useEffect(() => {
    const savedLanguage = localStorage.getItem('preferred-language') as Language;
    if (savedLanguage && ['en', 'hi', 'es'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  const contextValue = React.useMemo(
    () => ({
      currentLanguage,
      setLanguage,
      t,
    }),
    [currentLanguage]
  );

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = React.useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};