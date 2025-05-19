import React from 'react';
import useTranslation from '@/hooks/useTranslation';

interface FeatureItemProps {
  id: string;
  featureNumber: string;
  color: string;
  title: string;
  description: string;
  listItems: string[];
  ctaText: string;
  imageUrl: string;
  onCtaClick?: () => void;
}

const FeatureItem = ({
  id,
  featureNumber,
  color,
  title,
  description,
  listItems,
  ctaText,
  imageUrl,
  onCtaClick,
}: FeatureItemProps) => {
  const t = useTranslation();

  const textColor = `text-${color}-400`;
  const bgColor = `bg-${color}-100`;
  const hoverBgColor = `hover:bg-${color}-200`;
  const ringColor = `ring-${color}-400`;
  const ctaTextColor = `text-${color}-700`;

  return (
    <div id={id} className="mb-24 bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-8 md:p-12">
        <div className={`${textColor} font-semibold mb-2`}>{featureNumber}</div>
        <h3 className="text-2xl md:text-3xl font-bold mb-6">{title}</h3>
        <p className="text-gray-700 mb-6" dangerouslySetInnerHTML={{ __html: description }}></p>

        <ul className="mb-8 space-y-2">
          {listItems.map((item, index) => (
            <li key={index} className="flex items-start">
              <svg className={`h-6 w-6 ${textColor} mr-2`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        {onCtaClick ? (
          <button
            onClick={onCtaClick}
            className={`inline-block ${bgColor} ${hoverBgColor} ${ctaTextColor} font-semibold py-3 px-6 rounded-lg transition-colors`}
          >
            {ctaText}
          </button>
        ) : (
          <a href="#" className={`inline-block ${bgColor} ${hoverBgColor} ${ctaTextColor} font-semibold py-3 px-6 rounded-lg transition-colors`}>
            {ctaText}
          </a>
        )}
      </div>

      <div className="bg-gray-100 p-8 flex justify-center">
        <img src={imageUrl} alt={title} className="rounded-lg w-full h-auto object-contain" />
      </div>
    </div>
  );
};

export default FeatureItem;
