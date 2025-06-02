import React, { createContext, useState, useEffect, ReactNode, Dispatch, SetStateAction, useCallback } from 'react';
import { useRouter } from 'next/router';

// Define the shape of the context value
interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => void; // Updated to accept string directly
}

// Language Context - Provide a default value that matches the context type
export const LanguageContext = createContext<LanguageContextType>({
  language: 'en', // Default language, will be overridden by router.locale
  setLanguage: () => {}, // Placeholder function
});

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const router = useRouter();
  const { locale, pathname, asPath, isReady } = router;

  // Initialize language state with router's locale if available, otherwise default or from localStorage
  const [language, setInternalLanguage] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const storedLanguage = localStorage.getItem('pitchit-lang');
      if (storedLanguage && ['en', 'fr'].includes(storedLanguage)) { // Ensure it's a valid locale
        return storedLanguage;
      }
    }
    return locale || 'en'; // Fallback to router.locale or 'en'
  });

  // Effect to update language state when router.locale changes (e.g., from URL or next-i18next)
  useEffect(() => {
    if (isReady && locale && locale !== language) {
      setInternalLanguage(locale);
      if (typeof window !== 'undefined') {
        localStorage.setItem('pitchit-lang', locale);
      }
    }
  }, [locale, isReady, language]);

  // Effect to set initial language from localStorage if router is ready and locale is not set by URL
  useEffect(() => {
    if (isReady) {
      const storedLanguage = typeof window !== 'undefined' ? localStorage.getItem('pitchit-lang') : null;
      if (storedLanguage && storedLanguage !== locale && ['en', 'fr'].includes(storedLanguage)) {
        // If localStorage language is different and valid, push it to the router
        // This handles the case where the user had a preference but landed on a default locale URL
        router.push({ pathname, query: router.query }, asPath, { locale: storedLanguage });
      } else if (locale) {
        // If locale is already set by router (e.g. from URL), ensure internal state and localStorage match
        setInternalLanguage(locale);
        if (typeof window !== 'undefined') {
          localStorage.setItem('pitchit-lang', locale);
        }
      }
    }
  }, [isReady, pathname, asPath, router.query]); // router.locale removed to avoid loop with above effect

  const setLanguage = useCallback((newLanguage: string) => {
    if (newLanguage !== language && ['en', 'fr'].includes(newLanguage)) {
      setInternalLanguage(newLanguage);
      if (typeof window !== 'undefined') {
        localStorage.setItem('pitchit-lang', newLanguage);
      }
      // Change route to update locale via next-i18next
      router.push({ pathname, query: router.query }, asPath, { locale: newLanguage });
    }
  }, [language, router, pathname, asPath]);

  // Provide the current language (derived from router or state) and the setter
  const value = {
    language: isReady && locale ? locale : language, // Prefer router.locale when ready
    setLanguage
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;
