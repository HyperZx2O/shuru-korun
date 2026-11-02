export type GenInput = { system: string; context: string; question: string }

async function callGroq(input: GenInput): Promise<string> {
  const key = process.env.GROQ_API_KEY
  const model = process.env.GROQ_MODEL ?? 'llama-3.1-8b-instant'
  if (!key) throw new Error('no groq key')
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: `${input.system}\n\n${input.context}` },
        { role: 'user', content: input.question },
      ],
      temperature: 0.2,
      max_tokens: 300,
    }),
    signal: AbortSignal.timeout(8000),
  })
  if (!res.ok) throw new Error(`groq ${res.status}`)
  const data = await res.json()
  const text = data?.choices?.[0]?.message?.content
  if (!text) throw new Error('groq empty')
  return String(text).trim()
}

async function callGemini(input: GenInput): Promise<string> {
  const key = process.env.GEMINI_API_KEY
  const model = process.env.GEMINI_MODEL ?? 'gemini-2.0-flash'
  if (!key) throw new Error('no gemini key')
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: `${input.system}\n\n${input.context}` }] },
      contents: [{ role: 'user', parts: [{ text: input.question }] }],
      generationConfig: { temperature: 0.2, maxOutputTokens: 300 },
    }),
    signal: AbortSignal.timeout(8000),
  })
  if (!res.ok) throw new Error(`gemini ${res.status}`)
  const data = await res.json()
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error('gemini empty')
  return String(text).trim()
}

function mockAnswer(input: GenInput): string {
  const first = input.context.split('\n').find((l) => l.startsWith('STEP:')) ?? ''
  return [
    'I can only answer from the provided rules data.',
    first ? `Relevant: ${first.replace('STEP: ', '')}` : '',
    'Confirm details at your city corporation office or on the official portal.',
  ]
    .filter(Boolean)
    .join(' ')
}

export async function generate(input: GenInput): Promise<{ text: string; provider: string }> {
  if (process.env.MOCK_AI === '1' || (!process.env.GROQ_API_KEY && !process.env.GEMINI_API_KEY)) {
    return { text: mockAnswer(input), provider: 'mock' }
  }
  const chain: { name: string; fn: (i: GenInput) => Promise<string> }[] = []
  if (process.env.GROQ_API_KEY) chain.push({ name: 'groq', fn: callGroq })
  if (process.env.GEMINI_API_KEY) chain.push({ name: 'gemini', fn: callGemini })

  let lastErr: unknown
  for (const p of chain) {
    try {
      const text = await p.fn(input)
      return { text, provider: p.name }
    } catch (e) {
      lastErr = e
    }
  }
  // Final fallback: pre-written-style honest answer.
  return {
    text: 'I could not reach the live assistant right now. Please check the step explanation above, and confirm details at your city corporation office or on the official portal.',
    provider: 'fallback',
  }
  void lastErr
}