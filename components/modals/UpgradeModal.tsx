import React from 'react';
import { useRouter } from 'next/router';
import { Button } from '../ui/button';
import Modal from '../ui/Modal'; // Corrected import: Assuming Modal is a default export
import { useTranslation } from 'next-i18next';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { t } = useTranslation('common');

  const handleUpgrade = () => {
    router.push('/subscription'); // Or your actual subscription page path
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-4">{t('upgrade_modal_title')}</h3>
        <p className="text-lg text-gray-700 mb-4">
          {t('upgrade_modal_description')}
        </p>
        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose}>
            {t('Cancel')}
          </Button>
          <Button onClick={handleUpgrade} className="bg-blue-500 text-white hover:bg-blue-600">
            {t('upgrade_modal_upgrade_now')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default UpgradeModal;
