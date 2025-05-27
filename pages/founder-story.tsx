// pages/founder-story.tsx
import Head from 'next/head';
import LayoutNoNav from '@/components/layout/LayoutNoNav';
import VideoPlaceholder from '@/components/ui/VideoPlaceholder';
import CostCalculatorPlaceholder from '@/components/ui/CostCalculatorPlaceholder';
import PivotComparisonPlaceholder from '@/components/sections/PivotComparisonPlaceholder';
import TrustBadgesPlaceholder from '@/components/ui/TrustBadgesPlaceholder';

export default function FounderStoryPage() {
  // Variable to control video placement for A/B test
  const videoAboveFold = true; // Set to false for 'after problem statement'

  return (
    <>
      <Head>
        <title>Founder Story | Avoid Building the Wrong Thing | Pitch-it</title>
        <meta name="description" content="Learn from a founder's story about the risks of building without validation and how to prevent pivots." />
      </Head>
      <LayoutNoNav>
        <section className="hero bg-gray-100 py-12 text-center">
          <h1 className="text-4xl font-bold">I learned the hard way...</h1>
          {videoAboveFold && (
            <div className="mt-6">
              {/* Testimonial Format A/B Test (Video Variant as part of Video Placement A) */}
              {/* Variant A: Video Testimonial */}
              <VideoPlaceholder />
              <p className="text-sm text-gray-500 mt-1">(Video Placement: Above Fold)</p>
              {/* Variant B: Written Case Study (if video is not the primary testimonial format here) */}
              {/* <div className="mt-4 p-4 bg-white shadow-md rounded">[Written Case Study Placeholder for Above Fold]</div> */}
            </div>
          )}
        </section>

        <section className="problem-statement py-10 px-4 md:px-0">
          <h2 className="text-2xl font-semibold text-center mb-4">The Cost of Building Blind</h2>
          <p className="text-lg text-center max-w-2xl mx-auto mb-6">
            Building a product without validating your core assumptions can lead to wasted time, money, and effort. Many founders... (placeholder problem statement)
          </p>
          {!videoAboveFold && (
            <div className="mt-6">
              {/* Testimonial Format A/B Test (Video Variant as part of Video Placement B) */}
              {/* Variant A: Video Testimonial */}
              <VideoPlaceholder />
              <p className="text-sm text-gray-500 mt-1">(Video Placement: After Problem Statement)</p>
              {/* Variant B: Written Case Study (if video is not the primary testimonial format here) */}
              {/* <div className="mt-4 p-4 bg-white shadow-md rounded">[Written Case Study Placeholder for After Problem Statement]</div> */}
            </div>
          )}
        </section>

        {/* Testimonial Format A/B Test (Separate section if not tied to video placement) */}
        <section className="testimonial-format-section py-10 bg-gray-50 text-center">
            <h3 className="text-xl font-semibold mb-3">Testimonial Format A/B Test</h3>
            <div className="inline-block mx-2 p-4 border rounded align-top">
                <p className="font-medium mb-1">Variant A: Video Testimonial</p>
                <VideoPlaceholder />
            </div>
            <div className="inline-block mx-2 p-4 border rounded align-top">
                <p className="font-medium mb-1">Variant B: Written Case Study</p>
                <div className="p-4 bg-white shadow-md rounded min-h-[100px] flex items-center justify-center">[Written Case Study Placeholder]</div>
            </div>
             <p className="text-sm text-gray-500 mt-2">(Showing both Testimonial Format variants for setup)</p>
        </section>

        <PivotComparisonPlaceholder />

        <section className="calculator-section py-10 text-center">
          <h2 className="text-2xl font-semibold mb-4">How much could you save?</h2>
          {/* Calculator Style A/B Test */}
          <div className="mb-6">
            <p className="font-medium mb-1">Variant A: Interactive Slider</p>
            <div className="p-4 border rounded max-w-md mx-auto min-h-[100px] flex items-center justify-center">[Interactive Slider Calculator Placeholder]</div>
          </div>
          <div className="mb-6">
            <p className="font-medium mb-1">Variant B: Simple Form</p>
            <div className="p-4 border rounded max-w-md mx-auto min-h-[100px] flex items-center justify-center">[Simple Form Calculator Placeholder]</div>
          </div>
          <p className="text-sm text-gray-500 mt-2 mb-4">(Showing both Calculator Style variants for setup)</p>
          <CostCalculatorPlaceholder /> {/* This is the generic component, A/B variants are separate divs for now */}
        </section>

        <TrustBadgesPlaceholder />

        <section className="cta-section py-12 text-center bg-gray-100">
          {/* CTA A/B Test */}
          <div>
            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-3 px-6 rounded mr-2">
              Avoid My Mistake {/* Variant A */}
            </button>
            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded">
              Start Smart {/* Variant B */}
            </button>
            <p className="text-sm text-gray-500 mt-2">(Showing both CTA variants for setup)</p>
          </div>
        </section>
      </LayoutNoNav>
    </>
  );
}
