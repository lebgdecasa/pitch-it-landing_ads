// components/project/dashboard/AnalysisModal.tsx
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '../../ui/button';

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

  const renderContent = () => {
    if (!analysis.data) {
      return <p className="text-gray-500">No data available for this report.</p>;
    }

    const { sections } = analysis.data;

    if (!sections || !Array.isArray(sections)) {
      // Fallback for data that doesn't have a sections array
      return (
        <pre className="bg-gray-50 p-4 rounded-lg overflow-auto text-xs">
          {JSON.stringify(analysis.data, null, 2)}
        </pre>
      );
    }

    return (
      <div className="space-y-8">
        {sections.map((section: any, index: number) => {
          if (!section || !section.heading) {
            return null; // Skip invalid section objects
          }

          // Hide the "Sources" section
          if (section.heading.toLowerCase() === 'sources') {
            return null;
          }

          const hasContent = section.content && section.content.trim() !== '';
          const hasBullets = section.bullets && Array.isArray(section.bullets) && section.bullets.length > 0;
          const hasSubsections = section.subsections && Array.isArray(section.subsections) && section.subsections.length > 0;
          const isConclusion = section.heading.toLowerCase().includes('conclusion');

          // Render the heading for all valid sections
          return (
            <div key={index}>
              <h3 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">{section.heading}</h3>

              {hasContent && <p className="text-gray-600 mb-3 whitespace-pre-wrap">{section.content}</p>}

              {hasBullets && (
                <ul className="list-disc list-inside space-y-2 text-gray-700 pl-2">
                  {section.bullets.map((bullet: string, bulletIndex: number) => (
                    <li key={bulletIndex}>{bullet}</li>
                  ))}
                </ul>
              )}

              {hasSubsections && (
                <div className="space-y-4 mt-4 pl-4 border-l-2 border-gray-200">
                  {section.subsections.map((subsection: any, subIndex: number) => (
                    <div key={subIndex}>
                      {subsection.subheading && <h4 className="text-lg font-semibold text-gray-800 mb-2">{subsection.subheading}</h4>}
                      {subsection.content && <p className="text-gray-600 mb-3 whitespace-pre-wrap">{subsection.content}</p>}
                      {subsection.bullets && Array.isArray(subsection.bullets) && subsection.bullets.length > 0 && (
                        <ul className="list-disc list-inside space-y-2 text-gray-700 pl-2">
                          {subsection.bullets.map((bullet: string, bulletIndex: number) => (
                            <li key={bulletIndex}>{bullet}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Special handling for empty Conclusion section */}
              {isConclusion && !hasContent && !hasBullets && !hasSubsections && (
                  <p className="text-gray-500 italic mt-2">This section is pending completion.</p>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold text-gray-900 truncate pr-8">{analysis.title}</h2>
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors absolute top-4 right-4">
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
