import React, { useEffect, useState } from 'react';
import { Circle, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Card } from '../ui/card';
import axios from 'axios';
import { useTranslation } from 'next-i18next';

const TOTAL_DURATION = 8000; // 8 seconds total

interface AnalysisStep {
  id: number;
  label: string;
  completed: boolean;
}

export const AnalysisProgress: React.FC = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [steps, setSteps] = useState<AnalysisStep[]>([
    { id: 1, label: t('analysis_step_key_trend'), completed: false },
    { id: 2, label: t('analysis_step_netnographic'), completed: false },
    { id: 3, label: t('analysis_step_generating_personas'), completed: false },
  ]);
  const [taskId, setTaskId] = useState<string | null>(null);

  useEffect(() => {
    // Start the analysis process by calling the API
    const startAnalysis = async () => {
      try {
        const response = await axios.post('/start_analysis', {
          product_description: t('sample_product_description'),
        });
        setTaskId(response.data.task_id);
        console.log(`Analysis started with task ID: ${response.data.task_id}`);
      } catch (error) {
        console.error('Failed to start analysis:', error);
        alert(t('error_starting_analysis'));
      }
    };

    startAnalysis();
  }, [t]);
  useEffect(() => {
    if (!taskId) return;

    // Calculate time per step
    const stepDuration = TOTAL_DURATION / steps.length;

    // Progressively complete steps
    steps.forEach((step, index) => {
      setTimeout(() => {
        setSteps((prevSteps) =>
          prevSteps.map((s) =>
            s.id === step.id ? { ...s, completed: true } : s
          )
        );

        // Navigate after last step is complete
        if (index === steps.length - 1) {
          setTimeout(() => {
            router.push(`/project/${taskId}`);
          }, 500); // Small delay before navigation
        }
      }, stepDuration * index);
    });
  }, [taskId, router]);
  return (
    <div className="fixed inset-0 bg-gray-50/90 backdrop-blur-sm flex items-center justify-center">
      <Card className="w-full max-w-xl p-8 shadow-lg">
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-center text-gray-900">
            {t('analyzing_your_project_title')}
          </h2>

          <div className="space-y-4">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors duration-300 ${
                  step.completed ? 'bg-green-50' : 'bg-white'
                }`}
              >
                <div className="transition-transform duration-300 transform">
                  {step.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-300" />
                  )}
                </div>
                <span
                  className={`text-sm font-medium transition-colors duration-300 ${
                    step.completed ? 'text-green-700' : 'text-gray-600'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>

          <p className="text-sm text-center text-gray-500 mt-6">
            {t('analysis_progress_message')}
          </p>
        </div>
      </Card>
    </div>
  );
};

export default AnalysisProgress;
