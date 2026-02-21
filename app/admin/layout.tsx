import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/Button'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-10 border-b border-stone-200 bg-white/90 backdrop-blur-sm px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <Link href="/" className="font-serif text-lg text-stone-900 hover:text-stone-600 transition-colors">
            sea-specter
          </Link>
          <span className="text-stone-200 select-none">|</span>
          <nav className="flex items-center gap-4">
            <Link
              href="/admin"
              className="font-sans text-sm text-stone-600 hover:text-stone-900 transition-colors"
            >
              Dashboard
            </Link>
            <Link href="/admin/new">
              <Button variant="default" className="h-7 text-xs px-3">
                + New Post
              </Button>
            </Link>
          </nav>
        </div>
        <UserButton afterSignOutUrl="/" />
      </header>

      <main className="px-6 py-8 max-w-5xl mx-auto">{children}</main>
    </div>
  )
}
