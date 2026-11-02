'use client'

import { useParams } from 'next/navigation'
import { notFound } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useLocale } from '@/components/providers/LocaleProvider'
import StepActions from '@/components/roadmap/StepActions'
import { toggleDocDone, isDocDone } from '@/lib/progress/storage'
import { TRADE_LICENSE_STEPS } from '@/lib/rules/trade-license'
import { DBID_STEPS } from '@/lib/rules/dbid'
import { SOURCES } from '@/lib/rules/sources'

const ALL = [...TRADE_LICENSE_STEPS, ...DBID_STEPS]

const STATUS_LABEL: Record<string, { en: string; bn: string; cls: string }> = {
  verified: { en: 'Verified', bn: 'যাচাইকৃত', cls: 'status--verified' },
  dated: { en: 'Dated source', bn: 'পুরোনো সূত্র', cls: 'status--dated' },
  confirm: { en: 'Confirm at office', bn: 'অফিসে নিশ্চিত করুন', cls: 'status--confirm' },
}

export default function StepPage() {
  const { id } = useParams<{ id: string }>()
  const { locale } = useLocale()
  const step = ALL.find((s) => s.id === id)
  const [docDone, setDocDone] = useState<boolean[]>([])
  useEffect(() => {
    if (!step) return
    setDocDone(step.documents.map((_, i) => isDocDone(step.id, i)))
  }, [step?.id])
  if (!step) notFound()

  const index = ALL.findIndex((s) => s.id === id)
  const total = ALL.length
  const pct = ((index + 1) / total) * 100

  const label = STATUS_LABEL[step.status]
  const t = locale === 'bn'
    ? { back: 'রোডম্যাপে ফিরুন', status: 'অবস্থা', warning: 'সতর্কতা', explanation: 'ব্যাখ্যা', documents: 'প্রয়োজনীয় কাগজপত্র', fee: 'ফি', processing: 'প্রক্রিয়াকরণের সময়', sources: 'সূত্র', lastChecked: 'সর্বশেষ যাচাই', confirm: 'নিশ্চিত করুন' }
    : { back: 'Back to roadmap', status: 'Status', warning: 'Warning', explanation: 'Explanation', documents: 'Documents', fee: 'Fee', processing: 'Processing time', sources: 'Sources', lastChecked: 'Last checked', confirm: 'Confirm at office' }

  return (
    <article className="container flex flex-col gap-6 py-8">
      <Link href="/roadmap" className="link text-sm">
        {t.back}
      </Link>

      <div className="step-rail">
        <div className="step-rail-track">
          <div className="step-rail-fill" style={{ width: `${pct}%` }} />
        </div>
        <span className="step-rail-label">
          {locale === 'bn' ? `ধাপ ${index + 1} / ${total}` : `Step ${index + 1} of ${total}`}
        </span>
      </div>

      <header className="flex flex-col gap-2">
        <StepActions id={step.id} />
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="display text-2xl">{step.title[locale]}</h1>
          <span className={`status ${label.cls}`}>{label[locale]}</span>
        </div>
        <p className="text-sm text-muted">{step.title[locale === 'bn' ? 'en' : 'bn']}</p>
        <p className="text-base text-ink">{step.summary[locale]}</p>
      </header>

      {step.lockWarning && (
        <div className="sheet sheet-coral p-4 text-sm">
          <strong className="text-coral-ink">{t.warning}:</strong> {step.lockWarning[locale]}
        </div>
      )}

      <section className="flex flex-col gap-2">
        <h2 className="display text-lg">{t.explanation}</h2>
        <p className="text-base text-ink">{step.explanation[locale]}</p>
        <p className="text-sm text-muted">{step.explanation[locale === 'bn' ? 'en' : 'bn']}</p>
      </section>

      {step.documents.length > 0 && (
        <section className="flex flex-col gap-2">
          <h2 className="display text-lg">{t.documents}</h2>
          <ul className="flex flex-col gap-2">
            {step.documents.map((d, i) => (
              <li key={i} className="sheet p-3 text-sm">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={!!docDone[i]}
                    onChange={() => {
                      const v = toggleDocDone(step.id, i)
                      setDocDone((prev) => {
                        const next = [...prev]
                        next[i] = v
                        return next
                      })
                    }}
                    className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-accent)]"
                  />
                  <span className="flex-1">
                    <span className="text-ink">{d.label[locale]}</span>
                    <span className={`status ml-2 ${STATUS_LABEL[d.status].cls}`}>
                      {STATUS_LABEL[d.status][locale]}
                    </span>
                    <p className="text-xs text-muted">{d.label[locale === 'bn' ? 'en' : 'bn']}</p>
                    {d.note && <p className="mt-1 text-xs text-caution">{d.note[locale]}</p>}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </section>
      )}

      {step.fee && (
        <section className="flex flex-col gap-1">
          <h2 className="display text-lg">{t.fee}</h2>
          <p className="fact-value">{step.fee.display[locale]}</p>
          <p className="text-xs text-muted">{step.fee.display[locale === 'bn' ? 'en' : 'bn']}</p>
        </section>
      )}

      {step.timeline && (
        <section className="flex flex-col gap-1">
          <h2 className="display text-lg">{t.processing}</h2>
          <p className="text-base text-ink">{step.timeline.display[locale]}</p>
          <p className="text-xs text-muted">{step.timeline.display[locale === 'bn' ? 'en' : 'bn']}</p>
        </section>
      )}

      <section className="flex flex-col gap-1">
        <h2 className="display text-lg">{t.sources}</h2>
        <ul className="flex flex-col gap-1 text-xs text-muted">
          {step.sources.map((sid) => {
            const s = SOURCES[sid]
            return (
              <li key={sid}>
                {s ? (
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="link">
                    {s.name}
                  </a>
                ) : (
                  sid
                )}
                {s?.checkedAt ? `, checked ${s.checkedAt}` : s?.publishedAt ? `, published ${s.publishedAt}` : ''}
              </li>
            )
          })}
        </ul>
        <p className="text-xs text-muted">{t.lastChecked}: {step.lastChecked}</p>
      </section>
    </article>
  )
}
