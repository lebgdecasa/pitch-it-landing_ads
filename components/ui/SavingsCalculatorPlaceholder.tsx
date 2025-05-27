import React from 'react';
import PlaceholderSection from './PlaceholderSection';

const SavingsCalculatorPlaceholder = () => {
  return (
    <PlaceholderSection
      title="[Time/Cost Savings Calculator Placeholder]"
      // Original section: text-center py-10 bg-indigo-100. PlaceholderSection default is py-10 px-4 text-center. This is fine.
      // Original h2: text-2xl font-semibold text-indigo-700.
      // PlaceholderSection h2 is text-2xl font-bold. We adjust this.
      className="bg-indigo-100 [&>h2]:font-semibold [&>h2]:text-indigo-700"
    >
      {/* This div replicates the original inner div's p-10. */}
      <div className="p-10">
        <p className="mt-2 text-indigo-600">
          See how much you save with Pitch-it compared to Competitor X.
        </p>
      </div>
    </PlaceholderSection>
  );
};

export default SavingsCalculatorPlaceholder;
