// pages/portfolio-health.tsx
import Head from 'next/head';
import Layout from '@/components/layout/Layout';
import CaseStudiesPlaceholder from '@/components/sections/CaseStudiesPlaceholder';
import AssessmentToolPlaceholder from '@/components/ui/AssessmentToolPlaceholder';
import ChecklistPlaceholder from '@/components/ui/ChecklistPlaceholder';
import ScannerDemoPlaceholder from '@/components/ui/ScannerDemoPlaceholder';
import VCTestimonialsPlaceholder from '@/components/sections/VCTestimonialsPlaceholder';
import MethodologyPlaceholder from '@/components/sections/MethodologyPlaceholder';

export default function PortfolioHealthPage() {
  const openDemoModal = () => console.log('Open demo modal clicked from Portfolio Health');

  // A/B Test for Framing: true for Fear, false for Opportunity
  const useFearFraming = true; // Default to Fear Framing

  return (
    <>
      <Head>
        <title>Portfolio Health | Blindspot Detector | Pitch-it</title>
        <meta name="description" content={useFearFraming ? "Identify hidden risks your portfolio founders won't tell you about. Proactively manage your investments." : "Uncover hidden growth opportunities and strengthen your portfolio with our advanced analytics."} />
      </Head>
      <Layout onOpenDemoModal={openDemoModal}>
        <section className={`hero text-center py-12 text-white ${useFearFraming ? 'bg-red-700' : 'bg-green-700'}`}>
          {/* Fear vs Opportunity Framing A/B Test for Hero */}
          {useFearFraming ? (
            <h1 className="text-4xl font-bold">What founders won't tell you</h1>
            // Sub-headline example for Fear: "The hidden risks lurking in your portfolio that could derail your fund's performance."
          ) : (
            <h1 className="text-4xl font-bold">Uncover Hidden Growth Opportunities in Your Portfolio</h1>
            // Sub-headline example for Opportunity: "Leverage data-driven insights to identify and amplify high-potential startups in your portfolio."
          )}
           <p className="text-sm mt-2">(Currently showing: {useFearFraming ? 'Fear Framing' : 'Opportunity Framing'})</p>
        </section>

        {/* Case Study Section with A/B Test for Format */}
        <section className="case-studies-section py-10">
          <h2 className="text-2xl font-bold text-center mb-6">
            {/* Fear vs Opportunity Framing for section title */}
            {useFearFraming ? "Learning from Past Failures" : "Insights from Portfolio Analysis"}
          </h2>
          <CaseStudiesPlaceholder>
            <div className="mb-6 p-4 border rounded-lg shadow-md bg-white max-w-2xl mx-auto">
              <p className="font-medium mb-1 text-lg">Variant A: Story Format</p>
              <p className="text-gray-700">[Case Study: Startup X - Narrative of challenges, missed signals, and eventual failure. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.]</p>
            </div>
            <div className="p-4 border rounded-lg shadow-md bg-white max-w-2xl mx-auto">
              <p className="font-medium mb-1 text-lg">Variant B: Data Visualization Format</p>
              <p className="text-gray-700">[Case Study: Startup X - Key metrics dashboard showing decline (e.g., user engagement, sales pipeline conversion), burn rate vs. milestones, market misalignment chart. Placeholder for embedded data visualization or image of a chart.]</p>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">(Showing both Case Study Format variants for setup)</p>
          </CaseStudiesPlaceholder>
        </section>

        {/* Blind Spot Assessment Tool with A/B Test for Access */}
        <section className="assessment-tool-section py-10 bg-gray-100 text-center">
          <h2 className="text-2xl font-bold mb-6">
             {/* Fear vs Opportunity Framing for section title */}
            {useFearFraming ? "Identify Your Portfolio's Critical Vulnerabilities" : "Discover Untapped Potential in Your Portfolio"}
          </h2>
          <AssessmentToolPlaceholder>
            <div className="mb-4">
              <p className="font-medium mb-1 text-lg">Variant A: Free Scan</p>
              <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow hover:shadow-md transition-shadow">
                Run Free Blindspot Scan
              </button>
            </div>
            <div>
              <p className="font-medium mb-1 text-lg">Variant B: Consultation Required</p>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow hover:shadow-md transition-shadow">
                Book a Consultation
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">(Showing both Tool Access variants for setup)</p>
          </AssessmentToolPlaceholder>
        </section>
        
        <ScannerDemoPlaceholder />
        <ChecklistPlaceholder />

        {/* Trust Elements A/B Test */}
        <section className="trust-elements-section py-10 text-center">
          <h2 className="text-2xl font-bold mb-8">
            {useFearFraming ? "Why Pitch-it Is Your First Line of Defense" : "Data-Driven Insights You Can Trust"}
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto px-4">
            <div className="p-6 border rounded-lg shadow-lg bg-white">
              <p className="font-medium mb-3 text-xl text-center">Variant A: VC Testimonials</p>
              <VCTestimonialsPlaceholder />
            </div>
            <div className="p-6 border rounded-lg shadow-lg bg-white">
              <p className="font-medium mb-3 text-xl text-center">Variant B: Methodology Explanation</p>
              <MethodologyPlaceholder />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-6">(Showing both Trust Element variants for setup)</p>
        </section>

      </Layout>
    </>
  );
}
