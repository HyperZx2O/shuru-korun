'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale } from '@/components/providers/LocaleProvider'
import { buildRoadmap } from '@/lib/engine/build-roadmap'
import { saveIntake } from '@/lib/progress/storage'

type Sells = 'food' | 'retail' | 'handmade' | 'service' | 'other'
type Area = 'dhaka-north' | 'dhaka-south' | 'other'
type Channel = 'shop' | 'home' | 'online' | 'service'
type Premises = 'rented' | 'owned' | 'family'

const SELLS: { v: Sells; bn: string; en: string }[] = [
  { v: 'food', bn: 'খাদ্য', en: 'Food' },
  { v: 'retail', bn: 'পণ্য', en: 'Retail goods' },
  { v: 'handmade', bn: 'হস্তশিল্প', en: 'Handmade' },
  { v: 'service', bn: 'সেবা', en: 'Service' },
  { v: 'other', bn: 'অন্যান্য', en: 'Other' },
]
const AREAS: { v: Area; bn: string; en: string }[] = [
  { v: 'dhaka-north', bn: 'ঢাকা উত্তর', en: 'Dhaka North' },
  { v: 'dhaka-south', bn: 'ঢাকা দক্ষিণ', en: 'Dhaka South' },
  { v: 'other', bn: 'অন্যত্র', en: 'Elsewhere' },
]
const CHANNELS: { v: Channel; bn: string; en: string }[] = [
  { v: 'shop', bn: 'দোকান', en: 'Shop' },
  { v: 'home', bn: 'বাসা থেকে', en: 'From home' },
  { v: 'online', bn: 'অনলাইন / ফেসবুক', en: 'Online / Facebook' },
  { v: 'service', bn: 'সেবা', en: 'Service' },
]
const PREMISES: { v: Premises; bn: string; en: string }[] = [
  { v: 'rented', bn: 'ভাড়া', en: 'Rented' },
  { v: 'owned', bn: 'নিজস্ব', en: 'Owned' },
  { v: 'family', bn: 'পারিবারিক', en: 'Family-owned' },
]

const STEP_TITLES = (locale: 'bn' | 'en') => locale === 'bn'
  ? ['আপনি কী বিক্রি করেন?', 'আপনি কোথায়?', 'কীভাবে বিক্রি করেন?', 'আপনার প্রাঙ্গণ', 'পর্যালোচনা']
  : ['What do you sell?', 'Where are you?', 'How do you sell?', 'Your premises', 'Review']

export default function IntakePage() {
  const router = useRouter()
  const { locale } = useLocale()
  const [step, setStep] = useState(0)
  const [sells, setSells] = useState<Sells | null>(null)
  const [area, setArea] = useState<Area | null>(null)
  const [channels, setChannels] = useState<Channel[]>([])
  const [premises, setPremises] = useState<Premises | null>(null)

  const food = sells === 'food'
  const canProceed =
    step === 0 ? sells !== null
    : step === 1 ? area !== null
    : step === 2 ? channels.length > 0
    : step === 3 ? premises !== null
    : true
  const titles = STEP_TITLES(locale)
  const t = locale === 'bn'
    ? { stepOf: (s: number) => `ধাপ ${s + 1} / 5`, back: 'পেছনে', next: 'পরবর্তী', build: 'আমার রোডম্যাপ তৈরি করুন', review: 'পর্যালোচনা', sells: 'বিক্রি', area: 'এলাকা', channels: 'চ্যানেল', premisesL: 'প্রাঙ্গণ', food: 'খাদ্য', edit: 'বদলান', answer: 'উত্তর দিন', summary: 'আপনার উত্তর', preview: 'আপনার রোডম্যাপে প্রায়', steps: 'টি ধাপ থাকবে', emptyChannels: 'কমপক্ষে একটি চ্যানেল বেছে নিন।', choose: 'চালিয়ে যেতে একটি বেছে নিন।' }
    : { stepOf: (s: number) => `Step ${s + 1} of 5`, back: 'Back', next: 'Next', build: 'Build my roadmap', review: 'Review', sells: 'Sells', area: 'Area', channels: 'Channels', premisesL: 'Premises', food: 'Food', edit: 'Edit', answer: 'Answer', summary: 'Your answers', preview: 'Your roadmap will include about', steps: 'steps', emptyChannels: 'Pick at least one channel.', choose: 'Choose one to continue.' }

  function toggleChannel(c: Channel) {
    setChannels((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]))
  }

  function next() {
    if (!canProceed) return
    if (step < 4) setStep(step + 1)
    else submit()
  }
  function back() {
    if (step > 0) setStep(step - 1)
  }
  function goTo(s: number) { setStep(s) }

  function submit() {
    if (!sells || !area || !premises || channels.length === 0) return
    const intake = { sells, area, channels, premises, food }
    saveIntake(intake)
    const params = new URLSearchParams()
    params.set('sells', sells)
    params.set('area', area)
    params.set('channels', channels.join(','))
    params.set('premises', premises)
    params.set('food', String(food))
    router.push(`/roadmap?${params.toString()}`)
  }

  const sellsLabel = sells ? SELLS.find((o) => o.v === sells)?.[locale] ?? null : null
  const areaLabel = area ? AREAS.find((o) => o.v === area)?.[locale] ?? null : null
  const channelLabels = channels.length
    ? channels.map((c) => CHANNELS.find((o) => o.v === c)?.[locale] ?? c).join(', ')
    : null
  const premisesLabel = premises ? PREMISES.find((o) => o.v === premises)?.[locale] ?? null : null

  const roadmapPreview = sells && area && premises && channels.length > 0
    ? buildRoadmap({ sells, area, channels, premises, food })
    : null

  const renderChips = (items: { v: string; bn: string; en: string }[], selected: string | string[] | null, onToggle: (v: string) => void) => (
    <div className="intake-chips">
      {items.map((o) => {
        const isSel = Array.isArray(selected) ? selected.includes(o.v) : selected === o.v
        return (
          <button
            key={o.v}
            type="button"
            onClick={() => onToggle(o.v)}
            className="chip"
            aria-pressed={isSel}
          >
            {o[locale]}
          </button>
        )
      })}
    </div>
  )

  const summaryCard = (
    <div className="intake-summary">
      <h3 className="display text-base">{t.summary}</h3>
      <ul className="intake-summary-list">
        <li>
          <span className="intake-summary-key">{t.sells}</span>
          <span className={`intake-summary-val${sellsLabel ? '' : ' is-empty'}`}>{sellsLabel ?? '—'}</span>
          <button type="button" onClick={() => goTo(0)} className="link text-xs">{sells ? t.edit : t.answer}</button>
        </li>
        <li>
          <span className="intake-summary-key">{t.area}</span>
          <span className={`intake-summary-val${areaLabel ? '' : ' is-empty'}`}>{areaLabel ?? '—'}</span>
          <button type="button" onClick={() => goTo(1)} className="link text-xs">{area ? t.edit : t.answer}</button>
        </li>
        <li>
          <span className="intake-summary-key">{t.channels}</span>
          <span className={`intake-summary-val${channelLabels ? '' : ' is-empty'}`}>{channelLabels ?? '—'}</span>
          <button type="button" onClick={() => goTo(2)} className="link text-xs">{channelLabels ? t.edit : t.answer}</button>
        </li>
        <li>
          <span className="intake-summary-key">{t.premisesL}</span>
          <span className={`intake-summary-val${premisesLabel ? '' : ' is-empty'}`}>{premisesLabel ?? '—'}</span>
          <button type="button" onClick={() => goTo(3)} className="link text-xs">{premises ? t.edit : t.answer}</button>
        </li>
      </ul>
      {step === 4 && roadmapPreview && (
        <p className="intake-preview">
          {t.preview} <strong>{roadmapPreview.steps.length}</strong> {t.steps}.
        </p>
      )}
    </div>
  )

  return (
    <div className="container flex flex-col gap-6 py-8">
      {/* Progress rail */}
      <div className="intake-rail" aria-label={t.stepOf(step)}>
        <div className="intake-rail-track">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className={`intake-rail-dot ${i < step ? 'done' : i === step ? 'current' : ''}`}
            />
          ))}
        </div>
        <span className="intake-rail-label">{t.stepOf(step)}</span>
      </div>

      <div className="intake-layout">
        <div className="intake-main">
          <div className="flex items-center text-sm text-muted">
            <button type="button" onClick={back} disabled={step === 0} className="link disabled:opacity-40">
              {t.back}
            </button>
          </div>

          {step === 0 && (
            <fieldset className="flex flex-col gap-3">
              <legend className="display text-xl">{titles[0]}</legend>
              {renderChips(SELLS, sells, (v) => setSells(v as Sells))}
            </fieldset>
          )}

          {step === 1 && (
            <fieldset className="flex flex-col gap-3">
              <legend className="display text-xl">{titles[1]}</legend>
              {renderChips(AREAS, area, (v) => setArea(v as Area))}
            </fieldset>
          )}

          {step === 2 && (
            <fieldset className="flex flex-col gap-3">
              <legend className="display text-xl">{titles[2]}</legend>
              {renderChips(CHANNELS, channels, (v) => toggleChannel(v as Channel))}
              {channels.length === 0 && <p className="text-sm text-caution">{t.emptyChannels}</p>}
            </fieldset>
          )}

          {step === 3 && (
            <fieldset className="flex flex-col gap-3">
              <legend className="display text-xl">{titles[3]}</legend>
              {renderChips(PREMISES, premises, (v) => setPremises(v as Premises))}
            </fieldset>
          )}

          {step === 4 && (
            <div className="flex flex-col gap-3">
              <h2 className="display text-xl">{t.review}</h2>
              {summaryCard}
            </div>
          )}

          <button
            type="button"
            onClick={next}
            disabled={!canProceed}
            className="btn btn--primary self-start"
          >
            {step < 4 ? t.next : t.build}
          </button>
          {step < 4 && !canProceed && step !== 2 && (
            <p className="text-sm text-muted">{t.choose}</p>
          )}
        </div>

        {/* Live summary sidebar (desktop). Hidden on the review step, which shows
            the same summary in the main column, so it never appears twice. */}
        {step !== 4 && (
          <aside className="intake-aside">
            {summaryCard}
          </aside>
        )}
      </div>
    </div>
  )
}
