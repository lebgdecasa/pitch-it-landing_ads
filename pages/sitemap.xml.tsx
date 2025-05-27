import { GetServerSideProps } from 'next';

const Sitemap = () => null;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const baseUrl = 'https://NexVC-landing-updated.vercel.app';

  // Define your static pages
  const staticPages = [
    '',
    '/about',
    '/features',
    '/pricing',
    '/blog',
    '/contact',
    '/privacy',
    '/terms'
  ];

  // In production, you'd fetch dynamic pages from your CMS/database
  const blogPosts = [
    '/blog/how-to-pitch-to-vcs',
    '/blog/market-validation-guide',
    '/blog/ai-in-fundraising'
  ];

  const allPages = [...staticPages, ...blogPosts];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${allPages
        .map((page) => {
          return `
            <url>
              <loc>${baseUrl}${page}</loc>
              <lastmod>${new Date().toISOString()}</lastmod>
              <changefreq>${page === '' ? 'daily' : 'weekly'}</changefreq>
              <priority>${page === '' ? '1.0' : '0.8'}</priority>
            </url>
          `;
        })
        .join('')}
    </urlset>
  `;

  res.setHeader('Content-Type', 'text/xml');
  res.setHeader('Cache-Control', 'public, s-maxage=1200, stale-while-revalidate=600');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default Sitemap;
