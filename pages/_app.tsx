import React, { useState, useEffect } from 'react'; // Added useEffect
import { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router'; // Added useRouter
import { LanguageProvider } from '@/context/LanguageContext';
import { AnalyticsProvider } from '@/components/AnalyticsProvider';
import LazyGoogleAnalytics from '@/components/LazyGoogleAnalytics';
import OptimizedAnalytics from '@/components/OptimizedAnalytics';
import ResourcePrefetcher from '@/components/ResourcePrefetcher';
import Modal from '@/components/ui/Modal';
import CalendlyModal from '@/components/modals/CalendlyModal';
import WaitlistModal from '@/components/modals/WaitlistModal';
import '@/styles/globals.css';
import { appWithTranslation } from 'next-i18next';
import 'shepherd.js/dist/css/shepherd.css';

import { AuthProvider, useAuthContext } from '@/supa_database/components/AuthProvider'; // Added useAuthContext
// AuthModal import might be removed if /auth page is the sole auth mechanism now
// import AuthModal from '@/supa_database/components/AuthModal'; // Lazy loaded
import dynamic from 'next/dynamic';
// import { Toaster } from 'react-hot-toast'; // Assuming react-hot-toast is installed

const AuthModal = dynamic(() => import('@/supa_database/components/AuthModal'), { ssr: false });

// --- Route Guard Configuration ---
const PROTECTED_ROUTES = [
  '/dashboard',
  '/project',  // This will match /project/[id] routes
  '/subscription',
];

const AUTH_PAGE_ROUTE = '/auth'; // The main authentication page

const isPathProtected = (pathname: string): boolean => {
  return PROTECTED_ROUTES.some(route => pathname.startsWith(route));
};

interface RouteGuardProps {
  children: React.ReactNode;
}

const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
  const { user, loading } = useAuthContext();
  const router = useRouter();
  const { pathname } = router;

  const isProtectedRoute = isPathProtected(pathname);
  const isAuthPageRoute = pathname === AUTH_PAGE_ROUTE;

  useEffect(() => {
    if (loading) {
      return; // Do nothing while loading auth state
    }

    if (!user && isProtectedRoute) {
      // If not authenticated and trying to access a protected route, redirect to auth page
      router.push(AUTH_PAGE_ROUTE);
    } else if (user && isAuthPageRoute) {
      // If authenticated and trying to access the auth page, redirect to dashboard
      router.push('/dashboard');
    }
  }, [user, loading, pathname, router, isProtectedRoute, isAuthPageRoute]);

  // For public routes (not protected and not auth page),
  // always render content immediately, even if auth is still loading
  if (!isProtectedRoute && !isAuthPageRoute) {
    return <>{children}</>;
  }

  // For protected routes: show loading only if auth is loading
  if (loading && isProtectedRoute) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // For auth page: show loading if auth is loading
  if (loading && isAuthPageRoute) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Handle cases where we're about to redirect
  if (!user && isProtectedRoute) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Redirecting to login...</p>
      </div>
    );
  }

  if (user && isAuthPageRoute) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Redirecting to dashboard...</p>
      </div>
    );
  }

  // Render the actual page content
  return <>{children}</>;
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
          <AnalyticsProvider>
          <LanguageProvider> {/* LanguageProvider now inside RouteGuard to access context if needed, or can be outside if independent */}
            <Component {...enhancedPageProps} />
            {/* Modals are outside the main Component render tree from Next.js perspective but within context providers */}
            {isDemoModalOpen && (
              <Modal isOpen={isDemoModalOpen} onClose={closeDemoModal} maxWidth="max-w-2xl">
                <CalendlyModal onClose={closeDemoModal} />
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
          </AnalyticsProvider>
        </RouteGuard>
      </AuthProvider>
    </>
  );
}

export default appWithTranslation(MyApp);
