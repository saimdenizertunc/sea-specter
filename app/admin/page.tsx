import Link from 'next/link'
import { cn } from '@/lib/utils'
import prisma from '@/lib/prisma'
import { publishPost, deletePost } from '@/actions/posts'
import { Button } from '@/components/ui/Button'

export default async function AdminDashboard() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl text-stone-900">Posts</h1>
        <Link href="/admin/new">
          <Button>+ New Post</Button>
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-24">
          <p className="font-sans text-stone-400 mb-4">No posts yet.</p>
          <Link href="/admin/new">
            <Button variant="outline">Create your first post</Button>
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-stone-100 border border-stone-200 rounded-lg overflow-hidden">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex items-center justify-between px-5 py-4 hover:bg-stone-50 transition-colors"
            >
              <div className="min-w-0 flex-1 mr-4">
                <h3 className="font-sans font-medium text-stone-900 truncate">{post.title}</h3>
                <div className="flex items-center gap-3 mt-0.5">
                  <span
                    className={cn(
                      'font-sans text-xs px-1.5 py-0.5 rounded-full',
                      post.published
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-stone-100 text-stone-500',
                    )}
                  >
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                  <span className="font-sans text-xs text-stone-400 truncate">
                    /blog/{post.slug}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {post.published && (
                  <Link
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    className="font-sans text-xs text-stone-400 hover:text-stone-700 transition-colors"
                  >
                    View ↗
                  </Link>
                )}

                <Link href={`/admin/${post.id}`}>
                  <Button variant="ghost" className="h-7 px-3 text-xs">
                    Edit
                  </Button>
                </Link>

                <form action={publishPost.bind(null, post.id)}>
                  <Button variant="outline" className="h-7 px-3 text-xs" type="submit">
                    {post.published ? 'Unpublish' : 'Publish'}
                  </Button>
                </form>

                <form
                  action={deletePost.bind(null, post.id)}
                  onSubmit={(e) => {
                    if (!confirm(`Delete "${post.title}"? This cannot be undone.`)) {
                      e.preventDefault()
                    }
                  }}
                >
                  <Button variant="danger" className="h-7 px-3 text-xs" type="submit">
                    Delete
                  </Button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
