import React from 'react';
import PlaceholderSection from './PlaceholderSection';

const SuccessRateStatsPlaceholder = () => {
  return (
    <PlaceholderSection
      title="[Success Rate Statistics Placeholder]"
      // Apply bg-blue-100 to the section.
      // Original h2: text-2xl font-semibold text-blue-700
      // PlaceholderSection h2: text-2xl font-bold (default color)
      // We adjust font-semibold and text-blue-700 for the title.
      // PlaceholderSection default section padding is py-10 px-4, original was py-10. This is acceptable.
      // PlaceholderSection default text-center is fine.
      className="bg-blue-100 [&>h2]:font-semibold [&>h2]:text-blue-700"
    >
      {/* This div replicates the original inner div's p-10. text-center is already on PlaceholderSection. */}
      <div className="p-10"> 
        <p className="mt-2 text-blue-600">
          e.g., 75% of users felt more confident after practicing with our AI.
        </p>
      </div>
    </PlaceholderSection>
  );
};

export default SuccessRateStatsPlaceholder;
