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
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full p-3 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
    />
  );
}

function PitchAssistant({ coveredDimensions, onClose }: PitchAssistantProps) {
  const coveredDimensionsArray = PITCH_DIMENSIONS.filter(d => coveredDimensions[d.id]);
  const percentComplete = Math.floor((coveredDimensionsArray.length / PITCH_DIMENSIONS.length) * 100);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg text-gray-900 flex items-center">
          <span className="text-indigo-600 mr-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.5 9L15.5 14M8.5 14V9M12 12V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 12C22 16.714 22 19.071 20.535 20.535C19.072 22 16.714 22 12 22C7.286 22 4.929 22 3.464 20.535C2 19.072 2 16.714 2 12C2 7.286 2 4.929 3.464 3.464C4.93 2 7.286 2 12 2C16.714 2 19.071 2 20.535 3.464C21.509 4.438 21.863 5.807 21.95 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </span>
          Pitch Assistant
        </h3>
        <button
          onClick={onClose}
          className="md:hidden p-1 rounded-full hover:bg-gray-100"
          aria-label="Close assistant"
        >

        </button>
      </div>

      {/* Progress section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-1 text-sm">
          <span className="font-medium text-gray-700">Progress</span>
          <span className="text-gray-600">{percentComplete}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${percentComplete}%` }}
          ></div>
        </div>
      </div>

      {/* Dimensions checklist */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-2 text-sm">Key Dimensions</h4>
        <div className="space-y-2">
          {PITCH_DIMENSIONS.map((dimension: PitchDimension) => {
            const isCovered = coveredDimensions[dimension.id] || false;
            return (
              <div
                key={dimension.id}
                className={`p-2 rounded-md flex items-center justify-between ${
                  isCovered ? 'bg-green-50' : 'bg-white'
                }`}
              >
                <span className="text-sm">{dimension.name}</span>
                <div
                  className={`w-5 h-5 flex items-center justify-center rounded-full ${
                    isCovered ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                >

                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


export default function PitchDescriptionAssistant({
  value,
  onChange,
  onNext,
  onBack,
  error
}: PitchDescriptionAssistantProps) {
  const [coveredDimensions, setCoveredDimensions] = useState<Record<string, boolean>>({});
  const [feedback, setFeedback] = useState<string | null>(null);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);
  const [showAssistant, setShowAssistant] = useState(true);

  // Added state from the first code block
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [isStarting, setIsStarting] = useState(false);
  const [description, setDescription] = useState('');

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isLoadingCheck, setIsLoadingCheck] = useState(false);

  // Added useEffect from the first code block for fetching projects
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoadingProjects(true);
      setFetchError(null);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      console.log(`Fetching projects from: ${apiUrl}/projects`); // Log endpoint
      try {
        const response = await fetch(`${apiUrl}/projects`);
        if (!response.ok) {
          let errorDetail = `HTTP error ${response.status}`;
          try {
              const errorData = await response.json();
              errorDetail = errorData.detail || errorDetail;
          } catch (jsonError) {
              // If response is not JSON, use statusText
              errorDetail = response.statusText || errorDetail;
          }
          throw new Error(`Failed to fetch projects: ${errorDetail}`);
        }
        const data: { projects: any[] } = await response.json();
        console.log("Fetched projects:", data.projects); // Log fetched data
        setProjects(data.projects || []);
      } catch (error: any) {
        console.error("Failed to fetch projects:", error);
        setFetchError(error.message || "Could not load project list.");
        toast.error(`Error loading projects: ${error.message}`);
      } finally {
        setIsLoadingProjects(false);
      }
    };

    fetchProjects();
  }, []);

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

    // TO-DO: change to actual URL when backend is ready
    try {
      const response = await fetch('http://localhost:8000/check_description_completeness', {
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
    <div className="container mx-auto py-8 max-w-6xl space-y-12">

      {/* Section 1: Start New Analysis */}
      <div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Project Description</h3>
                </div>

                {/* Show dimension prompt only when there's a next dimension */}
                {nextDimension && (
                  <div className="mt-4 mb-2 bg-gray-50 p-3 rounded-md">
                    <h4 className="font-medium text-gray-700 mb-1 text-sm">Tell me more about:</h4>
                    <p className="text-sm font-semibold text-blue-600">{nextDimension.name}</p>
                    <p className="text-xs text-gray-600 mt-1">{nextDimension.description}</p>
                    <PitchExample dimension={nextDimension} />
                  </div>
                )}

                <textarea
                  id="pitchDescription"
                  ref={textareaRef}
                  rows={10}
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
                  placeholder="Describe your project in detail. What problem does it solve? Who is it for? What makes it unique?"
                />

                {error && (
                  <p className="text-sm text-red-500">{error}</p>
                )}

                {feedback && (
                  <div className="mt-4 mb-6 border-l-4 border-indigo-500 bg-indigo-50 p-3 rounded-r-md">
                    <p className="text-sm text-gray-800">{feedback}</p>
                  </div>
                )}

                {/* Progress indicator */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{Math.round(calculateProgress())}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${calculateProgress()}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {showAssistant && (
              <div className="md:col-span-1 bg-white rounded-lg border shadow-sm">
                <PitchAssistant
                  coveredDimensions={coveredDimensions}
                  onClose={() => setShowAssistant(false)}
                />
              </div>
            )}
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={handleStartAnalysis}
              disabled={isStarting || !value.trim()}
              className={`px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white transition duration-150 ease-in-out
                ${isStarting || !value.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'}
              `}
            >
              {isStarting ? 'Starting...' : 'Start Analysis'}
            </button>
          </div>
        </div>
      </div>
{/* Navigation buttons */}
<div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          Back
        </Button>
        <Button onClick={handleNext}>
          Next
        </Button>
      </div>


      </div>

  );
}
