import React from 'react';
import { InlineWidget } from 'react-calendly';

interface CalendlyModalProps {
  onClose: () => void;
}

const CalendlyModal = ({ onClose }: CalendlyModalProps) => {
  return (
    <>
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-2xl font-bold text-gray-800">Book a Demo</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-3xl transition-colors"
          aria-label="Close"
        >
          &times;
        </button>
      </div>
      <p className="text-gray-600 mb-2">Schedule a demo with our team.</p>
      <InlineWidget url="https://calendly.com/jlahrichi-nextraction/nextraction-demo-onboarding" />
    </>
  );
};

export default CalendlyModal;
