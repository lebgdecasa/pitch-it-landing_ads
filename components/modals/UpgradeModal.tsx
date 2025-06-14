import React from 'react';
import { useRouter } from 'next/router';
import { Button } from '../ui/button';
import Modal from '../ui/Modal'; // Corrected import: Assuming Modal is a default export

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();

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
        <h3 className="text-xl font-semibold mb-4">Upgrade to Unlock Feature</h3>
        <p className="text-lg text-gray-700 mb-4">
          This feature is available for premium users. Please upgrade your plan to access it.
        </p>
        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleUpgrade} className="bg-blue-500 text-white hover:bg-blue-600">
            Upgrade Now
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default UpgradeModal;
