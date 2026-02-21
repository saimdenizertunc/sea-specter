import Image from 'next/image'
import React from 'react'

interface BleedImageProps {
    src: string
    alt: string
    caption?: string
    priority?: boolean
}

export function BleedImage({ src, alt, caption, priority = false }: BleedImageProps) {
    return (
        <figure className="my-16 md:my-24 w-full">
            <div className="relative w-full h-[50vh] md:h-[70vh] border-y border-swaddle-ink">
                <Image
                    src={src}
                    alt={alt}
                    fill
                    priority={priority}
                    sizes="(max-width: 1024px) 100vw, 1024px"
                    className="object-cover"
                />
            </div>
            {caption && (
                <figcaption className="mt-4 font-mono text-xs text-swaddle-ink/70 uppercase">
                    {caption}
                </figcaption>
            )}
        </figure>
    )
}
