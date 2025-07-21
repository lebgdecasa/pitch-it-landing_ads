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
import { useTranslation } from 'next-i18next';

interface BasicInfoStepProps {
  data: {
    projectName: string;
    industry: string;
  };
  onDataChange: (data: { projectName: string; industry: string }) => void;
  onNext: () => void;
}

const industries = (t: (key: string) => string) => [
  t('industry_technology'),
  t('industry_healthcare'),
  t('industry_finance'),
  t('industry_education'),
  t('industry_ecommerce'),
  t('industry_other')
];

export const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
  data,
  onDataChange,
  onNext
}) => {
  const { t } = useTranslation('common');
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
      newErrors.projectName = t('error_project_name_required');
    }

    if (data.industry === t('industry_other')) {
      if (!customIndustry.trim()) {
        newErrors.industry = t('error_industry_required');
      }
    } else if (!data.industry) {
      newErrors.industry = t('error_industry_required');
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleNext = () => {
    if (validate()) {
      if (data.industry === t('industry_other')) {
        onDataChange({ ...data, industry: customIndustry.trim() });
      }
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="projectName">{t('label_project_name')}</Label>
        <Input
          id="projectName"
          value={data.projectName}
          onChange={(e) => onDataChange({
            ...data,
            projectName: e.target.value
          })}
          placeholder={t('placeholder_project_name')}
        />
        {errors.projectName && (
          <p className="text-sm text-red-500">{errors.projectName}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>{t('label_industry')}</Label>
        <Select
          value={data.industry}
          onValueChange={(value) => {
            if (value === t('industry_other')) {
              setCustomIndustry('');
            }
            onDataChange({ ...data, industry: value });
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder={t('placeholder_select_industry')} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {industries(t).map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {data.industry === t('industry_other') && (
          <div className="mt-2">
            <Label htmlFor="customIndustry">{t('label_custom_industry')}</Label>
            <Input
              id="customIndustry"
              value={customIndustry}
              onChange={(e) => setCustomIndustry(e.target.value)}
              placeholder={t('placeholder_custom_industry')}
            />
          </div>
        )}
        {errors.industry && (
          <p className="text-sm text-red-500">{errors.industry}</p>
        )}
      </div>

      <div className="flex justify-end">
        <Button onClick={handleNext}>{t('button_next')}</Button>
      </div>
    </div>
  );
};
