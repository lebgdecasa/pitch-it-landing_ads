// pages/demo-day-prep.tsx
import Head from 'next/head';
import LayoutNoNav from '@/components/layout/LayoutNoNav';
import CountdownTimer from '@/components/ui/CountdownTimer';
import AIPracticeDemoPlaceholder from '@/components/ui/AIPracticeDemoPlaceholder';
import SuccessRateStatsPlaceholder from '@/components/ui/SuccessRateStatsPlaceholder';
import ConfidenceQuizPlaceholder from '@/components/ui/ConfidenceQuizPlaceholder';
import EmailForm from '@/components/forms/EmailForm';
import ExtendedEmailForm from '@/components/forms/ExtendedEmailForm';

export default function DemoDayPrepPage() {
  return (
    <>
      <Head>
        <title>Demo Day Confidence | Pitch Prep | Pitch-it</title>
        <meta name="description" content="Prepare for your demo day with AI investor practice, success stats, and confidence assessment." />
      </Head>
      <LayoutNoNav>
        <section className="hero text-center py-12 bg-gray-100">
          <h1 className="text-4xl font-bold">Major Demo Day coming in X days!</h1>
          {/* Urgency Level A/B Test */}
          <div className="my-4">
            <p className="font-medium mb-1 text-lg">Variant A: Subtle Countdown</p>
            <div className="transform scale-75 inline-block"> {/* Make it smaller */}
              <CountdownTimer />
            </div>
          </div>
          <div className="my-4 p-6 bg-yellow-200 rounded-lg shadow-md">
            <p className="font-medium mb-1 text-lg">Variant B: Prominent Banner</p>
            <p className="text-3xl font-bold text-red-600 animate-pulse">DON'T MISS OUT! DEMO DAY IS APPROACHING!</p> {/* Added pulse animation */}
            <div className="transform scale-125 inline-block mt-2"> {/* Make it larger */}
              <CountdownTimer />
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-3">(Showing both Urgency Level variants for setup)</p>
        </section>

        <AIPracticeDemoPlaceholder />

        {/* Demo Access A/B Test */}
        <section className="demo-access-section py-10 text-center">
          <h2 className="text-3xl font-semibold mb-6">Practice Your Pitch Like a Pro</h2>
          <div className="mb-8">
            <p className="font-medium mb-2 text-lg">Variant A: Instant Demo Access</p>
            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg text-xl shadow-lg hover:shadow-xl transition-shadow">
              Start Practice Demo Now
            </button>
          </div>
          <div>
            <p className="font-medium mb-2 text-lg">Variant B: Email-Gated Demo Access</p>
            {/* Form Length A/B Test within Email-Gated Demo Access */}
            <div className="mb-6 p-6 border rounded-lg max-w-lg mx-auto bg-white shadow-md">
                <p className="font-medium mb-3 text-md">Form Length Variant A: Email Only</p>
                <EmailForm />
            </div>
            <div className="p-6 border rounded-lg max-w-lg mx-auto bg-white shadow-md">
                <p className="font-medium mb-3 text-md">Form Length Variant B: Email + Company Stage</p>
                <ExtendedEmailForm />
            </div>
            <p className="text-sm text-gray-600 mt-3">(Showing both Form Length variants for Email-Gated Demo)</p>
          </div>
          <p className="text-sm text-gray-600 mt-4">(Showing both Demo Access variants for setup)</p>
        </section>

        <SuccessRateStatsPlaceholder />

        {/* Social Proof A/B Test */}
        <section className="social-proof-section py-12 bg-gray-50 text-center">
          <h3 className="text-2xl font-semibold mb-6">Why Top Founders Choose Us</h3>
          <div className="mb-6 p-4 bg-white rounded-lg shadow-sm inline-block mx-2 max-w-sm">
            <p className="font-medium mb-2 text-lg">Variant A: YC Alumni Approved</p>
            <p className="p-3 text-gray-700">[Social Proof: YC Alumni Approved Placeholder - "Used by founders from YC, a16z, and more..."]</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-sm inline-block mx-2 max-w-sm">
            <p className="font-medium mb-2 text-lg">Variant B: Success Metrics</p>
            <p className="p-3 text-gray-700">[Social Proof: 80% Funding Success Rate Placeholder - "Founders who practice with us are 80% more likely to get funded."]</p>
          </div>
          <p className="text-sm text-gray-600 mt-4">(Showing both Social Proof variants for setup)</p>
        </section>

        <ConfidenceQuizPlaceholder />

      </LayoutNoNav>
    </>
  );
}
