import React from 'react';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import SEO from '@/components/SEO';
import { trackButtonClick } from '@/utils/analytics';

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
  readTime: string;
  image: string;
}

const blogPosts: BlogPost[] = [
  {
    slug: 'how-to-pitch-to-vcs',
    title: 'The Ultimate Guide to Pitching VCs in 2025',
    excerpt: 'Learn the proven strategies that helped 100+ founders secure funding. From deck structure to Q&A preparation.',
    date: '2025-01-15',
    author: 'Alex Thompson',
    category: 'Fundraising',
    readTime: '8 min read',
    image: '/images/blog/pitch-vcs.jpg'
  },
  {
    slug: 'market-validation-guide',
    title: 'Market Validation: Test Your Idea Before Building',
    excerpt: 'Save months and thousands of dollars by validating your startup idea with real customer data.',
    date: '2025-01-10',
    author: 'Dr. Maria Garcia',
    category: 'Strategy',
    readTime: '6 min read',
    image: '/images/blog/market-validation.jpg'
  },
  {
    slug: 'ai-in-fundraising',
    title: 'How AI is Transforming Startup Fundraising',
    excerpt: 'Discover how artificial intelligence is changing the game for both founders and investors.',
    date: '2025-01-05',
    author: 'Alex Thompson',
    category: 'Technology',
    readTime: '5 min read',
    image: '/images/blog/ai-fundraising.jpg'
  }
];

export default function BlogPage() {
  const handleReadMore = (slug: string) => {
    trackButtonClick('blog_read_more', slug);
  };

  return (
    <>
      <SEO
        title="Blog | NexTraction - Insights for Founders & VCs"
        description="Expert insights on fundraising, pitch decks, market validation, and startup strategy. Learn from successful founders and VCs."
        keywords={['startup blog', 'fundraising tips', 'pitch deck guide', 'VC insights']}
      />

      <Layout onOpenDemoModal={() => {}}>
        <div className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            {/* Header */}
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Insights & Resources</h1>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Expert advice, industry insights, and practical guides to help you navigate the fundraising journey.
              </p>
            </div>

            {/* Featured Post */}
            <div className="mb-16">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-1/2">
                    <img
                      src={blogPosts[0].image}
                      alt={blogPosts[0].title}
                      className="w-full h-64 md:h-full object-cover"
                    />
                  </div>
                  <div className="md:w-1/2 p-8 md:p-12">
                    <div className="flex items-center mb-4">
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                        Featured
                      </span>
                      <span className="ml-4 text-gray-500">{blogPosts[0].readTime}</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">
                      <Link href={`/blog/${blogPosts[0].slug}`}>
                        <a className="hover:text-blue-600 transition-colors">
                          {blogPosts[0].title}
                        </a>
                      </Link>
                    </h2>
                    <p className="text-gray-600 mb-6">{blogPosts[0].excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        By {blogPosts[0].author} • {new Date(blogPosts[0].date).toLocaleDateString()}
                      </div>
                      <Link href={`/blog/${blogPosts[0].slug}`}>
                        <a
                          className="text-blue-600 hover:text-blue-700 font-medium"
                          onClick={() => handleReadMore(blogPosts[0].slug)}
                        >
                          Read More →
                        </a>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Blog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.slice(1).map((post) => (
                <article key={post.slug} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <span className="text-blue-600 text-sm font-medium">{post.category}</span>
                      <span className="mx-2 text-gray-300">•</span>
                      <span className="text-gray-500 text-sm">{post.readTime}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-3">
                      <Link href={`/blog/${post.slug}`}>
                        <a className="hover:text-blue-600 transition-colors">
                          {post.title}
                        </a>
                      </Link>
                    </h3>
                    <p className="text-gray-600 mb-4">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        {new Date(post.date).toLocaleDateString()}
                      </div>
                      <Link href={`/blog/${post.slug}`}>
                        <a
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          onClick={() => handleReadMore(post.slug)}
                        >
                          Read →
                        </a>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Newsletter CTA */}
            <div className="mt-16 bg-blue-600 rounded-xl p-8 md:p-12 text-center text-white">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Get Weekly Insights</h2>
              <p className="text-lg mb-6 max-w-2xl mx-auto">
                Join 5,000+ founders and VCs receiving our weekly newsletter with fundraising tips and market insights.
              </p>
              <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button
                  type="submit"
                  className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-6 py-3 rounded-lg transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
