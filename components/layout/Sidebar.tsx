// components/layout/Sidebar.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { mainNavItems, backNavItem } from './navigation';
import { useAuthContext } from '@/supa_database/components/AuthProvider';
import { Lock, ChevronLeft, ChevronRight, LifeBuoy } from 'lucide-react';

interface IconProps {
  className?: string;
}

interface SidebarProps {
  projectId?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ projectId }) => {
  const { profile } = useAuthContext();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [showUpgradeTooltip, setShowUpgradeTooltip] = useState<string | null>(null);

  // Load user preference from localStorage on component mount
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState !== null) {
      setCollapsed(savedState === 'true');
    }
  }, []);

  // Save collapsed state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', collapsed.toString());
  }, [collapsed]);

  // Get user's current plan
  const userPlan = profile?.subscription_tier || 'free';

  // Replace :id placeholder in navigation hrefs with actual project ID
  const navItems = mainNavItems.map(item => ({
    ...item,
    href: item.href.replace(':id', projectId || '')
  }));

  // Toggle sidebar collapsed state
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  // Check if user can access a feature
  const canAccessFeature = (requiredPlan: string) => {
    const planHierarchy = { 'free': 0, 'premium': 1, 'enterprise': 2 };
    const userLevel = planHierarchy[userPlan as keyof typeof planHierarchy] || 0;
    const requiredLevel = planHierarchy[requiredPlan as keyof typeof planHierarchy] || 0;
    return userLevel >= requiredLevel;
  };

  // Handle click on locked features
  const handleLockedFeatureClick = (e: React.MouseEvent, item: any) => {
    e.preventDefault();
    if (!item.isImplemented) {
      // Feature not implemented yet
      setShowUpgradeTooltip(`${item.label} is coming soon! Join our premium plan to get early access.`);
    } else if (!canAccessFeature(item.requiresPlan)) {
      // Feature requires upgrade
      const planName = item.requiresPlan === 'enterprise' ? 'Enterprise' : 'Premium';
      setShowUpgradeTooltip(`${item.label} requires ${planName} plan. Upgrade to unlock this feature!`);
    }

    // Hide tooltip after 3 seconds
    setTimeout(() => setShowUpgradeTooltip(null), 3000);
  };

  // Get plan display name
  const getPlanDisplayName = (plan: string) => {
    switch (plan) {
      case 'free': return 'Free';
      case 'premium': return 'Premium';
      case 'enterprise': return 'Enterprise';
      default: return 'Free';
    }
  };

  return (
    <>
      <aside
        className={`hidden lg:flex flex-col bg-white border-r border-gray-200 fixed h-screen pt-5 transition-all duration-300 ease-in-out z-40 ${
          collapsed ? 'w-16' : 'w-64'
        }`}
      >
        {/* Header */}
        <div className={`px-3 mb-6 flex ${collapsed ? 'justify-center' : 'justify-between'} items-center`}>
          {!collapsed && (
            <Link href="/dashboard" className="flex items-center">
              <span className="text-xl font-bold text-blue-600">NexTraction</span>
            </Link>
          )}
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600 transition-colors"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Plan information */}
        {!collapsed && (
          <div className="bg-blue-50 mx-4 p-3 rounded-md mb-6">
            <p className="text-xs font-medium text-blue-800 mb-1">Current Plan</p>
            <div className="flex justify-between items-center">
              <span className="font-medium text-sm">
                {getPlanDisplayName(userPlan)}
              </span>
              {userPlan === 'free' && (
                <Link
                  href="/subscription"
                  className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                >
                  Upgrade
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Main Navigation */}
        <nav className={`flex-1 ${collapsed ? 'px-2' : 'px-4'} space-y-1`}>
          {navItems.map((item, index) => {
            const Icon = item.icon;
            // Check if the current path (without query parameters) matches the item's href
            // Also handle cases where item.href might be just "/" for a home/dashboard link
            const currentPathname = router.asPath.split('?')[0];
            let isActive = currentPathname === item.href;
            // If item.href is a base path (e.g., /project/:id) and current path is a sub-route,
            // consider it active if it's the overview/index page for that section.
            // This needs careful handling if there are other links that might also startWith this.
            // For this sidebar, exact match or specific logic for index might be better than general startsWith.
            // Example: If item.href is '/project/123' and currentPathname is '/project/123', it's active.
            // If item.href is '/project/123/index_2' (like in navigation_2.ts) this exact match is fine.

            const canAccess = canAccessFeature(item.requiresPlan || 'free');
            const isLocked = !canAccess || !item.isImplemented;

            const navItem = (
              <div
                key={index}
                className={`flex items-center ${collapsed ? 'justify-center' : ''} px-2 py-3 rounded-md text-sm font-medium cursor-pointer transition-all duration-200 ${
                  isActive && canAccess && item.isImplemented
                    ? 'bg-blue-50 text-blue-600'
                    : isLocked
                    ? 'text-gray-400 hover:bg-gray-50'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
                title={collapsed ? item.label : item.description}
                onClick={isLocked ? (e) => handleLockedFeatureClick(e, item) : undefined}
              >
                <div className="relative flex items-center">
                  <Icon className={`h-5 w-5 ${collapsed ? '' : 'mr-3'} ${
                    isActive && canAccess && item.isImplemented
                      ? 'text-blue-600'
                      : isLocked
                      ? 'text-gray-400'
                      : 'text-gray-500'
                  }`} />
                  {isLocked && (
                    <Lock className={`h-3 w-3 ${collapsed ? 'absolute -top-1 -right-1' : 'ml-1'} text-gray-400`} />
                  )}
                </div>
                {!collapsed && (
                  <div className="flex items-center justify-between w-full">
                    <span className={isLocked ? 'text-gray-400' : ''}>{item.label}</span>
                    {isLocked && !collapsed && (
                      <Lock className="h-3 w-3 text-gray-400 ml-2" />
                    )}
                  </div>
                )}
              </div>
            );

            // If feature is accessible and implemented, wrap with Link
            if (canAccess && item.isImplemented) {
              return (
                <Link key={index} href={item.href}>
                  {navItem}
                </Link>
              );
            }

            // Otherwise, just return the div (for locked features)
            return navItem;
          })}
        </nav>

        {/* Back to Projects */}
        <div className={`${collapsed ? 'px-2' : 'px-4'} py-4 border-t border-gray-200`}>
          <Link
            href={backNavItem.href}
            className={`flex items-center ${collapsed ? 'justify-center' : ''} px-2 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors`}
            title={backNavItem.label}
          >
            <backNavItem.icon className={`h-5 w-5 ${collapsed ? '' : 'mr-3'} text-gray-500`} />
            {!collapsed && backNavItem.label}
          </Link>
        </div>

        {/* Feedback Section */}
        <div className={`${collapsed ? 'px-2' : 'px-4'} py-2 border-t border-gray-200`}>
          <a
            href="mailto:feedback@nextraction.ai?subject=Feedback%20for%20NexTraction"
            className={`flex items-center ${collapsed ? 'justify-center' : ''} px-2 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors`}
            title="Provide Feedback"
          >
            <LifeBuoy className={`h-5 w-5 ${collapsed ? '' : 'mr-3'} text-gray-500`} />
            {!collapsed && "Feedback"}
          </a>
        </div>
      </aside>

      {/* Upgrade Tooltip */}
      {showUpgradeTooltip && (
        <div className="fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 max-w-sm">
          <p className="text-sm">{showUpgradeTooltip}</p>
          <Link
            href="/subscription"
            className="text-xs underline hover:no-underline mt-1 block"
            onClick={() => setShowUpgradeTooltip(null)}
          >
            Upgrade Now →
          </Link>
        </div>
      )}
    </>
  );
};
