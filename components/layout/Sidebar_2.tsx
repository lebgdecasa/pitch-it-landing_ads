// components/layout/Sidebar.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { mainNavItems, backNavItem } from './navigation_2';
import { useAuthContext } from '@/supa_database/components/AuthProvider';
import { Lock, ChevronLeft, ChevronRight, LifeBuoy, RefreshCw } from 'lucide-react';
import { useTranslation } from 'next-i18next';
import { useOnboarding } from '../onboarding/OnboardingProvider';

interface IconProps {
  className?: string;
}

interface SidebarProps {
  projectId?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ projectId }) => {
  const { profile } = useAuthContext();
  const router = useRouter();
  const { t } = useTranslation('common');
  const [collapsed, setCollapsed] = useState(false);
  const [showUpgradeTooltip, setShowUpgradeTooltip] = useState<string | null>(null);
  const { restartOnboarding } = useOnboarding();


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
      setShowUpgradeTooltip(t('tooltip_coming_soon', { feature: t(item.label) }));
    } else if (!canAccessFeature(item.requiresPlan)) {
      // Feature requires upgrade
      const planName = item.requiresPlan === 'enterprise' ? t('plan_enterprise') : t('plan_premium');
      setShowUpgradeTooltip(t('tooltip_upgrade_required', { feature: t(item.label), planName }));
    }

    // Hide tooltip after 3 seconds
    setTimeout(() => setShowUpgradeTooltip(null), 3000);
  };

  // Get plan display name
  const getPlanDisplayName = (plan: string) => {
    switch (plan) {
      case 'free': return t('plan_free');
      case 'premium': return t('plan_premium');
      case 'enterprise': return t('plan_enterprise');
      default: return t('plan_free');
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
            aria-label={collapsed ? t('sidebar_expand') : t('sidebar_collapse')}
            title={collapsed ? t('sidebar_expand') : t('sidebar_collapse')}
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
            <p className="text-xs font-medium text-blue-800 mb-1">{t('sidebar_current_plan')}</p>
            <div className="flex justify-between items-center">
              <span className="font-medium text-sm">
                {getPlanDisplayName(userPlan)}
              </span>
              {userPlan === 'free' && (
                <Link
                  href="/subscription"
                  className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                >
                  {t('sidebar_upgrade')}
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
            const currentPathname = router.asPath.split('?')[0];
            const isActive = currentPathname === item.href;
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
                title={collapsed ? t(item.label) : t(item.description || item.label)}
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
                    <span className={isLocked ? 'text-gray-400' : ''}>{t(item.label)}</span>
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

         {/* Feedback Section */}
                <div className={`${collapsed ? 'px-2' : 'px-4'} py-2 border-t border-gray-200`}>
                  <a
                    href="mailto:contact@nextraction.io?subject=Feedback%20for%20NexTraction"
                    className={`flex items-center ${collapsed ? 'justify-center' : ''} px-2 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors`}
                    title={t('sidebar_provide_feedback')}
                  >
                    <LifeBuoy className={`h-5 w-5 ${collapsed ? '' : 'mr-3'} text-gray-500`} />
                  </a>
                </div>

        <div className={`${collapsed ? 'px-2' : 'px-4'} py-2 border-t border-gray-200`}>
            <button
                onClick={restartOnboarding}
                className={`flex items-center ${collapsed ? 'justify-center' : ''} w-full px-2 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors`}
                title={t('restart_onboarding')}
            >
                <RefreshCw className={`h-5 w-5 ${collapsed ? '' : 'mr-3'} text-gray-500`} />
                {!collapsed && <span>{t('restart_onboarding')}</span>}
            </button>
        </div>

        {/* Back to Projects */}
        <div className={`${collapsed ? 'px-2' : 'px-4'} py-4 border-t border-gray-200`}>
          <Link
            href={backNavItem.href}
            className={`flex items-center ${collapsed ? 'justify-center' : ''} px-2 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors`}
            title={t(backNavItem.label)}
          >
            <backNavItem.icon className={`h-5 w-5 ${collapsed ? '' : 'mr-3'} text-gray-500`} />
            {!collapsed && t(backNavItem.label)}
          </Link>
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
            {t('sidebar_upgrade_now')}
          </Link>
        </div>
      )}
    </>
  );
};
