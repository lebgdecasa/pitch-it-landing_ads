// pages/vc-toolkit.tsx
import Head from 'next/head';
import Layout from '@/components/layout/Layout'; // Using the main layout
import DataVizPlaceholder from '@/components/ui/DataVizPlaceholder';
import ROICalculatorPlaceholder from '@/components/ui/ROICalculatorPlaceholder';
import SampleReportPlaceholder from '@/components/ui/SampleReportPlaceholder';
import IntegrationsPlaceholder from '@/components/ui/IntegrationsPlaceholder';
import LogoBar from '@/components/ui/LogoBar'; // Reusable

export default function VCToolkitPage() {
  const openDemoModal = () => {
    // Placeholder for now, or connect to actual demo modal if needed
    console.log('Open demo modal clicked from VC Toolkit');
  };

  return (
    <>
      <Head>
        <title>VC Toolkit | Due Diligence Accelerator | Pitch-it</title>
        <meta name="description" content="Accelerate your due diligence with AI-powered tools, interactive visualizations, and ROI calculators for VCs." />
      </Head>
      <Layout onOpenDemoModal={openDemoModal}>
        <section className="hero text-center py-12 bg-gray-800 text-white">
          <h1 className="text-4xl font-bold">From deck to decision in minutes</h1>
        </section>

        <DataVizPlaceholder />

        <section className="roi-calculator-section py-10 text-center bg-gray-50">
          <h2 className="text-2xl font-semibold mb-6">ROI Calculator for Fund Performance</h2>
          <ROICalculatorPlaceholder />
          {/* Calculator Inputs A/B Test */}
          <div className="mt-6 max-w-lg mx-auto">
            <div className="mb-4 p-4 bg-white rounded-lg shadow">
              <p className="font-medium text-lg mb-1">Variant A: Simple Inputs</p>
              <p className="text-sm text-gray-600">[Simple Inputs: Fund Size, Avg. Investment]</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow">
              <p className="font-medium text-lg mb-1">Variant B: Detailed Inputs</p>
              <p className="text-sm text-gray-600">[Detailed Inputs: Fund Size, Avg. Investment, Time Saved per DD, Team Size, etc.]</p>
            </div>
            <p className="text-xs text-gray-500 mt-2">(Showing both Calculator Input variants for setup)</p>
          </div>
        </section>

        <SampleReportPlaceholder />

        {/* Lead Magnet A/B Test */}
        <section className="lead-magnet-section py-10 bg-blue-50 text-center">
          <h3 className="text-xl font-semibold mb-4">Get Valuable Resources</h3>
          <div className="inline-block mx-3">
            <p className="font-medium mb-1">Variant A: Free Scorecard Template</p>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-md hover:shadow-lg transition-shadow">
              Download Free Scorecard Template
            </button>
          </div>
          <div className="inline-block mx-3 mt-4 md:mt-0">
            <p className="font-medium mb-1">Variant B: Sample Report</p>
            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded shadow-md hover:shadow-lg transition-shadow">
              Download Sample Report
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-3">(Showing both Lead Magnet variants for setup)</p>
        </section>

        {/* Proof Points A/B Test */}
        <section className="proof-points-section py-10 text-center">
          <h3 className="text-xl font-semibold mb-6">Trusted by Leading VCs</h3>
           <div className="mb-6 p-4 bg-white rounded-lg shadow inline-block mx-auto max-w-md">
            <p className="font-medium mb-2 text-lg">Variant A: Portfolio Company Logos</p>
            <LogoBar /> {/* Assuming LogoBar can be used for VC logos too */}
          </div>
          <div className="mt-4 md:mt-0 p-4 bg-white rounded-lg shadow inline-block mx-auto max-w-md">
            <p className="font-medium mb-2 text-lg">Variant B: Performance Stats</p>
            <p className="text-md p-2 text-gray-700">[Key Performance Stats: e.g., 30% Faster DD, 15% Improved Deal Flow Quality]</p>
          </div>
          <p className="text-sm text-gray-500 mt-4">(Showing both Proof Point variants for setup)</p>
        </section>

        <IntegrationsPlaceholder />

        {/* CTA A/B Test */}
        <section className="cta-section py-12 bg-gray-800 text-white text-center">
          <h2 className="text-2xl font-semibold mb-6">Ready to Accelerate Your Due Diligence?</h2>
          <div className="inline-block mx-3">
            <button className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow text-lg">
              Get Scorecard {/* Variant A */}
            </button>
          </div>
          <div className="inline-block mx-3 mt-4 md:mt-0">
            <button className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow text-lg">
              Book Platform Tour {/* Variant B */}
            </button>
          </div>
          <p className="text-sm text-gray-400 mt-4">(Showing both CTA variants for setup)</p>
        </section>

      </Layout>
    </>
  );
}
