// components/project/dashboard/AnalysisModal.tsx
import React from 'react';
import { X } from 'lucide-react';
import { type Report } from './AnalysisSection';

interface AnalysisModalProps {
  analysis: Report;
  isOpen: boolean;
  onClose: () => void;
}

const AnalysisModal: React.FC<AnalysisModalProps> = ({ analysis, isOpen, onClose }) => {
  if (!isOpen) return null;

  // Parse content recursively for flexible structures
  const parseContent = (content: any, depth: number = 0): JSX.Element[] => {
    const elements: JSX.Element[] = [];

    if (!content) return elements;

    // Handle strings
    if (typeof content === 'string') {
      // Split by newlines for better formatting
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        if (line.trim()) {
          // Check for numbered lists
          const numberedMatch = line.match(/^(\d+)\.\s+(.+)$/);
          if (numberedMatch) {
            elements.push(
              <p key={`line-${depth}-${idx}`} className="text-gray-700 mb-2 pl-4">
                <span className="font-medium">{numberedMatch[1]}.</span> {numberedMatch[2]}
              </p>
            );
          }
          // Check for bullet points
          else if (line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
            elements.push(
              <li key={`line-${depth}-${idx}`} className="text-gray-700 mb-1">
                {line.replace(/^[-•]\s+/, '')}
              </li>
            );
          }
          // Regular text
          else {
            elements.push(
              <p key={`line-${depth}-${idx}`} className="text-gray-700 mb-3">
                {line}
              </p>
            );
          }
        }
      });
      return elements;
    }

    // Handle arrays
    if (Array.isArray(content)) {
      content.forEach((item, idx) => {
        if (typeof item === 'string') {
          elements.push(
            <li key={`item-${depth}-${idx}`} className="text-gray-700 mb-2">
              {item}
            </li>
          );
        } else {
          elements.push(...parseContent(item, depth + 1));
        }
      });
      return elements.length > 0 ? [
        <ul key={`list-${depth}`} className="list-disc list-inside space-y-2 mb-4 pl-2">
          {elements}
        </ul>
      ] : [];
    }

    // Handle objects
    if (typeof content === 'object') {
      Object.entries(content).forEach(([key, value]) => {
        // Skip metadata fields
        if (['id', 'type', 'date', 'title'].includes(key)) return;

        // Format the key as a heading
        const formattedKey = key
          .replace(/_/g, ' ')
          .replace(/([A-Z])/g, ' $1')
          .trim()
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');

        // Only show heading if it's not already handled elsewhere
        if (!['sections', 'content', 'bullets', 'subsections'].includes(key)) {
          elements.push(
            <h4 key={`heading-${depth}-${key}`} className={`${depth === 0 ? 'text-xl' : 'text-lg'} font-semibold text-gray-800 mb-2 mt-4`}>
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

  // Render a section with proper structure for both analysis types
  const renderSection = (section: any, index: number, isKeyTrends: boolean = false): JSX.Element => {
    if (!section || typeof section !== 'object') return <></>;

    const elements: JSX.Element[] = [];

    // Section heading with appropriate styling
    if (section.heading) {
      const headingClass = isKeyTrends
        ? "text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200"
        : "text-xl font-bold text-gray-900 mb-4 tracking-tight";

      elements.push(
        <h3 key={`section-heading-${index}`} className={headingClass}>
          {section.heading}
        </h3>
      );
    }

    // Section content
    if (section.content) {
      const contentElements = parseContent(section.content);
      if (contentElements.length > 0) {
        elements.push(
          <div key={`section-content-${index}`} className="mb-4">
            {contentElements}
          </div>
        );
      }
    }

    // Section bullets
    if (section.bullets && Array.isArray(section.bullets) && section.bullets.length > 0) {
      elements.push(
        <ul key={`section-bullets-${index}`} className="list-disc list-inside space-y-2 text-gray-700 pl-2 mb-4">
          {section.bullets.map((bullet: string, bulletIdx: number) => (
            <li key={bulletIdx}>{bullet}</li>
          ))}
        </ul>
      );
    }

    // Subsections with enhanced styling for key trends
    if (section.subsections && Array.isArray(section.subsections) && section.subsections.length > 0) {
      const subsectionElements = section.subsections.map((subsection: any, subIdx: number) => {
        const subElements: JSX.Element[] = [];

        if (subsection.heading) {
          subElements.push(
            <h4 key={`sub-heading-${index}-${subIdx}`} className={`${isKeyTrends ? 'text-lg font-bold text-gray-800 mb-3 mt-6' : 'text-lg font-semibold text-gray-800 mb-2'}`}>
              {subsection.heading}
            </h4>
          );
        }

        if (subsection.content) {
          const contentElements = parseContent(subsection.content);
          if (contentElements.length > 0) {
            subElements.push(
              <div key={`sub-content-${index}-${subIdx}`} className={isKeyTrends ? 'text-gray-700 leading-relaxed' : ''}>
                {contentElements}
              </div>
            );
          }
        }

        if (subsection.bullets && Array.isArray(subsection.bullets) && subsection.bullets.length > 0) {
          subElements.push(
            <ul key={`sub-bullets-${index}-${subIdx}`} className="list-disc list-inside space-y-2 text-gray-700 pl-2 mt-2">
              {subsection.bullets.map((bullet: string, bulletIdx: number) => (
                <li key={bulletIdx}>{bullet}</li>
              ))}
            </ul>
          );
        }

        return (
          <div key={`subsection-${index}-${subIdx}`} className={isKeyTrends ? 'mb-6' : 'mb-4'}>
            {subElements}
          </div>
        );
      });

      elements.push(
        <div key={`subsections-${index}`} className={isKeyTrends ? 'space-y-4' : 'space-y-4 mt-4 pl-4 border-l-2 border-gray-200'}>
          {subsectionElements}
        </div>
      );
    }

    return <div key={`section-wrapper-${index}`}>{elements}</div>;
  };

  const renderContent = () => {
    if (!analysis.data) {
      return <p className="text-gray-500">No data available for this report.</p>;
    }

    try {
      const isKeyTrends = analysis.type === 'key_trends';

      // Check if data has the expected sections structure
      if (analysis.data.sections && Array.isArray(analysis.data.sections)) {
        return (
          <div className={isKeyTrends ? 'space-y-10' : 'space-y-8'}>
            {analysis.data.sections.map((section: any, idx: number) =>
              renderSection(section, idx, isKeyTrends)
            )}
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

  // Style adjustments based on analysis type
  const getModalTitleStyle = () => {
    switch (analysis.type) {
      case 'key_trends':
        return 'text-2xl font-bold text-gray-900';
      case 'netnographic':
        return 'text-xl font-semibold text-blue-900';
      case 'final':
        return 'text-xl font-semibold text-green-900';
      default:
        return 'text-xl font-semibold text-gray-900';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
          <h2 className={`${getModalTitleStyle()} truncate pr-8`}>{analysis.title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors absolute top-6 right-6"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-8 overflow-y-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AnalysisModal;
