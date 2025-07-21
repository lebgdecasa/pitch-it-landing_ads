import React from 'react';
import { InlineWidget } from 'react-calendly';
import { useTranslation } from 'next-i18next';

interface CalendlyModalProps {
  onClose: () => void;
}

const CalendlyModal = ({ onClose }: CalendlyModalProps) => {
  const { t } = useTranslation('common');

  return (
    <>
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-2xl font-bold text-gray-800">{t('book_a_demo')}</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-3xl transition-colors"
          aria-label={t('close_button_aria_label')}
        >
          &times;
        </button>
      </div>
      <p className="text-gray-600 mb-2">{t('calendly_modal_schedule_demo')}</p>
      <InlineWidget url="https://calendly.com/jlahrichi-nextraction/nextraction-demo-onboarding" />
    </>
  );
};

export default CalendlyModal;
