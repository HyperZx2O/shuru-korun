'use client'

import { useEffect, useRef, useState } from 'react'
import { useLocale } from '@/components/providers/LocaleProvider'
import { loadAskHistory, saveAskHistory, clearAskHistory } from '@/lib/progress/storage'

type Msg = { role: 'user' | 'assistant'; text: string; sources?: { name: string; url: string }[] }

const SUGGESTED: Record<'bn' | 'en', string[]> = {
  bn: ['ভাড়া চুক্তি নেই, কী করব?', 'e-TIN কি বাধ্যতামূলক?', 'DBID কি ফ্রি?', 'ট্রেড লাইসেন্স কত টাকা?'],
  en: ['No rent agreement, what can I use?', 'Is e-TIN required?', 'Is DBID free?', 'How much is a trade license?'],
}

function linkify(text: string) {
  const parts = text.split(/(https?:\/\/[^\s)]+)/g)
  return parts.map((p, i) =>
    /^https?:\/\//.test(p) ? (
      <a key={i} href={p} target="_blank" rel="noopener noreferrer" className="link break-all">
        {p}
      </a>
    ) : (
      <span key={i}>{p}</span>
    ),
  )
}

export default function AskShuru() {
  const { locale } = useLocale()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const fabRef = useRef<HTMLButtonElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [messages, setMessages] = useState<Msg[]>(() => loadAskHistory())
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [voiceSupported, setVoiceSupported] = useState(false)
  const [copied, setCopied] = useState<number | null>(null)
  const [retryQ, setRetryQ] = useState<string | null>(null)
  const [lastQ, setLastQ] = useState('')

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

  useEffect(() => {
    saveAskHistory(messages)
  }, [messages])

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, loading])

  function openDialog() {
    dialogRef.current?.showModal()
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  function autoGrow() {
    const el = inputRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 96) + 'px'
  }

  async function send(q?: string) {
    const question = (q ?? input).trim()
    if (!question || loading) return
    setLastQ(question)
    setInput('')
    if (inputRef.current) inputRef.current.style.height = 'auto'
    setMessages((m) => [...m, { role: 'user', text: question }])
    setLoading(true)
    setRetryQ(null)
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
      setRetryQ(question)
    } finally {
      setLoading(false)
    }
  }

  function startVoice() {
    const SR = (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition
    if (!SR) return
    const rec = new SR()
    rec.lang = locale === 'bn' ? 'bn-BD' : 'en-US'
    rec.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript
      setInput(transcript)
      setTimeout(autoGrow, 0)
    }
    rec.start()
  }

  function copyAnswer(i: number, text: string) {
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(i)
      setTimeout(() => setCopied(null), 1200)
    }).catch(() => {})
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      send()
    }
    if (e.key === 'ArrowUp' && !input) {
      e.preventDefault()
      if (lastQ) setInput(lastQ)
      setTimeout(autoGrow, 0)
    }
  }

  const t = locale === 'bn'
    ? { ask: 'জিজ্ঞাসা করুন', title: 'শুরুকে জিজ্ঞাসা করুন', close: 'বন্ধ করুন', empty: 'ব্যবসা শুরু সম্পর্কে যেকোনো প্রশ্ন করুন। উত্তর শুধু নিয়ম-কানুনের তথ্য থেকে আসে।', tryAsk: 'চেষ্টা করুন:', thinking: 'ভাবছি…', placeholder: 'আপনার প্রশ্ন লিখুন…', speak: 'বলুন', send: 'পাঠান', footer: 'শুরু করুন আইনি পরামর্শ নয়। আপনার সিটি কর্পোরেশন অফিসে নিশ্চিত করুন। NID, পাসওয়ার্ড বা OTP টাইপ করবেন না।', you: 'আপনি', shuru: 'শুরু', sources: 'সূত্র', copy: 'কপি', copied: 'কপি হয়েছে', retry: 'আবার চেষ্টা', clear: 'মুছুন' }
    : { ask: 'Ask Shuru', title: 'Ask Shuru', close: 'Close', empty: 'Ask anything about starting a business. Answers come only from the rules data.', tryAsk: 'Try asking:', thinking: 'Thinking…', placeholder: 'Type your question…', speak: 'Speak', send: 'Send', footer: 'Shuru Korun is not legal advice. Confirm at your city corporation office. Do not type NIDs, passwords, or OTPs.', you: 'You', shuru: 'Shuru', sources: 'Sources', copy: 'Copy', copied: 'Copied', retry: 'Retry', clear: 'Clear' }

  return (
    <>
      <button
        ref={fabRef}
        type="button"
        onClick={openDialog}
        className="glass-fab fixed bottom-4 right-4 z-50"
        aria-label={t.ask}
      >
        {t.ask}
      </button>
      <dialog
        ref={dialogRef}
        aria-labelledby="ask-title"
        className="ask-dialog w-[min(92vw,36rem)] rounded-card border border-border bg-surface p-0 text-ink"
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <h2 id="ask-title" className="display text-lg">{t.title}</h2>
          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <button
                type="button"
                onClick={() => { clearAskHistory(); setMessages([]) }}
                className="link text-sm"
              >
                {t.clear}
              </button>
            )}
            <button type="button" onClick={() => dialogRef.current?.close()} className="link text-sm ask-close">
              {t.close}
            </button>
          </div>
        </div>
        <div ref={scrollRef} className="flex max-h-[65vh] flex-col gap-3 overflow-y-auto px-6 py-5">
          {messages.length === 0 && (
            <div className="flex flex-col gap-3">
              <p className="text-sm text-muted">{t.empty}</p>
              <p className="text-xs text-muted">{t.tryAsk}</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED[locale].map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => send(q)}
                    className="ask-chip"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex flex-col gap-1 ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
              <span className="text-xs text-muted">{m.role === 'user' ? t.you : t.shuru}</span>
              <div
                className={`rounded-stock p-3 text-sm ${m.role === 'user' ? 'ml-8 ask-bubble-user' : 'mr-8 ask-bubble-assistant'}`}
              >
                <p className="whitespace-pre-wrap">{linkify(m.text)}</p>
                {m.role === 'assistant' && (
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => copyAnswer(i, m.text)}
                      className="link text-xs"
                    >
                      {copied === i ? t.copied : t.copy}
                    </button>
                    {retryQ && i === messages.length - 1 && (
                      <button type="button" onClick={() => send(retryQ)} className="link text-xs">
                        {t.retry}
                      </button>
                    )}
                  </div>
                )}
                {m.sources && m.sources.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-muted">{t.sources}:</p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {m.sources.map((s, j) => (
                        <a
                          key={j}
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ask-source-chip"
                        >
                          {s.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-start gap-2">
              <span className="text-xs text-muted">{t.shuru}</span>
              <div className="ask-typing" aria-label={t.thinking}>
                <span /><span /><span />
              </div>
            </div>
          )}
        </div>
        <form
          className="flex gap-2 border-t border-border px-6 py-5"
          onSubmit={(e) => {
            e.preventDefault()
            send()
          }}
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => { setInput(e.target.value); autoGrow() }}
            onKeyDown={onKeyDown}
            placeholder={t.placeholder}
            rows={1}
            className="flex-1 resize-none rounded-input border border-border bg-bg px-4 py-2 text-sm text-ink"
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
        <p className="px-6 pb-5 text-xs text-muted">{t.footer}</p>
      </dialog>
    </>
  )
}