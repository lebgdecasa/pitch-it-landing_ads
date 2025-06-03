import React from 'react';

interface FeatureWorkflowStepProps {
  stepNumber: string;
  title: string;
  description: string;
}

const FeatureWorkflowStep: React.FC<FeatureWorkflowStepProps> = ({
  stepNumber,
  title,
  description,
}) => {
  const getStepColor = (step: string) => {
    switch (step) {
      case '01': return 'from-purple-500 to-pink-500';
      case '02': return 'from-blue-500 to-indigo-500';
      case '03': return 'from-green-500 to-teal-500';
      case '04': return 'from-orange-500 to-red-500';
      case '05': return 'from-indigo-500 to-purple-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getIconColor = (step: string) => {
    switch (step) {
      case '01': return 'text-purple-600';
      case '02': return 'text-blue-600';
      case '03': return 'text-green-600';
      case '04': return 'text-orange-600';
      case '05': return 'text-indigo-600';
      default: return 'text-gray-600';
    }
  };

  const getIcon = (step: string) => {
    switch (step) {
      case '01':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        );
      case '02':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
          </svg>
        );
      case '03':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"/>
          </svg>
        );
      case '04':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 104 0 2 2 0 00-4 0zm6 0a2 2 0 104 0 2 2 0 00-4 0z"/>
          </svg>
        );
      case '05':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-shrink-0 w-full md:w-auto snap-center group">
      <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 h-full">
        {/* Step Number Circle */}
        <div className="relative mb-6">
          <div className={`w-16 h-16 bg-gradient-to-r ${getStepColor(stepNumber)} rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <span className="text-white font-bold text-lg">{stepNumber}</span>
          </div>

          {/* Icon */}
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <div className={getIconColor(stepNumber)}>
              {getIcon(stepNumber)}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-300">
            {title}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            {description}
          </p>
        </div>

        {/* Decorative Element */}
        <div className="mt-4 flex justify-center">
          <div className={`w-12 h-1 bg-gradient-to-r ${getStepColor(stepNumber)} rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-300`}></div>
        </div>
      </div>
    </div>
  );
};

export default FeatureWorkflowStep;

