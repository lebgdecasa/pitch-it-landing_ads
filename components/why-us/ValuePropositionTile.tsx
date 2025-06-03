import React, { useState, useRef, useEffect } from 'react';

interface CustomerStory {
  company: string;
  outcome: string;
  metric: string;
}

interface EnhancedValuePropositionTileProps {
  headline: string;
  body: string;
  metric: string;
  icon?: string;
  colorTheme: 'green' | 'blue' | 'purple' | 'orange' | 'teal' | 'pink';
  customerStory?: CustomerStory;
  beforeAfter?: {
    before: string;
    after: string;
  };
  isInteractive?: boolean;
  detailedBenefits?: string[];
  ctaText?: string;
  onCtaClick?: () => void;
}

/**
 * Enhanced ValuePropositionTile with customer-focused storytelling and interactive elements
 * Based on 2024-2025 best practices for value proposition presentation
 */
const EnhancedValuePropositionTile: React.FC<EnhancedValuePropositionTileProps> = ({
  headline,
  body,
  metric,
  icon,
  colorTheme,
  customerStory,
  beforeAfter,
  isInteractive = true,
  detailedBenefits = [],
  ctaText = "Learn More",
  onCtaClick
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [animatedValue, setAnimatedValue] = useState(0);
  const tileRef = useRef<HTMLDivElement>(null);

  const getColorClasses = (theme: EnhancedValuePropositionTileProps['colorTheme']) => {
    const themes = {
      green: {
        border: 'border-green-500',
        iconBg: 'from-green-500 to-emerald-500',
        iconBgLight: 'bg-green-100',
        iconText: 'text-green-600',
        text: 'text-green-600',
        textHover: 'group-hover:text-green-600',
        bg: 'from-green-50 to-emerald-50',
        button: 'bg-green-500 hover:bg-green-600',
        progress: 'bg-green-500'
      },
      blue: {
        border: 'border-blue-500',
        iconBg: 'from-blue-500 to-indigo-500',
        iconBgLight: 'bg-blue-100',
        iconText: 'text-blue-600',
        text: 'text-blue-600',
        textHover: 'group-hover:text-blue-600',
        bg: 'from-blue-50 to-indigo-50',
        button: 'bg-blue-500 hover:bg-blue-600',
        progress: 'bg-blue-500'
      },
      purple: {
        border: 'border-purple-500',
        iconBg: 'from-purple-500 to-violet-500',
        iconBgLight: 'bg-purple-100',
        iconText: 'text-purple-600',
        text: 'text-purple-600',
        textHover: 'group-hover:text-purple-600',
        bg: 'from-purple-50 to-violet-50',
        button: 'bg-purple-500 hover:bg-purple-600',
        progress: 'bg-purple-500'
      },
      orange: {
        border: 'border-orange-500',
        iconBg: 'from-orange-500 to-red-500',
        iconBgLight: 'bg-orange-100',
        iconText: 'text-orange-600',
        text: 'text-orange-600',
        textHover: 'group-hover:text-orange-600',
        bg: 'from-orange-50 to-red-50',
        button: 'bg-orange-500 hover:bg-orange-600',
        progress: 'bg-orange-500'
      },
      teal: {
        border: 'border-teal-500',
        iconBg: 'from-teal-500 to-cyan-500',
        iconBgLight: 'bg-teal-100',
        iconText: 'text-teal-600',
        text: 'text-teal-600',
        textHover: 'group-hover:text-teal-600',
        bg: 'from-teal-50 to-cyan-50',
        button: 'bg-teal-500 hover:bg-teal-600',
        progress: 'bg-teal-500'
      },
      pink: {
        border: 'border-pink-500',
        iconBg: 'from-pink-500 to-rose-500',
        iconBgLight: 'bg-pink-100',
        iconText: 'text-pink-600',
        text: 'text-pink-600',
        textHover: 'group-hover:text-pink-600',
        bg: 'from-pink-50 to-rose-50',
        button: 'bg-pink-500 hover:bg-pink-600',
        progress: 'bg-pink-500'
      }
    };
    return themes[theme];
  };

  const colors = getColorClasses(colorTheme);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Animate the metric value
          const numericValue = parseInt(metric.replace(/\D/g, ''));
          if (numericValue) {
            let start = 0;
            const duration = 2000;
            const increment = numericValue / (duration / 50);

            const timer = setInterval(() => {
              start += increment;
              if (start >= numericValue) {
                setAnimatedValue(numericValue);
                clearInterval(timer);
              } else {
                setAnimatedValue(Math.floor(start));
              }
            }, 50);
          }
        }
      },
      { threshold: 0.3 }
    );

    if (tileRef.current) {
      observer.observe(tileRef.current);
    }

    return () => observer.disconnect();
  }, [metric]);

  const formatMetric = (value: number) => {
    const originalMetric = metric;
    return originalMetric.replace(/\d+/, value.toString());
  };

  return (
    <div
      ref={tileRef}
      className={`bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-t-4 ${colors.border} group relative overflow-hidden ${isExpanded ? 'row-span-2' : ''}`}
    >
      {/* Background Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

      {/* Content */}
      <div className="relative z-10">
        {/* Icon */}
        <div className="w-16 h-16 bg-gradient-to-r ${colors.iconBg} rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
          {icon ? (
            <div className="w-8 h-8 text-white" dangerouslySetInnerHTML={{ __html: icon }} />
          ) : (
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
          )}
        </div>

        {/* Headline */}
        <h3 className={`text-xl font-semibold text-gray-800 mb-4 text-center ${colors.textHover} transition-colors duration-300`}>
          {headline}
        </h3>

        {/* Body */}
        <p className="text-gray-600 text-center mb-6 leading-relaxed">
          {body}
        </p>

        {/* Animated Metric */}
        <div className="text-center mb-6">
          <div className={`text-3xl font-bold ${colors.text} transition-colors duration-300 mb-2`}>
            {isVisible ? formatMetric(animatedValue) : metric}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
              className={`h-2 ${colors.progress} rounded-full transition-all duration-2000 ease-out`}
              style={{ width: isVisible ? '100%' : '0%' }}
            ></div>
          </div>
        </div>

        {/* Before/After Comparison */}
        {beforeAfter && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-red-500 text-sm font-medium mb-1">Before</div>
                <div className="text-gray-700 text-sm">{beforeAfter.before}</div>
              </div>
              <div>
                <div className={`${colors.text} text-sm font-medium mb-1`}>After</div>
                <div className="text-gray-700 text-sm font-semibold">{beforeAfter.after}</div>
              </div>
            </div>
          </div>
        )}

        {/* Customer Story */}
        {customerStory && (
          <div className={`bg-gradient-to-r ${colors.bg} border border-gray-200 rounded-lg p-4 mb-6`}>
            <div className="flex items-center mb-2">
              <div className={`w-6 h-6 ${colors.iconBgLight} rounded-full flex items-center justify-center mr-2`}>
                <svg className={`w-3 h-3 ${colors.iconText}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                </svg>
              </div>
              <span className="font-semibold text-gray-800 text-sm">{customerStory.company}</span>
            </div>
            <p className="text-gray-700 text-sm mb-2">{customerStory.outcome}</p>
            <div className={`${colors.text} font-bold text-sm`}>{customerStory.metric}</div>
          </div>
        )}

        {/* Expandable Details */}
        {isInteractive && detailedBenefits.length > 0 && (
          <div className="mb-6">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full text-left flex items-center justify-between text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              <span className="text-sm font-medium">See detailed benefits</span>
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isExpanded && (
              <div className="mt-4 space-y-2">
                {detailedBenefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className={`w-4 h-4 ${colors.iconBgLight} rounded-full flex items-center justify-center mt-0.5 flex-shrink-0`}>
                      <svg className={`w-2 h-2 ${colors.iconText}`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <span className="text-gray-600 text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* CTA Button */}
        {onCtaClick && (
          <div className="text-center">
            <button
              onClick={onCtaClick}
              className={`${colors.button} text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl`}
            >
              {ctaText}
            </button>
          </div>
        )}

        {/* Decorative Element */}
        <div className="mt-6 flex justify-center">
          <div className={`w-12 h-1 bg-gradient-to-r ${colors.iconBg} rounded-full group-hover:w-16 transition-all duration-300`}></div>
        </div>
      </div>

      {/* Floating Decorative Elements */}
      <div className={`absolute top-4 right-4 w-2 h-2 ${colors.iconText} opacity-20 rounded-full group-hover:scale-150 transition-transform duration-500`}></div>
      <div className={`absolute bottom-4 left-4 w-3 h-3 ${colors.iconText} opacity-10 rounded-full group-hover:scale-125 transition-transform duration-500`}></div>
    </div>
  );
};

export default EnhancedValuePropositionTile;
