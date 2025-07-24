import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'next-i18next';

interface TooltipProps {
  title: string;
  description: string;
  targetRef: React.RefObject<HTMLElement>;
  position?: 'top' | 'bottom' | 'left' | 'right' |
            'top left' | 'top right' | 'top center' |
            'bottom left' | 'bottom right' | 'bottom center' |
            'left top' | 'left bottom' | 'left center' |
            'right top' | 'right bottom' | 'right center';
  showNext?: boolean;
  showPrevious?: boolean;
  onNext?: () => void;
  onPrevious?: () => void;
}

export const OnboardingTooltip: React.FC<TooltipProps> = ({
  title,
  description,
  targetRef,
  position = 'bottom',
  showNext = true,
  showPrevious = false,
  onNext,
  onPrevious
}) => {
  const { t } = useTranslation('common');
  const [tooltipPosition, setTooltipPosition] = React.useState({ top: 0, left: 0 });

  React.useEffect(() => {
    if (targetRef.current) {
      const rect = targetRef.current.getBoundingClientRect();
      const tooltipWidth = 320; // max-w-sm is roughly 384px, but accounting for padding
      const tooltipHeight = 120; // estimated height

      const getPositionCoordinates = (pos: string) => {
        const [primary, secondary] = pos.split(' ');

        switch (primary) {
          case 'top':
            const topBase = { top: rect.top - tooltipHeight - 10, left: 0 };
            switch (secondary) {
              case 'left': return { ...topBase, left: rect.left };
              case 'right': return { ...topBase, left: rect.right - tooltipWidth };
              case 'center':
              default: return { ...topBase, left: rect.left + rect.width / 2 };
            }

          case 'bottom':
            const bottomBase = { top: rect.bottom + 10, left: 0 };
            switch (secondary) {
              case 'left': return { ...bottomBase, left: rect.left };
              case 'right': return { ...bottomBase, left: rect.right - tooltipWidth };
              case 'center':
              default: return { ...bottomBase, left: rect.left + rect.width / 2 };
            }

          case 'left':
            const leftBase = { top: 0, left: rect.left - tooltipWidth - 10 };
            switch (secondary) {
              case 'top': return { ...leftBase, top: rect.top };
              case 'bottom': return { ...leftBase, top: rect.bottom - tooltipHeight };
              case 'center':
              default: return { ...leftBase, top: rect.top + rect.height / 2 };
            }

          case 'right':
            const rightBase = { top: 0, left: rect.right + 10 };
            switch (secondary) {
              case 'top': return { ...rightBase, top: rect.top };
              case 'bottom': return { ...rightBase, top: rect.bottom - tooltipHeight };
              case 'center':
              default: return { ...rightBase, top: rect.top + rect.height / 2 };
            }

          default:
            // Legacy single word positions
            switch (pos) {
              case 'top': return { top: rect.top - tooltipHeight - 10, left: rect.left + rect.width / 2 };
              case 'bottom': return { top: rect.bottom + 10, left: rect.left + rect.width / 2 };
              case 'left': return { top: rect.top + rect.height / 2, left: rect.left - tooltipWidth - 10 };
              case 'right': return { top: rect.top + rect.height / 2, left: rect.right + 10 };
              default: return { top: rect.bottom + 10, left: rect.left + rect.width / 2 };
            }
        }
      };

      setTooltipPosition(getPositionCoordinates(position));
    }
  }, [targetRef, position]);

  const getTransform = () => {
    const [primary, secondary] = position.split(' ');

    // For top/bottom positions with center alignment, center horizontally
    if ((primary === 'top' || primary === 'bottom') && (!secondary || secondary === 'center')) {
      return 'translateX(-50%)';
    }

    // For left/right positions with center alignment, center vertically
    if ((primary === 'left' || primary === 'right') && (!secondary || secondary === 'center')) {
      return 'translateY(-50%)';
    }

    // For legacy single word positions
    if (!secondary) {
      switch (primary) {
        case 'top':
        case 'bottom':
          return 'translateX(-50%)';
        case 'left':
        case 'right':
          return 'translateY(-50%)';
        default:
          return 'none';
      }
    }

    return 'none';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute bg-white rounded-lg shadow-2xl p-6 max-w-sm z-[10000]"
      style={{
        top: `${tooltipPosition.top}px`,
        left: `${tooltipPosition.left}px`,
        transform: getTransform()
      }}
    >
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>

      <div className="flex justify-between">
        {showPrevious && (
          <button
            onClick={onPrevious}
            className="flex items-center text-gray-500 hover:text-gray-700"
          >
            <ChevronLeft size={16} />
            {t('onboarding_tooltip_previous')}
          </button>
        )}
        {showNext && (
          <button
            onClick={onNext}
            className="flex items-center text-blue-600 hover:text-blue-700 ml-auto"
          >
            {t('onboarding_tooltip_next')}
            <ChevronRight size={16} />
          </button>
        )}
      </div>
    </motion.div>
  );
};
