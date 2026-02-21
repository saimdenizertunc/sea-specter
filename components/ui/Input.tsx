import { cn } from '@/lib/utils'
import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, id, ...props }, ref) => {
    const inputId = id ?? props.name
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium font-sans text-stone-700">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'rounded border border-stone-200 bg-white px-3 py-2 text-sm font-sans text-stone-900 placeholder:text-stone-400',
            'focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent',
            className,
          )}
          {...props}
        />
      </div>
    )
  },
)

Input.displayName = 'Input'
