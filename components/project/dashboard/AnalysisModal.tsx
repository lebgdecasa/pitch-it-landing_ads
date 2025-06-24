import React from 'react';
import { X } from 'lucide-react';

interface AnalysisModalProps {
  analysis: {
    id: string;
    title: string;
    type: string;
    data: any;
  };
  isOpen: boolean;
  onClose: () => void;
}

export const AnalysisModal: React.FC<AnalysisModalProps> = ({
  analysis,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  // Enhanced content parser that handles various JSON structures
  const parseContent = (content: any, depth: number = 0): JSX.Element[] => {
    const elements: JSX.Element[] = [];

    if (!content) return elements;

    // Handle string content
    if (typeof content === 'string') {
      // Check for numbered lists (e.g., "1. Item" or "• Item")
      const lines = content.split('\n').filter(line => line.trim());
      const isNumberedList = lines.some(line => /^\d+\.\s/.test(line.trim()));
      const isBulletList = lines.some(line => /^[•\-\*]\s/.test(line.trim()));

      if (isNumberedList || isBulletList) {
        elements.push(
          <ul key={`list-${depth}`} className="list-inside space-y-2 text-gray-700 pl-2 my-3">
            {lines.map((line, idx) => {
              const cleanedLine = line.replace(/^\d+\.\s|^[•\-\*]\s/, '').trim();
              return cleanedLine ? <li key={idx} className="list-disc">{cleanedLine}</li> : null;
            })}
          </ul>
        );
      } else {
        elements.push(
          <p key={`text-${depth}`} className="text-gray-600 mb-3 whitespace-pre-wrap">
            {content}
          </p>
        );
      }
      return elements;
    }

    // Handle arrays
    if (Array.isArray(content)) {
      content.forEach((item, idx) => {
        if (typeof item === 'string') {
          elements.push(
            <li key={`array-item-${depth}-${idx}`} className="list-disc">
              {item}
            </li>
          );
        } else if (typeof item === 'object') {
          elements.push(...parseContent(item, depth + 1));
        }
      });

      if (elements.length > 0 && elements[0].type === 'li') {
        return [
          <ul key={`array-list-${depth}`} className="list-disc list-inside space-y-2 text-gray-700 pl-2 my-3">
            {elements}
          </ul>
        ];
      }
      return elements;
    }

    // Handle objects
    if (typeof content === 'object') {
      Object.entries(content).forEach(([key, value]) => {
        // Skip metadata fields
        if (['title', 'date', 'subtitle', 'type', 'id'].includes(key.toLowerCase())) {
          return;
        }

        // Handle sections array specifically
        if (key === 'sections' && Array.isArray(value)) {
          value.forEach((section: any, idx: number) => {
            elements.push(...renderSection(section, idx, depth));
          });
          return;
        }

        // Handle other object properties
        const formattedKey = key
          .replace(/_/g, ' ')
          .replace(/([A-Z])/g, ' $1')
          .trim()
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');

        // Add heading for this property if it contains substantial content
        if (value && (typeof value === 'object' || (typeof value === 'string' && value.length > 50))) {
          elements.push(
            <h4 key={`heading-${key}-${depth}`} className={`${depth === 0 ? 'text-xl' : 'text-lg'} font-semibold text-gray-800 mb-2 mt-4`}>
              {formattedKey}
            </h4>
          );
        }

        // Recursively parse the value
        elements.push(...parseContent(value, depth + 1));
      });
    }

    return elements;
  };

  // Render a section with proper structure
  const renderSection = (section: any, index: number, depth: number = 0): JSX.Element[] => {
    const elements: JSX.Element[] = [];

    if (!section || typeof section !== 'object') return elements;

    // Section heading
    if (section.heading) {
      elements.push(
        <h3 key={`section-heading-${index}`} className="text-xl font-bold text-gray-900 mb-4 tracking-tight">
          {section.heading}
        </h3>
      );
    }

    // Section content
    if (section.content) {
      elements.push(...parseContent(section.content, depth + 1));
    }

    // Section bullets
    if (section.bullets && Array.isArray(section.bullets) && section.bullets.length > 0) {
      elements.push(
        <ul key={`section-bullets-${index}`} className="list-disc list-inside space-y-2 text-gray-700 pl-2 my-3">
          {section.bullets.map((bullet: string, bulletIdx: number) => (
            <li key={bulletIdx}>{bullet}</li>
          ))}
        </ul>
      );
    }

    // Subsections
    if (section.subsections && Array.isArray(section.subsections)) {
      elements.push(
        <div key={`subsections-${index}`} className="space-y-4 mt-4 pl-4 border-l-2 border-gray-200">
          {section.subsections.map((subsection: any, subIdx: number) => (
            <div key={subIdx}>
              {subsection.subheading && (
                <h4 className="text-lg font-semibold text-gray-800 mb-2">{subsection.subheading}</h4>
              )}
              {subsection.content && parseContent(subsection.content, depth + 2)}
              {subsection.bullets && Array.isArray(subsection.bullets) && subsection.bullets.length > 0 && (
                <ul className="list-disc list-inside space-y-2 text-gray-700 pl-2">
                  {subsection.bullets.map((bullet: string, bulletIdx: number) => (
                    <li key={bulletIdx}>{bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      );
    }

    return elements;
  };

  const renderContent = () => {
    if (!analysis.data) {
      return <p className="text-gray-500">No data available for this report.</p>;
    }

    try {
      // Check if data has the expected sections structure
      if (analysis.data.sections && Array.isArray(analysis.data.sections)) {
        return (
          <div className="space-y-8">
            {analysis.data.sections.map((section: any, idx: number) => (
              <div key={idx}>{renderSection(section, idx)}</div>
            ))}
          </div>
        );
      }

      // Otherwise, use the flexible parser
      const parsedElements = parseContent(analysis.data);

      if (parsedElements.length > 0) {
        return <div className="space-y-4">{parsedElements}</div>;
      }

      // Final fallback - pretty print JSON
      return (
        <div>
          <p className="text-amber-600 mb-3 text-sm">
            Note: This analysis format is not fully supported. Displaying available data:
          </p>
          <pre className="bg-gray-50 p-4 rounded-lg overflow-auto text-xs">
            {JSON.stringify(analysis.data, null, 2)}
          </pre>
        </div>
      );
    } catch (error) {
      console.error('Error rendering analysis content:', error);
      return (
        <div>
          <p className="text-red-600 mb-3">Error displaying analysis content.</p>
          <pre className="bg-gray-50 p-4 rounded-lg overflow-auto text-xs">
            {JSON.stringify(analysis.data, null, 2)}
          </pre>
        </div>
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold text-gray-900 truncate pr-8">{analysis.title}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors absolute top-4 right-4"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AnalysisModal;
