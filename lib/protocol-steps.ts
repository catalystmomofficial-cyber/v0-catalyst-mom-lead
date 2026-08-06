// The "your plan is X% built" card on every results page.
//
// It used to be hard-coded: the same two steps were marked done for every
// woman regardless of what she answered. So a woman who had just told us she
// does not know what is safe in pregnancy was shown "Safe Exercise
// Modifications ✓". That is the first interactive thing on the page, and once
// it is caught being untrue, everything below it — including the price — gets
// discounted. This derives it from her actual answers instead.

export interface ScoredPractice {
  practice: string
  score: number
}

export interface StepPlan {
  /** Branded step name shown to her. */
  label: string
  /** Which assessed practice decides whether she already has this. */
  from: string
}

export interface ProtocolStep {
  label: string
  done: boolean
}

/** A practice she is genuinely already doing well. */
const STRONG = 8

/**
 * How many steps stay locked no matter how well she scored. Even a top-tier
 * scorer does not have the programme itself, and a card that reads "100% built"
 * removes the only reason to keep reading.
 */
const ALWAYS_LOCKED = 2

/**
 * Builds the step list from her real breakdown.
 *
 * The first step is always complete and always true — she just finished the
 * assessment, so her baseline genuinely is mapped. That is what stops a
 * low-scoring mom from being greeted with "your plan is 0% built", without
 * having to credit her for anything she is not actually doing.
 */
export function buildProtocolSteps(
  breakdown: ScoredPractice[],
  plan: StepPlan[],
  baselineLabel: string,
): ProtocolStep[] {
  const scoreOf = (practice: string) =>
    breakdown.find((b) => b.practice === practice)?.score ?? 0

  // Her weakest areas stay locked even if she scored well across the board —
  // they are the ones the plan exists to work on.
  const lockedByRank = new Set(
    [...plan]
      .sort((a, b) => scoreOf(a.from) - scoreOf(b.from))
      .slice(0, ALWAYS_LOCKED)
      .map((s) => s.label),
  )

  return [
    { label: baselineLabel, done: true },
    ...plan.map((s) => ({
      label: s.label,
      done: scoreOf(s.from) >= STRONG && !lockedByRank.has(s.label),
    })),
  ]
}
