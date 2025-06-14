// components/layout/ProjectLayout.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar_2'; // Ensure this uses Sidebar_2
import { useRouter } from 'next/router';
import { useAuthContext } from '@/supa_database/components/AuthProvider'; // Import useAuthContext

interface ProjectLayoutProps {
  children: React.ReactNode;
}

export default function ProjectLayout({ children }: ProjectLayoutProps) { // Renamed to ProjectLayout_2 if it's a separate file, or ensure correct import
  const router = useRouter();
  const { profile, loading: authLoading } = useAuthContext(); // Get profile and authLoading
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Extract project ID from router
  const projectId = router.query.id as string;

  useEffect(() => {
    if (!authLoading && profile) {
      if (profile.subscription_tier === 'premium' || profile.subscription_tier === 'enterprise') {
        // Redirect premium/enterprise users to the main layout
        router.push(`/project/${projectId}`); // Assuming index uses ProjectLayout
      }
    }
  }, [authLoading, profile, router, projectId]);

  // Check localStorage on mount to sync with sidebar component
  useEffect(() => {
    const checkSidebarState = () => {
      const savedState = localStorage.getItem('sidebarCollapsed');
      if (savedState !== null) {
        setSidebarCollapsed(savedState === 'true');
      }
    };

    // Initial check
    checkSidebarState();

    // Setup event listener for storage changes
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'sidebarCollapsed') {
        setSidebarCollapsed(event.newValue === 'true');
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Also poll occasionally since storage events don't trigger in the same window
    const interval = setInterval(checkSidebarState, 500);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  if (authLoading) {
    return <div>Loading user information...</div>; // Or a proper loading spinner
  }

  // If user is premium or enterprise, this layout shouldn't render or should redirect.
  // The useEffect above handles redirection.
  if (profile && (profile.subscription_tier === 'premium' || profile.subscription_tier === 'enterprise')) {
    return <div>Redirecting to the appropriate version for your plan...</div>;
  }

  // Free users can see this layout.
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar projectId={projectId} />
      <main
        className={`flex-1 overflow-y-auto transition-all duration-300 ease-in-out ml-0 ${
          sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
        }`}
      >
        <div className="min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
