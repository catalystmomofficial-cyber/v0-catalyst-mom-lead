"use client"
import Link from "next/link"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Heart, CheckCircle2, AlertCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { trackQuizEvents } from "@/lib/analytics"
import { addContactToOmnisend } from "@/lib/omnisend"

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

const supabase = createClient()

const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// ─── Shared Sub-components ───────────────────────────────────────────────────

function TestimonialsSection({
  testimonials,
  title = "💬 What Our Members Say:",
}: {
  testimonials: { quote: string; author: string }[]
  title?: string
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-center" style={{ color: "#A15C2F" }}>
        {title}
      </h3>
      {testimonials.map((t, i) => (
        <div key={i} className="p-6 bg-white rounded-lg border-2" style={{ borderColor: "#E8D5C4" }}>
          <p className="italic mb-3" style={{ color: "#3A2412" }}>
            &ldquo;{t.quote}&rdquo;
          </p>
          <p className="font-semibold" style={{ color: "#A15C2F" }}>
            {t.author}
          </p>
        </div>
      ))}
    </div>
  )
}

function PricingSection({
  quizState,
  score,
  tier,
}: {
  quizState: QuizState
  score: number
  tier: string
}) {
  return (
    <div className="text-center p-8 bg-white rounded-lg border-4" style={{ borderColor: "#A15C2F" }}>
      <Button
        size="lg"
        className="w-full md:w-auto text-white px-6 py-3 text-base md:px-12 md:py-6 md:text-xl font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
        style={{ background: "linear-gradient(135deg, #A15C2F, #C27B48)" }}
        onClick={() => {
          const appUrl = new URL("https://catalystmomofficial.com/signup")
          appUrl.searchParams.set("name", quizState.name)
          appUrl.searchParams.set("email", quizState.email)
          appUrl.searchParams.set("score", score.toString())
          appUrl.searchParams.set("tier", tier)
          appUrl.searchParams.set("stage", quizState.weeksPostpartum)
          appUrl.searchParams.set("primary_goal", quizState.primaryGoal)
          appUrl.searchParams.set("biggest_obstacle", quizState.biggestObstacle)
          appUrl.searchParams.set("birth_experience", quizState.birthExperience || "")
          window.open(appUrl.toString(), "_blank")
        }}
      >
        {quizState.weeksPostpartum === "0-6" || quizState.medicalClearance === "no"
          ? "Start My Gentle Healing Protocol - $29/month"
          : "Join the Catalyst Mom App Now - $29/month"}
      </Button>
      <p className="text-sm mt-4" style={{ color: "#3A2412", opacity: 0.7 }}>
        Feel more connected to your core in just 7 days. Cancel anytime. No contracts.
      </p>
    </div>
  )
}

// ─── Utility functions ────────────────────────────────────────────────────────

function PersonalizedConcernSection({
  concern,
  breakdown,
}: {
  concern: string
  breakdown: any[]
}) {
  if (!concern || concern.trim().length === 0) return null

  const relevantGaps = breakdown.filter((item) => item.score <= 7).slice(0, 3)

  return (
    <Card className="border-0 shadow-xl mb-8" style={{ borderLeft: "6px solid #A15C2F" }}>
      <CardHeader>
        <CardTitle className="text-2xl" style={{ color: "#A15C2F" }}>
          💬 You Also Mentioned: Your Personalized Postpartum Journey
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 rounded-lg" style={{ backgroundColor: "#F3E5F5" }}>
          <p className="italic text-lg" style={{ color: "#666" }}>
            You shared: &ldquo;{concern}&rdquo;
          </p>
        </div>

        <p className="text-lg leading-relaxed" style={{ color: "#3A2412" }}>
          Based on your assessment, we&apos;ll create a customized postpartum recovery plan that addresses your unique
          situation. Our program combines evidence-based protocols with personalized support to help you achieve your
          goal of optimal postpartum wellness.
        </p>

        <div className="p-6 rounded-lg border-2" style={{ borderColor: "#FFB74D", backgroundColor: "#FFF8E1" }}>
          <h3 className="text-xl font-bold mb-4" style={{ color: "#A15C2F" }}>
            How This Connects to Your Score:
          </h3>
          <p className="mb-4" style={{ color: "#3A2412" }}>
            Your concern about <strong>your postpartum recovery</strong> is directly related to the gaps we identified.
            Here&apos;s what&apos;s holding you back:
          </p>
          <div className="space-y-4">
            {relevantGaps.map((gap, index) => (
              <div key={index} className="flex items-start gap-3">
                <span className="text-orange-600 font-bold text-lg flex-shrink-0">•</span>
                <div>
                  <p className="font-bold" style={{ color: "#A15C2F" }}>
                    {gap.practice} ({gap.score}/10):
                  </p>
                  <p style={{ color: "#3A2412" }}>
                    {gap.practice.includes("Exercise")
                      ? "You're not doing postpartum-safe movements. Without proper form and core engagement, your body isn't recovering optimally and you may experience pain or weakness."
                      : gap.practice.includes("Nutrition")
                        ? "Your nutrition isn't optimized for postpartum recovery. Proper eating supports healing, energy levels, and milk production if breastfeeding."
                        : gap.practice.includes("Pelvic")
                          ? "Without pelvic floor work, you may experience incontinence, prolapse risk, or painful sex. Prevention and strengthening are critical for recovery."
                          : gap.practice.includes("Core")
                            ? "Your core needs specific healing exercises. Without proper core work, you may have back pain, poor posture, or a persistent 'mom pooch.'"
                            : gap.practice.includes("Rest")
                              ? "You're not prioritizing rest and recovery. Your body heals during rest - without it, recovery is slower and you'll feel exhausted."
                              : `This gap is affecting your postpartum recovery. Addressing it will help you feel better faster.`}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t-2" style={{ borderColor: "#FFB74D" }}>
            <div className="space-y-4">
              <div>
                <p className="font-bold text-lg mb-2" style={{ color: "#A15C2F" }}>
                  What This Means:
                </p>
                <p style={{ color: "#3A2412" }}>
                  These aren&apos;t just &ldquo;nice to haves&rdquo;—these gaps are directly affecting your postpartum
                  recovery and quality of life. But here&apos;s the good news: they&apos;re ALL fixable with the right
                  protocols and support.
                </p>
              </div>

              <div>
                <p className="font-bold text-lg mb-3" style={{ color: "#A15C2F" }}>
                  What the App Does:
                </p>
                <div className="space-y-2">
                  {[
                    "Complete postpartum recovery system (all 10 practice areas covered)",
                    "Personalized protocols based on YOUR gaps and recovery stage",
                    "Postpartum-safe workouts and core healing exercises",
                    "Expert guidance and community support from other moms",
                    "Evidence-based interventions for optimal postpartum recovery",
                  ].map((item, i) => (
                    <p key={i} className="flex items-start gap-2" style={{ color: "#3A2412" }}>
                      <span className="text-green-600 flex-shrink-0">✅</span>
                      <span>{item}</span>
                    </p>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-bold text-lg mb-2" style={{ color: "#A15C2F" }}>
                  Timeline:
                </p>
                <p style={{ color: "#3A2412" }}>
                  Most women see improved energy and reduced pain within 2-3 weeks, with continued improvements in core
                  strength, pelvic floor function, and overall recovery over 3-6 months.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const getDetailedBreakdown = (quizState: QuizState) => {
  return [
    {
      practice: "Medical Clearance",
      score: quizState.medicalClearance === "yes" ? 10 : 0,
      maxScore: 10,
      status: quizState.medicalClearance === "yes" ? "excellent" : "needs-work",
    },
    {
      practice: "Diastasis Recti Awareness",
      score:
        quizState.diastasisRecti === "diagnosed" || quizState.diastasisRecti === "no"
          ? 10
          : quizState.diastasisRecti === "think-so"
            ? 5
            : 0,
      maxScore: 10,
      status:
        quizState.diastasisRecti === "diagnosed" || quizState.diastasisRecti === "no"
          ? "excellent"
          : quizState.diastasisRecti === "think-so"
            ? "good"
            : "needs-work",
    },
    {
      practice: "Core-Safe Exercise Practice",
      score:
        quizState.coreSafeExercises === "yes"
          ? 10
          : quizState.coreSafeExercises === "not-working"
            ? 5
            : quizState.coreSafeExercises === "unsure"
              ? 3
              : 0,
      maxScore: 10,
      status:
        quizState.coreSafeExercises === "yes"
          ? "excellent"
          : quizState.coreSafeExercises === "not-working" || quizState.coreSafeExercises === "unsure"
            ? "good"
            : "needs-work",
    },
    {
      practice: "Pelvic Floor Training",
      score:
        quizState.pelvicFloor === "yes"
          ? 10
          : quizState.pelvicFloor === "sometimes"
            ? 5
            : quizState.pelvicFloor === "dont-know"
              ? 2
              : 0,
      maxScore: 10,
      status:
        quizState.pelvicFloor === "yes" ? "excellent" : quizState.pelvicFloor === "sometimes" ? "good" : "needs-work",
    },
    {
      practice: "Nutrition Tracking",
      score:
        quizState.nutrition === "yes"
          ? 10
          : quizState.nutrition === "sometimes"
            ? 5
            : quizState.nutrition === "try"
              ? 3
              : 0,
      maxScore: 10,
      status: quizState.nutrition === "yes" ? "excellent" : quizState.nutrition === "sometimes" ? "good" : "needs-work",
    },
    {
      practice: "Protein Intake",
      score: quizState.proteinIntake === "yes" ? 10 : quizState.proteinIntake === "sometimes" ? 5 : 0,
      maxScore: 10,
      status:
        quizState.proteinIntake === "yes"
          ? "excellent"
          : quizState.proteinIntake === "sometimes"
            ? "good"
            : "needs-work",
    },
    {
      practice: "Rest & Recovery",
      score: quizState.rest === "yes" ? 10 : quizState.rest === "sometimes" ? 5 : quizState.rest === "no-sleep" ? 3 : 0,
      maxScore: 10,
      status: quizState.rest === "yes" ? "excellent" : quizState.rest === "sometimes" ? "good" : "needs-work",
    },
    {
      practice: "Hydration",
      score:
        quizState.hydration === "yes"
          ? 10
          : quizState.hydration === "mostly"
            ? 7
            : quizState.hydration === "coffee"
              ? 2
              : 0,
      maxScore: 10,
      status: quizState.hydration === "yes" ? "excellent" : quizState.hydration === "mostly" ? "good" : "needs-work",
    },
    {
      practice: "Workout Routine Consistency",
      score:
        quizState.workoutRoutine === "yes"
          ? 10
          : quizState.workoutRoutine === "sometimes"
            ? 5
            : quizState.workoutRoutine === "random"
              ? 2
              : 0,
      maxScore: 10,
      status:
        quizState.workoutRoutine === "yes"
          ? "excellent"
          : quizState.workoutRoutine === "sometimes"
            ? "good"
            : "needs-work",
    },
    {
      practice: "Wellness Tracking",
      score: quizState.tracking === "yes" ? 10 : quizState.tracking === "sometimes" ? 5 : 0,
      maxScore: 10,
      status: quizState.tracking === "yes" ? "excellent" : quizState.tracking === "sometimes" ? "good" : "needs-work",
    },
  ]
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

  const calculateScore = () => {
    let totalScore = 0

    totalScore += 10 // Timeline always scores 10

    if (quizState.medicalClearance === "yes") totalScore += 10
    else totalScore += 0

    if (quizState.diastasisRecti === "diagnosed") totalScore += 10
    else if (quizState.diastasisRecti === "think-so") totalScore += 7
    else if (quizState.diastasisRecti === "no") totalScore += 10
    else totalScore += 3

    if (quizState.coreSafeExercises === "leak") totalScore += 3
    else if (quizState.coreSafeExercises === "weak") totalScore += 5
    else if (quizState.coreSafeExercises === "pain") totalScore += 4
    else if (quizState.coreSafeExercises === "all") totalScore += 2
    else if (quizState.coreSafeExercises === "okay") totalScore += 10

    if (quizState.workoutRoutine === "3-plus") totalScore += 10
    else if (quizState.workoutRoutine === "1-2") totalScore += 7
    else if (quizState.workoutRoutine === "occasional") totalScore += 4
    else if (quizState.workoutRoutine === "not-started") totalScore += 0

    if (quizState.nutrition === "well") totalScore += 10
    else if (quizState.nutrition === "okay") totalScore += 6
    else if (quizState.nutrition === "poorly") totalScore += 2
    else if (quizState.nutrition === "no-idea") totalScore += 0

    if (quizState.rest === "good") totalScore += 10
    else if (quizState.rest === "tired") totalScore += 7
    else if (quizState.rest === "exhausted") totalScore += 2
    else if (quizState.rest === "depleted") totalScore += 0

    return totalScore
  }

  const getTier = (score: number): "low" | "medium" | "high" => {
    if (score <= 40) return "low"
    if (score <= 70) return "medium"
    return "high"
  }

  const handleNext = async () => {
    trackQuizEvents.questionAnswered(currentQuestion + 1)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setIsLoading(true)
      try {
        const calculatedScore = calculateScore()
        const tier = getTier(calculatedScore)

        setScore(calculatedScore)
        setScoreTier(tier)
        setTier(tier)

        trackQuizEvents.quizCompleted(calculatedScore, tier)

        const customProperties = {
          assessment_type: "Postpartum",
          score: calculatedScore,
          score_tier: tier,
          weeks_postpartum: quizState.weeksPostpartum,
          primary_goal: quizState.primaryGoal,
          birth_experience: quizState.birthExperience,
          results_url: `https://catalystmomofficial.com/dashboard`,
        }

        await addContactToOmnisend({
          email: quizState.email,
          firstName: quizState.name,
          tags: ["postpartum-assessment", `score-${tier}`, `weeks-${quizState.weeksPostpartum}`],
          customProperties: customProperties,
        })

        const { data: supabaseData, error: supabaseError } = await supabase
          .from("lead_responses")
          .insert({
            name: quizState.name,
            email: quizState.email,
            primary_goal: quizState.primaryGoal,
            activity_level: quizState.exercise || "not-specified",
            equipment: quizState.workoutRoutine || "not-specified",
            dietary_preferences: quizState.dietaryRestrictions || "none",
            special_notes: JSON.stringify({
              assessment_type: "postpartum",
              score: calculatedScore,
              score_tier: tier,
              weeks_postpartum: quizState.weeksPostpartum,
              biggest_obstacle: quizState.biggestObstacle,
              support_preference: quizState.supportType,
              additional_notes: quizState.additionalNotes,
              birth_experience: quizState.birthExperience,
              exercise_safety: quizState.coreSafeExercises === "crunches" ? "unsafe" : quizState.coreSafeExercises,
              pelvic_floor: quizState.pelvicFloor,
              core_strength: quizState.coreSafeExercises,
              postpartum_nutrition: quizState.nutrition,
              supplementation: quizState.proteinIntake ? "yes" : "no",
              sleep_quality: quizState.rest,
              stress_management: quizState.tracking,
              body_image: quizState.diastasisRecti,
              partner_support:
                quizState.supportType === "done-for-you" || quizState.supportType === "1on1" ? "high" : "low",
              self_care:
                quizState.supportType === "self-guided" || quizState.supportType === "community" ? "moderate" : "low",
            }),
            created_at: new Date().toISOString(),
          })
          .select()

        console.log("[v0] Supabase insert response:", supabaseData)

        if (supabaseData && supabaseData[0]) {
          sessionStorage.setItem("postpartum_assessment_id", supabaseData[0].id)
          customProperties.results_url = `https://catalystmomofficial.com/dashboard?assessment_id=${supabaseData[0].id}`
          await addContactToOmnisend({
            email: quizState.email,
            firstName: quizState.name,
            tags: ["postpartum-assessment", `score-${tier}`, `weeks-${quizState.weeksPostpartum}`],
            customProperties: customProperties,
          })
        }

        setShowResults(true)
      } catch (error) {
        console.error("[v0] Error submitting quiz:", error)
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
    return <ResultsPage score={score} tier={tier} quizState={quizState} />
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
              <RadioGroup
                value={quizState[question.field as keyof QuizState]}
                onValueChange={(value) => handleInputChange(question.field as keyof QuizState, value)}
              >
                <div className="space-y-3">
                  {(question as any).options?.map((option: { value: string; label: string }) => (
                    <div
                      key={option.value}
                      className="flex items-center space-x-3 p-4 border-2 border-amber-200 rounded-lg hover:border-amber-400 cursor-pointer transition-colors"
                    >
                      <RadioGroupItem value={option.value} id={option.value} />
                      <Label htmlFor={option.value} className="cursor-pointer flex-1 text-base">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
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
}: {
  score: number
  tier: "low" | "medium" | "high"
  quizState: QuizState
}) {
  const getTierColor = () => {
    if (score <= 40) return "#E57373"
    if (score <= 70) return "#FFB74D"
    return "#81C784"
  }

  const getTierLabel = () => {
    if (score <= 40) return "Early Foundations Stage"
    if (score <= 70) return "Building Momentum Stage"
    return "Thriving & Ready Stage"
  }

  const breakdown = getDetailedBreakdown(quizState)

  const personalizedResponse = quizState.additionalNotes.trim()
    ? getPersonalizedResponseWithGaps(quizState.additionalNotes, breakdown)
    : null

  return (
    <div className="min-h-screen p-4" style={{ background: "linear-gradient(135deg, #F8F5F2, #F0E6D2)" }}>
      <div className="max-w-4xl mx-auto">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>

        {/* Score Display */}
        <Card className="border-0 shadow-xl mb-8">
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-6" style={{ color: "#3A2412" }}>
              🎉 Your Postpartum Wellness Score
            </h1>
            <div className="mb-6">
              <div
                className="w-40 h-40 rounded-full mx-auto flex flex-col items-center justify-center mb-4 shadow-lg"
                style={{ backgroundColor: getTierColor() }}
              >
                <span className="text-6xl font-bold text-white">{score}</span>
                <span className="text-sm text-white opacity-90">/100</span>
              </div>
              <Badge className="text-lg px-6 py-2 mb-4" style={{ backgroundColor: getTierColor(), color: "white" }}>
                {getTierLabel()}
              </Badge>
            </div>

            <div className="max-w-md mx-auto mb-6">
              <div className="w-full h-3 rounded-full" style={{ backgroundColor: "#E8D5C4" }}>
                <div
                  className="h-3 rounded-full transition-all duration-500"
                  style={{ backgroundColor: getTierColor(), width: `${score}%` }}
                />
              </div>
            </div>

            <p className="text-xl font-semibold mb-4" style={{ color: "#A15C2F" }}>
              {tier === "high" &&
                "Wow! You're doing SO much right - you're in the TOP 15% of postpartum moms we assess."}
              {tier === "medium" && "You've got some solid foundations in place! You're doing some things really well."}
              {tier === "low" &&
                "You're experiencing some common challenges that are keeping you from feeling your best."}
            </p>

            <p className="text-lg leading-relaxed" style={{ color: "#3A2412" }}>
              {tier === "high" &&
                "You've built incredible foundations. With a few strategic refinements, you could be operating at peak wellness (90-100 range)."}
              {tier === "medium" &&
                "There are 3 key gaps preventing you from breakthrough results - and based on what you shared, these gaps are DIRECTLY causing your concerns."}
              {tier === "low" && "The good news? Small, strategic changes can make a HUGE difference in how you feel."}
            </p>
          </CardContent>
        </Card>

        {/* Detailed 10-Point Breakdown */}
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
            {breakdown.map((item, index) => (
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
            <div className="border-t-4 pt-4 mt-4" style={{ borderColor: "#A15C2F" }}>
              <div className="flex items-center justify-between">
                <p className="text-xl font-bold" style={{ color: "#A15C2F" }}>
                  TOTAL SCORE:
                </p>
                <p className="text-3xl font-bold" style={{ color: "#A15C2F" }}>
                  {score}/100
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {personalizedResponse && (
          <PersonalizedConcernSection concern={personalizedResponse.concern} breakdown={breakdown} />
        )}

        {tier === "high" && <HighScorerContent score={score} quizState={quizState} breakdown={breakdown} tier={tier} />}
        {tier === "medium" && (
          <MediumScorerContent score={score} quizState={quizState} breakdown={breakdown} tier={tier} />
        )}
        {tier === "low" && <LowScorerContent score={score} quizState={quizState} breakdown={breakdown} tier={tier} />}
      </div>
    </div>
  )
}

// ─── HighScorerContent ────────────────────────────────────────────────────────

function HighScorerContent({
  score,
  quizState,
  breakdown,
  tier,
}: {
  score: number
  quizState: QuizState
  breakdown: any[]
  tier: string
}) {
  const gapAreas = breakdown.filter((item) => item.score >= 6 && item.score <= 7)

  const vipTestimonials = [
    {
      quote:
        "I scored a 74 and honestly thought I was doing great. After 8 weeks of VIP coaching, I hit 96. My recovery was an absolute DREAM - back in my jeans 6 weeks postpartum. Best investment I made.",
      author: "— Postpartum Mama · Catalyst Mom Community",
    },
    {
      quote:
        "I was at 78/100 and thought 'I'm fine.' My coach showed me the small gaps that were holding me back. We fixed them in 4 weeks. I went from 'I think I'm ready' to 'I AM ready' - totally different confidence level.",
      author: "— Postpartum Mama · Catalyst Mom Community",
    },
  ]

  return (
    <>
      {/* What Your Score Means */}
      <Card className="border-0 shadow-xl mb-8">
        <CardHeader>
          <CardTitle className="text-2xl" style={{ color: "#A15C2F" }}>
            💡 What Your {score}/100 Really Means
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg leading-relaxed" style={{ color: "#3A2412" }}>
            You&apos;re already ahead of 85% of postpartum moms. Seriously - most moms would LOVE to be where you are
            right now.
          </p>
          <p className="text-lg leading-relaxed" style={{ color: "#3A2412" }}>
            But here&apos;s what high-performers like you understand:{" "}
            <strong>The difference between &ldquo;good enough&rdquo; and &ldquo;exceptional&rdquo; is in the details.</strong>
          </p>

          <div className="space-y-4 mt-6">
            <h3 className="text-xl font-bold" style={{ color: "#A15C2F" }}>
              Your Optimization Opportunities:
            </h3>

            {gapAreas.slice(0, 3).map((gap, index) => (
              <div key={index} className="p-4 bg-amber-50 rounded-lg border-l-4" style={{ borderLeftColor: "#FFB74D" }}>
                <p className="font-semibold mb-2" style={{ color: "#A15C2F" }}>
                  ⚠️ {gap.practice} ({gap.score}/10):
                </p>
                <p style={{ color: "#3A2412" }}>
                  {gap.practice.includes("Pelvic Floor")
                    ? "You're doing some work, but without the advanced protocols, you could still experience issues. The elite-level system could prevent 90% of future complications."
                    : gap.practice.includes("Core")
                      ? "You're doing well, but without advanced core protocols, you're still at 60% risk for ab separation. Elite prevention could drop that to under 10%."
                      : "You have basic foundations, but not a comprehensive strategy. With the right approach, you could optimize this area completely."}
                </p>
              </div>
            ))}
          </div>

          <div className="p-6 bg-green-50 rounded-lg border-2 border-green-400 mt-6">
            <p className="text-lg font-semibold mb-2" style={{ color: "#A15C2F" }}>
              Here&apos;s the truth:
            </p>
            <p className="text-lg" style={{ color: "#3A2412" }}>
              These aren&apos;t big problems. They&apos;re precision optimizations that take you from &ldquo;good
              recovery&rdquo; to &ldquo;dream recovery.&rdquo;
            </p>
            <p className="text-lg mt-2" style={{ color: "#3A2412" }}>
              And that&apos;s exactly what our VIP coaching is designed for - high-performers who want to dial in the
              DETAILS.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* VIP Program */}
      <Card className="border-0 shadow-xl mb-8" style={{ background: "linear-gradient(135deg, #F8F5F2, #FFF8E1)" }}>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl mb-2" style={{ color: "#A15C2F" }}>
            🏆 You Qualify for VIP Coaching
          </CardTitle>
          <p className="text-sm" style={{ color: "#3A2412", opacity: 0.8 }}>
            (Limited to 10 Clients Per Month)
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-xl font-bold mb-4" style={{ color: "#3A2412" }}>
              This program is NOT for everyone.
            </p>
          </div>

          {/* Who VIP is for */}
          <div className="p-6 bg-white rounded-lg border-2" style={{ borderColor: "#A15C2F" }}>
            <h3 className="text-xl font-bold mb-4" style={{ color: "#A15C2F" }}>
              Who VIP Coaching Is For:
            </h3>
            <div className="space-y-2">
              {[
                {
                  bold: "2 Private Coaching Calls Per Month",
                  rest: " (30-45 min each) - Deep-dive your progress, adjust your plan, troubleshoot challenges in real-time",
                },
                {
                  bold: "Custom Workout + Nutrition Plan",
                  rest: " - Not generic templates, completely personalized to your assessment results",
                },
                {
                  bold: "Direct Text Access to Your Coach",
                  rest: " - Questions answered within 24 hours, no waiting for next week's call",
                },
                {
                  bold: "Personalized Recovery Strategy Session",
                  rest: " - Core healing, pelvic floor strengthening, decision-making frameworks",
                },
                {
                  bold: "Ongoing Progress Tracking",
                  rest: " - Customized to your recovery timeline and goals",
                },
              ].map((item, i) => (
                <p key={i} className="flex items-start gap-2" style={{ color: "#3A2412" }}>
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                  <span>
                    <strong>{item.bold}</strong>
                    {item.rest}
                  </span>
                </p>
              ))}
            </div>
            <div className="mt-6 p-4 bg-white rounded-lg text-center">
              <p className="text-2xl font-bold" style={{ color: "#A15C2F" }}>
                Investment: $197/month
              </p>
              <p className="text-sm" style={{ color: "#3A2412", opacity: 0.7 }}>
                (3-6 month commitment for best results)
              </p>
            </div>
          </div>

          {/* What you get */}
          <div className="p-6 bg-amber-50 rounded-lg">
            <h3 className="text-xl font-bold mb-4" style={{ color: "#A15C2F" }}>
              What You Get as a VIP Client:
            </h3>
            <div className="space-y-3">
              {[
                {
                  bold: "2 Private Coaching Calls Per Month",
                  rest: " (30-45 min each) - Deep-dive your progress, adjust your plan, troubleshoot challenges in real-time",
                },
                {
                  bold: "Custom Workout + Nutrition Plan",
                  rest: " - Not generic templates, completely personalized to your assessment results",
                },
                {
                  bold: "Direct Text Access to Your Coach",
                  rest: " - Questions answered within 24 hours, no waiting for next week's call",
                },
                {
                  bold: "Personalized Recovery Strategy Session",
                  rest: " - Core healing, pelvic floor strengthening, decision-making frameworks",
                },
                {
                  bold: "Ongoing Progress Tracking",
                  rest: " - Customized to your recovery timeline and goals",
                },
              ].map((item, i) => (
                <p key={i} className="flex items-start gap-2" style={{ color: "#3A2412" }}>
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                  <span>
                    <strong>{item.bold}</strong>
                    {item.rest}
                  </span>
                </p>
              ))}
            </div>
            <div className="mt-6 p-4 bg-white rounded-lg text-center">
              <p className="text-2xl font-bold" style={{ color: "#A15C2F" }}>
                Investment: $197/month
              </p>
              <p className="text-sm" style={{ color: "#3A2412", opacity: 0.7 }}>
                (3-6 month commitment for best results)
              </p>
            </div>
          </div>

          {/* Social Proof Stats */}
          <div className="p-6 bg-green-50 rounded-lg border-2 border-green-400">
            <h3 className="text-xl font-bold mb-4 text-center" style={{ color: "#A15C2F" }}>
              📊 Results From VIP Clients Who Started as 70+ Scorers:
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { stat: "96/100", label: "Average final score" },
                { stat: "96%", label: 'Feel "completely confident"' },
                { stat: "8 weeks", label: 'Avg recovery to "feeling like myself"' },
                { stat: "89%", label: "Avoided complications" },
              ].map((item, i) => (
                <div key={i} className="text-center p-4 bg-white rounded-lg">
                  <p className="text-3xl font-bold" style={{ color: "#A15C2F" }}>
                    {item.stat}
                  </p>
                  <p className="text-sm" style={{ color: "#3A2412" }}>
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-sm mt-4" style={{ color: "#3A2412", opacity: 0.7 }}>
              Feel more connected to your core in just 7 days. Cancel anytime. No contracts.
            </p>
          </div>

          {/* Testimonials */}
          <TestimonialsSection
            testimonials={vipTestimonials}
            title="💬 What VIP Clients Say:"
          />

          {/* C-section Safety Disclaimer */}
          {(quizState.additionalNotes?.toLowerCase().includes("c-section") ||
            quizState.additionalNotes?.toLowerCase().includes("c section") ||
            quizState.additionalNotes?.toLowerCase().includes("cesarean") ||
            quizState.additionalNotes?.toLowerCase().includes("surgery")) && (
            <div
              className="p-5 rounded-lg border-l-4"
              style={{ backgroundColor: "#FFF8E1", borderLeftColor: "#F59E0B" }}
            >
              <p className="font-bold mb-2" style={{ color: "#92400E" }}>
                C-Section Recovery Note
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "#3A2412" }}>
                Based on your mention of a C-section, please ensure your incision is fully healed externally and your
                doctor has cleared you for light core engagement before beginning diaphragmatic breathing or bird-dog
                movements.
              </p>
            </div>
          )}

          {/* No Time Objection */}
          {(quizState.biggestObstacle === "no-time" ||
            quizState.biggestObstacle?.toLowerCase().includes("time") ||
            quizState.biggestObstacle?.toLowerCase().includes("busy")) && (
            <div
              className="p-5 rounded-lg border-l-4"
              style={{ backgroundColor: "#F0FDF4", borderLeftColor: "#22C55E" }}
            >
              <p className="font-bold mb-2" style={{ color: "#166534" }}>
                Built for Busy Mamas
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "#3A2412" }}>
                This protocol requires only <strong>15 minutes per day</strong> and zero equipment. No hour-long gym
                sessions — just focused, effective movements you can do while baby naps or plays nearby.
              </p>
            </div>
          )}

          {/* CTA */}
          <PricingSection quizState={quizState} score={score} tier={tier} />
        </CardContent>
      </Card>
    </>
  )
}

// ─── MediumScorerContent ──────────────────────────────────────────────────────

function MediumScorerContent({
  score,
  quizState,
  breakdown,
  tier,
}: {
  score: number
  quizState: QuizState
  breakdown: any[]
  tier: string
}) {
  const gapAreas = breakdown.filter((item) => item.score <= 7).slice(0, 3)

  const mediumTestimonials1 = [
    {
      quote:
        "I couldn't sneeze without leaking and my belly still looked 5 months pregnant. Three weeks into this program my core finally feels like mine again. I actually cried during my check-in. Do not sleep on this.",
      author: "— Postpartum Mama · Catalyst Mom Community",
    },
    {
      quote:
        "not me getting emotional over being able to carry my toddler upstairs without my back hurting. this mama is STRONG now! best investment ever fr",
      author: "— Postpartum Mama · Catalyst Mom Community",
    },
  ]

  const mediumTestimonials2 = [
    {
      quote:
        "I scored 32/100 and felt hopeless. After 12 weeks in the app, I hit 78. My energy is back, my core is healing, and I finally feel like myself again.",
      author: "— Postpartum Mama · Catalyst Mom Community",
    },
    {
      quote:
        "I was doing everything wrong - crunches, skipping meals, no pelvic floor work. The app taught me the RIGHT way. My diastasis recti is almost healed!",
      author: "— Postpartum Mama · Catalyst Mom Community",
    },
  ]

  const csectionNote = quizState.additionalNotes?.toLowerCase().includes("c-section") ||
    quizState.additionalNotes?.toLowerCase().includes("c section") ||
    quizState.additionalNotes?.toLowerCase().includes("cesarean") ||
    quizState.additionalNotes?.toLowerCase().includes("surgery")

  const noTimeNote =
    quizState.biggestObstacle === "no-time" ||
    quizState.biggestObstacle?.toLowerCase().includes("time") ||
    quizState.biggestObstacle?.toLowerCase().includes("busy")

  return (
    <>
      {/* What Your Score Means */}
      <Card className="border-0 shadow-xl mb-8">
        <CardHeader>
          <CardTitle className="text-2xl" style={{ color: "#A15C2F" }}>
            💡 What Your {score}/100 Really Means
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg leading-relaxed" style={{ color: "#3A2412" }}>
            {quizState.name}, you&apos;re doing a lot right! You&apos;re ahead of 60% of postpartum moms.
          </p>
          <p className="text-lg leading-relaxed font-semibold" style={{ color: "#A15C2F" }}>
            But you have <strong>3 key gaps</strong> that are holding you back from breakthrough results - and based on
            what you shared, these gaps are DIRECTLY causing your concerns.
          </p>

          <div className="space-y-4 mt-6">
            <h3 className="text-xl font-bold" style={{ color: "#A15C2F" }}>
              🎯 Your 3 Priority Areas
            </h3>

            {gapAreas.map((gap, index) => (
              <div key={index} className="p-6 bg-amber-50 rounded-lg border-l-4" style={{ borderLeftColor: "#FFB74D" }}>
                <p className="font-semibold text-xl mb-3" style={{ color: "#A15C2F" }}>
                  {index + 1}. {gap.practice} ({gap.score}/10) -{" "}
                  {gap.score === 0 ? "Most Critical" : "Needs Attention"}
                </p>

                {gap.practice.includes("Nutrition") && (
                  <div className="space-y-3" style={{ color: "#3A2412" }}>
                    <p>Right now, you&apos;re not tracking macros, meal timing, or nutrient density. This impacts:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Baby&apos;s development (neural tube, bone growth, brain development)</li>
                      <li>YOUR energy (proper timing doubles energy in 7 days)</li>
                      <li>Back pain and inflammation (anti-inflammatory nutrition reduces pain 40%)</li>
                      <li>Recovery speed postpartum (nutrition NOW determines healing LATER)</li>
                    </ul>
                    <p className="font-semibold mt-3" style={{ color: "#A15C2F" }}>
                      Inside the app: Trimester-specific meal plans, macro calculators, grocery lists,
                      anti-inflammatory recipes, energy optimization protocols.
                    </p>
                  </div>
                )}

                {gap.practice.includes("Core") && (
                  <div className="space-y-3" style={{ color: "#3A2412" }}>
                    <p>
                      You&apos;re either not exercising, or doing unsafe movements. Either way, your body isn&apos;t
                      prepared for:
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Daily postpartum demands (carrying baby, lifting, bending)</li>
                      <li>Diastasis recti healing (wrong exercises make it WORSE)</li>
                      <li>Back pain prevention (weak core = compensating muscles = pain)</li>
                      <li>Long-term core strength and function</li>
                    </ul>
                    <p className="font-semibold mt-3" style={{ color: "#A15C2F" }}>
                      Inside the app: Core-safe workouts (15-20 min/day), postpartum modifications, diastasis recti
                      healing protocols, proper movement patterns.
                    </p>
                  </div>
                )}

                {gap.practice.includes("Pelvic Floor") && (
                  <div className="space-y-3" style={{ color: "#3A2412" }}>
                    <p>
                      You&apos;re doing some Kegels, but not a complete strengthening protocol. Here&apos;s why this
                      matters:
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>85% of severe tearing happens with weak pelvic floor</li>
                      <li>Proper training reduces tearing risk by 85%</li>
                      <li>Also prevents prolapse, incontinence, painful sex postpartum</li>
                      <li>Supports core healing and overall recovery</li>
                    </ul>
                    <p className="font-semibold mt-3" style={{ color: "#A15C2F" }}>
                      Inside the app: 12-week pelvic floor protocol, daily exercises (5 min), progress tracking, birth
                      prep positioning, perineal massage guide.
                    </p>
                  </div>
                )}

                {gap.practice.includes("Protein") && (
                  <div className="space-y-3" style={{ color: "#3A2412" }}>
                    <p>
                      You&apos;re probably eating under 50g/day. Postpartum moms need 80g+ for recovery and milk
                      production.
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Constant exhaustion (protein = energy)</li>
                      <li>Muscle loss (your body cannibalizes muscle for fuel)</li>
                      <li>Slow wound healing (C-section, tearing, etc.)</li>
                      <li>Low milk supply (if breastfeeding)</li>
                    </ul>
                    <p className="font-semibold mt-3" style={{ color: "#A15C2F" }}>
                      Inside the app: Protein-rich meal plans, quick protein snack ideas, macro tracking, recipes that
                      hit 80g+ easily.
                    </p>
                  </div>
                )}

                {gap.practice.includes("Medical") && (
                  <div className="space-y-3" style={{ color: "#3A2412" }}>
                    <p>You haven&apos;t been medically cleared for exercise yet. This is critical for safety:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Your uterus needs time to shrink back to normal size</li>
                      <li>Internal healing takes 6+ weeks minimum</li>
                      <li>Exercising too soon can cause complications</li>
                      <li>Medical clearance ensures you&apos;re ready to start safely</li>
                    </ul>
                    <p className="font-semibold mt-3" style={{ color: "#A15C2F" }}>
                      Inside the app: Pre-clearance gentle movement guide, 6-week healing protocols, when-to-start
                      guidelines, safe progression timelines.
                    </p>
                  </div>
                )}

                {!gap.practice.includes("Nutrition") &&
                  !gap.practice.includes("Core") &&
                  !gap.practice.includes("Pelvic Floor") &&
                  !gap.practice.includes("Protein") &&
                  !gap.practice.includes("Medical") && (
                    <div className="space-y-3" style={{ color: "#3A2412" }}>
                      <p>
                        This area needs attention to prevent future complications and accelerate your recovery. Without
                        addressing this gap:
                      </p>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Recovery takes longer than necessary</li>
                        <li>You&apos;re at higher risk for complications</li>
                        <li>Energy and wellness suffer</li>
                        <li>Long-term health may be impacted</li>
                      </ul>
                      <p className="font-semibold mt-3" style={{ color: "#A15C2F" }}>
                        Inside the app: Comprehensive protocols, expert guidance, progress tracking, and personalized
                        support for this area.
                      </p>
                    </div>
                  )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Close ALL Your Gaps */}
      <Card className="border-0 shadow-xl mb-8" style={{ background: "linear-gradient(135deg, #F8F5F2, #FFF8E1)" }}>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl mb-2" style={{ color: "#A15C2F" }}>
            🚀 Close ALL Your Gaps: Join the Catalyst Mom App
          </CardTitle>
          <p className="text-lg" style={{ color: "#3A2412" }}>
            You&apos;re at {score}/100 - imagine hitting 85-90+ in the next 6 weeks.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-6 bg-white rounded-lg border-2" style={{ borderColor: "#A15C2F" }}>
            <h3 className="text-xl font-bold mb-4" style={{ color: "#A15C2F" }}>
              Inside the app, you&apos;ll get:
            </h3>
            <div className="space-y-3">
              {[
                {
                  bold: "Complete Postpartum Recovery Tracker",
                  rest: " - Closes your medical clearance and tracking gaps",
                },
                {
                  bold: "Core-Safe Workout Programs",
                  rest: " - Closes your exercise gap with 15-20 min daily routines",
                },
                {
                  bold: "Postpartum Nutrition Plans",
                  rest: " - Closes your nutrition gap with meal plans and macro tracking",
                },
                {
                  bold: "12-Week Pelvic Floor Protocol",
                  rest: " - Reduces tearing risk by 85%, prevents prolapse",
                },
                {
                  bold: "Diastasis Recti Healing System",
                  rest: " - Safe core exercises that heal your \"mom pooch\"",
                },
                {
                  bold: "Community of 2,000+ mamas supported",
                  rest: " - Support, shared experiences, accountability",
                },
                {
                  bold: "Weekly Group Coaching Calls",
                  rest: " - Ask questions, get expert guidance, troubleshoot challenges",
                },
              ].map((item, i) => (
                <p key={i} className="flex items-start gap-2" style={{ color: "#3A2412" }}>
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                  <span>
                    <strong>{item.bold}</strong>
                    {item.rest}
                  </span>
                </p>
              ))}
            </div>

            {quizState.additionalNotes.trim() && (
              <div className="mt-6 p-4 bg-amber-50 rounded-lg">
                <p className="font-semibold mb-2" style={{ color: "#A15C2F" }}>
                  Plus: Addresses your specific concern
                </p>
                <p style={{ color: "#3A2412" }}>
                  {quizState.additionalNotes.toLowerCase().includes("tear")
                    ? "Birth prep protocols, pelvic floor training, and pain management techniques to eliminate your tearing fears."
                    : quizState.additionalNotes.toLowerCase().includes("pain")
                      ? "Pain management protocols, safe movement patterns, and core healing techniques."
                      : quizState.additionalNotes.toLowerCase().includes("energy") ||
                          quizState.additionalNotes.toLowerCase().includes("tired")
                        ? "Energy optimization protocols, nutrition strategies, and recovery techniques that double energy in 7 days."
                        : "Personalized protocols and expert guidance for your specific situation."}
                </p>
              </div>
            )}

            {csectionNote && (
              <div
                className="mt-6 p-5 rounded-lg border-l-4"
                style={{ backgroundColor: "#FFF8E1", borderLeftColor: "#F59E0B" }}
              >
                <p className="font-bold mb-2" style={{ color: "#92400E" }}>
                  C-Section Recovery Note
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "#3A2412" }}>
                  Based on your mention of a C-section, please ensure your incision is fully healed externally and your
                  doctor has cleared you for light core engagement before beginning diaphragmatic breathing or bird-dog
                  movements.
                </p>
              </div>
            )}

            {noTimeNote && (
              <div
                className="mt-6 p-5 rounded-lg border-l-4"
                style={{ backgroundColor: "#F0FDF4", borderLeftColor: "#22C55E" }}
              >
                <p className="font-bold mb-2" style={{ color: "#166534" }}>
                  Built for Busy Mamas
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "#3A2412" }}>
                  This protocol requires only <strong>15 minutes per day</strong> and zero equipment. No hour-long gym
                  sessions — just focused, effective movements you can do while baby naps or plays nearby.
                </p>
              </div>
            )}

            <div className="mt-6 text-center p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg">
              <p className="text-3xl font-bold mb-2" style={{ color: "#A15C2F" }}>
                $29/month
              </p>
              <p className="text-sm" style={{ color: "#3A2412", opacity: 0.7 }}>
                Less than the cost of a single specialist consultation. Cancel anytime. No contracts.
              </p>
              <p className="text-xs mt-2 font-medium" style={{ color: "#A15C2F" }}>
                Protocol requires only 15 mins/day
              </p>
            </div>
          </div>

          <TestimonialsSection
            testimonials={mediumTestimonials1}
            title="💬 What Moms Who Started Where You Are Say:"
          />

          <PricingSection quizState={quizState} score={score} tier={tier} />
        </CardContent>
      </Card>

      {/* Let's Build Your Foundation */}
      <Card className="border-0 shadow-xl mb-8" style={{ background: "linear-gradient(135deg, #F8F5F2, #FFF8E1)" }}>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl mb-2" style={{ color: "#A15C2F" }}>
            🚀 Let&apos;s Build Your Foundation Together
          </CardTitle>
          <p className="text-lg" style={{ color: "#3A2412" }}>
            Join the Catalyst Mom App and start closing these gaps TODAY.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-6 bg-white rounded-lg border-2" style={{ borderColor: "#A15C2F" }}>
            <h3 className="text-xl font-bold mb-4" style={{ color: "#A15C2F" }}>
              What You Get for $29/month:
            </h3>
            <div className="space-y-3">
              {[
                {
                  bold: "Step-by-Step Postpartum Recovery Roadmap",
                  rest: " - No guessing, just follow the plan",
                },
                {
                  bold: "Core-Safe Workouts (10-20 min)",
                  rest: " - Safe for diastasis recti, C-sections, and beginners",
                },
                {
                  bold: "Simple Meal Plans",
                  rest: " - No complicated recipes, just easy nutrition that works",
                },
                {
                  bold: "Pelvic Floor Healing Protocol",
                  rest: " - Prevent incontinence, prolapse, and painful sex",
                },
                {
                  bold: "Diastasis Recti Recovery System",
                  rest: " - Heal your \"mom pooch\" safely and effectively",
                },
                {
                  bold: "Community Support",
                  rest: " - 2,000+ mamas who understand what you're going through",
                },
                { bold: "1-on-1 Human Check-ins", rest: " — Bi-weekly expert progress reviews" },
                { bold: "24/7 Catalyst AI Expert", rest: " — Instant answers to any wellness question" },
              ].map((item, i) => (
                <p key={i} className="flex items-start gap-2" style={{ color: "#3A2412" }}>
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                  <span>
                    <strong>{item.bold}</strong>
                    {item.rest}
                  </span>
                </p>
              ))}
            </div>

            {csectionNote && (
              <div
                className="mt-6 p-5 rounded-lg border-l-4"
                style={{ backgroundColor: "#FFF8E1", borderLeftColor: "#F59E0B" }}
              >
                <p className="font-bold mb-2" style={{ color: "#92400E" }}>
                  C-Section Recovery Note
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "#3A2412" }}>
                  Based on your mention of a C-section, please ensure your incision is fully healed externally and your
                  doctor has cleared you for light core engagement before beginning diaphragmatic breathing or bird-dog
                  movements.
                </p>
              </div>
            )}

            {noTimeNote && (
              <div
                className="mt-6 p-5 rounded-lg border-l-4"
                style={{ backgroundColor: "#F0FDF4", borderLeftColor: "#22C55E" }}
              >
                <p className="font-bold mb-2" style={{ color: "#166534" }}>
                  Built for Busy Mamas
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "#3A2412" }}>
                  This protocol requires only <strong>15 minutes per day</strong> and zero equipment. No hour-long gym
                  sessions — just focused, effective movements you can do while baby naps or plays nearby.
                </p>
              </div>
            )}

            <div className="mt-6 text-center p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg">
              <p className="text-3xl font-bold mb-2" style={{ color: "#A15C2F" }}>
                $29/month
              </p>
              <p className="text-sm" style={{ color: "#3A2412", opacity: 0.7 }}>
                Less than the cost of a single specialist consultation. Cancel anytime. No contracts.
              </p>
              <p className="text-xs mt-2 font-medium" style={{ color: "#A15C2F" }}>
                Protocol requires only 15 mins/day
              </p>
            </div>
          </div>

          <TestimonialsSection
            testimonials={mediumTestimonials2}
            title="What Moms Who Started Where You Are Say:"
          />

          <PricingSection quizState={quizState} score={score} tier={tier} />
        </CardContent>
      </Card>
    </>
  )
}

// ─── LowScorerContent ─────────────────────────────────────────────────────────

function LowScorerContent({
  score,
  quizState,
  breakdown,
  tier,
}: {
  score: number
  quizState: QuizState
  breakdown: any[]
  tier: string
}) {
  const gapAreas = breakdown.filter((item) => item.score <= 5)

  const lowTestimonials = [
    {
      quote:
        "I scored 22/100 and felt completely hopeless. I didn't even know where to start. After 6 weeks in the app I finally feel human again. My energy is back and I stopped leaking. I actually cried happy tears.",
      author: "— Postpartum Mama · Catalyst Mom Community",
    },
    {
      quote:
        "I was doing EVERYTHING wrong - no pelvic floor work, skipping meals, trying to do crunches. The app gave me a real starting point. 8 weeks later and I feel like a different person.",
      author: "— Postpartum Mama · Catalyst Mom Community",
    },
  ]

  const csectionNote =
    quizState.additionalNotes?.toLowerCase().includes("c-section") ||
    quizState.additionalNotes?.toLowerCase().includes("c section") ||
    quizState.additionalNotes?.toLowerCase().includes("cesarean") ||
    quizState.additionalNotes?.toLowerCase().includes("surgery")

  const noTimeNote =
    quizState.biggestObstacle === "no-time" ||
    quizState.biggestObstacle?.toLowerCase().includes("time") ||
    quizState.biggestObstacle?.toLowerCase().includes("busy")

  return (
    <>
      {/* What Your Score Means */}
      <Card className="border-0 shadow-xl mb-8">
        <CardHeader>
          <CardTitle className="text-2xl" style={{ color: "#A15C2F" }}>
            💡 What Your {score}/100 Really Means
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg leading-relaxed" style={{ color: "#3A2412" }}>
            {quizState.name}, you&apos;re in the Early Foundations Stage — and that&apos;s okay. Most moms who come to
            us start exactly where you are.
          </p>
          <p className="text-lg leading-relaxed" style={{ color: "#3A2412" }}>
            The truth is: <strong>you&apos;re not failing. You&apos;re just missing the foundations.</strong> And
            foundations are the easiest thing to build — once you know what they are.
          </p>

          <div className="p-6 bg-red-50 rounded-lg border-l-4 border-red-400">
            <p className="text-lg font-semibold mb-2" style={{ color: "#A15C2F" }}>
              Here&apos;s what&apos;s happening:
            </p>
            <p style={{ color: "#3A2412" }}>
              Without the right foundations — medical clearance, pelvic floor work, core-safe movement, proper
              nutrition, and rest protocols — your body literally cannot recover the way it&apos;s designed to.
              It&apos;s not a willpower problem. It&apos;s a systems problem.
            </p>
          </div>

          <div className="space-y-4 mt-6">
            <h3 className="text-xl font-bold" style={{ color: "#A15C2F" }}>
              🎯 Your Most Critical Gaps Right Now:
            </h3>

            {gapAreas.slice(0, 4).map((gap, index) => (
              <div key={index} className="p-4 bg-red-50 rounded-lg border-l-4 border-red-400">
                <p className="font-semibold mb-2" style={{ color: "#A15C2F" }}>
                  ⚠️ {gap.practice} ({gap.score}/10)
                </p>
                <p style={{ color: "#3A2412" }}>
                  {gap.practice.includes("Medical")
                    ? "Starting without medical clearance can lead to serious setbacks. This is step one."
                    : gap.practice.includes("Pelvic Floor")
                      ? "Your pelvic floor is the foundation of everything. Without it, nothing else works properly."
                      : gap.practice.includes("Core")
                        ? "Doing the wrong core exercises (crunches, planks) is making your recovery worse, not better."
                        : gap.practice.includes("Nutrition")
                          ? "Your body can't heal without proper fuel. You're running on empty."
                          : gap.practice.includes("Rest")
                            ? "Rest is when your body actually heals. Skipping it extends recovery by weeks."
                            : "This gap is holding back your full recovery. It's fixable with the right approach."}
                </p>
              </div>
            ))}
          </div>

          <div className="p-6 bg-green-50 rounded-lg border-2 border-green-400 mt-6">
            <p className="text-lg font-semibold mb-2" style={{ color: "#A15C2F" }}>
              The good news:
            </p>
            <p className="text-lg" style={{ color: "#3A2412" }}>
              Every single gap you have is <strong>100% fixable</strong>. Moms who start at your score and follow the
              right system typically go from {score} to 65+ in just 8-10 weeks.
            </p>
            <p className="text-lg mt-2" style={{ color: "#3A2412" }}>
              Small, strategic changes. Big results. That&apos;s what the app is built for.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Build Your Foundation CTA */}
      <Card className="border-0 shadow-xl mb-8" style={{ background: "linear-gradient(135deg, #F8F5F2, #FFF8E1)" }}>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl mb-2" style={{ color: "#A15C2F" }}>
            🚀 Let&apos;s Build Your Foundation — Starting Today
          </CardTitle>
          <p className="text-lg" style={{ color: "#3A2412" }}>
            The Catalyst Mom App was designed exactly for moms at your stage.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-6 bg-white rounded-lg border-2" style={{ borderColor: "#A15C2F" }}>
            <h3 className="text-xl font-bold mb-4" style={{ color: "#A15C2F" }}>
              What You Get for $29/month:
            </h3>
            <div className="space-y-3">
              {[
                {
                  bold: "Step-by-Step Postpartum Recovery Roadmap",
                  rest: " - No guessing. Just follow the plan, day by day.",
                },
                {
                  bold: "Core-Safe Workouts (10-20 min)",
                  rest: " - Designed for beginners, diastasis recti, and C-section moms.",
                },
                {
                  bold: "Pelvic Floor Healing Protocol",
                  rest: " - The foundation of your entire recovery. Starts week one.",
                },
                {
                  bold: "Postpartum Nutrition Plans",
                  rest: " - Simple, fast, no cooking skills required. Hit your macros easily.",
                },
                {
                  bold: "Rest Optimization Strategies",
                  rest: " - Maximize every nap. Recover faster even on broken sleep.",
                },
                {
                  bold: "Diastasis Recti Recovery System",
                  rest: " - Heal your core safely. No crunches, no planks — just what works.",
                },
                {
                  bold: "Community of 2,000+ mamas",
                  rest: " - You are not alone. They started where you are.",
                },
                { bold: "1-on-1 Human Check-ins", rest: " — Bi-weekly expert progress reviews." },
                { bold: "24/7 Catalyst AI Expert", rest: " — Instant answers to any wellness question." },
              ].map((item, i) => (
                <p key={i} className="flex items-start gap-2" style={{ color: "#3A2412" }}>
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                  <span>
                    <strong>{item.bold}</strong>
                    {item.rest}
                  </span>
                </p>
              ))}
            </div>

            {csectionNote && (
              <div
                className="mt-6 p-5 rounded-lg border-l-4"
                style={{ backgroundColor: "#FFF8E1", borderLeftColor: "#F59E0B" }}
              >
                <p className="font-bold mb-2" style={{ color: "#92400E" }}>
                  C-Section Recovery Note
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "#3A2412" }}>
                  Based on your mention of a C-section, please ensure your incision is fully healed externally and your
                  doctor has cleared you for light core engagement before beginning diaphragmatic breathing or bird-dog
                  movements.
                </p>
              </div>
            )}

            {noTimeNote && (
              <div
                className="mt-6 p-5 rounded-lg border-l-4"
                style={{ backgroundColor: "#F0FDF4", borderLeftColor: "#22C55E" }}
              >
                <p className="font-bold mb-2" style={{ color: "#166534" }}>
                  Built for Busy Mamas
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "#3A2412" }}>
                  This protocol requires only <strong>15 minutes per day</strong> and zero equipment. No hour-long gym
                  sessions — just focused, effective movements you can do while baby naps or plays nearby.
                </p>
              </div>
            )}

            <div className="mt-6 text-center p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg">
              <p className="text-3xl font-bold mb-2" style={{ color: "#A15C2F" }}>
                $29/month
              </p>
              <p className="text-sm" style={{ color: "#3A2412", opacity: 0.7 }}>
                Less than a single specialist visit. Cancel anytime. No contracts.
              </p>
              <p className="text-xs mt-2 font-medium" style={{ color: "#A15C2F" }}>
                Protocol requires only 15 mins/day
              </p>
            </div>
          </div>

          {/* Social Proof Stats */}
          <div className="p-6 bg-green-50 rounded-lg border-2 border-green-400">
            <h3 className="text-xl font-bold mb-4 text-center" style={{ color: "#A15C2F" }}>
              📊 Results From Moms Who Started at Your Score:
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { stat: "8–10 wks", label: "Avg time to feel like themselves again" },
                { stat: "65+", label: "Average score after 10 weeks" },
                { stat: "91%", label: "Report significant energy improvement" },
                { stat: "87%", label: "Stopped or reduced leaking in 6 weeks" },
              ].map((item, i) => (
                <div key={i} className="text-center p-4 bg-white rounded-lg">
                  <p className="text-3xl font-bold" style={{ color: "#A15C2F" }}>
                    {item.stat}
                  </p>
                  <p className="text-sm" style={{ color: "#3A2412" }}>
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <TestimonialsSection
            testimonials={lowTestimonials}
            title="💬 What Moms Who Started Where You Are Say:"
          />

          <PricingSection quizState={quizState} score={score} tier={tier} />
        </CardContent>
      </Card>
    </>
  )
}
