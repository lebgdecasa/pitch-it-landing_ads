// components/project/dashboard/AnalysisModal.tsx
import React, { useRef } from 'react';
import { X, FileText, List, CheckSquare, Hash, Download } from 'lucide-react';
import { type Report } from './AnalysisSection';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface AnalysisModalProps {
  analysis: Report | null; // Allow analysis to be null
  isOpen: boolean;
  onClose: () => void;
}

const AnalysisModal: React.FC<AnalysisModalProps> = ({ analysis, isOpen, onClose }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  if (!isOpen || !analysis) return null;

  const handleDownloadPdf = () => {
    const input = contentRef.current;
    if (!input) {
      console.error("Content element not found");
      return;
    }

    // We can temporarily hide elements that shouldn't be in the PDF
    const buttonsToHide = input.closest('.flex-col')?.querySelectorAll('button');
    buttonsToHide?.forEach(btn => (btn as HTMLElement).style.setProperty('display', 'none', 'important'));

    html2canvas(input, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      logging: false, // Disabling logging for cleaner console
      windowWidth: input.scrollWidth,
      windowHeight: input.scrollHeight,
      onclone: (document) => {
        // You can modify the cloned document here before rendering if needed
      }
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      // Maintain aspect ratio
      const ratio = canvasWidth / canvasHeight;
      let imgWidth = pdfWidth - 20; // with some margin
      let imgHeight = imgWidth / ratio;

      let heightLeft = imgHeight;
      let position = 10; // top margin

      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= (pdfHeight - 20);

      while (heightLeft > 0) {
        position = heightLeft - imgHeight + 10; // top margin for new pages
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= (pdfHeight - 20);
      }

      pdf.save(`${analysis?.title?.replace(/ /g, '_') || 'analysis'}.pdf`);

      // Show the buttons again
      buttonsToHide?.forEach(btn => (btn as HTMLElement).style.display = '');
    }).catch(err => {
      console.error("Error generating PDF:", err);
      // Make sure to show buttons again in case of error
      buttonsToHide?.forEach(btn => (btn as HTMLElement).style.display = '');
    });
  };

  // Parse content recursively for flexible structures
  const parseContent = (content: any, depth: number = 0): (JSX.Element | null)[] => {
    if (!content) return [];

    // Handle strings
    if (typeof content === 'string') {
      return content.split('\n').map((line, idx) => {
        if (!line.trim()) return null;
        const numberedMatch = line.match(/^(\d+)\.\s+(.+)$/);
        if (numberedMatch) {
          return (
            <p key={`line-${depth}-${idx}`} className="text-gray-700 mb-2 pl-4">
              <span className="font-medium">{numberedMatch[1]}.</span> {numberedMatch[2]}
            </p>
          );
        }
        if (line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
          return (
            <li key={`line-${depth}-${idx}`} className="text-gray-700 mb-1">
              {line.replace(/^[-•]\s+/, '')}
            </li>
          );
        }
        return (
          <p key={`line-${depth}-${idx}`} className="text-gray-700 mb-3">
            {line}
          </p>
        );
      }).filter(Boolean);
    }

    // Handle arrays
    if (Array.isArray(content)) {
      const items = content.flatMap((item, idx) => {
        if (typeof item === 'string') {
          return (
            <li key={`item-${depth}-${idx}`} className="flex items-start">
              <List className="h-4 w-4 mr-3 mt-1 text-blue-500 flex-shrink-0" />
              <span className="text-gray-700">{item}</span>
            </li>
          );
        }
        return parseContent(item, depth + 1);
      }).filter(Boolean);

      return items.length > 0 ? [
        <ul key={`list-${depth}`} className="space-y-2 mb-4">
          {items}
        </ul>
      ] : [];
    }

    // Handle objects
    if (typeof content === 'object') {
      return Object.entries(content).flatMap(([key, value]) => {
        if (['id', 'type', 'date', 'title', 'sections', 'content', 'bullets', 'subsections'].includes(key)) return [];

        const formattedKey = key
          .replace(/_/g, ' ')
          .replace(/([A-Z])/g, ' $1')
          .trim()
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');

        return [
          <div key={`heading-wrapper-${depth}-${key}`} className="mt-6 mb-3">
            <div className="flex items-center bg-gray-100 p-2 rounded-md">
              <Hash className="h-5 w-5 text-gray-500 mr-3" />
              <h4 className="text-lg font-semibold text-gray-800">
                {formattedKey}
              </h4>
            </div>
          </div>,
          ...parseContent(value, depth + 1)
        ];
      }).filter(Boolean);
    }

    return [];
  };

  // Render a section with proper structure for both analysis types
  const renderSection = (section: any, index: number, isKeyTrends: boolean = false): JSX.Element | null => {
    if (!section || typeof section !== 'object') return null;

    const elements: (JSX.Element | null)[] = [];

    if (section.heading) {
      elements.push(
        <div key={`section-heading-${index}`} className="flex items-center bg-slate-100 p-3 rounded-lg mb-4">
          <FileText className="h-6 w-6 mr-4 text-slate-600" />
          <h3 className="text-xl font-bold text-gray-800 tracking-tight">{section.heading}</h3>
        </div>
      );
    }

    if (section.content) {
      const contentElements = parseContent(section.content);
      if (contentElements.length > 0) {
        elements.push(
          <div key={`section-content-${index}`} className="mb-4 pl-4 border-l-2 border-slate-200 ml-5">
            {contentElements}
          </div>
        );
      }
    }

    if (section.bullets && Array.isArray(section.bullets) && section.bullets.length > 0) {
      elements.push(
        <ul key={`section-bullets-${index}`} className="space-y-2 text-gray-700 pl-6 mb-4">
          {section.bullets.map((bullet: string, bulletIdx: number) => (
            <li key={bulletIdx} className="flex items-start">
              <CheckSquare className="h-4 w-4 mr-3 mt-1 text-green-500 flex-shrink-0" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      );
    }

    if (section.subsections && Array.isArray(section.subsections) && section.subsections.length > 0) {
      const subsectionElements = section.subsections.map((subsection: any, subIdx: number) => {
        const subElements: (JSX.Element | null)[] = [];

        if (subsection.heading) {
          subElements.push(
            <h4 key={`sub-heading-${index}-${subIdx}`} className="text-lg font-bold text-gray-800 mb-3 mt-6">
              {subsection.heading}
            </h4>
          );
        }

        if (subsection.content) {
          const contentElements = parseContent(subsection.content);
          if (contentElements.length > 0) {
            subElements.push(
              <div key={`sub-content-${index}-${subIdx}`} className="text-gray-700 leading-relaxed">
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
          <div key={`subsection-${index}-${subIdx}`} className="mb-4 border-t border-gray-200 pt-4">
            {subElements}
          </div>
        );
      }).filter(Boolean);

      elements.push(
        <div key={`subsections-${index}`} className="space-y-4 mt-4 pl-4 border-l-4 border-blue-200 ml-5">
          {subsectionElements}
        </div>
      );
    }

    return <div key={`section-wrapper-${index}`} className="mb-8">{elements}</div>;
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
          <div className="space-y-10">
            {analysis.data.sections.map((section: any, idx: number) =>
              renderSection(section, idx, isKeyTrends)
            ).filter(Boolean)}
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
          <h2 className={`${getModalTitleStyle()} truncate pr-48`}>{analysis.title}</h2>
          <div className="flex items-center absolute top-4 right-4 space-x-2">
            <button
              onClick={handleDownloadPdf}
              className="flex items-center space-x-2 p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
              title="Download as PDF"
            >
              <Download className="h-5 w-5" />
              <span className="text-sm font-medium">Download as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
        <div className="p-8 overflow-y-auto" ref={contentRef}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AnalysisModal;
