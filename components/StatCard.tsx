'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface StatCardProps {
    number: string
    label: string
}

export function StatCard({ number, label }: StatCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="my-10 flex flex-col items-center justify-center border border-swaddle-ink/20 bg-swaddle-ink/5 p-12 text-center"
        >
            <span className="font-sans text-6xl md:text-8xl font-bold tracking-tighter text-swaddle-ink">
                {number}
            </span>
            <span className="mt-4 font-sans text-xl md:text-2xl font-medium uppercase tracking-widest text-swaddle-ink/70">
                {label}
            </span>
        </motion.div>
    )
}
