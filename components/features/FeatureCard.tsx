import React from 'react';
import { useTranslation } from 'next-i18next';

interface FeatureCardProps {
  /** SVG content string for the feature icon */
  iconSvg: string;
  /** Feature title/name */
  title: string;
  /** Brief description of the feature (1-2 sentences) */
  description: string;
  /** Optional highlight/benefit text */
  highlight?: string;
  /** Color theme for the card */
  colorTheme: 'purple' | 'blue' | 'teal' | 'orange' | 'indigo' | 'pink' | 'green' | 'red';
  /** Optional CTA text */
  ctaText?: string;
  /** CTA click handler */
  onCtaClick?: () => void;

}

/**
 * FeatureCard displays a single product feature in a modern card layout.
 * Designed to replace accordion-style feature displays with a more visual,
 * scannable approach that showcases features at a glance.
 */
const FeatureCard: React.FC<FeatureCardProps> = ({
  iconSvg,
  title,
  description,
  highlight,
  colorTheme,
  ctaText = ('learn_more'),
  onCtaClick
}) => {
  const { t } = useTranslation('common');

  const getColorClasses = (theme: string) => {
    const themes = {
      purple: {
        icon: 'from-purple-500 to-purple-600',
        iconBg: 'bg-purple-100',
        iconText: 'text-purple-600',
        border: 'border-purple-200',
        hover: 'hover:border-purple-300',
        cta: 'text-purple-600 hover:text-purple-700 hover:bg-purple-50'
      },
      blue: {
        icon: 'from-blue-500 to-blue-600',
        iconBg: 'bg-blue-100',
        iconText: 'text-blue-600',
        border: 'border-blue-200',
        hover: 'hover:border-blue-300',
        cta: 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
      },
      teal: {
        icon: 'from-teal-500 to-teal-600',
        iconBg: 'bg-teal-100',
        iconText: 'text-teal-600',
        border: 'border-teal-200',
        hover: 'hover:border-teal-300',
        cta: 'text-teal-600 hover:text-teal-700 hover:bg-teal-50'
      },
      orange: {
        icon: 'from-orange-500 to-orange-600',
        iconBg: 'bg-orange-100',
        iconText: 'text-orange-600',
        border: 'border-orange-200',
        hover: 'hover:border-orange-300',
        cta: 'text-orange-600 hover:text-orange-700 hover:bg-orange-50'
      },
      indigo: {
        icon: 'from-indigo-500 to-indigo-600',
        iconBg: 'bg-indigo-100',
        iconText: 'text-indigo-600',
        border: 'border-indigo-200',
        hover: 'hover:border-indigo-300',
        cta: 'text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50'
      },
      pink: {
        icon: 'from-pink-500 to-pink-600',
        iconBg: 'bg-pink-100',
        iconText: 'text-pink-600',
        border: 'border-pink-200',
        hover: 'hover:border-pink-300',
        cta: 'text-pink-600 hover:text-pink-700 hover:bg-pink-50'
      },
      green: {
        icon: 'from-green-500 to-green-600',
        iconBg: 'bg-green-100',
        iconText: 'text-green-600',
        border: 'border-green-200',
        hover: 'hover:border-green-300',
        cta: 'text-green-600 hover:text-green-700 hover:bg-green-50'
      },
      red: {
        icon: 'from-red-500 to-red-600',
        iconBg: 'bg-red-100',
        iconText: 'text-red-600',
        border: 'border-red-200',
        hover: 'hover:border-red-300',
        cta: 'text-red-600 hover:text-red-700 hover:bg-red-50'
      }
    };
    return themes[theme as keyof typeof themes];
  };

  const colors = getColorClasses(colorTheme);

  return (
    <div className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2 ${colors.border} ${colors.hover} group relative overflow-hidden h-full flex flex-col`}>
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Icon */}
        <div className="mb-6">
          <div className={`w-16 h-16 ${colors.iconBg} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
            <div
              className={`w-8 h-8 ${colors.iconText}`}
              dangerouslySetInnerHTML={{ __html: iconSvg }}
            />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors duration-300">
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 leading-relaxed mb-6 flex-grow">
          {description}
        </p>

        {/* Highlight/Benefit */}
        {highlight && (
          <div className={`${colors.iconBg} rounded-lg p-3 mb-6`}>
            <p className={`text-sm font-semibold ${colors.iconText}`}>
              {highlight}
            </p>
          </div>
        )}

        {/* CTA Button */}
        {onCtaClick && (
          <button
            onClick={onCtaClick}
            className={`inline-flex items-center text-sm font-semibold ${colors.cta} transition-all duration-200 px-4 py-2 rounded-lg mt-auto`}
          >
            {t(ctaText)}
            <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-4 right-4 w-2 h-2 bg-gray-200 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
      <div className="absolute bottom-4 left-4 w-3 h-3 bg-gray-100 rounded-full opacity-30 group-hover:scale-125 transition-transform duration-500"></div>
    </div>
  );
};

export default FeatureCard;
