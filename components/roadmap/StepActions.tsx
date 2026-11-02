'use client'

import { useEffect, useState } from 'react'
import { useLocale } from '@/components/providers/LocaleProvider'
import { toggleDone, isDone } from '@/lib/progress/storage'

export default function StepActions({ id }: { id: string }) {
  const { locale } = useLocale()
  const [done, setDone] = useState(false)
  useEffect(() => setDone(isDone(id)), [id])
  const label = done
    ? locale === 'bn' ? 'সম্পন্ন' : 'Done'
    : locale === 'bn' ? 'সম্পন্ন হিসেবে চিহ্নিত করুন' : 'Mark as done'
  return (
    <button
      type="button"
      onClick={() => setDone(toggleDone(id)[id])}
      className={`btn btn--small self-start ${done ? '' : 'btn--primary'}`}
    >
      {label}
    </button>
  )
}
