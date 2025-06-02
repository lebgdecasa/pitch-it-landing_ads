import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Modal from '@/components/ui/Modal';
import WaitlistModal from '@/components/modals/WaitlistModal';
import SEO from '@/components/SEO';
import { trackButtonClick, trackTimeOnPage } from '@/utils/analytics';

export default function FounderStoryPage() {
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState(0);

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
    trackButtonClick(`founder_story_cta_${testVariant}`, 'hero');
    setIsWaitlistModalOpen(true);
  };

  const handleVideoPlay = () => {
    setVideoPlaying(true);
    trackButtonClick('founder_story_video', 'hero');
  };

  const testimonials = [
    {
      name: "Alex Thompson",
      company: "Former DataFlow",
      story: "6 months. $120K. 2 co-founders. All wasted on a product nobody wanted.",
      lesson: "If I had validated with real users first, we would have pivoted immediately to what became our successful B2B play.",
      savings: "$120,000",
      time: "6 months"
    },
    {
      name: "Jessica Liu",
      company: "TechFlow (Raised $2.5M)",
      story: "I almost built a consumer app when my real opportunity was in enterprise.",
      lesson: "NexTraction's validation showed me enterprise users were desperately seeking our solution. That insight led to our seed round.",
      savings: "$50,000",
      time: "4 months"
    },
    {
      name: "Marcus Williams",
      company: "StreamlineHR",
      story: "My first startup failed because I built features I thought were cool, not what users needed.",
      lesson: "This time, I validated everything first. Now we have 10K users and just closed Series A.",
      savings: "$75,000",
      time: "5 months"
    }
  ];

  return (
    <>
      <SEO
        title="I Spent 6 Months Building the Wrong Thing | NexTraction"
        description="Learn from my $50K mistake. Discover how to validate your startup idea with real users before writing a single line of code."
        keywords={['startup failure', 'pivot story', 'market validation', 'founder lessons']}
        noindex={false}
      />

      <Head>
        <meta name="robots" content="index, follow" />
      </Head>

      <div className="min-h-screen bg-white">
        {/* Hero Section - Story Format */}
        <section className="relative py-8 md:py-16 px-4 md:px-6 bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-4xl mx-auto">
            {/* Personal Story Header */}
            <div className="text-center mb-8 md:mb-12">
              <p className="text-blue-600 font-medium mb-4">A Founder's Confession</p>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 leading-tight">
                I Spent 6 Months Building<br className="hidden md:block" />
                the <span className="text-red-600">Wrong Thing</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
                Here's the $12 tool that would've saved me $50K and half a year of my life...
              </p>
            </div>

            {/* Video Story Section */}
            <div className="mb-12">
              <div className="relative bg-black rounded-lg overflow-hidden shadow-2xl">
                {!videoPlaying ? (
                  <div
                    className="relative cursor-pointer group"
                    onClick={handleVideoPlay}
                  >
                    <img
                      src="/images/founder-story-thumbnail.jpg"
                      alt="Founder story video"
                      className="w-full"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center group-hover:bg-opacity-40 transition-all">
                      <div className="bg-white rounded-full p-4 md:p-6 shadow-lg group-hover:scale-110 transition-transform">
                        <svg className="w-8 h-8 md:w-12 md:h-12 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                        </svg>
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <p className="text-sm opacity-90">2 min watch</p>
                      <p className="font-bold">My $50K Mistake & How to Avoid It</p>
                    </div>
                  </div>
                ) : (
                  <div className="relative pb-[56.25%]">
                    <iframe
                      className="absolute top-0 left-0 w-full h-full"
                      src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                )}
              </div>
            </div>

            {/* A/B Test: CTA Placement - After Video */}
            <div className="text-center mb-12">
              <button
                onClick={() => handleCTAClick('avoid_mistake')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg shadow-lg transition-all hover:shadow-xl"
              >
                Avoid My Mistake
              </button>
              <p className="mt-4 text-sm text-gray-600">No credit card required • Get started in 2 minutes</p>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-12">
              <div className="flex items-center text-gray-600">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                YC-Backed Founders
              </div>
              <div className="flex items-center text-gray-600">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Techstars Alumni
              </div>
              <div className="flex items-center text-gray-600">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                500 Startups
              </div>
            </div>
          </div>
        </section>

        {/* The Full Story */}
        <section className="py-12 md:py-20 px-4 md:px-6 bg-white">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">The Full Story</h2>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 mb-6">
                <span className="font-bold text-xl">January 2023.</span> I quit my job at Google with $50K in savings and a "brilliant" idea for a productivity app.
              </p>

              <p className="text-gray-700 mb-6">
                I spent the next 6 months heads-down coding. No customer conversations. No validation. Just building what I thought was cool.
              </p>

              <div className="bg-red-50 border-l-4 border-red-600 p-4 md:p-6 my-8">
                <p className="text-red-900 font-bold mb-2">The Result?</p>
                <ul className="text-red-800 space-y-2">
                  <li>• 73 total signups (mostly friends)</li>
                  <li>• 2 paying customers ($19/month each)</li>
                  <li>• $50,000 burned through</li>
                  <li>• 6 months of my life gone</li>
                </ul>
              </div>

              <p className="text-gray-700 mb-6">
                The worst part? When I finally talked to users, they told me they needed something completely different - something I could have built in 2 weeks.
              </p>

              <p className="text-gray-700 mb-6 font-bold text-xl">
                That's when I discovered market validation...
              </p>
            </div>
          </div>
        </section>

        {/* Before/After Comparison */}
        <section className="py-12 md:py-20 px-4 md:px-6 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
              My Approach: Then vs Now
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Before */}
              <div className="bg-red-50 rounded-lg p-6 md:p-8 border-2 border-red-200">
                <h3 className="text-xl font-bold mb-4 text-red-900">❌ Before (The Costly Way)</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">→</span>
                    <span>Assumed I knew what users wanted</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">→</span>
                    <span>Built for 6 months in isolation</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">→</span>
                    <span>Spent $50K before getting feedback</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">→</span>
                    <span>Launched to crickets</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">→</span>
                    <span>Had to shut down after 8 months</span>
                  </li>
                </ul>
                <div className="mt-6 pt-6 border-t border-red-200">
                  <p className="text-sm text-red-900">Total Loss: $50,000 + 6 months</p>
                </div>
              </div>

              {/* After */}
              <div className="bg-green-50 rounded-lg p-6 md:p-8 border-2 border-green-200">
                <h3 className="text-xl font-bold mb-4 text-green-900">✅ Now (The Smart Way)</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">→</span>
                    <span>Test ideas with real users first</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">→</span>
                    <span>Get feedback in 48 hours</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">→</span>
                    <span>Spend $97 to validate</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">→</span>
                    <span>Build only what users want</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">→</span>
                    <span>Launch with confidence & traction</span>
                  </li>
                </ul>
                <div className="mt-6 pt-6 border-t border-green-200">
                  <p className="text-sm text-green-900">Total Investment: $97 + 2 days</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cost Calculator */}
        <section className="py-12 md:py-20 px-4 md:px-6 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
              Calculate What You Could Save
            </h2>

            <MistakeCalculator />
          </div>
        </section>

        {/* Other Founder Stories */}
        <section className="py-12 md:py-20 px-4 md:px-6 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
              You're Not Alone - More Founder Stories
            </h2>

            <div className="space-y-6">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`bg-white rounded-lg p-6 md:p-8 shadow-md hover:shadow-lg transition-all cursor-pointer ${
                    selectedTestimonial === index ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedTestimonial(index)}
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                    <div className="flex-1">
                      <div className="flex items-start mb-4">
                        <img
                          src={`/images/testimonials/${testimonial.name.toLowerCase().replace(' ', '-')}.jpg`}
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full mr-4"
                        />
                        <div>
                          <p className="font-bold">{testimonial.name}</p>
                          <p className="text-sm text-gray-600">{testimonial.company}</p>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-4 italic">"{testimonial.story}"</p>
                      {selectedTestimonial === index && (
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-gray-700 mb-4">{testimonial.lesson}</p>
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="text-green-600 font-bold">💰 Could've saved {testimonial.savings}</span>
                            <span className="text-blue-600 font-bold">⏱️ Could've saved {testimonial.time}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-center text-gray-600 mt-8">
              Click each story to read more
            </p>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-12 md:py-20 px-4 md:px-6 bg-blue-600 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-4xl font-bold mb-6">
              Don't Make the Same Mistake I Did
            </h2>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              Validate your idea with real users before you invest months of your life
            </p>

            {/* A/B Test: Different CTA text */}
            <button
              onClick={() => handleCTAClick('start_smart')}
              className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-lg text-lg shadow-lg transition-all hover:shadow-xl"
            >
              Start Smart - Validate First
            </button>

            <p className="mt-6 text-sm opacity-75">
              $97 one-time • Results in 48 hours • Money-back guarantee
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

// Cost Calculator Component
function MistakeCalculator() {
  const [monthsWasted, setMonthsWasted] = useState(6);
  const [moneySaved, setMoneySaved] = useState(50000);
  const [teamSize, setTeamSize] = useState(1);

  const opportunityCost = monthsWasted * 10000 * teamSize; // Rough opportunity cost
  const totalLoss = moneySaved + opportunityCost;

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 md:p-10">
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Months You Might Waste
          </label>
          <input
            type="range"
            min="1"
            max="12"
            value={monthsWasted}
            onChange={(e) => setMonthsWasted(Number(e.target.value))}
            className="w-full"
          />
          <p className="text-center text-lg font-bold text-red-600 mt-2">{monthsWasted} months</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Money at Risk
          </label>
          <input
            type="range"
            min="10000"
            max="200000"
            step="5000"
            value={moneySaved}
            onChange={(e) => setMoneySaved(Number(e.target.value))}
            className="w-full"
          />
          <p className="text-center text-lg font-bold text-red-600 mt-2">
            ${moneySaved.toLocaleString()}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Team Members
          </label>
          <input
            type="range"
            min="1"
            max="5"
            value={teamSize}
            onChange={(e) => setTeamSize(Number(e.target.value))}
            className="w-full"
          />
          <p className="text-center text-lg font-bold text-red-600 mt-2">{teamSize} people</p>
        </div>
      </div>

      <div className="bg-red-50 rounded-lg p-6 text-center">
        <p className="text-gray-700 mb-2">Potential Total Loss:</p>
        <p className="text-4xl font-bold text-red-600 mb-4">
          ${totalLoss.toLocaleString()}
        </p>
        <p className="text-sm text-gray-600 mb-4">
          (Including ${opportunityCost.toLocaleString()} in opportunity cost)
        </p>

        <div className="border-t border-red-200 pt-4 mt-4">
          <p className="text-gray-700 mb-2">Cost to Validate First:</p>
          <p className="text-2xl font-bold text-green-600">Just $97</p>
        </div>
      </div>
    </div>
  );
}
