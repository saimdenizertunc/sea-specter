import prisma from '@/lib/prisma'
import { PostCard } from '@/components/PostCard'
import { FadeIn, FadeInStagger, FadeInItem } from '@/components/FadeIn'
import type { Metadata } from 'next'
import { absoluteUrl, siteConfig } from '@/lib/seo'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Archive',
  description: siteConfig.description,
  alternates: {
    canonical: absoluteUrl('/blog'),
  },
  openGraph: {
    title: `Archive — ${siteConfig.name}`,
    description: siteConfig.description,
    type: 'website',
    siteName: siteConfig.name,
    locale: 'en_US',
    url: absoluteUrl('/blog'),
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@seaspecter',
    title: `Archive — ${siteConfig.name}`,
    description: siteConfig.description,
  },
}

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
  })

  return (
    <div className="px-6 pt-28 pb-24 max-w-7xl mx-auto">
      <FadeIn className="mb-20">
        <header>
          <h1 className="font-serif text-[clamp(3rem,10vw,8rem)] leading-none tracking-tighter text-stone-900">
            Archive
          </h1>
          <p className="mt-4 font-sans text-stone-500 text-lg max-w-sm leading-relaxed">
            Every piece, in order.
          </p>
        </header>
      </FadeIn>

      {posts.length === 0 ? (
        <FadeIn delay={0.2}>
          <p className="font-sans text-stone-400 text-center py-24 text-lg">
            No posts published yet.
          </p>
        </FadeIn>
      ) : (
        <FadeInStagger className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-16 grid-flow-dense">
          {posts.map((post, index) => (
            <FadeInItem key={post.id}>
              <PostCard post={post} index={index} />
            </FadeInItem>
          ))}
        </FadeInStagger>
      )}
    </div>
  )
}
