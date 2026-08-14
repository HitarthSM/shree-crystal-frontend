import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input, Select } from '@/components/ui/FormControls'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { ArrowLeft, Save } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from '@/components/ui/Toast'
import { useMutation } from '@tanstack/react-query'
import apiClient from '@/api/client'

const memberSchema = z.object({
  fullName: z.string().min(3, "Name must be at least 3 characters"),
  fatherOrHusbandName: z.string().optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  mobile: z.string().regex(/^[0-9]{10}$/, "Invalid 10-digit mobile number"),
  email: z.string().email("Invalid email address").optional().or(z.literal('')),
  dob: z.string().refine((val) => {
    const age = (new Date().getTime() - new Date(val).getTime()) / (365.25 * 24 * 60 * 60 * 1000)
    return age >= 18
  }, "Member must be at least 18 years old"),
  addressLine1: z.string().min(5, "Address is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().regex(/^[0-9]{6}$/, "Invalid pincode"),
  pan: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i, "Invalid PAN format").optional().or(z.literal('')),
  aadhaar: z.string().regex(/^\d{12}$/, "Invalid 12-digit Aadhaar"),
  shareCapital: z.string().refine(val => parseInt(val) >= 500, "Minimum share capital is ₹500").optional(),
  nomineeName: z.string().optional(),
  nomineeRelation: z.string().optional(),
  nomineeContact: z.string().optional(),
})

type MemberForm = z.infer<typeof memberSchema>

export function AdminMemberAdd() {
  const navigate = useNavigate()
  const createMember = useMutation({
    mutationFn: (data: any) => apiClient.post('/members', data).then(res => res.data)
  })
  
  const { register, handleSubmit, formState: { errors } } = useForm<MemberForm>({
    resolver: zodResolver(memberSchema)
  })

  const onSubmit = async (data: MemberForm) => {
    try {
      await createMember.mutateAsync({
        ...data,
        email: data.email || undefined,
        pan: data.pan || undefined,
        shareCapital: data.shareCapital || undefined,
      } as any)
      toast.success('The new member record has been saved successfully.')
      navigate('/admin/members')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create member record.')
    }
  }

  return (
    <div className="space-y-8 animate-fade-slide-up max-w-4xl">
      <header className="flex flex-col gap-4">
        <Link 
          to="/admin/members"
          className="inline-flex items-center gap-2 text-sm font-body text-mahogany-muted hover:text-dark-mahogany transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold rounded-sm w-fit"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Directory
        </Link>
        <div>
          <h1 className="text-display-md font-display text-dark-mahogany mb-1">
            Register New Member
          </h1>
          <p className="text-body text-mahogany-muted">
            Create a new society member profile and record initial share capital.
          </p>
        </div>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card padding="md">
          <CardHeader className="mb-4 pb-4 border-b border-ledger-rule">
            <CardTitle>Personal Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="Full Name" 
              placeholder="e.g. Ramesh Patel" 
              {...register('fullName')} 
              error={errors.fullName?.message}
            />
            <Input 
              label="Father/Husband Name" 
              placeholder="e.g. Suresh Patel" 
              {...register('fatherOrHusbandName')} 
              error={errors.fatherOrHusbandName?.message}
            />
            <Input 
              label="Date of Birth" 
              type="date" 
              {...register('dob')} 
              error={errors.dob?.message}
            />
            <Select
              label="Gender"
              {...register('gender')}
              error={errors.gender?.message}
              options={[
                { value: '', label: 'Select Gender' },
                { value: 'MALE', label: 'Male' },
                { value: 'FEMALE', label: 'Female' },
                { value: 'OTHER', label: 'Other' }
              ]}
            />
            <Input 
              label="Mobile Number" 
              placeholder="10-digit mobile number" 
              {...register('mobile')} 
              error={errors.mobile?.message}
            />
            <Input 
              label="Email Address (Optional)" 
              type="email" 
              placeholder="email@example.com" 
              {...register('email')} 
              error={errors.email?.message}
            />
            <div className="md:col-span-2">
              <Input 
                label="Address Line 1" 
                placeholder="House No, Building, Street" 
                {...register('addressLine1')} 
                error={errors.addressLine1?.message}
              />
            </div>
            <div className="md:col-span-2">
              <Input 
                label="Address Line 2 (Optional)" 
                placeholder="Area, Landmark" 
                {...register('addressLine2')} 
                error={errors.addressLine2?.message}
              />
            </div>
            <Input 
              label="City" 
              placeholder="City" 
              {...register('city')} 
              error={errors.city?.message}
            />
            <Input 
              label="State" 
              placeholder="State" 
              {...register('state')} 
              error={errors.state?.message}
            />
            <Input 
              label="Pincode" 
              placeholder="6-digit pincode" 
              {...register('pincode')} 
              error={errors.pincode?.message}
            />
          </CardContent>
        </Card>

        <Card padding="md">
          <CardHeader className="mb-4 pb-4 border-b border-ledger-rule">
            <CardTitle>KYC & Compliance</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="PAN Number" 
              placeholder="ABCDE1234F" 
              className="uppercase"
              {...register('pan')} 
              error={errors.pan?.message}
            />
            <Input 
              label="Aadhaar Number" 
              placeholder="12-digit number" 
              {...register('aadhaar')} 
              error={errors.aadhaar?.message}
            />
          </CardContent>
        </Card>

        <Card padding="md">
          <CardHeader className="mb-4 pb-4 border-b border-ledger-rule">
            <CardTitle>Society Registration</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="Initial Share Capital (₹)" 
              type="number"
              placeholder="Min 500" 
              {...register('shareCapital')} 
              error={errors.shareCapital?.message}
            />
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input 
                label="Nominee Name" 
                placeholder="Full name of nominee" 
                {...register('nomineeName')} 
                error={errors.nomineeName?.message}
              />
              <Select 
                label="Nominee Relation"
                {...register('nomineeRelation')}
                error={errors.nomineeRelation?.message}
                options={[
                  { value: '', label: 'Select relation' },
                  { value: 'Spouse', label: 'Spouse' },
                  { value: 'Son', label: 'Son' },
                  { value: 'Daughter', label: 'Daughter' },
                  { value: 'Parent', label: 'Parent' },
                  { value: 'Other', label: 'Other' },
                ]}
              />
              <Input 
                label="Nominee Contact" 
                placeholder="Mobile number" 
                {...register('nomineeContact')} 
                error={errors.nomineeContact?.message}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="ghost" onClick={() => navigate('/admin/members')}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="primary" 
            isLoading={createMember.isPending}
            leftIcon={<Save className="h-4 w-4" />}
          >
            Save Member Record
          </Button>
        </div>
      </form>
    </div>
  )
}
