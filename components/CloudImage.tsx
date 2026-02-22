'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface CloudImageProps {
    src: string
    alt: string
    caption?: string
}

export function CloudImage({ src, alt, caption }: CloudImageProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="my-14 flex flex-col items-center"
        >
            <div className="relative w-full overflow-hidden border border-swaddle-ink/10 rounded-lg shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={alt} className="w-full h-auto object-cover" loading="lazy" />
            </div>
            {caption && (
                <span className="mt-4 font-sans text-sm text-swaddle-ink/60 uppercase tracking-widest text-center">
                    {caption}
                </span>
            )}
        </motion.div>
    )
}
