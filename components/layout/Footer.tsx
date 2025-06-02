import React from 'react';
import { useTranslation } from 'next-i18next'; // UPDATED

const Footer = () => {
  const { t } = useTranslation('common'); // UPDATED
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-gray-400 py-12">
      <div className="container mx-auto px-6 text-center">
        <a href="#" className="text-2xl font-bold text-white hover:text-blue-300 transition-colors">
          {t('pitchit_brand')}
        </a>
        <p
          className="my-4 text-sm"
          dangerouslySetInnerHTML={{ __html: t('footer_text', { year: currentYear }) }}
        ></p>
        <div className="space-x-6">
          <a href="#" className="hover:text-blue-300 transition-colors text-sm">
            {t('footer_privacy')}
          </a>
          <a href="#" className="hover:text-blue-300 transition-colors text-sm">
            {t('footer_terms')}
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
