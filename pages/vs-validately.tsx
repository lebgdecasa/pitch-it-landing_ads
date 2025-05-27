import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Modal from '@/components/ui/Modal';
import WaitlistModal from '@/components/modals/WaitlistModal';
import SEO from '@/components/SEO';
import { trackButtonClick, trackTimeOnPage, trackFeatureInterest } from '@/utils/analytics';

export default function VsValidatelyPage() {
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [migrationSteps, setMigrationSteps] = useState(0);
  const [calculatorInputs, setCalculatorInputs] = useState({
    currentCost: 299,
    teamSize: 5,
    projectsPerMonth: 10
  });

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
    trackButtonClick(`vs_validately_cta_${testVariant}`, 'hero');
    setIsWaitlistModalOpen(true);
  };

  const handleFeatureClick = (feature: string) => {
    setSelectedFeature(feature);
    trackFeatureInterest(`comparison_${feature}`);
  };

  // Calculate savings
  const pitchItCost = 97; // One-time for most features
  const yearlySavings = (calculatorInputs.currentCost * 12) - (pitchItCost * calculatorInputs.projectsPerMonth);
  const timeSaved = calculatorInputs.projectsPerMonth * 3; // 3 hours saved per project

  const features = [
    {
      category: "Market Validation",
      items: [
        { feature: "Real user feedback", pitchit: true, validately: true, difference: "48hr turnaround vs 7 days" },
        { feature: "AI-powered insights", pitchit: true, validately: false, difference: "Exclusive to Pitch-it" },
        { feature: "Competitor analysis", pitchit: true, validately: false, difference: "Exclusive to Pitch-it" },
        { feature: "Trend identification", pitchit: true, validately: false, difference: "Exclusive to Pitch-it" }
      ]
    },
    {
      category: "Testing Features",
      items: [
        { feature: "Custom personas", pitchit: true, validately: true, difference: "AI-generated vs manual" },
        { feature: "Virtual VC practice", pitchit: true, validately: false, difference: "Exclusive to Pitch-it" },
        { feature: "Pitch deck builder", pitchit: true, validately: false, difference: "Exclusive to Pitch-it" },
        { feature: "Response analytics", pitchit: true, validately: true, difference: "Real-time vs batch" }
      ]
    },
    {
      category: "Pricing & Support",
      items: [
        { feature: "Starting price", pitchit: "$97/project", validately: "$299/month", difference: "70% cheaper" },
        { feature: "Free trial", pitchit: "3 projects", validately: "14 days", difference: "Better value" },
        { feature: "24/7 support", pitchit: true, validately: false, difference: "Always available" },
        { feature: "Money-back guarantee", pitchit: "30 days", validately: "7 days", difference: "4x longer" }
      ]
    }
  ];

  const switcherTestimonials = [
    {
      name: "Sarah Mitchell",
      company: "ProductFlow",
      image: "/images/testimonials/sarah-switcher.jpg",
      quote: "Switched from Validately 3 months ago. The AI insights alone saved us from a costly pivot.",
      benefit: "Saved $15,000",
      previousTool: "Validately Pro"
    },
    {
      name: "David Kim",
      company: "TechStart",
      image: "/images/testimonials/david-switcher.jpg",
      quote: "Validately was fine for surveys, but Pitch-it's virtual VC practice got us funded.",
      benefit: "Raised $1.2M",
      previousTool: "Validately + SurveyMonkey"
    },
    {
      name: "Emma Rodriguez",
      company: "HealthTech Inc",
      image: "/images/testimonials/emma-switcher.jpg",
      quote: "The migration was seamless. Pitch-it imported all our data and we were running in minutes.",
      benefit: "3x faster insights",
      previousTool: "Validately Enterprise"
    }
  ];

  return (
    <>
      <SEO
        title="Pitch-it vs Validately: The Honest Comparison | See Why VCs Prefer Pitch-it"
        description="Better than Validately. Faster than consultants. One platform: market tests, AI personas, pitch analysis. See why Sequoia scouts switched."
        keywords={['validately alternative', 'pitch validation tool', 'market research platform', 'startup validation']}
        noindex={false}
      />

      <Head>
        <meta name="robots" content="index, follow" />
      </Head>

      <div className="min-h-screen bg-white">
        {/* Hero Section - Direct Comparison */}
        <section className="py-12 md:py-20 px-4 md:px-6 bg-gradient-to-br from-blue-50 to-white">
          <div className="max-w-6xl mx-auto">
            {/* Acknowledgment Banner */}
            <div className="bg-blue-100 border border-blue-200 rounded-lg p-4 mb-8 text-center">
              <p className="text-sm text-blue-800">
                <span className="font-medium">Full Disclosure:</span> We built this comparison to help you make an informed decision.
                Validately is a good tool - we just believe we're better. Here's why.
              </p>
            </div>

            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900 leading-tight">
                <span className="text-blue-600">Pitch-it</span> vs Validately:<br />
                The Honest Comparison
              </h1>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                Better than Validately. Faster than consultants. See why Sequoia scouts switched.
              </p>
            </div>

            {/* Quick Comparison Stats */}
            <div className="grid md:grid-cols-4 gap-6 mb-12">
              <div className="bg-white rounded-lg p-6 shadow-md text-center">
                <p className="text-3xl font-bold text-blue-600">70%</p>
                <p className="text-sm text-gray-600 mt-1">Lower Cost</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md text-center">
                <p className="text-3xl font-bold text-blue-600">3x</p>
                <p className="text-sm text-gray-600 mt-1">More Features</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md text-center">
                <p className="text-3xl font-bold text-blue-600">48hr</p>
                <p className="text-sm text-gray-600 mt-1">Faster Results</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md text-center">
                <p className="text-3xl font-bold text-blue-600">92%</p>
                <p className="text-sm text-gray-600 mt-1">Switcher Satisfaction</p>
              </div>
            </div>

            {/* CTAs */}
            <div className="text-center space-y-4">
              <button
                onClick={() => handleCTAClick('see_comparison')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg shadow-lg transition-all hover:shadow-xl"
              >
                See Full Comparison
              </button>
              <p className="text-sm text-gray-600">
                Free migration support • Import all your data • Cancel Validately anytime
              </p>
            </div>
          </div>
        </section>

        {/* Detailed Feature Comparison Table */}
        <section className="py-12 md:py-20 px-4 md:px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Side-by-Side Feature Comparison
            </h2>

            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-12 bg-gray-800 text-white p-4">
                <div className="col-span-6 font-medium">Feature</div>
                <div className="col-span-2 text-center font-medium">Pitch-it</div>
                <div className="col-span-2 text-center font-medium">Validately</div>
                <div className="col-span-2 text-center font-medium">Advantage</div>
              </div>

              {/* Feature Categories */}
              {features.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  <div className="bg-gray-100 px-4 py-3 font-bold text-gray-700">
                    {category.category}
                  </div>
                  {category.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="grid grid-cols-12 p-4 border-b hover:bg-blue-50 cursor-pointer transition-colors"
                      onClick={() => handleFeatureClick(item.feature)}
                    >
                      <div className="col-span-6 text-gray-700">
                        {item.feature}
                        {selectedFeature === item.feature && (
                          <p className="text-sm text-blue-600 mt-1">{item.difference}</p>
                        )}
                      </div>
                      <div className="col-span-2 text-center">
                        {typeof item.pitchit === 'boolean' ? (
                          item.pitchit ? (
                            <svg className="w-6 h-6 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className="w-6 h-6 text-gray-300 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          )
                        ) : (
                          <span className="font-medium text-blue-600">{item.pitchit}</span>
                        )}
                      </div>
                      <div className="col-span-2 text-center">
                        {typeof item.validately === 'boolean' ? (
                          item.validately ? (
                            <svg className="w-6 h-6 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className="w-6 h-6 text-gray-300 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          )
                        ) : (
                          <span className="text-gray-600">{item.validately}</span>
                        )}
                      </div>
                      <div className="col-span-2 text-center">
                        <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                          Pitch-it
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <p className="text-center text-sm text-gray-600 mt-6">
              * Comparison based on publicly available information as of January 2025
            </p>
          </div>
        </section>

        {/* Switcher Testimonials */}
        <section className="py-12 md:py-20 px-4 md:px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why Teams Switched from Validately
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {switcherTestimonials.map((testimonial, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-6 relative">
                  <div className="absolute -top-3 -right-3 bg-green-500 text-white text-xs px-3 py-1 rounded-full">
                    Switched!
                  </div>

                  <div className="flex items-start mb-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <p className="font-bold">{testimonial.name}</p>
                      <p className="text-sm text-gray-600">{testimonial.company}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Previously: {testimonial.previousTool}
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-700 italic mb-4">"{testimonial.quote}"</p>

                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded inline-block text-sm font-medium">
                    {testimonial.benefit}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Migration Guide */}
        <section className="py-12 md:py-20 px-4 md:px-6 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Switching is Easy - We'll Help
            </h2>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold mb-6">Migration Process</h3>
                  <div className="space-y-4">
                    <MigrationStep
                      number={1}
                      title="Export Your Data"
                      description="Download your Validately data (we'll show you how)"
                      completed={migrationSteps >= 1}
                      onClick={() => setMigrationSteps(1)}
                    />
                    <MigrationStep
                      number={2}
                      title="Import to Pitch-it"
                      description="One-click import of all your projects and data"
                      completed={migrationSteps >= 2}
                      onClick={() => setMigrationSteps(2)}
                    />
                    <MigrationStep
                      number={3}
                      title="Team Onboarding"
                      description="Free training session for your entire team"
                      completed={migrationSteps >= 3}
                      onClick={() => setMigrationSteps(3)}
                    />
                    <MigrationStep
                      number={4}
                      title="Cancel Validately"
                      description="We'll even help you cancel your old subscription"
                      completed={migrationSteps >= 4}
                      onClick={() => setMigrationSteps(4)}
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-6">Migration Support</h3>
                  <div className="bg-blue-50 rounded-lg p-6 mb-6">
                    <h4 className="font-bold text-blue-900 mb-3">What's Included:</h4>
                    <ul className="space-y-2 text-blue-800">
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Dedicated migration specialist</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>All historical data preserved</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>30-day money-back guarantee</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Priority support for 90 days</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={() => handleCTAClick('free_migration')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                  >
                    Get Free Migration Support
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cost Savings Calculator */}
        <section className="py-12 md:py-20 px-4 md:px-6 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Calculate Your Savings
            </h2>

            <div className="bg-gray-50 rounded-lg p-8">
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Validately Cost
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={calculatorInputs.currentCost}
                      onChange={(e) => setCalculatorInputs({...calculatorInputs, currentCost: Number(e.target.value)})}
                      className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">/month</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Team Size
                  </label>
                  <input
                    type="number"
                    value={calculatorInputs.teamSize}
                    onChange={(e) => setCalculatorInputs({...calculatorInputs, teamSize: Number(e.target.value)})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Projects per Month
                  </label>
                  <input
                    type="number"
                    value={calculatorInputs.projectsPerMonth}
                    onChange={(e) => setCalculatorInputs({...calculatorInputs, projectsPerMonth: Number(e.target.value)})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 text-center">
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-gray-600 mb-2">Annual Savings</p>
                    <p className="text-3xl font-bold text-green-600">
                      ${Math.max(0, yearlySavings).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-2">Time Saved Monthly</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {timeSaved} hours
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-2">ROI</p>
                    <p className="text-3xl font-bold text-purple-600">
                      {Math.round((yearlySavings / (calculatorInputs.currentCost * 12)) * 100)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-12 md:py-20 px-4 md:px-6 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Experience the Difference?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join 500+ teams who switched and never looked back
            </p>

            <div className="bg-white/10 rounded-lg p-6 mb-8 max-w-md mx-auto">
              <p className="text-2xl font-bold mb-2">
                Special Offer for Switchers
              </p>
              <p className="text-sm opacity-75">
                3 months free when you switch from Validately
              </p>
            </div>

            <div className="space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => handleCTAClick('switch_now')}
                className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-lg text-lg shadow-lg transition-all hover:shadow-xl"
              >
                Switch to Pitch-it Now
              </button>
              <button
                onClick={() => handleCTAClick('compare_plans')}
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-bold py-4 px-8 rounded-lg text-lg transition-all"
              >
                Compare Plans
              </button>
            </div>

            <p className="mt-6 text-sm opacity-75">
              Free migration • 30-day guarantee • Cancel anytime
            </p>
          </div>
        </section>
      </div>

      <Modal isOpen={isWaitlistModalOpen} onClose={() => setIsWaitlistModalOpen(false)}>
        <WaitlistModal onClose={() => setIsWaitlistModalOpen(false)} />
      </Modal>
    </>
  );
}

// Migration Step Component
function MigrationStep({ number, title, description, completed, onClick }: {
  number: number;
  title: string;
  description: string;
  completed: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className={`flex items-start space-x-4 p-4 rounded-lg cursor-pointer transition-all ${
        completed ? 'bg-green-50' : 'bg-gray-50 hover:bg-gray-100'
      }`}
      onClick={onClick}
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
        completed ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
      }`}>
        {completed ? '✓' : number}
      </div>
      <div className="flex-1">
        <h4 className={`font-medium ${completed ? 'text-green-900' : 'text-gray-900'}`}>
          {title}
        </h4>
        <p className={`text-sm ${completed ? 'text-green-700' : 'text-gray-600'}`}>
          {description}
        </p>
      </div>
    </div>
  );
}
