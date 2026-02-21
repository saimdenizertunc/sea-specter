import Link from 'next/link'

const socialLinks = [
  { href: 'https://instagram.com', label: 'Instagram' },
  { href: 'https://x.com', label: 'Twitter' },
]

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="px-6 pb-10">
      <div className="mx-auto max-w-7xl border-t border-stone-300/70 pt-6">
        <div className="flex flex-col gap-3 text-sm text-stone-500 md:flex-row md:items-center md:justify-between">
          <p className="font-sans">(c) {year} sea-specter. All rights reserved.</p>
          <div className="flex items-center gap-4">
            {socialLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="font-sans transition-colors hover:text-stone-900"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
