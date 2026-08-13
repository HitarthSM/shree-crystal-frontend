import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/FormControls'
import { toast } from '@/components/ui/Toast'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'

const forgotSchema = z.object({
  memberId: z.string().min(1, 'Member ID or Mobile Number is required'),
})
type ForgotForm = z.infer<typeof forgotSchema>

export function ForgotPassword() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotForm>({
    resolver: zodResolver(forgotSchema)
  })

  const onSubmit = async (_data: ForgotForm) => {
    try {
      // Mock API call
      await new Promise(r => setTimeout(r, 1000))
      setIsSubmitted(true)
    } catch {
      toast.error('Unable to process request at this time')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-ledger-paper p-6">
      <div className="w-full max-w-md animate-slide-in-right bg-ivory p-8 rounded-[6px] border border-ledger-rule shadow-paper-md">
        
        <Link 
          to="/login"
          className="inline-flex items-center gap-2 text-sm font-body text-mahogany-muted hover:text-dark-mahogany transition-colors mb-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold rounded-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Login
        </Link>

        {isSubmitted ? (
          <div className="text-center py-6">
            <div className="mx-auto w-12 h-12 rounded-full bg-verdant-green/10 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-6 w-6 text-verdant-green" />
            </div>
            <h2 className="text-display-sm font-display text-dark-mahogany mb-3">
              Request Submitted
            </h2>
            <p className="text-body text-mahogany-muted mb-8">
              If an account matches the provided details, we have sent instructions to reset your password to the registered mobile number and email.
            </p>
            <Link to="/login" className="inline-flex items-center justify-center gap-2 font-body font-medium rounded-[4px] transition-all duration-[120ms] ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold focus-visible:ring-offset-2 bg-warm-gold text-white hover:bg-warm-gold-hover h-11 px-4 text-base w-full">
              Return to Login
            </Link>
          </div>
        ) : (
          <>
            <h2 className="text-display-sm font-display text-dark-mahogany mb-2">
              Reset Password
            </h2>
            <p className="text-body text-mahogany-muted mb-8">
              Enter your Member ID or registered mobile number to receive reset instructions.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                label="Member ID / Mobile Number"
                {...register('memberId')}
                error={errors.memberId?.message}
                placeholder="e.g., SC-00847 or 9876543210"
              />
              <Button type="submit" variant="gold" fullWidth isLoading={isSubmitting}>
                Send Reset Instructions
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
