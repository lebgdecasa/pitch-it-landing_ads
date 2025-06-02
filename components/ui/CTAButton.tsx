import React from 'react';

interface CTAButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Text content of the button */
  text: string;
  /** If true, applies primary button styling. Defaults to false. */
  primary?: boolean;
  /** If true, applies secondary button styling. Defaults to false. */
  secondary?: boolean;
  /** Additional classes for custom styling. */
  className?: string;
  /** Data attribute for analytics tracking (e.g., `data-cta-id="hero-learn-more"`). */
  'data-cta-id'?: string;
}

/**
 * CTAButton is a reusable button component designed for Call-to-Action purposes.
 * It supports primary, secondary, and default styles, and integrates with
 * Tailwind CSS and global button animations defined in `globals.css` (via `cta-button` class).
 *
 * @param {CTAButtonProps} props - The props for the CTAButton component.
 * @returns {JSX.Element} A button element.
 */
const CTAButton: React.FC<CTAButtonProps> = ({
  text,
  primary = false,
  secondary = false,
  className = '',
  'data-cta-id': dataCtaId, // Destructure and rename for clarity within the component
  ...props // Spread remaining button attributes (e.g., onClick, type)
}) => {
  // Base styles applicable to all button variants
  // Includes font, padding, rounded corners, focus styles, transitions, and the global .cta-button class for hover effects.
  // py-3 (12px), px-6 (24px) - Adheres to 8pt spacing system.
  const baseStyle = 'font-semibold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 ease-in-out cta-button';

  // Determine specific styles based on primary/secondary props
  let specificStyle = '';
  if (primary) {
    // Primary style: Blue background, white text. Uses colors from the existing design system.
    specificStyle = 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500';
  } else if (secondary) {
    // Secondary style: White background, blue text, blue border.
    specificStyle = 'bg-white text-blue-700 border border-blue-700 hover:bg-blue-50 focus:ring-blue-500';
  } else {
    // Default style: Gray background, dark gray text. Used if neither primary nor secondary.
    // TODO: DESIGN: Confirm if a default (tertiary) style is needed or if all CTAs will be primary/secondary.
    specificStyle = 'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-400';
  }

  return (
    <button
      className={`${baseStyle} ${specificStyle} ${className}`} // Combine base, specific, and any custom classes
      data-cta-id={dataCtaId} // Apply data attribute for analytics
      {...props} // Spread other HTML button attributes
    >
      {text}
    </button>
  );
};

export default CTAButton;
