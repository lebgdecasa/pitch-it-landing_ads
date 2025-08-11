"use client";

import React, { useState, useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Menu, Bell, Search, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/supa_database/components/AuthProvider';
import { trackButtonClick, trackLanguageChange } from '@/utils/analytics';
import { useTranslation } from 'next-i18next';
import { LanguageContext } from '@/context/LanguageContext';
import { useOnboarding } from '@/components/onboarding/OnboardingProvider';


export const DashboardHeader = () => {
  const { user } = useAuthContext();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const router = useRouter();
  const { t } = useTranslation('common');
  const { language, setLanguage } = useContext(LanguageContext);
  const { restartOnboarding } = useOnboarding();


  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    trackLanguageChange(newLanguage);
  };

  const handleSignOut = async () => {
    trackButtonClick('sign_out', 'dashboard_header'); // Optional: for analytics
    setIsProfileOpen(false); // Close profile dropdown
    try {
      const response = await fetch('/api/auth/signout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Sign-out failed');
      }

      // Option 1: Hard reload to ensure all state is cleared
      window.location.href = '/';

      // Option 2: Next.js router push and then reload (might be slightly smoother if server correctly clears cookie)
      // await router.push('/');
      // router.reload();

    } catch (err: any) {
      console.error('Sign-out error:', err.message);
      // Optionally, show an error message to the user
      alert('Failed to sign out: ' + err.message);
    }
  };

  const handleRestartOnboarding = () => {
    setIsProfileOpen(false);
    restartOnboarding();
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Left section */}
          <div className="flex items-center">
            <Link href="/" >
              <span className="text-3xl font-bold text-blue-700 hover:text-blue-800 transition-colors">{t('pitchit_brand')}</span>
            </Link>
            <button className="p-2 rounded-md text-gray-500 lg:hidden">
              <Menu className="h-6 w-6" />
            </button>
          </div>

          {/* Search bar - hidden on small screens */}
          {/* <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="w-full relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={t('dashboard_header_search_placeholder')}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:ring-deep-blue focus:border-deep-blue text-sm"
              />
            </div>
          </div> */}

          {/* Right section */}
          <div className="flex items-center space-x-4">
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
            {user ? (
              <div className="relative">
                <button
                  className="flex items-center text-sm focus:outline-none"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                  <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                    {user.email ? user.email.charAt(0).toUpperCase() : "U"}
                  </div>
                  <span className="hidden md:block ml-2">{user.email || t('dashboard_header_user_placeholder')}</span>
                  <ChevronDown className="h-4 w-4 ml-1 text-gray-500" />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50"> {/* Added z-50 */}
                    <Link href="/subscription" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsProfileOpen(false)}>
                      {t('dashboard_header_subscription')}
                    </Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    {/* Changed Link to button to handle sign out */}
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {t('nav_sign_out')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Button asChild size="sm">
                <Link href="/login">{t('nav_sign_in')}</Link>
              </Button>

            )}
            <Button
                      size="sm"
                      variant="outline"
                      onClick={handleRestartOnboarding}
                      className=" bg-blue-700 text-white hover:bg-blue-800 transition-colors"
                    >
                      {t('restart_onboarding')}
                    </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
