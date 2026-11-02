import { NextResponse } from 'next/server'
import { guard } from '@/lib/ai/guard'
import { retrieve, sourcesFor } from '@/lib/ai/retrieve'
import { buildSystemInstruction, buildContext } from '@/lib/ai/prompt'
import { generate } from '@/lib/ai/provider'
import { cacheGet, cacheSet, cacheKey } from '@/lib/ai/cache'
import { rateLimit } from '@/lib/ai/rate-limit'

export const runtime = 'nodejs'

type Body = {
  question?: string
  stepId?: string
  intakeCategories?: string[]
  locale?: string
}

export async function POST(req: Request) {
  let body: Body
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 })
  }

  const question = (body.question ?? '').trim().slice(0, 500)
  if (!question) {
    return NextResponse.json({ error: 'question required' }, { status: 400 })
  }

  const g = guard(question)
  if (!g.safe) {
    return NextResponse.json(
      {
        answer:
          'Please do not share personal details like NID numbers, phone numbers, emails, or OTPs. Shuru Korun never needs them. Ask your question without personal information.',
        sources: [],
        provider: 'guard',
      },
      { status: 200 },
    )
  }

  const locale = body.locale === 'en' || body.locale === 'bn' ? body.locale : 'bn'
  const perMinute = Number(process.env.RATE_LIMIT_PER_MINUTE ?? 12)
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'anon'
  const rl = rateLimit(`${ip}:${locale}`, perMinute)
  if (!rl.ok) {
    return NextResponse.json(
      { error: 'rate limited', message: 'Too many requests. Please wait a minute.' },
      { status: 429 },
    )
  }

  const key = cacheKey(question, body.stepId, locale)
  const cached = cacheGet(key)
  if (cached) {
    const r = retrieve(question, body.stepId)
    return NextResponse.json({ answer: cached, sources: sourcesFor(r.sourceIds), provider: 'cache', cached: true })
  }

  const retrieved = retrieve(question, body.stepId)
  const system = buildSystemInstruction(locale)
  const context = buildContext(retrieved.steps)

  const { text, provider } = await generate({ system, context, question })

  cacheSet(key, text)
  return NextResponse.json({
    answer: text,
    sources: sourcesFor(retrieved.sourceIds),
    provider,
    cached: false,
  })
}