import React, { useEffect, ReactNode } from 'react';
import { useTranslation } from 'next-i18next';

import { useRef } from 'react'; // Import useRef

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: string;
  titleId?: string; // For aria-labelledby
  descriptionId?: string; // For aria-describedby
}

const Modal = ({ isOpen, onClose, children, maxWidth = "max-w-md", titleId, descriptionId }: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const focusableElementsSelector =
      'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), details, [tabindex]:not([tabindex="-1"])';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab' && modalRef.current) {
        const focusableElements = Array.from(
          modalRef.current.querySelectorAll<HTMLElement>(focusableElementsSelector)
        ).filter(el => el.offsetParent !== null); // Check for visibility

        if (focusableElements.length === 0) {
          event.preventDefault();
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            lastElement.focus();
            event.preventDefault();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            firstElement.focus();
            event.preventDefault();
          }
        }
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      triggerElementRef.current = document.activeElement as HTMLElement;

      // Set initial focus
      if (modalRef.current) {
        const focusableElements = Array.from(
          modalRef.current.querySelectorAll<HTMLElement>(focusableElementsSelector)
        ).filter(el => el.offsetParent !== null);

        if (focusableElements.length > 0) {
          focusableElements[0].focus();
        } else {
          modalRef.current.focus(); // Fallback to modal container
        }
      }

      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
      document.removeEventListener('keydown', handleKeyDown);
      // If a trigger element was stored, return focus to it when the modal closes.
      // This cleanup runs when isOpen becomes false or the component unmounts.
      if (triggerElementRef.current) {
        triggerElementRef.current.focus();
      }
    };
  }, [isOpen]); // Only re-run if isOpen changes

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[100] transition-opacity duration-300 ease-in-out opacity-100"
      onClick={onClose} // Allows closing by clicking the backdrop
      // The backdrop itself doesn't need all ARIA roles for a dialog, the inner div does.
    >
      <div
        ref={modalRef} // Assign ref
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1} // Make the modal container focusable for initial focus setting
        className={`bg-white rounded-xl p-8 md:p-10 shadow-2xl w-full ${maxWidth} transform transition-all duration-300 ease-out scale-100 modal-content`}
        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()} // Prevent clicks inside the modal from closing it
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
