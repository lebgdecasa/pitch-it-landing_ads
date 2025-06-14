import React, { useState, useId } from 'react'; // Import useId

interface AccordionItemProps {
  iconSvg?: string;
  title: string;
  content: string;
  bullets?: string[];
  initiallyOpen?: boolean;
}

const AccordionItem: React.FC<AccordionItemProps> = ({
  iconSvg,
  title,
  content,
  bullets = [],
  initiallyOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(initiallyOpen);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const panelId = useId(); // Generate a unique ID for the panel

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
      <button
        onClick={toggleOpen}
        aria-expanded={isOpen} // Set aria-expanded
        aria-controls={panelId} // Set aria-controls
        className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200 group"
      >
        <div className="flex items-center space-x-4">
          {iconSvg && (
            <div
              className="flex-shrink-0 transform group-hover:scale-110 transition-transform duration-300"
              dangerouslySetInnerHTML={{ __html: iconSvg }}
            />
          )}
          <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-200">
            {title}
          </h3>
        </div>
        <div className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <svg className="w-5 h-5 text-gray-500 group-hover:text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </button>

      <div
        id={panelId} // Set id for the panel
        className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
        // Optionally add role="region" and aria-labelledby if the title is complex or needs specific announcement
      >
        <div className="px-6 pb-6">
          <div className="border-l-4 border-blue-200 pl-4">
            <p className="text-gray-600 leading-relaxed mb-4">{content}</p>
            {bullets.length > 0 && (
              <ul className="space-y-2">
                {bullets.map((bullet, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <span className="text-gray-600">{bullet}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccordionItem;

