import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import useTranslation from '@/hooks/useTranslation';
import { trackFormSubmission, trackConversion, getStoredUTMParams } from '@/utils/analytics';

interface DemoModalProps {
  onClose: () => void;
}

type DemoFormData = {
  name: string;
  email: string;
  company: string;
  role: 'founder' | 'investor' | 'other';
  fundingStage?: string;
  teamSize?: string;
  interest: string;
};

const DemoModal = ({ onClose }: DemoModalProps) => {
  const t = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    watch
  } = useForm<DemoFormData>();

  const selectedRole = watch('role');

  const onSubmit = async (data: DemoFormData) => {
    setIsSubmitting(true);
    setErrorMessage('');

    // Get UTM parameters
    const utmParams = getStoredUTMParams();

    try {
      const response = await fetch('/api/demo-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          language: localStorage.getItem('pitchit-lang') || 'en',
          ...utmParams
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // Track successful submission
        trackFormSubmission('demo', true);
        trackConversion('demo', data.email);

        setSubmitSuccess(true);
        setTimeout(() => {
          onClose();
          setSubmitSuccess(false);
        }, 3000);
      } else {
        // Track failed submission
        trackFormSubmission('demo', false);
        setErrorMessage(result.error || 'An error occurred. Please try again.');
      }
    } catch (error) {
      trackFormSubmission('demo', false);
      setErrorMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800">{t('demo_modal_title')}</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-3xl transition-colors"
          aria-label="Close"
        >
          &times;
        </button>
      </div>
      <p className="text-gray-600 mb-6">{t('demo_modal_text')}</p>

      {!submitSuccess ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Name & Email Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="demo_name" className="block text-sm font-medium text-gray-700 mb-1">
                {t('demo_modal_name_label')}
              </label>
              <input
                id="demo_name"
                type="text"
                className={`w-full px-4 py-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow focus:shadow-md`}
                placeholder={t('demo_modal_name_placeholder')}
                {...register('name', {
                  required: 'Name is required'
                })}
              />
              {errors.name && (
                <p className="mt-1 text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="demo_email" className="block text-sm font-medium text-gray-700 mb-1">
                {t('demo_modal_email_label')}
              </label>
              <input
                id="demo_email"
                type="email"
                className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow focus:shadow-md`}
                placeholder={t('demo_modal_email_placeholder')}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
              />
              {errors.email && (
                <p className="mt-1 text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
          </div>

          {/* Company & Role Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="demo_company" className="block text-sm font-medium text-gray-700 mb-1">
                {t('demo_modal_company_label')}
              </label>
              <input
                id="demo_company"
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow focus:shadow-md"
                placeholder={t('demo_modal_company_placeholder')}
                {...register('company')}
              />
            </div>
            <div>
              <label htmlFor="demo_role" className="block text-sm font-medium text-gray-700 mb-1">
                I am a...
              </label>
              <select
                id="demo_role"
                className={`w-full px-4 py-3 border ${errors.role ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow focus:shadow-md`}
                {...register('role', { required: 'Please select your role' })}
              >
                <option value="">Select your role</option>
                <option value="founder">Founder/Entrepreneur</option>
                <option value="investor">VC/Investor</option>
                <option value="other">Other</option>
              </select>
              {errors.role && (
                <p className="mt-1 text-red-500 text-sm">{errors.role.message}</p>
              )}
            </div>
          </div>

          {/* Conditional Fields for Founders */}
          {selectedRole === 'founder' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="demo_funding_stage" className="block text-sm font-medium text-gray-700 mb-1">
                  Funding Stage
                </label>
                <select
                  id="demo_funding_stage"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow focus:shadow-md"
                  {...register('fundingStage')}
                >
                  <option value="">Select stage</option>
                  <option value="pre-seed">Pre-seed</option>
                  <option value="seed">Seed</option>
                  <option value="series-a">Series A</option>
                  <option value="series-b+">Series B+</option>
                </select>
              </div>
              <div>
                <label htmlFor="demo_team_size" className="block text-sm font-medium text-gray-700 mb-1">
                  Team Size
                </label>
                <select
                  id="demo_team_size"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow focus:shadow-md"
                  {...register('teamSize')}
                >
                  <option value="">Select size</option>
                  <option value="1-5">1-5</option>
                  <option value="6-20">6-20</option>
                  <option value="21-50">21-50</option>
                  <option value="50+">50+</option>
                </select>
              </div>
            </div>
          )}

          {/* Interest Field */}
          <div className="mb-6">
            <label htmlFor="demo_interest" className="block text-sm font-medium text-gray-700 mb-1">
              {t('demo_modal_interest_label')}
            </label>
            <textarea
              id="demo_interest"
              rows={3}
              className={`w-full px-4 py-3 border ${errors.interest ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow focus:shadow-md`}
              placeholder={t('demo_modal_interest_placeholder')}
              {...register('interest', {
                required: 'Please tell us what interests you'
              })}
            ></textarea>
            {errors.interest && (
              <p className="mt-1 text-red-500 text-sm">{errors.interest.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-4 rounded-lg cta-button disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : t('demo_modal_submit')}
          </button>

          {errorMessage && (
            <div className="mt-4 text-center text-red-600 font-medium">{errorMessage}</div>
          )}
        </form>
      ) : (
        <div className="mt-4 text-center text-green-600 font-medium">
          {t('demo_modal_success', { name: getValues('name') })}
        </div>
      )}
    </>
  );
};

export default DemoModal;
