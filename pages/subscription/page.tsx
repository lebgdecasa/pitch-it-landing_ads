"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '../../components/ui/button'; // Assuming this path is correct
import Modal from '../../components/ui/Modal'; // Import the Modal component
import { useAuthContext } from '@/supa_database/components/AuthProvider';
import { Check } from 'lucide-react';

export default function SubscriptionPage() {
  const { user } = useAuthContext();
  const [showPopup, setShowPopup] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  // Use a local state to simulate plan changes if user object from context is not directly mutable
  // or if we don't want to risk modifying the context's state without a proper dispatcher.
  // Initialize with user.plan or a default.
  const [localUserPlan, setLocalUserPlan] = useState(user?.plan || 'free');

  // Update localUserPlan if user from context changes
  React.useEffect(() => {
    if (user?.plan) {
      setLocalUserPlan(user.plan);
    }
  }, [user?.plan]);

  const currentUserPlan = localUserPlan; // Use local state for UI reactivity

  const commonPopupMessage = "You can't upgrade right now as this is a beta version but can sign-up to the waitlist to have early access to the full features.";

  const handleSelectFreePlan = () => {
    if (currentUserPlan === 'free') {
      alert("This is your current plan.");
    } else {
      // Simulate switching to Free plan
      alert("You have selected the Free Plan.");
      setLocalUserPlan('free'); // Update local state for immediate UI feedback
      // In a real app, you would call a backend service here to update the user's plan.
      // e.g., updateUserPlan('free');
    }
  };

  const handlePremiumModalOpen = () => {
    setPopupTitle("Premium Plan Update");
    setPopupMessage(commonPopupMessage);
    setShowPopup(true);
  };

  const handleInvestorModalOpen = () => {
    setPopupTitle("Investor/VC Plan Update");
    setPopupMessage(commonPopupMessage);
    setShowPopup(true);
  };

  const closeModal = () => {
    setShowPopup(false);
    setPopupMessage("");
    setPopupTitle("");
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-12">
          Choose Your Plan
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Free Plan Column */}
          <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Free</h2>
            <p className="text-4xl font-bold text-gray-900 mb-6">$0</p>
            <ul className="space-y-3 text-gray-600 mb-8 flex-grow">
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-2" />
                3 projects per user
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-2" />
                Persona group chat
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-2" />
                Netnographic analysis (analyze online conversations)
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-2" />
                Keytrends analysis (identify key trends)
              </li>
            </ul>
            <Button
              onClick={handleSelectFreePlan}
              className={`w-full mt-auto ${currentUserPlan === 'free' ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
              disabled={currentUserPlan === 'free'}
            >
              {currentUserPlan === 'free' ? 'Current Plan' : 'Select Plan'}
            </Button>
          </div>

          {/* Premium Plan Column */}
          <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col border-2 border-blue-600"> {/* Highlighted plan */}
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Premium</h2>
            <p className="text-4xl font-bold text-gray-900 mb-6">$40</p>
            <ul className="space-y-3 text-gray-600 mb-8 flex-grow">
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-2" />
                5 projects per user
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-2" />
                Access to all features
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-2" />
                Pulse (extra cost, depending on parameters)
              </li>
            </ul>
            <Button
              onClick={handlePremiumModalOpen}
              className="w-full mt-auto bg-blue-600 hover:bg-blue-700 text-white"
            >
              Upgrade to Premium
            </Button>
          </div>

          {/* Investor/VC Plan Column */}
          <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Investor/VC</h2>
            <p className="text-3xl font-bold text-gray-900 mb-6">Contact Us</p>
            <ul className="space-y-3 text-gray-600 mb-8 flex-grow">
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-2" />
                Unlimited project creation
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-2" />
                Access to all features
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-2" />
                Batch deck upload
              </li>
            </ul>
            <Button
              onClick={handleInvestorModalOpen}
              className="w-full mt-auto bg-gray-800 hover:bg-gray-900 text-white"
            >
              Contact Us
            </Button>
          </div>
        </div>

        {/* Optional: Add a section for login/signup if user is not authenticated */}
        {!user && (
          <div className="mt-12 text-center">
            <p className="text-lg text-gray-600 mb-4">
              You need to be logged in to select a plan.
            </p>
            <Button asChild>
              <Link href="/login" className="text-lg">Log In or Sign Up</Link>
            </Button>
          </div>
        )}
      </div>

      {showPopup && (
        <Modal isOpen={showPopup} onClose={closeModal} maxWidth="max-w-lg">
          <div className="p-2">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">{popupTitle}</h3>
            <p className="text-gray-600 mb-6">{popupMessage}</p>
            <div className="flex justify-end">
              <Button onClick={closeModal} variant="outline">
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
