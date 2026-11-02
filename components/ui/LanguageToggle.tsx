'use client'

import { useLocale } from '@/components/providers/LocaleProvider'

export default function LanguageToggle() {
  const { locale, setLocale } = useLocale()

  return (
    <button
      type="button"
      onClick={() => setLocale(locale === 'bn' ? 'en' : 'bn')}
      className="btn btn--small"
      aria-label="Switch language"
    >
      {locale === 'bn' ? 'EN' : 'বাং'}
    </button>
  )
}
