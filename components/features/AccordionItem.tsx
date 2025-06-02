import React, { useState } from 'react';
import IconWrapper from '@/components/ui/IconWrapper';

interface AccordionItemProps {
  /** Optional SVG content string for the icon displayed next to the title. */
  iconSvg?: string; // TODO: ICON: Replace with actual SVG or specific icon components for each feature/FAQ.
  /** The title of the accordion item (e.g., feature name or FAQ question). */
  title: string;
  /** The main descriptive content displayed when the accordion item is open. */
  content: string;
  /** An array of strings, displayed as a bulleted list below the content. */
  bullets: string[];
  /** If true, the accordion item will be open by default. Defaults to false. */
  initiallyOpen?: boolean;
}

/**
 * AccordionItem is a reusable component that displays a title and collapsible content.
 * It can be used for FAQs, feature lists, or any other content that benefits from an accordion interface.
 * Includes an optional icon, title, main content paragraph, and a list of bullet points.
 *
 * @param {AccordionItemProps} props - The props for the AccordionItem component.
 * @returns {JSX.Element} A div element representing one item in an accordion.
 */
const AccordionItem: React.FC<AccordionItemProps> = ({
  iconSvg,
  title,
  content,
  bullets,
  initiallyOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(initiallyOpen);

  // TODO: ACCESSIBILITY: Consider adding `aria-controls` to the button and `id` to the content panel
  // for better accessibility linkage if this component becomes more complex or part of a larger accordion group.

  return (
    // Container for each accordion item with a bottom border.
    <div className="border-b border-gray-200">
      {/* Heading for the accordion button */}
      <h2>
        <button
          type="button"
          className="flex items-center justify-between w-full py-5 px-2 md:px-4 text-left font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen} // Indicates to assistive technologies whether the controlled content is expanded or collapsed.
        >
          <span className="flex items-center">
            {/* Icon for the accordion item.
                w-6 (24px), h-6 (24px), mr-3 (12px) - Adheres to 8pt spacing system.
            */}
            {/* TODO: ICON: Provide specific icons for each feature/FAQ item in `pages/features.tsx`. */}
            <IconWrapper svgContent={iconSvg} className="w-6 h-6 mr-3 text-blue-600" />
            {/* Title text */}
            <span className="text-base md:text-lg">{title}</span>
          </span>
          {/* Chevron icon indicating open/closed state */}
          <svg
            className={`w-5 h-5 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true" // Decorative icon
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </h2>
      {/* Collapsible content area */}
      {isOpen && (
        // Padding for the content area: py-5 (20px), px-2 (8px) or px-4 (16px) - Adheres to 8pt spacing system.
        <div className="py-5 px-2 md:px-4">
          {/* Main content paragraph. mb-4 (16px) */}
          <p className="text-gray-600 mb-4 text-sm md:text-base leading-relaxed">{content}</p>
          {/* Bullet points list. space-y-2 (8px) */}
          <ul className="list-disc list-inside space-y-2 text-sm md:text-base">
            {bullets.map((bullet, index) => (
              <li key={index} className="text-gray-600">
                {bullet}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AccordionItem;
