import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Modal from '@/components/ui/Modal';
import DemoModal from '@/components/modals/DemoModal';
import SEO from '@/components/SEO';
import { trackButtonClick, trackTimeOnPage, trackFeatureInterest } from '@/utils/analytics';

export default function VCToolkitPage() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('time-saved');
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);
  const [roiInputs, setRoiInputs] = useState({
    dealsPerMonth: 50,
    hoursPerDeal: 4,
    teamSize: 3
  });
  const router = useRouter();

  // Track page view
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      if (timeSpent % 30 === 0) {
        trackTimeOnPage(timeSpent);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleCTAClick = (testVariant: string) => {
    trackButtonClick(`vc_toolkit_cta_${testVariant}`, 'hero');
    setIsDemoModalOpen(true);
  };

  const handleFeatureHover = (feature: string) => {
    setHoveredFeature(feature);
    trackFeatureInterest(`vc_toolkit_${feature}`);
  };

  // ROI Calculations
  const timeSavedPerDeal = 3.2; // hours
  const totalTimeSaved = roiInputs.dealsPerMonth * timeSavedPerDeal * roiInputs.teamSize;
  const hourlyRate = 250; // VC associate hourly rate estimate
  const monthlySavings = totalTimeSaved * hourlyRate;

  return (
    <>
      <SEO
        title="From Deck to Decision in Minutes | VC Toolkit - NexVC"
        description="See market sentiment scores, buyer intent signals, and blind spots in minutes. Built for VCs. Join 50+ funds streamlining due diligence."
        keywords={['VC tools', 'due diligence software', 'startup evaluation', 'investment analysis']}
        noindex={false}
      />

      <Head>
        <meta name="robots" content="index, follow" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Navigation Bar - Professional Look for VCs */}
        <nav className="bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <img src="/images/logo_nexvc.png" alt="NexVC" className="h-8 mr-2" />
                <span className="font-bold text-xl text-gray-900">NexVC</span>
                <span className="ml-2 text-sm text-gray-500">for VCs</span>
              </div>
              <button
                onClick={() => handleCTAClick('nav_scorecard')}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                Get Scorecard
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="py-12 md:py-20 px-4 md:px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left Column - Copy */}
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 leading-tight">
                  From Deck to Decision<br />
                  in <span className="text-green-600">Minutes</span>
                </h1>

                <p className="text-xl text-gray-700 mb-8">
                  See market sentiment scores, buyer intent signals, and blind spots in minutes. Built for VCs.
                </p>

                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-gray-900">85%</p>
                    <p className="text-sm text-gray-600">Time Reduction</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-gray-900">3x</p>
                    <p className="text-sm text-gray-600">More Deals Reviewed</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-gray-900">92%</p>
                    <p className="text-sm text-gray-600">Accuracy Rate</p>
                  </div>
                </div>

                {/* A/B Test: Different CTAs */}
                <div className="space-y-4">
                  <button
                    onClick={() => handleCTAClick('get_scorecard')}
                    className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
                  >
                    Get Free Scorecard Template
                  </button>
                  <p className="text-sm text-gray-600">
                    Used by Sequoia scouts, First Round partners, and 50+ other VCs
                  </p>
                </div>
              </div>

              {/* Right Column - Interactive Dashboard Preview */}
              <div className="relative">
                <div className="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
                  {/* Dashboard Header */}
                  <div className="bg-gray-800 text-white p-4 flex items-center justify-between">
                    <h3 className="font-medium">Startup Evaluation Dashboard</h3>
                    <span className="text-xs bg-green-500 px-2 py-1 rounded">LIVE</span>
                  </div>

                  {/* Dashboard Content */}
                  <div className="p-6">
                    {/* Score Overview */}
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-600 mb-2">Overall Score</h4>
                      <div className="flex items-center space-x-4">
                        <div className="text-4xl font-bold text-green-600">87</div>
                        <div className="flex-1">
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div className="bg-green-600 h-3 rounded-full" style={{ width: '87%' }} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Key Metrics Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <MetricCard
                        label="Market Validation"
                        value="92%"
                        trend="+12%"
                        color="green"
                      />
                      <MetricCard
                        label="Founder Readiness"
                        value="84%"
                        trend="+8%"
                        color="blue"
                      />
                      <MetricCard
                        label="Competitive Moat"
                        value="76%"
                        trend="-2%"
                        color="yellow"
                      />
                      <MetricCard
                        label="Growth Potential"
                        value="91%"
                        trend="+15%"
                        color="purple"
                      />
                    </div>

                    {/* Real-time Alert */}
                    <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-sm text-red-800">
                        <span className="font-medium">🚨 Alert:</span> Competitor raised $10M last week
                      </p>
                    </div>
                  </div>
                </div>

                {/* Floating testimonial */}
                <div className="absolute -bottom-4 -right-4 bg-white rounded-lg shadow-lg p-4 max-w-xs">
                  <p className="text-sm text-gray-700 italic">
                    "Cut our screening time by 80%"
                  </p>
                  <p className="text-xs text-gray-500 mt-1">- Partner, Tier 1 VC</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ROI Calculator */}
        <section className="py-12 md:py-20 px-4 md:px-6 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Calculate Your ROI
            </h2>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deals Reviewed Monthly
                  </label>
                  <input
                    type="number"
                    value={roiInputs.dealsPerMonth}
                    onChange={(e) => setRoiInputs({...roiInputs, dealsPerMonth: Number(e.target.value)})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hours per Deal (Current)
                  </label>
                  <input
                    type="number"
                    value={roiInputs.hoursPerDeal}
                    onChange={(e) => setRoiInputs({...roiInputs, hoursPerDeal: Number(e.target.value)})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Investment Team Size
                  </label>
                  <input
                    type="number"
                    value={roiInputs.teamSize}
                    onChange={(e) => setRoiInputs({...roiInputs, teamSize: Number(e.target.value)})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-6 text-center">
                <p className="text-gray-700 mb-2">Monthly Time Saved</p>
                <p className="text-4xl font-bold text-green-600 mb-4">
                  {Math.round(totalTimeSaved)} hours
                </p>
                <p className="text-gray-700 mb-2">Estimated Monthly Value</p>
                <p className="text-3xl font-bold text-green-600">
                  ${monthlySavings.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 mt-4">
                  That's {Math.round(totalTimeSaved / 40)} extra work weeks per month for your team
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Deep Dive */}
        <section className="py-12 md:py-20 px-4 md:px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Built for Modern VC Workflows
            </h2>

            <div className="grid md:grid-cols-2 gap-12">
              {/* Standardized Evaluation */}
              <div
                className="relative"
                onMouseEnter={() => handleFeatureHover('standardized_evaluation')}
              >
                <h3 className="text-2xl font-bold mb-4">Standardized Evaluation</h3>
                <p className="text-gray-700 mb-6">
                  Every startup follows the same comprehensive format, making comparison seamless.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-600 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>20-point evaluation framework</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-600 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Verified market data from 1M+ data points</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-600 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Side-by-side comparison tools</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-600 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Export to your existing workflow (Notion, Airtable)</span>
                  </li>
                </ul>
                <img
                  src="/images/standardized-evaluation.png"
                  alt="Standardized evaluation interface"
                  className="rounded-lg shadow-lg"
                />
              </div>

              {/* AI-Powered Insights */}
              <div
                className="relative"
                onMouseEnter={() => handleFeatureHover('ai_insights')}
              >
                <h3 className="text-2xl font-bold mb-4">AI-Powered Deep Insights</h3>
                <p className="text-gray-700 mb-6">
                  Our AI analyzes thousands of data points you might miss.
                </p>
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h4 className="font-bold text-gray-800 mb-4">Sample Insights:</h4>
                  <div className="space-y-3">
                    <InsightItem
                      type="market"
                      text="TAM growing 47% YoY, faster than industry reports suggest"
                    />
                    <InsightItem
                      type="competition"
                      text="3 stealth competitors identified in same space"
                    />
                    <InsightItem
                      type="founder"
                      text="Founder's previous exit netted investors 12x return"
                    />
                    <InsightItem
                      type="risk"
                      text="Regulatory changes in Q3 could impact growth model"
                    />
                  </div>
                </div>
                <button
                  onClick={() => handleCTAClick('sample_report')}
                  className="text-green-600 hover:text-green-700 font-medium inline-flex items-center"
                >
                  Download Sample Report
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Integration Section */}
        <section className="py-12 md:py-20 px-4 md:px-6 bg-gray-50">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">
              Integrates With Your Stack
            </h2>
            <p className="text-lg text-gray-700 mb-12 max-w-2xl mx-auto">
              Seamlessly export insights to your existing tools. No workflow disruption.
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
              <img src="/images/integrations/notion.svg" alt="Notion" className="h-12 opacity-70 hover:opacity-100 transition-opacity" />
              <img src="/images/integrations/airtable.svg" alt="Airtable" className="h-12 opacity-70 hover:opacity-100 transition-opacity" />
              <img src="/images/integrations/slack.svg" alt="Slack" className="h-12 opacity-70 hover:opacity-100 transition-opacity" />
              <img src="/images/integrations/zapier.svg" alt="Zapier" className="h-12 opacity-70 hover:opacity-100 transition-opacity" />
              <img src="/images/integrations/gdrive.svg" alt="Google Drive" className="h-12 opacity-70 hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </section>

        {/* Testimonials from VCs */}
        <section className="py-12 md:py-20 px-4 md:px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Trusted by Leading VCs
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gray-50 rounded-lg p-8">
                <div className="flex items-start mb-4">
                  <img
                    src="/images/testimonials/michael-chen.jpg"
                    alt="Michael Chen"
                    className="w-16 h-16 rounded-full mr-4"
                  />
                  <div>
                    <p className="font-bold text-lg">Michael Chen</p>
                    <p className="text-gray-600">Managing Partner, Horizons Ventures</p>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 italic">
                  "NexVC has transformed our deal flow process. We're seeing higher quality startups that are better prepared, and our initial evaluation time has dropped by 80%. It's become an essential tool for our team."
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-8">
                <div className="flex items-start mb-4">
                  <img
                    src="/images/testimonials/sarah-williams.jpg"
                    alt="Sarah Williams"
                    className="w-16 h-16 rounded-full mr-4"
                  />
                  <div>
                    <p className="font-bold text-lg">Sarah Williams</p>
                    <p className="text-gray-600">Principal, Benchmark Capital</p>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 italic">
                  "The standardized format and AI insights have been game-changing. We can now review 3x more deals with the same team, and our investment decisions are more data-driven than ever."
                </p>
              </div>
            </div>

            {/* logo_nexvc parade */}
            <div className="mt-12 pt-12 border-t">
              <p className="text-center text-gray-600 mb-8">Also trusted by partners and associates at:</p>
              <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-60">
                <img src="/images/vc-logos/sequoia.svg" alt="Sequoia" className="h-8" />
                <img src="/images/vc-logos/a16z.svg" alt="a16z" className="h-8" />
                <img src="/images/vc-logos/firstround.svg" alt="First Round" className="h-8" />
                <img src="/images/vc-logos/bessemer.svg" alt="Bessemer" className="h-8" />
                <img src="/images/vc-logos/accel.svg" alt="Accel" className="h-8" />
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-12 md:py-20 px-4 md:px-6 bg-green-600 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to 10x Your Deal Flow Efficiency?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join 50+ VCs who are finding and evaluating deals faster with NexVC
            </p>

            <div className="space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => handleCTAClick('book_tour')}
                className="bg-white text-green-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg transition-colors"
              >
                Book Platform Tour
              </button>
              <button
                onClick={() => handleCTAClick('free_scorecard_final')}
                className="border-2 border-white text-white hover:bg-white hover:text-green-600 font-bold py-3 px-8 rounded-lg transition-all"
              >
                Get Free Scorecard
              </button>
            </div>

            <p className="mt-8 text-sm opacity-75">
              No credit card required • 15-minute setup • Cancel anytime
            </p>
          </div>
        </section>
      </div>

      <Modal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} maxWidth="max-w-2xl">
        <DemoModal onClose={() => setIsDemoModalOpen(false)} />
      </Modal>
    </>
  );
}

// Metric Card Component
function MetricCard({ label, value, trend, color }: {
  label: string;
  value: string;
  trend: string;
  color: string;
}) {
  const colorClasses = {
    green: 'text-green-600 bg-green-50',
    blue: 'text-blue-600 bg-blue-50',
    yellow: 'text-yellow-600 bg-yellow-50',
    purple: 'text-purple-600 bg-purple-50'
  };

  return (
    <div className={`rounded-lg p-4 ${colorClasses[color as keyof typeof colorClasses]}`}>
      <p className="text-xs font-medium opacity-75 mb-1">{label}</p>
      <div className="flex items-end justify-between">
        <p className="text-2xl font-bold">{value}</p>
        <p className={`text-xs ${trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
          {trend}
        </p>
      </div>
    </div>
  );
}

// Insight Item Component
function InsightItem({ type, text }: { type: string; text: string }) {
  const icons = {
    market: '📈',
    competition: '⚔️',
    founder: '👤',
    risk: '⚠️'
  };

  return (
    <div className="flex items-start space-x-3">
      <span className="text-xl">{icons[type as keyof typeof icons]}</span>
      <p className="text-sm text-gray-700">{text}</p>
    </div>
  );
}
