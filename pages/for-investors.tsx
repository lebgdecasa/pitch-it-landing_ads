import React from 'react';
import Layout from '@/components/layout/Layout';
import SEO from '@/components/SEO';
import { trackButtonClick } from '@/utils/analytics';

export default function ForInvestorsPage() {
  const handleCTAClick = (location: string) => {
    trackButtonClick('investors_cta', location);
  };

  return (
    <>
      <SEO
        title="For VCs & Investors | NexTraction - Data-Driven Deal Flow Platform"
        description="Streamline due diligence, evaluate startups faster, and discover pre-vetted investment opportunities with AI-powered insights."
        keywords={['venture capital', 'investment platform', 'due diligence', 'startup evaluation', 'deal flow']}
      />

      <Layout onOpenDemoModal={() => handleCTAClick('header')}>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-green-50 to-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
                Make Smarter Investment Decisions, Faster
              </h1>
              <p className="text-xl text-gray-700 mb-8">
                Access pre-validated startups, standardized data, and AI-powered insights to streamline your investment process.
              </p>
              <button
                onClick={() => handleCTAClick('hero')}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg text-lg shadow-lg transition-all hover:shadow-xl"
              >
                Request Early Access
              </button>
            </div>
          </div>
        </section>

        {/* Value Props */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">The Edge You Need in Today's Market</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">10x Faster Evaluation</h3>
                <p className="text-gray-600">Review standardized pitch decks and pre-validated market data in minutes, not hours</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Pre-Vetted Opportunities</h3>
                <p className="text-gray-600">Access startups that have already validated their market and refined their pitch</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Data-Driven Insights</h3>
                <p className="text-gray-600">AI-powered analysis of market trends, competitive landscape, and founder preparedness</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features for VCs */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">Built for Modern VCs</h2>
            <div className="max-w-4xl mx-auto space-y-12">
              <div className="md:flex items-center">
                <div className="md:w-1/2 mb-6 md:mb-0">
                  <h3 className="text-2xl font-bold mb-4">Standardized Deal Flow</h3>
                  <p className="text-gray-600 mb-4">
                    Every startup on NexTraction follows the same comprehensive format, making comparison and evaluation seamless.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-600 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Consistent pitch deck structure</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-600 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Verified market validation data</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-600 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Founder preparedness scores</span>
                    </li>
                  </ul>
                </div>
                <div className="md:w-1/2 md:pl-12">
                  <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                    <span className="text-gray-500">Dashboard Screenshot</span>
                  </div>
                </div>
              </div>

              <div className="md:flex items-center">
                <div className="md:w-1/2 mb-6 md:mb-0 md:order-2">
                  <h3 className="text-2xl font-bold mb-4">AI-Powered Due Diligence</h3>
                  <p className="text-gray-600 mb-4">
                    Our AI analyzes thousands of data points to surface insights you might miss.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-600 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Market size and growth analysis</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-600 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Competitive landscape mapping</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-600 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Risk assessment and red flags</span>
                    </li>
                  </ul>
                </div>
                <div className="md:w-1/2 md:pr-12 md:order-1">
                  <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                    <span className="text-gray-500">AI Analysis Screenshot</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
              <div>
                <div className="text-4xl font-bold text-green-600">85%</div>
                <div className="text-gray-600 mt-2">Time Saved on Initial Screening</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-green-600">3x</div>
                <div className="text-gray-600 mt-2">More Deals Reviewed Monthly</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-green-600">92%</div>
                <div className="text-gray-600 mt-2">Accuracy in Market Validation</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-green-600">50+</div>
                <div className="text-gray-600 mt-2">VCs Already Onboard</div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <svg className="w-12 h-12 text-green-600 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-xl text-gray-700 mb-6 italic">
                  "NexTraction has transformed our deal flow process. We're seeing higher quality startups that are better prepared,
                  and our initial evaluation time has dropped by 80%. It's become an essential tool for our team."
                </p>
                <div className="font-bold text-lg">Michael Chen</div>
                <div className="text-gray-600">Managing Partner, Horizons Ventures</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-green-600 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Upgrade Your Investment Process?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join leading VCs who are finding and evaluating deals faster with NexTraction
            </p>
            <div className="space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => handleCTAClick('final')}
                className="bg-white text-green-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg transition-colors"
              >
                Request Early Access
              </button>
              <button
                onClick={() => handleCTAClick('final_demo')}
                className="border-2 border-white text-white hover:bg-white hover:text-green-600 font-bold py-3 px-8 rounded-lg transition-colors"
              >
                Schedule a Demo
              </button>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
