'use client'

import { useEffect, useState } from 'react'
import { useLocale } from '@/components/providers/LocaleProvider'

type Official = { host: string; name: string; url: string }
const OFFICIAL: Official[] = [
  { host: 'etradelicense.gov.bd', name: 'e-Trade Licence portal', url: 'https://etradelicense.gov.bd' },
  { host: 'dbid.gov.bd', name: 'DBID portal', url: 'https://dbid.gov.bd' },
  { host: 'secure.incometax.gov.bd', name: 'e-TIN (NBR)', url: 'https://secure.incometax.gov.bd' },
  { host: 'nbr.gov.bd', name: 'National Board of Revenue', url: 'https://nbr.gov.bd' },
  { host: 'dncc.gov.bd', name: 'Dhaka North City Corporation', url: 'https://dncc.gov.bd' },
  { host: 'dscc.gov.bd', name: 'Dhaka South City Corporation', url: 'https://dscc.gov.bd' },
]

const SHORTENERS = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 'is.gd', 'buff.ly', 'cutt.ly']
const SUSPICIOUS_WORDS = ['agent', 'fee', 'fast', '24', 'loan', 'otp', 'pin', 'urgent', 'guarantee', 'cash', 'bribe']

type Verdict = 'official' | 'suspicious' | 'unverified' | null
type Recent = { q: string; v: Verdict; ts: number }

const RECENT_KEY = 'sk.v1.scamchecks'

export default function ScamShieldPage() {
  const { locale } = useLocale()
  const bn = locale === 'bn'

  const cards = bn
    ? [
        { title: 'ভুয়া "এজেন্ট"', fix: 'নিজে ফাইল করুন। কাউকে টাকা দেবেন না।' },
        { title: 'ভুয়া লোন অ্যাপ', fix: 'PIN/OTP শেয়ার করবেন না। ব্লক করুন।' },
        { title: 'অনাধিকারিক সাইট', fix: 'শুধু অফিসিয়াল পোর্টাল ব্যবহার করুন।' },
        { title: 'অতি-আকর্ষণীয় অফার', fix: "Don't trust it. Takes days." },
      ]
    : [
        { title: 'Fake "agents"', fix: 'File it yourself. Never pay an agent.' },
        { title: 'Fake loan apps', fix: 'Never share PIN/OTP. Block them.' },
        { title: 'Unofficial sites', fix: 'Use only official portals.' },
        { title: 'Too-good offers', fix: "Don't trust it. Takes days." },
      ]

  const t = bn
    ? { title: 'স্ক্যাম শিল্ড', sub: 'নতুন উদ্যোক্তাদের প্রতারণা এড়ানোর গাইড।', zero: '০', zeroLabel: 'টাকা লাগে ফাইল করতে', zeroBody: 'অফিসিয়াল রেজিস্ট্রেশন ফ্রি। ফি চাইলে সে প্রতারক।', safe: 'নিরাপদ', safeSub: 'অফিসিয়াল পোর্টাল', scam: 'লাল পতাকা', scamSub: 'এড়াবেন', officialLinks: 'অফিসিয়াল লিংক', footer: 'রেজিস্ট্রেশন ফ্রি। PIN বা OTP শেয়ার করবেন না।', checkTitle: 'লিংক বা নাম্বার যাচাই', checkPh: 'URL বা নাম্বার পেস্ট করুন', checkBtn: 'যাচাই', official: 'অফিসিয়াল — নিরাপদ', suspicious: 'সন্দেহজনক — এড়িয়ে চলুন', unverified: 'তালিকায় নেই — বিশ্বাস করবেন না', empty: 'একটি লিংক বা নাম্বার লিখুন।', report: 'রিপোর্ট করুন', recent: 'সাম্প্রতিক', matched: 'মিলেছে:' }
    : { title: 'Scam shield', sub: 'Avoid scams targeting new founders.', zero: '0', zeroLabel: 'takas to file', zeroBody: 'Official registration is free. Anyone asking for a fee is a scammer.', safe: 'Safe', safeSub: 'Official portals', scam: 'Red flags', scamSub: 'Avoid these', officialLinks: 'Official links', footer: 'Registration is free. Never share PIN or OTP.', checkTitle: 'Check a link or number', checkPh: 'Paste a URL or number', checkBtn: 'Check', official: 'Official — safe', suspicious: 'Suspicious — avoid', unverified: 'Not on the list — do not trust', empty: 'Enter a link or number.', report: 'Report it', recent: 'Recent', matched: 'Matched:' }

  const [query, setQuery] = useState('')
  const [verdict, setVerdict] = useState<Verdict>(null)
  const [matched, setMatched] = useState<Official | null>(null)
  const [spoof, setSpoof] = useState(false)
  const [recent, setRecent] = useState<Recent[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(RECENT_KEY)
      if (raw) setRecent(JSON.parse(raw))
    } catch {}
  }, [])

  function persist(next: Recent[]) {
    setRecent(next)
    try { localStorage.setItem(RECENT_KEY, JSON.stringify(next)) } catch {}
  }

  function isIp(host: string) {
    return /^\d{1,3}(\.\d{1,3}){3}$/.test(host) || host.includes(':')
  }

  function check() {
    const q = query.trim()
    if (!q) { setVerdict(null); setMatched(null); setSpoof(false); return }

    const lower = q.toLowerCase()
    let host = ''
    let parsed: URL | null = null
    try { parsed = new URL(q.startsWith('http') ? q : `https://${q}`) } catch {}
    if (parsed) host = parsed.hostname.toLowerCase().replace(/^www\./, '')

    // Spoofing: an official domain appears as a substring but the real host differs
    const spoofHit = OFFICIAL.some((o) => lower.includes(o.host) && host && host !== o.host)
    // Shortener
    const shortener = SHORTENERS.some((s) => host === s || host.endsWith(`.${s}`))
    // Raw IP
    const ip = host ? isIp(host) : false
    // Non-https
    const insecure = parsed ? parsed.protocol === 'http:' : lower.startsWith('http://')

    if (host && OFFICIAL.some((o) => o.host === host)) {
      setVerdict('official')
      setMatched(OFFICIAL.find((o) => o.host === host) ?? null)
      setSpoof(false)
    } else if (spoofHit || shortener || ip || insecure || SUSPICIOUS_WORDS.some((w) => lower.includes(w))) {
      setVerdict('suspicious')
      setMatched(null)
      setSpoof(spoofHit)
    } else {
      setVerdict('unverified')
      setMatched(null)
      setSpoof(false)
    }

    const entry: Recent = { q, v: verdict ?? null, ts: Date.now() }
    // recompute verdict for entry
    const v: Verdict = host && OFFICIAL.some((o) => o.host === host)
      ? 'official'
      : (spoofHit || shortener || ip || insecure || SUSPICIOUS_WORDS.some((w) => lower.includes(w)))
        ? 'suspicious'
        : 'unverified'
    const next = [{ q, v, ts: Date.now() }, ...recent.filter((r) => r.q !== q)].slice(0, 5)
    persist(next)
  }

  function clearVerdict() {
    setVerdict(null)
    setMatched(null)
    setSpoof(false)
  }

  const verdictClass = verdict === 'official' ? 'text-success' : verdict === 'suspicious' ? 'text-caution' : 'text-muted'
  const verdictText = verdict === 'official' ? t.official : verdict === 'suspicious' ? t.suspicious : verdict === 'unverified' ? t.unverified : ''

  return (
    <div className="container flex flex-col gap-6 py-8">
      <div className="flex flex-col gap-2">
        <h1 className="display text-2xl">{t.title}</h1>
        <p className="text-sm text-muted">{t.sub}</p>
      </div>

      <section className="hero-numeral">
        <span className="hero-numeral-value">{t.zero}</span>
        <span className="hero-numeral-label">{t.zeroLabel}</span>
        <p className="hero-numeral-body">{t.zeroBody}</p>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="sheet-safe flex flex-col gap-3 p-4">
          <h2 className="display text-base">{t.safe}</h2>
          <div className="flex flex-wrap gap-2">
            {OFFICIAL.map((d) => (
              <a key={d.host} className="mini-chip mini-chip--paper" href={d.url} target="_blank" rel="noopener noreferrer">
                {d.host}
              </a>
            ))}
          </div>
        </div>
        <div className="sheet-scam flex flex-col gap-3 p-4">
          <h2 className="display text-base">{t.scam}</h2>
          <div className="flex flex-wrap gap-2">
            {cards.map((c) => (
              <span key={c.title} className="mini-chip mini-chip--paper">
                {c.title}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {cards.map((c) => (
          <div key={c.title} className="scam-strip flex items-center justify-between gap-3 p-3">
            <h2 className="display text-base">{c.title}</h2>
            <p className="text-sm font-semibold">{c.fix}</p>
          </div>
        ))}
      </div>

      <section className="sheet flex flex-col gap-3 p-4">
        <h2 className="display text-lg">{t.checkTitle}</h2>
        <div className="flex gap-2">
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); clearVerdict() }}
            placeholder={t.checkPh}
            className="flex-1 rounded-input border border-border bg-bg px-4 py-2 text-sm text-ink"
            aria-label={t.checkTitle}
          />
          <button type="button" onClick={check} disabled={!query.trim()} className="btn btn--small btn--primary disabled:opacity-50">
            {t.checkBtn}
          </button>
        </div>
        <div aria-live="polite" className="min-h-[1.25rem]">
          {verdict && (
            <p className={`text-sm font-semibold ${verdictClass}`}>
              {verdictText}
              {verdict === 'official' && matched && (
                <span className="block text-xs font-normal text-muted">
                  {t.matched} {matched.name} — {matched.url}
                </span>
              )}
              {verdict === 'suspicious' && spoof && (
                <span className="block text-xs font-normal text-muted">
                  {bn ? 'এটি একটি অফিসিয়াল ডোমেইনের নাম ব্যবহার করে প্রতারণা করছে।' : 'This is spoofing an official domain name.'}
                </span>
              )}
            </p>
          )}
          {!verdict && query === '' && <p className="text-xs text-muted">{t.empty}</p>}
        </div>
        {verdict === 'unverified' || verdict === 'suspicious' ? (
          <p className="text-xs text-muted">
            <a className="link" href="https://www.police.gov.bd" target="_blank" rel="noopener noreferrer">
              {t.report}
            </a>
          </p>
        ) : null}
        {recent.length > 0 && (
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted">{t.recent}</span>
            <div className="flex flex-wrap gap-2">
              {recent.map((r) => (
                <button
                  key={r.ts}
                  type="button"
                  onClick={() => { setQuery(r.q); clearVerdict() }}
                  className="mini-chip"
                >
                  {r.q}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      <p className="text-xs text-muted">{t.footer}</p>
    </div>
  )
}
