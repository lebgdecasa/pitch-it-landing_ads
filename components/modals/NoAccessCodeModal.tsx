import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import Modal from '@/components/ui/Modal'; // Generic Modal component
import { getStoredUTMParams } from '@/utils/analytics'; // Assuming you might want UTM params

interface NoAccessCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type NoAccessCodeFormData = {
  firstName: string;
  lastName: string;
  email: string;
};

const NoAccessCodeModal = ({ isOpen, onClose }: NoAccessCodeModalProps) => {
  const { t } = useTranslation('common'); // Assuming 'common' namespace for translations
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset, // To reset form after successful submission
    getValues
  } = useForm<NoAccessCodeFormData>();

  const onSubmit = async (data: NoAccessCodeFormData) => {
    setIsSubmitting(true);
    setErrorMessage('');
    setSubmitSuccess(false);

    const utmParams = getStoredUTMParams();

    try {
      const response = await fetch('/api/waitlist', { // Using the waitlist endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          language: localStorage.getItem('pitchit-lang') || 'en', // Consistent with WaitlistModal
          source: 'no-access-code-modal', // Differentiate the source
          ...utmParams,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitSuccess(true);
        reset(); // Reset form fields
        // Optional: auto-close modal after a delay or keep it open with success message
        setTimeout(() => {
          onClose(); // Close the modal
          setSubmitSuccess(false); // Reset success state for next open
        }, 3000);
      } else {
        setErrorMessage(result.error || t('error_generic_submit', 'An error occurred. Please try again.'));
      }
    } catch (error) {
      console.error("NoAccessCodeModal submission error:", error);
      setErrorMessage(t('error_network', 'Network error. Please check your connection and try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Custom close handler to reset states if modal is closed manually
  const handleClose = () => {
    reset();
    setSubmitSuccess(false);
    setErrorMessage('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} maxWidth="max-w-lg" titleId="no-access-code-title" descriptionId="no-access-code-description">
      <div className="flex justify-between items-center mb-6">
        <h3 id="no-access-code-title" className="text-xl sm:text-2xl font-bold text-gray-800">
          {t('no_access_code_modal_title', 'No Access code? No Problem!')}
        </h3>
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-600 text-3xl transition-colors"
          aria-label={t('close', 'Close')}
        >
          &times;
        </button>
      </div>
      <p id="no-access-code-description" className="text-gray-600 mb-6">
        {t('no_access_code_modal_description', "Enter your email address to be among the first ones to test NexTraction's features.")}
      </p>

      {!submitSuccess ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* First Name */}
          <div>
            <label htmlFor="noAccess_firstName" className="block text-sm font-medium text-gray-700 mb-1">
              {t('first_name_label', 'First Name')}
            </label>
            <input
              id="noAccess_firstName"
              type="text"
              className={`w-full px-3 py-2 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow`}
              placeholder={t('first_name_placeholder', 'Enter your first name')}
              {...register('firstName', {
                required: t('first_name_required', 'First name is required'),
              })}
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-500">{errors.firstName.message}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="noAccess_lastName" className="block text-sm font-medium text-gray-700 mb-1">
              {t('last_name_label', 'Last Name')}
            </label>
            <input
              id="noAccess_lastName"
              type="text"
              className={`w-full px-3 py-2 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow`}
              placeholder={t('last_name_placeholder', 'Enter your last name')}
              {...register('lastName', {
                required: t('last_name_required', 'Last name is required'),
              })}
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-500">{errors.lastName.message}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="noAccess_email" className="block text-sm font-medium text-gray-700 mb-1">
              {t('email_label', 'Email Address')}
            </label>
            <input
              id="noAccess_email"
              type="email"
              className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow`}
              placeholder={t('email_placeholder', 'your@email.com')}
              {...register('email', {
                required: t('email_required', 'Email is required'),
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: t('email_invalid', 'Invalid email address'),
                },
              })}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? t('submitting', 'Submitting...') : t('submit_request', 'Request Access')}
          </button>

          {errorMessage && (
            <div className="mt-3 text-center text-red-600 text-sm">{errorMessage}</div>
          )}
        </form>
      ) : (
        <div className="text-center py-4">
          <svg className="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h4 className="mt-3 text-lg font-medium text-green-700">
            {t('no_access_code_success_title', 'Request Submitted!')}
          </h4>
          <p className="text-gray-600 mt-1">
            {t('no_access_code_success_message', 'Thank you! We will be in touch soon...', {
              firstName: getValues('firstName'),
              email: getValues('email')
            })}
          </p>
        </div>
      )}
    </Modal>
  );
};

export default NoAccessCodeModal;
