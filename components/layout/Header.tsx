import React, { useContext } from 'react';
import useTranslation from '@/hooks/useTranslation';
import { LanguageContext } from '@/context/LanguageContext';
import { trackLanguageChange, trackButtonClick } from '@/utils/analytics';

interface HeaderProps {
  onOpenDemoModal: () => void;
}

const Header = ({ onOpenDemoModal }: HeaderProps) => {
  const t = useTranslation();
  const { language, setLanguage } = useContext(LanguageContext);

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    trackLanguageChange(newLanguage);
  };

  const handleNavClick = (section: string) => {
    trackButtonClick(`nav_${section}`, 'header');
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <a
          href="#"
          className="text-3xl font-bold text-blue-700 hover:text-blue-800 transition-colors"
          onClick={() => trackButtonClick('logo_NexTraction', 'header')}
        >
          {t('pitchit_brand')}
        </a>
        <nav className="space-x-2 sm:space-x-4 flex items-center">
          <a
            href="#features"
            className="text-gray-600 hover:text-blue-600 text-sm sm:text-base font-medium transition-colors"
            onClick={() => handleNavClick('features')}
          >
            {t('nav_features')}
          </a>
          <a
            href="#why-pitchit"
            className="text-gray-600 hover:text-blue-600 text-sm sm:text-base font-medium transition-colors"
            onClick={() => handleNavClick('why_us')}
          >
            {t('nav_why_us')}
          </a>
          <button
            onClick={onOpenDemoModal}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 sm:px-4 rounded-lg cta-button text-sm sm:text-base"
          >
            {t('nav_book_demo')}
          </button>
          <div className="ml-2 sm:ml-4 flex border border-gray-200 rounded-md">
            <button
              onClick={() => handleLanguageChange('en')}
              className={`px-3 py-1 text-xs sm:text-sm rounded-l-md ${language === 'en' ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-500 hover:bg-gray-100 hover:text-blue-600'}`}
            >
              EN
            </button>
            <button
              onClick={() => handleLanguageChange('fr')}
              className={`px-3 py-1 text-xs sm:text-sm rounded-r-md ${language === 'fr' ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-500 hover:bg-gray-100 hover:text-blue-600'}`}
            >
              FR
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
