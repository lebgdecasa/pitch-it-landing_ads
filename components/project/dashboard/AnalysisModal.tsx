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
      return <p className="text-gray-600">No detailed data available.</p>;
    }

    // Render based on type
    if (analysis.type === 'key-trend' && analysis.data.sections) {
      return (
        <div className="space-y-4">
          <p className="text-gray-700">{analysis.data.summary}</p>
          {analysis.data.sections.map((section: any, index: number) => (
            <div key={index} className="border-l-4 border-indigo-500 pl-4">
              <h3 className="font-semibold mb-2">{section.title}</h3>
              <p className="text-gray-600">{section.content}</p>
            </div>
          ))}
        </div>
      );
    }

    if (analysis.type === 'netnographic' && analysis.data.sections) {
      return (
        <div className="space-y-4">
          <p className="text-gray-700">{analysis.data.summary}</p>
          {analysis.data.sections.map((section: any, index: number) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">{section.title}</h3>
              <p className="text-gray-600">{section.content}</p>
            </div>
          ))}
        </div>
      );
    }

    // Default JSON display
    return (
      <pre className="bg-gray-50 p-4 rounded-lg overflow-auto">
        {JSON.stringify(analysis.data, null, 2)}
      </pre>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">{analysis.title}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AnalysisModal;
