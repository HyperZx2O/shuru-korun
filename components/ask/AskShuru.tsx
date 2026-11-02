'use client'

import { useEffect, useRef, useState } from 'react'
import { useLocale } from '@/components/providers/LocaleProvider'
import { loadAskHistory, saveAskHistory, clearAskHistory } from '@/lib/progress/storage'

type Msg = { role: 'user' | 'assistant'; text: string; sources?: { name: string; url: string }[] }

const SUGGESTED: Record<'bn' | 'en', string[]> = {
  bn: ['ভাড়া চুক্তি নেই, কী করব?', 'e-TIN কি বাধ্যতামূলক?', 'DBID কি ফ্রি?', 'ট্রেড লাইসেন্স কত টাকা?'],
  en: ['No rent agreement, what can I use?', 'Is e-TIN required?', 'Is DBID free?', 'How much is a trade license?'],
}

export default function AskShuru() {
  const { locale } = useLocale()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const fabRef = useRef<HTMLButtonElement>(null)
  const [messages, setMessages] = useState<Msg[]>(() => loadAskHistory())
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [voiceSupported, setVoiceSupported] = useState(false)

  useEffect(() => {
    saveAskHistory(messages)
  }, [messages])

  useEffect(() => {
    const el = fabRef.current
    if (!el) return
    const lg = (window as unknown as { liquidGlass?: (el: HTMLElement, opts?: object) => { destroy: () => void } }).liquidGlass
    if (!lg) return
    const instance = lg(el, { scale: -60, chroma: 4, blur: 12, saturate: 1.2, radius: 16, fallbackBlur: 12 })
    return () => instance?.destroy?.()
  }, [])

  useEffect(() => {
    const SR = (window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown }).SpeechRecognition
      ?? (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition
    setVoiceSupported(!!SR)
  }, [])

  function startVoice() {
    const SR = (window as unknown as { SpeechRecognition?: new () => { lang: string; start: () => void; onresult: (e: { results: { [i: number]: { [j: number]: { transcript: string } } } }) => void } }).SpeechRecognition
      ?? (window as unknown as { webkitSpeechRecognition?: new () => { lang: string; start: () => void; onresult: (e: { results: { [i: number]: { [j: number]: { transcript: string } } } }) => void } }).webkitSpeechRecognition
    if (!SR) return
    const rec = new SR()
    rec.lang = locale === 'bn' ? 'bn-BD' : 'en-US'
    rec.onresult = (e) => {
      const transcript = e.results[0][0].transcript
      setInput(transcript)
    }
    rec.start()
  }

  async function send(q?: string) {
    const question = (q ?? input).trim()
    if (!question || loading) return
    setInput('')
    setMessages((m) => [...m, { role: 'user', text: question }])
    setLoading(true)
    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, locale }),
      })
      const data = await res.json()
      if (res.status === 429) {
        setMessages((m) => [...m, { role: 'assistant', text: data.message ?? (locale === 'bn' ? 'অনেক বেশি অনুরোধ।' : 'Too many requests.') }])
      } else {
        setMessages((m) => [
          ...m,
          {
            role: 'assistant',
            text: data.answer ?? (locale === 'bn' ? 'কোনো উত্তর নেই।' : 'No answer.'),
            sources: (data.sources ?? []).map((s: { name: string; url: string }) => ({ name: s.name, url: s.url })),
          },
        ])
      }
    } catch {
      setMessages((m) => [...m, { role: 'assistant', text: locale === 'bn' ? 'নেটওয়ার্ক ত্রুটি। আবার চেষ্টা করুন।' : 'Network error. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  const t = locale === 'bn'
    ? { ask: 'জিজ্ঞাসা করুন', title: 'শুরুকে জিজ্ঞাসা করুন', close: 'বন্ধ করুন', empty: 'ব্যবসা শুরু সম্পর্কে যেকোনো প্রশ্ন করুন। উত্তর শুধু নিয়ম-কানুনের তথ্য থেকে আসে।', thinking: 'ভাবছি…', placeholder: 'আপনার প্রশ্ন লিখুন…', speak: 'বলুন', send: 'পাঠান', footer: 'শুরু করুন আইনি পরামর্শ নয়। আপনার সিটি কর্পোরেশন অফিসে নিশ্চিত করুন। NID, পাসওয়ার্ড বা OTP টাইপ করবেন না।' }
    : { ask: 'Ask Shuru', title: 'Ask Shuru', close: 'Close', empty: 'Ask anything about starting a business. Answers come only from the rules data.', thinking: 'Thinking…', placeholder: 'Type your question…', speak: 'Speak', send: 'Send', footer: 'Shuru Korun is not legal advice. Confirm at your city corporation office. Do not type NIDs, passwords, or OTPs.' }

  return (
    <>
      <button
        ref={fabRef}
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className="glass-fab fixed bottom-4 right-4 z-50"
        aria-label={t.ask}
      >
        {t.ask}
      </button>
      <dialog
        ref={dialogRef}
        className="ask-dialog w-[min(92vw,28rem)] rounded-card border border-border bg-surface p-0 text-ink"
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="display text-lg">{t.title}</h2>
          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <button
                type="button"
                onClick={() => { clearAskHistory(); setMessages([]) }}
                className="link text-sm"
              >
                {locale === 'bn' ? 'মুছুন' : 'Clear'}
              </button>
            )}
            <button type="button" onClick={() => dialogRef.current?.close()} className="link text-sm">
              {t.close}
            </button>
          </div>
        </div>
        <div className="flex max-h-[60vh] flex-col gap-3 overflow-y-auto px-4 py-3">
          {messages.length === 0 && (
            <div className="flex flex-col gap-3">
              <p className="text-sm text-muted">{t.empty}</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED[locale].map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => send(q)}
                    className="rounded-pill border border-border bg-surface px-3 py-1 text-xs text-ink"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((m, i) => (
            <div
              key={i}
              className={`rounded-stock p-3 text-sm ${m.role === 'user' ? 'ml-8 bg-accent/25' : 'mr-8 bg-bg'}`}
            >
              <p className="whitespace-pre-wrap">{m.text}</p>
              {m.sources && m.sources.length > 0 && (
                <ul className="mt-2 flex flex-col gap-1 text-xs text-muted">
                  {m.sources.map((s, j) => (
                    <li key={j}>
                      <a href={s.url} target="_blank" rel="noopener noreferrer" className="link">
                        {s.name}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
          {loading && <p className="text-sm text-muted">{t.thinking}</p>}
        </div>
        <form
          className="flex gap-2 border-t border-border px-4 py-3"
          onSubmit={(e) => {
            e.preventDefault()
            send()
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.placeholder}
            className="flex-1 rounded-input border border-border bg-bg px-4 py-2 text-sm text-ink"
          />
          {voiceSupported && (
            <button
              type="button"
              onClick={startVoice}
              className="btn btn--small"
              aria-label="Voice input"
            >
              {t.speak}
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="btn btn--small btn--primary disabled:opacity-50"
          >
            {t.send}
          </button>
        </form>
        <p className="px-4 pb-3 text-xs text-muted">{t.footer}</p>
      </dialog>
    </>
  )
}
