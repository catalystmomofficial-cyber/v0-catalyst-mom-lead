"use client"
import Link from "next/link"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { QuizOptionList } from "@/components/quiz/quiz-option-list"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Heart, CheckCircle2, AlertCircle } from "lucide-react"
import { trackQuizEvents } from "@/lib/analytics"
import { addContactToOmnisend } from "@/lib/omnisend"
import { createClient } from "@/lib/supabase/client"
import { generateConcernReflection, type ConcernReflectionResult } from "@/lib/ai-reflection"
import { ConcernReflectionCard } from "@/components/concern-reflection"
import { ReflectionCta } from "@/components/results-cta"
import { WhatsWaiting } from "@/components/whats-waiting"
import { buildProtocolSteps } from "@/lib/protocol-steps"
import { cat, summarise, type ScoredCategory, type Tier } from "@/lib/score"
import { GlowingEffect } from "@/components/ui/glowing-effect"
import { AnimatedScoreGauge } from "@/components/ui/animated-score-gauge"
import { StickyCta } from "@/components/sticky-cta"
const supabase = createClient()

// Single source of truth for the signup handoff URL, so every CTA on this
// page (offer button, sticky bar, final ask) carries the same payload —
// including the assessment_id link that personalizes her app experience.
function buildSignupUrl(quizState: QuizState, score: number, tier: string): string {
  const url = new URL("https://catalystmomofficial.com/signup")
  url.searchParams.set("name", quizState.name)
  url.searchParams.set("email", quizState.email)
  url.searchParams.set("score", score.toString())
  url.searchParams.set("tier", tier)
  url.searchParams.set("stage", quizState.weeksPostpartum)
  url.searchParams.set("primary_goal", quizState.primaryGoal)
  url.searchParams.set("biggest_obstacle", quizState.biggestObstacle)
  url.searchParams.set("birth_experience", quizState.birthExperience || "")
  const assessmentId = typeof window !== "undefined" ? sessionStorage.getItem("postpartum_assessment_id") : null
  if (assessmentId) url.searchParams.set("assessment_id", assessmentId)
  const concern = quizState.additionalNotes?.trim()
  if (concern) url.searchParams.set("concern", concern.slice(0, 250))
  const reflectionText = typeof window !== "undefined" ? sessionStorage.getItem("postpartum_concern_reflection") : null
  if (reflectionText) url.searchParams.set("reflection", reflectionText.slice(0, 700))
  return url.toString()
}
interface QuizState {
  name: string
  email: string
  weeksPostpartum: string
  medicalClearance: string
  diastasisRecti: string
  coreSafeExercises: string
  pelvicFloor: string
  nutrition: string
  proteinIntake: string
  rest: string
  hydration: string
  workoutRoutine: string
  tracking: string
  primaryGoal: string
  biggestObstacle: string
  supportType: string
  dietaryRestrictions: string
  additionalNotes: string
  exercise?: string
  exerciseSafety?: string
  coreStrength?: string
  postpartumNutrition?: string
  supplementation?: string
  sleepQuality?: string
  stressManagement?: string
  bodyImage?: string
  partnerSupport?: string
  selfCare?: string
  birthExperience?: string
}

const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// ─── Shared Sub-components ───────────────────────────────────────────────────

// ─── Name Sanitizer ───────────────────────────────────────────────────────────
// Returns "Mama" if the name is blank, only consonants, or "none"
function sanitizeName(name: string): string {
  const trimmed = name.trim().toLowerCase()
  if (!trimmed || trimmed === "none") return "Mama"
  // Only consonants = no vowels at all
  if (!/[aeiou]/i.test(trimmed)) return "Mama"
  return name.trim()
}

// ─── DR Shorthand Detector ────────────────────────────────────────────────────
// ─── Goal + Tier Action Plan ──────────────────────────────────────────────────
// ─── Obstacle crusher — answers the #1 obstacle she told us about ────────────
function ObstacleAnswer({ obstacle }: { obstacle: string }) {
  const answers: Record<string, { said: string; answer: string }> = {
    "no-time": {
      said: "I have no time — the baby takes everything",
      answer:
        "That's exactly why the entire protocol is 15 minutes a day — less time than one feeding. No gym, no childcare, no setup. Most moms do it on the floor next to the baby.",
    },
    exhausted: {
      said: "I am too exhausted to start anything",
      answer:
        "Then step one isn't a workout. Your protocol starts with the energy leaks — breath, rest, and fuel — so the first thing you feel is more energy, not more demands. The movement comes after the energy does.",
    },
    "tried-failed": {
      said: "I have tried things before and nothing worked",
      answer:
        "Generic programs fail postpartum bodies because they aren't built from your starting point. This one is built from your score — the exact gaps you just saw — and your coach adjusts it with you every two weeks. That's the difference.",
    },
    "dont-know": {
      said: "I do not know what is safe for my body",
      answer:
        "That fear is protecting you — and it's exactly what the app removes. Every movement is postpartum-safe, sequenced for your stage, with the unsafe ones locked out until your body is ready. You never have to guess again.",
    },
    pain: {
      said: "I have pain or complications holding me back",
      answer:
        "Then you need the careful version, not the hard version. Your protocol starts gentle and zero-strain, works around what hurts, and your 1:1 coach adapts it to your specific situation — so you progress without setbacks.",
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

// ─── Utility functions ────────────────────────────────────────────────────────

// ─── Scoring — one function, one source of truth ─────────────────────────────
//
// There used to be two. `calculateScore` produced the headline number from the
// answers the quiz actually stores, and `getDetailedBreakdown` produced the
// per-category rows by comparing against answer values that no longer existed,
// so nearly every row fell through to zero. The page showed 34 above a column
// that added up to 5, and anyone who can add lost confidence in the whole page.
//
// The breakdown is now derived from the same expressions that produce the
// total. It is arithmetically impossible for them to disagree.
//
// Two things are deliberately NOT changed here — they are v2 decisions that
// shift the score distribution and need the threshold work behind them (see
// docs/assessment-scoring-v2.md):
//   • the free 10 points for timeline still exist internally
//   • medical clearance still costs points instead of acting as a gate

export interface PostpartumScore {
  /** What gets stored and reported. Unchanged from v1, including the free 10. */
  total: number
  categories: ScoredCategory[]
  earned: number
  max: number
  percent: number
  tier: Tier
}

/**
 * Timeline is scored internally (10, always) but never shown as a category.
 *
 * It is an implementation detail that v2 removes, and putting "Timeline 10" in
 * front of her would teach a scoring model we are about to retire — she would
 * reasonably ask why being six months postpartum earns points, and there is no
 * good answer. It stays out of `categories`, which is why the breakdown carries
 * no total line: the visible rows sum to `earned`, not to `total`.
 */
const TIMELINE_POINTS = 10

export function scorePostpartum(q: QuizState): PostpartumScore {
  const categories: ScoredCategory[] = [
    cat("Medical Clearance", q.medicalClearance === "yes" ? 10 : 0),

    cat(
      "Body Awareness",
      q.diastasisRecti === "diagnosed" ? 10
      : q.diastasisRecti === "no" ? 10
      : q.diastasisRecti === "think-so" ? 7
      : 3,
    ),

    cat(
      "Core & Pelvic Floor",
      q.coreSafeExercises === "okay" ? 10
      : q.coreSafeExercises === "weak" ? 5
      : q.coreSafeExercises === "pain" ? 4
      : q.coreSafeExercises === "leak" ? 3
      : q.coreSafeExercises === "all" ? 2
      : 0,
    ),

    cat(
      "Movement",
      q.workoutRoutine === "3-plus" ? 10
      : q.workoutRoutine === "1-2" ? 7
      : q.workoutRoutine === "occasional" ? 4
      : 0,
    ),

    cat(
      "Nutrition",
      q.nutrition === "well" ? 10
      : q.nutrition === "okay" ? 6
      : q.nutrition === "poorly" ? 2
      : 0,
    ),

    cat(
      "Recovery",
      q.rest === "good" ? 10
      : q.rest === "tired" ? 7
      : q.rest === "exhausted" ? 2
      : 0,
    ),
  ]

  const summary = summarise(categories)
  return { ...summary, total: summary.earned + TIMELINE_POINTS }
}

const getPersonalizedResponseWithGaps = (additionalNotes: string, breakdown: any[]) => {
  const notes = additionalNotes.toLowerCase()
  const lowScores = breakdown.filter((item) => item.score <= 5)

  if (
    notes.includes("no time") ||
    notes.includes("busy") ||
    notes.includes("lot of things") ||
    notes.includes("too much") ||
    notes.includes("overwhelmed")
  ) {
    return {
      concern: additionalNotes,
      title: `💬 You Also Mentioned: "${additionalNotes}"`,
      response: `We see you. You're drowning.`,
    }
  }

  if (
    notes.includes("stomach") ||
    notes.includes("belly") ||
    notes.includes("pooch") ||
    notes.includes("big") ||
    notes.includes("diastasis") ||
    notes.includes("abs") ||
    notes.includes("lol")
  ) {
    return {
      concern: additionalNotes,
      title: `💬 You Also Mentioned: "${additionalNotes}"`,
      response: `We hear you. Your belly still looks pregnant and it's frustrating.`,
    }
  }

  if (notes.includes("frustrat") || notes.includes("annoyed") || notes.includes("irritated")) {
    return {
      concern: additionalNotes,
      title: `💬 You Also Mentioned: "${additionalNotes}"`,
      response: `We hear you. Postpartum IS frustrating.`,
    }
  }

  if (
    notes.includes("exhaust") ||
    notes.includes("tired") ||
    notes.includes("no energy") ||
    notes.includes("fatigue") ||
    notes.includes("drained")
  ) {
    return {
      concern: additionalNotes,
      title: `💬 You Also Mentioned: "${additionalNotes}"`,
      response: `We see you. You're running on empty.`,
    }
  }

  if (
    notes.includes("leak") ||
    notes.includes("pee") ||
    notes.includes("incontinence") ||
    notes.includes("pelvic floor") ||
    notes.includes("sneeze")
  ) {
    return {
      concern: additionalNotes,
      title: `💬 You Also Mentioned: "${additionalNotes}"`,
      response: `We hear you. Leaking when you sneeze, laugh, or jump is embarrassing and frustrating.`,
    }
  }

  if (
    notes.includes("weight") ||
    notes.includes("lose") ||
    notes.includes("fat") ||
    notes.includes("body") ||
    notes.includes("look")
  ) {
    return {
      concern: additionalNotes,
      title: `💬 You Also Mentioned: "${additionalNotes}"`,
      response: `We hear you. You want to feel like yourself again.`,
    }
  }

  if (
    notes.includes("pain") ||
    notes.includes("hurt") ||
    notes.includes("back") ||
    notes.includes("sore") ||
    notes.includes("ache")
  ) {
    return {
      concern: additionalNotes,
      title: `💬 You Also Mentioned: "${additionalNotes}"`,
      response: `We hear you. Your body hurts.`,
    }
  }

  if (
    notes.includes("depress") ||
    notes.includes("anxi") ||
    notes.includes("mental") ||
    notes.includes("sad") ||
    notes.includes("cry")
  ) {
    return {
      concern: additionalNotes,
      title: `💬 You Also Mentioned: "${additionalNotes}"`,
      response: `We see you. Postpartum is hard - physically AND emotionally.`,
    }
  }

  const topGaps = lowScores.slice(0, 3)
  if (topGaps.length > 0) {
    return {
      concern: additionalNotes,
      title: `💬 You Also Mentioned: "${additionalNotes}"`,
      response: `We hear you. Your concern is valid and directly connected to the gaps we identified in your assessment.`,
    }
  }

  return {
    concern: additionalNotes,
    title: `💬 Thank You for Sharing`,
    response: `We appreciate you sharing your thoughts with us.`,
  }
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PostpartumAssessment() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [quizState, setQuizState] = useState<QuizState>({
    name: "",
    email: "",
    weeksPostpartum: "",
    medicalClearance: "",
    diastasisRecti: "",
    coreSafeExercises: "",
    pelvicFloor: "",
    nutrition: "",
    proteinIntake: "",
    rest: "",
    hydration: "",
    workoutRoutine: "",
    tracking: "",
    primaryGoal: "",
    biggestObstacle: "",
    supportType: "",
    dietaryRestrictions: "",
    additionalNotes: "",
    birthExperience: "",
  })
  const [showResults, setShowResults] = useState(false)
  const [concernReflection, setConcernReflection] = useState<ConcernReflectionResult | null>(null)
  const [score, setScore] = useState(0)
  const [scoreTier, setScoreTier] = useState<"low" | "medium" | "high">("low")
  const [isLoading, setIsLoading] = useState(false)
  const [tier, setTier] = useState<"low" | "medium" | "high">("low")

  const questions = [
    {
      id: "timeline",
      title: "How far along are you in your postpartum journey?",
      subtitle: "This helps us give you stage-appropriate recommendations",
      type: "radio",
      field: "weeksPostpartum",
      options: [
        { value: "0-6", label: "0–6 weeks (still in early healing)" },
        { value: "6-12", label: "6 weeks – 3 months" },
        { value: "3-6", label: "3–6 months" },
        { value: "6-12m", label: "6–12 months" },
        { value: "12+", label: "12 months or more" },
      ],
    },
    {
      id: "medical-clearance",
      title: "Have you been cleared by your doctor or midwife to begin exercise?",
      subtitle: "Safety first",
      type: "radio",
      field: "medicalClearance",
      options: [
        { value: "yes", label: "Yes, I have been cleared" },
        { value: "not-yet", label: "Not yet — I am still under 6 weeks" },
        { value: "never-told", label: "I was never told I needed clearance" },
      ],
    },
    {
      id: "diastasis-recti",
      title: "Do you have diastasis recti (abdominal separation)?",
      subtitle: "60% of postpartum women experience this",
      type: "radio",
      field: "diastasisRecti",
      options: [
        { value: "diagnosed", label: "Yes, diagnosed by a doctor or physio" },
        { value: "think-so", label: "I think so but have not been checked" },
        { value: "no", label: "No, I do not have this" },
        { value: "dont-know", label: "I am not sure what this is" },
      ],
    },
    {
      id: "core-pelvic-floor",
      title: "How would you describe your core and pelvic floor right now?",
      subtitle: "This helps us understand your recovery needs",
      type: "radio",
      field: "coreSafeExercises",
      options: [
        { value: "leak", label: "I leak when I sneeze, laugh, or jump" },
        { value: "weak", label: "My belly still looks pregnant and feels weak" },
        { value: "pain", label: "I have lower back pain or pelvic pressure" },
        { value: "all", label: "All of the above" },
        { value: "okay", label: "I feel mostly okay" },
      ],
    },
    {
      id: "movement",
      title: "How consistently are you moving your body right now?",
      subtitle: "Movement is medicine",
      type: "radio",
      field: "workoutRoutine",
      options: [
        { value: "3-plus", label: "3 or more times per week" },
        { value: "1-2", label: "Once or twice a week" },
        { value: "occasional", label: "Occasionally with no real routine" },
        { value: "not-started", label: "I have not started yet — not sure what is safe" },
      ],
    },
    {
      id: "fueling",
      title: "How well are you nourishing your postpartum body?",
      subtitle: "Recovery requires proper fuel",
      type: "radio",
      field: "nutrition",
      options: [
        { value: "well", label: "Well — I eat balanced meals with good protein" },
        { value: "okay", label: "Okay — I try but it is inconsistent" },
        { value: "poorly", label: "Poorly — I grab whatever is quick and easy" },
        { value: "no-idea", label: "I have no idea — I am just surviving" },
      ],
    },
    {
      id: "energy-rest",
      title: "How would you describe your energy and recovery right now?",
      subtitle: "Rest is where healing happens",
      type: "radio",
      field: "rest",
      options: [
        { value: "good", label: "Good — I rest when I can and feel okay" },
        { value: "tired", label: "Tired but managing" },
        { value: "exhausted", label: "Exhausted — running on empty every day" },
        { value: "depleted", label: "Completely depleted — I have nothing left" },
      ],
    },
    {
      id: "unlock-results",
      title: "Your Maternal Wellness Score is ready",
      subtitle: "Enter your details below to unlock your personalised recovery roadmap",
      type: "unlock",
      field: "name",
    },
    {
      id: "primary-goal",
      title: "What matters most to you right now?",
      subtitle: "This helps us personalize your roadmap",
      type: "radio",
      field: "primaryGoal",
      options: [
        { value: "heal-dr", label: "Heal my diastasis recti and close the gap" },
        { value: "pelvic-floor", label: "Stop leaking and strengthen my pelvic floor" },
        { value: "energy", label: "Get my energy back and feel like myself again" },
        { value: "weight-loss", label: "Lose the baby weight safely" },
        { value: "strength", label: "Build strength and feel confident in my body" },
      ],
    },
    {
      id: "biggest-barrier",
      title: "What is the main thing stopping you right now?",
      subtitle: "Knowing this helps us support you better",
      type: "radio",
      field: "biggestObstacle",
      options: [
        { value: "dont-know", label: "I do not know what is safe for my body" },
        { value: "no-time", label: "I have no time — the baby takes everything" },
        { value: "exhausted", label: "I am too exhausted to start anything" },
        { value: "tried-failed", label: "I have tried things before and nothing worked" },
        { value: "pain", label: "I have pain or complications holding me back" },
      ],
    },
    {
      id: "additional-notes",
      title: "Anything else we should know?",
      subtitle: "Share any concerns, limitations, or preferences",
      type: "textarea",
      field: "additionalNotes",
      placeholder: "E.g., C-section recovery, twins, back pain, specific time constraints...",
    },
  ]

  // Both the stored score and everything on the page come from one call.
  const scored = scorePostpartum(quizState)
  const calculateScore = () => scored.total
  const getTier = () => scored.tier

  const handleNext = async () => {
    trackQuizEvents.questionAnswered(currentQuestion + 1)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setIsLoading(true)
      try {
        const calculatedScore = calculateScore()
        const tier = getTier()

        setScore(calculatedScore)
        setScoreTier(tier)
        setTier(tier)

        trackQuizEvents.quizCompleted(calculatedScore, tier)

        const reflection = await generateConcernReflection({
          concern: quizState.additionalNotes,
          stage: "postpartum",
          primaryGoal: quizState.primaryGoal,
          biggestObstacle: quizState.biggestObstacle,
          profile: {
            weeks_postpartum: quizState.weeksPostpartum,
            medical_clearance: quizState.medicalClearance,
            diastasis_recti: quizState.diastasisRecti,
            core_pelvic_floor: quizState.coreSafeExercises,
            movement: quizState.workoutRoutine,
            energy_recovery: quizState.rest,
            birth_experience: quizState.birthExperience,
            support: quizState.supportType,
          },
        }).catch(() => null)
        setConcernReflection(reflection)
        // Hand the reflection to the signup URL builder without needing any
        // funnel-side database column — same transport as assessment_id.
        if (reflection && !reflection.crisis && reflection.reflection) {
          sessionStorage.setItem("postpartum_concern_reflection", reflection.reflection)
        }

        const customProperties = {
          assessment_type: "Postpartum",
          score: calculatedScore,
          score_tier: tier,
          weeks_postpartum: quizState.weeksPostpartum,
          medical_clearance: quizState.medicalClearance,
          diastasis_recti: quizState.diastasisRecti,
          core_pelvic_floor: quizState.coreSafeExercises,
          movement: quizState.workoutRoutine,
          nutrition: quizState.nutrition,
          energy_recovery: quizState.rest,
          primary_goal: quizState.primaryGoal,
          biggest_obstacle: quizState.biggestObstacle,
          support_type: quizState.supportType,
          birth_experience: quizState.birthExperience,
          concern_reflection: reflection && !reflection.crisis ? reflection.reflection : undefined,
          concern: quizState.additionalNotes,
          results_url: `https://catalystmomofficial.com/dashboard`,
        }

        try {
          await addContactToOmnisend({
            email: quizState.email,
            firstName: quizState.name,
            tags: ["postpartum-assessment", `score-${tier}`, `weeks-${quizState.weeksPostpartum}`],
            customProperties: customProperties,
          })
        } catch (omnisendError) {
          console.error("[omnisend] first call error:", omnisendError)
        }

        const { data: supabaseData, error: supabaseError } = await supabase
          .from("postpartum_assessments")
          .insert({
            user_name: quizState.name,
            email: quizState.email,
            primary_goal: quizState.primaryGoal,
            score: calculatedScore,
            tier,
            user_concern: quizState.additionalNotes || null,
          })
          .select()

        if (supabaseError) console.error("[supabase] insert error:", supabaseError)
        console.log("[v0] Supabase insert response:", supabaseData)

        if (supabaseData && supabaseData[0]) {
          sessionStorage.setItem("postpartum_assessment_id", supabaseData[0].id)
          customProperties.results_url = `https://catalystmomofficial.com/dashboard?assessment_id=${supabaseData[0].id}`
          try {
            await addContactToOmnisend({
              email: quizState.email,
              firstName: quizState.name,
              tags: ["postpartum-assessment", `score-${tier}`, `weeks-${quizState.weeksPostpartum}`],
              customProperties: customProperties,
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
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleInputChange = (field: keyof QuizState, value: string) => {
    setQuizState((prev) => ({ ...prev, [field]: value }))
  }

  const isCurrentQuestionValid = () => {
    const question = questions[currentQuestion]

    if (question.type === "unlock") {
      return quizState.name.trim() !== "" && quizState.email.trim() !== "" && isValidEmail(quizState.email)
    }

    const value = quizState[question.field as keyof QuizState]

    if (question.type === "text" || question.type === "email") {
      if (question.type === "email") {
        return value.trim() !== "" && isValidEmail(value)
      }
      return value.trim() !== ""
    }

    return value !== ""
  }

  const downloadGuide = async () => {
    try {
      const response = await fetch("/api/generate-guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stage: "postpartum",
          name: quizState.name,
          email: quizState.email,
          score,
          tier,
        }),
      })

      const data = await response.json()

      if (data.success) {
        const guideWindow = window.open("", "_blank")
        if (guideWindow) {
          guideWindow.document.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>${data.guideContent.title}</title>
                <style>
                  * { margin: 0; padding: 0; box-sizing: border-box; }
                  body { font-family: 'Georgia', serif; background: linear-gradient(135deg, #F8F5F2, #F0E6D2); padding: 40px; color: #3A2412; }
                  .cover { text-align: center; padding: 60px 20px; background: white; border-radius: 12px; margin-bottom: 40px; box-shadow: 0 4px 20px rgba(161, 92, 47, 0.1); }
                  .cover img { width: 150px; height: 150px; border-radius: 50%; margin-bottom: 20px; }
                  .cover h1 { font-size: 36px; color: #A15C2F; margin-bottom: 10px; }
                  .cover p { font-size: 18px; color: #6B4423; }
                  .section { background: white; padding: 30px; margin-bottom: 20px; border-radius: 12px; box-shadow: 0 4px 20px rgba(161, 92, 47, 0.1); }
                  .section h2 { font-size: 24px; color: #A15C2F; margin-bottom: 15px; border-bottom: 3px solid #A15C2F; padding-bottom: 10px; }
                  .section ul { list-style: none; padding: 0; }
                  .section li { padding: 10px 0; border-bottom: 1px solid #E8D5C4; color: #3A2412; line-height: 1.6; }
                  .cta { text-align: center; padding: 40px 20px; background: linear-gradient(135deg, #A15C2F, #C27B48); color: white; border-radius: 12px; margin-top: 40px; }
                  .cta h2 { font-size: 28px; margin-bottom: 15px; }
                  .cta p { font-size: 16px; margin-bottom: 20px; }
                  .cta button { background: white; color: #A15C2F; border: none; padding: 15px 40px; font-size: 18px; font-weight: bold; border-radius: 8px; cursor: pointer; }
                  @media print { body { background: white; } .cta button { display: none; } }
                </style>
              </head>
              <body>
                <div class="cover">
                  <img src="/images/img-5912.jpeg" alt="Catalyst Mom Wellness" />
                  <h1>${data.guideContent.title}</h1>
                  <p>${data.guideContent.subtitle}</p>
                  <p>Personalized for ${quizState.name}</p>
                </div>
                ${data.guideContent.sections
                  .map(
                    (section: any) => `
                  <div class="section">
                    <h2>${section.title}</h2>
                    <ul>${section.content.map((item: string) => `<li>${item}</li>`).join("")}</ul>
                  </div>`,
                  )
                  .join("")}
                <div class="cta">
                  <h2>Ready to Transform Your Wellness Journey?</h2>
                  <p>This free guide is just the beginning. Get personalized coaching, community support, and expert-designed programs.</p>
                  <button onclick="window.location.href='https://catalystmomofficial.com/dashboard'">Join Catalyst Mom Today</button>
                </div>
                <script>setTimeout(() => window.print(), 500);</script>
              </body>
            </html>
          `)
          guideWindow.document.close()
        }
      }
    } catch (error) {
      console.error("[v0] Error downloading guide:", error)
    }
  }

  // ── Early-healing branch ──────────────────────────────────────────────────
  if (quizState.weeksPostpartum === "0-6" && showResults) {
    return (
      <div className="min-h-screen p-4" style={{ background: "linear-gradient(135deg, #F8F5F2, #F0E6D2)" }}>
        <div className="max-w-2xl mx-auto">
          <Link href="/">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>

          <Card className="border-0 shadow-xl">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-3xl font-bold" style={{ color: "#A15C2F" }}>
                You&apos;re in Early Healing Mode
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="text-center">
                <p className="text-xl mb-4" style={{ color: "#3A2412" }}>
                  First - congratulations on your baby! Your body just did something INCREDIBLE.
                </p>
                <p className="text-lg leading-relaxed" style={{ color: "#3A2412" }}>
                  Right now (0-6 weeks postpartum), you&apos;re in the critical healing phase. This isn&apos;t the time
                  for workout programs or weight loss efforts. Your job is to rest, heal, and bond with baby.
                </p>
              </div>

              <div className="bg-amber-50 p-6 rounded-lg border-l-4" style={{ borderLeftColor: "#A15C2F" }}>
                <h3 className="font-bold text-lg mb-3" style={{ color: "#A15C2F" }}>
                  Focus on These 4 Things:
                </h3>
                <ul className="space-y-2" style={{ color: "#3A2412" }}>
                  <li>✅ REST and let your body heal (seriously - rest!)</li>
                  <li>✅ Focus on gentle movement (short walks only)</li>
                  <li>✅ Eat nourishing foods (don&apos;t diet - NOURISH)</li>
                  <li>✅ Bond with baby (this is your main &apos;work&apos;)</li>
                </ul>
              </div>

              <div className="bg-red-50 p-6 rounded-lg border-l-4 border-red-400">
                <h3 className="font-bold text-lg mb-3" style={{ color: "#A15C2F" }}>
                  Why This Matters:
                </h3>
                <ul className="space-y-2" style={{ color: "#3A2412" }}>
                  <li>Your uterus is shrinking back to normal size</li>
                  <li>Your pelvic floor is healing</li>
                  <li>Hormones are regulating (if breastfeeding, this takes longer)</li>
                  <li>Your body needs energy for milk production (if nursing)</li>
                </ul>
              </div>

              <div className="text-center">
                <p className="text-lg font-semibold mb-4" style={{ color: "#A15C2F" }}>
                  You&apos;re Not Behind. You&apos;re Not Lazy. You&apos;re HEALING.
                </p>
                <Button
                  size="lg"
                  onClick={downloadGuide}
                  className="text-white px-8 py-4 text-lg font-bold rounded-xl"
                  style={{ background: "linear-gradient(135deg, #A15C2F, #C27B48)" }}
                >
                  Download Healing Guide
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (showResults) {
    return <ResultsPage score={score} tier={tier} quizState={quizState} concernReflection={concernReflection} />
  }

  // ── Quiz UI ───────────────────────────────────────────────────────────────
  const question = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="min-h-screen p-4" style={{ background: "linear-gradient(135deg, #F8F5F2, #F0E6D2)" }}>
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="col-span-1 md:col-span-2">
          <Link href="/">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div>
                  <img src="/catalyst-mom-logo.png" alt="Catalyst Mom" className="h-8 w-8" />
                </div>
                <span className="font-bold" style={{ color: "#A15C2F" }}>
                  Catalyst Mom
                </span>
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
        </div>

        {/* Question Card */}
        <Card className="col-span-1 md:col-span-1 border-0 shadow-xl">
          <CardHeader className="rounded-t-lg p-6" style={{ backgroundColor: "#A15C2F" }}>
            <CardTitle className="text-2xl font-bold text-white mb-2">{question.title}</CardTitle>
            <p className="text-amber-50">{question.subtitle}</p>
          </CardHeader>

          <CardContent className="p-8">
            {question.type === "unlock" && (
              <div className="space-y-5">
                <div className="text-center p-4 rounded-lg mb-2" style={{ backgroundColor: "#FFF8E1" }}>
                  <p className="text-base leading-relaxed" style={{ color: "#3A2412" }}>
                    Your personalised recovery roadmap is waiting. Enter your details below and we will send it straight
                    to your inbox.
                  </p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: "#3A2412" }}>
                      First Name
                    </label>
                    <input
                      type="text"
                      value={quizState.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Enter your first name"
                      className="w-full p-4 border-2 border-amber-200 rounded-lg focus:border-amber-400 focus:outline-none text-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: "#3A2412" }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={quizState.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="your@email.com"
                      className="w-full p-4 border-2 border-amber-200 rounded-lg focus:border-amber-400 focus:outline-none text-lg"
                    />
                  </div>
                </div>
              </div>
            )}

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
        <div className="col-span-1 md:col-span-2 flex justify-between items-center mt-8 gap-4">
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

function ResultsPage({
  score,
  tier,
  quizState,
  concernReflection,
}: {
  score: number
  tier: "low" | "medium" | "high"
  quizState: QuizState
  concernReflection: ConcernReflectionResult | null
}) {
  const displayName = sanitizeName(quizState.name)

  // Everything on this page reads from one call, so no number here can drift
  // away from any other. `percent` is what she sees; `score` is what we store.
  const scored = scorePostpartum(quizState)
  const percent = scored.percent
  const breakdown = scored.categories

  const getTierColor = () => {
    if (percent < 40) return "#E57373"
    if (percent < 75) return "#FFB74D"
    return "#81C784"
  }

  // Tier-aware gauge colors — the arc color must still tell the truth
  // (green = thriving, amber = building, warm red = foundations to build).
  const getTierGauge = () => {
    if (percent < 40) return { from: "#EF9A9A", to: "#E53935", text: "#C62828" }
    if (percent < 75) return { from: "#FFCC80", to: "#FB8C00", text: "#E65100" }
    return { from: "#A5D6A7", to: "#43A047", text: "#2E7D32" }
  }
  const gauge = getTierGauge()

  const getTierLabel = () => {
    if (percent < 40) return `${displayName}, you're in the Early Foundations Stage`
    if (percent < 75) return `${displayName}, you're in the Building Momentum Stage`
    return `${displayName}, you're in the Thriving & Ready Stage`
  }

  const personalizedResponse = quizState.additionalNotes.trim()
    ? getPersonalizedResponseWithGaps(quizState.additionalNotes, breakdown)
    : null

  // Derived from what she actually answered — see lib/protocol-steps.ts for why
  // this must never go back to a hard-coded list.
  const protocolSteps = buildProtocolSteps(
    breakdown,
    [
      { label: "Core Healing Sequence", from: "Core-Safe Exercise Practice" },
      { label: "Pelvic Floor Reset", from: "Pelvic Floor Training" },
      { label: "Nutrition Blueprint", from: "Nutrition Tracking" },
      { label: "Sleep & Recovery Plan", from: "Rest & Recovery" },
      { label: "Strength Rebuild Phase 1", from: "Workout Routine Consistency" },
      { label: "Diastasis Repair Track", from: "Diastasis Recti Awareness" },
    ],
    "Your recovery baseline — mapped",
  )
  const completedSteps = protocolSteps.filter((s) => s.done).length
  const totalSteps = protocolSteps.length
  const pctDone = Math.round((completedSteps / totalSteps) * 100)

  return (
    <div className="min-h-screen p-4" style={{ background: "linear-gradient(135deg, #F8F5F2, #F0E6D2)" }}>
      <div className="max-w-4xl mx-auto">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>

        {/* ── Above-the-fold: Score + Hook + CTA ── */}
        <Card className="border-0 shadow-xl mb-6 overflow-hidden">
          <CardContent className="p-6 text-center">
            <h1 className="text-2xl font-bold mb-6" style={{ color: "#3A2412" }}>
              🎉 Your Postpartum Wellness Score
            </h1>
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
              <Badge
                className="text-base px-4 py-2 mb-2 whitespace-normal text-center break-words max-w-full inline-block"
                style={{ backgroundColor: getTierColor(), color: "white" }}
              >
                {getTierLabel()}
              </Badge>
            </div>

            {tier === "high" && (
              <div className="max-w-xl mx-auto text-left">
                <p className="text-xl font-semibold mb-2 text-center" style={{ color: "#A15C2F" }}>
                  {percent}% of your recovery foundations are already in place — that puts you in the top 15% of postpartum moms we assess.
                </p>
                <p className="text-base leading-relaxed" style={{ color: "#3A2412" }}>
                  Your risk isn&apos;t collapse — it&apos;s coasting. The gap between &ldquo;mostly recovered&rdquo; and
                  &ldquo;stronger than before pregnancy&rdquo; is precision work most moms never do, because nobody shows
                  them what&apos;s left. Your breakdown below shows exactly what&apos;s left.
                </p>
              </div>
            )}
            {tier === "medium" && (
              <div className="max-w-xl mx-auto text-left">
                <p className="text-xl font-semibold mb-2 text-center" style={{ color: "#A15C2F" }}>
                  {percent}% of your recovery foundations are in place — real ground under you, with gaps that won&apos;t close on their own.
                </p>
                <p className="text-base leading-relaxed" style={{ color: "#3A2412" }}>
                  Here&apos;s the part no one tells you: the gaps you leave open are the ones your body quietly builds
                  compensation patterns around — the breath-hold when you lift, the back taking over for the core. The
                  longer they run, the more automatic they get. Every one of them is trainable. Precision now beats
                  repair later.
                </p>
              </div>
            )}
            {tier === "low" && (
              <div className="max-w-xl mx-auto text-left">
                <p className="text-xl font-semibold mb-2 text-center" style={{ color: "#A15C2F" }}>
                  Let&apos;s be honest about what {percent}% means.
                </p>
                <p className="text-base leading-relaxed" style={{ color: "#3A2412" }}>
                  The foundations of your recovery — core connection, pelvic floor, fuel, rest — mostly aren&apos;t in
                  place yet. And a disconnected core doesn&apos;t wait: every week you compensate, your body wires the
                  patterns in deeper — the arch in your back, the brace before you lift, the leak you&apos;ve started
                  planning around. Left alone, it doesn&apos;t plateau. It compounds.
                </p>
                <p className="text-base leading-relaxed mt-2 font-semibold" style={{ color: "#3A2412" }}>
                  Now the flip side: every single one of those patterns is trainable. A {score} becomes a 40, becomes a
                  65, becomes an 85 — on 15 minutes a day. The question isn&apos;t whether you can fix it. It&apos;s how
                  many more weeks you let it get more automatic first.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Her own words, read back — moved directly under the score.
            This is the highest-conviction moment on the page and it used to sit
            at the very bottom with nothing attached to it. She now reaches it
            while the score is still fresh, and it carries a door. */}
        {concernReflection && (
          <ConcernReflectionCard
            concern={quizState.additionalNotes}
            reflection={concernReflection.reflection}
            crisis={concernReflection.crisis}
            footer={
              <ReflectionCta
                href={buildSignupUrl(quizState, score, tier)}
                stage="postpartum"
                firstName={quizState.name}
              />
            }
          />
        )}

        {/* ── Zeigarnik Open-Loop Hook ── */}
        <Card className="border-0 shadow-xl mb-6 overflow-hidden" style={{ borderTop: `4px solid ${getTierColor()}` }}>
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
                  {pctDone}% of your recovery plan is unlocked.
                </p>
                <p className="text-sm" style={{ color: "#3A2412", opacity: 0.7 }}>
                  The locked steps are the real work — core reconnection, pelvic floor retraining. Every week you wait, the compensation patterns dig in a little deeper.
                </p>
              </div>
            </div>

            {/* Protocol step preview — blurred after first two */}
            <div className="space-y-2 mb-5">
              {protocolSteps.map((step, i) => (
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
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 flex-shrink-0" style={{ borderColor: "#A15C2F" }} />
                  )}
                  <span className="font-medium" style={{ color: "#3A2412" }}>
                    {step.label}
                  </span>
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

            <ObstacleAnswer obstacle={quizState.biggestObstacle} />
          </CardContent>
        </Card>

        {/* ── Full Breakdown (below the fold) ── */}
        <Card className="border-0 shadow-xl mb-8">
          <CardHeader>
            <CardTitle className="text-2xl" style={{ color: "#A15C2F" }}>
              📋 Your Detailed Wellness Breakdown
            </CardTitle>
            <p className="text-sm" style={{ color: "#3A2412" }}>
              Here&apos;s exactly how you scored across the 10 essential postpartum wellness practices:
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {breakdown.map((item: ScoredCategory, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg border-2"
                style={{
                  borderColor:
                    item.status === "excellent" ? "#81C784" : item.status === "good" ? "#FFB74D" : "#E57373",
                  backgroundColor:
                    item.status === "excellent" ? "#F1F8F4" : item.status === "good" ? "#FFF8E1" : "#FFEBEE",
                }}
              >
                <div className="flex items-center gap-3 flex-1">
                  {item.status === "excellent" ? (
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  ) : (
                    <AlertCircle
                      className="h-6 w-6"
                      style={{ color: item.status === "good" ? "#FFB74D" : "#E57373" }}
                    />
                  )}
                  <div>
                    <p className="font-semibold" style={{ color: "#3A2412" }}>
                      {item.practice}
                    </p>
                    <p className="text-sm" style={{ color: "#3A2412", opacity: 0.7 }}>
                      {item.status === "excellent"
                        ? "Excellent!"
                        : item.status === "good"
                          ? "Room for improvement"
                          : "Needs attention"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold" style={{ color: "#3A2412" }}>
                    {item.score}
                    <span className="text-sm opacity-60">/{item.maxScore}</span>
                  </p>
                </div>
              </div>
            ))}
            {/* No total line. It used to read "TOTAL SCORE: 34/100" above rows
                that summed to something else entirely, which is the single
                thing on this page that cost the most trust. The rows are each
                explainable on their own; nothing here asks her to add them. */}
            <p className="pt-3 text-sm" style={{ color: "#8A7060" }}>
              Each area below is scored out of 10. Your overall percentage reflects how
              many of your recovery foundations are currently in place.
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
        <WhatsWaiting stage="postpartum" />

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
            Continue to My Recovery Plan
          </Button>
          <p className="text-sm mt-3" style={{ color: "#8A7060" }}>
            Your personalised dashboard, AI coach and recovery plan will already be waiting for you.
          </p>
        </div>

        <StickyCta
          href={buildSignupUrl(quizState, score, tier)}
          label="Continue to My Recovery Plan"
        />
      </div>
    </div>
  )
}

// ─── HighScorerContent ────────────────────────────────────────────────────────

// ─── MediumScorerContent ──────────────────────────────────────────────────────

// ─── LowScorerContent ─────────────────────────────────────────────────────────

