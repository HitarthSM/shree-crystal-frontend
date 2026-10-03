import { Card } from '@/components/ui/Card'
import { Landmark, TrendingUp, ShieldCheck } from 'lucide-react'
import { useLanguageStore } from '@/store/language.store'

export function ServicesGrid() {
  const { t } = useLanguageStore()

  const services = [
    {
      icon: Landmark,
      title: t.services.savingsTitle,
      desc: t.services.savingsDesc,
      tag: t.services.savingsTag,
    },
    {
      icon: TrendingUp,
      title: t.services.personalLoansTitle,
      desc: t.services.personalLoansDesc,
      tag: t.services.personalLoansTag,
    },
    {
      icon: ShieldCheck,
      title: t.services.fdTitle,
      desc: t.services.fdDesc,
      tag: t.services.fdTag,
    },
  ]

  return (
    <section className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-display-md font-display text-dark-mahogany">
          {t.services.sectionHeading}
        </h2>
        <p className="text-body text-mahogany-muted max-w-xl mx-auto">
          {t.services.sectionSubheading}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((item, idx) => {
          const Icon = item.icon
          return (
            <Card
              key={idx}
              padding="lg"
              className="relative hover:border-warm-gold/60 transition-all duration-200 group bg-white shadow-paper hover:shadow-paper-md"
            >
              <div className="inline-block p-3 rounded-full bg-deep-saffron/10 text-deep-saffron mb-4 group-hover:bg-warm-gold/20 group-hover:text-dark-mahogany transition-colors">
                <Icon className="h-6 w-6" />
              </div>
              <span className="absolute top-6 right-6 text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-ledger-paper border border-ledger-rule text-mahogany-muted">
                {item.tag}
              </span>
              <h3 className="text-display-sm font-display text-dark-mahogany mb-2">
                {item.title}
              </h3>
              <p className="text-body text-mahogany-muted text-sm leading-relaxed">
                {item.desc}
              </p>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
