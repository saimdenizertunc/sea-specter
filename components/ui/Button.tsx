import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'danger'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded px-4 py-2 text-sm font-medium font-sans transition-colors disabled:pointer-events-none disabled:opacity-50',
          variant === 'default' && 'bg-stone-900 text-stone-50 hover:bg-stone-700',
          variant === 'outline' &&
            'border border-stone-300 bg-white text-stone-700 hover:bg-stone-100',
          variant === 'ghost' && 'text-stone-700 hover:bg-stone-100',
          variant === 'danger' && 'bg-red-600 text-white hover:bg-red-500',
          className,
        )}
        {...props}
      />
    )
  },
)

Button.displayName = 'Button'
