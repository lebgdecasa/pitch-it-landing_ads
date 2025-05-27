import React, { ReactNode } from 'react';

interface PartnershipLevelsPlaceholderProps {
  children: ReactNode;
}

const PartnershipLevelsPlaceholder: React.FC<PartnershipLevelsPlaceholderProps> = ({ children }) => {
  return (
    <div className="p-6">
      {/* Content provided as children will include the A/B test variants */}
      {children}
    </div>
  );
};

export default PartnershipLevelsPlaceholder;
