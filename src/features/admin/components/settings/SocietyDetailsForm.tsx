import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/FormControls'
import { Button } from '@/components/ui/Button'
import { SkeletonCard } from '@/components/ui/Skeleton'
import { Save } from 'lucide-react'
import { toast } from '@/components/ui/Toast'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '@/api/client'

interface SocietyDetailsData {
  name?: string
  registrationNumber?: string
  registrationNo?: string
  address?: string
  logoUrl?: string
}

export function SocietyDetailsForm() {
  const qc = useQueryClient()
  const { data, isLoading } = useQuery<SocietyDetailsData>({
    queryKey: ['societyDetails'],
    queryFn: () => apiClient.get('/settings/society').then((r) => r.data),
  })

  const updateMutation = useMutation({
    mutationFn: (payload: {
      name: string
      registrationNumber: string
      address: string
      logoUrl?: string
    }) => apiClient.put('/settings/society', payload).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['societyDetails'] }),
  })

  const [name, setName] = useState('')
  const [registrationNumber, setRegistrationNumber] = useState('')
  const [address, setAddress] = useState('')
  const [logoUrl, setLogoUrl] = useState('')

  useEffect(() => {
    if (data) {
      setName(data.name || '')
      setRegistrationNumber(data.registrationNumber || data.registrationNo || '')
      setAddress(data.address || '')
      setLogoUrl(data.logoUrl || '')
    }
  }, [data])

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync({
        name,
        registrationNumber,
        address,
        logoUrl: logoUrl.trim() ? logoUrl.trim() : undefined,
      })
      toast.success('Society details updated successfully')
    } catch {
      toast.error('Failed to update society details')
    }
  }

  if (isLoading) {
    return <SkeletonCard />
  }

  return (
    <Card padding="lg">
      <CardHeader className="mb-6">
        <CardTitle>Society Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Input label="Society Name" value={name} onChange={(e) => setName(e.target.value)} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Registration Number"
            value={registrationNumber}
            onChange={(e) => setRegistrationNumber(e.target.value)}
          />
          <Input
            label="Logo URL (Optional)"
            type="url"
            placeholder="https://example.com/logo.png"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
          />
        </div>
        <Input label="Full Address" value={address} onChange={(e) => setAddress(e.target.value)} />

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
