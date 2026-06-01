"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { trackQuizEvents } from "@/lib/analytics"
import { addContactToOmnisend } from "@/lib/omnisend"

// ─── Types ────────────────────────────────────────────────────────────────────

interface QuizState {
  name: string
  email: string
  weeksPostpartum: string
  medicalClearance: string
  diastasisRecti: string
  pelvicFloor: string
  nutritionProtein: string
  sleep: string
  stress: string
  exercise: string
  primaryGoal: string
  biggestObstacle: string
  supportType: string
  additionalNotes: string
}

interface BreakdownItem {
  practice: string
  score: number
  maxScore: number
  status: "excellent" | "good" | "needs-work"
}

// ─── Constants ────────────────────────────────────────────────────────────────

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

const supabase = createClient()

const initialQuizState: QuizState = {
  name: "", email: "", weeksPostpartum: "", medicalClearance: "",
  diastasisRecti: "", pelvicFloor: "", nutritionProtein: "",
  sleep: "", stress: "", exercise: "", primaryGoal: "",
  biggestObstacle: "", supportType: "", additionalNotes: "",
}

function getDetailedBreakdown(qs: QuizState): BreakdownItem[] {
  const items: BreakdownItem[] = [
    {
      practice: "Medical Clearance",
      score: qs.medicalClearance === "yes" ? 10 : qs.medicalClearance === "scheduled" ? 5 : 0,
      maxScore: 10,
      status: qs.medicalClearance === "yes" ? "excellent" : qs.medicalClearance === "scheduled" ? "good" : "needs-work",
    },
    {
      practice: "Core / Diastasis Awareness",
      score: qs.diastasisRecti === "no" ? 10 : qs.diastasisRecti === "mild" ? 7 : qs.diastasisRecti === "yes" ? 3 : 5,
      maxScore: 10,
      status: qs.diastasisRecti === "no" ? "excellent" : qs.diastasisRecti === "mild" ? "good" : "needs-work",
    },
    {
      practice: "Pelvic Floor Health",
      score: qs.pelvicFloor === "great" ? 10 : qs.pelvicFloor === "some-issues" ? 5 : qs.pelvicFloor === "significant-issues" ? 2 : 3,
      maxScore: 10,
      status: qs.pelvicFloor === "great" ? "excellent" : qs.pelvicFloor === "some-issues" ? "good" : "needs-work",
    },
    {
      practice: "Protein / Nutrition",
      score: qs.nutritionProtein === "yes" ? 10 : qs.nutritionProtein === "sometimes" ? 6 : 2,
      maxScore: 10,
      status: qs.nutritionProtein === "yes" ? "excellent" : qs.nutritionProtein === "sometimes" ? "good" : "needs-work",
    },
    {
      practice: "Sleep Quality",
      score: qs.sleep === "good" ? 10 : qs.sleep === "broken" ? 5 : 2,
      maxScore: 10,
      status: qs.sleep === "good" ? "excellent" : qs.sleep === "broken" ? "good" : "needs-work",
    },
    {
      practice: "Stress Management",
      score: qs.stress === "low" ? 10 : qs.stress === "moderate" ? 6 : 2,
      maxScore: 10,
      status: qs.stress === "low" ? "excellent" : qs.stress === "moderate" ? "good" : "needs-work",
    },
    {
      practice: "Exercise / Movement",
      score: qs.exercise === "regular" ? 10 : qs.exercise === "occasional" ? 6 : qs.exercise === "not-yet" ? 4 : 2,
      maxScore: 10,
      status: qs.exercise === "regular" ? "excellent" : qs.exercise === "occasional" ? "good" : "needs-work",
    },
  ]
  return items
}

const questions = [
  {
    id: "name",
    field: "name",
    type: "text",
    title: "What's your name?",
    subtitle: "So we can personalize your results",
    placeholder: "Your first name",
  },
  {
    id: "email",
    field: "email",
    type: "email",
    title: "What's your email address?",
    subtitle: "We'll send your personalized postpartum plan here",
    placeholder: "your@email.com",
  },
  {
    id: "weeksPostpartum",
    field: "weeksPostpartum",
    type: "radio",
    title: "How far postpartum are you?",
    subtitle: "This helps us tailor your recovery plan",
    options: [
      { value: "0-6", label: "0–6 weeks (early recovery)" },
      { value: "6-12", label: "6–12 weeks (cleared for more activity)" },
      { value: "3-6months", label: "3–6 months (rebuilding phase)" },
      { value: "6plus", label: "6+ months (optimizing phase)" },
    ],
  },
  {
    id: "medicalClearance",
    field: "medicalClearance",
    type: "radio",
    title: "Have you received postpartum medical clearance?",
    subtitle: "Usually given at your 6-week checkup",
    options: [
      { value: "yes", label: "Yes, I've been cleared" },
      { value: "scheduled", label: "I have an appointment scheduled" },
      { value: "no", label: "Not yet / haven't gone" },
    ],
  },
  {
    id: "diastasisRecti",
    field: "diastasisRecti",
    type: "radio",
    title: "Do you have diastasis recti (abdominal separation)?",
    subtitle: "Very common after pregnancy — affects 60%+ of moms",
    options: [
      { value: "no", label: "No / resolved" },
      { value: "mild", label: "Mild (1–2 finger width)" },
      { value: "yes", label: "Yes / significant separation" },
      { value: "dont-know", label: "I'm not sure" },
    ],
  },
  {
    id: "pelvicFloor",
    field: "pelvicFloor",
    type: "radio",
    title: "How is your pelvic floor doing?",
    subtitle: "Leaking, prolapse, pain, or pressure count as issues",
    options: [
      { value: "great", label: "Great — no issues" },
      { value: "some-issues", label: "Some minor issues (occasional leaking, etc.)" },
      { value: "significant-issues", label: "Significant issues (pain, prolapse, heavy leaking)" },
      { value: "dont-know", label: "I'm not sure" },
    ],
  },
  {
    id: "nutritionProtein",
    field: "nutritionProtein",
    type: "radio",
    title: "Are you consistently hitting your protein goals?",
    subtitle: "Protein is critical for postpartum healing and energy",
    options: [
      { value: "yes", label: "Yes — 100g+ daily" },
      { value: "sometimes", label: "Sometimes — it varies a lot" },
      { value: "no", label: "No — I struggle to eat enough" },
    ],
  },
  {
    id: "sleep",
    field: "sleep",
    type: "radio",
    title: "How is your sleep?",
    subtitle: "Be honest — new mom life is hard!",
    options: [
      { value: "good", label: "Pretty good — getting decent stretches" },
      { value: "broken", label: "Broken but manageable" },
      { value: "exhausted", label: "Severely sleep deprived" },
    ],
  },
  {
    id: "stress",
    field: "stress",
    type: "radio",
    title: "What's your stress level right now?",
    subtitle: "Chronic stress significantly slows postpartum recovery",
    options: [
      { value: "low", label: "Low — feeling mostly calm" },
      { value: "moderate", label: "Moderate — some anxiety / overwhelm" },
      { value: "high", label: "High — really struggling" },
    ],
  },
  {
    id: "exercise",
    field: "exercise",
    type: "radio",
    title: "Are you exercising or moving your body?",
    subtitle: "Walking counts! What does your routine look like?",
    options: [
      { value: "regular", label: "Yes — regular workouts or walks" },
      { value: "occasional", label: "Occasionally — trying to get back to it" },
      { value: "not-yet", label: "Not yet — waiting for clearance" },
      { value: "no", label: "No — too exhausted / unsure what's safe" },
    ],
  },
  {
    id: "primaryGoal",
    field: "primaryGoal",
    type: "radio",
    title: "What's your #1 postpartum goal?",
    subtitle: "Focus on what matters most to you right now",
    options: [
      { value: "core-strength", label: "Rebuild core strength & close diastasis" },
      { value: "lose-weight", label: "Lose baby weight safely" },
      { value: "energy", label: "Get my energy back" },
      { value: "feel-like-myself", label: "Feel like myself again (mentally + physically)" },
    ],
  },
  {
    id: "biggestObstacle",
    field: "biggestObstacle",
    type: "radio",
    title: "What's your biggest obstacle right now?",
    subtitle: "What's getting in the way of feeling your best?",
    options: [
      { value: "no-time", label: "No time — baby takes everything" },
      { value: "dont-know-what-safe", label: "Don't know what's safe to do" },
      { value: "motivation", label: "Low motivation / energy" },
      { value: "support", label: "Lack of support or accountability" },
    ],
  },
  {
    id: "additionalNotes",
    field: "additionalNotes",
    type: "textarea",
    title: "Anything else you'd like us to know?",
    subtitle: "Birth complications, C-section, specific concerns — share anything relevant (optional)",
    placeholder: "e.g. I had a C-section, I'm breastfeeding, I have SPD...",
  },
]

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PostpartumAssessmentPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [quizState, setQuizState] = useState<QuizState>(initialQuizState)
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [scoreTier, setScoreTier] = useState<"low" | "medium" | "high">("low")
  const [isLoading, setIsLoading] = useState(false)

  const calculateScore = () => {
    let s = 0
    if (quizState.medicalClearance === "yes") s += 10
    else if (quizState.medicalClearance === "scheduled") s += 5
    if (quizState.diastasisRecti === "no") s += 10
    else if (quizState.diastasisRecti === "mild") s += 7
    else if (quizState.diastasisRecti === "dont-know") s += 3
    else if (quizState.diastasisRecti === "yes") s += 3
    if (quizState.pelvicFloor === "great") s += 10
    else if (quizState.pelvicFloor === "some-issues") s += 5
    else if (quizState.pelvicFloor === "dont-know") s += 3
    else if (quizState.pelvicFloor === "significant-issues") s += 2
    if (quizState.nutritionProtein === "yes") s += 10
    else if (quizState.nutritionProtein === "sometimes") s += 6
    else if (quizState.nutritionProtein === "no") s += 2
    if (quizState.sleep === "good") s += 10
    else if (quizState.sleep === "broken") s += 5
    else if (quizState.sleep === "exhausted") s += 2
    if (quizState.stress === "low") s += 10
    else if (quizState.stress === "moderate") s += 6
    else if (quizState.stress === "high") s += 2
    if (quizState.exercise === "regular") s += 10
    else if (quizState.exercise === "occasional") s += 6
    else if (quizState.exercise === "not-yet") s += 4
    else if (quizState.exercise === "no") s += 2
    return s
  }

  const getTier = (s: number): "low" | "medium" | "high" =>
    s <= 40 ? "low" : s <= 55 ? "medium" : "high"

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

      const customProperties = {
        assessment_type: "Postpartum",
        score: calculatedScore,
        score_tier: tier,
        weeks_postpartum: quizState.weeksPostpartum,
        primary_goal: quizState.primaryGoal,
        biggest_obstacle: quizState.biggestObstacle,
        pelvic_floor: quizState.pelvicFloor,
        diastasis_recti: quizState.diastasisRecti,
      }

      try {
        await addContactToOmnisend({
          email: quizState.email,
          firstName: quizState.name,
          tags: ["postpartum-assessment", `score-${tier}`],
          customProperties,
        })
      } catch (omnisendError) {
        console.error("[omnisend] first call error:", omnisendError)
      }

      const { data, error: supabaseError } = await supabase
        .from("leads")
        .insert({
          name: quizState.name,
          email: quizState.email,
          primary_goal: quizState.primaryGoal,
          activity_level: quizState.exercise,
          equipment: "not-specified",
          dietary_preferences: "none",
          special_notes: JSON.stringify({
            assessment_type: "postpartum",
            score: calculatedScore,
            score_tier: tier,
            weeks_postpartum: quizState.weeksPostpartum,
            medical_clearance: quizState.medicalClearance,
            diastasis_recti: quizState.diastasisRecti,
            pelvic_floor: quizState.pelvicFloor,
            nutrition_protein: quizState.nutritionProtein,
            sleep: quizState.sleep,
            stress: quizState.stress,
            exercise: quizState.exercise,
            biggest_obstacle: quizState.biggestObstacle,
            support_preference: quizState.supportType,
            additional_notes: quizState.additionalNotes,
          }),
          created_at: new Date().toISOString(),
        })
        .select()

      if (supabaseError) console.error("[supabase] insert error:", supabaseError)

      if (data?.[0]) {
        sessionStorage.setItem("postpartum_assessment_id", data[0].id)
        const resultsUrl = `https://catalystmomofficial.com/dashboard?assessment_id=${data[0].id}`
        try {
          await addContactToOmnisend({
            email: quizState.email,
            firstName: quizState.name,
            tags: ["postpartum-assessment", `score-${tier}`],
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
    setQuizState((prev: QuizState) => ({ ...prev, [field]: value }))

  const isCurrentQuestionValid = () => {
    const q = questions[currentQuestion]
    const val = quizState[q.field as keyof QuizState]
    if (q.type === "email") return val.trim() !== "" && isValidEmail(val)
    if (q.type === "text") return val.trim() !== ""
    if (q.type === "textarea") return true
    return val !== ""
  }

  if (showResults) {
    return <PostpartumResultsPage score={score} tier={scoreTier} quizState={quizState} />
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
              <span className="font-bold" style={{ color: "#A15C2F" }}>Catalyst Mom - Postpartum</span>
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
              <RadioGroup
                value={quizState[question.field as keyof QuizState]}
                onValueChange={(value) => handleInputChange(question.field as keyof QuizState, value)}
              >
                <div className="space-y-3">
                  {(question as any).options?.map((opt: { value: string; label: string }) => (
                    <div
                      key={opt.value}
                      className="flex items-center space-x-3 p-4 border-2 border-amber-200 rounded-lg hover:border-amber-400 cursor-pointer transition-colors"
                    >
                      <RadioGroupItem value={opt.value} id={opt.value} />
                      <Label htmlFor={opt.value} className="cursor-pointer flex-1 text-base">{opt.label}</Label>
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
        <div className="flex justify-between items-center mt-8 gap-4">
          <Button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            variant="outline"
            className="px-6 py-3 border-2 bg-transparent"
            style={{ borderColor: "#A15C2F", color: "#A15C2F" }}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={!isCurrentQuestionValid() || isLoading}
            className="flex-1 py-3 text-white font-bold rounded-xl shadow-lg"
            style={{ background: "linear-gradient(135deg, #A15C2F, #C27B48)" }}
          >
            {isLoading
              ? "Calculating..."
              : currentQuestion === questions.length - 1
              ? "Get My Results →"
              : "Next →"}
          </Button>
        </div>
      </div>
    </div>
  )
}

// ─── Results Page ─────────────────────────────────────────────────────────────

function PostpartumResultsPage({
  score, tier, quizState,
}: {
  score: number
  tier: "low" | "medium" | "high"
  quizState: QuizState
}) {
  const breakdown = getDetailedBreakdown(quizState)
  const gaps = breakdown.filter((item) => item.status === "needs-work").slice(0, 3)

  const getTierColor = () => score <= 40 ? "#E57373" : score <= 55 ? "#FFB74D" : "#81C784"
  const getTierLabel = () =>
    score <= 40 ? "Early Recovery Stage" : score <= 55 ? "Building Strength Stage" : "Thriving Postpartum Stage"

  const tierMessages = {
    high: "Wow — you're doing SO much right! You're in the top 15% of postpartum moms. Let's help you optimize the last details.",
    medium: "You've got solid foundations in place! A few key areas of focus will get you feeling fully yourself again.",
    low: "You're experiencing some common postpartum challenges — and we can absolutely help. You don't have to figure this out alone.",
  }

  return (
    <div className="min-h-screen p-4" style={{ background: "linear-gradient(135deg, #F8F5F2, #F0E6D2)" }}>
      <div className="max-w-4xl mx-auto">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />Back to Home
          </Button>
        </Link>

        {/* Score Display */}
        <Card className="border-0 shadow-xl mb-8">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <div
                className="w-32 h-32 rounded-full mx-auto flex items-center justify-center mb-4"
                style={{ backgroundColor: getTierColor() }}
              >
                <span className="text-5xl font-bold text-white">{score}</span>
              </div>
              <h1 className="text-3xl font-bold mb-2" style={{ color: "#3A2412" }}>
                {quizState.name ? `${quizState.name}'s` : "Your"} Postpartum Wellness Score
              </h1>
              <Badge className="text-lg px-4 py-2" style={{ backgroundColor: getTierColor(), color: "white" }}>
                {getTierLabel()}
              </Badge>
            </div>
            <p className="text-lg" style={{ color: "#3A2412" }}>{tierMessages[tier]}</p>
          </CardContent>
        </Card>

        {/* Breakdown */}
        <Card className="border-0 shadow-xl mb-8">
          <CardHeader>
            <CardTitle className="text-2xl" style={{ color: "#A15C2F" }}>
              📋 Your Postpartum Recovery Breakdown
            </CardTitle>
            <p className="text-sm" style={{ color: "#3A2412" }}>
              Here's how you're doing across the 7 key recovery areas:
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {breakdown.map((item, index) => (
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
                <div className="text-right">
                  <span className="font-bold" style={{ color: "#A15C2F" }}>
                    {item.score}/{item.maxScore}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Gaps */}
        {gaps.length > 0 && (
          <Card className="border-0 shadow-xl mb-8">
            <CardHeader>
              <CardTitle className="text-2xl" style={{ color: "#A15C2F" }}>
                🎯 Your Top Focus Areas
              </CardTitle>
              <p className="text-sm" style={{ color: "#3A2412" }}>
                Addressing these will make the biggest difference in your recovery:
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {gaps.map((gap, index) => (
                <div key={index} className="p-4 rounded-lg border-l-4" style={{ borderColor: "#A15C2F", backgroundColor: "#FFF8F2" }}>
                  <p className="font-bold" style={{ color: "#3A2412" }}>{gap.practice}</p>
                  <p className="text-sm mt-1" style={{ color: "#6B4C30" }}>
                    This is a key area to prioritize in your recovery program.
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* CTA */}
        <Card className="border-0 shadow-xl mb-8" style={{ background: "linear-gradient(135deg, #A15C2F, #C27B48)" }}>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Ready to Feel Like Yourself Again?
            </h2>
            <p className="text-amber-100 mb-6">
              Get your personalized postpartum recovery plan — safe core rebuilding, pelvic floor support, and real energy back.
            </p>
            <Button
              size="lg"
              className="bg-white font-bold px-8 py-4 rounded-xl shadow-lg text-lg"
              style={{ color: "#A15C2F" }}
              onClick={() =>
                window.open(
                  `https://catalystmomofficial.com/dashboard?assessment_id=${sessionStorage.getItem("postpartum_assessment_id") ?? ""}`,
                  "_blank",
                )
              }
            >
              Access Your Full Recovery Plan →
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
