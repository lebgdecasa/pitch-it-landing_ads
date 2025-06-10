import React, { useContext, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { LanguageContext } from '@/context/LanguageContext';
import { useAuthContext } from '@/supa_database/components/AuthProvider';
// import { signOut } from '@/supa_database/auth'; // Removed signOut import
import { trackLanguageChange, trackButtonClick } from '@/utils/analytics';

interface HeaderProps {
  onOpenDemoModal: () => void;
}

const Header = ({ onOpenDemoModal }: HeaderProps) => {
  const { t } = useTranslation('common');
  const { language, setLanguage } = useContext(LanguageContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, loading } = useAuthContext(); // Added
  const router = useRouter(); // Added

  const handleSignOut = async () => {
    trackButtonClick('sign_out', 'header');
    try {
      const response = await fetch('/api/auth/signout', {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Sign-out failed');
      }

      // Sign-out successful on the server, cookie is cleared.
      // Redirect and reload to ensure client state is reset.
      router.push('/').then(() => {
        router.reload(); // Force a reload to clear all client-side state
      });

    } catch (err: any) {
      console.error('Sign-out error:', err.message);
      alert('Failed to sign out: ' + err.message); // Simple alert for now
    } finally {
      setMobileMenuOpen(false); // Close mobile menu if open
    }
  };

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
        <Link href="/" className="text-3xl font-bold text-blue-700 hover:text-blue-800 transition-colors" onClick={() => trackButtonClick('logo_final', 'header')}>
          {t('pitchit_brand')}
        </Link>
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center">
          {/* Nav links group */}
          <div className="flex space-x-2 sm:space-x-4">
            <Link href="/features" className="text-gray-600 hover:text-blue-600 text-sm sm:text-base font-medium transition-colors" onClick={() => handleNavClick('features', '/features')}>
              {t('nav_features')}
            </Link>
            <Link href="/why-us" className="text-gray-600 hover:text-blue-600 text-sm sm:text-base font-medium transition-colors" onClick={() => handleNavClick('why_us', '/why-us')}>
              {t('nav_why_us')}
            </Link>
          </div>
          {/* Divider */}
          <div className="border-l border-gray-200 h-8 mx-4"></div>
          {/* Actions group */}
          <div className="flex items-center space-x-2">
            {loading ? (
              <div className="text-gray-500 text-sm">Loading...</div>
            ) : user ? (
              <button
                onClick={handleSignOut}
                className="text-gray-600 hover:text-blue-600 text-sm sm:text-base font-medium transition-colors"
              >
                {t('nav_sign_out', 'Sign Out')}
              </button>
            ) : (
              <Link href="/auth" className="text-gray-600 hover:text-blue-600 text-sm sm:text-base font-medium transition-colors" onClick={() => handleNavClick('auth_desktop', '/auth')}>
                {t('nav_sign_in_up', 'Sign In / Up')}
              </Link>
            )}
            <div className="border-l border-gray-200 h-8 mx-2"></div> {/* Added small divider */}
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
            <Link href="/features" className="text-gray-700 text-lg font-medium" onClick={() => handleNavClick('features', '/features')}>
              {t('nav_features')}
            </Link>
            <Link href="/why-us" className="text-gray-700 text-lg font-medium" onClick={() => handleNavClick('why_us', '/why-us')}>
              {t('nav_why_us')}
            </Link>

            <div className="border-t border-gray-200 pt-4 mt-4"></div>

            {loading ? (
              <p className="text-gray-500 text-lg">Loading...</p>
            ) : user ? (
              <button
                onClick={handleSignOut}
                className="w-full text-left text-gray-700 text-lg font-medium hover:text-blue-600 transition-colors"
              >
                {t('nav_sign_out', 'Sign Out')}
              </button>
            ) : (
              <Link href="/auth" className="text-gray-700 text-lg font-medium hover:text-blue-600 transition-colors" onClick={() => handleNavClick('auth_mobile', '/auth')}>
                {t('nav_sign_in_up', 'Sign In / Up')}
              </Link>
            )}

            <button
              onClick={() => { onOpenDemoModal(); setMobileMenuOpen(false); }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg cta-button text-lg mt-4" // Added mt-4 for spacing
            >
              {t('nav_book_demo')}
            </button>
            <div className="flex border border-gray-200 rounded-md mt-4"> {/* Added mt-4 for spacing */}
              <button
                onClick={() => handleLanguageChange('en')}
                className={`w-1/2 px-3 py-1 text-sm rounded-l-md ${language === 'en' ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-500 hover:bg-gray-100 hover:text-blue-600'}`}
              >
                EN
              </button>
              <button
                onClick={() => handleLanguageChange('fr')}
                className={`w-1/2 px-3 py-1 text-sm rounded-r-md ${language === 'fr' ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-500 hover:bg-gray-100 hover:text-blue-600'}`}
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
