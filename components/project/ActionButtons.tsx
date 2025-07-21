// components/project/ActionButtons.tsx
import React from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { Users, Activity, FileEdit, Video } from 'lucide-react';
import { useTranslation } from 'next-i18next';

interface ActionButtonsProps {
  projectId: string;
  onRunPulse: () => void;
  onBookDemo: () => void;
  isPulseRunning: boolean;
}

const ActionButtons = ({ projectId, onRunPulse, onBookDemo, isPulseRunning }: ActionButtonsProps) => {
  const { t } = useTranslation('common');
  const router = useRouter();

  const handleChatClick = () => {
    router.push(`/project/${projectId}/chat`);
  };

  const handleRunPulseClick = () => {
    onRunPulse();
  };

  const handleBookDemoClick = () => {
    onBookDemo();
  };

  return (
    <div className="flex items-center space-x-4">
      <Button
        variant="outline"
        size="lg"
        className="w-full mb-3 flex items-center justify-start space-x-3 h-14 bg-blue-500 text-white hover:bg-blue-600"
        onClick={handleChatClick}
      >
        <span className="text-white">
          <Users className="h-5 w-5" />
        </span>
        <span className="text-white">{t('chat_with_personas')}</span>
      </Button>
      <Button
        variant="outline"
        size="lg"
        className="w-full mb-3 flex items-center justify-start space-x-3 h-14 bg-blue-500 text-white hover:bg-blue-600"
        onClick={handleRunPulseClick}
        disabled={isPulseRunning}
      >
        <span className="text-white">
          <Activity className="h-5 w-5" />
        </span>
        <span className="text-white">
          {isPulseRunning ? t('processing') : t('run_pulse')}
        </span>
      </Button>
      <Button
        variant="outline"
        size="lg"
        className="w-full mb-3 flex items-center justify-start space-x-3 h-14 bg-blue-500 text-white hover:bg-blue-600"
        onClick={handleBookDemoClick}
      >
        <span className="text-white">
          <Video className="h-5 w-5" />
        </span>
        <span className="text-white">{t('book_a_demo')}</span>
      </Button>
    </div>
  );
};

export default ActionButtons;
