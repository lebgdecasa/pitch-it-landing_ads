import React from 'react';

interface ValuePropositionTileProps {
  headline: string;
  body: string;
  metric: string;
}

const ValuePropositionTile: React.FC<ValuePropositionTileProps> = ({
  headline,
  body,
  metric,
}) => {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-t-4 border-blue-500 group relative overflow-hidden">
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Content */}
      <div className="relative z-10">
        {/* Icon */}
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
          </svg>
        </div>

        {/* Headline */}
        <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center group-hover:text-blue-600 transition-colors duration-300">
          {headline}
        </h3>

        {/* Body */}
        <p className="text-gray-600 text-center mb-6 leading-relaxed">
          {body}
        </p>

        {/* Metric */}
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 group-hover:text-indigo-600 transition-colors duration-300">
            {metric}
          </div>
        </div>

        {/* Decorative Element */}
        <div className="mt-6 flex justify-center">
          <div className="w-12 h-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full group-hover:w-16 transition-all duration-300"></div>
        </div>
      </div>

      {/* Floating Decorative Elements */}
      <div className="absolute top-4 right-4 w-2 h-2 bg-blue-300 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
      <div className="absolute bottom-4 left-4 w-3 h-3 bg-indigo-300 rounded-full opacity-30 group-hover:scale-125 transition-transform duration-500"></div>
    </div>
  );
};

export default ValuePropositionTile;

