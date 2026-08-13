import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/FormControls'
import { useAuthStore } from '@/store/auth.store'
import { toast } from '@/components/ui/Toast'
import { ArrowLeft } from 'lucide-react'

// Schemas for the two steps
const mobileSchema = z.object({
  mobile: z.string().regex(/^[0-9]{10}$/, 'Must be a valid 10-digit mobile number'),
})
type MobileForm = z.infer<typeof mobileSchema>

const otpSchema = z.object({
  otp: z.string().regex(/^[0-9]{6}$/, 'OTP must be 6 digits'),
})
type OtpForm = z.infer<typeof otpSchema>


export function OTPLogin() {
  const [step, setStep] = useState<'mobile' | 'otp'>('mobile')
  const [sentMobile, setSentMobile] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const { setUser } = useAuthStore()

  // Form 1: Mobile Number
  const mobileForm = useForm<MobileForm>({ resolver: zodResolver(mobileSchema) })
  
  // Form 2: OTP Entry
  const otpForm = useForm<OtpForm>({ resolver: zodResolver(otpSchema) })

  const onMobileSubmit = async (data: MobileForm) => {
    try {
      // Mock API call to send OTP
      await new Promise(r => setTimeout(r, 1000))
      setSentMobile(data.mobile)
      setStep('otp')
      toast.success('OTP sent to your registered mobile')
    } catch {
      toast.error('Mobile number not found in our records')
    }
  }

  const onOtpSubmit = async (_data: OtpForm) => {
    try {
      // Mock API call to verify OTP
      await new Promise(r => setTimeout(r, 1000))
      
      setUser({
        id: '1',
        memberId: 'SC-00847',
        name: 'Ramesh Patel',
        mobile: sentMobile,
        role: 'member',
      })
      
      toast.success('Logged in successfully')
      
      const from = location.state?.from?.pathname || '/dashboard'
      navigate(from, { replace: true })
    } catch {
      toast.error('Invalid or expired OTP')
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-ivory">
      {/* Left Brand Panel - Hidden on small screens to focus on OTP */}
      <div className="hidden md:flex md:w-[40%] bg-deep-saffron relative overflow-hidden flex-col justify-between p-12">
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #FAF5E8 31px, #FAF5E8 32px)' }}
        />
        <div className="relative z-10">
          <Link to="/" className="inline-block text-ivory font-display font-bold text-2xl tracking-wide mb-16">
            Shree Crystal Co-op
          </Link>
          <h1 className="text-display-lg font-display text-ivory mb-6 max-w-sm">Secure Access.</h1>
          <p className="text-body-lg text-ivory/80 font-body max-w-sm">
            Login using your registered mobile number for quick access to your passbook.
          </p>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="w-full md:w-[60%] flex items-center justify-center p-8 md:p-12">
        <div className="w-full max-w-md animate-slide-in-right">
          
          {/* Back button */}
          <Link 
            to="/login"
            className="inline-flex items-center gap-2 text-sm font-body text-mahogany-muted hover:text-dark-mahogany transition-colors mb-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold rounded-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Password Login
          </Link>

          <h2 className="text-display-sm font-display text-dark-mahogany mb-2">
            {step === 'mobile' ? 'Login with OTP' : 'Enter OTP'}
          </h2>
          <p className="text-body text-mahogany-muted mb-8">
            {step === 'mobile' 
              ? 'Enter your registered mobile number to receive a one-time password.'
              : `We've sent a 6-digit code to +91 ${sentMobile}`
            }
          </p>

          {step === 'mobile' ? (
            <form onSubmit={mobileForm.handleSubmit(onMobileSubmit)} className="space-y-6">
              <Input
                label="Registered Mobile Number"
                {...mobileForm.register('mobile')}
                error={mobileForm.formState.errors.mobile?.message}
                placeholder="10-digit mobile number"
                type="tel"
                maxLength={10}
                leftIcon={<span className="text-mahogany-muted/70">+91</span>}
                className="pl-12"
              />
              <Button type="submit" variant="gold" fullWidth isLoading={mobileForm.formState.isSubmitting}>
                Get OTP
              </Button>
            </form>
          ) : (
            <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-6">
              <Input
                label="6-Digit OTP"
                {...otpForm.register('otp')}
                error={otpForm.formState.errors.otp?.message}
                placeholder="000000"
                type="text"
                maxLength={6}
                className="font-data text-lg tracking-[0.5em] text-center"
              />
              <Button type="submit" variant="gold" fullWidth isLoading={otpForm.formState.isSubmitting}>
                Verify & Login
              </Button>
              <div className="text-center pt-2">
                <button 
                  type="button" 
                  onClick={() => setStep('mobile')}
                  className="text-sm text-warm-gold hover:text-warm-gold-hover font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold rounded-sm"
                >
                  Change mobile number
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  )
}
