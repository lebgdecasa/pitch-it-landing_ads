// components/project/ActionButtons.tsx
import React from 'react';
import { useRouter } from 'next/router';
import { Button } from '../ui/button';
import { Users, Activity, FileEdit, Video, Lock } from 'lucide-react'; // Added Lock icon

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
  const router = useRouter();

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
            ? 'bg-gray-700 text-white cursor-not-allowed' // Locked style
            : 'bg-blue-500 text-white hover:bg-blue-600' // Default style
        }`}
        onClick={() => !isLocked && router.push(redirectPath)}
        disabled={isLocked}
      >
        <div className="flex items-center space-x-3">
          {icon}
          <span>{label}</span>
        </div>
        {isLocked && <Lock className="h-5 w-5 text-white" />}
      </Button>
    );
  };

  const buttons: ActionButtonConfig[] = [
    {
      icon: <Users className="h-5 w-5" />,
      label: 'Chat with Personas',
      redirectPath: `/project/${projectId}/chat`,
    },
    {
      icon: <Activity className="h-5 w-5" />,
      label: 'Run Pulse',
      redirectPath: `/project/${projectId}/pulse`,
      // Example: lock this button by default
      locked: true,
    },
    {
      icon: <FileEdit className="h-5 w-5" />,
      label: 'Edit Pitch Deck',
      redirectPath: `/project/${projectId}/deck/edit`,
      locked: true,
    },
    {
      icon: <Video className="h-5 w-5" />,
      label: 'Virtual VC Pitch',
      redirectPath: `/project/${projectId}/virtual-vc/setup`,
      locked: true,
    },
  ];

  return (
    <div className="w-full space-y-2">
      {buttons.map(buttonConfig => renderButton(buttonConfig))}
    </div>
  );
};

export default ActionButtons;
