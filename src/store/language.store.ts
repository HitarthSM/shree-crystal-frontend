import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Language, translations, TranslationSchema } from '@/lib/i18n/translations'

interface LanguageState {
  language: Language
  t: TranslationSchema
  setLanguage: (lang: Language) => void
  toggleLanguage: () => void
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: 'en',
      t: translations.en,

      setLanguage: (lang: Language) => {
        set({
          language: lang,
          t: translations[lang],
        })
      },

      toggleLanguage: () => {
        const nextLang: Language = get().language === 'en' ? 'gu' : 'en'
        set({
          language: nextLang,
          t: translations[nextLang],
        })
      },
    }),
    {
      name: 'shree-crystal-language',
      partialize: (state) => ({ language: state.language }),
      onRehydrateStorage: () => (state) => {
        if (state && state.language) {
          state.t = translations[state.language] || translations.en
        }
      },
    }
  )
)
