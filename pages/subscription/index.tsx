import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '../../components/ui/button'; // Assuming this path is correct
import Modal from '../../components/ui/Modal'; // Import the Modal component
import WaitlistModal from '../../components/modals/WaitlistModal'; // Import WaitlistModal
import { useAuthContext } from '@/supa_database/components/AuthProvider';
import { Check } from 'lucide-react';
import { useTranslation } from 'next-i18next'; // Import useTranslation
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'; // Import serverSideTranslations

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default function SubscriptionPage() {
  const { t } = useTranslation('common'); // Initialize useTranslation
  const { user, profile } = useAuthContext(); // Destructure profile
  const [showPopup, setShowPopup] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [showWaitlistModal, setShowWaitlistModal] = useState(false); // State for WaitlistModal
  // Use a local state to simulate plan changes if user object from context is not directly mutable
  // or if we don't want to risk modifying the context's state without a proper dispatcher.
  // Initialize with profile.subscription_tier or a default.
  const [localUserPlan, setLocalUserPlan] = useState(profile?.subscription_tier || 'free');

  // Update localUserPlan if profile from context changes
  React.useEffect(() => {
    if (profile?.subscription_tier) {
      setLocalUserPlan(profile.subscription_tier);
    }
  }, [profile?.subscription_tier]);

  const currentUserPlan = localUserPlan; // Use local state for UI reactivity

  const commonPopupMessage = t('common_popup_message');

  const handleSelectFreePlan = () => {
    if (currentUserPlan === 'free') {
      alert(t('current_plan_alert'));
    } else {
      // Simulate switching to Free plan
      alert(t('selected_free_plan_alert'));
      setLocalUserPlan('free'); // Update local state for immediate UI feedback
      // In a real app, you would call a backend service here to update the user's plan.
      // e.g., updateUserPlan('free');
    }
  };

  const handlePremiumModalOpen = () => {
    setPopupTitle(t('premium_plan_update_title'));
    setPopupMessage(commonPopupMessage);
    setShowPopup(true);
  };

  const handleInvestorModalOpen = () => {
    setPopupTitle(t('investor_vc_plan_update_title'));
    setPopupMessage(commonPopupMessage);
    setShowPopup(true);
  };

  const closeModal = () => {
    setShowPopup(false);
    setPopupMessage("");
    setPopupTitle("");
  };

  const handleJoinWaitlist = () => {
    closeModal(); // Close the current popup
    setShowWaitlistModal(true); // Open the waitlist modal
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute top-4 left-4">
        <Button className="w-full mt-auto bg-blue-600 hover:bg-blue-700 text-white">
          <Link href="/dashboard">{t('back_to_dashboard_button', 'Back to Dashboard')}</Link>
        </Button>
      </div>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-12 pt-16 md:pt-0">
          {t('subscription_page_title')}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Free Plan Column */}
          <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('free_plan_title')}</h2>
            <p className="text-4xl font-bold text-gray-900 mb-6">{t('free_plan_price')}</p>
            <ul className="space-y-3 text-gray-600 mb-8 flex-grow">
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-2" />
                {t('free_plan_feature_1')}
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-2" />
                {t('free_plan_feature_2')}
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-2" />
                {t('free_plan_feature_3')}
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-2" />
                {t('free_plan_feature_4')}
              </li>
            </ul>
            <Button
              onClick={handleSelectFreePlan}
              className={`w-full mt-auto ${currentUserPlan === 'free' ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
              disabled={currentUserPlan === 'free'}
            >
              {currentUserPlan === 'free' ? t('current_plan_button') : t('select_plan_button')}
            </Button>
          </div>

          {/* Premium Plan Column */}
          <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col border-2 border-blue-600"> {/* Highlighted plan */}
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('premium_plan_title')}</h2>
            <p className="text-4xl font-bold text-gray-900 mb-6">{t('premium_plan_price')}</p>
            <ul className="space-y-3 text-gray-600 mb-8 flex-grow">
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-2" />
                {t('premium_plan_feature_1')}
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-2" />
                {t('premium_plan_feature_2')}
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-2" />
                {t('premium_plan_feature_3')}
              </li>
            </ul>
            <Button
              onClick={handlePremiumModalOpen}
              className="w-full mt-auto bg-blue-600 hover:bg-blue-700 text-white"
            >
              {t('upgrade_to_premium_button')}
            </Button>
          </div>

          {/* Investor/VC Plan Column */}
          <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('investor_vc_plan_title')}</h2>
            <p className="text-3xl font-bold text-gray-900 mb-6">{t('investor_vc_plan_price')}</p>
            <ul className="space-y-3 text-gray-600 mb-8 flex-grow">
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-2" />
                {t('investor_vc_plan_feature_1')}
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-2" />
                {t('investor_vc_plan_feature_2')}
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-2" />
                {t('investor_vc_plan_feature_3')}
              </li>
            </ul>
            <Button
              onClick={handleInvestorModalOpen}
              className="w-full mt-auto bg-gray-800 hover:bg-gray-900 text-white"
            >
              {t('contact_us_button')}
            </Button>
          </div>
        </div>

        {/* Optional: Add a section for login/signup if user is not authenticated */}
        {!user && (
          <div className="mt-12 text-center">
            <p className="text-lg text-gray-600 mb-4">
              {t('login_to_select_plan_message')}
            </p>
            <Button asChild>
              <Link href="/login" className="text-lg">{t('login_or_signup_button')}</Link>
            </Button>
          </div>
        )}
      </div>

      {showPopup && (
        <Modal isOpen={showPopup} onClose={closeModal} maxWidth="max-w-lg">
          <div className="p-2">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">{popupTitle}</h3>
            <p className="text-gray-600 mb-6">{popupMessage}</p>
            <div className="flex justify-end space-x-2">
              <Button
                onClick={handleJoinWaitlist}
                variant="default"
                size="lg"
                className="bg-blue-700 text-white hover:bg-blue-800 font-bold text-lg shadow-xl"
              >
                {t('hero_cta_waitlist')}
              </Button>
              <Button
                onClick={closeModal}
                variant="outline"
                size="lg"
                className="text-lg"
              >
                {t('close_button')}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {showWaitlistModal && (
        <Modal isOpen={showWaitlistModal} onClose={() => setShowWaitlistModal(false)} maxWidth="max-w-lg">
          <WaitlistModal onClose={() => setShowWaitlistModal(false)} />
        </Modal>
      )}
    </div>
  );
}
