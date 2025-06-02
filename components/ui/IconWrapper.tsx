import React from 'react';

interface IconWrapperProps {
  /** Raw SVG string to be rendered directly. Useful for dynamic SVGs or those stored as strings. */
  svgContent?: string;
  /** Additional CSS classes for styling the wrapper span. */
  className?: string;
  // TODO: PROP: Consider adding 'size' prop (e.g., sm, md, lg) to standardize icon dimensions.
  // TODO: PROP: Consider adding 'color' prop for common icon color overrides (e.g., text-blue-500).
  // TODO: PROP: Consider 'iconName' prop if integrating with an icon library (e.g., 'user', 'arrow-left').
}

/**
 * IconWrapper is a flexible component for rendering icons.
 * It can render an SVG string directly or serve as a placeholder for future icon library integration.
 * This component is intended to standardize icon usage and provide a single point for future enhancements
 * like accessibility features (aria-labels, roles) or consistent styling.
 *
 * @param {IconWrapperProps} props - The props for the IconWrapper component.
 * @returns {JSX.Element} A span element containing the icon or a placeholder.
 */
const IconWrapper: React.FC<IconWrapperProps> = ({ svgContent, className }) => {
  // If svgContent is provided, render it directly using dangerouslySetInnerHTML.
  // This is useful for SVGs that are dynamically generated or loaded as strings.
  // Ensure that svgContent is from a trusted source to prevent XSS vulnerabilities.
  if (svgContent) {
    // TODO: SECURITY: Ensure svgContent is sanitized if coming from user input or less trusted CMS.
    return (
      <span
        className={className}
        dangerouslySetInnerHTML={{ __html: svgContent }}
        role="img" // Basic accessibility, consider adding aria-label if svgContent doesn't have a title
      />
    );
  }

  // Placeholder for when an icon library (e.g., Heroicons, FontAwesome) might be used,
  // or when icons are loaded via an `src` prop (e.g., <img src="/icons/my-icon.svg" />).
  // The current placeholder is a gray rounded square.
  // w-6 (24px), h-6 (24px) - Adheres to 8pt spacing system.
  // TODO: ICON: Implement actual icon rendering strategy (e.g., using an icon library, mapping names to SVGs).
  // TODO: ACCESSIBILITY: Add aria-label or title to placeholder if it conveys meaning, or aria-hidden="true" if purely decorative.
  return (
    <span className={`inline-block w-6 h-6 bg-gray-300 rounded ${className}`}>
      {/* This content will be replaced by the actual icon or icon component */}
    </span>
  );
};

export default IconWrapper;
