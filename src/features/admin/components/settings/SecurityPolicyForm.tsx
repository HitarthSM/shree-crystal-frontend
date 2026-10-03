import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/FormControls'
import { Button } from '@/components/ui/Button'
import { SkeletonCard } from '@/components/ui/Skeleton'
import { Save } from 'lucide-react'
import { toast } from '@/components/ui/Toast'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '@/api/client'

interface SecurityPolicyData {
  sessionTimeoutMinutes?: number
  passwordPolicy?: {
    minLength?: number
    requireUppercase?: boolean
    requireLowercase?: boolean
    requireNumbers?: boolean
    requireSpecialCharacters?: boolean
  }
  makerCheckerEnabled?: {
    loanApproval?: boolean
    memberApproval?: boolean
  }
}

export function SecurityPolicyForm() {
  const qc = useQueryClient()
  const { data, isLoading } = useQuery<SecurityPolicyData>({
    queryKey: ['securityPolicy'],
    queryFn: () => apiClient.get('/settings/security').then((r) => r.data),
  })

  const updateMutation = useMutation({
    mutationFn: (payload: {
      sessionTimeoutMinutes: number
      passwordPolicy: {
        minLength: number
        requireUppercase: boolean
        requireLowercase: boolean
        requireNumbers: boolean
        requireSpecialCharacters: boolean
      }
      makerCheckerEnabled: {
        loanApproval: boolean
        memberApproval: boolean
      }
    }) => apiClient.put('/settings/security', payload).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['securityPolicy'] }),
  })

  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = useState(30)
  const [minLength, setMinLength] = useState(8)
  const [requireUppercase, setRequireUppercase] = useState(true)
  const [requireLowercase, setRequireLowercase] = useState(true)
  const [requireNumbers, setRequireNumbers] = useState(true)
  const [requireSpecialCharacters, setRequireSpecialCharacters] = useState(true)
  const [loanApproval, setLoanApproval] = useState(true)
  const [memberApproval, setMemberApproval] = useState(true)

  useEffect(() => {
    if (data) {
      if (data.sessionTimeoutMinutes) setSessionTimeoutMinutes(data.sessionTimeoutMinutes)
      if (data.passwordPolicy) {
        setMinLength(data.passwordPolicy.minLength ?? 8)
        setRequireUppercase(data.passwordPolicy.requireUppercase ?? true)
        setRequireLowercase(data.passwordPolicy.requireLowercase ?? true)
        setRequireNumbers(data.passwordPolicy.requireNumbers ?? true)
        setRequireSpecialCharacters(data.passwordPolicy.requireSpecialCharacters ?? true)
      }
      if (data.makerCheckerEnabled) {
        setLoanApproval(data.makerCheckerEnabled.loanApproval ?? true)
        setMemberApproval(data.makerCheckerEnabled.memberApproval ?? true)
      }
    }
  }, [data])

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync({
        sessionTimeoutMinutes: Math.max(1, Number(sessionTimeoutMinutes) || 30),
        passwordPolicy: {
          minLength: Math.max(6, Number(minLength) || 8),
          requireUppercase,
          requireLowercase,
          requireNumbers,
          requireSpecialCharacters,
        },
        makerCheckerEnabled: {
          loanApproval,
          memberApproval,
        },
      })
      toast.success('Security policies updated')
    } catch {
      toast.error('Failed to update security policies')
    }
  }

  if (isLoading) {
    return <SkeletonCard />
  }

  return (
    <Card padding="lg">
      <CardHeader className="mb-6">
        <CardTitle>Security & Maker-Checker Policies</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Session Timeout (Minutes)"
            type="number"
            value={sessionTimeoutMinutes.toString()}
            onChange={(e) => setSessionTimeoutMinutes(parseInt(e.target.value) || 0)}
            hint="Idle time before automatic logout (Min 1)"
          />
          <Input
            label="Password Min Length"
            type="number"
            value={minLength.toString()}
            onChange={(e) => setMinLength(parseInt(e.target.value) || 6)}
            hint="Minimum character count for passwords (Min 6)"
          />
        </div>

        <div className="space-y-3 pt-4 border-t border-ledger-rule">
          <h4 className="text-sm font-semibold text-dark-mahogany font-data">Password Complexity Rules</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex items-center gap-2 text-sm text-dark-mahogany cursor-pointer">
              <input
                type="checkbox"
                checked={requireUppercase}
                onChange={(e) => setRequireUppercase(e.target.checked)}
                className="w-4 h-4 text-warm-gold focus:ring-warm-gold border-mahogany-muted rounded"
              />
              Require Uppercase Letters
            </label>
            <label className="flex items-center gap-2 text-sm text-dark-mahogany cursor-pointer">
              <input
                type="checkbox"
                checked={requireLowercase}
                onChange={(e) => setRequireLowercase(e.target.checked)}
                className="w-4 h-4 text-warm-gold focus:ring-warm-gold border-mahogany-muted rounded"
              />
              Require Lowercase Letters
            </label>
            <label className="flex items-center gap-2 text-sm text-dark-mahogany cursor-pointer">
              <input
                type="checkbox"
                checked={requireNumbers}
                onChange={(e) => setRequireNumbers(e.target.checked)}
                className="w-4 h-4 text-warm-gold focus:ring-warm-gold border-mahogany-muted rounded"
              />
              Require Numbers
            </label>
            <label className="flex items-center gap-2 text-sm text-dark-mahogany cursor-pointer">
              <input
                type="checkbox"
                checked={requireSpecialCharacters}
                onChange={(e) => setRequireSpecialCharacters(e.target.checked)}
                className="w-4 h-4 text-warm-gold focus:ring-warm-gold border-mahogany-muted rounded"
              />
              Require Special Characters (!@#$)
            </label>
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-ledger-rule">
          <h4 className="text-sm font-semibold text-dark-mahogany font-data">Maker-Checker Dual Approval</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex items-center gap-2 text-sm text-dark-mahogany cursor-pointer">
              <input
                type="checkbox"
                checked={loanApproval}
                onChange={(e) => setLoanApproval(e.target.checked)}
                className="w-4 h-4 text-warm-gold focus:ring-warm-gold border-mahogany-muted rounded"
              />
              Require Two-Person Loan Approval
            </label>
            <label className="flex items-center gap-2 text-sm text-dark-mahogany cursor-pointer">
              <input
                type="checkbox"
                checked={memberApproval}
                onChange={(e) => setMemberApproval(e.target.checked)}
                className="w-4 h-4 text-warm-gold focus:ring-warm-gold border-mahogany-muted rounded"
              />
              Require Two-Person Member Edit Approval
            </label>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-ledger-rule">
          <Button
            variant="primary"
            leftIcon={<Save className="h-4 w-4" />}
            onClick={handleSave}
            isLoading={updateMutation.isPending}
          >
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
