import React from 'react';
import PlaceholderSection from './PlaceholderSection';

const IntegrationsPlaceholder = () => {
  return (
    <PlaceholderSection
      title="[Integration Capabilities: Airtable, Notion, etc. Placeholder]"
      // Original section: py-10 text-center bg-gray-200. PlaceholderSection default is py-10 px-4 text-center. This is fine.
      // Original h2: text-xl font-semibold text-gray-700.
      // PlaceholderSection h2 is text-2xl font-bold. We adjust this.
      className="bg-gray-200 [&>h2]:text-xl [&>h2]:font-semibold [&>h2]:text-gray-700"
    >
      {/* This div replicates the original inner div's p-10. */}
      <div className="p-10">
        <p className="mt-2 text-gray-600">
          Seamlessly connect with your existing workflow tools.
        </p>
      </div>
    </PlaceholderSection>
  );
};

export default IntegrationsPlaceholder;
