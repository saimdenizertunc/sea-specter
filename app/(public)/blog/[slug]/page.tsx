import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import prisma from '@/lib/prisma'
import { MdxRenderer } from '@/components/MdxRenderer'
import { FadeIn } from '@/components/FadeIn'
import { ArticleLayout } from '@/components/ArticleLayout'

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
    select: { title: true, excerpt: true, coverImage: true },
  })

  if (!post) return { title: 'Post Not Found' }

  const metadataImage = post.coverImage

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: metadataImage ? [metadataImage] : [],
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

  return (
    <ArticleLayout>
      <article className="pb-24">
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
            <h1 className="font-sans font-bold text-6xl md:text-8xl leading-[0.9] tracking-tighter text-swaddle-ink mb-8">
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
