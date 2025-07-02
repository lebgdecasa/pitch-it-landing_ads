import React from 'react'
import Head from 'next/head'
import Link from 'next/link'

const TermsOfService: React.FC = () => {
  return (
    <>
      <Head>
        <title>Terms of Service | NexTraction</title>
        <meta name="description" content="Terms of Service for our platform" />
      </Head>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="mb-8">
              <Link href="/" className="text-blue-600 hover:text-blue-700 text-sm">
                ← Back to Home
              </Link>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
            <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

            <div className="prose prose-lg max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-700 mb-4">
                  By accessing and using our platform, you accept and agree to be bound by the terms and provision of this agreement.
                  If you do not agree to abide by the above, please do not use this service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Description of Service</h2>
                <p className="text-gray-700 mb-4">
                  Our platform provides project analysis and business intelligence services. We offer tools and features
                  to help users analyze their projects and receive insights about their business ventures.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. User Accounts</h2>
                <div className="text-gray-700 space-y-4">
                  <p>When you create an account with us, you must provide information that is accurate, complete, and current at all times.</p>
                  <p>You are responsible for safeguarding the password and for all activities that occur under your account.</p>
                  <p>We reserve the right to refuse service, terminate accounts, or cancel orders at our sole discretion.</p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. User Content</h2>
                <div className="text-gray-700 space-y-4">
                  <p>You retain rights to any content you submit, post or display on or through the service.</p>
                  <p>By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use,
                     reproduce, modify, and distribute your content solely for the purpose of providing our services.</p>
                  <p>You are solely responsible for your content and the consequences of posting or publishing it.</p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Prohibited Uses</h2>
                <div className="text-gray-700">
                  <p className="mb-2">You may not use our service:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>For any unlawful purpose or to solicit others to perform illegal acts</li>
                    <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                    <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                    <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                    <li>To submit false or misleading information</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Privacy Policy</h2>
                <p className="text-gray-700 mb-4">
                  Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the service,
                  to understand our practices. Our{' '}
                  <Link href="/privacy-policy" className="text-blue-600 hover:text-blue-700 underline">
                    Privacy Policy
                  </Link>
                  {' '}is incorporated into these Terms of Service by reference.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Limitation of Liability</h2>
                <p className="text-gray-700 mb-4">
                  In no event shall our company, nor its directors, employees, partners, agents, suppliers, or affiliates,
                  be liable for any indirect, incidental, special, consequential, or punitive damages, including without
                  limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Termination</h2>
                <p className="text-gray-700 mb-4">
                  We may terminate or suspend your account and bar access to the service immediately, without prior notice
                  or liability, under our sole discretion, for any reason whatsoever and without limitation, including but
                  not limited to a breach of the Terms.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Changes to Terms</h2>
                <p className="text-gray-700 mb-4">
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any time.
                  If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. Contact Information</h2>
                <p className="text-gray-700 mb-4">
                  If you have any questions about these Terms of Service, please contact us at:
                </p>
                <div className="text-gray-700">
                  <p>Email: contact@nextraction.io</p>

                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default TermsOfService
