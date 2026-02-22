'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface BarData {
    label: string
    value: number
    color?: string
}

interface BarChartProps {
    data: BarData[]
    title?: string
    maxValue?: number
}

export function BarChart({ data, title, maxValue }: BarChartProps) {
    const max = maxValue || Math.max(...data.map(d => d.value))

    return (
        <div className="my-12 border border-swaddle-ink/20 p-8">
            {title && <h4 className="mb-8 font-sans text-2xl font-bold text-swaddle-ink">{title}</h4>}
            <div className="flex flex-col gap-6">
                {data.map((item, index) => {
                    const percentage = (item.value / max) * 100

                    return (
                        <div key={index} className="flex flex-col gap-2">
                            <div className="flex justify-between font-sans text-sm md:text-base font-semibold text-swaddle-ink">
                                <span>{item.label}</span>
                                <span>{item.value}</span>
                            </div>
                            <div className="h-4 w-full bg-swaddle-ink/10 overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${percentage}%` }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
                                    className="h-full bg-swaddle-ink"
                                    style={item.color ? { backgroundColor: item.color } : {}}
                                />
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
