import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import SecurityBadges from '@/components/ui/SecurityBadges';
import { trackFormSubmission, trackConversion, getStoredUTMParams } from '@/utils/analytics';

interface WaitlistModalProps {
  onClose: () => void;
}

type WaitlistFormData = {
  firstName: string;
  lastName: string;
  email: string;
};

const WaitlistModal = ({ onClose }: WaitlistModalProps) => {
  const { t } = useTranslation('common');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues
  } = useForm<WaitlistFormData>();

  const onSubmit = async (data: WaitlistFormData) => {
    setIsSubmitting(true);
    setErrorMessage('');

    // Get UTM parameters
    const utmParams = getStoredUTMParams();

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          language: localStorage.getItem('pitchit-lang') || 'en',
          ...utmParams // Include UTM parameters
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // Track successful submission
        trackFormSubmission('waitlist', true);
        trackConversion('waitlist', data.email);

        setSubmitSuccess(true);
        setTimeout(() => {
          onClose();
          setSubmitSuccess(false);
        }, 3000);
      } else {
        // Track failed submission
        trackFormSubmission('waitlist', false);
        setErrorMessage(result.error || 'An error occurred. Please try again.');
      }
    } catch (error) {
      trackFormSubmission('waitlist', false);
      setErrorMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800">{t('waitlist_modal_title')}</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-3xl transition-colors"
          aria-label="Close"
        >
          &times;
        </button>
      </div>
      <p className="text-gray-600 mb-6">{t('waitlist_modal_text')}</p>

      {!submitSuccess ? (
        <>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* First Name & Last Name Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="waitlist_firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('waitlist_modal_first_name_label')}
                </label>
                <input
                  id="waitlist_firstName"
                  type="text"
                  className={`w-full px-4 py-3 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow focus:shadow-md`}
                  placeholder={t('waitlist_modal_first_name_placeholder')}
                  {...register('firstName', {
                    required: t('waitlist_modal_first_name_required'),
                    minLength: {
                      value: 1,
                      message: t('waitlist_modal_first_name_min_length')
                    }
                  })}
                />
                {errors.firstName && (
                  <p className="mt-1 text-red-500 text-sm">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="waitlist_lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('waitlist_modal_last_name_label')}
                </label>
                <input
                  id="waitlist_lastName"
                  type="text"
                  className={`w-full px-4 py-3 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow focus:shadow-md`}
                  placeholder={t('waitlist_modal_last_name_placeholder')}
                  {...register('lastName', {
                    required: t('waitlist_modal_last_name_required'),
                    minLength: {
                      value: 1,
                      message: t('waitlist_modal_last_name_min_length')
                    }
                  })}
                />
                {errors.lastName && (
                  <p className="mt-1 text-red-500 text-sm">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div className="mb-4">
              <label htmlFor="waitlist_email" className="block text-sm font-medium text-gray-700 mb-1">
                {t('waitlist_modal_email_label')}
              </label>
              <input
                id="waitlist_email"
                type="email"
                className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow focus:shadow-md`}
                placeholder={t('waitlist_modal_email_placeholder')}
                {...register('email', {
                  required: t('waitlist_modal_email_required'),
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: t('waitlist_modal_email_invalid')
                  }
                })}
              />
              {errors.email && (
                <p className="mt-1 text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg cta-button disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? t('waitlist_modal_submitting') : t('waitlist_modal_submit')}
            </button>

            {errorMessage && (
              <div className="mt-4 text-center text-red-600 font-medium">{errorMessage}</div>
            )}
          </form>

          {/* Security Badges */}
          <SecurityBadges />

          {/* Trust Message */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Join 275+ founders and VCs already on the waitlist. No spam, unsubscribe anytime.
          </p>
        </>
      ) : (
        <div className="mt-4 text-center text-green-600 font-medium">
          {t('waitlist_modal_success', {
            firstName: getValues('firstName'),
            lastName: getValues('lastName'),
            email: getValues('email')
          })}
        </div>
      )}
    </>
  );
};

export default WaitlistModal;
