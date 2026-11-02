'use client'

import { useLocale } from '@/components/providers/LocaleProvider'

export default function SiteFooter() {
  const { locale } = useLocale()
  const t = locale === 'bn'
    ? {
        tagline: 'বাংলাদেশে আপনার ব্যবসা শুরু করুন, ধাপে ধাপে, নিশ্চিতভাবে।',
        disclaimer: 'এটি একটি তথ্যমূলক গাইড, আইনি পরামর্শ নয়। ফি, কাগজপত্র এবং সময়সীমা পরিবর্তিত হয়। আপনার সিটি কর্পোরেশন অফিস বা অফিসিয়াল পোর্টালে নিশ্চিত করুন।',
        app: 'অ্যাপ',
        startPath: 'আমার পথ শুরু করুন',
        seeRoadmap: 'একটি রোডম্যাপ দেখুন',
        scamShield: 'স্ক্যাম শিল্ড',
        askShuru: 'শুরুকে জিজ্ঞাসা করুন',
        sources: 'সূত্র',
        reviewed: 'নিয়ম-কানুনের তথ্য সর্বশেষ যাচাই: ১ নভেম্বর ২০২৬।',
      }
    : {
        tagline: 'Start your business in Bangladesh, one confirmed step at a time.',
        disclaimer: 'An information guide, not legal advice. Fees, documents, and timelines change. Confirm at your city corporation office or on the official portal.',
        app: 'The app',
        startPath: 'Start my path',
        seeRoadmap: 'See a roadmap',
        scamShield: 'Scam shield',
        askShuru: 'Ask Shuru',
        sources: 'Sources',
        reviewed: 'Rules data reviewed 1 November 2026.',
      }

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <h2 className="wordmark footer-wordmark flex items-center gap-2">
              <img src="/logo.svg" alt="" width={40} height={40} className="h-10 w-10 shrink-0" />
              Shuru Korun
            </h2>
            <p className="label">{t.tagline}</p>
            <p className="label" style={{ marginTop: 'var(--space-sm)' }}>
              {t.disclaimer}
            </p>
          </div>

          <div className="footer-col">
            <h3 className="label">{t.app}</h3>
            <a href="/path">{t.startPath}</a>
            <a href="/path">{t.seeRoadmap}</a>
            <a href="/scam-shield">{t.scamShield}</a>
            <a href="/api/ask">{t.askShuru}</a>
          </div>

          <div className="footer-col">
            <h3 className="label">{t.sources}</h3>
            <a href="https://etradelicense.gov.bd" rel="noreferrer">
              e-Trade Licence portal
            </a>
            <a href="https://nbr.gov.bd" rel="noreferrer">
              National Board of Revenue
            </a>
            <a href="https://dncc.gov.bd" rel="noreferrer">
              Dhaka North City Corporation
            </a>
            <a href="https://dscc.gov.bd" rel="noreferrer">
              Dhaka South City Corporation
            </a>
          </div>
        </div>

        <p className="footer-credit">
          {t.reviewed} Photographs:{' '}
          <a href="https://commons.wikimedia.org/wiki/File:Cloth-roll.jpg">Samanthafara</a> (CC
          BY-SA 4.0) and{' '}
          <a href="https://commons.wikimedia.org/wiki/File:Young_businesswoman_holding_her_smartphone_in_the_home_office.jpg">
            Shixart1985
          </a>{' '}
          (CC BY 2.0), via Wikimedia Commons.
        </p>
      </div>
    </footer>
  )
}
