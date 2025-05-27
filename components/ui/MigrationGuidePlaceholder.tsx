import React, { ReactNode } from 'react';

interface MigrationGuidePlaceholderProps {
  children: ReactNode;
}

const MigrationGuidePlaceholder: React.FC<MigrationGuidePlaceholderProps> = ({ children }) => {
  return (
    <div className="p-6">
      <p className="text-center mb-4 text-gray-700">[Migration Guide: Learn how easy it is to switch to Pitch-it from Competitor X. We offer resources and support to make your transition seamless.]</p>
      <div>{children}</div>
    </div>
  );
};

export default MigrationGuidePlaceholder;
