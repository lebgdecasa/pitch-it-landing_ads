import Head from 'next/head';
import { useRouter } from 'next/router';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  author?: string;
  keywords?: string[];
  noindex?: boolean;
}

const SEO = ({
  title = 'NexTraction | AI-Powered Platform for Founders & VCs',
  description = 'Transform your startup journey with AI-driven pitch deck creation, market validation, and investor preparation. Join 500+ founders and VCs using NexTraction.',
  image = 'https://NexTraction-landing-updated.vercel.app/images/og-image.jpg',
  type = 'website',
  publishedTime,
  author,
  keywords = ['pitch deck', 'startup', 'AI', 'venture capital', 'fundraising', 'market validation'],
  noindex = false
}: SEOProps) => {
  const router = useRouter();
  const siteUrl = 'https://NexTraction-landing-updated.vercel.app';
  const currentUrl = `${siteUrl}${router.asPath}`;

  // Structured data for organization
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "NexTraction",
    "url": siteUrl,
    "logo_final": `${siteUrl}/images/logo_final.svg`,
    "sameAs": [
      "https://twitter.com/pitchitai",
      "https://linkedin.com/company/NexTraction",
      "https://github.com/NexTraction"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "hello@NexTraction.ai",
      "contactType": "customer support"
    }
  };

  // Structured data for website
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "NexTraction",
    "url": siteUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${siteUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  // Article schema for blog posts
  const articleSchema = type === 'article' ? {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "image": image,
    "datePublished": publishedTime,
    "author": {
      "@type": "Person",
      "name": author
    },
    "publisher": {
      "@type": "Organization",
      "name": "NexTraction",
      "logo_final": {
        "@type": "ImageObject",
        "url": `${siteUrl}/images/logo_final.svg`
      }
    }
  } : null;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <link rel="canonical" href={currentUrl} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}

      {/* OpenGraph Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="NexTraction" />
      <meta property="og:locale" content="en_US" />

      {/* Article specific */}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {author && <meta property="article:author" content={author} />}

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@pitchitai" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Mobile & PWA */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#1E40AF" />
      <link rel="manifest" href="/manifest.json" />

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      {articleSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
      )}
    </Head>
  );
};

export default SEO;
