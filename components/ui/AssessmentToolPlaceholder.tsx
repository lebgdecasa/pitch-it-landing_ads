import React, { ReactNode } from 'react';

interface AssessmentToolPlaceholderProps {
  children: ReactNode;
}

const AssessmentToolPlaceholder: React.FC<AssessmentToolPlaceholderProps> = ({ children }) => {
  return (
    <div className="p-6 md:p-10 bg-yellow-100 rounded-lg shadow max-w-2xl mx-auto">
      {/* This component can optionally have its own title, or it can be on the page */}
      {/* <h3 className="text-xl font-semibold text-center mb-4">Blind Spot Assessment Tool</h3> */}
      <div>{children}</div>
    </div>
  );
};

export default AssessmentToolPlaceholder;
