import React from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useRouter } from 'next/router'; // Import useRouter

interface BasicInfoStepProps {
  data: {
    projectName: string;
    industry: string;
  };
  onDataChange: (data: { projectName: string; industry: string }) => void;
  onNext: () => void;
}

const industries = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'E-commerce',
  'Other'
];

export const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
  data,
  onDataChange,
  onNext
}) => {
  const [customIndustry, setCustomIndustry] = React.useState('');
  const [errors, setErrors] = React.useState({
    projectName: '',
    industry: ''
  });
  const router = useRouter(); // Initialize useRouter

  const validate = (): boolean => {
    const newErrors = {
      projectName: '',
      industry: ''
    };

    if (!data.projectName.trim()) {
      newErrors.projectName = 'Project name is required';
    }

    if (data.industry === 'Other') {
      if (!customIndustry.trim()) {
        newErrors.industry = 'Industry is required';
      }
    } else if (!data.industry) {
      newErrors.industry = 'Industry is required';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleNext = () => {
    if (validate()) {
      if (data.industry === 'Other') {
        onDataChange({ ...data, industry: customIndustry.trim() });
      }
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="projectName">Project Name</Label>
        <Input
          id="projectName"
          value={data.projectName}
          onChange={(e) => onDataChange({
            ...data,
            projectName: e.target.value
          })}
          placeholder="Enter your project name"
        />
        {errors.projectName && (
          <p className="text-sm text-red-500">{errors.projectName}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Industry</Label>
        <Select
          value={data.industry}
          onValueChange={(value) => {
            if (value === 'Other') {
              setCustomIndustry('');
            }
            onDataChange({
              ...data,
              industry: value
            });
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select industry" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {industries.map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {data.industry === 'Other' && (
          <Input
            className="mt-2"
            placeholder="Enter your industry"
            value={customIndustry}
            onChange={(e) => {
              setCustomIndustry(e.target.value);
            }}
          />
        )}
        {errors.industry && (
          <p className="text-sm text-red-500">{errors.industry}</p>
        )}
      </div>

      <div className="flex justify-between"> {/* Changed from justify-end to justify-between */}
        <Button
          variant="outline"
          onClick={() => router.push('/dashboard')} // Add onClick handler to navigate
        >
          Back to Dashboard
        </Button>
        <Button
          onClick={handleNext}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Next
        </Button>
      </div>
    </div>
  );
};
