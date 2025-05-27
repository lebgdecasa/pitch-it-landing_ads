import React, { ReactNode } from 'react';

interface ComparisonTablePlaceholderProps {
  children: ReactNode;
}

const ComparisonTablePlaceholder: React.FC<ComparisonTablePlaceholderProps> = ({ children }) => {
  return (
    <div className="p-6">
      <h3 className="text-xl font-semibold text-center mb-4">Feature Comparison: Pitch-it vs. Competitor X</h3>
      {children}
    </div>
  );
};

export default ComparisonTablePlaceholder;
