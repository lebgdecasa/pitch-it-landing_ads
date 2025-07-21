'use client';

import React, { useState } from 'react'; // Import useState
// import { toast } from 'react-hot-toast'; // Assuming react-hot-toast is installed
// import { Loader2 } from 'lucide-react'; // For loading spinner icon
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'next-i18next';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonClassName?: string; // Added this line
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmButtonText,
  cancelButtonText,
  confirmButtonClassName = '',
}) => {
  const { t } = useTranslation('common');
  const [isConfirming, setIsConfirming] = useState(false);

  if (!isOpen) {
    return null;
  }

  const finalTitle = title ?? t('confirmation_dialog_are_you_sure');
  const finalDescription =
    description ?? t('confirmation_dialog_action_cannot_be_undone');
  const finalConfirmButtonText =
    confirmButtonText ?? t('confirmation_dialog_confirm');
  const finalCancelButtonText =
    cancelButtonText ?? t('confirmation_dialog_cancel');

  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      // Assuming onConfirm is an async function that might throw an error
      await onConfirm();
      // toast.success(description || title || 'Action completed successfully!'); // Use description or title for more context
      onClose(); // Close modal on success
    } catch (error: any) {
      // toast.error(error?.message || 'An error occurred. Please try again.');
      console.error("Confirmation error:", error); // Keep console log for debugging
      // Do not close modal on error, so user can see the issue or try again if applicable.
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle id="confirmation-dialog-title">{finalTitle}</DialogTitle>
          {finalDescription && (
            <DialogDescription id="confirmation-dialog-description">
              {finalDescription}
            </DialogDescription>
          )}
        </DialogHeader>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isConfirming}>
              {finalCancelButtonText}
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={handleConfirm}
            className={confirmButtonClassName}
            disabled={isConfirming}
          >
            {isConfirming ? (
              <>
                {/* <Loader2 className="mr-2 h-4 w-4 animate-spin" /> */}
                {t('confirmation_dialog_processing')}
              </>
            ) : (
              finalConfirmButtonText
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationDialog;
