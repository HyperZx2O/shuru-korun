// Privacy guard: refuse to forward personal identifiers to the AI.

const PATTERNS: { name: string; re: RegExp }[] = [
  { name: 'bd-mobile', re: /(?:\+?88)?01[3-9]\d{8}/ },
  { name: 'nid-17', re: /\b\d{17}\b/ },
  { name: 'nid-13', re: /\b\d{13}\b/ },
  { name: 'email', re: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/ },
  { name: 'otp', re: /\botp\b/i },
  { name: 'pin', re: /\bpin\b/i },
]

export type GuardResult = { safe: boolean; reason?: string }

export function guard(text: string): GuardResult {
  for (const p of PATTERNS) {
    if (p.re.test(text)) {
      return { safe: false, reason: p.name }
    }
  }
  return { safe: true }
}