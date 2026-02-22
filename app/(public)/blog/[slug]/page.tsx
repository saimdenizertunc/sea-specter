import { notFound } from 'next/navigation'
import Image from 'next/image'
import type { Metadata } from 'next'
import prisma from '@/lib/prisma'
import { MdxRenderer } from '@/components/MdxRenderer'
import { FadeIn } from '@/components/FadeIn'
import { ArticleLayout } from '@/components/ArticleLayout'
import { absoluteUrl, siteConfig } from '@/lib/seo'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    select: { slug: true },
  })
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await prisma.post.findUnique({
    where: { slug, published: true },
    select: { title: true, excerpt: true, coverImage: true, publishedAt: true, updatedAt: true },
  })

  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested post does not exist or is not published.',
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const canonicalUrl = absoluteUrl(`/blog/${slug}`)
  const metadataImage = post.coverImage ?? '/logo.png'
  const keywordPool = new Set([
    ...siteConfig.keywords,
    ...post.title.toLowerCase().split(/\s+/).filter(Boolean),
  ])

  const publishedOn = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null
  const metadataDescription = publishedOn
    ? `${post.excerpt} Published on ${publishedOn}.`
    : post.excerpt

  return {
    title: post.title,
    description: metadataDescription,
    keywords: Array.from(keywordPool).slice(0, 15),
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
      },
    },
    openGraph: {
      title: post.title,
      description: metadataDescription,
      type: 'article',
      siteName: siteConfig.name,
      locale: 'en_US',
      url: canonicalUrl,
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      images: [
        {
          url: metadataImage,
          alt: post.title,
        },
      ],
    },
    twitter: {
      title: post.title,
      description: metadataDescription,
      images: [metadataImage],
      card: 'summary_large_image',
      creator: '@seaspecter',
    },
  }
}

export const revalidate = 60

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = await prisma.post.findUnique({
    where: { slug, published: true },
  })

  if (!post) notFound()

  const heroImage = post.coverImage
  const canonicalUrl = absoluteUrl(`/blog/${slug}`)
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    mainEntityOfPage: canonicalUrl,
    image: heroImage ? [heroImage] : [absoluteUrl('/logo.png')],
    author: {
      '@type': 'Person',
      name: 'sea-specter editorial',
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl('/logo.png'),
      },
    },
    articleSection: 'Blog',
    url: canonicalUrl,
  }

  return (
    <ArticleLayout>
      <article className="pb-24">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />

        {/* Hero cover image */}
        {heroImage && (
          <div className="relative h-[60vh] md:h-[80vh] w-full overflow-hidden border-b-[1px] border-swaddle-ink">
            <Image
              src={heroImage}
              alt={post.title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
        )}

        <div className="max-w-3xl mx-auto px-6">
          {/* Header */}
          <FadeIn className="pt-20 pb-16 md:pt-32 md:pb-24">
            <h1 className="font-sans font-bold text-[clamp(2.6rem,9vw,6.4rem)] leading-[0.9] tracking-tighter text-swaddle-ink mb-8">
              {post.title}
            </h1>
            <p className="font-sans text-xl md:text-2xl text-swaddle-ink/80 leading-[1.6] mb-8">{post.excerpt}</p>
            {post.publishedAt && (
              <time className="font-mono text-sm text-swaddle-ink/60 uppercase tracking-widest block">
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            )}
            <div className="mt-16 h-px bg-swaddle-ink/20" />
          </FadeIn>

          {/* MDX content */}
          <div className="pb-16 text-swaddle-ink">
            <MdxRenderer source={post.content} />
          </div>
        </div>
      </article>
    </ArticleLayout>
  )
}
