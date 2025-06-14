import React, { useState, useEffect } from 'react'; // Added useEffect
import { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router'; // Added useRouter
import { LanguageProvider } from '@/context/LanguageContext';
import LazyGoogleAnalytics from '@/components/LazyGoogleAnalytics';
import OptimizedAnalytics from '@/components/OptimizedAnalytics';
import ResourcePrefetcher from '@/components/ResourcePrefetcher';
import Modal from '@/components/ui/Modal';
import DemoModal from '@/components/modals/DemoModal';
import WaitlistModal from '@/components/modals/WaitlistModal';
import '@/styles/globals.css';
import { appWithTranslation } from 'next-i18next';

import { AuthProvider, useAuthContext } from '@/supa_database/components/AuthProvider'; // Added useAuthContext
// AuthModal import might be removed if /auth page is the sole auth mechanism now
// import AuthModal from '@/supa_database/components/AuthModal'; // Lazy loaded
import dynamic from 'next/dynamic';
// import { Toaster } from 'react-hot-toast'; // Assuming react-hot-toast is installed

const AuthModal = dynamic(() => import('@/supa_database/components/AuthModal'), { ssr: false });

// --- Route Guard Configuration ---
const PROTECTED_ROUTES = ['/dashboard']; // Example, add actual protected routes
const AUTH_PAGE_ROUTE = '/auth'; // The main authentication page

interface RouteGuardProps {
  children: React.ReactNode;
}

const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
  const { user, loading } = useAuthContext();
  const router = useRouter();
  const { pathname } = router;

  useEffect(() => {
    if (loading) {
      return; // Do nothing while loading auth state
    }

    const isProtectedRoute = PROTECTED_ROUTES.includes(pathname);
    const isAuthPageRoute = pathname === AUTH_PAGE_ROUTE;

    if (!user && isProtectedRoute) {
      // If not authenticated and trying to access a protected route, redirect to auth page
      router.push(AUTH_PAGE_ROUTE);
    } else if (user && isAuthPageRoute) {
      // If authenticated and trying to access the auth page, redirect to a default protected route (e.g., dashboard)
      router.push(PROTECTED_ROUTES[0] || '/'); // Fallback to home if no protected routes defined
    }
    // No explicit 'else' needed here; if no redirect, component renders children.
  }, [user, loading, pathname, router]);

  // Conditional rendering while loading or if a redirect is likely
  if (loading) {
    return <div>Loading authentication state...</div>; // Or a global spinner component
  }

  const isProtectedRoute = PROTECTED_ROUTES.includes(pathname);
  const isAuthPageRoute = pathname === AUTH_PAGE_ROUTE;

  if (!user && isProtectedRoute) {
    // User is not authenticated and is on a protected route, redirect is imminent or happening.
    // Render loading indicator to prevent flashing page content.
    return <div>Redirecting to login...</div>; // Or a global spinner
  }

  if (user && isAuthPageRoute) {
    // User is authenticated and on the auth page, redirect is imminent or happening.
    // Render loading indicator.
    return <div>Redirecting to dashboard...</div>; // Or a global spinner
  }

  return <>{children}</>; // Render the actual page content
};
// --- End Route Guard ---


function MyApp({ Component, pageProps }: AppProps) {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);
  // The AuthModal state might become obsolete if /auth page is the primary mechanism
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const openDemoModal = () => setIsDemoModalOpen(true);
  const closeDemoModal = () => setIsDemoModalOpen(false);

  const openWaitlistModal = () => setIsWaitlistModalOpen(true);
  const closeWaitlistModal = () => setIsWaitlistModalOpen(false);

  const enhancedPageProps = {
    ...pageProps,
    openDemoModal,
    openWaitlistModal,
    openAuthModal, // This might be removed if AuthModal is no longer used
  };

  return (
    <>
      <Head>
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <style dangerouslySetInnerHTML={{
          __html: `
            body { font-family: 'Inter', sans-serif; }
            .font-inter { font-family: 'Inter', sans-serif; }
          `
        }} />
      </Head>

      <LazyGoogleAnalytics />
      <OptimizedAnalytics />
      <ResourcePrefetcher />

      <AuthProvider>
        {/* <Toaster position="top-center" reverseOrder={false} /> */} {/* Placeholder for react-hot-toast Toaster */}
        <RouteGuard>
          <LanguageProvider> {/* LanguageProvider now inside RouteGuard to access context if needed, or can be outside if independent */}
            <Component {...enhancedPageProps} />
            {/* Modals are outside the main Component render tree from Next.js perspective but within context providers */}
            {isDemoModalOpen && (
              <Modal isOpen={isDemoModalOpen} onClose={closeDemoModal} maxWidth="max-w-2xl">
                <DemoModal onClose={closeDemoModal} />
              </Modal>
            )}
            {isWaitlistModalOpen && (
              <Modal isOpen={isWaitlistModalOpen} onClose={closeWaitlistModal}>
                <WaitlistModal onClose={closeWaitlistModal} />
              </Modal>
            )}
            {/* Consider removing AuthModal if /auth page is the primary auth method now */}
            {isAuthModalOpen && <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />}
          </LanguageProvider>
        </RouteGuard>
      </AuthProvider>
    </>
  );
}

export default appWithTranslation(MyApp);
