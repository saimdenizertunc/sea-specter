import type { ComponentPropsWithoutRef } from 'react'
import { MDXRemote } from 'next-mdx-remote/rsc'
import type { MDXComponents } from 'mdx/types'
import { BleedImage } from './BleedImage'

function PullQuote({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-16 border-y border-swaddle-ink px-8 py-10 text-center relative overflow-hidden">
      <p className="font-sans text-3xl font-bold leading-tight tracking-tight text-swaddle-ink md:text-5xl uppercase">
        {children}
      </p>
    </div>
  )
}

const components: MDXComponents = {
  PullQuote,
  BleedImage,
  h1: ({ children, ...props }: ComponentPropsWithoutRef<'h1'>) => (
    <h1 className="mt-16 mb-6 font-sans font-bold text-6xl md:text-8xl leading-[0.9] tracking-tighter" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: ComponentPropsWithoutRef<'h2'>) => (
    <h2 className="mt-14 mb-4 font-sans font-bold text-4xl md:text-5xl leading-tight tracking-tight" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: ComponentPropsWithoutRef<'h3'>) => (
    <h3 className="mt-10 mb-3 font-sans font-bold text-2xl md:text-3xl leading-tight" {...props}>
      {children}
    </h3>
  ),
  p: ({ children, ...props }: ComponentPropsWithoutRef<'p'>) => (
    <p className="mb-8 font-sans text-xl md:text-[1.35rem] leading-[1.7] text-swaddle-ink/90" {...props}>
      {children}
    </p>
  ),
  a: ({ children, ...props }: ComponentPropsWithoutRef<'a'>) => (
    <a
      className="underline decoration-1 underline-offset-4 decoration-swaddle-ink/30 hover:decoration-swaddle-ink hover:bg-swaddle-ink hover:text-swaddle-base transition-colors"
      {...props}
    >
      {children}
    </a>
  ),
  blockquote: ({ children, ...props }: ComponentPropsWithoutRef<'blockquote'>) => (
    <blockquote
      className="my-10 border-l-[3px] border-swaddle-ink pl-6 font-sans text-2xl italic text-swaddle-ink/80 leading-relaxed"
      {...props}
    >
      {children}
    </blockquote>
  ),
  code: ({ children, className, ...props }: ComponentPropsWithoutRef<'code'>) => {
    if (className) {
      return (
        <code className={className} {...props}>
          {children}
        </code>
      )
    }

    return (
      <code
        className="px-1.5 py-0.5 font-mono text-sm uppercase bg-swaddle-ink/5 border border-swaddle-ink/20"
        {...props}
      >
        {children}
      </code>
    )
  },
  pre: ({ children, ...props }: ComponentPropsWithoutRef<'pre'>) => (
    <pre
      className="my-12 overflow-x-auto border border-swaddle-ink bg-swaddle-ink/5 p-8 font-mono text-sm leading-relaxed text-swaddle-ink selection:bg-swaddle-ink selection:text-swaddle-base"
      {...props}
    >
      {children}
    </pre>
  ),
  ul: ({ children, ...props }: ComponentPropsWithoutRef<'ul'>) => (
    <ul className="mb-10 list-disc space-y-3 pl-8 font-sans text-xl leading-relaxed text-swaddle-ink/90" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: ComponentPropsWithoutRef<'ol'>) => (
    <ol className="mb-10 list-decimal space-y-3 pl-8 font-sans text-xl leading-relaxed text-swaddle-ink/90" {...props}>
      {children}
    </ol>
  ),
  hr: (props: ComponentPropsWithoutRef<'hr'>) => (
    <hr className="my-16 border-t-[1px] border-swaddle-ink" {...props} />
  ),
  img: ({ src, alt, ...props }: ComponentPropsWithoutRef<'img'>) => (
    <span className="block my-12 relative w-full border border-swaddle-ink">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt || ''} className="w-full h-auto object-cover" {...props} />
    </span>
  ),
}

interface MdxRendererProps {
  source: string
}

export function MdxRenderer({ source }: MdxRendererProps) {
  return (
    <div className="mdx-content">
      <MDXRemote source={source} components={components} />
    </div>
  )
}
