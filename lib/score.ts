// Shared scoring primitives for the three assessments.
//
// This is NOT the v2 engine described in docs/assessment-scoring-v2.md. It is
// the smallest thing that removes the trust leak: one place that turns a list
// of scored categories into the number on the page, so a page can no longer
// show a total that disagrees with the rows above it.
//
// Each assessment still owns its own category list and point values. v2
// replaces that with configuration, typed answer maps, invariant tests and
// behaviour-only scoring. This just stops the bleeding first.

export interface ScoredCategory {
  practice: string
  score: number
  maxScore: number
  status: "excellent" | "good" | "needs-work"
}

export type Tier = "low" | "medium" | "high"

const rate = (score: number): ScoredCategory["status"] =>
  score >= 8 ? "excellent" : score >= 5 ? "good" : "needs-work"

/** One category, always out of ten. */
export const cat = (practice: string, score: number): ScoredCategory => ({
  practice,
  score,
  maxScore: 10,
  status: rate(score),
})

export interface Summary {
  /** The rows she sees. */
  categories: ScoredCategory[]
  /** Sum of those rows, and their maximum. */
  earned: number
  max: number
  /** What the hero shows — a proportion, never a total. */
  percent: number
  tier: Tier
}

/**
 * Tier comes from the percentage, which does two things.
 *
 * The tier and the number she reads can never disagree, and the top tier
 * becomes reachable at all. Under v1 every stage required a score above 70
 * against a maximum of 60 or 70, so no woman has ever seen the top tier on any
 * of the three assessments.
 *
 * These boundaries are interim and deliberately round. They are configuration:
 * retune them once there is a real distribution, without touching this file.
 */
export const tierFromPercent = (percent: number): Tier =>
  percent < 40 ? "low" : percent < 75 ? "medium" : "high"

export function summarise(categories: ScoredCategory[]): Summary {
  const earned = categories.reduce((sum, c) => sum + c.score, 0)
  const max = categories.reduce((sum, c) => sum + c.maxScore, 0)
  const percent = max === 0 ? 0 : Math.round((earned / max) * 100)
  return { categories, earned, max, percent, tier: tierFromPercent(percent) }
}

/**
 * Compact wire format for the signup handoff: "Nutrition:6|Recovery:4".
 *
 * The funnel and the app are two different Supabase projects, so her scores
 * cannot be read across the gap — they have to travel in the URL. Labels rather
 * than keys because the receiving end drops them straight into the coach's
 * prompt, where "Pelvic Floor: 3/10" is what we want it to read.
 */
export const encodeCategories = (categories: ScoredCategory[]): string =>
  categories.map((c) => `${c.practice}:${c.score}`).join("|")
