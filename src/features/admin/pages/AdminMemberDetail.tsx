import { useParams, Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { LedgerRow } from '@/components/ui/LedgerRow'
import { formatINR, maskAadhaar, maskPAN } from '@/lib/utils'
import { ArrowLeft, Edit3, ShieldAlert, FileText, Landmark } from 'lucide-react'

// Mock Data
const member = { 
  id: 'SC-00847', 
  name: 'Ramesh Patel', 
  mobile: '9876543210', 
  email: 'ramesh.p@example.com',
  status: 'active', 
  joined: '15 Jan 2018',
  kyc: { pan: 'ABCDE1234F', aadhaar: '123456789012', status: 'verified' },
  address: '14, Shreeji Society, Navrangpura, Ahmedabad 380009',
  shareCapital: 5000,
  nominee: 'Suresh Patel (Son)'
}

const activeLoans = [
  { id: 'L-24-089', type: 'Personal Loan', principal: 500000, outstanding: 45000, emi: 5200, nextDue: '05 Apr 2025' }
]

export function AdminMemberDetail() {
  const { id } = useParams()
  
  // In reality, you'd fetch the member by ID here. We'll use mock data.

  return (
    <div className="space-y-8 animate-fade-slide-up">
      <header className="flex flex-col gap-4">
        <Link 
          to="/admin/members"
          className="inline-flex items-center gap-2 text-sm font-body text-mahogany-muted hover:text-dark-mahogany transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold rounded-sm w-fit"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Directory
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-deep-saffron flex items-center justify-center text-ivory font-display font-bold text-2xl shadow-card">
              {member.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-display-md font-display text-dark-mahogany mb-1 flex items-center gap-3">
                {member.name}
                <Badge variant={member.status as any}>{member.status.toUpperCase()}</Badge>
              </h1>
              <p className="font-data text-mahogany-muted">
                {id} • Joined {member.joined}
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button variant="secondary" leftIcon={<Edit3 className="h-4 w-4" />}>
              Edit Profile
            </Button>
            <Button variant="primary">
              New Loan
            </Button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Info Cards */}
        <div className="space-y-6">
          <Card padding="md">
            <CardHeader className="mb-4">
              <CardTitle className="text-lg">Contact & KYC</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs font-data text-mahogany-muted uppercase tracking-wider mb-1">Mobile</p>
                <p className="font-body text-sm font-medium text-dark-mahogany">{member.mobile}</p>
              </div>
              <div>
                <p className="text-xs font-data text-mahogany-muted uppercase tracking-wider mb-1">Email</p>
                <p className="font-body text-sm font-medium text-dark-mahogany">{member.email}</p>
              </div>
              <div>
                <p className="text-xs font-data text-mahogany-muted uppercase tracking-wider mb-1">Address</p>
                <p className="font-body text-sm text-dark-mahogany">{member.address}</p>
              </div>
              <div className="pt-4 border-t border-ledger-rule flex justify-between items-end">
                <div>
                  <p className="text-xs font-data text-mahogany-muted uppercase tracking-wider mb-1">KYC Status</p>
                  <p className="font-body text-sm text-verdant-green font-medium flex items-center gap-1.5">
                    <ShieldAlert className="h-4 w-4" /> Verified
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-data text-sm text-dark-mahogany">{maskPAN(member.kyc.pan)}</p>
                  <p className="font-data text-sm text-dark-mahogany">{maskAadhaar(member.kyc.aadhaar)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card padding="md">
            <CardHeader className="mb-4">
              <CardTitle className="text-lg">Society Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-body text-mahogany-muted">Share Capital</span>
                <span className="font-data text-sm text-dark-mahogany">{formatINR(member.shareCapital)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-body text-mahogany-muted">Nominee</span>
                <span className="font-body text-sm text-dark-mahogany">{member.nominee}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Financials */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Active Loans */}
          <Card padding="none">
            <CardHeader className="p-6 pb-4 border-b border-ledger-rule bg-deep-saffron/5 rounded-t-[6px]">
              <CardTitle className="text-lg flex items-center gap-2">
                <Landmark className="h-5 w-5 text-deep-saffron" />
                Active Loans
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {activeLoans.map(loan => (
                <div key={loan.id} className="border border-ledger-rule rounded-[4px] p-4 bg-white shadow-paper">
                  <div className="flex justify-between items-start mb-4 pb-4 border-b border-ledger-rule border-dashed">
                    <div>
                      <h4 className="font-body font-semibold text-dark-mahogany">{loan.type}</h4>
                      <p className="font-data text-sm text-mahogany-muted">{loan.id}</p>
                    </div>
                    <Badge variant="active">Active</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs font-body text-mahogany-muted mb-1">Principal</p>
                      <p className="font-data text-sm text-dark-mahogany">{formatINR(loan.principal)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-body text-mahogany-muted mb-1">Outstanding</p>
                      <p className="font-data text-sm font-medium text-warm-gold">{formatINR(loan.outstanding)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-body text-mahogany-muted mb-1">EMI (Due {loan.nextDue})</p>
                      <p className="font-data text-sm text-deep-crimson">{formatINR(loan.emi)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Statements */}
          <Card padding="none">
            <CardHeader className="p-6 pb-4 border-b border-ledger-rule flex justify-between items-center">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-mahogany-muted" />
                Recent Statements
              </CardTitle>
              <Button variant="ghost" size="sm">View All</Button>
            </CardHeader>
            <CardContent className="p-0">
              <LedgerRow
                stamped
                title="Savings Account Statement"
                subtitle="Feb 2025"
                date="01 Mar 2025"
                className="px-6"
              />
              <LedgerRow
                stamped
                title="Personal Loan Statement"
                subtitle="Feb 2025"
                date="01 Mar 2025"
                className="px-6"
              />
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}
