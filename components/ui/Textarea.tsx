import { cn } from '@/lib/utils'
import { TextareaHTMLAttributes, forwardRef } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, id, ...props }, ref) => {
    const textareaId = id ?? props.name
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={textareaId} className="text-sm font-medium font-sans text-stone-700">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'rounded border border-stone-200 bg-white px-3 py-2 text-sm font-sans text-stone-900 placeholder:text-stone-400 resize-y',
            'focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent',
            className,
          )}
          {...props}
        />
      </div>
    )
  },
)

Textarea.displayName = 'Textarea'
