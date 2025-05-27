import React from 'react';
import PlaceholderSection from './PlaceholderSection';

const TrustBadgesPlaceholder = () => {
  return (
    <PlaceholderSection 
      title="Trusted By Founders From"
      // text-xl from original h2, mb-4 is default in PlaceholderSection
      // className to match original section's padding and override PlaceholderSection's default h2 size
      className="py-8 px-4 [&>h2]:text-xl" 
    >
      <div className="my-4 p-4 bg-gray-100 border-dashed border-2 border-gray-300 rounded-lg inline-block">
        <p className="text-gray-500">[Trust Badges from Founder Communities / Accelerators]</p>
        {/* Example: <img src="/path/to/badge1.png" alt="Badge 1" className="inline-block mx-2 h-12" /> */}
      </div>
    </PlaceholderSection>
  );
};

export default TrustBadgesPlaceholder;
