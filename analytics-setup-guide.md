# Analytics Setup Guide for NexVC

## 1. Google Analytics 4 Setup

### Create GA4 Property
1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new property for your NexVC project
3. Get your Measurement ID (format: G-XXXXXXXXXX)

### Configure Environment Variables
Create `.env.local` file in your project root:
```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Install Required Dependencies
```bash
npm install web-vitals
```

## 2. What's Being Tracked

### Page Views
- Every page navigation
- UTM parameters from social media campaigns

### User Engagement
- Button clicks (with location context)
- Form submissions (waitlist/demo)
- Scroll depth (25%, 50%, 75%, 100%)
- Time on page (every 30 seconds)
- Language preference changes

### Conversions
- Waitlist signups
- Demo requests
- Attribution to UTM source

### Performance Metrics
- Core Web Vitals (LCP, FID, CLS, etc.)

### Feature Interest
- Which features users click to learn more about
- Navigation patterns

## 3. UTM Parameter Usage

When sharing on social media, use UTM parameters:
```
https://NexVC-landing-updated.vercel.app/?utm_source=linkedin&utm_medium=post&utm_campaign=launch_week
```

Common parameters:
- `utm_source`: Platform (linkedin, twitter, facebook)
- `utm_medium`: Type (post, story, ad, email)
- `utm_campaign`: Campaign name (launch_week, product_update)
- `utm_content`: Specific content variant (cta_button, hero_image)

## 4. Viewing Analytics Data

In Google Analytics 4:
- **Realtime**: See live user activity
- **Engagement > Events**: View all custom events
- **Acquisition**: See traffic sources and UTM campaigns
- **Conversions**: Track waitlist and demo signups

### Key Reports to Monitor
1. **User Acquisition**: Where users come from
2. **Event Count by Event Name**: Most engaged features
3. **Conversion Rate**: By source/medium
4. **Scroll Depth**: Content engagement
5. **Form Submissions**: Success vs failure rates

## 5. Testing Analytics

### Debug Mode
In browser console:
```javascript
// Check if GA is loaded
window.gtag

// Test event tracking
gtag('event', 'test_event', {
  event_category: 'debug',
  event_label: 'test'
});
```

### Chrome Extension
Install [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna) to see events in console.

## 6. Database Schema Updates

Both `WaitlistEntry` and `DemoRequest` models now store:
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_term`
- `utm_content`

This allows you to analyze conversion quality by traffic source.

## 7. Next Steps

1. Set up Goals in GA4 for conversions
2. Create custom audiences for retargeting
3. Set up weekly email reports
4. Connect to Google Ads for remarketing
5. Consider adding:
   - Hotjar for heatmaps
   - Segment for data warehousing
   - Mixpanel for product analytics

## 8. Privacy Compliance

Remember to update your privacy policy to mention:
- Google Analytics usage
- Cookie usage for analytics
- Data retention policies
- User rights (opt-out options)
