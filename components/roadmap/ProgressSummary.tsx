'use client'

import { useEffect, useState } from 'react'
import { useLocale } from '@/components/providers/LocaleProvider'
import { loadProgress } from '@/lib/progress/storage'

export default function ProgressSummary({ total }: { total: number }) {
  const { locale } = useLocale()
  const [done, setDone] = useState(0)
  useEffect(() => setDone(Object.values(loadProgress()).filter(Boolean).length), [])
  const label = locale === 'bn' ? 'সম্পন্ন' : 'done'
  return (
    <div className="rounded-pill border border-border bg-surface px-3 py-1 text-sm text-muted">
      {done} / {total} {label}
    </div>
  )
}
