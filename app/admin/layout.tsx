import Link from 'next/link'
import Image from 'next/image'
import { UserButton } from '@clerk/nextjs'
import type { Metadata } from 'next'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-10 border-b border-stone-200 bg-white/90 backdrop-blur-sm px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="sea-specter"
              width={120}
              height={32}
              style={{ height: 'auto' }}
              className="invert"
              priority
            />
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
