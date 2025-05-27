import React from 'react';
import PlaceholderSection from './PlaceholderSection';

const WhiteLabelOptionsPlaceholder = () => {
  return (
    <PlaceholderSection
      title="[White-Label Options Discussion Placeholder]"
      contentText="Offer Pitch-it under your accelerator's brand."
      // Original section: text-center p-10 bg-purple-100.
      // PlaceholderSection default is py-10 px-4 text-center.
      // We override padding to p-10 to match original.
      // Original h2: text-xl font-semibold. PlaceholderSection h2 is text-2xl font-bold. We adjust.
      className="p-10 bg-purple-100 [&>h2]:text-xl [&>h2]:font-semibold"
      // Original p had mt-2. PlaceholderSection's p for contentText does not. This is a minor acceptable difference.
    />
  );
};

export default WhiteLabelOptionsPlaceholder;
