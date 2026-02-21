import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import prisma from '@/lib/prisma'
import { MdxRenderer } from '@/components/MdxRenderer'
import { FadeIn } from '@/components/FadeIn'

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

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage] : [],
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

  return (
    <article className="min-h-screen pb-24">
      {/* Hero cover image */}
      {post.coverImage && (
        <div className="relative h-[55vh] md:h-[70vh] w-full overflow-hidden">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900/10 via-transparent to-stone-950/60" />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-6">
        {/* Header */}
        <FadeIn className="py-12 md:py-16">
          <Link
            href="/"
            className="inline-block font-sans text-xs text-stone-400 uppercase tracking-widest mb-8 hover:text-stone-600 transition-colors"
          >
            ← Back
          </Link>
          <h1 className="font-serif text-4xl md:text-6xl leading-tight tracking-tight text-stone-900 mb-5">
            {post.title}
          </h1>
          <p className="font-sans text-lg text-stone-500 leading-relaxed mb-6">{post.excerpt}</p>
          {post.publishedAt && (
            <time className="font-sans text-xs text-stone-400 uppercase tracking-widest">
              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          )}
          <div className="mt-10 h-px bg-stone-200" />
        </FadeIn>

        {/* MDX content */}
        <div className="pb-16">
          <MdxRenderer source={post.content} />
        </div>
      </div>
    </article>
  )
}
