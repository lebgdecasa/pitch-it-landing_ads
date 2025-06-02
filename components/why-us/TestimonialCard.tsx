import React from 'react';

interface TestimonialCardProps {
  /** The main quote from the testimonial. */
  quote: string;
  /** The name of the person who gave the testimonial. */
  author: string;
  /** The role or title of the author (e.g., "Founder, Acme Corp", "Investor, Future Ventures"). */
  role: string;
  // TODO: PROP: Consider adding an optional `avatarSrc` for an image of the author.
  // TODO: PROP: Consider `companyLogoSrc` if testimonials are tied to companies.
}

/**
 * TestimonialCard displays a single testimonial, including a quote, author, and their role.
 * It's styled with a light gray background, rounded corners, and a subtle shadow.
 *
 * @param {TestimonialCardProps} props - The props for the TestimonialCard component.
 * @returns {JSX.Element} A div element representing the testimonial card.
 */
const TestimonialCard: React.FC<TestimonialCardProps> = ({ quote, author, role }) => {
  // TODO: DATA: Consider if testimonials should be fetched dynamically or if they are static.
  // If dynamic, this component would receive data fetched from a CMS or API.

  return (
    // Card container: light gray background, padding, rounded corners, shadow.
    // p-6 (24px), rounded-lg (8px), mb-4 (16px) - Adheres to 8pt spacing system.
    <div className="bg-gray-50 p-6 rounded-lg shadow-md">
      {/* Quote text: italicized and with bottom margin. */}
      <p className="text-gray-700 italic mb-4">"{quote}"</p>
      {/* Author's name: bold text. */}
      <p className="font-semibold text-gray-900">{author}</p>
      {/* Author's role: smaller text with a distinct color (blue). */}
      <p className="text-sm text-blue-600">{role}</p>
    </div>
  );
};

export default TestimonialCard;
