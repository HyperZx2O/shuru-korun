'use client'

import { useLocale } from '@/components/providers/LocaleProvider'
import ThemeToggle from '@/components/ui/ThemeToggle'
import LanguageToggle from '@/components/ui/LanguageToggle'

export default function SiteHeader() {
  const { locale } = useLocale()
  const t = locale === 'bn'
    ? { start: 'শুরু', roadmap: 'রোডম্যাপ', scam: 'স্ক্যাম শিল্ড', startBtn: 'শুরু করুন' }
    : { start: 'Start', roadmap: 'Roadmap', scam: 'Scam shield', startBtn: 'Start' }

  return (
    <header className="site-header">
      <div className="container nav-inner">
        <a href="/" className="wordmark flex items-center gap-2" aria-label="Shuru Korun home">
          <img src="/logo.svg" alt="" width={32} height={32} className="h-8 w-8 shrink-0" />
          Shuru Korun
        </a>

        <nav className="nav-links" aria-label="Main">
          <a href="/path" className="nav-link">
            {t.start}
          </a>
          <a href="/roadmap" className="nav-link">
            {t.roadmap}
          </a>
          <a href="/scam-shield" className="nav-link">
            {t.scam}
          </a>
        </nav>

        <div className="nav-actions">
          <img
            src="/built-for-aignite-2026.png"
            alt="Built For Ostad Presents YUNet AIgnite Buildathon 2026"
            className="sticker-wobble h-10 w-auto shrink-0"
          />
          <LanguageToggle />
          <ThemeToggle />
          <a href="/path" className="btn btn--small btn--primary nav-start">
            {t.startBtn}
          </a>
        </div>
      </div>
    </header>
  )
}
