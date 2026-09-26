import { Globe } from 'lucide-react'
import { useLanguageStore } from '@/store/language.store'

interface LanguageSwitcherProps {
  className?: string
  variant?: 'header' | 'mobile' | 'light'
}

export function LanguageSwitcher({ className = '', variant = 'header' }: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguageStore()

  if (variant === 'light') {
    return (
      <div className={`inline-flex items-center gap-1.5 p-1 rounded-md bg-stone-100 border border-ledger-rule text-dark-mahogany ${className}`}>
        <Globe className="h-4 w-4 text-warm-gold ml-1.5 shrink-0" aria-hidden="true" />
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => setLanguage('en')}
            aria-label="Switch to English"
            className={`px-2.5 py-1 text-xs font-semibold rounded transition-all ${
              language === 'en'
                ? 'bg-deep-saffron text-ivory shadow-sm'
                : 'text-stone-600 hover:text-dark-mahogany'
            }`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setLanguage('gu')}
            aria-label="ગુજરાતી ભાષા પસંદ કરો"
            className={`px-2.5 py-1 text-xs font-semibold rounded transition-all ${
              language === 'gu'
                ? 'bg-deep-saffron text-ivory shadow-sm'
                : 'text-stone-600 hover:text-dark-mahogany'
            }`}
          >
            ગુજરાતી
          </button>
        </div>
      </div>
    )
  }

  if (variant === 'mobile') {
    return (
      <div className={`flex items-center justify-between p-2 rounded-lg bg-ivory/10 border border-ivory/15 ${className}`}>
        <div className="flex items-center gap-2 text-ivory text-sm font-medium">
          <Globe className="h-4 w-4 text-warm-gold" />
          <span>ભાષા / Language</span>
        </div>
        <div className="flex items-center bg-deep-saffron-hover rounded border border-ivory/20 p-0.5">
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
              language === 'en'
                ? 'bg-warm-gold text-dark-mahogany'
                : 'text-ivory/80 hover:text-ivory'
            }`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setLanguage('gu')}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
              language === 'gu'
                ? 'bg-warm-gold text-dark-mahogany'
                : 'text-ivory/80 hover:text-ivory'
            }`}
          >
            ગુજરાતી
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`inline-flex items-center gap-1.5 p-1 rounded-md bg-ivory/10 border border-ivory/20 text-ivory backdrop-blur-sm ${className}`}>
      <Globe className="h-4 w-4 text-warm-gold ml-1.5 shrink-0" aria-hidden="true" />
      <div className="flex items-center">
        <button
          type="button"
          onClick={() => setLanguage('en')}
          aria-label="Switch to English"
          className={`px-2.5 py-1 text-xs font-semibold rounded transition-all ${
            language === 'en'
              ? 'bg-warm-gold text-dark-mahogany shadow-sm'
              : 'text-ivory/75 hover:text-ivory'
          }`}
        >
          EN
        </button>
        <button
          type="button"
          onClick={() => setLanguage('gu')}
          aria-label="ગુજરાતી ભાષા પસંદ કરો"
          className={`px-2.5 py-1 text-xs font-semibold rounded transition-all ${
            language === 'gu'
              ? 'bg-warm-gold text-dark-mahogany shadow-sm'
              : 'text-ivory/75 hover:text-ivory'
          }`}
        >
          ગુજરાતી
        </button>
      </div>
    </div>
  )
}
