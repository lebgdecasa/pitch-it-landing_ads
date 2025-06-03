import React from 'react';
import Image from 'next/image';

interface FounderSpotlightCardProps {
  name: string;
  title: string;
  bio: string;
  imageSrc: string;
  imageAlt: string;
  linkedinUrl?: string;
  instagramUrl?: string;
}

const FounderSpotlightCard: React.FC<FounderSpotlightCardProps> = ({
  name,
  title,
  bio,
  imageSrc,
  imageAlt,
  linkedinUrl,
  instagramUrl,
}) => {
  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden group max-w-md mx-auto">
      {/* Header with Gradient */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-6 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Ccircle cx='20' cy='20' r='2'/%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        {/* Profile Image */}
        <div className="relative z-10 flex justify-center">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl group-hover:scale-110 transition-transform duration-500">
            <Image
              src={imageSrc}
              alt={imageAlt}
              width={128}
              height={128}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-4 left-4 w-3 h-3 bg-white/30 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
        <div className="absolute top-8 right-6 w-2 h-2 bg-white/40 rounded-full group-hover:scale-125 transition-transform duration-500"></div>
        <div className="absolute bottom-4 right-4 w-4 h-4 bg-white/20 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
      </div>

      {/* Content */}
      <div className="p-8 relative flex flex-col flex-1">
        {/* Name and Title */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors duration-300">
            {name}
          </h3>
          <div className="inline-block bg-gradient-to-r from-indigo-100 to-purple-100 px-4 py-2 rounded-full">
            <p className="text-indigo-700 font-semibold text-sm">
              {title}
            </p>
          </div>
        </div>

        {/* Bio */}
        <p className="text-gray-600 leading-relaxed text-center group-hover:text-gray-700 transition-colors duration-300 flex-1">
          {bio}
        </p>

        {/* Social Links */}
        <div className="flex justify-center space-x-4 mt-6">
          {linkedinUrl && (
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 cursor-pointer shadow-lg"
              aria-label="LinkedIn"
            >
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd"/>
              </svg>
            </a>
          )}
          {instagramUrl && (
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-gradient-to-r from-pink-500 to-yellow-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 cursor-pointer shadow-lg"
              aria-label="Instagram"
            >
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5zm4.25 3.25a5.25 5.25 0 1 1-5.25 5.25A5.25 5.25 0 0 1 12 6.75zm0 1.5a3.75 3.75 0 1 0 3.75 3.75A3.75 3.75 0 0 0 12 8.25zm5.5-.75a1 1 0 1 1-1 1 1 1 0 0 1 1-1z"/>
              </svg>
            </a>
          )}
        </div>

        {/* Decorative Bottom Border */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
      </div>
    </div>
  );
};

export default FounderSpotlightCard;
