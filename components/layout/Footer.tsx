import React from 'react';
import { useTranslation } from 'next-i18next';

const Footer = () => {
  const { t } = useTranslation('common');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-gray-400 py-4">
      <div className="container flex justify-center items-center gap-6 mx-auto px-6 text-center">
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
        <a
          href="http://linkedin.com/company/nextractionio"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-300 transition-colors text-sm"
        >
          LinkedIn
        </a>
      </div>

    </footer>
  );
};

export default Footer;
