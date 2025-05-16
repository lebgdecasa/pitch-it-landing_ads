import React, { createContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from 'react';
import { translations, TranslationSet } from '@/utils/translations';

// Define the shape of the context value
interface LanguageContextType {
  language: string;
  setLanguage: Dispatch<SetStateAction<string>>;
  translations: TranslationSet;
}

// Language Context - Provide a default value that matches the context type
export const LanguageContext = createContext<LanguageContextType>({
  language: 'en', // Default language
  setLanguage: () => {}, // Placeholder function
  translations: translations.en, // Default translations
});

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguage] = useState<string>('en');
  // Initialize currentTranslations with the default language or stored language
  const [currentTranslations, setCurrentTranslations] = useState<TranslationSet>(() => {
    if (typeof window !== 'undefined') {
      const storedLanguage = localStorage.getItem('pitchit-lang');
      if (storedLanguage && translations[storedLanguage as keyof typeof translations]) {
        return translations[storedLanguage as keyof typeof translations];
      }
    }
    return translations.en; // Fallback to English
  });

  useEffect(() => {
    const storedLanguage = localStorage.getItem('pitchit-lang');
    if (storedLanguage && translations[storedLanguage as keyof typeof translations]) {
      setLanguage(storedLanguage);
      setCurrentTranslations(translations[storedLanguage as keyof typeof translations]);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('pitchit-lang', language);
    }
    setCurrentTranslations(translations[language as keyof typeof translations]);
  }, [language]);

  const value = { language, setLanguage, translations: currentTranslations };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;
