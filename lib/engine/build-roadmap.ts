import type { Intake, Step, Condition } from '../rules/types'
import { TRADE_LICENSE_STEPS } from '../rules/trade-license'
import { DBID_STEPS } from '../rules/dbid'

function clauseMatches(clause: Condition[], intake: Intake): boolean {
  return clause.every((cond) => {
    switch (cond.field) {
      case 'channels':
        return intake.channels.includes(cond.contains)
      case 'area':
        return intake.area === cond.equals
      case 'premises':
        return intake.premises === cond.equals
      case 'food':
        return intake.food === cond.equals
      case 'sells':
        return intake.sells === cond.equals
    }
  })
}

function stepApplies(step: Step, intake: Intake): boolean {
  // Empty appliesWhen = always applies (used for cross-cutting notes).
  if (step.appliesWhen.length === 0) return true
  return step.appliesWhen.some((clause) => clauseMatches(clause, intake))
}

export function needsTradeLicense(intake: Intake): boolean {
  return intake.channels.some((c) => c === 'shop' || c === 'home' || c === 'service')
}

export function needsDbid(intake: Intake): boolean {
  return intake.channels.includes('online')
}

export type Roadmap = {
  steps: Step[]
  notes: string[]
}

export function buildRoadmap(intake: Intake): Roadmap {
  const steps: Step[] = []

  if (needsTradeLicense(intake)) {
    for (const s of TRADE_LICENSE_STEPS) {
      if (stepApplies(s, intake)) steps.push(s)
    }
  }
  if (needsDbid(intake)) {
    for (const s of DBID_STEPS) {
      if (stepApplies(s, intake)) steps.push(s)
    }
  }

  // Stable ordering by path then order.
  steps.sort((a, b) => {
    if (a.path !== b.path) return a.path === 'trade-license' ? -1 : 1
    return a.order - b.order
  })

  const notes: string[] = []
  if (needsTradeLicense(intake) && needsDbid(intake)) {
    notes.push('confirm-trade-license')
  }
  return { steps, notes }
}