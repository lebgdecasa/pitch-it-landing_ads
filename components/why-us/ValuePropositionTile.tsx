import React from 'react';
import IconWrapper from '@/components/ui/IconWrapper';

interface ValuePropositionTileProps {
  /** Optional SVG content string for the icon. To be replaced by a specific icon component or SVG. */
  iconSvg?: string; // TODO: ICON: Replace with actual SVG or icon component for this value proposition.
  /** The main headline of the value proposition. */
  headline: string;
  /** A short descriptive body text explaining the value proposition. */
  body: string;
  /** An optional metric highlighting the impact or benefit (e.g., "50% faster", "10x ROI"). */
  metric?: string;
}

/**
 * ValuePropositionTile displays a single value proposition, typically including an icon,
 * a headline, a brief description, and an optional metric.
 * Designed to be used in a grid layout to showcase key benefits.
 *
 * @param {ValuePropositionTileProps} props - The props for the ValuePropositionTile component.
 * @returns {JSX.Element} A div element representing the tile.
 */
const ValuePropositionTile: React.FC<ValuePropositionTileProps> = ({ iconSvg, headline, body, metric }) => {
  return (
    // Tile container: white background, padding, rounded corners, shadow.
    // Text alignment: centered on small screens, left-aligned on medium screens and up.
    // p-6 (24px), rounded-lg (8px), mb-4 (16px), mb-2 (8px), mb-3 (12px) - Adheres to 8pt spacing system.
    <div className="bg-white p-6 rounded-lg shadow-lg text-center md:text-left">
      {/* Icon section */}
      <div className="flex justify-center md:justify-start mb-4">
        {/* TODO: ICON: Replace placeholder IconWrapper with a specific icon for this tile.
            Example: <SpecificIcon className="w-12 h-12 text-blue-600" />
            The IconWrapper is used here as a placeholder.
            w-12 (48px), h-12 (48px) - Adheres to 8pt spacing system.
        */}
        <IconWrapper svgContent={iconSvg} className="w-12 h-12 text-blue-600" />
      </div>
      {/* Headline */}
      <h3 className="text-xl font-semibold mb-2">{headline}</h3>
      {/* Body text */}
      <p className="text-gray-600 text-sm mb-3">{body}</p>
      {/* Optional Metric */}
      {metric && (
        <p className="text-blue-600 font-semibold">{metric}</p>
      )}
    </div>
  );
};

export default ValuePropositionTile;
