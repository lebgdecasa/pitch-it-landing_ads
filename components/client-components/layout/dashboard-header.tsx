"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router'; // Added useRouter
import { Menu, Bell, Search, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/supa_database/components/AuthProvider';
import { trackButtonClick } from '@/utils/analytics'; // Assuming you have this utility

export const DashboardHeader = () => {
  const { user } = useAuthContext();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const router = useRouter(); // Added

  const handleSignOut = async () => {
    trackButtonClick('sign_out', 'dashboard_header'); // Optional: for analytics
    setIsProfileOpen(false); // Close profile dropdown
    try {
      const response = await fetch('/api/auth/signout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Sign-out failed');
      }

      // Option 1: Hard reload to ensure all state is cleared
      window.location.href = '/';

      // Option 2: Next.js router push and then reload (might be slightly smoother if server correctly clears cookie)
      // await router.push('/');
      // router.reload();

    } catch (err: any) {
      console.error('Sign-out error:', err.message);
      // Optionally, show an error message to the user
      alert('Failed to sign out: ' + err.message);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Left section */}
          <div className="flex items-center">
            <Link href="/" >
              <span className="text-3xl font-bold text-blue-700 hover:text-blue-800 transition-colors">NexTraction</span>
            </Link>
            <button className="p-2 rounded-md text-gray-500 lg:hidden">
              <Menu className="h-6 w-6" />
            </button>
          </div>

          {/* Search bar - hidden on small screens */}
          {/* <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="w-full relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search projects..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:ring-deep-blue focus:border-deep-blue text-sm"
              />
            </div>
          </div> */}

          {/* Right section */}
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100">
              <Bell className="h-5 w-5" />
            </button>

            {user ? (
              <div className="relative">
                <button
                  className="flex items-center text-sm focus:outline-none"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                  <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                    {user.email ? user.email.charAt(0).toUpperCase() : "U"}
                  </div>
                  <span className="hidden md:block ml-2">{user.email || "User"}</span>
                  <ChevronDown className="h-4 w-4 ml-1 text-gray-500" />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50"> {/* Added z-50 */}
                    <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsProfileOpen(false)} >
                      Profile Settings
                    </Link>
                    <Link href="/subscription/page" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsProfileOpen(false)}>
                      Subscription
                    </Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    {/* Changed Link to button to handle sign out */}
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Button asChild size="sm">
                <Link href="/login">Log in</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
