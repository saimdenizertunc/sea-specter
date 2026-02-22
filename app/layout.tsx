import type { Metadata } from 'next'
import { Playfair_Display, Inter, JetBrains_Mono } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { getSiteUrl, siteConfig } from '@/lib/seo'
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

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: siteConfig.name,
    template: '%s | sea-specter',
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  icons: { icon: '/logo.png' },
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    type: 'article',
    siteName: siteConfig.name,
    locale: 'en_US',
    images: [
      {
        url: '/logo.png',
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@seaspecter',
    title: siteConfig.name,
    description: siteConfig.description,
    images: ['/logo.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${playfair.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      >
        <body className="font-sans bg-swaddle-base text-swaddle-ink antialiased">{children}</body>
      </html>
    </ClerkProvider>
  )
}
