import Head from 'next/head';
import LayoutNoNav from '@/components/layout/LayoutNoNav';
import CountdownTimer from '@/components/ui/CountdownTimer';
import Ticker from '@/components/ui/Ticker';
import Testimonials from '@/components/sections/Testimonials';
import ProcessSteps from '@/components/sections/ProcessSteps';
import EmailForm from '@/components/forms/EmailForm';
import MultiStepForm from '@/components/forms/MultiStepForm';
import LogoBar from '@/components/ui/LogoBar';
import ScreenshotPlaceholder from '@/components/ui/ScreenshotPlaceholder';
import AnimatedProcessPlaceholder from '@/components/ui/AnimatedProcessPlaceholder';

export default function ValidateFastPage() {
  return (
    <>
      <Head>
        <title>Validate Fast | Real User Feedback in 48 Hours | Pitch-it</title>
        <meta name="description" content="Get real user feedback on your startup idea in 48 hours. Validate your concept quickly before building." />
        {/* Add other relevant meta tags, canonical URL, etc. */}
      </Head>
      <LayoutNoNav>
        <section className="hero bg-gray-100 py-20 text-center"> {/* Basic styling */}
          <h1 className="text-4xl font-bold">Real user feedback in 48 hours</h1>
          {/* Hero Visual A/B Test */}
          <div>
            {/* Variant A: Dashboard Screenshot */}
            {/* <ScreenshotPlaceholder /> */}
            {/* Variant B: Animated Process */}
            <AnimatedProcessPlaceholder />
            <p className="text-sm text-gray-500 mt-2">(Showing Variant B: Animated Process. Uncomment ScreenshotPlaceholder for Variant A)</p>
          </div>
          <CountdownTimer />
        </section>

        <section className="cta-section py-10 text-center">
          {/* CTA Button A/B Test */}
          <div>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
              Start Validation {/* Variant A */}
            </button>
            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              Get User Feedback {/* Variant B */}
            </button>
            <p className="text-sm text-gray-500 mt-2">(Showing both CTA variants for setup)</p>
          </div>
        </section>

        <section className="social-proof-section py-10 text-center bg-gray-50">
          <Ticker />
          {/* Social Proof A/B Test */}
          <div className="mt-4">
            {/* Variant A: Text Proof */}
            <p className="text-lg">847 validations this week</p>
            {/* Variant B: Logo Bar */}
            {/* <LogoBar /> */}
            <p className="text-sm text-gray-500 mt-2">(Showing Variant A: Text Proof. Uncomment LogoBar for Variant B)</p>
          </div>
        </section>

        <ProcessSteps />
        <Testimonials testimonials={[{ quote: 'Amazing!', author: 'Founder A', details: 'Saved 2 months' }]} />

        <section className="form-section py-10 text-center">
          {/* Form Style A/B Test */}
          <div className="mb-10">
            <h3 className="text-xl font-semibold mb-3">Variant A: Single Email Field</h3>
            <EmailForm />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-3">Variant B: Multi-Step Qualifier</h3>
            <MultiStepForm />
          </div>
          <p className="text-sm text-gray-500 mt-2">(Showing both form variants for setup)</p>
        </section>

      </LayoutNoNav>
    </>
  );
}
