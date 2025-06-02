import React from 'react';

interface FeatureWorkflowStepProps {
  /** The step number, formatted as a string (e.g., "01", "02"). */
  stepNumber: string;
  /** The title of the workflow step. */
  title: string;
  /** A brief description of the workflow step. */
  description: string;
  // TODO: PROP: Consider an `iconName` or `iconSvg` prop if visual icons are desired for each step.
}

/**
 * FeatureWorkflowStep displays a single step in a workflow or process.
 * It typically includes a step number, title, and description.
 * Designed for use in horizontal scrolling lists on mobile or grids on desktop.
 *
 * @param {FeatureWorkflowStepProps} props - The props for the FeatureWorkflowStep component.
 * @returns {JSX.Element} A div element representing a single workflow step.
 */
const FeatureWorkflowStep: React.FC<FeatureWorkflowStepProps> = ({ stepNumber, title, description }) => {
  // TODO: DATA: Workflow step content is currently static. Determine if it needs to be fetched dynamically.

  return (
    // Card container: white background, padding, rounded corners, shadow.
    // Sizing: full width on smallest screens, fixed width on sm/md for horizontal scroll/grid.
    // `flex-shrink-0` prevents shrinking in flex container. `snap-center` for scroll snapping.
    // Text alignment: centered on small screens, left-aligned on medium and up.
    // p-6 (24px), rounded-lg (8px), mb-4 (16px), mb-2 (8px) - Adheres to 8pt spacing system.
    // sm:w-64 (256px), md:w-72 (288px)
    <div className="flex-shrink-0 w-full sm:w-64 md:w-72 p-6 bg-white rounded-lg shadow-lg snap-center text-center md:text-left">
      {/* Step number: large, bold, blue text. */}
      <div className="text-5xl font-bold text-blue-500 mb-4">{stepNumber}</div>
      {/* Title of the step. */}
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      {/* Description of the step. */}
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
};

export default FeatureWorkflowStep;
