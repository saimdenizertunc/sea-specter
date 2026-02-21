import { MDXRemote } from 'next-mdx-remote/rsc'
import type { MDXComponents } from 'mdx/types'

const components: MDXComponents = {
  h1: ({ children, ...props }) => (
    <h1 className="font-serif text-4xl mt-10 mb-4 leading-tight" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2 className="font-serif text-3xl mt-8 mb-3 leading-tight" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className="font-serif text-2xl mt-6 mb-2 leading-tight" {...props}>
      {children}
    </h3>
  ),
  p: ({ children, ...props }) => (
    <p className="font-sans text-stone-700 leading-relaxed mb-5 text-[1.0625rem]" {...props}>
      {children}
    </p>
  ),
  a: ({ children, ...props }) => (
    <a
      className="underline underline-offset-4 decoration-stone-400 hover:decoration-stone-900 transition-colors"
      {...props}
    >
      {children}
    </a>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote
      className="border-l-4 border-stone-300 pl-6 italic text-stone-500 my-6"
      {...props}
    >
      {children}
    </blockquote>
  ),
  code: ({ children, ...props }) => (
    <code
      className="bg-stone-100 text-stone-800 px-1.5 py-0.5 rounded text-[0.875em] font-mono"
      {...props}
    >
      {children}
    </code>
  ),
  pre: ({ children, ...props }) => (
    <pre
      className="bg-stone-900 text-stone-100 p-6 rounded-lg overflow-x-auto my-6 font-mono text-sm leading-relaxed"
      {...props}
    >
      {children}
    </pre>
  ),
  ul: ({ children, ...props }) => (
    <ul className="font-sans list-disc pl-6 mb-5 space-y-1 text-stone-700" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="font-sans list-decimal pl-6 mb-5 space-y-1 text-stone-700" {...props}>
      {children}
    </ol>
  ),
  hr: (props) => <hr className="border-stone-200 my-8" {...props} />,
}

interface MdxRendererProps {
  source: string
}

export function MdxRenderer({ source }: MdxRendererProps) {
  return <MDXRemote source={source} components={components} />
}
