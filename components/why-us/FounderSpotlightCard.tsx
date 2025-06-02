import React from 'react';
import Image from 'next/image';
import IconWrapper from '@/components/ui/IconWrapper';

interface FounderSpotlightCardProps {
  /** Founder's full name. */
  name: string;
  /** Founder's title or role (e.g., "Founder & CEO"). */
  title: string;
  /** A brief biography of the founder. */
  bio: string;
  /** Source URL for the founder's image. Can be a path to a local image in `/public` or an external URL.
   *  Use 'placeholder' to show a generic icon.
   */
  imageSrc: string;
  /** Alt text for the founder's image, for accessibility. */
  imageAlt: string;
  // TODO: PROP: Consider adding `linkedInUrl` or other social media links.
}

/**
 * FounderSpotlightCard displays information about a founder, including their image,
 * name, title, and a short biography. It's designed for use in a "Meet Our Founders" section.
 * The card uses Next.js `Image` component for optimized image loading.
 *
 * @param {FounderSpotlightCardProps} props - The props for the FounderSpotlightCard component.
 * @returns {JSX.Element} A div element representing the founder card.
 */
const FounderSpotlightCard: React.FC<FounderSpotlightCardProps> = ({ name, title, bio, imageSrc, imageAlt }) => {
  // TODO: DATA: Founder bios and images are currently static. Consider if this data needs to be fetched
  // dynamically if it changes often or is managed in a CMS.

  return (
    // Card container: white background, padding, rounded corners, prominent shadow.
    // Text is centered. Flex properties for use in carousel/row layout.
    // p-6 (24px), rounded-lg (8px), mb-4 (16px), mb-1 (4px), mb-3 (12px) - Adheres to 8pt spacing system.
    // w-full md:w-[calc(50%-1rem)] allows for two cards side-by-side on medium screens with a gap (1rem = 16px).
    <div className="bg-white p-6 rounded-lg shadow-xl text-center flex-shrink-0 w-full md:w-[calc(50%-1rem)] snap-center">
      {/* Image container: relative positioning, fixed size, centered with mx-auto.
          w-32 (128px), h-32 (128px) - Adheres to 8pt spacing system.
      */}
      <div className="relative w-32 h-32 mx-auto mb-4">
        {imageSrc === 'placeholder' ? (
          // Placeholder shown if imageSrc is 'placeholder'.
          // TODO: ICON: Replace generic IconWrapper with a more specific placeholder icon if desired.
          <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center">
            <IconWrapper className="w-16 h-16 text-gray-500" /> {/* w-16 (64px), h-16 (64px) */}
          </div>
        ) : (
          // Actual founder image using Next.js Image component for optimization.
          // TODO: IMAGE: Replace placeholder `imageSrc` values in `pages/why-us.tsx` with actual paths,
          // e.g., /images/karim.png. Ensure images are optimized and added to /public/images.
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={128} // Corresponds to w-32
            height={128} // Corresponds to h-32
            className="rounded-full object-cover" // Ensures image is circular and covers the area.
            loading="lazy" // Basic lazy loading.
          />
        )}
      </div>
      {/* Founder's name */}
      <h3 className="text-2xl font-semibold mb-1">{name}</h3>
      {/* Founder's title */}
      <p className="text-blue-600 mb-3">{title}</p>
      {/* Founder's biography */}
      <p className="text-gray-600 text-sm">{bio}</p>
    </div>
  );
};

export default FounderSpotlightCard;
