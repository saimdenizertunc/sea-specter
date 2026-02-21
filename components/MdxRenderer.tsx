import type { ComponentPropsWithoutRef } from 'react'
import { MDXRemote } from 'next-mdx-remote/rsc'
import type { MDXComponents } from 'mdx/types'

function PullQuote({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-10 border-y border-stone-300 px-8 py-6 text-center">
      <p className="font-serif text-2xl italic leading-snug text-stone-800 md:text-3xl">
        {children}
      </p>
    </div>
  )
}

const components: MDXComponents = {
  PullQuote,
  h1: ({ children, ...props }: ComponentPropsWithoutRef<'h1'>) => (
    <h1 className="mt-10 mb-4 font-serif text-4xl leading-tight" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: ComponentPropsWithoutRef<'h2'>) => (
    <h2 className="mt-8 mb-3 font-serif text-3xl leading-tight" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: ComponentPropsWithoutRef<'h3'>) => (
    <h3 className="mt-6 mb-2 font-serif text-2xl leading-tight" {...props}>
      {children}
    </h3>
  ),
  p: ({ children, ...props }: ComponentPropsWithoutRef<'p'>) => (
    <p className="mb-5 font-sans text-[1.0625rem] leading-relaxed text-stone-700" {...props}>
      {children}
    </p>
  ),
  a: ({ children, ...props }: ComponentPropsWithoutRef<'a'>) => (
    <a
      className="underline decoration-stone-400 underline-offset-4 transition-colors hover:decoration-stone-900"
      {...props}
    >
      {children}
    </a>
  ),
  blockquote: ({ children, ...props }: ComponentPropsWithoutRef<'blockquote'>) => (
    <blockquote
      className="my-6 border-l-4 border-stone-300 pl-6 italic text-stone-500"
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
        className="rounded bg-stone-100 px-1.5 py-0.5 font-mono text-[0.875em] text-stone-800"
        {...props}
      >
        {children}
      </code>
    )
  },
  pre: ({ children, ...props }: ComponentPropsWithoutRef<'pre'>) => (
    <pre
      className="my-6 overflow-x-auto rounded-lg bg-stone-900 p-6 font-mono text-sm leading-relaxed text-stone-100"
      {...props}
    >
      {children}
    </pre>
  ),
  ul: ({ children, ...props }: ComponentPropsWithoutRef<'ul'>) => (
    <ul className="mb-5 list-disc space-y-1 pl-6 font-sans text-stone-700" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: ComponentPropsWithoutRef<'ol'>) => (
    <ol className="mb-5 list-decimal space-y-1 pl-6 font-sans text-stone-700" {...props}>
      {children}
    </ol>
  ),
  hr: (props: ComponentPropsWithoutRef<'hr'>) => <hr className="my-8 border-stone-200" {...props} />,
}

interface MdxRendererProps {
  source: string
}

export function MdxRenderer({ source }: MdxRendererProps) {
  return <MDXRemote source={source} components={components} />
}
