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
  coreStrength: string
  pelvicFloor: string
  diastasisRecti: string
  weight: string
  energy: string
  sleep: string
  mood: string
  exercise: string
  nutrition: string
  supplementation: string
  stress: string
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

// ─── Constants ────────────────────────────────────────────────────────────────

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

const initialQuizState: QuizState = {
  name: "", email: "", weeksPostpartum: "", medicalClearance: "",
  coreStrength: "", pelvicFloor: "", diastasisRecti: "", weight: "",
  energy: "", sleep: "", mood: "", exercise: "", nutrition: "",
  supplementation: "", stress: "", workoutRoutine: "", dietaryRestrictions: "",
  primaryGoal: "", biggestObstacle: "", supportType: "", additionalNotes: "",
  tracking: "",
}

// ─── Utility: Score Breakdown ─────────────────────────────────────────────────

function getDetailedBreakdown(qs: QuizState): BreakdownItem[] {
  return [
    {
      practice: "Medical Clearance",
      score: qs.medicalClearance === "Yes" ? 10 : qs.medicalClearance === "Soon - expecting it" ? 5 : 0,
      maxScore: 10,
    },
    {
      practice: "Core Strength",
      score: qs.coreStrength === "Yes, regularly" ? 10 : qs.coreStrength === "Sometimes" ? 5 : qs.coreStrength === "Not sure how to" ? 2 : 0,
      maxScore: 10,
    },
    {
      practice: "Pelvic Floor Training",
      score: qs.pelvicFloor === "Yes, regularly" ? 10 : qs.pelvicFloor === "Sometimes" ? 5 : qs.pelvicFloor === "Not sure how to" ? 2 : 0,
      maxScore: 10,
    },
    {
      practice: "Diastasis Recti Recovery",
      score: qs.diastasisRecti === "No separation" ? 10 : qs.diastasisRecti === "Aware but managing" ? 5 : qs.diastasisRecti === "Struggling with it" ? 0 : 0,
      maxScore: 10,
    },
    {
      practice: "Postpartum Nutrition",
      score: qs.nutrition === "Yes, focused on recovery" ? 10 : qs.nutrition === "Sometimes - doing my best" ? 5 : qs.nutrition === "Trying but struggling" ? 3 : 0,
      maxScore: 10,
    },
    {
      practice: "Supplementation",
      score: qs.supplementation === "Yes, complete protocol" ? 10 : qs.supplementation === "Some supplements" ? 5 : qs.supplementation === "Unsure what to take" ? 2 : 0,
      maxScore: 10,
    },
    {
      practice: "Sleep Quality",
      score: qs.sleep === "Yes, mostly" ? 10 : qs.sleep === "Mostly, but interrupted" ? 7 : 0,
      maxScore: 10,
    },
    {
      practice: "Energy & Recovery",
      score: qs.energy === "Good" ? 10 : qs.energy === "Fair - some days are hard" ? 5 : 0,
      maxScore: 10,
    },
    {
      practice: "Mood & Mental Health",
      score: qs.mood === "Good" ? 10 : qs.mood === "Mixed - good and tough days" ? 5 : qs.mood === "Struggling - feels heavy" ? 0 : 0,
      maxScore: 10,
    },
    {
      practice: "Wellness Tracking",
      score: qs.tracking === "Yes, regularly" ? 10 : qs.tracking === "Sometimes" ? 5 : 0,
      maxScore: 10,
    },
  ]
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function PostpartumAssessmentPage() {
  const supabase = createClient()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [scoreTier, setScoreTier] = useState<"low" | "medium" | "high">("low")
  
  const [quizState, setQuizState] = useState<QuizState>(initialQuizState)

  const questions = [
    { id: "name", label: "What's your first name?", type: "text", required: true },
    { id: "email", label: "What's your email?", type: "email", required: true },
    { id: "weeksPostpartum", label: "How many weeks postpartum are you?", type: "radio", required: true, options: ["0-6 weeks", "6-12 weeks", "3-6 months", "6-12 months", "12+ months"] },
    { id: "medicalClearance", label: "Have you received medical clearance to exercise?", type: "radio", required: true, options: ["Yes", "Soon - expecting it", "Not yet"] },
    { id: "coreStrength", label: "Are you currently training your core safely?", type: "radio", required: true, options: ["Yes, regularly", "Sometimes", "Not sure how to", "No, avoiding it"] },
    { id: "pelvicFloor", label: "Are you working on pelvic floor recovery?", type: "radio", required: true, options: ["Yes, regularly", "Sometimes", "Not sure how to", "No"] },
    { id: "diastasisRecti", label: "Do you have diastasis recti (ab separation)?", type: "radio", required: true, options: ["No separation", "Aware but managing", "Struggling with it", "Not sure"] },
    { id: "weight", label: "How are you feeling about your postpartum weight?", type: "radio", required: true, options: ["Good progress", "Okay, slow and steady", "Struggling", "Not focused on it yet"] },
    { id: "energy", label: "How's your energy level?", type: "radio", required: true, options: ["Good", "Fair - some days are hard", "Low - exhausted most days", "Varies wildly"] },
    { id: "sleep", label: "Are you getting quality sleep?", type: "radio", required: true, options: ["Yes, mostly", "Mostly, but interrupted", "No - baby sleep deprivation", "No - insomnia"] },
    { id: "mood", label: "How's your mood and mental health?", type: "radio", required: true, options: ["Good", "Mixed - good and tough days", "Struggling - feels heavy", "Concerning - seeking help"] },
  ]

  const handleInputChange = (field: string, value: string) => {
    const sanitizedValue = value.trim().substring(0, 500)
    setQuizState(prev => ({ ...prev, [field]: sanitizedValue }))
  }

  const calculateScore = (): number => {
    const breakdown = getDetailedBreakdown(quizState)
    return Math.round((breakdown.reduce((sum, item) => sum + item.score, 0) / breakdown.reduce((sum, item) => sum + item.maxScore, 0)) * 100)
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

      const customProperties = {
        assessment_type: "Postpartum",
        score: calculatedScore,
        score_tier: tier,
        weeks_postpartum: quizState.weeksPostpartum,
        primary_goal: quizState.primaryGoal,
        biggest_obstacle: quizState.biggestObstacle,
      }

      await addContactToOmnisend({
        email: quizState.email,
        firstName: quizState.name,
        tags: ["postpartum-assessment", `score-${tier}`],
        customProperties,
      })

      const { data, error: supabaseError } = await supabase
        .from("leads")
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
            medical_clearance: quizState.medicalClearance,
            core_strength: quizState.coreStrength,
            pelvic_floor: quizState.pelvicFloor,
            diastasis_recti: quizState.diastasisRecti,
            energy: quizState.energy,
            mood: quizState.mood,
            nutrition: quizState.nutrition,
            supplementation: quizState.supplementation,
          }),
          created_at: new Date().toISOString(),
        })
        .select()

      if (supabaseError) console.error("[v0] Supabase error:", supabaseError)

      if (data?.[0]) {
        sessionStorage.setItem("postpartum_assessment_id", data[0].id)
      }

      setShowResults(true)
    } catch (error) {
      console.error("[v0] Error submitting quiz:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const question = questions[currentQuestion]
  const fieldKey = question.id as keyof QuizState
  const isAnswered = quizState[fieldKey]

  if (showResults) {
    return (
      <PostpartumResults score={score} tier={scoreTier} quizState={quizState} />
    )
  }

  return (
    <div className="min-h-screen p-4 sm:p-6" style={{ background: "linear-gradient(135deg, #F8F5F2, #F0E6D2)" }}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-sm font-medium mb-6 hover:opacity-75" style={{ color: "#A15C2F" }}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Link>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: "#A15C2F" }}>
              Postpartum Wellness Assessment
            </h1>
            <Badge className="text-sm px-3 py-1 bg-white" style={{ color: "#A15C2F", borderColor: "#A15C2F" }}>
              {currentQuestion + 1} of {questions.length}
            </Badge>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                backgroundColor: "#A15C2F",
              }}
            />
          </div>
        </div>

        {/* Question Card */}
        <Card className="border-0 shadow-xl mb-8">
          <CardContent className="p-6 sm:p-8">
            <Label className="text-lg sm:text-xl font-semibold mb-6 block" style={{ color: "#3A2412" }}>
              {question.label}
              {question.required && <span style={{ color: "#E57373" }}> *</span>}
            </Label>

            {question.type === "text" && (
              <input
                type="text"
                value={quizState[fieldKey] as string}
                onChange={(e) => handleInputChange(question.id, e.target.value)}
                placeholder={question.label}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                style={{ borderColor: "#D4C5B9", "--tw-ring-color": "#A15C2F" } as any}
              />
            )}

            {question.type === "email" && (
              <input
                type="email"
                value={quizState[fieldKey] as string}
                onChange={(e) => handleInputChange(question.id, e.target.value)}
                placeholder={question.label}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                style={{ borderColor: "#D4C5B9", "--tw-ring-color": "#A15C2F" } as any}
              />
            )}

            {question.type === "textarea" && (
              <Textarea
                value={quizState[fieldKey] as string}
                onChange={(e) => handleInputChange(question.id, e.target.value)}
                placeholder={question.label}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                style={{ borderColor: "#D4C5B9", "--tw-ring-color": "#A15C2F" } as any}
              />
            )}

            {question.type === "radio" && (
              <RadioGroup value={quizState[fieldKey] as string} onValueChange={(val) => handleInputChange(question.id, val)}>
                <div className="space-y-3">
                  {(question.options || []).map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`${question.id}-${option}`} />
                      <Label htmlFor={`${question.id}-${option}`} className="cursor-pointer font-normal" style={{ color: "#3A2412" }}>
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between gap-4">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            className="flex-1"
          >
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={question.required && !isAnswered || isLoading}
            className="flex-1 text-white font-bold py-3 rounded-xl text-base"
            style={{ background: isAnswered || !question.required ? "linear-gradient(135deg, #A15C2F, #C27B48)" : "#D4C5B9" }}
          >
            {isLoading ? "Submitting..." : currentQuestion === questions.length - 1 ? "View Results" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  )
}

// ─── Results Component ────────────────────────────────────────────────────────

function PostpartumResults({ score, tier, quizState }: { score: number; tier: string; quizState: QuizState }) {
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

  return (
    <div className="min-h-screen p-4 sm:p-6" style={{ background: "linear-gradient(135deg, #F8F5F2, #F0E6D2)" }}>
      <div className="max-w-4xl mx-auto">
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
                Your Postpartum Wellness Score
              </h1>
              <Badge className="text-lg px-4 py-2" style={{ backgroundColor: getTierColor(), color: "white" }}>
                {getTierLabel()}
              </Badge>
            </div>
            <p className="text-lg mb-6" style={{ color: "#3A2412" }}>
              {tier === "high" && "Wow! You're doing SO much right - you're in the TOP 15%."}
              {tier === "medium" && "You've got some solid foundations in place!"}
              {tier === "low" && "You're experiencing some common challenges keeping you from feeling your best."}
            </p>
            <div className="mt-8">
              <Button
                size="lg"
                className="w-full md:w-auto text-white px-6 py-3 font-bold rounded-xl shadow-lg"
                style={{ background: "linear-gradient(135deg, #A15C2F, #C27B48)" }}
                onClick={() =>
                  window.open(`https://catalystmomofficial.com/dashboard?assessment_type=postpartum&score=${score}`, "_blank")
                }
              >
                Access Your Full Plan in the App
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
