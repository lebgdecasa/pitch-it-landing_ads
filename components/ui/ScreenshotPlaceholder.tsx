import React from 'react';
import useTranslation from '@/hooks/useTranslation';
import { ScreenshotPlaceholderIcon } from './icons/Icons';

const ScreenshotPlaceholder = () => {
  const t = useTranslation();
  return (
    <div className="mt-6 mb-6 h-48 bg-slate-200/80 rounded-lg flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-slate-300 group hover:border-blue-400 transition-all duration-300 cursor-pointer hover:bg-slate-100">
      <ScreenshotPlaceholderIcon />
      <span className="mt-2 text-sm font-medium group-hover:text-blue-600 transition-colors duration-300">{t('screenshot_placeholder_text')}</span>
    </div>
  );
};

export default ScreenshotPlaceholder;
