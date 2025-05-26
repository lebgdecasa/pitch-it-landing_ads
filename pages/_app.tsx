import React, { useEffect } from 'react';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { LanguageProvider } from '@/context/LanguageContext';
import GoogleAnalytics from '@/components/GoogleAnalytics'; // This component might be redundant now or need refactoring
import * as analytics from '@/utils/analytics';
import '@/styles/globals.css';
import CookieConsent, { Cookies } from "react-cookie-consent";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // Initialize analytics if consent was already given on previous visits
  useEffect(() => {
    if (Cookies.get("PitchItCookieConsent") === "true" && typeof window !== "undefined") {
      analytics.initializeAnalytics();
    }
  }, []);

  useEffect(() => {
    // Track page views
    const handleRouteChange = (url: string) => {
      analytics.pageview(url);
    };

    // Initial pageview is now handled by initializeAnalytics after consent
    // or by the first routeChangeComplete if consent was already given.
    // analytics.pageview(window.location.pathname); 

    // Get and store UTM parameters on initial load
    analytics.getUTMParams();

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  useEffect(() => {
    // Add Inter font link
    const fontLink = document.createElement('link');
    fontLink.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap";
    fontLink.rel = "stylesheet";
    document.head.appendChild(fontLink);

    return () => {
      if (document.head.contains(fontLink)) {
        document.head.removeChild(fontLink);
      }
    };
  }, []);

  // Track Web Vitals
  useEffect(() => {
    const reportWebVitals = async () => {
      if (typeof window !== 'undefined') {
        try {
          const { onCLS, onINP, onFCP, onLCP, onTTFB } = await import('web-vitals');

          onCLS(analytics.trackWebVitals);
          onINP(analytics.trackWebVitals);
          onFCP(analytics.trackWebVitals);
          onLCP(analytics.trackWebVitals);
          onTTFB(analytics.trackWebVitals);
        } catch (error) {
          console.log('Web Vitals not supported');
        }
      }
    };

    reportWebVitals();
  }, []);

  return (
    <>
      {/* GoogleAnalytics component might need to be reviewed. 
          If it only adds the GA script tag, that's handled by ReactGA. 
          If it does other things, ensure they are compatible with consent. */}
      <GoogleAnalytics /> 
      <LanguageProvider>
        <Component {...pageProps} />
      </LanguageProvider>
      <CookieConsent
        location="bottom"
        buttonText="I understand & accept"
        cookieName="PitchItCookieConsent" // Specific cookie name
        style={{ background: "#001f3f", padding: "15px", fontSize: "15px" }}
        buttonStyle={{ color: "#ffffff", background: "#f0ad4e", fontSize: "14px", padding: "10px 15px", borderRadius: "5px" }}
        expires={150} // Days
        onAccept={() => {
          analytics.initializeAnalytics();
          // The initial pageview is now sent by initializeAnalytics itself.
          // No need to call analytics.pageview() here again.
        }}
        enableDeclineButton
        onDecline={() => {
          console.log("User declined cookie consent. GA4 not initialized.");
          // Optionally, clear any GA cookies if they were somehow set before decline
          // Cookies.remove('_ga'); Cookies.remove('_gid'); // etc. for specific GA cookies
        }}
        declineButtonStyle={{ background: "#5A5A5A", fontSize: "14px", padding: "10px 15px", borderRadius: "5px" }}
        declineButtonText="I decline"
      >
        This website uses cookies to enhance your experience and for analytics purposes.{" "}
        <span style={{ fontSize: "12px" }}>
          By clicking &quot;I understand & accept&quot;, you consent to our use of cookies.
        </span>
      </CookieConsent>
    </>
  );
}

export default MyApp;
