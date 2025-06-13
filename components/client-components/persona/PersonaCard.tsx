// components/client-components/persona/PersonaCard.tsx
"use client";

import React from 'react';
import Image from 'next/image';

interface PersonaCardProps {
  persona: {
    id: string;
    name: string;
    role: string;
    company?: string;
    description: string;
    accentColor?: string;
    avatarUrl?: string;
    jobTitle?: string;
    needsSnippet?: string;
  };
  onShowDetails: () => void;
}

const getAccentColors = (color?: string) => {
  const colorMap: { [key: string]: { light: string; text: string } } = {
    '#6366f1': { light: 'bg-indigo-100', text: 'text-indigo-800' },
    '#8b5cf6': { light: 'bg-purple-100', text: 'text-purple-800' },
    '#ec4899': { light: 'bg-pink-100', text: 'text-pink-800' },
    '#3b82f6': { light: 'bg-blue-100', text: 'text-blue-800' },
  };
  return colorMap[color || '#6366f1'] || { light: 'bg-gray-100', text: 'text-gray-800' };
};

export const PersonaCard: React.FC<PersonaCardProps> = ({
  persona,
  onShowDetails,
}) => {
  const colors = getAccentColors(persona.accentColor);

  const placeholderAvatar = (
    <div className={`w-14 h-14 ${colors.light} rounded-full flex items-center justify-center ${colors.text}`}>
      <span className="text-xl font-semibold">{persona.name[0]}</span>
    </div>
  );

  return (
    <div
      className={`bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md cursor-pointer transition-shadow`}
      onClick={onShowDetails}
    >
      <div className="flex items-center mb-3">
        {/* Avatar */}
        <div className="flex-shrink-0 mr-3">
          {persona.avatarUrl ? (
            <Image
              src={persona.avatarUrl}
              alt={persona.name}
              width={56}
              height={56}
              className="rounded-full"
            />
          ) : placeholderAvatar}
        </div>
        {/* Basic Info */}
        <div>
          <h3 className={`font-semibold ${colors.text}`}>{persona.name}</h3>
          <p className="text-sm text-gray-600">{persona.jobTitle || persona.role}</p>
        </div>
      </div>
      {/* Needs Snippet */}
      <div className="mb-3">
        <p className="text-sm text-gray-700">{persona.needsSnippet || persona.description}</p>
      </div>
    </div>
  );
};

export default PersonaCard;
