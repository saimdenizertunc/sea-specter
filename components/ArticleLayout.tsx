'use client'

import React from 'react'
import Link from 'next/link'

export function ArticleLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative min-h-screen bg-swaddle-base text-swaddle-ink selection:bg-swaddle-ink selection:text-swaddle-base pb-24">
            {/* Sticky close button */}
            <div className="fixed top-0 right-0 p-6 md:p-8 z-50">
                <Link
                    href="/blog"
                    className="font-mono text-xs md:text-sm border border-swaddle-ink px-4 py-2 uppercase hover:bg-swaddle-ink hover:text-swaddle-base transition-colors bg-swaddle-base"
                >
                    Close
                </Link>
            </div>

            {children}
        </div>
    )
}
