import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input, Select } from '@/components/ui/FormControls'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { ArrowLeft, Save } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from '@/components/ui/Toast'

const memberSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  mobile: z.string().regex(/^[6-9]\d{9}$/, "Invalid 10-digit mobile number"),
  email: z.string().email("Invalid email address").optional().or(z.literal('')),
  dob: z.string().refine((val) => {
    const age = (new Date().getTime() - new Date(val).getTime()) / (365.25 * 24 * 60 * 60 * 1000)
    return age >= 18
  }, "Member must be at least 18 years old"),
  address: z.string().min(10, "Address is required"),
  pan: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format"),
  aadhaar: z.string().regex(/^\d{12}$/, "Invalid 12-digit Aadhaar"),
  shareCapital: z.string().refine(val => parseInt(val) >= 500, "Minimum share capital is ₹500"),
  nomineeName: z.string().min(3, "Nominee name is required"),
  nomineeRelation: z.string().min(1, "Relation is required"),
})

type MemberForm = z.infer<typeof memberSchema>

export function AdminMemberAdd() {
  const navigate = useNavigate()
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<MemberForm>({
    resolver: zodResolver(memberSchema)
  })

  const onSubmit = async (data: MemberForm) => {
    try {
      // Mock API call
      await new Promise(r => setTimeout(r, 1000))
      console.log('Submitted:', data)
      toast.success('The new member record has been saved successfully.')
      navigate('/admin/members')
    } catch (err) {
      toast.error('Failed to create member record.')
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
              {...register('name')} 
              error={errors.name?.message}
            />
            <Input 
              label="Date of Birth" 
              type="date" 
              {...register('dob')} 
              error={errors.dob?.message}
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
                label="Registered Address" 
                placeholder="Full residential address" 
                {...register('address')} 
                error={errors.address?.message}
              />
            </div>
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
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
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
            isLoading={isSubmitting}
            leftIcon={<Save className="h-4 w-4" />}
          >
            Save Member Record
          </Button>
        </div>
      </form>
    </div>
  )
}
