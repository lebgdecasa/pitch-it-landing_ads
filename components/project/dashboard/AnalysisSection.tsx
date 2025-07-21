// components/project/dashboard/AnalysisSection.tsx
import React, { useState } from 'react';
import * as ga from '@/lib/ga';
import { ChevronRight, FileCheck, FileText, TrendingUp, Users } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';

const AnalysisModal = dynamic(() => import('./AnalysisModal'), { ssr: false });

export interface Report {
  id: string;
  title: string;
  type: 'key_trends' | 'netnographic' | 'final';
  date: string;
  data: any;
}

interface AnalysisSectionProps {
  analyses: Report[];
  onAnalysisClick?: (analysis: Report) => void;
}

const getAnalysisIcon = (type: Report['type']) => {
  switch (type) {
    case 'key_trends':
      return <TrendingUp className="h-5 w-5" />;
    case 'netnographic':
      return <Users className="h-5 w-5" />;
    case 'final':
      return <FileCheck className="h-5 w-5" />;
    default:
      return <FileText className="h-5 w-5" />;
  }
};

export const AnalysisSection: React.FC<AnalysisSectionProps> = ({
  analyses,
  onAnalysisClick
}) => {
  const [selectedAnalysis, setSelectedAnalysis] = useState<Report | null>(null);
  const { t } = useTranslation('common');

  const handleAnalysisClick = (analysis: Report) => {
    ga.trackAnalysisModalOpen();
    ga.trackAnalysisReportOpen(analysis.id, analysis.type);
    setSelectedAnalysis(analysis);
    onAnalysisClick?.(analysis);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">{t('analysis_section_title')}</h2>

      {(!analyses || analyses.length === 0) ? (
        <div className="mt-4 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 p-12 text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">{t('analysis_section_no_reports_title')}</h3>
          <p className="mt-1 text-sm text-gray-500">{t('analysis_section_no_reports_desc')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analyses.map((analysis) => (
            <button
              key={analysis.id}
              onClick={() => handleAnalysisClick(analysis)}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all flex items-center justify-between w-full group"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="p-2 rounded-full bg-gray-50 text-gray-600 group-hover:bg-gray-100 transition-colors">
                  {getAnalysisIcon(analysis.type)}
                </div>
                <div className="text-left flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">{analysis.title}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(analysis.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 group-hover:transform group-hover:translate-x-1 transition-all ml-2 flex-shrink-0" />
            </button>
          ))}
        </div>
      )}

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
