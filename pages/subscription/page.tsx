"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Check, CreditCard, Shield, Clock, Star } from 'lucide-react';
import { useAuthContext } from '@/supa_database/components/AuthProvider';
import { Button } from '../../components/ui/button';

export default function Subscription() {
  const auth = useAuthContext();
  // Extend the User type to include 'plan' if not already present
  type UserWithPlan = typeof auth.user & { plan: 'free' | 'premium' | 'enterprise' };
  const user = auth.user as UserWithPlan;
  // Removed dispatch as it does not exist on AuthState

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
        <h2 className="text-2xl font-bold mb-4">Please Log In</h2>
        <p className="mb-6 text-center">You need to be logged in to manage your subscription.</p>
        <Button asChild>
          <Link href="/login">Log In</Link>
        </Button>
      </div>
    );
  }

  const handleUpgrade = (plan: 'pro' | 'enterprise') => {
    // In a real application, this would trigger payment processing
    // For now, you might want to show a message or redirect the user
    alert(`Upgrade to ${plan} plan is not implemented.`);
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Your Subscription</h1>
        <p className="text-gray-600 mt-2">Review, upgrade or change your subscription plan</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Current Subscription</h2>
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <p className="text-lg font-medium">
              {user.plan === 'free' ? 'Free Plan' : user.plan === 'premium' ? 'Premium Plan' : 'Enterprise Plan'}
            </p>
            <p className="text-gray-500 text-sm mt-1">
              {user.plan === 'free'
                ? 'Basic features for getting started'
                : user.plan === 'premium'
                ? '$19/month - Billed monthly'
                : '$49/month - Billed monthly'}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            {user.plan !== 'free' && (
              <div className="flex items-center text-sm text-green-600 mb-2">
                <Check className="h-4 w-4 mr-2" />
                <span>Active subscription</span>
              </div>
            )}
            {user.plan === 'free' ? (
              <Button onClick={() => handleUpgrade('pro')} className="w-full md:w-auto">
                Upgrade Now
              </Button>
            ) : (
              <Button variant="outline" className="w-full md:w-auto">
                Manage Billing
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
        {user.plan !== 'free' ? (
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 bg-gray-100 rounded-md mr-4">
                <CreditCard className="h-6 w-6 text-gray-700" />
              </div>
              <div>
                <p className="font-medium">Visa ending in 4242</p>
                <p className="text-gray-500 text-sm">Expires 12/2025</p>
              </div>
            </div>
            <div className="mt-4 md:mt-0 space-x-2">
              <Button variant="outline" size="sm">
                Update
              </Button>
              <Button variant="outline" size="sm">
                Remove
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-gray-600">
            <p>No payment method on file. Add a payment method when you upgrade your plan.</p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Billing History</h2>
        {user.plan !== 'free' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-2 font-medium text-gray-600 text-sm">Date</th>
                  <th className="pb-2 font-medium text-gray-600 text-sm">Amount</th>
                  <th className="pb-2 font-medium text-gray-600 text-sm">Status</th>
                  <th className="pb-2 font-medium text-gray-600 text-sm">Invoice</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-3 text-sm">Apr 1, 2023</td>
                  <td className="py-3 text-sm">{user.plan === 'premium' ? '$19.00' : '$49.00'}</td>
                  <td className="py-3 text-sm">
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                      Paid
                    </span>
                  </td>
                  <td className="py-3 text-sm">
                    <Link href="#" className="text-deep-blue hover:underline">
                      View
                    </Link>
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 text-sm">Mar 1, 2023</td>
                  <td className="py-3 text-sm">{user.plan === 'premium' ? '$19.00' : '$49.00'}</td>
                  <td className="py-3 text-sm">
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                      Paid
                    </span>
                  </td>
                  <td className="py-3 text-sm">
                    <Link href="#" className="text-deep-blue hover:underline">
                      View
                    </Link>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 text-sm">Feb 1, 2023</td>
                  <td className="py-3 text-sm">{user.plan === 'premium' ? '$19.00' : '$49.00'}</td>
                  <td className="py-3 text-sm">
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                      Paid
                    </span>
                  </td>
                  <td className="py-3 text-sm">
                    <Link href="#" className="text-deep-blue hover:underline">
                      View
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-gray-600">
            <p>No billing history available with the free plan.</p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Subscription Settings</h2>
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between py-2">
            <div>
              <p className="font-medium">Auto-renewal</p>
              <p className="text-gray-500 text-sm">Your subscription will automatically renew on the due date</p>
            </div>
            <div className="mt-2 md:mt-0">
              <label className="inline-flex relative items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          {user.plan !== 'free' && (
            <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700">
              Cancel Subscription
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
