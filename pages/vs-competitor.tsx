// pages/vs-competitor.tsx
import Head from 'next/head';
import LayoutNoNav from '@/components/layout/LayoutNoNav';
import ComparisonTablePlaceholder from '@/components/sections/ComparisonTablePlaceholder';
import SwitcherTestimonialsPlaceholder from '@/components/sections/SwitcherTestimonialsPlaceholder';
import MigrationGuidePlaceholder from '@/components/ui/MigrationGuidePlaceholder';
import SavingsCalculatorPlaceholder from '@/components/ui/SavingsCalculatorPlaceholder';
import BiasDisclaimer from '@/components/ui/BiasDisclaimer';

export default function VsCompetitorPage() {
  // A/B Test Flags
  const testimonialsAboveTable = true; // true for above, false for below/beside (simulated)
  const biasDisclaimerAtTop = true;    // true for top, false for bottom

  return (
    <>
      <Head>
        <title>Pitch-it vs Competitor X | Unfair Advantage Comparison</title>
        <meta name="description" content="See how Pitch-it stacks up against Competitor X in a detailed side-by-side feature and benefit comparison." />
      </Head>
      <LayoutNoNav>
        <section className="hero text-center py-12 bg-gray-100">
          <h1 className="text-4xl font-bold">The side-by-side comparison: Pitch-it vs Competitor X</h1>
          {biasDisclaimerAtTop && (
            <div className="mt-4">
              <BiasDisclaimer />
              <p className="text-xs text-gray-500 mt-1">(Bias Disclaimer Placement: Top)</p>
            </div>
          )}
        </section>

        {/* Testimonial Prominence A/B Test */}
        {testimonialsAboveTable && (
          <section className="testimonials-section py-10">
            <h2 className="text-2xl font-bold text-center mb-4">Why Founders Switch to Pitch-it</h2>
            <SwitcherTestimonialsPlaceholder />
            <p className="text-xs text-gray-500 mt-2 text-center">(Testimonial Placement: Above Table)</p>
          </section>
        )}

        {/* Comparison Table with A/B Test for Style */}
        <section className="comparison-table-section py-10">
          <ComparisonTablePlaceholder>
            <div className="mb-6 p-4 border rounded bg-white shadow max-w-3xl mx-auto">
              <p className="font-medium mb-1 text-lg">Table Style Variant A: Simple Checkmarks</p>
              <p className="text-gray-700">[Table: Feature | Pitch-it (✓) | Competitor X (✗) ]<br/>[Feature 2 | Pitch-it (✓) | Competitor X (✓) ]</p>
            </div>
            <div className="p-4 border rounded bg-white shadow max-w-3xl mx-auto">
              <p className="font-medium mb-1 text-lg">Table Style Variant B: Detailed Descriptions</p>
              <p className="text-gray-700">[Table: Feature | Pitch-it (Detailed benefits: lorem ipsum dolor sit amet, consectetur adipiscing elit.) | Competitor X (Detailed limitations: sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.)]<br/>[Feature 2 | Pitch-it (More details...) | Competitor X (Fewer details...)]</p>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">(Showing both Table Style variants for setup)</p>
          </ComparisonTablePlaceholder>
        </section>

        {!testimonialsAboveTable && (
          <section className="testimonials-section py-10 bg-gray-50">
            <h2 className="text-2xl font-bold text-center mb-4">Why Founders Switch to Pitch-it</h2>
            <SwitcherTestimonialsPlaceholder />
            <p className="text-xs text-gray-500 mt-2 text-center">(Testimonial Placement: Below/Beside Table - simulated)</p>
          </section>
        )}
        
        <SavingsCalculatorPlaceholder />

        {/* Migration Guide with Offer A/B Test */}
        <section className="migration-offer-section py-10 bg-blue-50 text-center">
          <h2 className="text-2xl font-bold mb-6">Ready to Make the Switch?</h2>
          <MigrationGuidePlaceholder>
            <div className="mb-4">
              <p className="font-medium mb-1 text-lg">Offer Variant A: Free Migration</p>
              <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded shadow hover:shadow-md transition-shadow">
                Get Free Migration Support
              </button>
            </div>
            <div>
              <p className="font-medium mb-1 text-lg">Offer Variant B: 30-Day Trial</p>
              <button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded shadow hover:shadow-md transition-shadow">
                Start 30-Day Free Trial
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">(Showing both Offer variants for setup)</p>
          </MigrationGuidePlaceholder>
        </section>

        {!biasDisclaimerAtTop && (
          <section className="py-6 text-center">
            <BiasDisclaimer />
            <p className="text-xs text-gray-500 mt-1">(Bias Disclaimer Placement: Bottom)</p>
          </section>
        )}

      </LayoutNoNav>
    </>
  );
}
