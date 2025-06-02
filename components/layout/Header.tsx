import React, { useContext, useState } from 'react';
import Link from 'next/link'; // IMPORT Link
import useTranslation from '@/hooks/useTranslation';
import { LanguageContext } from '@/context/LanguageContext';
import { trackLanguageChange, trackButtonClick } from '@/utils/analytics';

interface HeaderProps {
  onOpenDemoModal: () => void;
}

const Header = ({ onOpenDemoModal }: HeaderProps) => {
  const t = useTranslation();
  const { language, setLanguage } = useContext(LanguageContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    trackLanguageChange(newLanguage);
  };

  // Updated to optionally accept path for Next.js Link compatibility
  const handleNavClick = (section: string, path?: string) => {
    trackButtonClick(`nav_${section}`, 'header');
    setMobileMenuOpen(false); // close menu on nav click
    // If path is provided, Next/Link handles navigation.
    // If no path, it might be an in-page scroll for other links (if any remain).
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" passHref>
          <a
            className="text-3xl font-bold text-blue-700 hover:text-blue-800 transition-colors"
            onClick={() => trackButtonClick('logo_NexTraction', 'header')}
          >
            {t('pitchit_brand')}
          </a>
        </Link>
        {/* Desktop Nav */}
        <nav className="space-x-2 sm:space-x-4 items-center hidden md:flex">
          <Link href="/features" passHref>
            <a
              className="text-gray-600 hover:text-blue-600 text-sm sm:text-base font-medium transition-colors"
              onClick={() => handleNavClick('features', '/features')}
            >
              {t('nav_features')}
            </a>
          </Link>
          <Link href="/why-us" passHref>
            <a
              className="text-gray-600 hover:text-blue-600 text-sm sm:text-base font-medium transition-colors"
              onClick={() => handleNavClick('why_us', '/why-us')}
            >
              {t('nav_why_us')}
            </a>
          </Link>
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
        {/* Hamburger for Mobile */}
        <button
          className="md:hidden flex items-center px-2 py-1 border rounded text-blue-700 border-blue-200 focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Open menu"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-40" onClick={() => setMobileMenuOpen(false)}>
          <div className="absolute top-0 right-0 w-3/4 max-w-xs h-full bg-white shadow-lg p-6 flex flex-col space-y-6" onClick={e => e.stopPropagation()}>
            <button
              className="self-end mb-4 text-gray-500 hover:text-blue-700"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <Link href="/features" passHref>
              <a
                className="text-gray-700 text-lg font-medium"
                onClick={() => handleNavClick('features', '/features')}
              >
                {t('nav_features')}
              </a>
            </Link>
            <Link href="/why-us" passHref>
              <a
                className="text-gray-700 text-lg font-medium"
                onClick={() => handleNavClick('why_us', '/why-us')}
              >
                {t('nav_why_us')}
              </a>
            </Link>
            <button
              onClick={() => { onOpenDemoModal(); setMobileMenuOpen(false); }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg cta-button text-lg"
            >
              {t('nav_book_demo')}
            </button>
            <div className="flex border border-gray-200 rounded-md">
              <button
                onClick={() => handleLanguageChange('en')}
                className={`px-3 py-1 text-sm rounded-l-md ${language === 'en' ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-500 hover:bg-gray-100 hover:text-blue-600'}`}
              >
                EN
              </button>
              <button
                onClick={() => handleLanguageChange('fr')}
                className={`px-3 py-1 text-sm rounded-r-md ${language === 'fr' ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-500 hover:bg-gray-100 hover:text-blue-600'}`}
              >
                FR
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
