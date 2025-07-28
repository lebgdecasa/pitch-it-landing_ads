import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnboarding } from './OnboardingProvider';
import { useTranslation } from 'next-i18next';

interface OnboardingOverlayProps {
  children: React.ReactNode;
  allowSkip?: boolean;
}

export const OnboardingOverlay: React.FC<OnboardingOverlayProps> = ({

  children,
  allowSkip = true
}) => {
  const { skipOnboarding, isActive } = useOnboarding();
  const { t } = useTranslation('common');

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-black/50"
        >
          {allowSkip && (
            <button
              onClick={skipOnboarding}
              className="absolute top-4 right-4 z-[10000] px-4 py-2 text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-200 text-sm font-medium cursor-pointer"
            >
              {t('skip_onboarding')}
            </button>
          )}
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
