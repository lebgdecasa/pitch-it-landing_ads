import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useOnboarding } from './OnboardingProvider';

interface OnboardingOverlayProps {
  children: React.ReactNode;
  allowSkip?: boolean;
}

export const OnboardingOverlay: React.FC<OnboardingOverlayProps> = ({
  children,
  allowSkip = true
}) => {
  const { skipOnboarding, isActive } = useOnboarding();

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
              className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-full"
            >
              <X size={24} />
            </button>
          )}
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
