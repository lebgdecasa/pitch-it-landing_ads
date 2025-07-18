# Comprehensive Analytics Integration

This document outlines the recent integration of a comprehensive analytics solution, including Google Analytics 4 (GA4), PostHog, and Hotjar.

## What's Been Done

I have integrated three powerful analytics tools to provide deep insights into user behavior:

- **Google Analytics 4 (GA4):** For event-based tracking of user interactions across the application.
- **PostHog:** For product analytics, including session recording, heatmaps, and feature funnels.
- **Hotjar:** For user behavior analytics, including heatmaps, session recordings, and feedback polls.

### Key Tracking Points

I have implemented tracking for a wide range of user interactions, including but not limited to:

- **Page Views:** Tracking visits to all major pages, including the homepage, auth pages, dashboard, project pages, and chat.
- **User Authentication:** Tracking user sign-ups, logins, and logouts.
- **Project Management:**
  - Project creation, opening, and deletion.
  - Interactions with the project dashboard, including opening analysis and persona modals.
- **Chat Interactions:**
  - Viewing the chat page.
  - Sending messages.
  - Viewing persona details.
- **Button Clicks:** Tracking clicks on key buttons, such as "New Project," "Chat with Personas," and more.

All events are labeled with clear and descriptive names to make them easily understandable in the respective analytics dashboards.

## What You Need to Do

To get the analytics working, you need to provide the necessary API keys and IDs in the `.env.local` file.

1. **Create a `.env.local` file** in the root of the project if you don't have one already.
2. **Add the following environment variables** to the file and replace the placeholder values with your actual credentials:

```
NEXT_PUBLIC_GA_ID='G-XXXXXXXXXX'
NEXT_PUBLIC_POSTHOG_ID='phc_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
NEXT_PUBLIC_HOTJAR_ID='0000000'
NEXT_PUBLIC_HOTJAR_SV='0'
```

- `NEXT_PUBLIC_GA_ID`: Your Google Analytics 4 Measurement ID.
- `NEXT_PUBLIC_POSTHOG_ID`: Your PostHog Project API Key.
- `NEXT_PUBLIC_HOTJAR_ID`: Your Hotjar Site ID.
- `NEXT_PUBLIC_HOTJAR_SV`: Your Hotjar Snippet Version.

## How to Access Your Analytics

Once you have configured the environment variables and deployed the application, you can access your analytics data through the respective platforms:

- **Google Analytics:**
  - Go to the [Google Analytics dashboard](https://analytics.google.com/).
  - Navigate to your property.
  - You can view real-time data, create reports, and analyze user behavior under the "Reports" and "Explore" sections.

- **PostHog:**
  - Log in to your [PostHog account](https://app.posthog.com/).
  - Select your project.
  - You can view session recordings, heatmaps, and event data in your project dashboard.

- **Hotjar:**
  - Log in to your [Hotjar account](https://www.hotjar.com/).
  - Select your site.
  - You can view heatmaps, recordings, and other user behavior analytics from the main dashboard.

By leveraging these tools, you will have a comprehensive view of how users are interacting with your application, enabling you to make data-driven decisions to improve the user experience and drive growth.
