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
import { useTranslation } from 'next-i18next';

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

const stages = (t: (key: string) => string) => [
  t('stage_idea'),
  t('stage_prototype'),
  t('stage_mvp'),
];

const stageDescriptions: (t: (key: string) => string) => { [key: string]: string } = (t) => ({
  [t('stage_idea').toLowerCase()]: t('stage_desc_idea'),
  [t('stage_prototype').toLowerCase()]: t('stage_desc_prototype'),
  [t('stage_mvp').toLowerCase()]: t('stage_desc_mvp'),
  [t('stage_pre_seed').toLowerCase()]: t('stage_desc_pre_seed'),
  [t('stage_seed').toLowerCase()]: t('stage_desc_seed'),
  [t('stage_series_a').toLowerCase()]: t('stage_desc_series_a'),
  [t('stage_later_stage').toLowerCase()]: t('stage_desc_later_stage')
});

export const StageUploadStep: React.FC<StageUploadStepProps> = ({
  data,
  onDataChange,
  onNext,
  onBack,
  isSubmitting,
  submitError,
}) => {
  const { t } = useTranslation('common');
  const [error, setError] = React.useState('');

  const validate = (): boolean => {
    if (!data.stage) {
      setError(t('error_select_project_stage'));
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

  const showUploadZone = ![t('stage_idea').toLowerCase(), t('stage_prototype').toLowerCase(), t('stage_mvp').toLowerCase()].includes(data.stage.toLowerCase());

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">{t('label_project_stage')}</label>
          <Select
            value={data.stage}
            onValueChange={(value) => onDataChange({ ...data, stage: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder={t('placeholder_select_project_stage')} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {stages(t).map((stage) => (
                  <SelectItem key={stage} value={stage}>
                    {stage.charAt(0).toUpperCase() + stage.slice(1)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {data.stage && stageDescriptions(t)[data.stage.toLowerCase()] && (
            <p className="text-sm text-gray-600 mt-1">{stageDescriptions(t)[data.stage.toLowerCase()]}</p>
          )}
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
        </div>

        {showUploadZone && (
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('label_upload_files')}</label>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-4 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">{t('text_click_to_upload')}</span> {t('text_or_drag_and_drop')}
                  </p>
                  <p className="text-xs text-gray-500">{t('text_file_types')}</p>
                </div>
                <input id="dropzone-file" type="file" className="hidden" />
              </label>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onBack} disabled={isSubmitting}>
          {t('button_back')}
        </Button>
        <Button onClick={handleNext} disabled={isSubmitting}>
          {isSubmitting ? t('button_submitting') : t('button_submit')}
        </Button>
      </div>
      {submitError && (
        <p className="text-sm text-red-500 mt-2 text-center">{submitError}</p>
      )}
    </div>
  );
};
