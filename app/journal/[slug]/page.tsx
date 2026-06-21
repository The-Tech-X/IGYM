import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createPublicClient } from '@/lib/supabase/public';
import { MOCK_ARTICLE_DETAILS, MOCK_ARTICLES } from '@/lib/mock-data';
import { tiptapToHtml } from '@/lib/utils/tiptapToHtml';
import ArticleSidebar from '@/components/journal/ArticleSidebar';
import ParallaxImage from '@/components/ui/ParallaxImage';
import GoldDivider from '@/components/ui/GoldDivider';

type Props = {
  params: Promise<{ slug: string }>;
};

const HERO_FALLBACK = 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=1200';
const AVATAR_FALLBACK = 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80&w=200';

// Fetch a single published post by slug
async function getPost(slug: string) {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from('journal_posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();
  return data;
}

// Generate metadata for each post
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = (await getPost(slug)) ?? MOCK_ARTICLE_DETAILS[slug];
  if (!post) return { title: 'Article Not Found | IGYM' };

  const ogImage = post.og_image_url || post.cover_image_url;
  return {
    title: post.meta_title || `${post.title} | IGYM Journal`,
    description: post.meta_description || post.excerpt || undefined,
    alternates: {
      canonical: post.canonical_url || `https://igym.in/journal/${slug}`,
    },
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt || undefined,
      images: ogImage ? [ogImage] : undefined,
      type: 'article',
      publishedTime: post.published_at || undefined,
      authors: post.author_name ? [post.author_name] : undefined,
    },
  };
}

// Generate static routes for all published posts
export async function generateStaticParams() {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from('journal_posts')
    .select('slug')
    .eq('is_published', true);

  if (data && data.length > 0) return data.map((p) => ({ slug: p.slug }));
  return MOCK_ARTICLES.map((a) => ({ slug: a.slug }));
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = (await getPost(slug)) ?? MOCK_ARTICLE_DETAILS[slug];

  if (!post) {
    notFound();
  }

  // Render TipTap JSON body → HTML server-side (dependency-free, server-safe)
  const bodyHtml = tiptapToHtml(post.body);

  // Related: 3 other published posts, newest first
  const supabase = createPublicClient();
  const { data: relatedData } = await supabase
    .from('journal_posts')
    .select('title, slug, category, cover_image_url, published_at')
    .eq('is_published', true)
    .neq('slug', slug)
    .order('published_at', { ascending: false })
    .limit(3);

  const relatedPosts = (relatedData && relatedData.length > 0)
    ? relatedData
    : MOCK_ARTICLES.filter((a) => a.slug !== slug).map((a) => ({
        title: a.title,
        slug: a.slug,
        category: a.category,
        cover_image_url: a.image,
        published_at: null as string | null,
      }));

  const formattedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : '';
  const readTime = `${post.read_time_minutes ?? 1} min read`;

  // schema.org Article JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    author: { '@type': 'Person', name: post.author_name },
    datePublished: post.published_at,
    dateModified: post.updated_at,
    image: post.cover_image_url || undefined,
    publisher: {
      '@type': 'Organization',
      name: 'iGym',
      logo: { '@type': 'ImageObject', url: 'https://igym.in/favicon.ico' },
    },
  };

  return (
    <article className="bg-white min-h-screen text-charcoal">

      {/* schema.org Article JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* 60vh Parallax Hero Image */}
      <section className="relative w-full h-[60vh] bg-charcoal">
        <ParallaxImage
          src={post.cover_image_url || HERO_FALLBACK}
          alt={post.title}
          containerClassName="w-full h-full"
        />
        {/* Dark overlay for text readability on load transitions if any */}
        <div className="absolute inset-0 bg-black/10 pointer-events-none" />
      </section>

      {/* Main Content Layout */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* Left / Middle: Centered Content Column (covers 8 columns on desktop) */}
          <div className="lg:col-span-8 max-w-2xl mx-auto w-full">

            {/* Eyebrow / Category */}
            <span className="inline-block px-3 py-1 bg-gold/10 text-gold border border-gold/20 text-[10px] font-body uppercase tracking-widest font-medium mb-4">
              {post.category}
            </span>

            {/* Headline */}
            <h1 className="text-[36px] sm:text-[48px] md:text-[56px] font-display font-light text-charcoal leading-tight mb-6">
              {post.title}
            </h1>

            {/* Byline */}
            <div className="flex items-center space-x-4 mb-8">
              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-beige-mid flex-shrink-0">
                <Image
                  src={post.author_avatar_url || AVATAR_FALLBACK}
                  alt={post.author_name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-[13px] font-body font-light text-gray-muted">
                <p className="font-medium text-charcoal">{post.author_name}</p>
                <p>{formattedDate} · {readTime}</p>
              </div>
            </div>

            <GoldDivider className="mb-10" />

            {/* Article Content Container */}
            <div id="article-content" className="prose max-w-none">
              <div className="article-body" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
            </div>

          </div>

          {/* Right Column: Sticky Sidebar (covers 4 columns on desktop) */}
          <div className="lg:col-span-4">
            <ArticleSidebar relatedPosts={relatedPosts.map(p => ({ title: p.title, slug: p.slug, category: p.category }))} />
          </div>

        </div>
      </section>

      {/* Footer / More from the Journal */}
      <section className="bg-beige-light/50 border-t border-beige-dark/50 py-20">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24">
          <h2 className="text-[28px] md:text-[32px] font-display font-light text-charcoal mb-12 text-center lg:text-left">
            More from the Journal
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedPosts.map((rPost) => (
              <div key={rPost.slug} className="flex flex-col bg-white border border-beige-dark/45 group cursor-pointer relative justify-between h-full">
                <div>
                  <Link href={`/journal/${rPost.slug}`} className="relative aspect-[16/10] overflow-hidden block bg-charcoal-mid">
                    <Image
                      src={rPost.cover_image_url || HERO_FALLBACK}
                      alt={rPost.title}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-103"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <span className="absolute top-4 left-4 z-10 px-2 py-0.5 text-[9px] font-body uppercase tracking-widest bg-charcoal text-white">
                      {rPost.category}
                    </span>
                  </Link>

                  <div className="p-6 space-y-3">
                    <span className="text-[11px] font-body uppercase tracking-[0.1em] text-gray-muted">
                      {rPost.published_at
                        ? new Date(rPost.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                        : ''}
                    </span>
                    <h3 className="text-[18px] md:text-[20px] font-display font-light text-charcoal leading-snug group-hover:text-gold transition-colors">
                      <Link href={`/journal/${rPost.slug}`}>
                        {rPost.title}
                      </Link>
                    </h3>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2">
                  <Link
                    href={`/journal/${rPost.slug}`}
                    className="text-[11px] font-body uppercase tracking-[0.15em] text-gold font-medium group/link"
                  >
                    Read →
                  </Link>
                </div>

                {/* Bottom line */}
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gold scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

    </article>
  );
}
