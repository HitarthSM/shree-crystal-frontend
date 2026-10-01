import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { isAxiosError } from 'axios'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/FormControls'
import { toast } from '@/components/ui/Toast'
import { authApi, signOut } from '@/api/auth'
import { useAuthStore } from '@/store/auth.store'

// Mirrors the backend policy (auth.dto.ts).
const PASSWORD_POLICY = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/

const schema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .max(72, 'Password is too long')
      .regex(PASSWORD_POLICY, 'At least 8 characters with an uppercase letter, a lowercase letter and a number'),
    confirmPassword: z.string().min(1, 'Please confirm the new password'),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  })
  .refine((v) => v.newPassword !== v.currentPassword, {
    path: ['newPassword'],
    message: 'New password must be different from the current one',
  })

type ChangePasswordForm = z.infer<typeof schema>

export function ChangePasswordPage() {
  const navigate = useNavigate()
  const { user, setUser, setTokens } = useAuthStore()
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordForm>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: ChangePasswordForm) => {
    setFormError(null)
    try {
      const tokens = await authApi.changePassword(data.currentPassword, data.newPassword)
      // The change invalidated every old token; continue on the new pair.
      setTokens(tokens.accessToken, tokens.refreshToken)
      if (user) setUser({ ...user, isFirstLogin: false })
      toast.success('Password updated.')
      navigate(user?.role === 'member' ? '/dashboard' : '/admin', { replace: true })
    } catch (error) {
      const message =
        isAxiosError(error) && error.response?.status === 401
          ? 'Current password is incorrect.'
          : isAxiosError(error) && error.response?.data?.error?.message
            ? String(error.response.data.error.message)
            : 'Could not update the password. Please try again.'
      setFormError(message)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <h1 className="text-display-sm font-display text-dark-mahogany mb-2">Set a new password</h1>
        <p className="text-sm text-mahogany-muted mb-8">
          You are using a password issued by the society. Choose your own to continue.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <Input
            label="Current password"
            type="password"
            autoComplete="current-password"
            {...register('currentPassword')}
            error={errors.currentPassword?.message}
          />
          <Input
            label="New password"
            type="password"
            autoComplete="new-password"
            {...register('newPassword')}
            error={errors.newPassword?.message}
          />
          <Input
            label="Confirm new password"
            type="password"
            autoComplete="new-password"
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
          />

          {formError && (
            <p role="alert" className="text-sm text-deep-crimson">
              {formError}
            </p>
          )}

          <Button type="submit" variant="gold" fullWidth isLoading={isSubmitting}>
            Update password
          </Button>
          <Button type="button" variant="secondary" fullWidth onClick={handleSignOut}>
            Sign out
          </Button>
        </form>
      </div>
    </div>
  )
}
