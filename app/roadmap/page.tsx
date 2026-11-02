'use client'

import { Suspense, useMemo, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { buildRoadmap } from '@/lib/engine/build-roadmap'
import type { Intake } from '@/lib/rules/types'
import { useLocale } from '@/components/providers/LocaleProvider'
import ProgressSummary from '@/components/roadmap/ProgressSummary'
import Reminders from '@/components/reminders/Reminders'
import { FEATURES } from '@/lib/config/features'

const VALID_SELLS = ['food', 'retail', 'handmade', 'service', 'other'] as const
const VALID_AREAS = ['dhaka-north', 'dhaka-south', 'other'] as const
const VALID_CHANNELS = ['shop', 'home', 'online', 'service'] as const
const VALID_PREMISES = ['rented', 'owned', 'family'] as const

function parse(params: URLSearchParams): Intake {
  const sells = (VALID_SELLS as readonly string[]).includes(params.get('sells') ?? '')
    ? (params.get('sells') as Intake['sells'])
    : 'retail'
  const area = (VALID_AREAS as readonly string[]).includes(params.get('area') ?? '')
    ? (params.get('area') as Intake['area'])
    : 'dhaka-north'
  const channels = (params.get('channels') ?? 'shop')
    .split(',')
    .filter((c): c is (typeof VALID_CHANNELS)[number] => (VALID_CHANNELS as readonly string[]).includes(c))
  const premises = (VALID_PREMISES as readonly string[]).includes(params.get('premises') ?? '')
    ? (params.get('premises') as Intake['premises'])
    : 'rented'
  const food = params.get('food') === 'true'
  return { sells, area, channels: channels.length ? channels : ['shop'], premises, food }
}

const STATUS_LABEL: Record<string, { en: string; bn: string; cls: string }> = {
  verified: { en: 'Verified', bn: 'যাচাইকৃত', cls: 'status--verified' },
  dated: { en: 'Dated source', bn: 'পুরোনো সূত্র', cls: 'status--dated' },
  confirm: { en: 'Confirm at office', bn: 'অফিসে নিশ্চিত করুন', cls: 'status--confirm' },
}

function RoadmapInner() {
  const sp = useSearchParams()
  const router = useRouter()
  const { locale } = useLocale()
  const params = useMemo(() => new URLSearchParams(sp.toString()), [sp])
  const hasParams = sp.toString().length > 0

  useEffect(() => {
    if (!hasParams) router.replace('/path')
  }, [hasParams, router])

  const intake = useMemo(() => parse(params), [params])
  const { steps, notes } = useMemo(() => buildRoadmap(intake), [intake])

  const backLabel = locale === 'bn' ? 'রোডম্যাপে ফিরুন' : 'Back to roadmap'
  const title = locale === 'bn' ? 'আপনার রোডম্যাপ' : 'Your roadmap'
  const loading = locale === 'bn' ? 'রোডম্যাপ লোড হচ্ছে…' : 'Loading roadmap…'
  const empty = locale === 'bn' ? 'এই তথ্যের জন্য কোনো ধাপ প্রযোজ্য নয়। আপনার উত্তর বদলান।' : 'No steps apply for this intake. Adjust your answers.'
  const noteText = locale === 'bn'
    ? 'নিশ্চিত করুন: আপনি অনলাইন এবং সরাসরি উভয়ভাবেই বিক্রি করেন। ট্রেড লাইসেন্স ছাড়াও DBID লাগতে পারে।'
    : 'Confirm: you sell both online and in person. Check whether you also need a trade licence in addition to a DBID.'

  return (
    <div className="container flex flex-col gap-6 py-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="display text-2xl">{title}</h1>
        <ProgressSummary total={steps.length} />
      </div>

      {notes.includes('confirm-trade-license') && (
        <div className="sheet p-4 text-sm">
          <strong>{locale === 'bn' ? 'নিশ্চিত করুন:' : 'Confirm:'}</strong> {noteText}
        </div>
      )}

      <ol className="roadmap-list flex flex-col gap-3">
        {steps.map((step, i) => {
          const label = STATUS_LABEL[step.status]
          return (
            <li key={step.id} className="rise" style={{ animationDelay: `${i * 40}ms` }}>
              <Link
                href={`/step/${step.id}`}
                className="stack-card"
                style={{ marginBlockStart: 0, rotate: '0deg', textDecoration: 'none' }}
              >
                <span className="stack-num">{String(i + 1).padStart(2, '0')}</span>
                <span>
                  <span className="stack-title">{step.title[locale]}</span>
                  <span className="stack-meta">{step.summary[locale]}</span>
                </span>
                <span className={`status ${label.cls}`}>{label[locale]}</span>
              </Link>
            </li>
          )
        })}
      </ol>

      {steps.length === 0 && <p className="text-muted">{empty}</p>}

      {FEATURES.reminders && <Reminders />}
    </div>
  )
}

export default function RoadmapPage() {
  return (
    <Suspense fallback={<p className="container py-8 text-muted">…</p>}>
      <RoadmapInner />
    </Suspense>
  )
}
