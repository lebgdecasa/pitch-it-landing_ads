import React from 'react';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Upload } from 'lucide-react';

interface StageUploadStepProps {
  data: {
    stage: string;
    hasFiles?: boolean;
  };
  onDataChange: (data: { stage: string; hasFiles?: boolean }) => void;
  onNext: () => void;
  onBack: () => void;
  isSubmitting: boolean;
  submitError: string | null;
}

const stages = [
  'Idea',
  'Prototype',
  'MVP',
  // 'Pre-seed',
  // 'Seed',
  // 'Series A',
  // 'Later-stage'
];

const stageDescriptions: { [key: string]: string } = {
  'idea': "📌 You have a concept, but no product or business plan yet.",
  'prototype': "📌 You have a basic working model of your product.",
  'mvp': "📌 You have a Minimum Viable Product with core features and some user traction.",
  'Pre-seed': "📌 You're starting to build your team and refine your business model, seeking initial funding.",
  'seed': "📌 You have a product, a team, and early market validation, seeking funding for growth.",
  'Series A': "📌 You have a proven business model and significant traction, seeking funding to scale.",
  'Later-stage': "📌 You are an established company looking for further expansion and market leadership."
};

export const StageUploadStep: React.FC<StageUploadStepProps> = ({
  data,
  onDataChange,
  onNext,
  onBack,
  isSubmitting,
  submitError,
}) => {
  const [error, setError] = React.useState('');

  const validate = (): boolean => {
    if (!data.stage) {
      setError('Please select a project stage');
      return false;
    }
    setError('');
    return true;
  };

  const handleNext = () => {
    if (validate()) {
      onNext();
    }
  };

  const showUploadZone = !['idea', 'prototype', 'mvp'].includes(data.stage);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Project Stage</label>
          <Select
            value={data.stage}
            onValueChange={(value) => onDataChange({ ...data, stage: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select project stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {stages.map((stage) => (
                  <SelectItem key={stage} value={stage}>
                    {stage.charAt(0).toUpperCase() + stage.slice(1)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {data.stage && stageDescriptions[data.stage.toLowerCase()] && (
            <p className="text-sm text-gray-600 mt-1">{stageDescriptions[data.stage.toLowerCase()]}</p>
          )}
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
        </div>


      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} disabled={isSubmitting}>
          Back
        </Button>
        <div className="flex items-center space-x-4">
          {submitError && <p className="text-sm text-red-500">{submitError}</p>}
          <Button
            onClick={handleNext}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Project'}
          </Button>
        </div>
      </div>
      <p className="text-center text-sm text-gray-500 mt-4">
      Once your project is ready you'll receive an email! This can take a few minutes. If you don't receive an email within an hour, please check your spam folder or contact support.
      </p>
    </div>
  );
};
