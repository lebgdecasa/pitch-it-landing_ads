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
  Idea: "📌 You have a concept, but no product or business plan yet.",
  Prototype: "📌 You have a basic working model of your product.",
  MVP: "📌 You have a Minimum Viable Product with core features and some user traction.",
  'Pre-seed': "📌 You're starting to build your team and refine your business model, seeking initial funding.",
  Seed: "📌 You have a product, a team, and early market validation, seeking funding for growth.",
  'Series A': "📌 You have a proven business model and significant traction, seeking funding to scale.",
  'Later-stage': "📌 You are an established company looking for further expansion and market leadership."
};

export const StageUploadStep: React.FC<StageUploadStepProps> = ({
  data,
  onDataChange,
  onNext,
  onBack
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

  const showUploadZone = !['Idea', 'Prototype', 'MVP'].includes(data.stage);

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
                    {stage}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {data.stage && stageDescriptions[data.stage] && (
            <p className="text-sm text-gray-600 mt-1">{stageDescriptions[data.stage]}</p>
          )}
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
        </div>

        {showUploadZone && (
          <div className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors">
            <div className="space-y-4">
              {/* <Upload className="mx-auto h-12 w-12 text-gray-400" /> */}
              <div>
                <p className="text-base font-medium">Upload project files</p>
                <p className="text-sm text-gray-500">
                  Drag and drop your files here or click to browse
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          onClick={handleNext}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Create Project
        </Button>
      </div>
    </div>
  );
};
