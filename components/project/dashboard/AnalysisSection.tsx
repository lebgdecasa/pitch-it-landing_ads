// components/project/dashboard/AnalysisSection.tsx
import React, { useState } from 'react';
import { ChevronRight, TrendingUp, Users, FileText } from 'lucide-react';
// import AnalysisModal from './AnalysisModal'; // Lazy loaded
import dynamic from 'next/dynamic';

const AnalysisModal = dynamic(() => import('./AnalysisModal'), { ssr: false });

interface Report {
  id: string;
  title: string;
  type: 'key-trend' | 'netnographic' | 'final-report';
  date: string;
  data: any;
}

interface AnalysisSectionProps {
  analyses: Report[];
  onAnalysisClick?: (analysis: Report) => void;
}

const getAnalysisIcon = (type: Report['type']) => {
  switch (type) {
    case 'key-trend':
      return <TrendingUp className="h-5 w-5" />;
    case 'netnographic':
      return <Users className="h-5 w-5" />;
    case 'final-report':
      return <FileText className="h-5 w-5" />;
  }
};

export const AnalysisSection: React.FC<AnalysisSectionProps> = ({
  analyses,
  onAnalysisClick
}) => {
  const [selectedAnalysis, setSelectedAnalysis] = useState<Report | null>(null);

  const handleAnalysisClick = (analysis: Report) => {
    setSelectedAnalysis(analysis);
    onAnalysisClick?.(analysis);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Analysis Reports</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {analyses.map((analysis) => (
          <button
            key={analysis.id}
            onClick={() => handleAnalysisClick(analysis)}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-100
                     hover:border-gray-200 hover:shadow-md transition-all
                     flex items-center justify-between w-full group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-gray-50 text-gray-600
                            group-hover:bg-gray-100 transition-colors">
                {getAnalysisIcon(analysis.type)}
              </div>
              <div className="text-left">
                <h3 className="font-medium text-gray-900">{analysis.title}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(analysis.date).toLocaleDateString()}
                </p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400
                                   group-hover:text-gray-600 group-hover:transform
                                   group-hover:translate-x-1 transition-all" />
          </button>
        ))}
      </div>

      {selectedAnalysis && (
        <AnalysisModal
          analysis={selectedAnalysis}
          isOpen={!!selectedAnalysis}
          onClose={() => setSelectedAnalysis(null)}
        />
      )}
    </div>
  );
};

export default AnalysisSection;
