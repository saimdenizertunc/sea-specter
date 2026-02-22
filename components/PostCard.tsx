import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { Post } from '@prisma/client'

function makeBlurDataUrl(seed: string): string {
  let hash = 0
  for (let i = 0; i < seed.length; i += 1) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash)
  }

  const hueA = Math.abs(hash) % 360
  const hueB = (hueA + 40) % 360
  const svg = `
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'>
      <defs>
        <linearGradient id='g' x1='0%' y1='0%' x2='100%' y2='100%'>
          <stop offset='0%' stop-color='hsl(${hueA} 22% 86%)' />
          <stop offset='100%' stop-color='hsl(${hueB} 18% 78%)' />
        </linearGradient>
      </defs>
      <rect width='64' height='64' fill='url(#g)' />
    </svg>
  `

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

interface PostCardProps {
  post: Post
  index: number
}

export function PostCard({ post, index }: PostCardProps) {
  const isWide = index % 3 === 0
  const isOffset = index % 2 !== 0
  const blurDataUrl = makeBlurDataUrl(post.slug || post.title)

  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn(
        'group block',
        isWide && 'md:col-span-2',
        isOffset && 'md:translate-y-12',
      )}
    >
      <div
        className={cn(
          'relative w-full overflow-hidden rounded-sm bg-stone-100',
          isWide ? 'aspect-[16/9]' : 'aspect-[3/4]',
        )}
      >
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes={isWide ? '(max-width: 768px) 100vw, 66vw' : '(max-width: 768px) 100vw, 33vw'}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            placeholder="blur"
            blurDataURL={blurDataUrl}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-stone-100">
            <span className="font-serif text-stone-300 text-4xl">&nbsp;</span>
          </div>
        )}
      </div>

      <div className="mt-4 space-y-1.5">
        <h2
          className={cn(
            'font-serif leading-snug text-stone-900 group-hover:underline underline-offset-4 decoration-stone-400',
            isWide ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl',
          )}
        >
          {post.title}
        </h2>
        <p className="font-sans text-sm text-stone-500 line-clamp-2 leading-relaxed">
          {post.excerpt}
        </p>
        {post.publishedAt && (
          <time className="block font-sans text-xs text-stone-400 tracking-wide uppercase">
            {new Date(post.publishedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        )}
      </div>
    </Link>
  )
}
