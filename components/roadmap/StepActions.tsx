'use client'

import { useEffect, useState } from 'react'
import { useLocale } from '@/components/providers/LocaleProvider'
import { toggleDone, isDone, isNA, getNAReason, setNA } from '@/lib/progress/storage'

export default function StepActions({ id }: { id: string }) {
  const { locale } = useLocale()
  const [done, setDone] = useState(false)
  const [na, setNa] = useState(false)
  const [reason, setReason] = useState('')
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    setDone(isDone(id))
    setNa(isNA(id))
    setReason(getNAReason(id))
  }, [id])

  const t = locale === 'bn'
    ? { done: 'সম্পন্ন', markDone: 'সম্পন্ন হিসেবে চিহ্নিত করুন', na: 'প্রযোজ্য নয়', naOn: 'প্রযোজ্য নয় হিসেবে চিহ্নিত', reasonPh: 'কেন প্রযোজ্য নয়? (ঐচ্ছিক)', save: 'সংরক্ষণ', cancel: 'বাতিল', restore: 'পুনরায় চালু করুন' }
    : { done: 'Done', markDone: 'Mark as done', na: 'Not applicable', naOn: 'Marked not applicable', reasonPh: 'Why not applicable? (optional)', save: 'Save', cancel: 'Cancel', restore: 'Restore' }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setDone(toggleDone(id)[id])}
          className={`btn btn--small self-start ${done ? '' : 'btn--primary'}`}
        >
          {done ? t.done : t.markDone}
        </button>
        {!na && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="btn btn--small self-start"
          >
            {t.na}
          </button>
        )}
        {na && (
          <button
            type="button"
            onClick={() => { setNA(id, false, ''); setNa(false); setReason(''); setEditing(false) }}
            className="btn btn--small self-start"
          >
            {t.restore}
          </button>
        )}
      </div>
      {editing && (
        <div className="flex flex-col gap-2">
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={t.reasonPh}
            rows={2}
            className="rounded-input border border-border bg-bg px-3 py-2 text-sm text-ink"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => { setNA(id, true, reason); setNa(true); setEditing(false) }}
              className="btn btn--small btn--primary"
            >
              {t.save}
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="btn btn--small"
            >
              {t.cancel}
            </button>
          </div>
        </div>
      )}
      {na && !editing && (
        <p className="text-xs text-muted">
          {t.naOn}{reason ? `: ${reason}` : ''}
        </p>
      )}
    </div>
  )
}