import { ShieldCheck, Users, Landmark, Award } from 'lucide-react'
import { useLanguageStore } from '@/store/language.store'

export function TrustStats() {
  const { t } = useLanguageStore()

  const stats = [
    { value: t.stats.yearsVal, label: t.stats.yearsServing, icon: Landmark },
    { value: t.stats.membersVal, label: t.stats.activeMembers, icon: Users },
    { value: t.stats.disbursedVal, label: t.stats.loansDisbursed, icon: ShieldCheck },
    { value: t.stats.auditVal, label: t.stats.statutoryCompliance, icon: Award },
  ]

  return (
    <section className="max-w-content mx-auto px-6 lg:px-8 -mt-10 relative z-20">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white rounded-lg p-6 md:p-8 shadow-paper-lg border border-ledger-rule">
        {stats.map((s, idx) => {
          const Icon = s.icon
          return (
            <div
              key={idx}
              className={`text-center space-y-1.5 p-3 ${
                idx !== 0 ? 'border-l border-ledger-rule/60' : ''
              }`}
            >
              <Icon className="h-5 w-5 text-deep-saffron mx-auto mb-1 opacity-80" />
              <p className="font-data text-2xl md:text-3xl font-bold text-dark-mahogany">
                {s.value}
              </p>
              <p className="font-body text-xs md:text-sm text-mahogany-muted">
                {s.label}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
