import prisma from '@/lib/prisma'
import { PostCard } from '@/components/PostCard'
import { FadeIn, FadeInStagger, FadeInItem } from '@/components/FadeIn'

export const revalidate = 60

export default async function HomePage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
  })

  return (
    <div className="px-6 pt-28 pb-24 max-w-7xl mx-auto">
      {/* Hero headline */}
      <FadeIn className="mb-20">
        <header>
          <h1 className="font-serif text-[clamp(3rem,10vw,8rem)] leading-none tracking-tighter text-stone-900">
            sea-specter
          </h1>
          <p className="mt-4 font-sans text-stone-500 text-lg max-w-sm leading-relaxed">
            An editorial on design, culture, and the spaces between.
          </p>
        </header>
      </FadeIn>

      {/* Post grid */}
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
