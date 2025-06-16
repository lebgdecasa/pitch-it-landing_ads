// types.ts - Interface definitions for PitchDescriptionAssistant

export interface PitchDimension {
    id: string;
    name: string;
    description: string;
    prompt?: string;
    example?: string;
  }
  
  export interface PitchExampleProps {
    dimension: PitchDimension;
  }
  
  export interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: 'default' | 'outline';
    className?: string;
    disabled?: boolean;
  }
  
  export interface TextareaProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    className?: string;
  }
  
  export interface PitchAssistantProps {
    coveredDimensions: Record<string, boolean>;
    onClose: () => void;
  }
  
  export interface PitchDescriptionAssistantProps {
    value: string;
    onChange: (value: string) => void;
    onNext?: () => void;
    onBack?: () => void;
    error?: string;
  }
  
  // API Response interfaces
  export interface CompletenessCheckResponse {
    coverage: Record<string, boolean>;
  }
  
  export interface CompletenessCheckRequest {
    description: string;
    dimensions: Array<{
      id: string;
      name: string;
      description: string;
    }>;
  }