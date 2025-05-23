import React from 'react';
import Layout from '@/components/layout/Layout';
import SEO from '@/components/SEO';
import { trackButtonClick } from '@/utils/analytics';

export default function ForFoundersPage() {
  const handleCTAClick = (location: string) => {
    trackButtonClick('founders_cta', location);
  };

  return (
    <>
      <SEO
        title="For Founders | Pitch-it - AI-Powered Fundraising Platform"
        description="Validate your idea, build compelling pitch decks, and practice with AI before meeting real investors. Join 500+ founders using Pitch-it."
        keywords={['startup founders', 'pitch deck builder', 'fundraising platform', 'investor preparation']}
      />

      <Layout onOpenDemoModal={() => handleCTAClick('header')}>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-blue-900">
                From Idea to Funded in Record Time
              </h1>
              <p className="text-xl text-gray-700 mb-8">
                The only platform that validates your market, builds your pitch, and prepares you for investor meetings—all powered by AI.
              </p>
              <button
                onClick={() => handleCTAClick('hero')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg shadow-lg transition-all hover:shadow-xl"
              >
                Start Your Free Trial
              </button>
            </div>
          </div>
        </section>

        {/* Pain Points */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">We Know Your Struggles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Uncertain Market Fit</h3>
                <p className="text-gray-600">60% of startups fail because they build something nobody wants</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Weak Pitch Decks</h3>
                <p className="text-gray-600">VCs spend only 3:44 minutes on average reviewing a deck</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Poor Pitch Performance</h3>
                <p className="text-gray-600">75% of founders feel unprepared for investor Q&A</p>
              </div>
            </div>
          </div>
        </section>

        {/* Solution */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">Your Path to Funding Success</h2>
            <div className="max-w-4xl mx-auto">
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">1</div>
                  <div className="ml-6">
                    <h3 className="text-xl font-bold mb-2">Validate Your Market</h3>
                    <p className="text-gray-600">Use AI to analyze trends and test your assumptions with real user feedback before building</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">2</div>
                  <div className="ml-6">
                    <h3 className="text-xl font-bold mb-2">Build a Winning Deck</h3>
                    <p className="text-gray-600">Create investor-ready pitch decks with AI assistance and proven templates</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">3</div>
                  <div className="ml-6">
                    <h3 className="text-xl font-bold mb-2">Practice & Perfect</h3>
                    <p className="text-gray-600">Rehearse with our AI VC simulator and get detailed feedback before the real thing</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">Founders Like You Are Winning</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-blue-50 p-8 rounded-lg">
                <p className="text-lg mb-4 italic">"Pitch-it helped me realize my initial idea wouldn't scale. The pivot saved me 6 months and $50k."</p>
                <div className="font-bold">Jessica Liu</div>
                <div className="text-gray-600">Founder, TechFlow (Raised $2.5M)</div>
              </div>
              <div className="bg-blue-50 p-8 rounded-lg">
                <p className="text-lg mb-4 italic">"The AI pitch practice was a game-changer. I nailed every investor question in my real meetings."</p>
                <div className="font-bold">David Park</div>
                <div className="text-gray-600">CEO, GreenScale (Raised $1.8M)</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-blue-600 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Accelerate Your Fundraising?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join 500+ founders who've validated their ideas and raised funding faster with Pitch-it
            </p>
            <div className="space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => handleCTAClick('final')}
                className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg transition-colors"
              >
                Start Free Trial
              </button>
              <button
                onClick={() => handleCTAClick('final_demo')}
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-bold py-3 px-8 rounded-lg transition-colors"
              >
                Book a Demo
              </button>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
