// src/app/components/PitchDescriptionAssistant.tsx
'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'react-toastify';
import { Check, X } from 'lucide-react';
import { useTranslation, Trans } from 'next-i18next';
import Modal from '@/components/ui/Modal'; // Import the Modal component


import type {
  PitchDimension,
  PitchExampleProps,
  ButtonProps,
  TextareaProps,
  PitchAssistantProps,
  PitchDescriptionAssistantProps,
  CompletenessCheckResponse,
  CompletenessCheckRequest
} from '@/types/wizard';

export const PITCH_DIMENSIONS: (t: (key: string) => string) => PitchDimension[] = (t) => [
  {
    id: 'targetAudience',
    name: t('pitch_dimension_target_audience_name'),
    description: t('pitch_dimension_target_audience_description'),
    example: t('pitch_dimension_target_audience_example')
  },
  {
    id: 'coreProblem',
    name: t('pitch_dimension_core_problem_name'),
    prompt: t('pitch_dimension_core_problem_prompt'),
    description: t('pitch_dimension_core_problem_description'),
    example: t('pitch_dimension_core_problem_example')
  },
  {
    id: 'uniqueDifferentiator',
    name: t('pitch_dimension_unique_differentiator_name'),
    prompt: t('pitch_dimension_unique_differentiator_prompt'),
    description: t('pitch_dimension_unique_differentiator_description'),
    example: t('pitch_dimension_unique_differentiator_example')
  },
  {
    id: 'underlyingTechnology',
    name: t('pitch_dimension_underlying_technology_name'),
    prompt: t('pitch_dimension_underlying_technology_prompt'),
    description: t('pitch_dimension_underlying_technology_description'),
    example: t('pitch_dimension_underlying_technology_example')
  },
  {
    id: 'keyBenefits',
    name: t('pitch_dimension_key_benefits_name'),
    prompt: t('pitch_dimension_key_benefits_prompt'),
    description: t('pitch_dimension_key_benefits_description'),
    example: t('pitch_dimension_key_benefits_example')
  },
  {
    id: 'workflowUsage',
    name: t('pitch_dimension_workflow_usage_name'),
    prompt: t('pitch_dimension_workflow_usage_prompt'),
    description: t('pitch_dimension_workflow_usage_description'),
    example: t('pitch_dimension_workflow_usage_example')
  },
  {
    id: 'emotionalValue',
    name: t('pitch_dimension_emotional_value_name'),
    prompt: t('pitch_dimension_emotional_value_prompt'),
    description: t('pitch_dimension_emotional_value_description'),
    example: t('pitch_dimension_emotional_value_example')
  },
  {
    id: 'costTimeSavings',
    name: t('pitch_dimension_cost_time_savings_name'),
    prompt: t('pitch_dimension_cost_time_savings_prompt'),
    description: t('pitch_dimension_cost_time_savings_description'),
    example: t('pitch_dimension_cost_time_savings_example')
  },
  {
    id: 'useCasesPlatforms',
    name: t('pitch_dimension_use_cases_platforms_name'),
    prompt: t('pitch_dimension_use_cases_platforms_prompt'),
    description: t('pitch_dimension_use_cases_platforms_description'),
    example: t('pitch_dimension_use_cases_platforms_example')
  },
  {
    id: 'competitorGap',
    name: t('pitch_dimension_competitor_gap_name'),
    prompt: t('pitch_dimension_competitor_gap_prompt'),
    description: t('pitch_dimension_competitor_gap_description'),
    example: t('pitch_dimension_competitor_gap_example')
  },
  {
    id: 'summarySentence',
    name: t('pitch_dimension_summary_sentence_name'),
    prompt: t('pitch_dimension_summary_sentence_prompt'),
    description: t('pitch_dimension_summary_sentence_description'),
    example: t('pitch_dimension_summary_sentence_example')
  }
];

function PitchExample({ dimension }: PitchExampleProps) {
  const { t } = useTranslation('common');
  if (!dimension.example) return null;

  return (
    <div className="mt-2 p-2 bg-gray-100 rounded text-xs">
      <span className="font-medium text-gray-700">{t('pitch_example_label')} </span>
      <span className="text-gray-600">{dimension.example}</span>
    </div>
  );
}

function Button({ children, onClick, variant = 'default', className = '', disabled = false }: ButtonProps) {
  const baseClasses = 'px-4 py-2 rounded font-medium transition-colors';
  const variantClasses = variant === 'outline'
    ? 'border border-gray-300 text-gray-700 hover:bg-gray-50'
    : 'bg-blue-600 text-white hover:bg-blue-700';
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses} ${disabledClasses} ${className}`}
    >
      {children}
    </button>
  );
}

function Textarea({ value, onChange, placeholder, className = '' }: TextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Temporarily reset height to calculate the new scrollHeight accurately
      textarea.style.height = 'auto';
      // Set the height to the scrollHeight to fit the content
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [value]); // This effect runs whenever the text value changes

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={4} // Start with four rows
      className={`w-full p-3 border border-gray-300 rounded resize-none overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[120px] text-base ${className}`}
    />
  );
}

function PitchAssistant({ coveredDimensions, onClose }: PitchAssistantProps) {
  const { t } = useTranslation('common');
  const dimensions = PITCH_DIMENSIONS(t);
  const coveredDimensionsArray = dimensions.filter(d => coveredDimensions[d.id]);
  const percentComplete = Math.floor((coveredDimensionsArray.length / dimensions.length) * 100);

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800">{t('pitch_assistant_title')}</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          {/* Heroicon name: x */}
          <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      {/* <p className="text-sm text-gray-600 mb-1">Completeness: {percentComplete}%</p> */}
      {/* <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4"> */}
        {/* <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${percentComplete}%` }}></div> */}
      {/* </div> */}
      <p className="text-sm text-gray-700 font-medium mb-2">{t('pitch_assistant_key_dimensions')}</p>
      <div className="overflow-y-auto max-h-[400px] pr-2 space-y-2 custom-scrollbar"> {/* Added max-h and overflow for scroll */}
        {dimensions.map(dim => (
          <div key={dim.id} className={`p-3 rounded-md text-sm ${coveredDimensions[dim.id] ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
            {dim.name}
          </div>
        ))}
      </div>
    </div>
  );
}


export default function PitchDescriptionAssistant({
  value,
  onChange,
  onNext,
  onBack,
}: {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const { t } = useTranslation('common');
  const dimensions = PITCH_DIMENSIONS(t);
  const [coveredDimensions, setCoveredDimensions] = useState<Record<string, boolean>>({});
  const [feedback, setFeedback] = useState<string | null>(null);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);
  const [showAssistant, setShowAssistant] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);

  // Added state from the first code block
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [isStarting, setIsStarting] = useState(false);
  const [description, setDescription] = useState(''); // This seems related to a different functionality, keeping it for now.

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isLoadingCheck, setIsLoadingCheck] = useState(false);


  // Added function from the first code block
  const handleStartAnalysis = async () => {
    if (!description.trim()) {
      // Optionally show an error toast/message
      toast.warn(t('please_enter_project_description'));
      return;
    }
    console.log('Starting analysis with description...');
    setIsStarting(true); // Indicate that we are waiting for task ID
    setFetchError(null);
    try {
      // startAnalysis action in context handles API call and sets taskId state
      // Note: You'll need to implement this actions object or replace with your actual implementation
      // await actions.startAnalysis(description);
      // Navigation will happen via the useEffect hook watching taskId

      // Placeholder for actual implementation
      console.log('Starting analysis with:', description);

    } catch (error: any) {
       console.error("Failed to initiate start analysis from UI:", error);
       toast.error(`Failed to start analysis process: ${error.message}`);
       setIsStarting(false); // Reset starting state on error
    }
  };

  // Added utility functions from the first code block
  const formatDate = (isoString: string) => {
    if (!isoString) return "N/A";
    try {
      return new Date(isoString).toLocaleDateString(undefined, {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });
    } catch (e) {
      console.error("Error formatting date:", isoString, e);
      return t('invalid_date');
    }
  };

  const formatStatus = (status: string) => {
    if (!status) return t('status_unknown');
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()); // Capitalize words
  };

  const checkCompleteness = useCallback(async (description: string) => {
    if (description.trim().length < 50) {
      setCoveredDimensions({});
      setFeedback(null);
      return;
    }

    setIsLoadingCheck(true);
    setFeedback(t('analyzing_description'));

    const dimensionsToCheck = dimensions.map(({ id, name, description }) => ({
      id, name, description
    }));

    try {
      const response = await fetch('/proxy/check_description_completeness', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description, dimensions: dimensionsToCheck }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: `HTTP error ${response.status}` }));
        throw new Error(errorData.detail || t('failed_to_check_description'));
      }

      const data: { coverage: Record<string, boolean> } = await response.json();

      setCoveredDimensions(data.coverage || {});
      generateFeedback(data.coverage || {});
      updateCurrentPrompt(data.coverage || {});

    } catch (error: any) {
      console.error('Error checking description completeness:', error);
      toast.error(`${t('error_analyzing_description')}: ${error.message}`);
      setFeedback(t('error_analyzing_description_feedback'));
    } finally {
      setIsLoadingCheck(false);
    }
  }, []);

  useEffect(() => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const timeout = setTimeout(() => {
      checkCompleteness(value);
    }, 1500);

    setDebounceTimeout(timeout);

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [value, checkCompleteness]);

  const generateFeedback = useCallback((dimensions: Record<string, boolean>) => {
    const coveredCount = Object.values(dimensions).filter(Boolean).length;
    const totalDimensions = PITCH_DIMENSIONS(t).length;

    if (value.length < 50) {
      setFeedback(null);
      return;
    }

    if (isLoadingCheck) {
      setFeedback(t('analyzing_description'));
      return;
    }

    if (coveredCount === 0) {
      setFeedback(t('feedback_start'));
    } else if (coveredCount < 3) {
      setFeedback(t('feedback_good_start'));
    } else if (coveredCount < 6) {
      setFeedback(t('feedback_making_progress'));
    } else if (coveredCount < 9) {
      setFeedback(t('feedback_great_details'));
    } else if (coveredCount < totalDimensions) {
      setFeedback(t('feedback_almost_there'));
    } else {
      setFeedback(t('feedback_excellent'));
    }
  }, [value.length, isLoadingCheck, t]);

  const updateCurrentPrompt = useCallback((dimensionsStatus: Record<string, boolean>) => {
    const missingDimensions = PITCH_DIMENSIONS(t).filter(
      dimension => !dimensionsStatus[dimension.id]
    );
  }, [value.length, isLoadingCheck, t]);

  const calculateProgress = () => {
    if (isLoadingCheck) return 0;
    const coveredCount = Object.values(coveredDimensions).filter(Boolean).length;
    return (coveredCount / PITCH_DIMENSIONS(t).length) * 100;
  };

  // Get the next dimension to prompt for
  const getNextDimension = (): PitchDimension | null => {
    const missingDimensions = PITCH_DIMENSIONS(t).filter(
      dimension => !coveredDimensions[dimension.id]
    );
    return missingDimensions.length > 0 ? missingDimensions[0] : null;
  };

  const handleNext = () => {
    if (value.trim().length < 50) {
      alert(t('alert_more_details_required'));
      return;
    }
    if (Object.values(coveredDimensions).filter(Boolean).length < 6) {
      setShowValidationModal(true);
      return;
    }
    if (onNext) {
      onNext();
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  const nextDimension = getNextDimension();

  return (
    <div className="flex flex-col w-full max-w-10xl p-4 bg-white rounded-lg shadow-xl max-h-[100vh] overflow-hidden">
      <div className="flex-grow flex flex-col md:flex-row gap-4 overflow-hidden"> {/* Handles layout and prevents its children from causing page scroll */}
        {/* Left Panel: Prompt, Textarea, Feedback, Progress, Buttons */}
        <div className="flex-1 flex flex-col space-y-4 overflow-y-auto custom-scrollbar pr-2"> {/* Made left panel scrollable */}
          <h2 className="text-2xl font-semibold text-gray-800">{t('describe_your_pitch_title')}</h2>

          {/* Current Dimension Prompt Area */}
          {nextDimension && (
            <div className="p-3 border border-gray-200 rounded-lg bg-gray-50 text-sm">
              <h3 className="text-base font-semibold text-gray-700 mb-1">
                {t('tell_me_more_about')}: <span className="text-blue-600">{nextDimension.name}</span>
              </h3>
              <p className="text-gray-600">{nextDimension.description}</p>
              <PitchExample dimension={nextDimension} />
            </div>
          )}

          <div className="flex-grow flex flex-col"> {/* Wrapper for textarea to grow */}
            <Textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={nextDimension ? t('provide_details_for', { name: nextDimension.name }) : t('start_describing_pitch')}
              className="flex-grow leading-relaxed w-full"
            />
            {/* {error && <p className="text-red-500 text-sm mt-1">{error}</p>} */}
          </div>

          {feedback && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-700">
              {feedback}
            </div>
          )}

          {/* Progress Bar */}
          <div className="pt-2"> {/* Adjusted padding */}
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${calculateProgress()}%` }}></div>
            </div>
            <p className="text-xs text-gray-500 text-center">
              {t('dimensions_covered', { count: Object.values(coveredDimensions).filter(Boolean).length, total: PITCH_DIMENSIONS(t).length })}
            </p>
          </div>

          {/* Action Buttons - Moved to the bottom of the left panel's content flow */}
          <div className="mt-4 flex justify-between items-center">
            <Button onClick={handleBack} variant="outline">
              {t('back_button')}
            </Button>
            <Button onClick={() => setShowAssistant(prev => !prev)} variant="outline" className="mx-2">
              {showAssistant ? t('hide_assistant_button') : t('show_assistant_button')}
            </Button>
            <Button onClick={handleNext} disabled={isLoadingCheck || Object.values(coveredDimensions).filter(Boolean).length < 6}>
              {isLoadingCheck ? t('analyzing_button') : t('next_button')}
            </Button>
          </div>
        </div>

        {/* Right Panel: Pitch Assistant */}
        {showAssistant && (
          <div className="w-full md:w-1/3 flex flex-col"> {/* flex flex-col to allow PitchAssistant to take h-full */}
            <PitchAssistant
              coveredDimensions={coveredDimensions}
              onClose={() => setShowAssistant(false)}
              // PitchAssistant internal structure already handles its content scrolling and h-full
            />
          </div>
        )}
      </div>
      {/* Buttons were moved into the left panel */}
      <Modal isOpen={showValidationModal} onClose={() => setShowValidationModal(false)} titleId="validation-modal-title">
        <div className="text-center">
          <h2 id="validation-modal-title" className="text-lg font-semibold">{t('validation_modal_title')}</h2>
          <p className="mt-2 text-sm text-gray-600">
            <Trans t={t} i18nKey="validation_modal_description">
              To better analyze your project and be as relevant as possible, we'd need you to cover <em>at least</em> 6 out of the 11 dimensions.
            </Trans>
          </p>
          <button
            onClick={() => setShowValidationModal(false)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {t('got_it_button')}
          </button>
        </div>
      </Modal>
    </div>
  );
}
