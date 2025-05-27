import React, { ReactNode } from 'react';

interface CaseStudiesPlaceholderProps {
  children: ReactNode;
}

const CaseStudiesPlaceholder: React.FC<CaseStudiesPlaceholderProps> = ({ children }) => {
  return (
    <div className="p-6 md:p-10 bg-gray-50 rounded-lg shadow">
      {/* This component can optionally have its own title, or it can be on the page */}
      {/* <h3 className="text-xl font-semibold text-center mb-4">Anonymous Case Studies of Startup Failures/Successes</h3> */}
      <div>{children}</div>
    </div>
  );
};

export default CaseStudiesPlaceholder;
