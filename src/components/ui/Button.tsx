import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  // Base: all buttons share these
  [
    'inline-flex items-center justify-center gap-2',
    'font-body font-medium rounded-[4px]',
    'transition-all duration-[120ms] ease-out',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    'touch-target select-none',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-deep-saffron text-ivory',
          'hover:bg-deep-saffron-hover active:scale-[0.98]',
          'border border-transparent',
        ],
        secondary: [
          'bg-transparent text-deep-saffron',
          'border border-deep-saffron',
          'hover:bg-deep-saffron/5 active:scale-[0.98]',
        ],
        ghost: [
          'bg-transparent text-dark-mahogany',
          'hover:bg-dark-mahogany/10 active:scale-[0.98]',
          'border border-transparent',
        ],
        destructive: [
          'bg-deep-crimson text-white',
          'hover:bg-deep-crimson-light active:scale-[0.98]',
          'border border-transparent',
        ],
        gold: [
          'bg-warm-gold text-white',
          'hover:bg-warm-gold-hover active:scale-[0.98]',
          'border border-transparent',
        ],
        'nav-dark': [
          'bg-transparent text-ivory/80',
          'hover:bg-white/10 hover:text-ivory',
          'border border-transparent',
        ],
      },
      size: {
        sm:  'h-9 px-3 text-sm',
        md:  'h-11 px-4 text-base',
        lg:  'h-12 px-6 text-base',
        icon:'h-10 w-10 p-0',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          leftIcon && <span aria-hidden="true">{leftIcon}</span>
        )}
        {children}
        {!isLoading && rightIcon && <span aria-hidden="true">{rightIcon}</span>}
      </button>
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
