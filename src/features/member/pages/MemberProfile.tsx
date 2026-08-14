import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useAuthStore } from '@/store/auth.store'
import { User, MapPin, Phone, ShieldCheck, Mail, Building2 } from 'lucide-react'
import { useQuery, useMutation } from '@tanstack/react-query'
import apiClient from '@/api/client'
import { format } from 'date-fns'
import { toast } from '@/components/ui/Toast'

export function MemberProfile() {
  const { user } = useAuthStore()
  const { data: profile, isLoading } = useQuery({
    queryKey: ['memberProfile'],
    queryFn: () => apiClient.get('/members/me').then(res => res.data)
  })
  const changeMutation = useMutation({
    mutationFn: (data: any) => apiClient.post('/members/me/change-requests', data).then(res => res.data)
  })

  const handleUpdateKYC = async () => {
    try {
      const res = await changeMutation.mutateAsync({ type: 'KYC_UPDATE' })
      toast.success(res.message || 'Change request submitted for admin approval')
    } catch (err) {
      toast.error('Failed to submit change request')
    }
  }

  if (isLoading) {
    return <div className="p-8 text-center text-mahogany-muted font-body">Loading profile...</div>
  }

  if (!profile) {
    return <div className="p-8 text-center text-deep-crimson font-body">Failed to load profile.</div>
  }

  return (
    <div className="space-y-8 animate-fade-slide-up">
      <header>
        <h1 className="text-display-md font-display text-dark-mahogany mb-1">
          Member Profile
        </h1>
        <p className="text-body text-mahogany-muted">
          Your official society records and KYC information.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: ID Card style summary */}
        <div className="md:col-span-1 space-y-6">
          <Card className="bg-deep-saffron text-ivory overflow-hidden border-none shadow-card relative">
            <div 
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #FAF5E8 31px, #FAF5E8 32px)' }}
            />
            <div className="relative z-10 p-6 flex flex-col items-center text-center">
              <div className="h-20 w-20 rounded-full border-4 border-warm-gold/50 flex items-center justify-center bg-deep-saffron-light text-ivory font-display font-bold text-3xl mb-4">
                {user?.name?.charAt(0).toUpperCase() || 'M'}
              </div>
              <h2 className="font-display text-xl font-semibold mb-1">{user?.name}</h2>
              <p className="font-data text-warm-gold tracking-widest mb-4">{user?.memberId}</p>
              <Badge variant="active" className="bg-verdant-green text-white border-none">
                {profile.status} Member
              </Badge>
            </div>
            <div className="relative z-10 bg-black/20 p-4 text-sm font-data text-ivory/80 flex justify-between">
              <span>Joined</span>
              <span>{profile.membershipDate ? format(new Date(profile.membershipDate), 'dd MMM yyyy') : 'N/A'}</span>
            </div>
          </Card>
        </div>

        {/* Right Column: Detailed Info */}
        <div className="md:col-span-2 space-y-8">
          
          <section>
            <h3 className="flex items-center gap-2 font-display text-lg text-dark-mahogany mb-4 border-b border-ledger-rule pb-2">
              <User className="h-5 w-5 text-warm-gold" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white p-6 rounded-[6px] border border-ledger-rule shadow-paper">
              <div>
                <p className="text-sm font-body text-mahogany-muted mb-1 flex items-center gap-1.5"><Phone className="h-4 w-4" /> Mobile</p>
                <p className="font-data text-dark-mahogany">{user?.mobile}</p>
              </div>
              <div>
                <p className="text-sm font-body text-mahogany-muted mb-1 flex items-center gap-1.5"><Mail className="h-4 w-4" /> Email</p>
                <p className="font-data text-dark-mahogany">{user?.email || 'Not registered'}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-sm font-body text-mahogany-muted mb-1 flex items-center gap-1.5"><MapPin className="h-4 w-4" /> Registered Address</p>
                <p className="font-body text-dark-mahogany">{profile.address || 'Not registered'}</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="flex items-center gap-2 font-display text-lg text-dark-mahogany mb-4 border-b border-ledger-rule pb-2">
              <ShieldCheck className="h-5 w-5 text-warm-gold" />
              KYC & Compliance
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white p-6 rounded-[6px] border border-ledger-rule shadow-paper">
              <div>
                <p className="text-sm font-body text-mahogany-muted mb-1">PAN Number</p>
                <p className="font-data text-dark-mahogany">{profile.panEncrypted || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-body text-mahogany-muted mb-1">Aadhaar Number</p>
                <p className="font-data text-dark-mahogany">{profile.aadhaarEncrypted || 'N/A'}</p>
              </div>
              <div className="sm:col-span-2 pt-4 mt-2 border-t border-ledger-rule/50 flex justify-between items-center">
                <div>
                  <p className="text-sm font-body text-mahogany-muted mb-0.5">KYC Status</p>
                  <p className="text-verdant-green text-sm font-medium flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4" />
                    Verified
                  </p>
                </div>
                <button 
                  onClick={handleUpdateKYC}
                  disabled={changeMutation.isPending}
                  className="text-sm font-medium text-warm-gold hover:text-warm-gold-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold rounded-sm disabled:opacity-50"
                >
                  {changeMutation.isPending ? 'Submitting...' : 'Update KYC'}
                </button>
              </div>
            </div>
          </section>

          <section>
            <h3 className="flex items-center gap-2 font-display text-lg text-dark-mahogany mb-4 border-b border-ledger-rule pb-2">
              <Building2 className="h-5 w-5 text-warm-gold" />
              Society Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white p-6 rounded-[6px] border border-ledger-rule shadow-paper">
              <div>
                <p className="text-sm font-body text-mahogany-muted mb-1">Share Capital</p>
                <p className="font-data text-dark-mahogany">₹ 5000</p>
              </div>
              <div>
                <p className="text-sm font-body text-mahogany-muted mb-1">Registered Nominee</p>
                <p className="font-body text-dark-mahogany">Not registered</p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}
