import { MUST_NOT_STATE } from './retrieve'
import type { Step } from '../rules/types'

export function buildSystemInstruction(locale: string): string {
  return [
    'You are Shuru Korun, a helpful guide for first-time business founders in Bangladesh.',
    'Answer ONLY from the rules data and step explanations provided below.',
    'If the answer is not in the provided data, say you do not know and tell the user to confirm at their city corporation office or on the official portal.',
    'Never invent fees, documents, deadlines, or offices.',
    'Always state the status (verified / dated source / confirm at office) and the last-checked date of any fact you give.',
    'Keep the reply under 150 words.',
    `Reply in the user's language: ${locale === 'bn' ? 'Bangla' : locale === 'en' ? 'English' : 'Banglish (Bangla written in Latin script)'}.`,
    'Do not provide legal advice. End with a short reminder to confirm at the office when relevant.',
  ].join(' ')
}

export function buildContext(steps: Step[]): string {
  const blocks = steps.map((s) => {
    return [
      `STEP: ${s.id} — ${s.title.en} / ${s.title.bn}`,
      `Status: ${s.status}. Last checked: ${s.lastChecked}.`,
      `Summary (en): ${s.summary.en}`,
      `Summary (bn): ${s.summary.bn}`,
      `Explanation (en): ${s.explanation.en}`,
      `Explanation (bn): ${s.explanation.bn}`,
      s.documents.length
        ? `Documents: ${s.documents.map((d) => `${d.label.en} [${d.status}]`).join('; ')}`
        : '',
      s.fee ? `Fee: ${s.fee.display.en} [${s.fee.status}]` : '',
      s.timeline ? `Timeline: ${s.timeline.display.en} [${s.timeline.status}]` : '',
      `Sources: ${s.sources.join(', ')}`,
    ]
      .filter(Boolean)
      .join('\n')
  })
  return [
    'RULES DATA:',
    blocks.join('\n---\n'),
    '',
    'YOU MUST NOT STATE AS FACT:',
    ...MUST_NOT_STATE.map((m) => `- ${m}`),
  ].join('\n')
}