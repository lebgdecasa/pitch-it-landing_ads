// components/layout/ProjectLayout.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar_2';
import { useRouter } from 'next/router';

interface ProjectLayoutProps {
  children: React.ReactNode;
}

export default function ProjectLayout({ children }: ProjectLayoutProps) {
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Extract project ID from router
  const projectId = router.query.id as string;

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
