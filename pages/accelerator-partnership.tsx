// pages/accelerator-partnership.tsx
import Head from 'next/head';
import Layout from '@/components/layout/Layout';
import CohortSuccessMetricsPlaceholder from '@/components/ui/CohortSuccessMetricsPlaceholder';
import WhiteLabelOptionsPlaceholder from '@/components/ui/WhiteLabelOptionsPlaceholder';
import VolumePricingCalculatorPlaceholder from '@/components/ui/VolumePricingCalculatorPlaceholder';
import ImplementationTimelinePlaceholder from '@/components/ui/ImplementationTimelinePlaceholder';
import PartnershipLevelsPlaceholder from '@/components/sections/PartnershipLevelsPlaceholder';
import LogoBar from '@/components/ui/LogoBar';
import AcceleratorCaseStudiesPlaceholder from '@/components/sections/AcceleratorCaseStudiesPlaceholder';

export default function AcceleratorPartnershipPage() {
  const openDemoModal = () => console.log('Open demo modal from Accelerator Partnership');

  return (
    <>
      <Head>
        <title>Accelerator Partnerships | De-Risk Your Cohorts | Pitch-it</title>
        <meta name="description" content="Partner with Pitch-it to provide your accelerator cohort with leading tools for validation, pitch practice, and investment readiness." />
      </Head>
      <Layout onOpenDemoModal={openDemoModal}>
        <section className="hero text-center py-12 bg-indigo-700 text-white">
          <h1 className="text-4xl font-bold">How top accelerators de-risk their cohorts</h1>
        </section>

        {/* Cohort Success Metrics with A/B Test for Metrics Shown */}
        <section className="metrics-section py-10">
          <h2 className="text-2xl font-bold text-center mb-6">Impact on Cohort Success</h2>
          <CohortSuccessMetricsPlaceholder>
            <div className="max-w-2xl mx-auto text-center">
              <div className="mb-4 p-3 bg-gray-100 rounded">
                <p className="font-medium">Variant A: Success Rates Shown</p>
                <p>[Success Rates: 70% of startups in partnered cohorts achieved key milestones faster.]</p>
              </div>
              <div className="p-3 bg-gray-100 rounded">
                <p className="font-medium">Variant B: Time Saved Shown</p>
                <p>[Time Saved: Partner accelerators reported an average of 20 hours saved per startup in mentorship and review time.]</p>
              </div>
              <p className="text-xs text-gray-500 mt-1">(Showing both Metrics Shown variants for setup)</p>
            </div>
          </CohortSuccessMetricsPlaceholder>
        </section>

        {/* Proof Format A/B Test */}
        <section className="proof-format-section py-10 bg-gray-50 text-center">
          <h2 className="text-2xl font-bold mb-6">Our Accelerator Partners & Success Stories</h2>
          <div className="mb-8">
            <p className="font-medium text-xl mb-2">Variant A: Logo Grid</p>
            <div className="p-4 bg-white rounded shadow inline-block">
              <h3 className="text-lg font-semibold mb-2">Our Accelerator Partners</h3>
              <LogoBar />
            </div>
          </div>
          <div>
            <p className="font-medium text-xl mb-2">Variant B: Detailed Case Studies</p>
            <AcceleratorCaseStudiesPlaceholder />
          </div>
          <p className="text-sm text-gray-500 mt-4">(Showing both Proof Format variants for setup)</p>
        </section>
        
        <WhiteLabelOptionsPlaceholder />
        
        {/* Partnership Levels A/B Test */}
        <section className="partnership-levels-section py-10">
          <h2 className="text-2xl font-bold text-center mb-6">Flexible Partnership Structures</h2>
          <PartnershipLevelsPlaceholder>
             <div className="max-w-2xl mx-auto text-center">
              <div className="mb-4 p-3 bg-indigo-50 rounded">
                <p className="font-medium">Variant A: Tiered Options</p>
                <p>[Tiered Options: Basic (Tools Access), Pro (Tools + Workshops), Enterprise (White-Label + Dedicated Support)]</p>
              </div>
              <div className="p-3 bg-indigo-50 rounded">
                <p className="font-medium">Variant B: Custom Only</p>
                <p>[Partnership Levels: We offer fully customized partnership packages tailored to your accelerator's unique program and needs.]</p>
              </div>
              <p className="text-xs text-gray-500 mt-1">(Showing both Partnership Level variants for setup)</p>
            </div>
          </PartnershipLevelsPlaceholder>
        </section>

        <VolumePricingCalculatorPlaceholder />
        <ImplementationTimelinePlaceholder />

        {/* Lead Approach A/B Test */}
        <section className="lead-approach-section py-12 bg-gray-100 text-center">
          <h2 className="text-2xl font-semibold mb-4">Let's Collaborate</h2>
          <div className="inline-block mx-2">
            <p className="font-medium mb-1">Variant A: Book Meeting</p>
            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded">
              Book a Partnership Meeting
            </button>
          </div>
          <div className="inline-block mx-2 mt-4 md:mt-0">
            <p className="font-medium mb-1">Variant B: Download Guide</p>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded">
              Download Partnership Guide
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-2">(Showing both Lead Approach variants for setup)</p>
        </section>

      </Layout>
    </>
  );
}
