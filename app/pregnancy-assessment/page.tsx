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
import { buildProtocolSteps } from "@/lib/protocol-steps"
import { AnimatedScoreGauge } from "@/components/ui/animated-score-gauge"
import { StickyCta } from "@/components/sticky-cta"
const supabase = createClient()

// ─── Types ────────────────────────────────────────────────────────────────────

interface QuizState {
  name: string
  email: string
  trimester: string
  weeksPregnant: string
  prenatalCare: string
  exerciseSafety: string
  nutrition: string
  supplementation: string
  stress: string
  sleep: string
  pelvicFloor: string
  diastasisRecti: string
  nausea: string
  energy: string
  workoutRoutine: string
  dietaryRestrictions: string
  primaryGoal: string
  biggestObstacle: string
  supportType: string
  additionalNotes: string
  tracking: string
}

interface BreakdownItem {
  practice: string
  score: number
  maxScore: number
}

interface Testimonial {
  name: string
  score: string
  quote: string
  result: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

const initialQuizState: QuizState = {
  name: "", email: "", trimester: "", weeksPregnant: "",
  prenatalCare: "", exerciseSafety: "", nutrition: "", supplementation: "",
  stress: "", sleep: "", pelvicFloor: "", diastasisRecti: "", nausea: "",
  energy: "", workoutRoutine: "", dietaryRestrictions: "", primaryGoal: "",
  biggestObstacle: "", supportType: "", additionalNotes: "", tracking: "",
}

// ─── Utility: Score Breakdown ─────────────────────────────────────────────────
// Defined outside component so it is not recreated on every render.

function getDetailedBreakdown(qs: QuizState): BreakdownItem[] {
  return [
    {
      practice: "Prenatal Care",
      score: qs.prenatalCare === "yes" ? 10 : qs.prenatalCare === "sometimes" ? 5 : 0,
      maxScore: 10,
    },
    {
      practice: "Exercise Safety",
      score: qs.exerciseSafety === "yes" ? 10 : qs.exerciseSafety === "unsure" ? 3 : qs.exerciseSafety === "no" ? 5 : 0,
      maxScore: 10,
    },
    {
      practice: "Prenatal Nutrition",
      score: qs.nutrition === "yes" ? 10 : qs.nutrition === "sometimes" ? 5 : qs.nutrition === "trying" ? 3 : 0,
      maxScore: 10,
    },
    {
      practice: "Supplementation",
      score: qs.supplementation === "yes" ? 10 : qs.supplementation === "some" ? 5 : qs.supplementation === "unsure" ? 2 : 0,
      maxScore: 10,
    },
    {
      practice: "Stress Management",
      score: qs.stress === "low" ? 10 : qs.stress === "moderate" ? 5 : 0,
      maxScore: 10,
    },
    {
      practice: "Sleep Quality",
      score: qs.sleep === "yes" ? 10 : qs.sleep === "mostly" ? 7 : 0,
      maxScore: 10,
    },
    {
      practice: "Pelvic Floor Training",
      score: qs.pelvicFloor === "yes" ? 10 : qs.pelvicFloor === "sometimes" ? 5 : qs.pelvicFloor === "dont-know" ? 2 : 0,
      maxScore: 10,
    },
    {
      practice: "Diastasis Prevention",
      score: qs.diastasisRecti === "yes" ? 10 : qs.diastasisRecti === "aware" ? 5 : 0,
      maxScore: 10,
    },
    {
      practice: "Symptom Management",
      score: qs.nausea === "none" ? 10 : qs.nausea === "managed" ? 7 : qs.nausea === "struggling" ? 2 : 0,
      maxScore: 10,
    },
    {
      practice: "Wellness Tracking",
      score: qs.tracking === "yes" ? 10 : qs.tracking === "some" ? 5 : 0,
      maxScore: 10,
    },
  ]
}

// ─── Utility: Gap Explanations ────────────────────────────────────────────────
// Ethics-reviewed: no direct risk attribution or fear-based medical claims.

function getComprehensiveGapExplanation(practice: string, score: number) {
  if (score >= 8) {
    return { status: "strong" as const, whatThisMeans: "", consequence: "", howAppFixes: "", timeline: "" }
  }

  const map: Record<string, { whatThisMeans: string; consequence: string; howAppFixes: string; timeline: string }> = {
    "Prenatal Care": {
      whatThisMeans: "You're not yet receiving consistent prenatal care or regular medical monitoring.",
      consequence: "Without regular checkups, important screenings and guidance can be delayed. Regular care gives you and your provider the information needed to make informed decisions together.",
      howAppFixes: "While the app doesn't replace medical care, it helps you prepare for appointments, track symptoms between visits, and know what questions to bring to your provider.",
      timeline: "Schedule your next prenatal appointment within 1 week. Start tracking symptoms now so you arrive informed.",
    },
    "Exercise Safety": {
      whatThisMeans: "You're either not exercising, unsure what's safe, or still doing pre-pregnancy routines without modifications.",
      consequence: "Movement during pregnancy supports energy, sleep, and labor preparation. Without the right approach, you may miss these benefits — or push harder than is comfortable for your changing body.",
      howAppFixes: "The app provides trimester-specific, pregnancy-safe workouts with clear modifications as your pregnancy progresses. You'll know exactly what's safe and beneficial for each stage.",
      timeline: "Start with gentle pregnancy-safe movement within 3 days. Build to a consistent 3-4x/week routine within 2 weeks.",
    },
    "Prenatal Nutrition": {
      whatThisMeans: "You're not yet eating in a way that's targeted to pregnancy's specific nutritional needs.",
      consequence: "Pregnancy increases your need for folate, iron, calcium, protein, and DHA. Without focusing on these, your energy levels and recovery can suffer — and symptoms like fatigue and nausea may feel harder to manage.",
      howAppFixes: "The app provides pregnancy-specific meal plans with simple recipes and shopping lists, so you know what to eat, when, and why.",
      timeline: "Implement prenatal nutrition protocols within 2-3 days. Most women notice improved energy within 1 week.",
    },
    "Supplementation": {
      whatThisMeans: "You're not yet taking a complete prenatal supplement protocol.",
      consequence: "Even with good nutrition, it can be difficult to get enough folate, iron, calcium, and DHA from food alone. Gaps in these nutrients can contribute to fatigue and affect how supported your body feels throughout pregnancy.",
      howAppFixes: "The app provides a complete supplement protocol (prenatal vitamin, iron, calcium, DHA, vitamin D) with specific brands, doses, and timing for optimal absorption.",
      timeline: "Start prenatal supplements as soon as possible. Most women notice improved energy within 1-2 weeks.",
    },
    "Stress Management": {
      whatThisMeans: "You're experiencing high stress without consistent management strategies in place.",
      consequence: "Chronic stress affects your sleep, energy, and ability to stay consistent with healthy habits. It can make symptoms like nausea and fatigue feel more intense and harder to manage.",
      howAppFixes: "The app provides pregnancy-safe stress management techniques — breathwork, meditation, gentle movement, journaling — that calm your nervous system and create a daily reset.",
      timeline: "Start daily stress management practices within 1 day. Most women notice reduced anxiety within 3-5 days of consistent practice.",
    },
    "Sleep Quality": {
      whatThisMeans: "You're not getting the 8-10 hours of quality sleep your body needs during pregnancy.",
      consequence: "Sleep is when your body recovers and adapts to pregnancy's demands. Without enough quality rest, symptoms intensify, energy drops, and everything feels harder to manage.",
      howAppFixes: "The app provides sleep optimization strategies — positioning for each trimester, timing, environment, and relaxation techniques — specifically tailored to pregnancy discomforts.",
      timeline: "Implement sleep protocols within 1-2 days. See improved sleep quality within 3-5 days.",
    },
    "Pelvic Floor Training": {
      whatThisMeans: "You're not yet doing pelvic floor exercises to prepare for labor and support postpartum recovery.",
      consequence: "Your pelvic floor does significant work during pregnancy and delivery. Building its strength now helps with labor preparation and can make postpartum recovery smoother.",
      howAppFixes: "The app provides clear pelvic floor exercise instruction with video demonstrations. You'll learn how to do them correctly, when, and how to progress as your pregnancy advances.",
      timeline: "Start pelvic floor exercises within 2 days. Build to daily practice within 1 week. See improved strength within 2-3 weeks.",
    },
    "Diastasis Prevention": {
      whatThisMeans: "You're not yet aware of or actively preventing abdominal separation (diastasis recti) during pregnancy.",
      consequence: "Many pregnant women experience some degree of abdominal separation. Without modifying certain movements, this can be more pronounced — making postpartum core recovery take longer.",
      howAppFixes: "The app provides diastasis prevention exercises and teaches you which movements to modify. You'll protect your core throughout pregnancy and set yourself up for an easier postpartum journey.",
      timeline: "Start prevention exercises within 3 days. Maintain throughout pregnancy for the best outcome.",
    },
    "Symptom Management": {
      whatThisMeans: "You're currently struggling with pregnancy symptoms without consistent management strategies.",
      consequence: "Unmanaged symptoms — nausea, fatigue, discomfort — make it harder to eat well, stay active, and feel good in your day-to-day life, which affects everything else in your wellness plan.",
      howAppFixes: "The app provides evidence-based strategies for managing nausea, fatigue, pain, and other symptoms through nutrition, movement, and supplements.",
      timeline: "Implement symptom management protocols within 1-2 days. See improvement within 3-5 days.",
    },
    "Wellness Tracking": {
      whatThisMeans: "You're not yet tracking important wellness metrics — weight, symptoms, baby's movements.",
      consequence: "Without tracking, it's difficult to spot patterns or share useful data with your care provider. You also can't easily see what's working and celebrate your progress.",
      howAppFixes: "The app includes tracking tools for weight, symptoms, baby's movements, and more. You'll have meaningful data to bring to your doctor and clear progress to celebrate.",
      timeline: "Start tracking within 1 day. Establish a consistent habit within 1 week.",
    },
  }

  const exp = map[practice]
  if (!exp) {
    return {
      status: "needs-work" as const,
      whatThisMeans: `Focusing on ${practice} can make a meaningful difference in your pregnancy journey.`,
      consequence: "",
      howAppFixes: "The app provides personalized guidance and support for this area.",
      timeline: "Start with small, consistent steps.",
    }
  }
  return { status: "needs-work" as const, ...exp }
}

// ─── Utility: Tier Testimonials ───────────────────────────────────────────────

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
  url.searchParams.set("stage", quizState.trimester)
  url.searchParams.set("primary_goal", quizState.primaryGoal)
  url.searchParams.set("biggest_obstacle", quizState.biggestObstacle || "")
  url.searchParams.set("birth_experience", "")
  const assessmentId = typeof window !== "undefined" ? sessionStorage.getItem("pregnancy_assessment_id") : null
  if (assessmentId) url.searchParams.set("assessment_id", assessmentId)
  const concern = quizState.additionalNotes?.trim()
  if (concern) url.searchParams.set("concern", concern.slice(0, 250))
  const reflectionText = typeof window !== "undefined" ? sessionStorage.getItem("pregnancy_concern_reflection") : null
  if (reflectionText) url.searchParams.set("reflection", reflectionText.slice(0, 700))
  return url.toString()
}

function PricingCTA({
  quizState,
  score,
  tier,
  buttonLabel,
  footnote,
}: {
  quizState: QuizState
  score: number
  tier: string
  buttonLabel: string
  footnote: string
}) {
  return (
    <div className="text-center">
      <p className="text-sm font-semibold mb-3" style={{ color: "#A15C2F" }}>
        Your account is free to create — the rest of your plan is already built and waiting in it.
      </p>
      <Button
        size="lg"
        onClick={() => { window.location.href = buildSignupUrl(quizState, score, tier) }}
        className="w-full md:w-auto text-white px-6 py-3 text-base md:px-12 md:py-6 md:text-xl font-bold rounded-xl shadow-lg hover:shadow-xl transition-all whitespace-normal leading-snug h-auto text-center"
        style={{ background: "linear-gradient(135deg, #A15C2F, #C27B48)" }}
      >
        {buttonLabel}
      </Button>
      <p className="text-sm mt-4" style={{ color: "#3A2412", opacity: 0.7 }}>
        {footnote}
      </p>
    </div>
  )
}

// ─── Obstacle crusher — answers the #1 obstacle she told us about ────────────
function ObstacleAnswer({ obstacle }: { obstacle: string }) {
  const answers: Record<string, { said: string; answer: string }> = {
    "dont-know-safe": {
      said: "I do not know what is safe during pregnancy",
      answer:
        "That caution is exactly right — and it's exactly what the app removes. Every workout is trimester-matched and pregnancy-safe, with anything unsuitable for your stage locked out automatically. You never have to guess again.",
    },
    exhausted: {
      said: "I am too tired or nauseous to do much",
      answer:
        "Then your plan starts where you are, not where a fitness program thinks you should be. Gentle, short, energy-first sessions that work around nausea and fatigue — and adapt week by week as your body changes.",
    },
    anxiety: {
      said: "Pregnancy anxiety and worry",
      answer:
        "The antidote to pregnancy anxiety is a clear plan and someone in your corner. Your protocol tells you exactly what to do each day, and your 1:1 coach is there for every 'is this normal?' moment — so worry gets replaced with readiness.",
    },
    "no-support": {
      said: "I have no support or guidance",
      answer:
        "That ends today. You get a dedicated 1:1 coach, a daily plan built from your assessment, and a community of moms at your exact stage. You'll never be figuring this out alone again.",
    },
    overwhelmed: {
      said: "Overwhelmed by conflicting advice online",
      answer:
        "One plan, one coach, zero contradictions. Your protocol is built from your assessment — not from a hundred arguing sources — so you always know exactly what to do next and can ignore the noise.",
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

// ─── Shared UI: Gap Card ──────────────────────────────────────────────────────

export default function PregnancyAssessment() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [quizState, setQuizState] = useState<QuizState>(initialQuizState)
  const [showResults, setShowResults] = useState(false)
  const [concernReflection, setConcernReflection] = useState<ConcernReflectionResult | null>(null)
  const [score, setScore] = useState(0)
  const [scoreTier, setScoreTier] = useState<"low" | "medium" | "high">("low")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const questions = [
    {
      id: "trimester", title: "Which trimester are you in?",
      subtitle: "This helps us give you stage-appropriate recommendations",
      type: "radio", field: "trimester",
      options: [
        { value: "first", label: "First trimester (weeks 1 to 13)" },
        { value: "second", label: "Second trimester (weeks 14 to 26)" },
        { value: "third", label: "Third trimester (weeks 27 to 40)" },
      ],
    },
    {
      id: "weeks-pregnant", title: "How many weeks pregnant are you?",
      subtitle: "This pinpoints your timeline and how long you have to prepare",
      type: "number", field: "weeksPregnant", placeholder: "e.g. 24",
    },
    {
      id: "prenatal-care", title: "Are you receiving regular prenatal care?",
      subtitle: "Medical supervision is critical during pregnancy",
      type: "radio", field: "prenatalCare",
      options: [
        { value: "yes", label: "Yes, I see my doctor or midwife regularly" },
        { value: "sometimes", label: "Sometimes, but not consistently" },
        { value: "no", label: "No, I have not started prenatal care yet" },
      ],
    },
    {
      id: "exercise-safety", title: "How are you approaching movement and exercise during pregnancy?",
      subtitle: "Staying active safely supports both you and baby",
      type: "radio", field: "exerciseSafety",
      options: [
        { value: "yes", label: "I do pregnancy-safe workouts regularly" },
        { value: "unsure", label: "I want to move but I am not sure what is safe" },
        { value: "no", label: "I am not exercising at all right now" },
        { value: "intense", label: "I am still doing high-intensity workouts" },
      ],
    },
    {
      id: "nutrition", title: "How well are you nourishing your body during pregnancy?",
      subtitle: "Folate, iron, calcium and protein are critical for you and baby",
      type: "radio", field: "nutrition",
      options: [
        { value: "yes", label: "Well — I focus on prenatal nutrition" },
        { value: "sometimes", label: "Okay — I try but it is inconsistent" },
        { value: "trying", label: "I eat healthy but do not focus on pregnancy needs" },
        { value: "no", label: "Poorly — I eat whatever I can keep down" },
      ],
    },
    {
      id: "pelvic-floor", title: "Are you doing pelvic floor exercises during pregnancy?",
      subtitle: "These prepare you for labor and prevent postpartum issues",
      type: "radio", field: "pelvicFloor",
      options: [
        { value: "yes", label: "Yes, I do them regularly" },
        { value: "sometimes", label: "Sometimes, but not consistently" },
        { value: "dont-know", label: "I am not sure how to do them properly" },
        { value: "no", label: "No, I have not started" },
      ],
    },
    {
      id: "stress", title: "How would you describe your stress and anxiety levels?",
      subtitle: "Chronic stress impacts both your health and your baby",
      type: "radio", field: "stress",
      options: [
        { value: "low", label: "Low — I feel calm and manage stress well" },
        { value: "moderate", label: "Moderate — some stress but manageable" },
        { value: "high", label: "High — I feel anxious or overwhelmed often" },
        { value: "very-high", label: "Very high — pregnancy anxiety is consuming me" },
      ],
    },
    {
      id: "name", title: "Almost there! What is your first name?",
      subtitle: "So we can personalize your pregnancy wellness score",
      type: "text", field: "name", placeholder: "Enter your first name",
    },
    {
      id: "email", title: "Where should we send your personalized results?",
      subtitle: "We will email your full pregnancy assessment breakdown",
      type: "email", field: "email", placeholder: "your@email.com",
    },
    {
      id: "primary-goal", title: "What matters most to you right now?",
      subtitle: "This helps us personalize your roadmap",
      type: "radio", field: "primaryGoal",
      options: [
        { value: "healthy-pregnancy", label: "Have the healthiest pregnancy possible" },
        { value: "manage-symptoms", label: "Manage symptoms like nausea and fatigue" },
        { value: "prepare-labor", label: "Prepare my body for labor and delivery" },
        { value: "postpartum-ready", label: "Set myself up for postpartum recovery" },
        { value: "stay-active", label: "Stay active and strong throughout pregnancy" },
      ],
    },
    {
      id: "biggest-obstacle", title: "What is the main thing holding you back right now?",
      subtitle: "Knowing this helps us support you better",
      type: "radio", field: "biggestObstacle",
      options: [
        { value: "dont-know-safe", label: "I do not know what is safe during pregnancy" },
        { value: "exhausted", label: "I am too tired or nauseous to do much" },
        { value: "anxiety", label: "Pregnancy anxiety and worry" },
        { value: "no-support", label: "I have no support or guidance" },
        { value: "overwhelmed", label: "Overwhelmed by conflicting advice online" },
      ],
    },
    {
      id: "additional-notes", title: "Anything else we should know?",
      subtitle: "Share any concerns, conditions, or context that might help",
      type: "textarea", field: "additionalNotes",
      placeholder: "E.g., gestational diabetes, high blood pressure, previous complications, specific concerns...",
    },
  ]

  const calculateScore = () => {
    let s = 10 // Trimester: context, not penalized
    if (quizState.prenatalCare === "yes") s += 10
    else if (quizState.prenatalCare === "sometimes") s += 5
    if (quizState.exerciseSafety === "yes") s += 10
    else if (quizState.exerciseSafety === "unsure" || quizState.exerciseSafety === "no") s += 4
    if (quizState.nutrition === "yes") s += 10
    else if (quizState.nutrition === "sometimes") s += 6
    else if (quizState.nutrition === "trying") s += 3
    if (quizState.pelvicFloor === "yes") s += 10
    else if (quizState.pelvicFloor === "sometimes") s += 6
    else if (quizState.pelvicFloor === "dont-know") s += 2
    if (quizState.stress === "low") s += 10
    else if (quizState.stress === "moderate") s += 6
    else if (quizState.stress === "high") s += 2
    return s
  }

  const getTier = (s: number): "low" | "medium" | "high" =>
    s <= 40 ? "low" : s <= 70 ? "medium" : "high"

  const handleNext = async () => {
    trackQuizEvents.questionAnswered(currentQuestion + 1)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      return
    }

    setIsLoading(true)
    try {
      const calculatedScore = calculateScore()
      const tier = getTier(calculatedScore)
      setScore(calculatedScore)
      setScoreTier(tier)
      trackQuizEvents.quizCompleted(calculatedScore, tier)

      const reflection = await generateConcernReflection({
        concern: quizState.additionalNotes,
        stage: "pregnancy",
        primaryGoal: quizState.primaryGoal,
        biggestObstacle: quizState.biggestObstacle,
        profile: {
          trimester: quizState.trimester,
          weeks_pregnant: quizState.weeksPregnant,
          exercise_safety: quizState.exerciseSafety,
          pelvic_floor: quizState.pelvicFloor,
          prenatal_care: quizState.prenatalCare,
          stress: quizState.stress,
          sleep: quizState.sleep,
          support: quizState.supportType,
        },
      }).catch(() => null)
      setConcernReflection(reflection)
      // Hand the reflection to the signup URL builder without needing any
      // funnel-side database column — same transport as assessment_id.
      if (reflection && !reflection.crisis && reflection.reflection) {
        sessionStorage.setItem("pregnancy_concern_reflection", reflection.reflection)
      }

      const weeksPregnantNum = Number.parseInt(quizState.weeksPregnant) || 0
      const weeksUntilBirth = Math.max(0, 40 - weeksPregnantNum)

      const customProperties = {
        assessment_type: "Pregnancy",
        score: calculatedScore,
        score_tier: tier,
        trimester: quizState.trimester,
        weeks_pregnant: weeksPregnantNum,
        weeks_until_birth: weeksUntilBirth,
        primary_goal: quizState.primaryGoal,
        biggest_obstacle: quizState.biggestObstacle,
        prenatal_care: quizState.prenatalCare,
        nutrition: quizState.nutrition,
        supplementation: quizState.supplementation,
        stress: quizState.stress,
        sleep: quizState.sleep,
        pelvic_floor: quizState.pelvicFloor,
        support_type: quizState.supportType,
        exercise_safety: quizState.exerciseSafety,
        concern: quizState.additionalNotes,
        concern_reflection: reflection && !reflection.crisis ? reflection.reflection : undefined,
      }

      try {
        await addContactToOmnisend({
          email: quizState.email,
          firstName: quizState.name,
          tags: ["pregnancy-assessment", `score-${tier}`, `trimester-${quizState.trimester}`],
          customProperties,
        })
      } catch (omnisendError) {
        console.error("[omnisend] first call error:", omnisendError)
      }

      // ── Lead Capture: pregnancy_assessments table ───────────────────────────
      const { data, error: supabaseError } = await supabase
        .from("pregnancy_assessments")
        .insert({
          name: quizState.name,
          email: quizState.email,
          trimester: quizState.trimester || null,
          weeks_pregnant: weeksPregnantNum ? String(weeksPregnantNum) : null,
          // integer sub-score columns omitted — they expect numeric scores
          // which require a separate mapping from answer values
        })
        .select()

      if (supabaseError) console.error("[supabase] insert error:", supabaseError)

      if (data?.[0]) {
        sessionStorage.setItem("pregnancy_assessment_id", data[0].id)
        const resultsUrl = `https://catalystmomofficial.com/dashboard?assessment_id=${data[0].id}`
        try {
          await addContactToOmnisend({
            email: quizState.email,
            firstName: quizState.name,
            tags: ["pregnancy-assessment", `score-${tier}`, `trimester-${quizState.trimester}`],
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
    if (q.field === "weeksPregnant") { const n = Number.parseInt(val); return !isNaN(n) && n >= 1 && n <= 40 }
    return val !== ""
  }

  if (showResults) {
    return <PregnancyResultsPage score={score} tier={scoreTier} quizState={quizState} concernReflection={concernReflection} />
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
              <span className="font-bold" style={{ color: "#A15C2F" }}>Catalyst Mom - Pregnancy</span>
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
            {question.type === "number" && (
              <input
                type="number"
                inputMode="numeric"
                min={1}
                max={40}
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
            disabled={!isCurrentQuestionValid() || isLoading || isSubmitting}
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

function PregnancyResultsPage({
  score, tier, quizState, concernReflection,
}: {
  score: number
  tier: "low" | "medium" | "high"
  quizState: QuizState
  concernReflection: ConcernReflectionResult | null
}) {
  const breakdown = getDetailedBreakdown(quizState)
  const gaps = breakdown.filter((item) => item.score < 8).slice(0, 3)

  const getTierColor = () => score <= 40 ? "#E57373" : score <= 70 ? "#FFB74D" : "#81C784"
  const getTierLabel = () =>
    score <= 40 ? "Early Foundations Stage" : score <= 70 ? "Building Momentum Stage" : "Thriving & Ready Stage"
  const gauge =
    score <= 40 ? { from: "#EF9A9A", to: "#E53935", text: "#C62828" }
    : score <= 70 ? { from: "#FFCC80", to: "#FB8C00", text: "#E65100" }
    : { from: "#A5D6A7", to: "#43A047", text: "#2E7D32" }

  // Derived from what she actually answered — see lib/protocol-steps.ts for why
  // this must never go back to a hard-coded list.
  const pregnancyProtocolSteps = buildProtocolSteps(
    breakdown,
    [
      { label: "Prenatal Nutrition Foundation", from: "Prenatal Nutrition" },
      { label: "Safe Exercise Modifications", from: "Exercise Safety" },
      { label: "Pelvic Floor Prep Programme", from: "Pelvic Floor Training" },
      { label: "Birth Prep Breathing Protocol", from: "Stress Management" },
      { label: "Symptom Relief Protocol", from: "Symptom Management" },
      { label: "Postpartum Transition Guide", from: "Diastasis Prevention" },
    ],
    "Your pregnancy baseline — mapped",
  )
  const completedSteps = pregnancyProtocolSteps.filter((s) => s.done).length
  const totalSteps = pregnancyProtocolSteps.length
  const pctDone = Math.round((completedSteps / totalSteps) * 100)

  return (
    <div className="min-h-screen p-4" style={{ background: "linear-gradient(135deg, #F8F5F2, #F0E6D2)" }}>
      <div className="max-w-4xl mx-auto">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />Back
          </Button>
        </Link>

        {/* Score Circle */}
        <Card className="border-0 shadow-xl mb-6">
          <CardContent className="p-8 text-center">
            <div className="mb-4">
              <AnimatedScoreGauge
                value={score}
                max={100}
                fromColor={gauge.from}
                toColor={gauge.to}
                captionColor="#8A7060"
                size={260}
                className="mb-4"
              />
              <h1 className="text-3xl font-bold mb-2" style={{ color: "#3A2412" }}>
                Your Pregnancy Wellness Score
              </h1>
              <Badge className="text-lg px-4 py-2" style={{ backgroundColor: getTierColor(), color: "white" }}>
                {getTierLabel()}
              </Badge>
            </div>
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
                stage="pregnancy"
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
                  Your personalised pregnancy plan is {pctDone}% built.
                </p>
                <p className="text-sm" style={{ color: "#3A2412", opacity: 0.7 }}>
                  The locked steps are the part that actually prepares your body — the breath, the positioning, the pelvic floor work. Every week of your prep window counts.
                </p>
              </div>
            </div>
            <div className="space-y-2 mb-5">
              {pregnancyProtocolSteps.map((step, i) => (
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
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm">✓</span>
                    </div>
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
              👇 Unlock the remaining {totalSteps - completedSteps} steps — personalised to your trimester &amp; goals
            </p>
            <ObstacleAnswer obstacle={quizState.biggestObstacle} />
            <PricingCTA
              quizState={quizState}
              score={score}
              tier={tier}
              buttonLabel="Create My Free Account — Unlock My Plan"
              footnote="Free to create · no card · your assessment loads straight in"
            />
          </CardContent>
        </Card>

        {/* What Your Score Means — one honest paragraph. The three-paragraph
            version was building a case; the case belongs on the paywall. */}
        <Card className="border-0 shadow-xl mb-8">
          <CardContent className="p-6">
            {tier === "high" && (
              <p className="text-lg leading-relaxed" style={{ color: "#3A2412" }}>
                <strong>{quizState.name}, {score}/100 puts you in the top 15% of pregnant women we assess.</strong>{" "}
                Prenatal care, safe movement, food, stress — you&apos;re already doing most of it. What&apos;s left is
                two or three areas of fine-tuning, and they&apos;re the ones below.
              </p>
            )}
            {tier === "medium" && (
              <p className="text-lg leading-relaxed" style={{ color: "#3A2412" }}>
                <strong>{quizState.name}, at {score}/100 you have real foundations and a handful of open gaps.</strong>{" "}
                They&apos;re the reason some days feel harder than they need to, and they&apos;re exactly what your prep
                window exists to close.
              </p>
            )}
            {tier === "low" && (
              <p className="text-lg leading-relaxed" style={{ color: "#3A2412" }}>
                <strong>{quizState.name}, {score}/100 is a starting line, not a verdict.</strong> Most women start
                here — unsure what&apos;s safe, buried in conflicting advice. You&apos;re in your prep window right now,
                and everything you build in it is momentum your body carries into birth and recovery.
              </p>
            )}
          </CardContent>
        </Card>

        {/* 10-Point Breakdown */}
        <Card className="border-0 shadow-xl mb-8">
          <CardHeader>
            <CardTitle className="text-2xl" style={{ color: "#A15C2F" }}>
              Your Detailed Pregnancy Breakdown
            </CardTitle>
            <p className="text-base" style={{ color: "#3A2412" }}>
              Here&apos;s how your score breaks down across 10 key pregnancy wellness practices:
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {breakdown.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg"
                  style={{ backgroundColor: "#F8F5F2" }}
                >
                  <div className="flex items-center space-x-3">
                    {item.score >= 8 ? (
                      <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                        <span className="text-white text-sm">✓</span>
                      </div>
                    ) : item.score >= 5 ? (
                      <div className="w-6 h-6 rounded-full bg-orange-400 flex items-center justify-center">
                        <span className="text-white text-sm">!</span>
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-red-400 flex items-center justify-center">
                        <span className="text-white text-sm">✗</span>
                      </div>
                    )}
                    <span className="font-medium" style={{ color: "#3A2412" }}>{item.practice}</span>
                  </div>
                  <span className="text-lg font-bold" style={{ color: "#A15C2F" }}>
                    {item.score}/{item.maxScore}
                  </span>
                </div>
              ))}
            </div>
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
        {/* Final ask — the page should end with a door, not a story */}
        <div className="text-center mt-8 mb-24 md:mb-8">
          <Button
            size="lg"
            onClick={() => { window.location.href = buildSignupUrl(quizState, score, tier) }}
            className="w-full md:w-auto text-white px-8 py-4 text-lg font-bold rounded-xl shadow-lg whitespace-normal leading-snug h-auto"
            style={{ background: "linear-gradient(135deg, #A15C2F, #C27B48)" }}
          >
            Create My Free Account
          </Button>
          <p className="text-sm mt-3" style={{ color: "#8A7060" }}>
            Free to create · no card needed · takes about 30 seconds
          </p>
        </div>

        <StickyCta
          href={buildSignupUrl(quizState, score, tier)}
          label="Create My Free Account"
        />
      </div>
    </div>
  )
}
