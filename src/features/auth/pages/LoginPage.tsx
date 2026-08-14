import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/FormControls'
import { useAuthStore } from '@/store/auth.store'
import { toast } from '@/components/ui/Toast'

import { authApi } from '@/api/auth'

const loginSchema = z.object({
  memberId: z.string().min(1, 'Member ID is required'),
  password: z.string().min(1, 'Password is required'),
})

type LoginForm = z.infer<typeof loginSchema>

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    try {
      const response = await authApi.login(data.memberId, data.password)
      
      toast.success('Credentials verified. Sending OTP...')
      
      // Redirect to OTP page passing the tempToken
      navigate('/login/otp', { 
        replace: true,
        state: { 
          tempToken: response.tempToken,
          from: location.state?.from 
        } 
      })
    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.status === 400) {
        toast.error('Invalid Member ID or password.')
      } else {
        toast.error('An error occurred during login. Please try again.')
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Brand Panel - Deep Saffron */}
      <div className="w-full md:w-[40%] bg-deep-saffron relative overflow-hidden flex flex-col justify-between p-8 md:p-12">
        {/* Faint ledger lines pattern */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #FAF5E8 31px, #FAF5E8 32px)',
          }}
        />
        
        <div className="relative z-10">
          <Link to="/" className="inline-block text-ivory font-display font-bold text-2xl tracking-wide focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold focus-visible:ring-offset-4 focus-visible:ring-offset-deep-saffron rounded-sm mb-16">
            Shree Crystal Co-op
          </Link>
          
          <h1 className="text-display-lg font-display text-ivory mb-6 max-w-sm">
            Your passbook,<br />digitised.
          </h1>
          <p className="text-body-lg text-ivory/80 font-body max-w-sm">
            Secure access to your statements, notices, and loan details — trusted since 1985.
          </p>
        </div>

        <div className="relative z-10 mt-16 font-data text-ivory/60 text-sm space-y-1">
          <p>Registration No. B/26456/1985</p>
          <p>Ahmedabad, Gujarat</p>
        </div>
      </div>

      {/* Right Form Panel - Ivory */}
      <div className="w-full md:w-[60%] bg-ivory flex items-center justify-center p-8 md:p-12">
        <div className="w-full max-w-md animate-slide-in-right">
          <h2 className="text-display-sm font-display text-dark-mahogany mb-8 text-center md:text-left">
            Member Login
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Member ID / Mobile Number"
              {...register('memberId')}
              error={errors.memberId?.message}
              placeholder="e.g., SC-00847 or 9876543210"
              autoComplete="username"
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                error={errors.password?.message}
                autoComplete="current-password"
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 text-mahogany-muted hover:text-dark-mahogany focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold rounded-sm transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                }
              />
            </div>

            <Button
              type="submit"
              variant="gold"
              fullWidth
              isLoading={isSubmitting}
              className="mt-2"
            >
              Login
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-ledger-rule flex flex-col items-center gap-4">
            <Link
              to="/forgot-password"
              className="text-sm font-body font-medium text-warm-gold hover:text-warm-gold-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold rounded-sm transition-colors"
            >
              Forgot Password?
            </Link>
            <Link
              to="/login/otp"
              className="text-sm font-body text-mahogany-muted hover:text-dark-mahogany focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold rounded-sm transition-colors"
            >
              Login with OTP instead
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
