"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { QuizOptionList } from "@/components/quiz/quiz-option-list"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"
import { trackQuizEvents } from "@/lib/analytics"
import { addContactToOmnisend } from "@/lib/omnisend"
import { createClient } from "@/lib/supabase/client"
import { generateConcernReflection, type ConcernReflectionResult } from "@/lib/ai-reflection"
import { ConcernReflectionCard } from "@/components/concern-reflection"
import { ReflectionCta } from "@/components/results-cta"
import { WhatsWaiting } from "@/components/whats-waiting"
import { buildProtocolSteps } from "@/lib/protocol-steps"
import { cat, summarise, encodeCategories, type ScoredCategory, type Tier } from "@/lib/score"
import { GlowingEffect } from "@/components/ui/glowing-effect"
import { AnimatedScoreGauge } from "@/components/ui/animated-score-gauge"
import { StickyCta } from "@/components/sticky-cta"
const supabase = createClient()
// Note: Google Analytics (G-24S9C7GFLK) is injected via layout.tsx with cookie-consent gating.
// No inline GA code is needed in this file.

// ─── Types ────────────────────────────────────────────────────────────────────

interface QuizState {
  name: string
  email: string
  ttcDuration: string
  cycleTracking: string
  ovulationAwareness: string
  fertilityNutrition: string
  supplementation: string
  stress: string
  sleep: string
  exercise: string
  alcohol: string
  smoking: string
  workoutRoutine: string
  tracking: string
  primaryGoal: string
  biggestObstacle: string
  supportType: string
  dietaryRestrictions: string
  additionalNotes: string
}

interface BreakdownItem {
  practice: string
  score: number
  maxScore: number
  status: "excellent" | "good" | "needs-attention"
}

interface Testimonial {
  quote: string
  author: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)

// ─── Utility: Gap Explanations ────────────────────────────────────────────────
// Ethics-reviewed: empathetic, no direct risk attribution or fear-based claims.

// ─── Scoring — one function, one source of truth ─────────────────────────────
//
// There used to be two: `calculateScore` totalled five answers, and
// `getDetailedBreakdown` scored ten. Alcohol, nicotine, supplementation,
// movement balance and tracking were all asked, all displayed, and none of them
// moved the number. Every question she answers now counts, once.
//
// The TTC-duration points stay out of sight — how long she has been trying is
// not an achievement, and v2 removes them entirely.

const DURATION_POINTS = 10

export interface TtcScore {
  total: number
  categories: ScoredCategory[]
  earned: number
  max: number
  percent: number
  tier: Tier
}

export function scoreTtc(q: QuizState): TtcScore {
  const categories: ScoredCategory[] = [
    cat("Cycle Tracking", q.cycleTracking === "yes-app" ? 10 : q.cycleTracking === "sometimes" ? 6 : q.cycleTracking === "irregular" ? 3 : 0),
    cat("Ovulation Awareness", q.ovulationAwareness === "yes" ? 10 : q.ovulationAwareness === "roughly" ? 6 : q.ovulationAwareness === "irregular" ? 3 : 0),
    cat("Fertility Nutrition", q.fertilityNutrition === "yes" ? 10 : q.fertilityNutrition === "sometimes" ? 6 : q.fertilityNutrition === "trying" ? 3 : 0),
    cat("Supplementation", q.supplementation === "yes" ? 10 : q.supplementation === "some" ? 5 : q.supplementation === "unsure" ? 2 : 0),
    cat("Stress Management", q.stress === "low" ? 10 : q.stress === "moderate" ? 6 : q.stress === "high" ? 2 : 0),
    cat("Sleep Quality", q.sleep === "yes" ? 10 : q.sleep === "mostly" ? 7 : q.sleep === "no" ? 2 : 0),
    cat("Exercise Balance", q.exercise === "yes" ? 10 : q.exercise === "sometimes" ? 5 : q.exercise === "intense" ? 2 : 0),
    cat("Alcohol", q.alcohol === "none" ? 10 : q.alcohol === "occasional" ? 7 : q.alcohol === "regular" ? 3 : 0),
    cat("Smoking/Nicotine", q.smoking === "no" ? 10 : q.smoking === "occasional" ? 5 : 0),
    cat("Wellness Tracking", q.tracking === "yes" ? 10 : q.tracking === "some" ? 5 : 0),
  ]

  const summary = summarise(categories)
  return { ...summary, total: summary.earned + DURATION_POINTS }
}

// ─── Utility: Personalized Response ──────────────────────────────────────────
// Ethics-reviewed: empathetic tone, no direct fear-based medical claims.

// ─── Shared UI: Pricing CTA ───────────────────────────────────────────────────

// Single source of truth for the signup handoff URL — every CTA (offer,
// sticky bar, final ask) carries the same payload, including assessment_id
// so the app can personalize her dashboard and wellness coach.
function buildSignupUrl(quizState: QuizState, score: number, tier: string): string {
  const url = new URL("https://catalystmomofficial.com/signup")
  url.searchParams.set("name", quizState.name)
  url.searchParams.set("email", quizState.email)
  url.searchParams.set("score", score.toString())
  url.searchParams.set("tier", tier)
  url.searchParams.set("stage", "ttc")
  url.searchParams.set("primary_goal", quizState.primaryGoal)
  url.searchParams.set("biggest_obstacle", quizState.biggestObstacle)
  url.searchParams.set("birth_experience", "")
  const assessmentId = typeof window !== "undefined" ? sessionStorage.getItem("ttc_assessment_id") : null
  if (assessmentId) url.searchParams.set("assessment_id", assessmentId)
  // Her per-category scores, so the coach on the other side can open with the
  // specific thing rather than a generic hello. Two Supabase projects means
  // this cannot be looked up — it travels or it is lost.
  url.searchParams.set("categories", encodeCategories(scoreTtc(quizState).categories))
  const concern = quizState.additionalNotes?.trim()
  if (concern) url.searchParams.set("concern", concern.slice(0, 250))
  const reflectionText = typeof window !== "undefined" ? sessionStorage.getItem("ttc_concern_reflection") : null
  if (reflectionText) url.searchParams.set("reflection", reflectionText.slice(0, 700))
  return url.toString()
}

// ─── Obstacle crusher — answers the #1 obstacle she told us about ────────────
function ObstacleAnswer({ obstacle }: { obstacle: string }) {
  const answers: Record<string, { said: string; answer: string }> = {
    "dont-know": {
      said: "I do not know where to start",
      answer:
        "That's the app's whole job: your assessment just built your starting point. From day one you get one clear protocol — cycle tracking, nutrition, lifestyle — in order, one step at a time. No more guessing where to begin.",
    },
    irregular: {
      said: "Irregular cycles or a condition like PCOS",
      answer:
        "Then generic 'track day 14' advice was never going to work for you. Your protocol adapts to YOUR cycle data, and your 1:1 fertility coach helps you read what your body is actually doing — not what a textbook says it should do.",
    },
    stress: {
      said: "Stress and the emotional weight of trying",
      answer:
        "The emotional weight is real — and carrying it alone makes everything harder. Your protocol includes stress and nervous-system work, and your coach and community mean the 2am worry finally has somewhere to go.",
    },
    "no-support": {
      said: "No support or accountability",
      answer:
        "That ends today. A dedicated 1:1 coach who knows your history, biweekly check-ins, and a private community of women on the same road. You'll never be doing this alone again.",
    },
    overwhelmed: {
      said: "Overwhelmed by conflicting advice online",
      answer:
        "One plan, one coach, zero contradictions. Your protocol is built from your assessment — not from a hundred arguing forums — so you always know exactly what to do next and can finally ignore the noise.",
    },
  }

  const match = answers[obstacle]
  if (!match) return null

  return (
    <div className="mb-5 p-4 rounded-lg text-left" style={{ backgroundColor: "#FFF8E1", border: "1px solid #F0C089" }}>
      <p className="text-sm mb-2" style={{ color: "#8A7060" }}>
        You told us your biggest obstacle: <em>&ldquo;{match.said}&rdquo;</em>
      </p>
      <p className="text-base font-medium" style={{ color: "#3A2412" }}>
        {match.answer}
      </p>
    </div>
  )
}

// ─── Main Quiz Component ──────────────────────────────────────────────────────

export default function TTCAssessment() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [quizState, setQuizState] = useState<QuizState>({
    name: "", email: "", ttcDuration: "", cycleTracking: "", ovulationAwareness: "",
    fertilityNutrition: "", supplementation: "", stress: "", sleep: "", exercise: "",
    alcohol: "", smoking: "", workoutRoutine: "", tracking: "", primaryGoal: "",
    biggestObstacle: "", supportType: "", dietaryRestrictions: "", additionalNotes: "",
  })
  const [showResults, setShowResults] = useState(false)
  const [concernReflection, setConcernReflection] = useState<ConcernReflectionResult | null>(null)
  const [score, setScore] = useState(0)
  const [scoreTier, setScoreTier] = useState<"low" | "medium" | "high">("low")
  const [isLoading, setIsLoading] = useState(false)

  const questions = [
    {
      id: "ttc-duration", title: "How long have you been trying to conceive?",
      subtitle: "This helps us understand where you are in your journey",
      type: "radio", field: "ttcDuration",
      options: [
        { value: "less-3", label: "Less than 3 months" },
        { value: "3-6", label: "3 to 6 months" },
        { value: "6-12", label: "6 to 12 months" },
        { value: "1-2", label: "1 to 2 years" },
        { value: "2+", label: "2 years or more" },
      ],
    },
    {
      id: "cycle-tracking", title: "Are you tracking your menstrual cycle?",
      subtitle: "Understanding your cycle is foundational for conception",
      type: "radio", field: "cycleTracking",
      options: [
        { value: "yes-app", label: "Yes, using an app or method consistently" },
        { value: "sometimes", label: "Sometimes, but not consistently" },
        { value: "irregular", label: "My cycle is too irregular to track" },
        { value: "no", label: "No, I am not tracking it" },
      ],
    },
    {
      id: "ovulation", title: "Do you know when you ovulate?",
      subtitle: "Timing is one of the most critical factors for conception",
      type: "radio", field: "ovulationAwareness",
      options: [
        { value: "yes", label: "Yes, I track ovulation signs or use OPKs" },
        { value: "roughly", label: "Roughly, but not precisely" },
        { value: "irregular", label: "My cycle is too irregular to predict" },
        { value: "no", label: "No, I have no idea" },
      ],
    },
    {
      id: "fertility-nutrition", title: "How well are you nourishing your body for fertility?",
      subtitle: "Nutrition directly impacts egg quality and hormone balance",
      type: "radio", field: "fertilityNutrition",
      options: [
        { value: "yes", label: "Well — I focus on fertility-supporting foods" },
        { value: "sometimes", label: "Okay — I try but it is inconsistent" },
        { value: "trying", label: "I eat healthy but do not focus on fertility specifically" },
        { value: "no", label: "Poorly — I eat whatever is available" },
      ],
    },
    {
      id: "stress", title: "How would you describe your stress levels right now?",
      subtitle: "Chronic stress directly impacts reproductive hormones",
      type: "radio", field: "stress",
      options: [
        { value: "low", label: "Low — I manage stress well" },
        { value: "moderate", label: "Moderate — some stress but manageable" },
        { value: "high", label: "High — I am constantly stressed" },
        { value: "very-high", label: "Very high — the TTC journey is consuming me" },
      ],
    },
    {
      id: "sleep", title: "Are you getting 7 to 9 hours of quality sleep most nights?",
      subtitle: "Sleep is when your body produces reproductive hormones",
      type: "radio", field: "sleep",
      options: [
        { value: "yes", label: "Yes, 7 to 9 hours most nights" },
        { value: "mostly", label: "Mostly, but some nights less" },
        { value: "no", label: "No, I average 5 to 6 hours" },
        { value: "poor", label: "Less than 5 hours most nights" },
      ],
    },
    {
      id: "name", title: "Almost there! What is your first name?",
      subtitle: "So we can personalize your fertility score",
      type: "text", field: "name", placeholder: "Enter your first name",
    },
    {
      id: "email", title: "Where should we send your personalized results?",
      subtitle: "We will email your full fertility assessment breakdown",
      type: "email", field: "email", placeholder: "your@email.com",
    },
    {
      id: "primary-goal", title: "What is your primary goal right now?",
      subtitle: "This helps us personalize your roadmap",
      type: "radio", field: "primaryGoal",
      options: [
        { value: "conceive", label: "Get pregnant as soon as possible" },
        { value: "optimize", label: "Optimize my overall fertility health" },
        { value: "understand", label: "Understand my cycle and ovulation better" },
        { value: "prepare", label: "Prepare my body before trying" },
        { value: "support", label: "Get support through the emotional toll of TTC" },
      ],
    },
    {
      id: "biggest-obstacle", title: "What is the biggest thing stopping you right now?",
      subtitle: "Knowing this helps us support you better",
      type: "radio", field: "biggestObstacle",
      options: [
        { value: "dont-know", label: "I do not know where to start" },
        { value: "irregular", label: "Irregular cycles or a condition like PCOS" },
        { value: "stress", label: "Stress and the emotional weight of trying" },
        { value: "no-support", label: "No support or accountability" },
        { value: "overwhelmed", label: "Overwhelmed by conflicting advice online" },
      ],
    },
    {
      id: "additional-notes", title: "Anything else we should know?",
      subtitle: "Share any conditions, concerns, or context that might help",
      type: "textarea", field: "additionalNotes",
      placeholder: "E.g., PCOS, endometriosis, irregular cycles, partner concerns...",
    },
  ]

  // Both the stored score and everything on the page come from one call.
  const scored = scoreTtc(quizState)
  const calculateScore = () => scored.total
  const getTier = (): Tier => scored.tier

  const handleNext = async () => {
    trackQuizEvents.questionAnswered(currentQuestion + 1)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      return
    }

    setIsLoading(true)
    try {
      const calculatedScore = calculateScore()
      const tier = getTier()
      setScore(calculatedScore)
      setScoreTier(tier)
      trackQuizEvents.quizCompleted(calculatedScore, tier)

      const reflection = await generateConcernReflection({
        concern: quizState.additionalNotes,
        stage: "ttc",
        primaryGoal: quizState.primaryGoal,
        biggestObstacle: quizState.biggestObstacle,
        profile: {
          ttc_duration: quizState.ttcDuration,
          cycle_tracking: quizState.cycleTracking,
          ovulation_awareness: quizState.ovulationAwareness,
          fertility_nutrition: quizState.fertilityNutrition,
          stress: quizState.stress,
          sleep: quizState.sleep,
          support: quizState.supportType,
        },
      }).catch(() => null)
      setConcernReflection(reflection)
      // Hand the reflection to the signup URL builder without needing any
      // funnel-side database column — same transport as assessment_id.
      if (reflection && !reflection.crisis && reflection.reflection) {
        sessionStorage.setItem("ttc_concern_reflection", reflection.reflection)
      }

      const customProperties = {
        assessment_type: "TTC",
        score: calculatedScore,
        score_tier: tier,
        ttc_duration: quizState.ttcDuration,
        primary_goal: quizState.primaryGoal,
        biggest_obstacle: quizState.biggestObstacle,
        cycle_tracking: quizState.cycleTracking,
        ovulation_awareness: quizState.ovulationAwareness,
        fertility_nutrition: quizState.fertilityNutrition,
        supplementation: quizState.supplementation,
        stress: quizState.stress,
        sleep: quizState.sleep,
        alcohol: quizState.alcohol,
        smoking: quizState.smoking,
        support_type: quizState.supportType,
        concern: quizState.additionalNotes,
        concern_reflection: reflection && !reflection.crisis ? reflection.reflection : undefined,
      }

      try {
        await addContactToOmnisend({
          email: quizState.email,
          firstName: quizState.name,
          tags: ["ttc-assessment", `score-${tier}`],
          customProperties,
        })
      } catch (omnisendError) {
        console.error("[omnisend] first call error:", omnisendError)
      }

      // ── Lead Capture: ttc_assessments table ────────────────────────────────
      const { data, error: supabaseError } = await supabase
        .from("ttc_assessments")
        .insert({
          name: quizState.name,
          email: quizState.email,
          ttc_duration: quizState.ttcDuration || null,
          workout_routine: quizState.workoutRoutine || null,
          tracking: quizState.tracking || null,
          primary_goal: quizState.primaryGoal || null,
          biggest_obstacle: quizState.biggestObstacle || null,
          support_type: quizState.supportType || null,
          dietary_restrictions: quizState.dietaryRestrictions || null,
          additional_notes: quizState.additionalNotes || null,
          score: calculatedScore,
        })
        .select()

      if (supabaseError) console.error("[supabase] insert error:", supabaseError)

      if (data?.[0]) {
        sessionStorage.setItem("ttc_assessment_id", data[0].id)
        const resultsUrl = `https://catalystmomofficial.com/dashboard?assessment_id=${data[0].id}`
        try {
          await addContactToOmnisend({
            email: quizState.email,
            firstName: quizState.name,
            tags: ["ttc-assessment", `score-${tier}`],
            customProperties: { ...customProperties, results_url: resultsUrl },
          })
        } catch (omnisendError) {
          console.error("[omnisend] second call error:", omnisendError)
        }
      }

      setShowResults(true)
    } catch (error) {
      console.error("[v0] Error submitting quiz:", error)
      setShowResults(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePrevious = () => { if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1) }
  const handleInputChange = (field: keyof QuizState, value: string) =>
    setQuizState((prev) => ({ ...prev, [field]: value }))

  const isCurrentQuestionValid = () => {
    const q = questions[currentQuestion]
    const val = quizState[q.field as keyof QuizState]
    if (q.type === "email") return val.trim() !== "" && isValidEmail(val)
    if (q.type === "text") return val.trim() !== ""
    return val !== ""
  }

  if (showResults) {
    return <TTCResultsPage score={score} tier={scoreTier} quizState={quizState} concernReflection={concernReflection} />
  }

  const question = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="min-h-screen p-4" style={{ background: "linear-gradient(135deg, #F8F5F2, #F0E6D2)" }}>
      <div className="max-w-2xl mx-auto">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />Back
          </Button>
        </Link>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <img src="/catalyst-mom-logo.png" alt="Catalyst Mom" className="h-8 w-8" />
              <span className="font-bold" style={{ color: "#A15C2F" }}>Catalyst Mom - TTC</span>
            </div>
            <Badge style={{ backgroundColor: "#A15C2F", color: "white" }}>
              {currentQuestion + 1} of {questions.length}
            </Badge>
          </div>
          <div className="w-full h-2 rounded-full" style={{ backgroundColor: "#E8D5C4" }}>
            <div
              className="h-2 rounded-full transition-all duration-300"
              style={{ backgroundColor: "#A15C2F", width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question card */}
        <Card className="border-0 shadow-xl">
          <CardHeader className="rounded-t-lg p-6" style={{ backgroundColor: "#A15C2F" }}>
            <CardTitle className="text-2xl font-bold text-white mb-2">{question.title}</CardTitle>
            <p className="text-amber-50">{question.subtitle}</p>
          </CardHeader>

          <CardContent className="p-8">
            {question.type === "text" && (
              <input
                type="text"
                value={quizState[question.field as keyof QuizState]}
                onChange={(e) => handleInputChange(question.field as keyof QuizState, e.target.value)}
                placeholder={(question as any).placeholder}
                className="w-full p-4 border-2 border-amber-200 rounded-lg focus:border-amber-400 focus:outline-none text-lg"
              />
            )}
            {question.type === "email" && (
              <input
                type="email"
                value={quizState[question.field as keyof QuizState]}
                onChange={(e) => handleInputChange(question.field as keyof QuizState, e.target.value)}
                placeholder={(question as any).placeholder}
                className="w-full p-4 border-2 border-amber-200 rounded-lg focus:border-amber-400 focus:outline-none text-lg"
              />
            )}
            {question.type === "radio" && (
              <QuizOptionList
                name={question.field as string}
                value={quizState[question.field as keyof QuizState]}
                onChange={(value) => handleInputChange(question.field as keyof QuizState, value)}
                options={(question as any).options ?? []}
              />
            )}
            {question.type === "textarea" && (
              <Textarea
                value={quizState[question.field as keyof QuizState]}
                onChange={(e) => handleInputChange(question.field as keyof QuizState, e.target.value)}
                placeholder={(question as any).placeholder}
                rows={4}
                className="w-full p-4 border-2 border-amber-200 rounded-lg focus:border-amber-400 focus:outline-none text-base resize-none"
              />
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8 gap-4">
          <Button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            variant="outline"
            className="px-6 py-3 border-2 bg-transparent"
            style={{ borderColor: "#A15C2F", color: "#A15C2F" }}
          >
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={!isCurrentQuestionValid() || isLoading}
            className="px-8 py-3 text-white font-bold rounded-lg"
            style={{ background: "linear-gradient(135deg, #A15C2F, #C27B48)" }}
          >
            {isLoading ? "Calculating..." : currentQuestion === questions.length - 1 ? "Get My Results" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  )
}

// ─── Results Page ─────────────────────────────────────────────────────────────

function TTCResultsPage({
  score, tier, quizState, concernReflection,
}: {
  score: number
  tier: "low" | "medium" | "high"
  quizState: QuizState
  concernReflection: ConcernReflectionResult | null
}) {
  // Everything on this page reads from one call, so no number here can drift
  // away from any other. `percent` is what she sees; `score` is what we store.
  const scored = scoreTtc(quizState)
  const percent = scored.percent
  const breakdown = scored.categories
  const gaps = breakdown.filter((item: ScoredCategory) => item.score < 8).slice(0, 3)

  const getTierColor = () => percent < 40 ? "#E57373" : percent < 75 ? "#FFB74D" : "#81C784"
  const getTierLabel = () =>
    percent < 40 ? "Early Foundations Stage" : percent < 75 ? "Building Momentum Stage" : "Thriving & Ready Stage"
  const gauge =
    percent < 40 ? { from: "#EF9A9A", to: "#E53935", text: "#C62828" }
    : percent < 75 ? { from: "#FFCC80", to: "#FB8C00", text: "#E65100" }
    : { from: "#A5D6A7", to: "#43A047", text: "#2E7D32" }


  // Derived from what she actually answered — see lib/protocol-steps.ts for why
  // this must never go back to a hard-coded list.
  const ttcProtocolSteps = buildProtocolSteps(
    breakdown,
    [
      { label: "Cycle Tracking Setup", from: "Cycle Tracking" },
      { label: "Fertile Window Mapping", from: "Ovulation Awareness" },
      { label: "Fertility Nutrition Blueprint", from: "Fertility Nutrition" },
      { label: "Supplement Protocol", from: "Supplementation" },
      { label: "Stress & Sleep Reset", from: "Stress Management" },
      { label: "Movement & Recovery Balance", from: "Exercise Balance" },
    ],
    "Your fertility baseline — mapped",
  )
  const completedSteps = ttcProtocolSteps.filter((s) => s.done).length
  const totalSteps = ttcProtocolSteps.length
  const pctDone = Math.round((completedSteps / totalSteps) * 100)

  return (
    <div className="min-h-screen p-4" style={{ background: "linear-gradient(135deg, #F8F5F2, #F0E6D2)" }}>
      <div className="max-w-4xl mx-auto">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />Back to Home
          </Button>
        </Link>

        {/* Score Display */}
        <Card className="border-0 shadow-xl mb-6">
          <CardContent className="p-8 text-center">
            <div className="mb-4">
              <AnimatedScoreGauge
                value={percent}
                caption="%"
                fromColor={gauge.from}
                toColor={gauge.to}
                captionColor="#8A7060"
                size={260}
                className="mb-4"
              />
              <h1 className="text-3xl font-bold mb-2" style={{ color: "#3A2412" }}>
                Your TTC Fertility Score
              </h1>
              <Badge className="text-lg px-4 py-2" style={{ backgroundColor: getTierColor(), color: "white" }}>
                {getTierLabel()}
              </Badge>
            </div>
            <p className="text-lg" style={{ color: "#3A2412" }}>
              {tier === "high" &&
                `${percent}% of your fertility foundations are already in place. Here's what matters: readiness compounds. Every fundamental you refine now stacks in your favor, cycle after cycle.`}
              {tier === "medium" &&
                `${percent}% of your fertility foundations are in place — real momentum. And here's the good news: readiness compounds. Every gap you close now keeps paying you back, cycle after cycle.`}
              {tier === "low" &&
                `${percent}% — which means most of your levers are still unpulled. That's genuinely good news: fertility readiness compounds, and every fundamental you put in place from today stacks in your favor, cycle after cycle.`}
            </p>
          </CardContent>
        </Card>

        {/* Her own words, read back — moved directly under the score.
            This is the highest-conviction moment on the page and it used to sit
            two-thirds of the way down with nothing attached to it. She now
            reaches it while the score is still fresh, and it carries a door. */}
        {concernReflection && (
          <ConcernReflectionCard
            concern={quizState.additionalNotes}
            reflection={concernReflection.reflection}
            crisis={concernReflection.crisis}
            footer={
              <ReflectionCta
                href={buildSignupUrl(quizState, score, tier)}
                stage="ttc"
                firstName={quizState.name}
              />
            }
          />
        )}

        {/* Zeigarnik Hook + Above-fold CTA */}
        <Card className="border-0 shadow-xl mb-8 overflow-hidden" style={{ borderTop: `4px solid ${getTierColor()}` }}>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                style={{ backgroundColor: getTierColor() }}
              >
                {pctDone}%
              </div>
              <div>
                <p className="font-bold text-lg" style={{ color: "#3A2412" }}>
                  {pctDone}% of your fertility plan is unlocked.
                </p>
                <p className="text-sm" style={{ color: "#3A2412", opacity: 0.7 }}>
                  The locked steps are where the momentum is — cycle clarity, timing, the fundamentals that compound. Every cycle spent guessing is one that can't stack in your favor.
                </p>
              </div>
            </div>
            <div className="space-y-2 mb-5">
              {ttcProtocolSteps.map((step, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-lg"
                  style={{
                    backgroundColor: step.done ? "#F1F8F4" : "#F8F5F2",
                    filter: step.done ? "none" : "blur(3px)",
                    userSelect: step.done ? "auto" : "none",
                  }}
                >
                  {step.done ? (
                    <span className="text-green-600 text-xl flex-shrink-0">✓</span>
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 flex-shrink-0" style={{ borderColor: "#A15C2F" }} />
                  )}
                  <span className="font-medium" style={{ color: "#3A2412" }}>{step.label}</span>
                  {!step.done && (
                    <span className="ml-auto text-xs font-semibold px-2 py-0.5 rounded" style={{ backgroundColor: "#E8D5C4", color: "#A15C2F" }}>
                      LOCKED
                    </span>
                  )}
                </div>
              ))}
            </div>
            <p className="text-center text-sm font-semibold mb-4" style={{ color: "#A15C2F" }}>
              👇 Unlock the remaining {totalSteps - completedSteps} steps — personalised to your score &amp; goals
            </p>
          </CardContent>
        </Card>

        {/* Detailed Breakdown */}
        <Card className="border-0 shadow-xl mb-8">
          <CardHeader>
            <CardTitle className="text-2xl" style={{ color: "#A15C2F" }}>
              📋 Your Fertility Optimization Breakdown
            </CardTitle>
            <p className="text-sm" style={{ color: "#3A2412" }}>
              Here&apos;s exactly how you scored across the 10 essential TTC practices:
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {breakdown.map((item: ScoredCategory, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg"
                style={{
                  backgroundColor:
                    item.status === "excellent" ? "#F1F8F4" : item.status === "good" ? "#FFF8E1" : "#FFEBEE",
                }}
              >
                <div className="flex items-center gap-3 flex-1">
                  {item.status === "excellent" ? (
                    <span className="text-green-600 text-xl">✓</span>
                  ) : item.status === "good" ? (
                    <span className="text-orange-500 text-xl">!</span>
                  ) : (
                    <span className="text-red-500 text-xl">✗</span>
                  )}
                  <span className="font-medium" style={{ color: "#3A2412" }}>{item.practice}</span>
                </div>
                <span className="text-lg font-bold" style={{ color: "#A15C2F" }}>
                  {item.score}/{item.maxScore}
                </span>
              </div>
            ))}
            {/* No total line. It used to read "TOTAL SCORE: x/110" above rows
                that summed to something else, which is the single thing on this
                page that cost the most trust. Each row is explainable on its
                own; nothing here asks her to add them. */}
            <p className="pt-3 text-sm" style={{ color: "#8A7060" }}>
              Each area below is scored out of 10. Your overall percentage reflects how
              many of your fertility foundations are currently in place.
            </p>
          </CardContent>
        </Card>

        {/* If the reflection could not be generated, still show her that her
            own words were read. Nothing else — the pitch lives on the paywall. */}
        {!concernReflection && quizState.additionalNotes.trim() && (
          <Card className="border-0 shadow-xl mb-8" style={{ borderLeft: "6px solid #A15C2F" }}>
            <CardContent className="p-6">
              <p className="italic text-lg" style={{ color: "#666" }}>
                You shared: &ldquo;{quizState.additionalNotes}&rdquo;
              </p>
              <p className="mt-3 text-base" style={{ color: "#3A2412" }}>
                It&apos;s saved with your results, and it&apos;s the first thing your plan is built around.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Answers the question she is actually asking here — not "why is
            this worth the money" but "if I create an account, what happens
            next". No prices; the money conversation happens inside. */}
        <WhatsWaiting stage="ttc" />

        {/* One ask, after she has read everything. Every other button on the
            page was removed: two different labels for the same action made her
            stop and choose, which is a decision she should never have to make. */}
        <div className="text-center mt-8 mb-24 md:mb-8">
          <p className="text-sm mb-3" style={{ color: "#A15C2F" }}>
            Your account is free to create — the rest of your plan is already built and waiting in it.
          </p>
          <Button
            size="lg"
            onClick={() => { window.location.href = buildSignupUrl(quizState, score, tier) }}
            className="w-full md:w-auto text-white px-8 py-4 text-lg font-bold rounded-xl shadow-lg whitespace-normal leading-snug h-auto"
            style={{ background: "linear-gradient(135deg, #A15C2F, #C27B48)" }}
          >
            Continue to My Fertility Plan
          </Button>
          <p className="text-sm mt-3" style={{ color: "#8A7060" }}>
            Your personalised dashboard, AI coach and fertility plan will already be waiting for you.
          </p>
        </div>

        <StickyCta
          href={buildSignupUrl(quizState, score, tier)}
          label="Continue to My Fertility Plan"
        />
      </div>
    </div>
  )
}
