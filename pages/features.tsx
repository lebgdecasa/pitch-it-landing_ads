import React from 'react';
import Layout from '@/components/layout/Layout';
import Head from 'next/head';
import CTAButton from '@/components/ui/CTAButton';
// import IconWrapper from '@/components/ui/IconWrapper'; // Not directly used, but AccordionItem uses it.
import AccordionItem from '@/components/features/AccordionItem';
import FeatureWorkflowStep from '@/components/features/FeatureWorkflowStep';
import AnimatedCounter from '@/components/features/AnimatedCounter';

// TODO: DATA: Feature content (titles, descriptions, bullets, icons) is currently static.
// Determine if this data needs to be fetched from a CMS or API for easier updates.
const featureItems = [
  {
    iconSvg: undefined, // TODO: ICON: Replace undefined with actual SVG string or path for "Trend Crawler" icon.
    title: "Trend Crawler & Netnography",
    content: "Our AI diligently scans vast datasets, including news, social media, academic papers, and patent filings. It maps emerging trends, quantifies sentiment, and identifies underserved niches, giving you a head start on innovation. This isn't just data; it's foresight.",
    bullets: ["Real-time market signal detection", "Competitor activity monitoring", "Early adoption curve prediction", "Geographic opportunity mapping"],
  },
  {
    iconSvg: undefined, // TODO: ICON: Replace undefined with actual SVG string or path for "Real-World Pulse" icon.
    title: "Real-World Pulse",
    content: "Validate your hypotheses directly with your target audience. Our integrated survey engine connects you with vetted panels of consumers or B2B professionals. Get robust feedback on concepts, pricing, and messaging within 72-96 hours. No more guessing games.",
    bullets: ["Custom survey design", "Access to diverse demographic panels", "Rapid feedback loop (72-96h)", "Quantitative & qualitative insights"],
  },
   {
    iconSvg: undefined, // TODO: ICON: Replace undefined with actual SVG string or path for "Buyer Persona Generator" icon.
    title: "Buyer Persona Generator",
    content: "Move beyond static persona documents. Our AI crafts interactive, dynamic buyer personas based on your research and our data. Test messaging, simulate objections, and refine your value proposition against these realistic customer archetypes.",
    bullets: ["AI-generated personas", "Interactive Q&A", "Messaging stress-testing", "Evolves with new data"],
  },
  {
    iconSvg: undefined, // TODO: ICON: Replace undefined with actual SVG string or path for "AI/Manual Deck Builder" icon.
    title: "AI/Manual Deck Builder",
    content: "Generate investor-grade pitch decks in minutes with our AI-assisted builder, or take full control with manual editing. Our templates are based on proven narrative structures that resonate with VCs, ensuring your story is compelling and your data is clear.",
    bullets: ["AI-assisted content generation", "VC-approved templates", "Collaborative editing", "Brand customization"],
  },
  {
    iconSvg: undefined, // TODO: ICON: Replace undefined with actual SVG string or path for "Virtual VC" icon.
    title: "Virtual VC",
    content: "Practice your pitch against an AI-powered Virtual VC. Get instant feedback on your delivery, clarity, responses to tough questions, and overall persuasiveness. Our system analyzes your performance and provides actionable analytics to help you hone your pitch to perfection.",
    bullets: ["AI pitch simulation", "Performance analytics", "Objection handling practice", "Confidence building"],
  },
  {
    iconSvg: undefined, // TODO: ICON: Replace undefined with actual SVG string or path for "Insights Panel" icon.
    title: "Insights Panel",
    content: "Consolidate your key validation metrics in one clear dashboard. Track red/green signals on critical factors like Customer Acquisition Cost (CAC) viability, Total Addressable Market (TAM) penetration, and Customer Lifetime Value (CLTV) projections. Make data-driven pivots.",
    bullets: ["Key metric tracking (CAC, TAM, CLTV)", "Red/Green signal indicators", "Scenario modeling", "Investor-ready reporting"],
  },
  {
    iconSvg: undefined, // TODO: ICON: Replace undefined with actual SVG string or path for "Document Hub" icon.
    title: "Document Hub",
    content: "A secure, centralized vault for all your critical research, validation evidence, financial models, and legal documents. Share selectively with investors and collaborators, maintaining version control and audit trails. Your single source of truth.",
    bullets: ["Secure cloud storage", "Version control", "Selective sharing permissions", "Evidence locker"],
  },
  {
    iconSvg: undefined, // TODO: ICON: Replace undefined with actual SVG string or path for "Road-Mapped Extras" icon.
    title: "Road-Mapped Extras",
    content: "We're constantly evolving. Upcoming features include advanced portfolio dashboards for investors, team role management for collaborative ventures, and API hooks for seamless integration with your existing toolstack. Your success is our roadmap.",
    bullets: ["Portfolio management tools (for VCs)", "Team collaboration features", "API & Integrations", "Continuous improvement"],
  }
  // TODO: CONTENT: Review and add more features as they become available or defined.
];

// TODO: DATA: FAQ content is currently static. Determine if this data needs to be fetched from a CMS or API.
const faqItems = [
  { iconSvg: undefined, title: "What is the pricing model for NexTraction?", content: "NexTraction offers tiered subscription plans for founders and custom packages for VCs and accelerators. We have a free tier for basic exploration. Detailed pricing is available upon requesting a demo or signing up.", bullets: ["Free tier available", "Founder-focused subscriptions", "VC/Accelerator packages"] },
  { iconSvg: undefined, title: "How does NexTraction integrate with other tools?", content: "We are building out API hooks and native integrations for popular tools like CRMs, analytics platforms, and communication suites. Our goal is to fit seamlessly into your existing workflow. (Details on specific integrations will be on our roadmap)", bullets: ["API access planned", "Common CRM integrations coming", "Data export options"] },
  { iconSvg: undefined, title: "How is my data protected?", content: "Data security is paramount. All data is encrypted at rest and in transit. We are SOC-2 Type II roadmap and GDPR-ready. You control who sees your sensitive information through granular permissions in the Document Hub.", bullets: ["Encryption at rest & in transit", "SOC-2 Type II in progress", "GDPR compliant"] },
  { iconSvg: undefined, title: "What kind of support can I expect?", content: "All paid plans include email and chat support. Enterprise clients receive a dedicated account manager. We also have an extensive knowledge base and community forum for peer-to-peer assistance.", bullets: ["Email & Chat support", "Knowledge base", "Dedicated account managers for enterprise"] },
  { iconSvg: undefined, title: "What's on the product roadmap?", content: "Beyond the 'Road-Mapped Extras' feature, we are exploring advanced AI for predictive analytics, deeper workflow automation, and enhanced global market intelligence. User feedback heavily influences our priorities.", bullets: ["User-driven development", "Advanced predictive AI", "Workflow automation"] },
  // TODO: ICON: Add icons for FAQ items if design requires it (AccordionItem supports iconSvg).
  // TODO: CONTENT: Add more FAQs as they become relevant.
];

/**
 * FeaturesPage is a Next.js page component that showcases the various features
 * of the NexTraction platform. It includes sections for a hero, feature details (accordion),
 * workflow visualization, demo CTA, security info, performance stats, and FAQs.
 */
const FeaturesPage = () => {
  // SEO Meta Tags - TODO: SEO: Update pageUrl and ogImageUrl with final production URLs.
  const pageTitle = "NexTraction Features | Complete Platform for Founders & Investors";
  const pageDescription = "Explore NexTraction's AI-powered features: Trend Crawler, Real-World Pulse surveys, Buyer Persona Generator, Deck Builder, Virtual VC, Insights Panel, and more. Validate, build, and invest with confidence.";
  const pageUrl = "https://www.nextraction.com/features"; // Placeholder URL
  const ogImageUrl = "https://www.nextraction.com/images/og-features.png"; // Placeholder OG image

  return (
    <Layout onOpenDemoModal={() => console.log('Open Demo Modal from Features Page')}>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={ogImageUrl} />
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={pageUrl} />
        <meta property="twitter:title" content={pageTitle} />
        <meta property="twitter:description" content={pageDescription} />
        <meta property="twitter:image" content={ogImageUrl} />
        {/* TODO: SEO: Consider adding more specific meta tags like keywords. */}
      </Head>

      {/* Section 1: Hero Section */}
      {/* py-20 (80px) md:py-28 (112px), mb-6 (24px), space-y-2 (8px) - Adheres to 8pt spacing system. */}
      <section className="bg-gray-100 py-20 md:py-28">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6">
            A Complete Platform for Founders & Investors
          </h1>
          {/* TODO: CONTENT: Pull hero list items from actual landing page copy once finalized. */}
          <ul className="text-lg md:text-xl text-gray-600 space-y-2 max-w-2xl mx-auto">
            <li>✓ Validate ideas with AI-driven market intelligence.</li>
            <li>✓ Build compelling, data-backed pitch decks effortlessly.</li>
            <li>✓ Make smarter investment decisions with transparent diligence.</li>
          </ul>
        </div>
      </section>

      {/* Section 2: Feature Accordion Section */}
      {/* py-16 (64px) md:py-24 (96px), mb-12 (48px) */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-semibold text-center text-gray-800 mb-12">
            Dive Into the NexTraction Toolkit
          </h2>
          <div className="max-w-3xl mx-auto">
            {featureItems.map((item, index) => (
              <AccordionItem
                key={index}
                iconSvg={item.iconSvg} // Individual TODOs for icons are in the featureItems array.
                title={item.title}
                content={item.content}
                bullets={item.bullets}
                initiallyOpen={index === 0} // Open the first feature item by default.
              />
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Visual Timeline / Swipe Scroller Section */}
      {/* py-16 (64px) md:py-24 (96px), mb-12 (48px), space-x-6 (24px), pb-4 (16px), gap-6 (24px) */}
      <section className="py-16 md:py-24 bg-blue-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-semibold text-center text-gray-800 mb-12">
            Your Workflow, Elevated
          </h2>
          {/* TODO: CONTENT: Replace placeholder step content with finalized copy if different. */}
          {/* TODO: ICON: Consider adding icons to FeatureWorkflowStep if design evolves. */}
          {/* Mobile: Horizontal Swipe Scroller */}
          <div className="md:hidden">
            <div className="flex overflow-x-auto space-x-6 pb-4 snap-x snap-mandatory">
              <FeatureWorkflowStep stepNumber="01" title="Discover Trends" description="AI scans global data to pinpoint market opportunities." />
              <FeatureWorkflowStep stepNumber="02" title="Validate Demand" description="Test concepts with real-world survey panels quickly." />
              <FeatureWorkflowStep stepNumber="03" title="Craft Personas" description="Generate interactive buyer profiles for messaging." />
              <FeatureWorkflowStep stepNumber="04" title="Build Your Deck" description="AI-assisted creation of investor-grade narratives." />
              <FeatureWorkflowStep stepNumber="05" title="Pitch & Analyze" description="Simulate VC pitches and refine your delivery." />
            </div>
          </div>
          {/* Desktop: Visual Timeline (Simplified Grid) */}
          {/* TODO: DESIGN: For Desktop, consider adding visual connectors (lines/arrows) between steps if desired. */}
          <div className="hidden md:grid md:grid-cols-5 gap-6 items-start">
            <FeatureWorkflowStep stepNumber="01" title="Discover Trends" description="AI scans global data to pinpoint market opportunities." />
            <FeatureWorkflowStep stepNumber="02" title="Validate Demand" description="Test concepts with real-world survey panels quickly." />
            <FeatureWorkflowStep stepNumber="03" title="Craft Personas" description="Generate interactive buyer profiles for messaging." />
            <FeatureWorkflowStep stepNumber="04" title="Build Your Deck" description="AI-assisted creation of investor-grade narratives." />
            <FeatureWorkflowStep stepNumber="05" title="Pitch & Analyze" description="Simulate VC pitches and refine your delivery." />
          </div>
        </div>
      </section>

      {/* Section 4: Interactive Demo CTA Section */}
      {/* py-16 (64px), p-8 (32px) md:p-12 (48px), mb-4 (16px), mb-8 (32px) */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 md:p-12 rounded-xl shadow-2xl text-center text-white max-w-3xl mx-auto">
            <h2 className="text-3xl font-semibold mb-4">Experience NexTraction Firsthand</h2>
            <p className="text-lg mb-8">
              See how our platform can transform your validation and pitching process.
            </p>
            <CTAButton
              text="Try Live Demo"
              onClick={() => {
                console.log('Try Live Demo clicked on Features page');
                // TODO: ACTION: Implement actual navigation to /demo page or open a specific demo modal.
                // Example: window.location.href = '/demo?feature=trend_crawler';
                // Or use Next Router: router.push('/demo?feature=trend_crawler');
              }}
              className="bg-white text-blue-700 hover:bg-gray-100 text-lg py-3 px-8" // py-3 (12px), px-8 (32px)
              data-cta-id="features-interactive-demo"
            />
          </div>
        </div>
      </section>

      {/* Section 5: Security & Compliance Section */}
      {/* py-16 (64px) md:py-24 (96px), mb-6 (24px), space-y-3 (12px) */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-6 text-center md:text-left">
          {/* TODO: CONTENT: Review security claims and ensure they are accurate and up-to-date. */}
          <div className="max-w-2xl mx-auto md:mx-0">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">Security You Can Trust</h2>
            <ul className="space-y-3 text-gray-600 list-none md:list-disc md:list-inside">
              <li><span className="font-semibold text-gray-700">SOC-2 Type II Roadmap:</span> Committed to the highest security standards.</li>
              <li><span className="font-semibold text-gray-700">Encrypted At Rest & In Transit:</span> Your data is protected at all stages.</li>
              <li><span className="font-semibold text-gray-700">GDPR-Ready:</span> Full compliance with data privacy regulations.</li>
              <li><span className="font-semibold text-gray-700">Secure Document Hub:</span> Granular control over your sensitive information.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section 6: Performance Stats Section */}
      {/* py-16 (64px) md:py-24 (96px), mb-12 (48px), gap-8 (32px) */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-semibold text-center text-gray-800 mb-12">
            Proven Impact
          </h2>
          {/* TODO: DATA: Verify source for all performance statistics.
              The "Reduction in Diligence Time" stat of 75% here differs from the "118h -> 8h" (~93%)
              on the Why Us page. Clarify if these are different metrics or need alignment.
          */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <AnimatedCounter targetValue={0.84} suffix="%+" label="Avg. Pitch Deck CTR Uplift" />
            <AnimatedCounter targetValue={6} suffix="%+" label="Typical Landing Page CVR" />
            <AnimatedCounter targetValue={75} suffix="%" label="Reduction in Diligence Time" />
          </div>
        </div>
      </section>

      {/* Section 7: FAQ Accordion Section */}
      {/* py-16 (64px) md:py-24 (96px), mb-12 (48px) */}
      <section className="py-16 md:py-24 bg-gray-100">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-semibold text-center text-gray-800 mb-12">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto">
            {faqItems.map((item, index) => (
              <AccordionItem
                key={index}
                iconSvg={item.iconSvg} // Placeholder, defined in faqItems array
                title={item.title}
                content={item.content}
                bullets={item.bullets}
                // FAQs are closed by default unless `initiallyOpen` is set in `faqItems`.
              />
            ))}
          </div>
        </div>
      </section>

      {/* Section 8: Final CTA Band Section */}
      {/* py-16 (64px) md:py-24 (96px), mb-6 (24px), mb-8 (32px) */}
      <section className="py-16 md:py-24 bg-blue-700 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6">Ready to Build the Future?</h2>
          <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-xl mx-auto">
            Join NexTraction and gain the clarity and tools you need to succeed.
          </p>
          <CTAButton
            text="Start For Free"
            onClick={() => console.log('Features Page Final CTA: Start for Free clicked')} // TODO: ACTION: Link to signup page.
            className="bg-white text-blue-700 hover:bg-gray-100 text-lg py-3 px-8" // py-3 (12px), px-8 (32px)
            data-cta-id="features-final-cta-start-free"
          />
        </div>
      </section>
    </Layout>
  );
};

export default FeaturesPage;
