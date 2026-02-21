import type { Metadata } from 'next'
import { Playfair_Display, Inter, JetBrains_Mono } from 'next/font/google'
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

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'sea-specter',
    template: '%s · sea-specter',
  },
  description: 'An editorial blog on design, culture, and the spaces between.',
  icons: { icon: '/logo.png' },
  openGraph: {
    title: 'sea-specter',
    description: 'An editorial blog on design, culture, and the spaces between.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${playfair.variable} ${inter.variable} ${jetbrainsMono.variable}`}
        data-scroll-behavior="smooth"
      >
        <body className="font-sans bg-swaddle-base text-swaddle-ink antialiased">{children}</body>
      </html>
    </ClerkProvider>
  )
}
