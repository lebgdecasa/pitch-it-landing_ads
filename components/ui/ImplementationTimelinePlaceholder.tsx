import React from 'react';
import PlaceholderSection from './PlaceholderSection';

const ImplementationTimelinePlaceholder = () => {
  return (
    <PlaceholderSection
      title="[Implementation Timeline Placeholder]"
      contentText="Example: Week 1: Onboarding, Week 2: Training..."
      // Original section: text-center p-10 bg-teal-50.
      // PlaceholderSection default is py-10 px-4 text-center.
      // We override padding to p-10 and set bg.
      // Original h2: text-xl font-semibold. PlaceholderSection h2 is text-2xl font-bold. We adjust.
      className="p-10 bg-teal-50 [&>h2]:text-xl [&>h2]:font-semibold"
      // Original p had mt-2. PlaceholderSection's p for contentText does not. This is a minor acceptable difference for a placeholder.
    />
  );
};

export default ImplementationTimelinePlaceholder;
