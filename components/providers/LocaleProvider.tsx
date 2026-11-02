'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type Locale = 'bn' | 'en'

type LocaleContextValue = {
  locale: Locale
  setLocale: (l: Locale) => void
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('bn')

  useEffect(() => {
    const stored = localStorage.getItem('sk.v1.lang')
    const initial: Locale = stored === 'en' ? 'en' : 'bn'
    setLocaleState(initial)
    document.documentElement.lang = initial
  }, [])

  function setLocale(l: Locale) {
    setLocaleState(l)
    document.documentElement.lang = l
    localStorage.setItem('sk.v1.lang', l)
  }

  return <LocaleContext.Provider value={{ locale, setLocale }}>{children}</LocaleContext.Provider>
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used inside LocaleProvider')
  return ctx
}
