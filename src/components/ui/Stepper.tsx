import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface StepItem {
  id: number
  title: string
  description?: string
}

export interface StepperProps {
  steps: StepItem[]
  currentStep: number
  className?: string
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <div className={cn('flex items-center gap-4 mb-8', className)}>
      {steps.map((step, index) => {
        const isCompleted = currentStep > step.id
        const isCurrent = currentStep === step.id

        return (
          <div key={step.id} className="flex items-center gap-3">
            <div
              className={cn(
                'flex items-center gap-2 font-body text-sm font-medium',
                isCurrent
                  ? 'text-dark-mahogany font-semibold'
                  : isCompleted
                  ? 'text-verdant-green'
                  : 'text-mahogany-muted',
              )}
            >
              <div
                className={cn(
                  'h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors',
                  isCompleted
                    ? 'bg-verdant-green text-white'
                    : isCurrent
                    ? 'bg-warm-gold text-dark-mahogany shadow-sm'
                    : 'bg-ledger-rule text-mahogany-muted',
                )}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : step.id}
              </div>
              <div className="flex flex-col">
                <span>{step.title}</span>
                {step.description && (
                  <span className="text-xs text-mahogany-muted font-normal">{step.description}</span>
                )}
              </div>
            </div>

            {index < steps.length - 1 && (
              <div
                className={cn(
                  'h-0.5 w-12 sm:w-16 transition-colors',
                  currentStep > step.id ? 'bg-verdant-green' : 'bg-ledger-rule',
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
