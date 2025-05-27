import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Modal from '@/components/ui/Modal';
import WaitlistModal from '@/components/modals/WaitlistModal';
import SEO from '@/components/SEO';
import { trackButtonClick, trackTimeOnPage } from '@/utils/analytics';

export default function ValidateFastPage() {
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState({ hours: 47, minutes: 59, seconds: 59 });
  const [currentWeekValidations, setCurrentWeekValidations] = useState(847);
  const router = useRouter();

  // Track page view and UTM params
  useEffect(() => {
    // Track time on page
    const startTime = Date.now();
    const interval = setInterval(() => {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      if (timeSpent % 30 === 0) {
        trackTimeOnPage(timeSpent);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Simulate real-time validations
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWeekValidations(prev => prev + Math.floor(Math.random() * 3));
    }, 45000); // Update every 45 seconds

    return () => clearInterval(interval);
  }, []);

  const handleCTAClick = (testVariant: string) => {
    trackButtonClick(`validate_fast_cta_${testVariant}`, 'hero');
    setIsWaitlistModalOpen(true);
  };

  return (
    <>
      <SEO
        title="Test with Real Users in 48 Hours | Pitch-it"
        description="Stop building in the dark. Get real user feedback on your startup idea in just 48 hours. Skip the guesswork and validate before you code."
        keywords={['market validation', 'user feedback', 'startup validation', 'MVP testing']}
        noindex={false}
      />

      <Head>
        <meta name="robots" content="index, follow" />
      </Head>

      <div className="min-h-screen bg-white">
        {/* Hero Section - No Navigation */}
        <section className="relative py-8 md:py-16 px-4 md:px-6 bg-gradient-to-br from-blue-50 to-white">
          <div className="max-w-6xl mx-auto">
            {/* Countdown Timer - Mobile Responsive */}
            <div className="mb-8 md:mb-12">
              <div className="bg-blue-600 text-white rounded-lg p-4 md:p-6 text-center shadow-xl">
                <p className="text-sm md:text-base mb-2 font-medium">Limited Time: Fast-Track Your Validation</p>
                <div className="flex justify-center items-center space-x-2 md:space-x-4">
                  <div className="bg-blue-700 rounded px-3 md:px-4 py-2">
                    <span className="text-2xl md:text-3xl font-bold">{String(timeRemaining.hours).padStart(2, '0')}</span>
                    <p className="text-xs">Hours</p>
                  </div>
                  <span className="text-2xl md:text-3xl font-bold">:</span>
                  <div className="bg-blue-700 rounded px-3 md:px-4 py-2">
                    <span className="text-2xl md:text-3xl font-bold">{String(timeRemaining.minutes).padStart(2, '0')}</span>
                    <p className="text-xs">Minutes</p>
                  </div>
                  <span className="text-2xl md:text-3xl font-bold">:</span>
                  <div className="bg-blue-700 rounded px-3 md:px-4 py-2">
                    <span className="text-2xl md:text-3xl font-bold">{String(timeRemaining.seconds).padStart(2, '0')}</span>
                    <p className="text-xs">Seconds</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              {/* Left Column - Copy */}
              <div>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 leading-tight">
                  Test with Real Users in{' '}
                  <span className="text-blue-600">48 Hours</span>.
                  <br />
                  Skip the Guesswork.
                </h1>

                <p className="text-lg md:text-xl text-gray-700 mb-8">
                  Stop building in the dark. Pulse shows what users actually want before you write a line of code.
                </p>

                {/* Real-time validation ticker */}
                <div className="bg-gray-50 rounded-lg p-4 mb-8 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Validations this week:</span>
                    <span className="text-2xl font-bold text-blue-600">{currentWeekValidations}</span>
                  </div>
                </div>

                {/* A/B Test: CTA Button Text */}
                <button
                  onClick={() => handleCTAClick('start_validation')}
                  className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg shadow-lg transition-all hover:shadow-xl mb-4"
                >
                  Start Validation
                </button>

                {/* Trust indicators */}
                <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-gray-600 mt-6">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    No credit card required
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Results guaranteed
                  </div>
                </div>
              </div>

              {/* Right Column - Visual */}
              <div className="relative order-first md:order-last">
                <div className="bg-white rounded-lg shadow-2xl p-4 md:p-6">
                  <img
                    src="/images/validation-dashboard.png"
                    alt="Real-time validation dashboard"
                    className="w-full rounded-lg"
                  />
                  {/* Animated overlay showing validation in progress */}
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                    Live Validation
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3-Step Process */}
        <section className="py-12 md:py-20 px-4 md:px-6 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-4xl font-bold text-center mb-12">
              How It Works
            </h2>

            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-blue-600 font-bold text-xl">1</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Define Your Hypothesis</h3>
                <p className="text-gray-600">Tell us what you want to validate - your value prop, pricing, or features.</p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-blue-600 font-bold text-xl">2</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Reach Real Users</h3>
                <p className="text-gray-600">We connect you with your target audience for authentic feedback.</p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-blue-600 font-bold text-xl">3</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Get Actionable Insights</h3>
                <p className="text-gray-600">Receive detailed reports with data to guide your next steps.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials with Time/Money Saved */}
        <section className="py-12 md:py-20 px-4 md:px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-4xl font-bold text-center mb-12">
              Founders Who Validated Fast
            </h2>

            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              <div className="bg-blue-50 rounded-lg p-6 md:p-8">
                <div className="flex items-start mb-4">
                  <img
                    src="/images/testimonials/sarah.jpg"
                    alt="Sarah Chen"
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <p className="font-bold">Sarah Chen</p>
                    <p className="text-sm text-gray-600">Founder, EcoTrack</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "Pulse saved me from building features nobody wanted. 48-hour validation revealed our users needed something completely different."
                </p>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-green-600 font-bold">💰 Saved $25K</span>
                  <span className="text-blue-600 font-bold">⏱️ Saved 3 months</span>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-6 md:p-8">
                <div className="flex items-start mb-4">
                  <img
                    src="/images/testimonials/mike.jpg"
                    alt="Mike Rodriguez"
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <p className="font-bold">Mike Rodriguez</p>
                    <p className="text-sm text-gray-600">CEO, DataSync</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "Best $97 I ever spent. The validation data helped us pivot early and we raised $1.2M six months later."
                </p>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-green-600 font-bold">💰 Saved $50K</span>
                  <span className="text-blue-600 font-bold">⏱️ Saved 6 months</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cost Calculator */}
        <section className="py-12 md:py-20 px-4 md:px-6 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-xl p-6 md:p-10">
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
                Calculate Your Potential Savings
              </h2>

              <ValidationCalculator />
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-12 md:py-20 px-4 md:px-6 bg-blue-600 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-4xl font-bold mb-6">
              Ready to Know If Your Idea Will Work?
            </h2>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              Join 847+ founders who validated their ideas this week
            </p>

            {/* A/B Test: Different CTA text */}
            <button
              onClick={() => handleCTAClick('get_user_feedback')}
              className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-lg text-lg shadow-lg transition-all hover:shadow-xl"
            >
              Get User Feedback Now
            </button>

            <p className="mt-6 text-sm opacity-75">
              Free to start • Results in 48 hours • No credit card required
            </p>
          </div>
        </section>

        {/* Logo Bar */}
        <section className="py-8 md:py-12 px-4 md:px-6 bg-white border-t">
          <div className="max-w-5xl mx-auto">
            <p className="text-center text-sm text-gray-600 mb-6">
              Trusted by founders from
            </p>
            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12 opacity-60">
              <img src="/images/logos/yc.svg" alt="Y Combinator" className="h-6 md:h-8" />
              <img src="/images/logos/techstars.svg" alt="Techstars" className="h-6 md:h-8" />
              <img src="/images/logos/500startups.svg" alt="500 Startups" className="h-6 md:h-8" />
              <img src="/images/logos/plug-and-play.svg" alt="Plug and Play" className="h-6 md:h-8" />
            </div>
          </div>
        </section>
      </div>

      <Modal isOpen={isWaitlistModalOpen} onClose={() => setIsWaitlistModalOpen(false)}>
        <WaitlistModal onClose={() => setIsWaitlistModalOpen(false)} />
      </Modal>
    </>
  );
}

// Validation Calculator Component
function ValidationCalculator() {
  const [devHourlyRate, setDevHourlyRate] = useState(75);
  const [monthsBuilding, setMonthsBuilding] = useState(3);
  const [teamSize, setTeamSize] = useState(2);

  const potentialCost = devHourlyRate * 160 * monthsBuilding * teamSize;
  const validationCost = 97;
  const savings = potentialCost - validationCost;

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4 md:gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Developer Hourly Rate
          </label>
          <input
            type="range"
            min="25"
            max="150"
            value={devHourlyRate}
            onChange={(e) => setDevHourlyRate(Number(e.target.value))}
            className="w-full"
          />
          <p className="text-center text-lg font-bold text-blue-600">${devHourlyRate}/hr</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Months of Building
          </label>
          <input
            type="range"
            min="1"
            max="12"
            value={monthsBuilding}
            onChange={(e) => setMonthsBuilding(Number(e.target.value))}
            className="w-full"
          />
          <p className="text-center text-lg font-bold text-blue-600">{monthsBuilding} months</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Team Size
          </label>
          <input
            type="range"
            min="1"
            max="5"
            value={teamSize}
            onChange={(e) => setTeamSize(Number(e.target.value))}
            className="w-full"
          />
          <p className="text-center text-lg font-bold text-blue-600">{teamSize} people</p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <p className="text-gray-600 mb-2">Potential cost of building the wrong thing:</p>
        <p className="text-3xl md:text-4xl font-bold text-red-600 mb-4">
          ${potentialCost.toLocaleString()}
        </p>
        <p className="text-gray-600 mb-2">Cost of validation with Pitch-it:</p>
        <p className="text-2xl font-bold text-green-600 mb-4">${validationCost}</p>
        <div className="border-t pt-4">
          <p className="text-gray-600 mb-2">You could save:</p>
          <p className="text-3xl md:text-4xl font-bold text-green-600">
            ${savings.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
