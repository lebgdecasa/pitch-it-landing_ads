import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Modal from '@/components/ui/Modal';
import WaitlistModal from '@/components/modals/WaitlistModal';
import SEO from '@/components/SEO';
import { trackButtonClick, trackTimeOnPage } from '@/utils/analytics';

export default function DemoDayPrepPage() {
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('yc');
  const [confidenceScore, setConfidenceScore] = useState(45);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  // Calculate days until major demo days
  const demodays = {
    yc: { name: 'Y Combinator', date: new Date('2025-03-15'), color: 'orange' },
    techstars: { name: 'Techstars', date: new Date('2025-02-28'), color: 'blue' },
    '500startups': { name: '500 Startups', date: new Date('2025-03-01'), color: 'purple' }
  };

  const getDaysUntil = (date: Date) => {
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

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
    trackButtonClick(`demo_day_cta_${testVariant}`, 'hero');
    setIsWaitlistModalOpen(true);
  };

  const startQuiz = () => {
    setQuizStarted(true);
    trackButtonClick('confidence_quiz_start', 'quiz');
  };

  const quizQuestions = [
    {
      question: "How confident are you explaining your business model?",
      options: ["Very confident", "Somewhat confident", "Not very confident", "Need help"]
    },
    {
      question: "Can you answer 'Why now?' for your startup?",
      options: ["Crystal clear", "Pretty good", "Working on it", "Not sure"]
    },
    {
      question: "How prepared are you for tough investor questions?",
      options: ["Bring it on", "Mostly ready", "A bit nervous", "Very nervous"]
    }
  ];

  const handleQuizAnswer = (answerIndex: number) => {
    // Calculate confidence boost based on answer
    const boost = (3 - answerIndex) * 10;
    setConfidenceScore(prev => Math.min(prev + boost, 95));

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Quiz complete
      trackButtonClick('confidence_quiz_complete', 'quiz');
    }
  };

  return (
    <>
      <SEO
        title="YC Interviews in 2 Weeks? Get Pitch-Perfect Fast | NexVC"
        description="AI personas ask the hardest questions. Master your answers before it matters. Join 500+ founders who aced their demo days."
        keywords={['YC interview prep', 'demo day preparation', 'pitch practice', 'investor questions']}
        noindex={false}
      />

      <Head>
        <meta name="robots" content="index, follow" />
      </Head>

      <div className="min-h-screen bg-white">
        {/* Countdown Banner - Always Visible */}
        <div className="bg-red-600 text-white py-3 px-4 text-center sticky top-0 z-50">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center space-y-2 md:space-y-0 md:space-x-8">
            {Object.entries(demodays).map(([key, demo]) => (
              <div key={key} className={`${activeTab === key ? 'font-bold' : 'opacity-75'}`}>
                <span className="text-sm">{demo.name}:</span>
                <span className="ml-2 text-lg">{getDaysUntil(demo.date)} days</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative py-8 md:py-16 px-4 md:px-6 bg-gradient-to-br from-orange-50 to-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              {/* Left Column - Copy */}
              <div>
                <div className="mb-6">
                  <p className="text-orange-600 font-medium mb-2">Demo Day Preparation</p>
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 leading-tight">
                    YC Interviews in{' '}
                    <span className="text-orange-600">{getDaysUntil(demodays.yc.date)} Days?</span>
                    <br />
                    Get Pitch-Perfect Fast.
                  </h1>
                </div>

                <p className="text-lg md:text-xl text-gray-700 mb-8">
                  AI personas ask the hardest questions. Master your answers before it matters.
                </p>

                {/* Success Stats */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-white rounded-lg p-4 shadow-md">
                    <p className="text-3xl font-bold text-orange-600">87%</p>
                    <p className="text-sm text-gray-600">Interview Success Rate</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-md">
                    <p className="text-3xl font-bold text-green-600">4.8/5</p>
                    <p className="text-sm text-gray-600">Confidence Score Boost</p>
                  </div>
                </div>

                {/* A/B Test: CTA Button */}
                <button
                  onClick={() => handleCTAClick('practice_now')}
                  className="w-full md:w-auto bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-8 rounded-lg text-lg shadow-lg transition-all hover:shadow-xl mb-4"
                >
                  Practice Now
                </button>

                <p className="text-sm text-gray-600">
                  ✓ Used by YC W25 batch &nbsp;&nbsp; ✓ Instant access
                </p>
              </div>

              {/* Right Column - Visual Demo */}
              <div className="relative">
                <div className="bg-white rounded-lg shadow-2xl p-6">
                  {/* Mock Pitch Interface */}
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-bold text-gray-800">Virtual VC Session</h3>
                    <span className="text-sm text-red-600 animate-pulse">● LIVE</span>
                  </div>

                  <div className="space-y-4">
                    {/* VC Avatar */}
                    <div className="flex items-start space-x-3">
                      <img
                        src="/images/vc-avatar.jpg"
                        alt="Virtual VC"
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1 bg-gray-100 rounded-lg p-3">
                        <p className="text-sm text-gray-700">
                          "What makes you different from Competitor X who just raised $10M?"
                        </p>
                      </div>
                    </div>

                    {/* Your Response */}
                    <div className="flex items-start space-x-3">
                      <div className="flex-1 bg-blue-100 rounded-lg p-3 ml-12">
                        <p className="text-sm text-gray-700">
                          <span className="animate-pulse">Recording your response...</span>
                        </p>
                      </div>
                    </div>

                    {/* Feedback Preview */}
                    <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                      <p className="text-xs text-green-800 font-medium mb-1">AI Feedback:</p>
                      <p className="text-xs text-green-700">
                        "Good start, but emphasize your technical moat more. Try mentioning your patent-pending algorithm..."
                      </p>
                    </div>
                  </div>
                </div>

                {/* Floating success stories */}
                <div className="absolute -bottom-4 -left-4 bg-white rounded-lg shadow-lg p-3 max-w-xs">
                  <p className="text-xs text-gray-600">
                    <span className="font-bold">"Nailed every question!"</span> - Sarah, YC W24
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Confidence Assessment Quiz */}
        <section className="py-12 md:py-20 px-4 md:px-6 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
              Quick Confidence Check
            </h2>

            {!quizStarted ? (
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <p className="text-lg text-gray-700 mb-6">
                  How ready are you for tough investor questions? Take our 30-second assessment.
                </p>
                <button
                  onClick={startQuiz}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  Start Assessment
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-8">
                {currentQuestion < quizQuestions.length ? (
                  <>
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-sm text-gray-500">
                          Question {currentQuestion + 1} of {quizQuestions.length}
                        </span>
                        <span className="text-sm font-medium text-blue-600">
                          Confidence: {confidenceScore}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(currentQuestion + 1) / quizQuestions.length * 100}%` }}
                        />
                      </div>
                    </div>

                    <h3 className="text-xl font-bold mb-6">
                      {quizQuestions[currentQuestion].question}
                    </h3>

                    <div className="space-y-3">
                      {quizQuestions[currentQuestion].options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuizAnswer(index)}
                          className="w-full text-left p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center">
                    <div className="mb-6">
                      <div className="w-32 h-32 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-4xl font-bold text-blue-600">{confidenceScore}%</span>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Your Confidence Score</h3>
                    <p className="text-gray-700 mb-6">
                      {confidenceScore < 60
                        ? "You need practice! Our AI coaches can help you get pitch-perfect fast."
                        : confidenceScore < 80
                        ? "Good foundation! A bit more practice will make you unstoppable."
                        : "You're almost there! Fine-tune with our AI to achieve perfection."}
                    </p>
                    <button
                      onClick={() => handleCTAClick('boost_confidence')}
                      className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                    >
                      Boost My Confidence
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Success Stories by Accelerator */}
        <section className="py-12 md:py-20 px-4 md:px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
              Success Stories from Top Programs
            </h2>

            {/* Tab Navigation */}
            <div className="flex justify-center mb-8">
              <div className="bg-gray-100 rounded-lg p-1 inline-flex">
                {Object.entries(demodays).map(([key, demo]) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`px-4 py-2 rounded-md transition-all ${
                      activeTab === key
                        ? 'bg-white shadow text-gray-900 font-medium'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {demo.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Success Stories Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {activeTab === 'yc' && (
                <>
                  <SuccessStory
                    name="Emma Chen"
                    batch="YC W24"
                    story="The toughest question was about our CAC. Thanks to practice, I had the numbers ready and explained our path to profitability perfectly."
                    result="Accepted + $500K"
                    image="/images/testimonials/emma-yc.jpg"
                  />
                  <SuccessStory
                    name="David Park"
                    batch="YC S24"
                    story="I practiced with 50+ AI-generated questions. When they asked about our moat, I delivered a flawless answer."
                    result="Accepted + Top Deal"
                    image="/images/testimonials/david-yc.jpg"
                  />
                </>
              )}
              {activeTab === 'techstars' && (
                <>
                  <SuccessStory
                    name="Maria Garcia"
                    batch="Techstars NYC"
                    story="The virtual practice sessions helped me refine my pitch to exactly 3 minutes. Nailed the timing!"
                    result="Accepted + Mentorship"
                    image="/images/testimonials/maria-techstars.jpg"
                  />
                  <SuccessStory
                    name="Alex Kim"
                    batch="Techstars Seattle"
                    story="I was nervous about technical questions. The AI knew exactly what VCs would ask about our architecture."
                    result="Accepted + $120K"
                    image="/images/testimonials/alex-techstars.jpg"
                  />
                </>
              )}
              {activeTab === '500startups' && (
                <>
                  <SuccessStory
                    name="Raj Patel"
                    batch="500 Startups B28"
                    story="Practiced my growth metrics story 20+ times. When they grilled me on unit economics, I was ready."
                    result="Accepted + Network"
                    image="/images/testimonials/raj-500.jpg"
                  />
                  <SuccessStory
                    name="Lisa Wong"
                    batch="500 Startups B29"
                    story="The feedback on my body language was game-changing. I looked confident even when stressed."
                    result="Accepted + $150K"
                    image="/images/testimonials/lisa-500.jpg"
                  />
                </>
              )}
            </div>
          </div>
        </section>

        {/* Practice Demo */}
        <section className="py-12 md:py-20 px-4 md:px-6 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
              Try a Practice Question
            </h2>

            <PracticeDemo />
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-12 md:py-20 px-4 md:px-6 bg-gradient-to-br from-orange-600 to-red-600 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-4xl font-bold mb-6">
              Your Demo Day is Coming Fast
            </h2>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              Don't let nerves or lack of preparation hold you back from your dream
            </p>

            {/* Countdown reminder */}
            <div className="bg-white/10 rounded-lg p-6 mb-8 max-w-md mx-auto">
              <p className="text-2xl font-bold mb-2">
                Only {getDaysUntil(demodays[activeTab as keyof typeof demodays].date)} Days Left
              </p>
              <p className="text-sm opacity-75">
                Most founders practice for 20+ hours. Start now.
              </p>
            </div>

            <button
              onClick={() => handleCTAClick('start_practicing')}
              className="bg-white text-orange-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-lg text-lg shadow-lg transition-all hover:shadow-xl"
            >
              Start Practicing Today
            </button>

            <p className="mt-6 text-sm opacity-75">
              Instant access • Cancel anytime • Used by 500+ accepted founders
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

// Success Story Component
function SuccessStory({ name, batch, story, result, image }: {
  name: string;
  batch: string;
  story: string;
  result: string;
  image: string;
}) {
  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <div className="flex items-start mb-4">
        <img
          src={image}
          alt={name}
          className="w-12 h-12 rounded-full mr-4"
        />
        <div>
          <p className="font-bold">{name}</p>
          <p className="text-sm text-gray-600">{batch}</p>
        </div>
      </div>
      <p className="text-gray-700 mb-4 italic">"{story}"</p>
      <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full inline-block text-sm font-medium">
        {result}
      </div>
    </div>
  );
}

// Practice Demo Component
function PracticeDemo() {
  const [isRecording, setIsRecording] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const startRecording = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setShowFeedback(true);
    }, 5000);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
      <div className="space-y-6">
        {/* Question */}
        <div className="flex items-start space-x-4">
          <img
            src="/images/vc-avatar-2.jpg"
            alt="Virtual VC"
            className="w-12 h-12 rounded-full"
          />
          <div className="flex-1">
            <p className="font-medium text-gray-900 mb-2">Virtual VC asks:</p>
            <p className="text-lg text-gray-700 bg-gray-50 rounded-lg p-4">
              "Why are you the right team to solve this problem?"
            </p>
          </div>
        </div>

        {/* Recording Interface */}
        {!showFeedback ? (
          <div className="text-center">
            {!isRecording ? (
              <>
                <p className="text-gray-600 mb-4">
                  Click to record your 30-second answer
                </p>
                <button
                  onClick={startRecording}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors inline-flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                  </svg>
                  Start Recording
                </button>
              </>
            ) : (
              <div className="space-y-4">
                <div className="inline-flex items-center text-red-600">
                  <span className="animate-pulse mr-2">●</span>
                  <span className="font-medium">Recording...</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }} />
                </div>
                <p className="text-sm text-gray-600">Speak clearly and confidently</p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-blue-50 rounded-lg p-6">
            <h4 className="font-bold text-blue-900 mb-3">AI Feedback</h4>
            <div className="space-y-2 text-sm text-blue-800">
              <p>✓ Good energy and enthusiasm</p>
              <p>✗ Mention specific domain expertise</p>
              <p>✗ Include previous startup experience</p>
              <p>→ Try emphasizing your unique insights from working at Company X</p>
            </div>
            <button
              onClick={() => {
                setShowFeedback(false);
                trackButtonClick('practice_demo_complete', 'demo');
              }}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
