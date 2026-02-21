import { notFound } from 'next/navigation'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import { PostForm } from '@/components/PostForm'
import { publishPost } from '@/actions/posts'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function AdminPostPage({ params }: PageProps) {
  const { id } = await params
  const isNew = id === 'new'

  if (isNew) {
    return (
      <div>
        <div className="flex items-center gap-3 mb-8">
          <Link href="/admin" className="font-sans text-sm text-stone-400 hover:text-stone-700">
            ← Dashboard
          </Link>
          <span className="text-stone-200">/</span>
          <h1 className="font-serif text-2xl text-stone-900">New Post</h1>
        </div>
        <PostForm />
      </div>
    )
  }

  const post = await prisma.post.findUnique({ where: { id } })
  if (!post) notFound()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="font-sans text-sm text-stone-400 hover:text-stone-700">
            ← Dashboard
          </Link>
          <span className="text-stone-200">/</span>
          <h1 className="font-serif text-2xl text-stone-900 truncate max-w-xs">{post.title}</h1>
        </div>

        <div className="flex items-center gap-2">
          {post.published && (
            <Link
              href={`/blog/${post.slug}`}
              target="_blank"
              className="font-sans text-xs text-stone-500 hover:text-stone-800 transition-colors"
            >
              View live ↗
            </Link>
          )}
          <span
            className={cn(
              'font-sans text-xs px-2 py-1 rounded-full',
              post.published
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-stone-100 text-stone-500',
            )}
          >
            {post.published ? 'Published' : 'Draft'}
          </span>
          <form action={publishPost.bind(null, post.id)}>
            <Button type="submit" variant="outline" className="h-7 px-3 text-xs">
              {post.published ? 'Unpublish' : 'Publish'}
            </Button>
          </form>
        </div>
      </div>

      <PostForm post={post} />
    </div>
  )
}
