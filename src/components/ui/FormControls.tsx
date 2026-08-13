import { AlertCircle } from 'lucide-react'
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

/* ─── Input ─────────────────────────────────────────────────── */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string          // Always required — never placeholder-as-label
  error?: string
  hint?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, className, id, ...props }, ref) => {
    const inputId = id ?? `input-${label.toLowerCase().replace(/\s+/g, '-')}`
    const errorId = `${inputId}-error`
    const hintId  = `${inputId}-hint`

    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-dark-mahogany font-body"
        >
          {label}
          {props.required && <span className="text-deep-crimson ml-0.5" aria-hidden="true">*</span>}
        </label>

        <div className="relative">
          {leftIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-mahogany-muted pointer-events-none" aria-hidden="true">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-describedby={cn(error && errorId, hint && hintId) || undefined}
            aria-invalid={!!error}
            className={cn(
              'w-full h-12 px-3 rounded-[6px] font-body text-base text-dark-mahogany bg-ivory',
              'border transition-colors duration-[120ms] ease-out',
              'placeholder:text-mahogany-muted/50',
              'focus:outline-none focus:ring-2 focus:ring-warm-gold focus:ring-offset-0 focus:border-warm-gold',
              error
                ? 'border-deep-crimson focus:ring-deep-crimson'
                : 'border-dark-mahogany/20 hover:border-dark-mahogany/40',
              leftIcon  && 'pl-10',
              rightIcon && 'pr-10',
              className,
            )}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-mahogany-muted" aria-hidden="true">
              {rightIcon}
            </span>
          )}
        </div>

        {error && (
          <p id={errorId} role="alert" className="flex items-center gap-1.5 text-sm text-deep-crimson font-body">
            <AlertCircle className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={hintId} className="text-sm text-mahogany-muted font-body">{hint}</p>
        )}
      </div>
    )
  },
)
Input.displayName = 'Input'

/* ─── Textarea ───────────────────────────────────────────────── */
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
  hint?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id ?? `textarea-${label.toLowerCase().replace(/\s+/g, '-')}`
    const errorId = `${inputId}-error`

    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={inputId} className="text-sm font-medium text-dark-mahogany font-body">
          {label}
          {props.required && <span className="text-deep-crimson ml-0.5" aria-hidden="true">*</span>}
        </label>
        <textarea
          ref={ref}
          id={inputId}
          aria-describedby={error ? errorId : undefined}
          aria-invalid={!!error}
          className={cn(
            'w-full min-h-[100px] px-3 py-3 rounded-[6px] font-body text-base text-dark-mahogany bg-ivory',
            'border transition-colors duration-[120ms] ease-out resize-y',
            'placeholder:text-mahogany-muted/50',
            'focus:outline-none focus:ring-2 focus:ring-warm-gold focus:border-warm-gold',
            error
              ? 'border-deep-crimson focus:ring-deep-crimson'
              : 'border-dark-mahogany/20 hover:border-dark-mahogany/40',
            className,
          )}
          {...props}
        />
        {error && (
          <p id={errorId} role="alert" className="flex items-center gap-1.5 text-sm text-deep-crimson font-body">
            <AlertCircle className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
            {error}
          </p>
        )}
        {hint && !error && <p className="text-sm text-mahogany-muted font-body">{hint}</p>}
      </div>
    )
  },
)
Textarea.displayName = 'Textarea'

/* ─── Select ─────────────────────────────────────────────────── */
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: string
  hint?: string
  options: { value: string; label: string }[]
  placeholder?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, options, placeholder, className, id, ...props }, ref) => {
    const inputId = id ?? `select-${label.toLowerCase().replace(/\s+/g, '-')}`
    const errorId = `${inputId}-error`

    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={inputId} className="text-sm font-medium text-dark-mahogany font-body">
          {label}
          {props.required && <span className="text-deep-crimson ml-0.5" aria-hidden="true">*</span>}
        </label>
        <select
          ref={ref}
          id={inputId}
          aria-describedby={error ? errorId : undefined}
          aria-invalid={!!error}
          className={cn(
            'w-full h-12 px-3 rounded-[6px] font-body text-base text-dark-mahogany bg-ivory',
            'border transition-colors duration-[120ms] ease-out appearance-none cursor-pointer',
            'focus:outline-none focus:ring-2 focus:ring-warm-gold focus:border-warm-gold',
            error
              ? 'border-deep-crimson'
              : 'border-dark-mahogany/20 hover:border-dark-mahogany/40',
            className,
          )}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {error && (
          <p id={errorId} role="alert" className="flex items-center gap-1.5 text-sm text-deep-crimson font-body">
            <AlertCircle className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
            {error}
          </p>
        )}
        {hint && !error && <p className="text-sm text-mahogany-muted font-body">{hint}</p>}
      </div>
    )
  },
)
Select.displayName = 'Select'
