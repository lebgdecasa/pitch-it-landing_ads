import React from 'react';
import Image from 'next/image';

interface ScreenshotProps {
  src: string;
  alt: string;
}

const Screenshot = ({ src, alt }: ScreenshotProps) => {
  return (
    <div className="mt-6 mb-6 h-48 relative">
      <Image
        src={src}
        alt={alt}
        fill
        className="rounded-lg object-cover"
      />
    </div>
  );
};

export default Screenshot;
