// Core types for the Shuru Korun rules data.
// Every fact in the app originates from a Step record below.

export type Status = 'verified' | 'dated' | 'confirm'

export type Authority = 'official' | 'unofficial'

export type Source = {
  id: string
  name: string
  url: string
  authority: Authority
  /** When the source page was authored (e.g. "2017"). */
  publishedAt?: string
  /** When we last loaded it live (e.g. "2026-11-01"). */
  checkedAt?: string
}

export type LocaleText = { bn: string; en: string }

export type ConditionField = 'channels' | 'area' | 'premises' | 'food' | 'sells'

export type Condition =
  | { field: 'channels'; contains: 'shop' | 'home' | 'online' | 'service' }
  | { field: 'area'; equals: 'dhaka-north' | 'dhaka-south' | 'other' }
  | { field: 'premises'; equals: 'rented' | 'owned' | 'family' }
  | { field: 'food'; equals: boolean }
  | { field: 'sells'; equals: 'food' | 'retail' | 'handmade' | 'service' | 'other' }

export type DocumentItem = {
  label: LocaleText
  status: Status
  note?: LocaleText
}

export type Fee = {
  /** Only a range is ever shown. Never a single figure. */
  minBdt?: number
  maxBdt?: number
  display: LocaleText
  status: Status
}

export type Timeline = {
  display: LocaleText
  status: Status
}

export type Step = {
  id: string
  path: 'trade-license' | 'dbid'
  order: number
  title: LocaleText
  summary: LocaleText
  explanation: LocaleText
  documents: DocumentItem[]
  fee?: Fee
  timeline?: Timeline
  sources: string[] // Source ids
  status: Status // weakest status among the facts on this step
  lastChecked: string
  // Array of clauses. A step applies if ANY clause matches (OR of AND-groups).
  // Empty array means "always applies".
  appliesWhen: Condition[][]
  lockWarning?: LocaleText
}

export type Intake = {
  sells: 'food' | 'retail' | 'handmade' | 'service' | 'other'
  area: 'dhaka-north' | 'dhaka-south' | 'other'
  channels: ('shop' | 'home' | 'online' | 'service')[]
  premises: 'rented' | 'owned' | 'family'
  food: boolean
}

export function deriveStatus(source: Source): Status {
  if (source.authority === 'unofficial') return 'confirm'
  if (source.checkedAt) {
    const checked = new Date(source.checkedAt)
    const cutoff = new Date()
    cutoff.setFullYear(cutoff.getFullYear() - 1)
    if (checked >= cutoff) return 'verified'
  }
  if (source.publishedAt) return 'dated'
  return 'confirm'
}

export function weakestStatus(statuses: Status[]): Status {
  const rank: Record<Status, number> = { verified: 0, dated: 1, confirm: 2 }
  return statuses.reduce<Status>(
    (acc, s) => (rank[s] > rank[acc] ? s : acc),
    'verified',
  )
}