import React from 'react';

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  quote,
  author,
  role,
}) => {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-l-4 border-pink-500 group relative overflow-hidden">
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Quote Icon */}
      <div className="relative z-10">
        <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd"/>
          </svg>
        </div>

        {/* Quote */}
        <blockquote className="text-gray-700 text-lg leading-relaxed mb-6 italic group-hover:text-gray-800 transition-colors duration-300">
          "{quote}"
        </blockquote>

        {/* Author Info */}
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
            <span className="text-white font-semibold text-lg">
              {author.charAt(0)}
            </span>
          </div>
          <div>
            <div className="font-semibold text-gray-800 group-hover:text-pink-600 transition-colors duration-300">
              {author}
            </div>
            <div className="text-gray-600 text-sm">
              {role}
            </div>
          </div>
        </div>

        {/* Rating Stars */}
        <div className="flex justify-center mt-6 space-x-1">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className="w-5 h-5 text-yellow-400 group-hover:scale-110 transition-transform duration-300"
              style={{ transitionDelay: `${i * 100}ms` }}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
          ))}
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-4 right-4 w-2 h-2 bg-pink-300 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
      <div className="absolute bottom-4 left-4 w-3 h-3 bg-purple-300 rounded-full opacity-30 group-hover:scale-125 transition-transform duration-500"></div>
    </div>
  );
};

export default TestimonialCard;

