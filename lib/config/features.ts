// Tier 3 feature flags. Cutting a feature = flip to false; nothing else changes.
export const FEATURES = {
  reminders: true,
  voiceInput: true,
  photoChecker: false, // cut: Bangla OCR not verified on target device (spec risk table)
} as const

export type FeatureKey = keyof typeof FEATURES