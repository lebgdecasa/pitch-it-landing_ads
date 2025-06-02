import React, { useEffect, ReactNode } from 'react';
import { useTranslation } from 'next-i18next';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: string;
}

const Modal = ({ isOpen, onClose, children, maxWidth = "max-w-md" }: ModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[100] transition-opacity duration-300 ease-in-out opacity-100"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-xl p-8 md:p-10 shadow-2xl w-full ${maxWidth} transform transition-all duration-300 ease-out scale-100 modal-content`}
        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
