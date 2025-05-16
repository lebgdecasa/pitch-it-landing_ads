import React from 'react';
import { ReactNode } from 'react';

interface SectionTitleProps {
  children: ReactNode;
}

const SectionTitle = ({ children }: SectionTitleProps) => (
  <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-800 relative">
    {children}
    <span className="block w-20 h-1 bg-blue-600 mx-auto mt-3 rounded-full"></span>
  </h2>
);

export default SectionTitle;
