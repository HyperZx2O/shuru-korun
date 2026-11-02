import { TRADE_LICENSE_STEPS } from '../rules/trade-license'
import { DBID_STEPS } from '../rules/dbid'
import { SOURCES } from '../rules/sources'
import type { Step } from '../rules/types'

const ALL_STEPS = [...TRADE_LICENSE_STEPS, ...DBID_STEPS]

export type Retrieved = {
  steps: Step[]
  sourceIds: string[]
}

function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter((t) => t.length > 1)
}

// Spec section 6.4 "must not state as fact" — always included as a grounding block.
export const MUST_NOT_STATE = [
  'Specific fee amounts for any trade licence category.',
  'Signboard fee as a percentage of the license fee.',
  'Whether a home-based online seller needs a trade licence.',
  'That a tax return must be filed before a trade licence is issued.',
  'That a DBID is issued by RJSC.',
  'That banks or payment gateways require a trade licence.',
]

export function buildCorpus(): { id: string; text: string; step: Step }[] {
  return ALL_STEPS.map((step) => ({
    id: step.id,
    step,
    text: [
      step.title.bn,
      step.title.en,
      step.summary.bn,
      step.summary.en,
      step.explanation.bn,
      step.explanation.en,
      ...step.documents.map((d) => `${d.label.bn} ${d.label.en}`),
    ].join(' '),
  }))
}

const CORPUS = buildCorpus()

export function retrieve(question: string, stepId?: string, topK = 6): Retrieved {
  const qTokens = new Set(tokenize(question))
  const scored = CORPUS.map((entry) => {
    const docTokens = tokenize(entry.text)
    let score = 0
    for (const t of docTokens) if (qTokens.has(t)) score += 1
    if (stepId && entry.id === stepId) score += 5
    return { entry, score }
  })
  scored.sort((a, b) => b.score - a.score)
  const chosen = scored
    .filter((s) => s.score > 0)
    .slice(0, topK)
    .map((s) => s.entry.step)

  // Fall back to the stepId step if nothing matched.
  if (chosen.length === 0 && stepId) {
    const s = ALL_STEPS.find((x) => x.id === stepId)
    if (s) chosen.push(s)
  }

  const sourceIds = Array.from(new Set(chosen.flatMap((s) => s.sources)))
  return { steps: chosen, sourceIds }
}

export function sourcesFor(ids: string[]) {
  return ids.map((id) => SOURCES[id]).filter(Boolean)
}