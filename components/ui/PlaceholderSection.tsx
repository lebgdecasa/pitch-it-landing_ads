import React, { ReactNode } from 'react';

interface PlaceholderSectionProps {
  title: string;
  className?: string;
  children?: ReactNode;
  contentText?: string; // Alternative for simple text
}

const PlaceholderSection = ({ title, className, children, contentText }: PlaceholderSectionProps) => {
  return (
    <section className={`py-10 px-4 text-center ${className || ''}`}>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      {children ? children : <p className="text-gray-700">{contentText || 'Placeholder content...'}</p>}
    </section>
  );
};

export default PlaceholderSection;
