import { useContext } from 'react';
import { LanguageContext } from '@/context/LanguageContext';
import { TranslationSet } from '@/utils/translations';

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  
  const { translations: currentTranslationsSet } = context;
  
  return (key: keyof TranslationSet, replacements: Record<string, string | number> = {}) => {
    let translatedString = currentTranslationsSet[key] || key.toString();
    
    for (const placeholder in replacements) {
      translatedString = translatedString.replace(
        `{${placeholder}}`, 
        String(replacements[placeholder])
      );
    }
    
    return translatedString;
  };
};

export default useTranslation;
