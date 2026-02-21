import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'sea-specter',
    template: '%s · sea-specter',
  },
  description: 'An editorial blog on design, culture, and the spaces between.',
  openGraph: {
    title: 'sea-specter',
    description: 'An editorial blog on design, culture, and the spaces between.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
        <body className="font-sans bg-stone-50 text-stone-900 antialiased">{children}</body>
      </html>
    </ClerkProvider>
  )
}
