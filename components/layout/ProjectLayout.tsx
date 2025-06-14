// components/layout/ProjectLayout.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { useRouter } from 'next/router';
import { useAuthContext } from '@/supa_database/components/AuthProvider'; // Import useAuthContext

interface ProjectLayoutProps {
  children: React.ReactNode;
}

export default function ProjectLayout({ children }: ProjectLayoutProps) {
  const router = useRouter();
  const { profile, loading: authLoading } = useAuthContext(); // Get profile and authLoading
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Extract project ID from router
  const projectId = router.query.id as string;

  useEffect(() => {
    if (!authLoading && profile) {
      if (profile.subscription_tier === 'free') {
        // Redirect free users to the _2 layout, which will use Sidebar_2 and ActionButtons_freemium_beta_
        router.push(`/project/${projectId}/index_2`); // Assuming index_2 uses ProjectLayout_2
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

  // If user is free, this layout shouldn't render or should redirect.
  // The useEffect above handles redirection. If it hasn't redirected yet,
  // and the user is free, show a loading/redirecting message.
  if (profile && profile.subscription_tier === 'free') {
    return <div>Redirecting to the appropriate version for your plan...</div>;
  }

  // Premium or enterprise users can see this layout.
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
