// src/app/components/PitchDescriptionAssistant.tsx
'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'react-toastify';
import { Check, X } from 'lucide-react';

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

export const PITCH_DIMENSIONS: PitchDimension[] = [
  {
    id: 'targetAudience',
    name: 'Target Audience',
    description: 'Who will use your product or service? Be specific about demographics, needs, and behaviors.',
    example: 'Our target audience is small business owners (5-50 employees) who struggle with digital marketing but don\'t have the budget for agencies or dedicated staff.'
  },
  {
    id: 'coreProblem',
    name: 'Core Problem',
    prompt: 'What specific problem are you trying to solve?',
    description: 'What specific problem are you solving? Why is this a significant issue worth addressing?',
    example: 'Small businesses waste an average of 20 hours per week on ineffective marketing efforts, resulting in poor ROI and missed growth opportunities.'
  },
  {
    id: 'uniqueDifferentiator',
    name: 'Unique Differentiator',
    prompt: 'What makes your approach different from existing tools?',
    description: 'How is your solution different from alternatives? What makes you stand out?',
    example: 'Unlike generic marketing tools, our platform uses proprietary AI algorithms specifically trained on small business success patterns across 50+ industries.'
  },
  {
    id: 'underlyingTechnology',
    name: 'Underlying Technology',
    prompt: 'Could you explain the technology that makes this possible?',
    description: 'What technology powers your solution? How does it work behind the scenes?',
    example: 'Our platform combines natural language processing and predictive analytics to automatically generate marketing content and optimize campaign performance in real-time.'
  },
  {
    id: 'keyBenefits',
    name: 'Key Benefits',
    prompt: 'What are the main benefits users will experience?',
    description: 'What specific benefits does your solution provide? Focus on outcomes, not features.',
    example: 'Our customers experience an average 3.5x ROI within 90 days, 65% reduction in time spent on marketing tasks, and consistent lead growth without increasing budget.'
  },
  {
    id: 'workflowUsage',
    name: 'Workflow/Usage',
    prompt: 'How would someone actually use this in their day-to-day?',
    description: 'How do users interact with your product? What does the user experience look like?',
    example: 'Users connect their social and advertising accounts, answer 5 questions about their business goals, and receive a customized marketing plan within minutes. Weekly 15-minute checkpoints are all that\'s needed to keep campaigns optimized.'
  },
  {
    id: 'emotionalValue',
    name: 'Emotional Value',
    prompt: 'How does your solution make users feel emotionally?',
    description: 'How does your solution make users feel? What emotional need does it address?',
    example: 'Our platform gives small business owners the confidence that their marketing is working effectively, relieving the anxiety of wasting money and the frustration of not knowing what to do next.'
  },
  {
    id: 'costTimeSavings',
    name: 'Cost/Time Savings',
    prompt: 'How does it save time or money for your users?',
    description: 'How much time or money does your solution save? Quantify when possible.',
    example: 'Businesses save an average of $3,500 per month in agency fees and 15-20 hours per week previously spent on manual marketing tasks.'
  },
  {
    id: 'useCasesPlatforms',
    name: 'Use Cases/Platforms',
    prompt: 'What specific scenarios or platforms is this designed for?',
    description: 'What are specific scenarios where your solution shines? What platforms does it work on?',
    example: 'The platform works across all major marketing channels including social media, email, Google Ads, and content marketing. It\'s particularly effective for service businesses, local retailers, and professional practices.'
  },
  {
    id: 'competitorGap',
    name: 'Competitor Gap',
    prompt: 'What are competitors missing that you provide?',
    description: 'What gap in existing solutions are you filling? How do competitors fall short?',
    example: 'Existing marketing tools either require significant expertise (like HubSpot) or offer limited functionality (like Mailchimp). None provide the combination of automation, customization, and simplicity that small businesses need.'
  },
  {
    id: 'summarySentence',
    name: 'Summary Sentence',
    prompt: 'Can you summarize your entire pitch in one sentence?',
    description: 'Can you summarize your entire value proposition in one concise sentence?',
    example: 'SmartMarketer helps small businesses achieve enterprise-level marketing results with minimal time, expertise, and budget through our AI-powered platform.'
  }
];

function PitchExample({ dimension }: PitchExampleProps) {
  if (!dimension.example) return null;

  return (
    <div className="mt-2 p-2 bg-gray-100 rounded text-xs">
      <span className="font-medium text-gray-700">Example: </span>
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
  const coveredDimensionsArray = PITCH_DIMENSIONS.filter(d => coveredDimensions[d.id]);
  const percentComplete = Math.floor((coveredDimensionsArray.length / PITCH_DIMENSIONS.length) * 100);

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800">Pitch Assistant</h3>
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
      <p className="text-sm text-gray-700 font-medium mb-2">Key Dimensions:</p>
      <div className="overflow-y-auto max-h-[400px] pr-2 space-y-2 custom-scrollbar"> {/* Added max-h and overflow for scroll */}
        {PITCH_DIMENSIONS.map(dim => (
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
  const [coveredDimensions, setCoveredDimensions] = useState<Record<string, boolean>>({});
  const [feedback, setFeedback] = useState<string | null>(null);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);
  const [showAssistant, setShowAssistant] = useState(false);

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
      toast.warn('Please enter a project description.');
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
      return "Invalid Date";
    }
  };

  const formatStatus = (status: string) => {
    if (!status) return "Unknown";
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()); // Capitalize words
  };

  const checkCompleteness = useCallback(async (description: string) => {
    if (description.trim().length < 50) {
      setCoveredDimensions({});
      setFeedback(null);
      return;
    }

    setIsLoadingCheck(true);
    setFeedback("Analyzing description...");

    const dimensionsToCheck = PITCH_DIMENSIONS.map(({ id, name, description }) => ({
      id, name, description
    }));

    try {
      const response = await fetch('http://40.89.185.79:3052/check_description_completeness', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description, dimensions: dimensionsToCheck }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: `HTTP error ${response.status}` }));
        throw new Error(errorData.detail || 'Failed to check description');
      }

      const data: { coverage: Record<string, boolean> } = await response.json();

      setCoveredDimensions(data.coverage || {});
      generateFeedback(data.coverage || {});
      updateCurrentPrompt(data.coverage || {});

    } catch (error: any) {
      console.error('Error checking description completeness:', error);
      toast.error(`Error analyzing description: ${error.message}`);
      setFeedback("Error analyzing description. Please try again later.");
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
    const totalDimensions = PITCH_DIMENSIONS.length;

    if (value.length < 50) {
      setFeedback(null);
      return;
    }

    if (isLoadingCheck) {
      setFeedback("Analyzing description...");
      return;
    }

    if (coveredCount === 0) {
      setFeedback("Start by describing who your product is for and what problem it solves.");
    } else if (coveredCount < 3) {
      setFeedback("Good start! Consider adding more details about what makes your solution unique.");
    } else if (coveredCount < 6) {
      setFeedback("You're making progress! Try explaining how users interact with your solution.");
    } else if (coveredCount < 9) {
      setFeedback("Great details! Now consider adding how your solution compares to alternatives.");
    } else if (coveredCount < totalDimensions) {
      setFeedback("Almost there! Try adding a concise summary sentence to tie everything together.");
    } else {
      setFeedback("Excellent! Your pitch covers all the key dimensions investors look for.");
    }
  }, [value.length, isLoadingCheck]);

  const updateCurrentPrompt = useCallback((dimensionsStatus: Record<string, boolean>) => {
    const missingDimensions = PITCH_DIMENSIONS.filter(
      dimension => !dimensionsStatus[dimension.id]
    );
  }, [value.length, isLoadingCheck]);

  const calculateProgress = () => {
    if (isLoadingCheck) return 0;
    const coveredCount = Object.values(coveredDimensions).filter(Boolean).length;
    return (coveredCount / PITCH_DIMENSIONS.length) * 100;
  };

  // Get the next dimension to prompt for
  const getNextDimension = (): PitchDimension | null => {
    const missingDimensions = PITCH_DIMENSIONS.filter(
      dimension => !coveredDimensions[dimension.id]
    );
    return missingDimensions.length > 0 ? missingDimensions[0] : null;
  };

  const handleNext = () => {
    if (value.trim().length < 50) {
      alert("Please provide a more detailed description (at least 50 characters).");
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
          <h2 className="text-2xl font-semibold text-gray-800">Describe Your Pitch</h2>

          {/* Current Dimension Prompt Area */}
          {nextDimension && (
            <div className="p-3 border border-gray-200 rounded-lg bg-gray-50 text-sm">
              <h3 className="text-base font-semibold text-gray-700 mb-1">
                Tell me more about: <span className="text-blue-600">{nextDimension.name}</span>
              </h3>
              <p className="text-gray-600">{nextDimension.description}</p>
              <PitchExample dimension={nextDimension} />
            </div>
          )}

          <div className="flex-grow flex flex-col"> {/* Wrapper for textarea to grow */}
            <Textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={nextDimension ? `Provide details for ${nextDimension.name} here...` : "Start describing your pitch..."}
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
              {Object.values(coveredDimensions).filter(Boolean).length} of {PITCH_DIMENSIONS.length} dimensions covered
            </p>
          </div>

          {/* Action Buttons - Moved to the bottom of the left panel's content flow */}
          <div className="mt-4 flex justify-between items-center">
            <Button onClick={handleBack} variant="outline">
              Back
            </Button>
            <Button onClick={() => setShowAssistant(prev => !prev)} variant="outline" className="mx-2">
              {showAssistant ? 'Hide Assistant' : 'Show Assistant'}
            </Button>
            <Button onClick={handleNext} disabled={isLoadingCheck || value.length < 6}>
              {isLoadingCheck ? 'Analyzing...' : 'Next'}
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
    </div>
  );
}
