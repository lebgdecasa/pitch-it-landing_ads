"use client";

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { ChatPersona } from '../../../types';

interface PersonaModalProps {
  persona: ChatPersona;
  isOpen: boolean;
  onClose: () => void;
  jobTitle?: string;
  needsDetails?: string;
  background?: string;
  goals?: string[];
  challenges?: string[];
  preferredCommunication?: string;
}

/**
 * Modal component to display full persona details
 */
export const PersonaModal: React.FC<PersonaModalProps> = ({
  persona,
  isOpen,
  onClose,
  jobTitle = "Business Advisor",
  needsDetails = "Looking for clear value proposition and market fit. Wants to understand the business model and revenue streams. Concerned about scaling potential and competitive positioning.",
  background = "15+ years in venture capital with a focus on SaaS and marketplace startups. Former founder of two successful companies.",
  goals = ["Identify promising investment opportunities", "Help founders build sustainable businesses", "Create long-term partnerships with entrepreneurs"],
  challenges = ["Limited time for evaluating pitches", "Finding companies with genuine innovation", "Balancing portfolio with varied risk levels"],
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle ESC key press
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // Handle click outside modal
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      // Add event listeners when modal is open
      document.addEventListener('keydown', handleEsc);
      document.addEventListener('mousedown', handleClickOutside);
      // Lock scroll
      document.body.style.overflow = 'hidden';
    }

    // Clean up
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.removeEventListener('mousedown', handleClickOutside);
      // Restore scroll
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Default placeholder for missing avatars
  const placeholderAvatar = (
    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-deep-blue">
      <span className="text-2xl font-semibold">{persona.name[0]}</span>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header with close button */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Persona Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Persona profile card */}
        <div className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {persona.avatarUrl ? (
                <Image
                  src={persona.avatarUrl}
                  alt={persona.name}
                  width={80}
                  height={80}
                  className="rounded-full"
                />
              ) : placeholderAvatar}
            </div>

            {/* Basic info */}
            <div>
              <h3 className="text-xl font-medium text-gray-900">{persona.name}</h3>
              <p className="text-gray-600">{jobTitle}</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 mt-2">
                {persona.role}
              </span>
            </div>
          </div>

          {/* Details sections */}
          <div className="space-y-6">
            {/* Background */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Background</h4>
              <p className="text-gray-800">{background}</p>
            </div>

            {/* Needs */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Needs &amp; Expectations</h4>
              <p className="text-gray-800">{needsDetails}</p>
            </div>

            {/* Goals */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Goals</h4>
              <ul className="list-disc list-inside text-gray-800 space-y-1">
                {goals.map((goal, index) => (
                  <li key={index}>{goal}</li>
                ))}
              </ul>
            </div>

            {/* Challenges */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Challenges</h4>
              <ul className="list-disc list-inside text-gray-800 space-y-1">
                {challenges.map((challenge, index) => (
                  <li key={index}>{challenge}</li>
                ))}
              </ul>
            </div>

          </div>
        </div>

        {/* Footer with action button */}
        <div className="border-t p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md text-sm font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonaModal;
