import { useEffect, useRef } from 'react'
import { X, AlertTriangle, HelpCircle } from 'lucide-react'
import { Button } from './Button'
import { cn } from '@/lib/utils'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  children?: React.ReactNode
  maxWidth?: 'sm' | 'md' | 'lg'
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'md',
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const maxWMap = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby={description ? 'modal-description' : undefined}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={modalRef}
        className={cn(
          'w-full bg-ivory rounded-[8px] border border-ledger-rule shadow-xl overflow-hidden',
          'animate-scale-up focus:outline-none',
          maxWMap[maxWidth],
        )}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-ledger-rule bg-white">
          <h2 id="modal-title" className="font-display text-lg text-dark-mahogany font-semibold">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1 rounded-[4px] text-mahogany-muted hover:text-dark-mahogany hover:bg-black/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {description && (
            <p id="modal-description" className="text-sm font-body text-mahogany-muted mb-4">
              {description}
            </p>
          )}
          {children}
        </div>
      </div>
    </div>
  )
}

export interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'primary' | 'destructive'
  isLoading?: boolean
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'primary',
  isLoading = false,
}: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="sm">
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              'h-10 w-10 rounded-full flex items-center justify-center shrink-0',
              variant === 'destructive'
                ? 'bg-deep-crimson/10 text-deep-crimson'
                : 'bg-warm-gold/20 text-dark-mahogany',
            )}
          >
            {variant === 'destructive' ? (
              <AlertTriangle className="h-5 w-5" />
            ) : (
              <HelpCircle className="h-5 w-5" />
            )}
          </div>
          <p className="text-sm font-body text-dark-mahogany pt-1 leading-relaxed">
            {message}
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-2 border-t border-ledger-rule">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button
            variant={variant === 'destructive' ? 'destructive' : 'primary'}
            size="sm"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export interface PromptModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (value: string) => void
  title: string
  message: string
  placeholder?: string
  submitText?: string
  cancelText?: string
  isLoading?: boolean
  required?: boolean
}

export function PromptModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  message,
  placeholder = '',
  submitText = 'Submit',
  cancelText = 'Cancel',
  isLoading = false,
  required = true,
}: PromptModalProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const value = inputRef.current?.value || ''
    if (required && !value.trim()) return
    onSubmit(value.trim())
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm font-body text-dark-mahogany leading-relaxed">
          {message}
        </p>

        <textarea
          ref={inputRef}
          rows={3}
          required={required}
          placeholder={placeholder}
          className={cn(
            'w-full p-3 rounded-[6px] border border-ledger-rule bg-white text-sm font-body text-dark-mahogany',
            'focus:outline-none focus:ring-2 focus:ring-warm-gold focus:border-warm-gold',
          )}
        />

        <div className="flex justify-end gap-3 pt-2 border-t border-ledger-rule">
          <Button variant="ghost" size="sm" type="button" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button variant="primary" size="sm" type="submit" isLoading={isLoading}>
            {submitText}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
