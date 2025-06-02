import React, { useState, useEffect, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import Head from 'next/head';
import CTAButton from '@/components/ui/CTAButton';
// import IconWrapper from '@/components/ui/IconWrapper'; // Not directly used, but ValuePropositionTile uses it.
import ValuePropositionTile from '@/components/why-us/ValuePropositionTile';
import TestimonialCard from '@/components/why-us/TestimonialCard';
import FounderSpotlightCard from '@/components/why-us/FounderSpotlightCard';
// import Image from 'next/image'; // For Social Proof Logos if using next/image directly here

/**
 * WhyUsPage is a Next.js page component that outlines the mission, vision,
 * value propositions, and team behind NexTraction. It serves to build trust
 * and explain the "why" of the company.
 */
const WhyUsPage = () => {
  // State for managing the visibility of the sticky Call-To-Action bar on mobile.
  const [showStickyCTA, setShowStickyCTA] = useState(false);
  // Ref to the hero section to determine scroll position for showing/hiding sticky CTA.
  const heroRef = useRef<HTMLDivElement>(null);

  // SEO Meta Tags - TODO: SEO: Update pageUrl and ogImageUrl with final production URLs.
  const pageTitle = "Why NexTraction? Evidence-First Validation & AI-Powered Diligence";
  const pageDescription = "Discover why NexTraction is the leading platform for evidence-first startup validation and AI-powered investor diligence. Validate faster, raise smarter, and invest with clarity.";
  const pageUrl = "https://www.nextraction.com/why-us"; // Placeholder URL
  const ogImageUrl = "https://www.nextraction.com/images/og-why-us.png"; // Placeholder OG image

  // Effect to handle scroll events for showing/hiding the sticky CTA.
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        // Show sticky CTA if user has scrolled past 40% of the viewport height.
        // This threshold can be adjusted based on hero section height and desired UX.
        const scrollPosition = window.scrollY;
        const triggerPoint = window.innerHeight * 0.4;
        setShowStickyCTA(scrollPosition > triggerPoint);
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Cleanup: remove scroll listener when component unmounts.
    return () => window.removeEventListener('scroll', handleScroll);
  }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount.

  // TODO: DATA: Review all static content (mission, vision, value props, testimonials, founder bios, social proof).
  // Determine if any of this content needs to be fetched from a CMS or API in the future.
  // For now, it's hardcoded as per initial requirements.

  return (
    <Layout onOpenDemoModal={() => console.log('Open Demo Modal from Why Us Page')}>
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
        {/* TODO: SEO: Consider adding more specific meta tags like keywords, canonical URL if different. */}
      </Head>

      {/* Section 1: Hero Section */}
      {/* py-20 (80px) md:py-32 (128px) - Adheres to 8pt spacing system. */}
      <section ref={heroRef} className="hero-gradient text-white py-20 md:py-32">
        <div className="container mx-auto px-6 text-center">
          {/* mb-6 (24px), mb-10 (40px) */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in-down">
            Why NexTraction Exists
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl mb-10 max-w-2xl mx-auto animate-fade-in-up animation-delay-300">
            The bridge between bold ideas and smart capital.
          </p>
          {/* space-y-4 (16px), md:space-x-4 (16px) */}
          <div className="space-y-4 md:space-y-0 md:space-x-4 animate-fade-in-up animation-delay-600">
            <CTAButton
              text="Start For Free"
              primary
              onClick={() => console.log('WhyUs Hero: Start For Free clicked')} // TODO: ACTION: Link to signup page or open signup modal.
              data-cta-id="why-us-hero-start-free"
              className="w-full md:w-auto"
            />
            <CTAButton
              text="Book a Demo"
              secondary
              onClick={() => console.log('WhyUs Hero: Book a Demo clicked')} // TODO: ACTION: Open demo modal (already wired to Layout).
              data-cta-id="why-us-hero-book-demo"
              className="w-full md:w-auto"
            />
          </div>
        </div>
      </section>

      {/* Section 2: Mission & Vision Section */}
      {/* py-16 (64px) md:py-24 (96px), gap-12 (48px), mb-4 (16px), mb-2 (8px) */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-semibold text-gray-800 mb-4">Our Mission</h2>
              {/* TODO: CONTENT: Replace placeholder mission statement with finalized 75-word version. */}
              <p className="text-gray-600 leading-relaxed mb-2">
                NexTraction champions an evidence-first culture, infusing lean-startup rigour into every venture. We empower founders with user-driven validation tools and provide investors with AI-enhanced, grade-A diligence. Our platform bridges the gap, ensuring that groundbreaking ideas are not just born, but meticulously shaped for market success and investor confidence, reducing ambiguity and accelerating growth. We believe in transforming potential into provable value for all stakeholders.
              </p>
              <p className="text-gray-600 leading-relaxed">
                This approach ensures that every step is backed by data, fostering a transparent and efficient ecosystem.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-semibold text-gray-800 mb-4">Our Vision</h2>
              {/* TODO: CONTENT: Replace placeholder vision statement with finalized ~75-word version. */}
              <p className="text-gray-600 leading-relaxed">
                We envision a future where innovative ideas seamlessly connect with strategic capital, fueled by clarity and conviction. NexTraction aims to be the global standard for validating and funding early-stage ventures, making the journey from concept to market leader more transparent, efficient, and successful for both entrepreneurs and investors. We strive to cultivate a world where data-driven decisions unlock unprecedented technological and societal advancements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Value Proposition Tiles Section */}
      {/* py-16 (64px) md:py-24 (96px), mb-12 (48px), gap-8 (32px) */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-12">
            Unlock Your Potential
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* TODO: ICON: Provide actual icons for each ValuePropositionTile. */}
            {/* TODO: CONTENT: Verify metrics and copy for value propositions. */}
            <ValuePropositionTile
              headline="Validate Faster"
              body="Cut through the noise. Get actionable insights from real users in days, not months."
              metric="118h → 8h avg. diligence time saved"
              // iconSvg="placeholder_icon_validate.svg" // Example of how icon prop might be used
            />
            <ValuePropositionTile
              headline="Raise Smarter"
              body="Build investor-grade narratives backed by data, not just assumptions. Secure funding with confidence."
              metric="Up to 30% higher valuation"
              // iconSvg="placeholder_icon_raise.svg"
            />
            <ValuePropositionTile
              headline="Invest With Clarity"
              body="Access verified data and AI-driven diligence reports. Make informed investment decisions."
              metric="Reduce risk by 25%"
              // iconSvg="placeholder_icon_invest.svg"
            />
          </div>
        </div>
      </section>

      {/* Section 4: Founder Spotlight Section */}
      {/* py-16 (64px) md:py-24 (96px), mb-12 (48px), gap-8 (32px) */}
      <section className="py-16 md:py-24 bg-blue-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-12">Meet Our Founders</h2>
          {/* TODO: FEATURE: Implement carousel functionality if more founders are added or for better mobile UX.
              Current layout is a simple flex row that wraps. Consider `overflow-x-auto` for many items on mobile.
           */}
          <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch">
            {/* TODO: IMAGE: Replace 'placeholder' with actual image paths for founders, e.g., /images/karim.jpg.
                Ensure images are optimized and added to /public/images.
            */}
            <FounderSpotlightCard
              name="Karim Amor"
              title="Founder"
              bio="Over 30 years in deep-tech, 7 successful exits. Author of 'Renaissance Now', keynote speaker at MoroccoAI 2023, and mentor for Morocco 40-Under-40. Karim is passionate about fostering innovation through rigorous, evidence-based entrepreneurship and scaling impactful technology ventures globally, bringing a wealth of experience to NexTraction's strategic direction."
              imageSrc="placeholder" // TODO: IMAGE: Replace with /images/karim-amor.jpg (or similar)
              imageAlt="Karim Amor, Founder of NexTraction"
            />
            <FounderSpotlightCard
              name="Jad Lahrichi"
              title="Co-Founder & CEO"
              bio="Econ + CS @ University of Toronto. Former AI-automation engineer at Epineon.ai. Jad drives NexTraction's product-led growth strategy, focusing on user experience and scalable AI solutions. His expertise lies in translating complex data insights into actionable tools for founders and investors, ensuring the platform remains at the cutting edge."
              imageSrc="placeholder" // TODO: IMAGE: Replace with /images/jad-lahrichi.jpg (or similar)
              imageAlt="Jad Lahrichi, Co-Founder & CEO of NexTraction"
            />
          </div>
        </div>
      </section>

      {/* Section 5: Social Proof Band Section */}
      {/* py-12 (48px), mb-6 (24px), gap-x-8 (32px) md:gap-x-12 (48px), gap-y-4 (16px), mb-4 (16px) */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-6">
            Trusted By Leading Innovators & Investors
          </h3>
          {/* TODO: IMAGE: Replace text spans with actual grayscale logos using <Image /> component.
              Ensure logos are optimized and have appropriate alt text. Example:
              <Image src="/images/logos/endeavor.svg" alt="Endeavor Logo" width={120} height={40} />
          */}
          <div className="flex flex-wrap justify-center items-center gap-x-8 md:gap-x-12 gap-y-4 mb-4">
            <span className="text-gray-500 font-medium">Endeavor</span>
            <span className="text-gray-500 font-medium">Oxford VC Catalyst</span>
            <span className="text-gray-500 font-medium">MoroccoAI</span>
            <span className="text-gray-500 font-medium">UofT</span>
            <span className="text-gray-500 font-medium">Plug and Play</span>
          </div>
          <p className="text-gray-600 max-w-xl mx-auto">
            Trusted by founders & VCs across 12 countries. {/* TODO: CONTENT: Verify this claim/number. */}
          </p>
        </div>
      </section>

      {/* Section 6: Testimonials Grid Section */}
      {/* py-16 (64px) md:py-24 (96px), mb-12 (48px), gap-8 (32px) */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-12">
            What Our Community Says
          </h2>
          {/* TODO: DATA: Testimonial content is static. Consider if it should be fetched if it changes frequently. */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard
              quote="NexTraction's validation tools were a game-changer for our pre-seed round. We identified our target audience with precision."
              author="Amina K., Founder @ Innovatech"
              role="Founder"
            />
            <TestimonialCard
              quote="The AI-diligence reports save us countless hours. It's like having a superpower for deal sourcing and analysis."
              author="John B., Partner @ FutureCap Ventures"
              role="Venture Capitalist"
            />
            <TestimonialCard
              quote="I recommend NexTraction to all startups in our cohort. It instills a much-needed discipline of evidence-based decision making."
              author="Sarah L., Mentor @ TechStars Accelerator"
              role="Accelerator Mentor"
            />
            {/* TODO: CONTENT: Add more testimonials if available to fill out the grid or make it a carousel. */}
          </div>
        </div>
      </section>

      {/* Section 7: Call-To-Action (Sticky on Mobile, Static on Desktop) */}
      {/* Sticky CTA for mobile: p-4 (16px) */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white p-4 shadow-2xl_top transform transition-transform duration-300 ease-in-out z-40 md:hidden ${
          showStickyCTA ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <CTAButton
          text="Get Started with NexTraction"
          primary
          onClick={() => console.log('Sticky CTA: Get Started clicked')} // TODO: ACTION: Link to signup.
          className="w-full"
          data-cta-id="why-us-sticky-cta-get-started"
        />
      </div>

      {/* Static CTA for desktop: py-16 (64px), mb-6 (24px) */}
      <section className="py-16 bg-blue-600 text-white hidden md:block">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold mb-6">Ready to Transform Your Approach?</h2>
          <CTAButton
            text="Start For Free"
            onClick={() => console.log('Desktop CTA: Start for Free clicked')} // TODO: ACTION: Link to signup.
            className="bg-white text-blue-600 hover:bg-gray-100" // Custom style for this CTA
            data-cta-id="why-us-desktop-cta-start-free"
          />
        </div>
      </section>
    </Layout>
  );
};

export default WhyUsPage;
