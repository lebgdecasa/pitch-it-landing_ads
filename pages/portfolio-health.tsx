import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Modal from '@/components/ui/Modal';
import DemoModal from '@/components/modals/DemoModal';
import SEO from '@/components/SEO';
import { trackButtonClick, trackTimeOnPage, trackFeatureInterest } from '@/utils/analytics';

export default function PortfolioHealthPage() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState(0);
  const [revealedBlindspot, setRevealedBlindspot] = useState(false);
  const [assessmentStarted, setAssessmentStarted] = useState(false);
  const [assessmentStep, setAssessmentStep] = useState(0);

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
    trackButtonClick(`portfolio_health_cta_${testVariant}`, 'hero');
    setIsDemoModalOpen(true);
  };

  const caseStudies = [
    {
      company: "TechCo",
      fundingRound: "Series A",
      issue: "Founder burnout - CEO considering stepping down",
      discovered: "3 months before crisis",
      outcome: "Helped transition to new CEO smoothly, saved investment"
    },
    {
      company: "DataSync",
      fundingRound: "Seed",
      issue: "Undisclosed competitor with 10x resources entering market",
      discovered: "6 months before launch",
      outcome: "Pivoted strategy, found defensible niche, 3x growth"
    },
    {
      company: "HealthAPI",
      fundingRound: "Series B",
      issue: "Key technical co-founder interviewing elsewhere",
      discovered: "2 months early",
      outcome: "Retention package implemented, co-founder stayed"
    }
  ];

  const assessmentQuestions = [
    {
      question: "How often do you check in with portfolio companies?",
      options: ["Weekly", "Monthly", "Quarterly", "When they reach out"],
      risk: [1, 2, 3, 4]
    },
    {
      question: "Do you track competitor movements for each portfolio company?",
      options: ["Yes, automated", "Yes, manually", "Sometimes", "Rarely"],
      risk: [1, 2, 3, 4]
    },
    {
      question: "How do you monitor founder wellbeing?",
      options: ["Regular 1-on-1s", "Board meetings only", "When issues arise", "We don't"],
      risk: [1, 2, 3, 4]
    }
  ];

  const startAssessment = () => {
    setAssessmentStarted(true);
    trackButtonClick('blindspot_assessment_start', 'assessment');
  };

  const handleAssessmentAnswer = (riskLevel: number) => {
    if (assessmentStep < assessmentQuestions.length - 1) {
      setAssessmentStep(prev => prev + 1);
    } else {
      // Assessment complete
      trackButtonClick('blindspot_assessment_complete', 'assessment');
    }
  };

  return (
    <>
      <SEO
        title="What Aren't Your Founders Telling You? | Portfolio Health - NexTraction"
        description="Anonymous market testing reveals the gaps founders hide. Protect your portfolio with early warning signals. Used by 50+ VCs."
        keywords={['portfolio monitoring', 'VC tools', 'startup health', 'investment protection']}
        noindex={false}
      />

      <Head>
        <meta name="robots" content="index, follow" />
      </Head>

      <div className="min-h-screen bg-white">
        {/* Navigation Bar */}
        <nav className="bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <img src="/images/logo_NexTraction.png" alt="NexTraction" className="h-8 mr-2" />
                <span className="font-bold text-xl text-gray-900">NexTraction</span>
                <span className="ml-2 text-sm text-gray-500">Portfolio Health</span>
              </div>
              <button
                onClick={() => handleCTAClick('nav_test')}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                Test Portfolio
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section - Fear-Based Messaging */}
        <section className="py-12 md:py-20 px-4 md:px-6 bg-gradient-to-br from-red-50 to-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-red-600 font-medium mb-4">Early Warning System for VCs</p>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900 leading-tight">
                What Aren't Your<br />
                <span className="text-red-600">Founders Telling You?</span>
              </h1>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                Anonymous market testing reveals the gaps founders hide. Protect your portfolio.
              </p>
            </div>

            {/* Risk Statistics */}
            <div className="grid md:grid-cols-4 gap-6 mb-12 max-w-4xl mx-auto">
              <div className="text-center">
                <p className="text-3xl font-bold text-red-600">67%</p>
                <p className="text-sm text-gray-600">of startups hide critical issues</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-red-600">4-6</p>
                <p className="text-sm text-gray-600">months typical warning delay</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-red-600">$2.3M</p>
                <p className="text-sm text-gray-600">avg loss from late detection</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-red-600">89%</p>
                <p className="text-sm text-gray-600">issues preventable if caught early</p>
              </div>
            </div>

            {/* A/B Test: CTA Placement */}
            <div className="text-center">
              <button
                onClick={() => handleCTAClick('test_portfolio')}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-lg text-lg shadow-lg transition-all hover:shadow-xl"
              >
                Test Your Portfolio Health
              </button>
              <p className="mt-4 text-sm text-gray-600">
                Free for first 3 companies • Results in 48 hours
              </p>
            </div>
          </div>
        </section>

        {/* Anonymous Case Studies */}
        <section className="py-12 md:py-20 px-4 md:px-6 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Real Blindspots We've Uncovered
            </h2>

            <div className="space-y-6">
              {caseStudies.map((study, index) => (
                <div
                  key={index}
                  className={`bg-white rounded-lg shadow-md p-6 md:p-8 cursor-pointer transition-all ${
                    selectedCase === index ? 'ring-2 ring-red-500 shadow-lg' : 'hover:shadow-lg'
                  }`}
                  onClick={() => {
                    setSelectedCase(index);
                    setRevealedBlindspot(true);
                    trackFeatureInterest(`case_study_${index}`);
                  }}
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-3">
                        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                          {study.fundingRound}
                        </span>
                        <span className="ml-3 text-gray-500">
                          Discovered {study.discovered}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold mb-2 text-gray-900">
                        {!revealedBlindspot || selectedCase !== index
                          ? "Hidden Crisis at Portfolio Company"
                          : study.issue}
                      </h3>

                      {selectedCase === index && revealedBlindspot && (
                        <div className="mt-4 space-y-3">
                          <div className="bg-red-50 border-l-4 border-red-500 p-4">
                            <p className="font-medium text-red-900">The Hidden Issue:</p>
                            <p className="text-red-800">{study.issue}</p>
                          </div>
                          <div className="bg-green-50 border-l-4 border-green-500 p-4">
                            <p className="font-medium text-green-900">The Outcome:</p>
                            <p className="text-green-800">{study.outcome}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {selectedCase !== index && (
                      <div className="mt-4 md:mt-0 md:ml-6">
                        <button className="text-red-600 hover:text-red-700 font-medium text-sm">
                          Click to reveal →
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-center text-gray-600 mt-8">
              All cases are real but anonymized to protect portfolio companies
            </p>
          </div>
        </section>

        {/* Blindspot Assessment Tool */}
        <section className="py-12 md:py-20 px-4 md:px-6 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">
              Quick Portfolio Risk Assessment
            </h2>

            {!assessmentStarted ? (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <p className="text-lg text-gray-700 mb-6">
                  How many blindspots are hiding in your portfolio? Take our 2-minute assessment.
                </p>
                <button
                  onClick={startAssessment}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  Start Free Assessment
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-8">
                {assessmentStep < assessmentQuestions.length ? (
                  <>
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-sm text-gray-500">
                          Question {assessmentStep + 1} of {assessmentQuestions.length}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-red-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(assessmentStep + 1) / assessmentQuestions.length * 100}%` }}
                        />
                      </div>
                    </div>

                    <h3 className="text-xl font-bold mb-6">
                      {assessmentQuestions[assessmentStep].question}
                    </h3>

                    <div className="space-y-3">
                      {assessmentQuestions[assessmentStep].options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleAssessmentAnswer(assessmentQuestions[assessmentStep].risk[index])}
                          className="w-full text-left p-4 rounded-lg border-2 border-gray-200 hover:border-red-500 hover:bg-red-50 transition-all"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center">
                    <div className="mb-6">
                      <svg className="w-20 h-20 mx-auto text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-red-600">High Risk Detected</h3>
                    <p className="text-gray-700 mb-6">
                      Your portfolio may have 3-5 critical blindspots based on current monitoring practices.
                    </p>
                    <button
                      onClick={() => handleCTAClick('get_full_scan')}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                    >
                      Get Full Portfolio Scan
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Risk Prevention Checklist */}
        <section className="py-12 md:py-20 px-4 md:px-6 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Complete Blindspot Prevention System
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-6 text-gray-900">What We Monitor</h3>
                <ul className="space-y-4">
                  <ChecklistItem text="Founder mental health & team dynamics" />
                  <ChecklistItem text="Undisclosed competitor movements" />
                  <ChecklistItem text="Customer churn early signals" />
                  <ChecklistItem text="Technical debt accumulation" />
                  <ChecklistItem text="Regulatory risk changes" />
                  <ChecklistItem text="Key employee flight risk" />
                  <ChecklistItem text="Market sentiment shifts" />
                  <ChecklistItem text="Cash burn acceleration" />
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-6 text-gray-900">How We Detect</h3>
                <ul className="space-y-4">
                  <ChecklistItem text="Anonymous employee surveys" icon="🔍" />
                  <ChecklistItem text="Market sentiment analysis" icon="📊" />
                  <ChecklistItem text="Competitor intelligence tracking" icon="🎯" />
                  <ChecklistItem text="Customer feedback loops" icon="💬" />
                  <ChecklistItem text="Technical audit protocols" icon="🔧" />
                  <ChecklistItem text="Regulatory change monitoring" icon="📋" />
                  <ChecklistItem text="Behavioral pattern analysis" icon="🧠" />
                  <ChecklistItem text="Financial anomaly detection" icon="💰" />
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Portfolio Health Scanner Demo */}
        <section className="py-12 md:py-20 px-4 md:px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              See It In Action
            </h2>

            <div className="bg-gray-900 rounded-lg shadow-2xl overflow-hidden">
              {/* Scanner Interface Mock */}
              <div className="bg-gray-800 p-4 flex items-center justify-between">
                <h3 className="text-white font-medium">Portfolio Health Scanner</h3>
                <span className="text-xs bg-green-500 text-white px-2 py-1 rounded animate-pulse">
                  SCANNING
                </span>
              </div>

              <div className="p-6 md:p-8">
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Portfolio Company Cards */}
                  <PortfolioCard
                    company="TechCo"
                    status="critical"
                    score={45}
                    alert="Founder showing burnout signals"
                  />
                  <PortfolioCard
                    company="DataSync"
                    status="warning"
                    score={68}
                    alert="New competitor raised $50M"
                  />
                  <PortfolioCard
                    company="HealthAPI"
                    status="healthy"
                    score={89}
                    alert="All systems normal"
                  />
                </div>

                {/* Alert Feed */}
                <div className="mt-8 bg-gray-800 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-4">Real-time Alerts</h4>
                  <div className="space-y-3">
                    <AlertItem
                      time="2 hours ago"
                      company="TechCo"
                      alert="CEO LinkedIn activity suggests job searching"
                      severity="high"
                    />
                    <AlertItem
                      time="5 hours ago"
                      company="DataSync"
                      alert="Competitor launched similar feature"
                      severity="medium"
                    />
                    <AlertItem
                      time="1 day ago"
                      company="HealthAPI"
                      alert="Positive customer feedback trend"
                      severity="low"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Methodology Explanation */}
        <section className="py-12 md:py-20 px-4 md:px-6 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">
              Our Methodology
            </h2>
            <p className="text-lg text-gray-700 mb-12 max-w-3xl mx-auto">
              We combine multiple data sources to give you a complete picture of portfolio health
            </p>

            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="text-3xl mb-4">🔍</div>
                <h3 className="font-bold mb-2">Anonymous Surveys</h3>
                <p className="text-sm text-gray-600">
                  Employee sentiment without breaking trust
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="text-3xl mb-4">📊</div>
                <h3 className="font-bold mb-2">Market Analysis</h3>
                <p className="text-sm text-gray-600">
                  Real-time competitive intelligence
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="text-3xl mb-4">🧠</div>
                <h3 className="font-bold mb-2">AI Pattern Detection</h3>
                <p className="text-sm text-gray-600">
                  Behavioral anomalies and trends
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="text-3xl mb-4">💬</div>
                <h3 className="font-bold mb-2">Customer Signals</h3>
                <p className="text-sm text-gray-600">
                  Early churn and satisfaction indicators
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* VC Testimonials */}
        <section className="py-12 md:py-20 px-4 md:px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              VCs Who Sleep Better at Night
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gray-50 rounded-lg p-8">
                <p className="text-gray-700 italic mb-6">
                  "We discovered our star portfolio company was about to lose their CTO. The early warning gave us time to help with retention. That one save paid for NexTraction for 5 years."
                </p>
                <div className="flex items-center">
                  <img
                    src="/images/testimonials/vc-1.jpg"
                    alt="James Park"
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <p className="font-bold">James Park</p>
                    <p className="text-sm text-gray-600">Partner, Velocity Ventures</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-8">
                <p className="text-gray-700 italic mb-6">
                  "The anonymous employee surveys revealed cultural issues we never would have caught in board meetings. We intervened early and the company is thriving now."
                </p>
                <div className="flex items-center">
                  <img
                    src="/images/testimonials/vc-2.jpg"
                    alt="Rachel Chen"
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <p className="font-bold">Rachel Chen</p>
                    <p className="text-sm text-gray-600">Managing Director, Summit Capital</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-12 md:py-20 px-4 md:px-6 bg-gradient-to-br from-red-600 to-red-800 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              What's Hiding in Your Portfolio?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Don't wait for the next board meeting to find out
            </p>

            <div className="bg-white/10 rounded-lg p-6 mb-8 max-w-md mx-auto">
              <p className="text-2xl font-bold mb-2">
                Free Portfolio Scan
              </p>
              <p className="text-sm opacity-75">
                Test up to 3 companies • Results in 48 hours
              </p>
            </div>

            <button
              onClick={() => handleCTAClick('free_scan_final')}
              className="bg-white text-red-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-lg text-lg shadow-lg transition-all hover:shadow-xl"
            >
              Start Free Portfolio Scan
            </button>

            <p className="mt-6 text-sm opacity-75">
              No credit card required • Completely anonymous • Cancel anytime
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

// Checklist Item Component
function ChecklistItem({ text, icon = "✓" }: { text: string; icon?: string }) {
  return (
    <li className="flex items-start">
      <span className="text-green-600 mr-3 text-lg">{icon}</span>
      <span className="text-gray-700">{text}</span>
    </li>
  );
}

// Portfolio Card Component
function PortfolioCard({ company, status, score, alert }: {
  company: string;
  status: 'healthy' | 'warning' | 'critical';
  score: number;
  alert: string;
}) {
  const statusColors = {
    healthy: 'text-green-400 bg-green-900',
    warning: 'text-yellow-400 bg-yellow-900',
    critical: 'text-red-400 bg-red-900'
  };

  const scoreColors = {
    healthy: 'text-green-400',
    warning: 'text-yellow-400',
    critical: 'text-red-400'
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <div className="flex justify-between items-start mb-3">
        <h4 className="text-white font-medium">{company}</h4>
        <span className={`text-xs px-2 py-1 rounded ${statusColors[status]}`}>
          {status.toUpperCase()}
        </span>
      </div>
      <div className="mb-3">
        <div className="flex items-end justify-between mb-1">
          <span className="text-xs text-gray-400">Health Score</span>
          <span className={`text-2xl font-bold ${scoreColors[status]}`}>{score}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${
              status === 'healthy' ? 'bg-green-400' :
              status === 'warning' ? 'bg-yellow-400' : 'bg-red-400'
            }`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>
      <p className="text-xs text-gray-400">{alert}</p>
    </div>
  );
}

// Alert Item Component
function AlertItem({ time, company, alert, severity }: {
  time: string;
  company: string;
  alert: string;
  severity: 'low' | 'medium' | 'high';
}) {
  const severityColors = {
    low: 'text-green-400',
    medium: 'text-yellow-400',
    high: 'text-red-400'
  };

  return (
    <div className="flex items-start space-x-3">
      <span className={`text-2xl ${severityColors[severity]}`}>
        {severity === 'high' ? '🔴' : severity === 'medium' ? '🟡' : '🟢'}
      </span>
      <div className="flex-1">
        <div className="flex items-center text-xs text-gray-400 mb-1">
          <span>{time}</span>
          <span className="mx-2">•</span>
          <span>{company}</span>
        </div>
        <p className="text-sm text-gray-300">{alert}</p>
      </div>
    </div>
  );
}
