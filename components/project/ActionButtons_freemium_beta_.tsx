// components/project/ActionButtons.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { Users, Activity, FileEdit, Video, Lock } from 'lucide-react'; // Added Lock icon
import { useTranslation } from 'next-i18next';

import dynamic from 'next/dynamic';

const UpgradeModal = dynamic(() => import('../modals/UpgradeModal').then(mod => mod.UpgradeModal), { ssr: false });

interface ActionButtonConfig {
  icon: React.ReactNode;
  label: string;
  redirectPath: string;
  locked?: boolean; // Optional locked property
}

interface ActionButtonsProps {
  projectId: string;
  buttonConfigs?: Partial<Record<string, { locked: boolean }>>; // Optional prop to control lock states
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ projectId, buttonConfigs = {} }) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false); // State for modal

  const handleButtonClick = (config: ActionButtonConfig) => {
    if (config.locked || buttonConfigs[config.label]?.locked) {
      setIsUpgradeModalOpen(true);
    } else {
      router.push(config.redirectPath);
    }
  };

  const renderButton = (
    config: ActionButtonConfig
  ) => {
    const { icon, label, redirectPath, locked } = config;
    const isLocked = locked || buttonConfigs[label]?.locked;

    return (
      <Button
        variant="outline"
        size="lg"
        className={`w-full mb-3 flex items-center justify-between space-x-3 h-14 ${
          isLocked
            ? 'bg-gray-700 text-white' // Keep locked style, remove cursor-not-allowed and disabled
            : 'bg-blue-500 text-white hover:bg-blue-600' // Default style
        }`}
        onClick={() => handleButtonClick(config)} // Updated onClick handler
      >
        <div className="flex items-center space-x-3">
          {icon}
          <span>{t(label)}</span>
        </div>
        {isLocked && <Lock className="h-5 w-5 text-white" />}
      </Button>
    );
  };

  const buttons: ActionButtonConfig[] = [
    {
      icon: <Users className="h-5 w-5" />,
      label: 'chat_with_personas',
      redirectPath: `/project/${projectId}/chat_2`,
    },
    {
      icon: <Activity className="h-5 w-5" />,
      label: 'run_pulse',
      redirectPath: `/project/${projectId}/pulse`,
      // Example: lock this button by default
      locked: true,
    },
    {
      icon: <FileEdit className="h-5 w-5" />,
      label: 'edit_pitch_deck',
      redirectPath: `/project/${projectId}/deck/edit`,
      locked: true,
    },
    {
      icon: <Video className="h-5 w-5" />,
      label: 'virtual_vc_pitch',
      redirectPath: `/project/${projectId}/virtual-vc/setup`,
      locked: true,
    },
  ];

  return (
    <div className="w-full space-y-2">
      {buttons.map(buttonConfig => renderButton(buttonConfig))}
      <UpgradeModal isOpen={isUpgradeModalOpen} onClose={() => setIsUpgradeModalOpen(false)} />
    </div>
  );
};

export default ActionButtons;
