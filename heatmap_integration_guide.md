# Microsoft Clarity Integration Guide for Heatmaps & Session Recordings

## 1. Introduction

Microsoft Clarity is a free user behavior analytics tool that helps you understand how users are interacting with your website. Key features include:

*   **Heatmaps:** Visually represent where users click, move, and scroll on your pages.
*   **Session Recordings:** Replay user sessions to see their journey and identify pain points.
*   **Insights Dashboard:** Provides an overview of user engagement and performance metrics.

Integrating Clarity can provide valuable insights into user behavior, helping to improve user experience and identify areas for optimization. It's also designed to be GDPR and CCPA compliant.

## 2. Account Setup

1.  **Go to Microsoft Clarity:** Visit [https://clarity.microsoft.com/](https://clarity.microsoft.com/).
2.  **Sign Up/Sign In:** Create a new account or sign in with your Microsoft, Google, or Facebook account.
3.  **Create a New Project:**
    *   Click on "New project".
    *   Enter your project name (e.g., your website name) and your website URL.
    *   A category for your site will be automatically selected, you can change it if needed.
    *   Click "Create".
4.  **Get Tracking Code:**
    *   Once the project is created, you'll be taken to the "Setup" tab.
    *   You will find your **Project ID** (often referred to as `clarityID` or `trackingID`) here. This ID is crucial for the integration.
    *   Clarity provides a tracking script. We will adapt this script to work with our cookie consent mechanism.

## 3. Integration with React/Next.js (Respecting Cookie Consent)

It's essential that Microsoft Clarity, like any analytics tool, only loads and tracks users after they have given their consent through the cookie banner. We will integrate Clarity into the existing cookie consent flow established for Google Analytics.

The Clarity script should be initiated:
*   When a user accepts the cookie consent.
*   When the application loads, if the user has already given consent in a previous session.

This can be achieved by adding the Clarity setup logic within the `initializeAnalytics` function in `utils/analytics.ts` (recommended for centralization) or directly within `pages/_app.tsx` where `initializeAnalytics` is called after consent is confirmed.

**Conceptual Example:**

The following snippet shows how you can add the Clarity setup. This code should be placed where analytics are initialized post-consent (e.g., inside the `initializeAnalytics` function in `utils/analytics.ts` or in the `onAccept` callback of `CookieConsent` in `pages/_app.tsx`).

```javascript
// Presuming this code is placed where cookie consent has been confirmed
// For example, inside initializeAnalytics() in utils/analytics.ts
// or in the onAccept of CookieConsent in pages/_app.tsx

// ... (any existing GA4 initialization logic like ReactGA.initialize()) ...
// console.log("GA4 Initialized (consent given)"); // from existing setup

// --- Microsoft Clarity Setup ---
const CLARITY_TRACKING_ID = "YOUR_CLARITY_ID"; // !! REPLACE with your actual Project ID from Clarity dashboard !!

if (typeof window !== "undefined" && !window.clarity && CLARITY_TRACKING_ID !== "YOUR_CLARITY_ID") { // Check if Clarity is not already loaded and ID is replaced
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)}; // Clarity queue
        t=l.createElement(r); // Create script element
        t.async=1; // Script async loading
        t.src="https://www.clarity.ms/tag/"+i; // Clarity script URL with your ID
        y=l.getElementsByTagName(r)[0]; // Get the first script tag on the page
        y.parentNode.insertBefore(t,y); // Insert Clarity script before the first script tag
    })(window, document, "clarity", "script", CLARITY_TRACKING_ID);
    console.log("Microsoft Clarity script initiated with ID:", CLARITY_TRACKING_ID);
} else if (CLARITY_TRACKING_ID === "YOUR_CLARITY_ID" && typeof window !== "undefined" && window.console) {
    console.warn("Microsoft Clarity Tracking ID is not set. Please replace 'YOUR_CLARITY_ID'.");
}
// --- End Microsoft Clarity Setup ---
```

**Key Points for Implementation:**

*   **Replace `YOUR_CLARITY_ID`:** Most importantly, replace `"YOUR_CLARITY_ID"` with the actual Project ID obtained from your Microsoft Clarity dashboard. The script includes a check to warn you if it's not replaced.
*   **Placement:**
    *   **Recommended:** Integrate this snippet into the `initializeAnalytics` function in `utils/analytics.ts`. This centralizes analytics initialization that depends on cookie consent.
        ```typescript
        // In utils/analytics.ts
        export const initializeAnalytics = () => {
          if (!isGaInitialized && GA_MEASUREMENT_ID && typeof window !== 'undefined') {
            // ... GA4 initialization ...
            isGaInitialized = true;
            console.log("GA4 Initialized (consent given)");
            pageview(window.location.pathname + window.location.search);

            // --- Microsoft Clarity Setup ---
            const CLARITY_TRACKING_ID = "YOUR_CLARITY_ID"; // Replace!
            if (typeof window !== "undefined" && !window.clarity && CLARITY_TRACKING_ID !== "YOUR_CLARITY_ID") {
                (function(c,l,a,r,i,t,y){
                    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", CLARITY_TRACKING_ID);
                console.log("Microsoft Clarity script initiated with ID:", CLARITY_TRACKING_ID);
            } else if (CLARITY_TRACKING_ID === "YOUR_CLARITY_ID" && typeof window !== "undefined" && window.console) {
                console.warn("Microsoft Clarity Tracking ID is not set. Please replace 'YOUR_CLARITY_ID'.");
            }
            // --- End Microsoft Clarity Setup ---
          }
        };
        ```
    *   **Alternative:** If you prefer, you can place it in `pages/_app.tsx` within the `onAccept` callback of the `<CookieConsent>` component and also in the `useEffect` hook that handles already existing consent. Ensure it's called *after* consent is confirmed.
*   `!window.clarity`: This check ensures the Clarity script isn't added multiple times if the initialization logic somehow runs more than once.

## 4. Verification

After integrating the tracking code and deploying the changes:

1.  Visit your website and interact with a few pages.
2.  Log in to your Microsoft Clarity dashboard.
3.  You should start seeing data (like new session recordings and heatmap data) appear within a few hours, sometimes sooner. Check the "Recordings" and "Heatmaps" sections for your project.

## 5. Privacy Note

Using Microsoft Clarity involves collecting data about user interactions on your website. It's important to be transparent with your users about this.

*   **Update Your Privacy Policy:** Review and update your website's privacy policy to include information about your use of Microsoft Clarity, the type of data it collects (e.g., clicks, scrolls, session replays), and how this data is used.
*   **Cookie Information:** Ensure your cookie information section also reflects the use of cookies by Microsoft Clarity if applicable.

By following these steps, you can successfully integrate Microsoft Clarity into your Next.js application while respecting user cookie consent preferences.
