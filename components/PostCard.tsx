import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { Post } from '@prisma/client'

// Tiny blurred placeholder for layout stability
const BLUR_DATA_URL =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgcEBf/EAB8QAAICAgMBAQAAAAAAAAAAAAECAwQFERIhMf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCw2rXoY8fNa2la9+3dGOqaSc5JTbk22+bb7t+yQAB/2Q=='

interface PostCardProps {
  post: Post
  index: number
}

export function PostCard({ post, index }: PostCardProps) {
  const isWide = index % 3 === 0
  const isOffset = index % 2 !== 0

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
            blurDataURL={BLUR_DATA_URL}
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
