'use client'

import { useEffect, useState } from 'react'
import { useLocale } from '@/components/providers/LocaleProvider'

type Reminder = { id: string; label: string; date: string }

const KEY = 'sk.v1.reminders'

function load(): Reminder[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]')
  } catch {
    return []
  }
}
function save(list: Reminder[]) {
  localStorage.setItem(KEY, JSON.stringify(list))
}

export default function Reminders() {
  const { locale } = useLocale()
  const [list, setList] = useState<Reminder[]>([])
  const [label, setLabel] = useState('')
  const [date, setDate] = useState('')

  useEffect(() => setList(load()), [])

  function add() {
    if (!label.trim() || !date) return
    const next = [...list, { id: crypto.randomUUID(), label: label.trim(), date }]
    setList(next)
    save(next)
    setLabel('')
    setDate('')
  }

  function remove(id: string) {
    const next = list.filter((r) => r.id !== id)
    setList(next)
    save(next)
  }

  const today = new Date().toISOString().slice(0, 10)

  const t = locale === 'bn'
    ? { title: 'রিমাইন্ডার', labelPh: 'লেবেল', datePh: 'তারিখ', add: 'যোগ করুন', remove: 'মুছুন', empty: 'কোনো রিমাইন্ডার নেই।' }
    : { title: 'Reminders', labelPh: 'Label', datePh: 'Date', add: 'Add', remove: 'Remove', empty: 'No reminders yet.' }

  return (
    <section className="sheet flex flex-col gap-3 p-4">
      <h2 className="display text-lg">{t.title}</h2>
      <div className="flex flex-wrap gap-2">
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder={t.labelPh}
          className="flex-1 rounded-input border border-border bg-bg px-4 py-2 text-sm text-ink"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-input border border-border bg-bg px-4 py-2 text-sm text-ink"
        />
        <button type="button" onClick={add} className="btn btn--small btn--primary">
          {t.add}
        </button>
      </div>
      {list.length === 0 && <p className="text-sm text-muted">{t.empty}</p>}
      <ul className="flex flex-col gap-2">
        {list.map((r) => (
          <li
            key={r.id}
            className="flex items-center justify-between gap-3 rounded-stock border border-border bg-bg px-3 py-2 text-sm"
          >
            <span>
              {r.label},{' '}
              <span className={r.date < today ? 'text-accent-3 font-semibold' : 'text-muted'}>{r.date}</span>
            </span>
            <button type="button" onClick={() => remove(r.id)} className="link text-xs">
              {t.remove}
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
