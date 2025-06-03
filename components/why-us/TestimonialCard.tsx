import React from 'react';

interface EnhancedTestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  company?: string;
  companyLogo?: string;
  rating?: number;
  outcome?: string;
  linkedinUrl?: string;
  isVideoTestimonial?: boolean;
  videoThumbnail?: string;
  onVideoPlay?: () => void;
}

/**
 * Enhanced TestimonialCard with modern trust-building elements
 * Based on 2024-2025 best practices for social proof and credibility
 */
const EnhancedTestimonialCard: React.FC<EnhancedTestimonialCardProps> = ({
  quote,
  author,
  role,
  company,
  companyLogo,
  rating = 5,
  outcome,
  linkedinUrl,
  isVideoTestimonial = false,
  videoThumbnail,
  onVideoPlay
}) => {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-l-4 border-pink-500 group relative overflow-hidden">
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="relative z-10">
        {/* Header with Rating and Company */}
        <div className="flex items-center justify-between mb-6">
          {/* Rating Stars */}
          <div className="flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-5 h-5 transition-all duration-300 ${
                  i < rating
                    ? 'text-yellow-400 group-hover:scale-110'
                    : 'text-gray-300'
                }`}
                style={{ transitionDelay: `${i * 100}ms` }}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            ))}
          </div>

          {/* Company Logo */}
          {companyLogo && (
            <div className="w-12 h-8 relative opacity-70 group-hover:opacity-100 transition-opacity duration-300">
              <img
                src={companyLogo}
                alt={`${company} logo`}
                className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
              />
            </div>
          )}
        </div>

        {/* Video Testimonial or Quote */}
        {isVideoTestimonial && videoThumbnail ? (
          <div className="relative mb-6 cursor-pointer" onClick={onVideoPlay}>
            <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
              <img
                src={videoThumbnail}
                alt="Video testimonial thumbnail"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/10 transition-colors duration-300">
                <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-pink-500 ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Quote */
          <blockquote className="text-gray-700 text-lg leading-relaxed mb-6 italic group-hover:text-gray-800 transition-colors duration-300">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd"/>
              </svg>
            </div>
            "{quote}"
          </blockquote>
        )}

        {/* Outcome/Result Highlight */}
        {outcome && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 mb-6 group-hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
              </div>
              <span className="text-green-700 font-semibold text-sm">{outcome}</span>
            </div>
          </div>
        )}

        {/* Author Info */}
        <div className="flex items-center justify-between">
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
                {company && (
                  <>
                    <span className="text-gray-400 mx-1">at</span>
                    <span className="font-medium text-gray-700">{company}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* LinkedIn Verification */}
          {linkedinUrl && (
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg"
              title="View LinkedIn Profile"
            >
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd"/>
              </svg>
            </a>
          )}
        </div>

        {/* Verified Badge */}
        <div className="flex items-center justify-center mt-4">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 border border-blue-200">
            <svg className="w-4 h-4 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            <span className="text-blue-700 text-xs font-medium">Verified Customer</span>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-4 right-4 w-2 h-2 bg-pink-300 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
      <div className="absolute bottom-4 left-4 w-3 h-3 bg-purple-300 rounded-full opacity-30 group-hover:scale-125 transition-transform duration-500"></div>
    </div>
  );
};

export default EnhancedTestimonialCard;

