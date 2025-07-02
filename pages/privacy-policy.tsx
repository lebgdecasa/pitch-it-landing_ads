import React from 'react'
import Head from 'next/head'
import Link from 'next/link'

const PrivacyPolicy: React.FC = () => {
  return (
    <>
      <Head>
        <title>Privacy Policy | NexTraction</title>
        <meta name="description" content="Privacy Policy for NexTraction" />
      </Head>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="mb-8">
              <Link href="/" className="text-blue-600 hover:text-blue-700 text-sm">
                ← Back to Home
              </Link>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
            <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

            <div className="prose prose-lg max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Information We Collect</h2>
                <div className="text-gray-700 space-y-4">
                  <h3 className="text-lg font-medium">Personal Information</h3>
                  <p>We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support.</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Email address</li>
                    <li>Name and contact information</li>
                    <li>Project data and descriptions you submit</li>
                    <li>Communication preferences</li>
                  </ul>

                  <h3 className="text-lg font-medium">Usage Information</h3>
                  <p>We automatically collect certain information about your use of our services:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Log data (IP address, browser type, pages visited)</li>
                    <li>Device information</li>
                    <li>Usage patterns and preferences</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. How We Use Your Information</h2>
                <div className="text-gray-700">
                  <p className="mb-2">We use the information we collect to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Provide, maintain, and improve our services</li>
                    <li>Process transactions and send related information</li>
                    <li>Send technical notices, updates, and support messages</li>
                    <li>Respond to your comments, questions, and requests</li>
                    <li>Analyze usage patterns to improve user experience</li>
                    <li>Send you notifications about project status updates (if you opt-in)</li>
                    <li>Comply with legal obligations</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Information Sharing</h2>
                <div className="text-gray-700 space-y-4">
                  <p>We do not sell, trade, or otherwise transfer your personal information to third parties except in the following circumstances:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Service Providers:</strong> We may share information with trusted third parties who assist us in operating our platform</li>
                    <li><strong>Legal Requirements:</strong> When required by law, regulation, or legal process</li>
                    <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                    <li><strong>Consent:</strong> When you give us explicit consent to share your information</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Data Security</h2>
                <p className="text-gray-700 mb-4">
                  We implement appropriate technical and organizational measures to protect your personal information against
                  unauthorized access, alteration, disclosure, or destruction. This includes encryption, secure data transmission,
                  and regular security assessments.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Email Communications</h2>
                <div className="text-gray-700 space-y-4">
                  <p>We may send you different types of email communications:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Transactional emails:</strong> Account verification, password resets, and service-related updates</li>
                    <li><strong>Project notifications:</strong> Updates about your project analysis status (only if you opt-in during onboarding)</li>
                    <li><strong>Service updates:</strong> Important changes to our platform or policies</li>
                  </ul>
                  <p>You can unsubscribe from non-essential communications at any time using the unsubscribe link in emails or by updating your account preferences.</p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Data Retention</h2>
                <p className="text-gray-700 mb-4">
                  We retain your personal information for as long as your account is active or as needed to provide you services.
                  We will also retain and use your information as necessary to comply with legal obligations, resolve disputes,
                  and enforce our agreements.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Your Rights</h2>
                <div className="text-gray-700">
                  <p className="mb-2">You have the right to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Access and update your personal information</li>
                    <li>Request deletion of your personal data</li>
                    <li>Object to processing of your personal data</li>
                    <li>Request data portability</li>
                    <li>Withdraw consent where processing is based on consent</li>
                  </ul>
                  <p className="mt-4">To exercise these rights, please contact us at the information provided below.</p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Cookies and Tracking</h2>
                <p className="text-gray-700 mb-4">
                  We use cookies and similar tracking technologies to provide functionality and improve your experience.
                  You can control cookie settings through your browser preferences, though some features may not function properly if cookies are disabled.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Children's Privacy</h2>
                <p className="text-gray-700 mb-4">
                  Our service is not intended for children under 13 years of age. We do not knowingly collect personal
                  information from children under 13. If you are a parent or guardian and believe your child has provided
                  us with personal information, please contact us.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. Changes to This Policy</h2>
                <p className="text-gray-700 mb-4">
                  We may update this privacy policy from time to time. We will notify you of any changes by posting the
                  new privacy policy on this page and updating the "Last updated" date.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">11. Contact Us</h2>
                <p className="text-gray-700 mb-4">
                  If you have any questions about this Privacy Policy, please contact us:
                </p>
                <div className="text-gray-700">
                  <p>Email: privacy@yourcompany.com</p>
                  <p>Address: Your Company Address</p>
                  <p>Phone: (555) 123-4567</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default PrivacyPolicy
