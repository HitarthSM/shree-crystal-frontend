import { Link } from 'react-router-dom'
import { LinkButton } from '@/components/ui/Button'
import { ShieldCheck, ArrowRight } from 'lucide-react'
import { useLanguageStore } from '@/store/language.store'

export function HeroSection() {
  const { t } = useLanguageStore()

  return (
    <section className="bg-deep-saffron relative overflow-hidden bg-[radial-gradient(ellipse_75%_65%_at_80%_-10%,rgba(200,134,44,0.25),rgba(107,45,0,0))]">
      <div className="max-w-content mx-auto px-6 lg:px-8 pt-16 pb-24 lg:pt-20 lg:pb-28 flex flex-col md:flex-row items-center gap-12 relative z-10">
        <div className="flex-1 space-y-6">
          {/* Trust Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-ivory/10 border border-ivory/20 text-ivory text-xs font-body font-medium backdrop-blur-sm shadow-sm">
            <ShieldCheck className="h-4 w-4 text-warm-gold" />
            <span>{t.hero.trustBadge}</span>
          </div>

          <h1 className="text-display-lg font-display text-ivory animate-hero leading-tight">
            {t.hero.titlePart1}
            <br />
            {t.hero.titlePart2}
          </h1>

          <p className="text-body-lg text-ivory/85 max-w-lg animate-hero-delayed">
            {t.hero.subtitle}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 animate-hero-btn">
            <LinkButton
              to="/login"
              variant="gold"
              rightIcon={<ArrowRight className="h-4 w-4 text-dark-mahogany/80" />}
              className="h-12 px-6 text-base"
            >
              {t.hero.memberLogin}
            </LinkButton>
            <Link
              to="/about"
              className="inline-flex items-center justify-center gap-2 font-body font-medium rounded-[4px] border border-ivory/30 text-ivory hover:bg-ivory/10 transition-colors h-12 px-5 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold"
            >
              {t.hero.learnMore}
            </Link>
          </div>
        </div>

        {/* Floating Animated Passbook / Ledger Graphic */}
        <div className="flex-1 animate-hero-delayed hidden md:block animate-float">
          <div className="relative">
            <svg
              viewBox="0 0 400 300"
              className="w-full h-auto drop-shadow-2xl rounded-xl border border-warm-gold/20"
              aria-hidden="true"
            >
              <rect x="0" y="0" width="400" height="300" fill="#FAF5E8" rx="8" />
              <rect x="0" y="0" width="400" height="24" fill="#E6DBCA" />
              <circle cx="16" cy="12" r="4" fill="#C8862C" />
              <circle cx="30" cy="12" r="4" fill="#C8862C" opacity="0.6" />
              {[1, 2, 3, 4, 5].map((i) => (
                <g key={i} transform={`translate(0, ${i * 45 + 16})`}>
                  <line
                    x1="20"
                    y1="0"
                    x2="380"
                    y2="0"
                    stroke="rgba(44,26,14,0.12)"
                    strokeWidth="1"
                  />
                  {i % 2 !== 0 && (
                    <>
                      <circle
                        cx="45"
                        cy="-20"
                        r="9"
                        stroke="#C8862C"
                        strokeWidth="2"
                        fill="none"
                      />
                      <circle cx="45" cy="-20" r="6" fill="#C8862C" />
                    </>
                  )}
                  <rect
                    x="75"
                    y="-26"
                    width={120 + ((i * 15) % 50)}
                    height="12"
                    fill="rgba(44,26,14,0.65)"
                    rx="2"
                  />
                  <rect
                    x="75"
                    y="-8"
                    width={80 + ((i * 20) % 40)}
                    height="7"
                    fill="rgba(44,26,14,0.3)"
                    rx="2"
                  />
                  <rect x="300" y="-24" width="60" height="12" fill="#C8862C" rx="2" />
                </g>
              ))}
            </svg>

            {/* Floating Verified Stamp Badge */}
            <div className="absolute -bottom-4 -left-4 bg-white border border-warm-gold/40 rounded-lg px-4 py-2.5 shadow-lg flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-verdant-green/15 flex items-center justify-center text-verdant-green">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-dark-mahogany font-data">{t.hero.auditVerified}</p>
                <p className="text-[10px] text-mahogany-muted">{t.hero.classARating}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-warm-gold" />
    </section>
  )
}
