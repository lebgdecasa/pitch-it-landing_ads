import React, { ReactNode } from 'react';

interface CohortSuccessMetricsPlaceholderProps {
  children: ReactNode;
}

const CohortSuccessMetricsPlaceholder: React.FC<CohortSuccessMetricsPlaceholderProps> = ({ children }) => {
  return (
    <div className="p-6">
      {/* Content provided as children will include the A/B test variants */}
      {children}
    </div>
  );
};

export default CohortSuccessMetricsPlaceholder;
