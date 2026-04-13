"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Heart } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { trackQuizEvents } from "@/lib/analytics"
import { addContactToOmnisend } from "@/lib/omnisend"

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
  tracking: string // Added tracking field
}

const supabase = createClient()

const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const initialQuizState: QuizState = {
  name: "",
  email: "",
  trimester: "",
  weeksPregnant: "",
  prenatalCare: "",
  exerciseSafety: "",
  nutrition: "",
  supplementation: "",
  stress: "",
  sleep: "",
  pelvicFloor: "",
  diastasisRecti: "",
  nausea: "",
  energy: "",
  workoutRoutine: "",
  dietaryRestrictions: "",
  primaryGoal: "",
  biggestObstacle: "",
  supportType: "",
  additionalNotes: "",
  tracking: "", // Initialize tracking field
}

export default function PregnancyAssessment() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [quizState, setQuizState] = useState<QuizState>(initialQuizState)
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [scoreTier, setScoreTier] = useState<"low" | "medium" | "high">("low")
  const [isLoading, setIsLoading] = useState(false)
  // Added state for submission loading
  const [isSubmitting, setIsSubmitting] = useState(false)

  const questions = [
    {
      id: "name",
      title: "What's your name?",
      subtitle: "So we can personalize your experience",
      type: "text",
      field: "name",
    },
    {
      id: "email",
      title: "What's your email?",
      subtitle: "We'll send your personalized results here",
      type: "email",
      field: "email",
    },
    {
      id: "trimester",
      title: "Which trimester are you in?",
      subtitle: "This helps us give you stage-appropriate recommendations",
      type: "radio",
      field: "trimester",
      options: [
        { value: "first", label: "First trimester (weeks 1-13)" },
        { value: "second", label: "Second trimester (weeks 14-26)" },
        { value: "third", label: "Third trimester (weeks 27-40)" },
      ],
    },
    {
      id: "weeksPregnant",
      title: "How many weeks pregnant are you?",
      subtitle: "Enter the number of weeks (1-40)",
      type: "text",
      field: "weeksPregnant",
      placeholder: "e.g., 24",
    },
    {
      id: "prenatal-care",
      title: "Are you receiving regular prenatal care?",
      subtitle: "Medical supervision is critical during pregnancy",
      type: "radio",
      field: "prenatalCare",
      options: [
        { value: "yes", label: "✅ Yes, I see my doctor/midwife regularly", points: 10 },
        { value: "sometimes", label: "⏱️ Sometimes, but not consistently", points: 5 },
        { value: "no", label: "❌ No, I haven't started prenatal care", points: 0 },
      ],
    },
    {
      id: "exercise-safety",
      title: "Are you doing pregnancy-safe exercise?",
      subtitle: "Avoiding high-impact and unsafe movements",
      type: "radio",
      field: "exerciseSafety",
      options: [
        { value: "yes", label: "✅ Yes, I do pregnancy-safe workouts", points: 10 },
        { value: "unsure", label: "🤷 I'm not sure what's safe", points: 3 },
        { value: "intense", label: "⚠️ I'm doing intense/high-impact exercise", points: 0 },
        { value: "no", label: "❌ I'm not exercising at all", points: 5 },
      ],
    },
    {
      id: "nutrition",
      title: "Are you eating pregnancy-supporting nutrition?",
      subtitle: "Folate, iron, calcium, and protein are critical",
      type: "radio",
      field: "nutrition",
      options: [
        { value: "yes", label: "✅ Yes, I focus on prenatal nutrition", points: 10 },
        { value: "sometimes", label: "⏱️ Sometimes, but not consistently", points: 5 },
        { value: "no", label: "❌ No, I eat whatever", points: 0 },
        { value: "trying", label: "🤷 I try to eat healthy but don't focus on pregnancy needs", points: 3 },
      ],
    },
    {
      id: "supplements",
      title: "Are you taking prenatal vitamins and supplements?",
      subtitle: "Prenatal vitamin, iron, calcium, DHA, etc.",
      type: "radio",
      field: "supplementation",
      options: [
        { value: "yes", label: "✅ Yes, I take a full prenatal protocol", points: 10 },
        { value: "some", label: "⏱️ I take some, but not a full protocol", points: 5 },
        { value: "no", label: "❌ No, I don't take any", points: 0 },
        { value: "unsure", label: "🤷 I'm not sure what to take", points: 2 },
      ],
    },
    {
      id: "stress",
      title: "How would you rate your stress levels?",
      subtitle: "Chronic stress impacts pregnancy health",
      type: "radio",
      field: "stress",
      options: [
        { value: "low", label: "✅ Low - I manage stress well", points: 10 },
        { value: "moderate", label: "⏱️ Moderate - some stress but manageable", points: 5 },
        { value: "high", label: "❌ High - I'm constantly stressed", points: 0 },
        { value: "very-high", label: "🚨 Very high - pregnancy anxiety is consuming me", points: 0 },
      ],
    },
    {
      id: "sleep",
      title: "Are you getting 8-10 hours of quality sleep?",
      subtitle: "Sleep is when your body heals and baby develops",
      type: "radio",
      field: "sleep",
      options: [
        { value: "yes", label: "✅ Yes, 8-10 hours most nights", points: 10 },
        { value: "mostly", label: "⏱️ Mostly, but sometimes less", points: 7 },
        { value: "no", label: "❌ No, I get 5-6 hours", points: 0 },
        { value: "poor", label: "😅 I get less than 5 hours", points: 0 },
      ],
    },
    {
      id: "pelvic-floor",
      title: "Are you doing pelvic floor exercises?",
      subtitle: "These prepare you for labor and prevent postpartum issues",
      type: "radio",
      field: "pelvicFloor",
      options: [
        { value: "yes", label: "✅ Yes, regularly", points: 10 },
        { value: "sometimes", label: "⏱️ Sometimes, but not consistently", points: 5 },
        { value: "no", label: "❌ No, I haven't started", points: 0 },
        { value: "dont-know", label: "🤷 I don't know how to do them", points: 2 },
      ],
    },
    {
      id: "diastasis-recti",
      title: "Are you aware of diastasis recti prevention?",
      subtitle: "Pregnancy can cause abdominal separation",
      type: "radio",
      field: "diastasisRecti",
      options: [
        { value: "yes", label: "✅ Yes, I'm doing prevention exercises", points: 10 },
        { value: "aware", label: "⏱️ I'm aware but not doing prevention", points: 5 },
        { value: "no", label: "❌ No, I don't know what this is", points: 0 },
      ],
    },
    {
      id: "nausea",
      title: "Are you managing pregnancy nausea/symptoms?",
      subtitle: "Morning sickness and fatigue are common",
      type: "radio",
      field: "nausea",
      options: [
        { value: "none", label: "✅ No nausea or minimal symptoms", points: 10 },
        { value: "managed", label: "⏱️ I have symptoms but manage them well", points: 7 },
        { value: "struggling", label: "❌ I'm struggling with severe nausea", points: 2 },
        { value: "severe", label: "🚨 Severe - affecting my nutrition", points: 0 },
      ],
    },
    {
      id: "energy",
      title: "How are your energy levels?",
      subtitle: "Fatigue is normal but shouldn't be debilitating",
      type: "radio",
      field: "energy",
      options: [
        { value: "good", label: "✅ Good - I have energy most days", points: 10 },
        { value: "okay", label: "⏱️ Okay - some days are better than others", points: 5 },
        { value: "low", label: "❌ Low - I'm exhausted most days", points: 0 },
        { value: "very-low", label: "🚨 Very low - I can barely function", points: 0 },
      ],
    },
    {
      id: "workout-routine",
      title: "Do you have a consistent workout routine?",
      subtitle: "Consistency supports pregnancy health",
      type: "radio",
      field: "workoutRoutine",
      options: [
        { value: "yes", label: "✅ Yes, 3-4+ times per week", points: 10 },
        { value: "sometimes", label: "⏱️ 1-2 times per week", points: 5 },
        { value: "random", label: "❌ No, I work out randomly", points: 2 },
        { value: "no", label: "❌ No, I haven't started", points: 0 },
      ],
    },
    {
      id: "tracking-wellness",
      title: "Are you tracking your wellness metrics?",
      subtitle: "Weight, blood pressure, mood, energy, etc.",
      type: "radio",
      field: "tracking", // Correct field name
      options: [
        { value: "yes", label: "✅ Yes, I track multiple metrics", points: 10 },
        { value: "some", label: "⏱️ I track some metrics", points: 5 },
        { value: "no", label: "❌ No, I don't track anything", points: 0 },
      ],
    },
    {
      id: "primary-goal",
      title: "What's your PRIMARY goal right now?",
      subtitle: "Let's focus on what matters most to you",
      type: "radio",
      field: "primaryGoal",
      options: [
        { value: "healthy-pregnancy", label: "Have a healthy pregnancy" },
        { value: "manage-symptoms", label: "Manage pregnancy symptoms" },
        { value: "prepare-labor", label: "Prepare for labor and delivery" },
        { value: "postpartum-ready", label: "Prepare for postpartum recovery" },
        { value: "stay-active", label: "Stay active and fit during pregnancy" },
      ],
    },
    {
      id: "biggest-obstacle",
      title: "What's the BIGGEST obstacle to your wellness goals?",
      subtitle: "Knowing your obstacle helps us help you",
      type: "radio",
      field: "biggestObstacle",
      options: [
        { value: "dont-know-safe", label: "Don't know what's safe during pregnancy" },
        { value: "exhausted", label: "Too tired/exhausted to work out" },
        { value: "symptoms", label: "Pregnancy symptoms (nausea, pain, etc.)" },
        { value: "anxiety", label: "Pregnancy anxiety and worry" },
        { value: "no-support", label: "No support or guidance" },
        { value: "overwhelmed", label: "Overwhelmed by conflicting advice" },
      ],
    },
    {
      id: "support-type",
      title: "What type of support would help you MOST?",
      subtitle: "This helps us recommend the right path",
      type: "radio",
      field: "supportType",
      options: [
        { value: "education", label: "Education and information" },
        { value: "community", label: "Community of pregnant women" },
        { value: "coaching", label: "1-on-1 personalized coaching" },
        { value: "plan", label: "Done-for-you pregnancy plan" },
        { value: "accountability", label: "Accountability and tracking" },
      ],
    },
    {
      id: "dietary",
      title: "Dietary preferences or restrictions?",
      subtitle: "We'll personalize nutrition recommendations",
      type: "radio",
      field: "dietaryRestrictions",
      options: [
        { value: "none", label: "None" },
        { value: "vegetarian", label: "Vegetarian" },
        { value: "vegan", label: "Vegan" },
        { value: "gluten-free", label: "Gluten-free" },
        { value: "dairy-free", label: "Dairy-free" },
        { value: "other", label: "Other" },
      ],
    },
    {
      id: "additional-notes",
      title: "Anything else we should know?",
      subtitle: "Share any concerns, limitations, or preferences",
      type: "textarea",
      field: "additionalNotes",
      placeholder: "E.g., gestational diabetes, high blood pressure, previous complications, specific concerns...",
    },
  ]

  const calculateScore = () => {
    let totalScore = 0

    if (quizState.prenatalCare === "yes") totalScore += 10
    else if (quizState.prenatalCare === "sometimes") totalScore += 5

    if (quizState.exerciseSafety === "yes") totalScore += 10
    else if (quizState.exerciseSafety === "unsure") totalScore += 3
    else if (quizState.exerciseSafety === "no") totalScore += 5

    if (quizState.nutrition === "yes") totalScore += 10
    else if (quizState.nutrition === "sometimes") totalScore += 5
    else if (quizState.nutrition === "trying") totalScore += 3

    if (quizState.supplementation === "yes") totalScore += 10
    else if (quizState.supplementation === "some") totalScore += 5
    else if (quizState.supplementation === "unsure") totalScore += 2

    if (quizState.stress === "low") totalScore += 10
    else if (quizState.stress === "moderate") totalScore += 5

    if (quizState.sleep === "yes") totalScore += 10
    else if (quizState.sleep === "mostly") totalScore += 7

    if (quizState.pelvicFloor === "yes") totalScore += 10
    else if (quizState.pelvicFloor === "sometimes") totalScore += 5
    else if (quizState.pelvicFloor === "dont-know") totalScore += 2

    if (quizState.diastasisRecti === "yes") totalScore += 10
    else if (quizState.diastasisRecti === "aware") totalScore += 5

    if (quizState.nausea === "none") totalScore += 10
    else if (quizState.nausea === "managed") totalScore += 7
    else if (quizState.nausea === "struggling") totalScore += 2

    if (quizState.energy === "good") totalScore += 10
    else if (quizState.energy === "okay") totalScore += 5

    if (quizState.workoutRoutine === "yes") totalScore += 10
    else if (quizState.workoutRoutine === "sometimes") totalScore += 5
    else if (quizState.workoutRoutine === "random") totalScore += 2

    if (quizState.tracking === "yes") totalScore += 10
    else if (quizState.tracking === "some") totalScore += 5

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

        trackQuizEvents.quizCompleted(calculatedScore, tier)

        const weeksPregnantNum = Number.parseInt(quizState.weeksPregnant) || 0
        const weeksUntilBirth = Math.max(0, 40 - weeksPregnantNum)

        // Add custom properties for Omnisend
        const customProperties = {
          assessment_type: "Pregnancy",
          score: calculatedScore,
          score_tier: tier,
          trimester: quizState.trimester,
          weeks_pregnant: weeksPregnantNum,
          weeksUntilBirth: weeksUntilBirth,
          primary_goal: quizState.primaryGoal,
          // Removed results_url as it is handled by Supabase response
        }

        // Send to Omnisend
        await addContactToOmnisend({
          email: quizState.email,
          firstName: quizState.name,
          tags: ["pregnancy-assessment", `score-${tier}`, `trimester-${quizState.trimester}`],
          customProperties: customProperties,
        })

        const { data, error: supabaseError } = await supabase
          .from("lead_responses")
          .insert({
            name: quizState.name,
            email: quizState.email,
            primary_goal: quizState.primaryGoal,
            activity_level: quizState.workoutRoutine,
            equipment: quizState.exerciseSafety,
            dietary_preferences: quizState.dietaryRestrictions,
            special_notes: JSON.stringify({
              assessment_type: "pregnancy",
              score: calculatedScore,
              score_tier: tier,
              trimester: quizState.trimester,
              weeks_pregnant: weeksPregnantNum,
              weeks_until_birth: weeksUntilBirth,
              biggest_obstacle: quizState.biggestObstacle,
              support_preference: quizState.supportType,
              additional_notes: quizState.additionalNotes,
              prenatal_care: quizState.prenatalCare,
              nutrition: quizState.nutrition,
              supplementation: quizState.supplementation,
              stress: quizState.stress,
              sleep: quizState.sleep,
              tracking: quizState.tracking,
            }),
            created_at: new Date().toISOString(),
          })
          .select()

        console.log("[v0] Supabase insert response:", data)

        // Store the assessment ID for results page and add results_url to Omnisend custom properties
        if (data && data[0]) {
          sessionStorage.setItem("pregnancy_assessment_id", data[0].id)
          const resultsUrl = `https://catalystmom.online/results/${data[0].id}`
          await addContactToOmnisend({
            email: quizState.email,
            firstName: quizState.name,
            tags: ["pregnancy-assessment", `score-${tier}`, `trimester-${quizState.trimester}`],
            customProperties: {
              ...customProperties, // Keep existing properties
              results_url: resultsUrl, // Add the results URL
            },
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
    const value = quizState[question.field as keyof QuizState]

    if (question.type === "text" || question.type === "email") {
      if (question.type === "email") {
        return value.trim() !== "" && isValidEmail(value)
      }
      return value.trim() !== ""
    }

    // Added validation for weeksPregnant to ensure it's a number
    if (question.field === "weeksPregnant") {
      const numValue = Number.parseInt(value)
      return !isNaN(numValue) && numValue >= 1 && numValue <= 40
    }

    return value !== ""
  }

  if (showResults) {
    return <PregnancyResultsPage score={score} tier={scoreTier} quizState={quizState} />
  }

  const question = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="min-h-screen p-4" style={{ background: "linear-gradient(135deg, #F8F5F2, #F0E6D2)" }}>
      <div className="max-w-2xl mx-auto">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg" style={{ backgroundColor: "#A15C2F" }}>
                <Heart className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold" style={{ color: "#A15C2F" }}>
                Catalyst Mom - Pregnancy
              </span>
            </div>
            <Badge style={{ backgroundColor: "#A15C2F", color: "white" }}>
              {currentQuestion + 1} of {questions.length}
            </Badge>
          </div>
          <div className="w-full h-2 rounded-full" style={{ backgroundColor: "#E8D5C4" }}>
            <div
              className="h-2 rounded-full transition-all duration-300"
              style={{
                backgroundColor: "#A15C2F",
                width: `${progress}%`,
              }}
            />
          </div>
        </div>

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
                placeholder={question.placeholder}
                className="w-full p-4 border-2 border-amber-200 rounded-lg focus:border-amber-400 focus:outline-none text-lg"
              />
            )}

            {question.type === "email" && (
              <input
                type="email"
                value={quizState[question.field as keyof QuizState]}
                onChange={(e) => handleInputChange(question.field as keyof QuizState, e.target.value)}
                placeholder={question.placeholder}
                className="w-full p-4 border-2 border-amber-200 rounded-lg focus:border-amber-400 focus:outline-none text-lg"
              />
            )}

            {question.type === "radio" && (
              <RadioGroup
                value={quizState[question.field as keyof QuizState]}
                onValueChange={(value) => handleInputChange(question.field as keyof QuizState, value)}
              >
                <div className="space-y-3">
                  {question.options?.map((option) => (
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
                placeholder={question.placeholder}
                rows={4}
                className="w-full p-4 border-2 border-amber-200 rounded-lg focus:border-amber-400 focus:outline-none text-base resize-none"
              />
            )}
          </CardContent>
        </Card>

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

function PregnancyResultsPage({
  score,
  tier,
  quizState,
}: {
  score: number
  tier: "low" | "medium" | "high"
  quizState: QuizState
}) {
  const getDetailedBreakdown = () => {
    return [
      {
        practice: "Prenatal Care",
        score: quizState.prenatalCare === "yes" ? 10 : quizState.prenatalCare === "sometimes" ? 5 : 0,
        maxScore: 10,
      },
      {
        practice: "Exercise Safety",
        score:
          quizState.exerciseSafety === "yes"
            ? 10
            : quizState.exerciseSafety === "unsure"
              ? 3
              : quizState.exerciseSafety === "no"
                ? 5
                : 0,
        maxScore: 10,
      },
      {
        practice: "Prenatal Nutrition",
        score:
          quizState.nutrition === "yes"
            ? 10
            : quizState.nutrition === "sometimes"
              ? 5
              : quizState.nutrition === "trying"
                ? 3
                : 0,
        maxScore: 10,
      },
      {
        practice: "Supplementation",
        score:
          quizState.supplementation === "yes"
            ? 10
            : quizState.supplementation === "some"
              ? 5
              : quizState.supplementation === "unsure"
                ? 2
                : 0,
        maxScore: 10,
      },
      {
        practice: "Stress Management",
        score: quizState.stress === "low" ? 10 : quizState.stress === "moderate" ? 5 : 0,
        maxScore: 10,
      },
      {
        practice: "Sleep Quality",
        score: quizState.sleep === "yes" ? 10 : quizState.sleep === "mostly" ? 7 : 0,
        maxScore: 10,
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
      },
      {
        practice: "Diastasis Prevention",
        score: quizState.diastasisRecti === "yes" ? 10 : quizState.diastasisRecti === "aware" ? 5 : 0,
        maxScore: 10,
      },
      {
        practice: "Symptom Management",
        score:
          quizState.nausea === "none"
            ? 10
            : quizState.nausea === "managed"
              ? 7
              : quizState.nausea === "struggling"
                ? 2
                : 0,
        maxScore: 10,
      },
      {
        practice: "Wellness Tracking", // Corrected practice name
        score: quizState.tracking === "yes" ? 10 : quizState.tracking === "some" ? 5 : 0,
        maxScore: 10,
      },
    ]
  }

  const getPersonalizedResponse = (notes: string) => {
    const lowerNotes = notes.toLowerCase()
    const breakdown = getDetailedBreakdown() // Ensure breakdown is accessible here

    if (
      lowerNotes.includes("gestational diabetes") ||
      lowerNotes.includes("gd") ||
      lowerNotes.includes("blood sugar")
    ) {
      const gaps = breakdown.filter((item) => item.score < 8).slice(0, 3)
      return {
        concern: "Gestational Diabetes Management",
        response: `I hear you on the gestational diabetes concern—it's scary when you get that diagnosis. But here's what most doctors don't tell you: GD is highly manageable with the right nutrition and movement protocols, and many women maintain perfect blood sugar control without medication.

**Why you're experiencing this (based on your gaps):**

${gaps
  .map(
    (gap, i) =>
      `${i + 1}. **${gap.practice} (${gap.score}/10)**: ${
        gap.practice === "Prenatal Nutrition"
          ? "Without pregnancy-specific nutrition focused on balanced macros and blood sugar stability, your body struggles to regulate glucose. The app provides GD-specific meal plans with the exact carb-to-protein ratios that keep your blood sugar stable."
          : gap.practice === "Exercise Safety"
            ? "Safe, consistent movement improves insulin sensitivity dramatically. The app includes GD-safe workouts (walking protocols, resistance training, post-meal movement) that help your body use glucose more effectively."
            : gap.practice === "Supplementation"
              ? "Specific supplements (chromium, magnesium, vitamin D) support blood sugar regulation. The app's supplement protocol is designed for GD management alongside your prenatal vitamins."
              : gap.practice === "Stress Management"
                ? "Stress hormones directly raise blood sugar levels. The app's stress management techniques (breathwork, meditation, gentle movement) help keep cortisol—and therefore glucose—under control."
                : gap.practice === "Wellness Tracking"
                  ? "Without tracking your blood sugar patterns, meals, and movement, you can't identify what's working. The app includes tracking tools that help you see exactly what keeps your numbers in range."
                  : `This gap is contributing to your GD challenges. The app addresses this with specific protocols designed for gestational diabetes management.`
      }`,
  )
  .join("\n\n")}

**What the app does differently:**
- GD-specific meal plans with exact macros for blood sugar control
- Safe exercise protocols proven to improve insulin sensitivity
- Blood sugar tracking and pattern identification
- Supplement guidance for GD management
- Community of other moms managing GD successfully

**Timeline:** Most women see improved blood sugar control within 1-2 weeks of implementing the nutrition and movement protocols. Many avoid medication entirely or reduce their insulin needs significantly.`,
      }
    }

    if (
      lowerNotes.includes("high blood pressure") ||
      lowerNotes.includes("preeclampsia") ||
      lowerNotes.includes("hypertension")
    ) {
      const gaps = breakdown.filter((item) => item.score < 8).slice(0, 3)
      return {
        concern: "High Blood Pressure in Pregnancy",
        response: `High blood pressure during pregnancy is understandably scary, especially with the risk of preeclampsia. But lifestyle factors can make a significant difference in managing your BP alongside medical care.

**Why your blood pressure is elevated (based on your gaps):**

${gaps
  .map(
    (gap, i) =>
      `${i + 1}. **${gap.practice} (${gap.score}/10)**: ${
        gap.practice === "Prenatal Nutrition"
          ? "Without BP-friendly nutrition (low sodium, high potassium, magnesium-rich foods), your body struggles to regulate blood pressure. The app provides specific meal plans designed to support healthy BP during pregnancy."
          : gap.practice === "Stress Management"
            ? "Chronic stress keeps your blood pressure elevated through cortisol and adrenaline. The app's stress management protocols (breathwork, meditation, gentle movement) help lower BP naturally."
            : gap.practice === "Exercise Safety"
              ? "Safe, moderate exercise helps regulate blood pressure and improve circulation. The app includes BP-safe workouts that support cardiovascular health without raising your pressure."
              : gap.practice === "Sleep Quality"
                ? "Poor sleep raises blood pressure and increases preeclampsia risk. The app's sleep optimization strategies help you get the 8-10 hours your body needs to regulate BP."
                : gap.practice === "Supplementation"
                  ? "Specific supplements (magnesium, calcium, omega-3s) support healthy blood pressure. The app's supplement protocol is designed for BP management alongside prenatal vitamins."
                  : `This gap is contributing to your blood pressure challenges. The app addresses this with specific protocols designed for BP management during pregnancy.`
      }`,
  )
  .join("\n\n")}

**What the app does differently:**
- BP-friendly meal plans (low sodium, high potassium/magnesium)
- Stress management techniques proven to lower blood pressure
- Safe exercise protocols for cardiovascular health
- Sleep optimization strategies
- Tracking tools to monitor BP patterns
- Works alongside your medical team's care

**Timeline:** Many women see BP improvements within 2-3 weeks of implementing nutrition and stress management protocols. This doesn't replace medical care but significantly supports it.`,
      }
    }

    if (
      lowerNotes.includes("nausea") ||
      lowerNotes.includes("morning sickness") ||
      lowerNotes.includes("vomiting") ||
      lowerNotes.includes("hg") ||
      lowerNotes.includes("sick")
    ) {
      const gaps = breakdown.filter((item) => item.score < 8).slice(0, 3)
      return {
        concern: "Severe Nausea and Morning Sickness",
        response: `Severe nausea can make pregnancy feel unbearable—I know you're just trying to survive each day. But there are evidence-based strategies that can significantly reduce your symptoms and help you maintain nutrition.

**Why your nausea is so severe (based on your gaps):**

${gaps
  .map(
    (gap, i) =>
      `${i + 1}. **${gap.practice} (${gap.score}/10)**: ${
        gap.practice === "Prenatal Nutrition"
          ? "Without anti-nausea nutrition strategies (small frequent meals, protein with every snack, avoiding empty stomach), your nausea gets worse. The app provides specific meal timing and food combinations that minimize nausea."
          : gap.practice === "Supplementation"
            ? "Vitamin B6, ginger, and magnesium can significantly reduce nausea, but most women don't know the right doses or timing. The app's supplement protocol is designed specifically for nausea management."
            : gap.practice === "Exercise Safety"
              ? "Gentle movement can actually reduce nausea by improving digestion and circulation, but you need to know what's safe when you're feeling terrible. The app includes nausea-friendly movement options."
              : gap.practice === "Stress Management"
                ? "Anxiety and stress make nausea worse through the gut-brain connection. The app's stress management techniques help calm your nervous system and reduce nausea triggers."
                : gap.practice === "Sleep Quality"
                  ? "Fatigue intensifies nausea. The app's sleep optimization strategies help you get the rest that reduces nausea severity."
                  : `This gap is contributing to your nausea challenges. The app addresses this with specific protocols designed for severe morning sickness management.`
      }`,
  )
  .join("\n\n")}

**What the app does differently:**
- Anti-nausea meal plans with specific timing and food combinations
- Supplement protocol (B6, ginger, magnesium) with exact doses
- Gentle movement options for when you're feeling terrible
- Stress management techniques that calm nausea
- Modifications for every workout based on how you're feeling
- Community of moms who've been through severe nausea

**Timeline:** Most women see nausea reduction within 3-5 days of implementing the nutrition and supplement protocols. It may not eliminate it completely, but it makes it manageable.`,
      }
    }

    if (
      lowerNotes.includes("exhausted") ||
      lowerNotes.includes("fatigue") ||
      lowerNotes.includes("tired") ||
      lowerNotes.includes("no energy") ||
      lowerNotes.includes("can't function")
    ) {
      const gaps = breakdown.filter((item) => item.score < 8).slice(0, 3)
      return {
        concern: "Pregnancy Fatigue and Exhaustion",
        response: `Pregnancy fatigue is real and debilitating—it's not just "being tired," it's bone-deep exhaustion that makes everything feel impossible. But there are specific strategies that can significantly improve your energy levels.

**Why you're so exhausted (based on your gaps):**

${gaps
  .map(
    (gap, i) =>
      `${i + 1}. **${gap.practice} (${gap.score}/10)**: ${
        gap.practice === "Prenatal Nutrition"
          ? "Without energy-supporting nutrition (iron-rich foods, balanced blood sugar, adequate protein), your body can't produce the energy you need. The app provides meal plans specifically designed to combat pregnancy fatigue."
          : gap.practice === "Supplementation"
            ? "Iron deficiency is the #1 cause of pregnancy fatigue, but most prenatal vitamins don't have enough. The app's supplement protocol includes the right type and dose of iron plus B vitamins for energy production."
            : gap.practice === "Sleep Quality"
              ? "Without 8-10 hours of quality sleep, your body can't recover from the massive energy demands of pregnancy. The app's sleep optimization strategies help you get the rest that reduces nausea severity."
              : gap.practice === "Exercise Safety"
                ? "It sounds counterintuitive, but gentle movement actually increases energy by improving circulation and oxygen delivery. The app includes energy-boosting workouts that energize rather than deplete."
                : gap.practice === "Stress Management"
                  ? "Chronic stress drains your energy through elevated cortisol. The app's stress management techniques help conserve your limited energy reserves."
                  : `This gap is contributing to your exhaustion. The app addresses this with specific protocols designed to restore your energy during pregnancy.`
      }`,
  )
  .join("\n\n")}

**What the app does differently:**
- Energy-boosting meal plans (iron-rich foods, balanced blood sugar)
- Supplement protocol for fatigue (iron, B vitamins, magnesium)
- Gentle movement that energizes rather than depletes
- Sleep optimization strategies for deep recovery
- Rest/activity balance guidance
- Modifications for low-energy days

**Timeline:** Most women notice improved energy within 1-2 weeks of addressing iron levels and sleep quality. It's gradual but significant—you'll go from barely functioning to feeling human again.`,
      }
    }

    if (
      lowerNotes.includes("anxiety") ||
      lowerNotes.includes("worried") ||
      lowerNotes.includes("scared") ||
      lowerNotes.includes("fear") ||
      lowerNotes.includes("panic")
    ) {
      const gaps = breakdown.filter((item) => item.score < 8).slice(0, 3)
      return {
        concern: "Pregnancy Anxiety and Fear",
        response: `Pregnancy anxiety is incredibly common, especially if you've had previous complications or losses. The constant worry about baby's health can consume your entire pregnancy experience—but it doesn't have to.

**Why your anxiety is so high (based on your gaps):**

${gaps
  .map(
    (gap, i) =>
      `${i + 1}. **${gap.practice} (${gap.score}/10)**: ${
        gap.practice === "Stress Management"
          ? "Without specific anxiety management techniques, your nervous system stays in fight-or-flight mode. The app provides pregnancy-safe breathwork, meditation, and movement practices that calm your anxiety."
          : gap.practice === "Exercise Safety"
            ? "Safe, consistent movement is one of the most effective anxiety treatments, but you need to know what's safe during pregnancy. The app includes anxiety-reducing workouts that calm your nervous system."
            : gap.practice === "Sleep Quality"
              ? "Poor sleep intensifies anxiety and makes everything feel more overwhelming. The app's sleep optimization strategies help you get the rest that reduces anxiety."
              : gap.practice === "Prenatal Care"
                ? "Regular prenatal care and monitoring can actually reduce anxiety by confirming baby is healthy. The app helps you prepare for appointments and understand what to track between visits."
                : gap.practice === "Wellness Tracking"
                  ? "Tracking baby's movements, your symptoms, and wellness metrics can reduce anxiety by giving you concrete data that everything is okay. The app includes tracking tools that provide reassurance."
                  : `This gap is contributing to your anxiety. The app addresses this with specific protocols designed to manage pregnancy anxiety and worry.`
      }`,
  )
  .join("\n\n")}

**What the app does differently:**
- Pregnancy-specific anxiety management techniques (breathwork, meditation)
- Safe movement practices that calm your nervous system
- Community support from other anxious moms
- Tracking tools that provide reassurance
- Education about what's normal vs. concerning
- Strategies to stay present and enjoy your pregnancy

**Timeline:** Most women notice reduced anxiety within 1-2 weeks of implementing daily stress management practices. It's not about eliminating worry completely, but managing it so it doesn't consume you.`,
      }
    }

    if (
      lowerNotes.includes("pelvic pain") ||
      lowerNotes.includes("spd") ||
      lowerNotes.includes("symphysis") ||
      lowerNotes.includes("sciatica") ||
      lowerNotes.includes("back pain")
    ) {
      const gaps = breakdown.filter((item) => item.score < 8).slice(0, 3)
      return {
        concern: "Pelvic Pain and SPD",
        response: `Pelvic pain and SPD can make every movement excruciating—walking, rolling over in bed, even standing can be unbearable. But the right exercises and modifications can significantly reduce your pain and help you stay active.

**Why you're experiencing this pain (based on your gaps):**

${gaps
  .map(
    (gap, i) =>
      `${i + 1}. **${gap.practice} (${gap.score}/10)**: ${
        gap.practice === "Pelvic Floor Training"
          ? "Without pelvic floor strengthening and stabilization exercises, your pelvis becomes unstable and painful. The app includes specific exercises that stabilize your pelvis and reduce SPD pain."
          : gap.practice === "Exercise Safety"
            ? "Doing the wrong exercises (or no exercise) makes pelvic pain worse. The app provides pain-free movement modifications and pelvic-stabilizing workouts that actually help."
            : gap.practice === "Prenatal Nutrition"
              ? "Inflammation from poor nutrition intensifies pain. The app's anti-inflammatory meal plans help reduce pelvic pain and swelling."
              : gap.practice === "Stress Management"
                ? "Stress and tension make pain worse through muscle tightness. The app's stress management techniques help relax your pelvic muscles and reduce pain."
                : gap.practice === "Sleep Quality"
                  ? "Poor sleep lowers your pain threshold and makes everything hurt more. The app's sleep optimization strategies (including positioning for pelvic pain) help you get relief."
                  : `This gap is contributing to your pelvic pain. The app addresses this with specific protocols designed for SPD and pelvic pain management.`
      }`,
  )
  .join("\n\n")}

**What the app does differently:**
- Pelvic-stabilizing exercises that reduce SPD pain
- Pain-free movement modifications for every workout
- Anti-inflammatory nutrition protocols
- Positioning strategies for sleep and daily activities
- Stress management techniques that relax pelvic muscles
- Community of moms managing pelvic pain successfully

**Timeline:** Most women notice pain reduction within 1-2 weeks of implementing pelvic stabilization exercises and modifications. It may not eliminate pain completely, but it makes it manageable so you can stay active.`,
      }
    }

    if (
      lowerNotes.includes("previous complications") ||
      lowerNotes.includes("last pregnancy") ||
      lowerNotes.includes("traumatic birth") ||
      lowerNotes.includes("loss") ||
      lowerNotes.includes("miscarriage")
    ) {
      const gaps = breakdown.filter((item) => item.score < 8).slice(0, 3)
      return {
        concern: "Previous Pregnancy Complications or Loss",
        response: `Having complications or loss in a previous pregnancy creates understandable fear for this one. Every symptom feels like a warning sign, and it's hard to relax and enjoy your pregnancy. But you can feel more in control this time.

**How to support a healthier pregnancy this time (based on your gaps):**

${gaps
  .map(
    (gap, i) =>
      `${i + 1}. **${gap.practice} (${gap.score}/10)**: ${
        gap.practice === "Prenatal Care"
          ? "Regular prenatal care with close monitoring is essential after previous complications. The app helps you prepare for appointments, track symptoms, and communicate effectively with your medical team."
          : gap.practice === "Prenatal Nutrition"
            ? "Optimal nutrition supports a healthy pregnancy and reduces complication risk. The app provides meal plans tailored to your specific risk factors and restrictions."
            : gap.practice === "Stress Management"
              ? "The anxiety from previous complications keeps your stress hormones elevated, which can affect pregnancy health. The app's stress management techniques help you stay calm while still being vigilant."
              : gap.practice === "Exercise Safety"
                ? "Safe, appropriate movement supports pregnancy health without increasing risk. The app includes modifications for high-risk situations and helps you stay active within your doctor's guidelines."
                : gap.practice === "Wellness Tracking"
                  ? "Tracking symptoms, baby's movements, and wellness metrics provides reassurance and helps catch potential issues early. The app includes tracking tools designed for anxious moms."
                  : `This gap is important to address after previous complications. The app provides specific protocols to support a healthier pregnancy this time.`
      }`,
  )
  .join("\n\n")}

**What the app does differently:**
- Focuses on what you CAN control (nutrition, movement, stress)
- Works alongside your medical team's care
- Provides tracking tools for reassurance
- Community support from other moms with similar histories
- Education about warning signs vs. normal symptoms
- Strategies to manage anxiety while staying vigilant

**Timeline:** This is about the entire pregnancy journey—supporting your health day by day while working with your medical team. Most women feel more empowered and less anxious within 2-3 weeks of having a clear plan.`,
      }
    }

    if (
      lowerNotes.includes("high risk") ||
      lowerNotes.includes("complications") ||
      lowerNotes.includes("bed rest") ||
      lowerNotes.includes("restricted")
    ) {
      const gaps = breakdown.filter((item) => item.score < 8).slice(0, 3)
      return {
        concern: "High-Risk Pregnancy Management",
        response: `High-risk pregnancies require extra care, but that doesn't mean you can't stay active and healthy within your limitations. There are safe ways to support your health even with restrictions.

**How to optimize your health within your limitations (based on your gaps):**

${gaps
  .map(
    (gap, i) =>
      `${i + 1}. **${gap.practice} (${gap.score}/10)**: ${
        gap.practice === "Exercise Safety"
          ? "Even with restrictions, there are safe movement options (gentle stretching, breathing exercises, modified strength work). The app includes modifications for high-risk situations and bed rest."
          : gap.practice === "Prenatal Nutrition"
            ? "Optimal nutrition is even more critical in high-risk pregnancies. The app provides meal plans tailored to your specific risk factors and restrictions."
            : gap.practice === "Stress Management"
              ? "The stress of a high-risk pregnancy affects your health and baby's development. The app's stress management techniques are safe for all risk levels and help you stay calm."
              : gap.practice === "Prenatal Care"
                ? "Close medical monitoring is essential. The app helps you track symptoms, prepare for appointments, and communicate effectively with your high-risk team."
                : gap.practice === "Sleep Quality"
                  ? "Rest is critical in high-risk pregnancies. The app's sleep optimization strategies help you get the quality rest your body needs."
                  : `This gap is important to address in a high-risk pregnancy. The app provides specific protocols that work within your doctor's guidelines.`
      }`,
  )
  .join("\n\n")}

**What the app does differently:**
- Modifications for high-risk situations and bed rest
- Gentle movement options within medical restrictions
- Nutrition strategies for specific risk factors
- Stress management safe for all risk levels
- Works within your doctor's guidelines
- Community of other high-risk moms

**Timeline:** This is about supporting your health throughout your high-risk pregnancy within your medical team's guidelines. Most women feel more empowered and less helpless within 1-2 weeks of having safe strategies to implement.`,
      }
    }

    if (
      lowerNotes.includes("weight") ||
      lowerNotes.includes("gain") ||
      lowerNotes.includes("body image") ||
      lowerNotes.includes("fat") ||
      lowerNotes.includes("big")
    ) {
      const gaps = breakdown.filter((item) => item.score < 8).slice(0, 3)
      return {
        concern: "Pregnancy Weight and Body Image",
        response: `Pregnancy weight gain can be emotionally challenging, especially in a culture that glorifies "bouncing back." But your body is doing exactly what it needs to do to grow a healthy baby—and you can feel strong and confident through the process.

**How to support healthy weight gain and feel good in your body (based on your gaps):**

${gaps
  .map(
    (gap, i) =>
      `${i + 1}. **${gap.practice} (${gap.score}/10)**: ${
        gap.practice === "Prenatal Nutrition"
          ? "Without pregnancy-specific nutrition, you may gain too much or too little, both of which affect your health and baby's. The app provides balanced meal plans that support healthy, appropriate weight gain."
          : gap.practice === "Exercise Safety"
            ? "Safe, consistent movement helps you feel strong and capable in your changing body. The app includes workouts that build strength and confidence, not restriction or excessive exercise."
            : gap.practice === "Stress Management"
              ? "Body image anxiety and stress can lead to unhealthy eating patterns or over-restriction. The app's mindset work helps you appreciate what your body is doing and feel confident."
              : gap.practice === "Wellness Tracking"
                ? "Tracking weight gain patterns (not obsessively, but mindfully) helps ensure you're on track for healthy gain. The app includes tracking tools that focus on health, not appearance."
                : gap.practice === "Sleep Quality"
                  ? "Poor sleep affects hunger hormones and can lead to excessive weight gain. The app's sleep optimization strategies help regulate your appetite and energy."
                  : `This gap affects your relationship with your changing body. The app addresses this with specific protocols for healthy weight gain and body confidence.`
      }`,
  )
  .join("\n\n")}

**What the app does differently:**
- Focuses on healthy, appropriate weight gain (not restriction)
- Balanced nutrition that supports you and baby
- Movement that builds strength and confidence
- Mindset work around body changes
- Prepares you for postpartum recovery
- Community of moms navigating body changes together

**Timeline:** This is about shifting your mindset throughout pregnancy. Most women feel more confident and at peace with their changing body within 2-3 weeks of focusing on health and strength rather than appearance.`,
      }
    }

    if (
      lowerNotes.includes("don't know") ||
      lowerNotes.includes("confused") ||
      lowerNotes.includes("what's safe") ||
      lowerNotes.includes("overwhelmed") ||
      lowerNotes.includes("conflicting")
    ) {
      const gaps = breakdown.filter((item) => item.score < 8).slice(0, 3)
      return {
        concern: "Confusion About What's Safe During Pregnancy",
        response: `The conflicting advice about pregnancy exercise and nutrition is overwhelming—one source says it's safe, another says it's dangerous, and you're left paralyzed by fear of doing the wrong thing. You need clear, evidence-based guidance you can trust.

**Why you're so confused (and how to get clarity based on your gaps):**

${gaps
  .map(
    (gap, i) =>
      `${i + 1}. **${gap.practice} (${gap.score}/10)**: ${
        gap.practice === "Exercise Safety"
          ? "Without clear guidance on what's safe for each trimester, you're either doing nothing (losing fitness) or doing things that might not be safe. The app provides specific do's and don'ts for every stage of pregnancy."
          : gap.practice === "Prenatal Nutrition"
            ? "The conflicting nutrition advice (eat this, avoid that, no wait it's fine) leaves you confused about what to eat. The app provides clear, evidence-based nutrition guidelines for pregnancy."
            : gap.practice === "Prenatal Care"
              ? "Without regular prenatal care and clear communication with your provider, you don't have a trusted source for what's safe for YOUR pregnancy. The app helps you prepare for appointments and understand your provider's guidance."
              : gap.practice === "Pelvic Floor Training"
                ? "Most women don't know how to do pelvic floor exercises correctly or why they matter. The app provides clear instruction and demonstrations so you know you're doing it right."
                : gap.practice === "Diastasis Prevention"
                  ? "Most women don't even know what diastasis recti is until it's too late. The app provides clear education and prevention exercises so you can protect your core."
                  : `This gap contributes to your confusion about what's safe. The app provides clear, evidence-based guidance so you can move forward with confidence.`
      }`,
  )
  .join("\n\n")}

**What the app does differently:**
- Clear, evidence-based guidance (not conflicting opinions)
- Specific do's and don'ts for each trimester
- Modifications as your pregnancy progresses
- Education about WHY things are safe or unsafe
- Confidence that you're doing the right things
- Community of moms following the same protocols

**Timeline:** Most women feel significantly less confused and more confident within 1 week of having clear, consistent guidance to follow. It's about replacing overwhelm with clarity.`,
      }
    }

    // Generic fallback with gap-specific explanations
    const gaps = breakdown.filter((item) => item.score < 8).slice(0, 3)
    return {
      concern: "Your Unique Pregnancy Journey",
      response: `Every pregnancy is different, and your specific situation deserves personalized attention. Based on your assessment, here are the key areas holding you back from optimal pregnancy wellness:

${gaps
  .map(
    (gap, i) =>
      `${i + 1}. **${gap.practice} (${gap.score}/10)**

${
  gap.practice === "Prenatal Care"
    ? "**What This Means:** You're not receiving consistent prenatal care or medical monitoring.\n**The Consequence:** Without regular checkups, potential complications can go undetected until they're serious. You're missing critical screenings, measurements, and guidance.\n**How the App Fixes This:** While the app doesn't replace medical care, it helps you prepare for appointments, track symptoms between visits, and understand what to monitor. We provide guidance on when to call your doctor and what questions to ask.\n**Timeline:** Start tracking symptoms now and schedule your next prenatal appointment within 1 week."
    : gap.practice === "Exercise Safety"
      ? "**What This Means:** You're either not exercising, doing unsafe exercises, or unsure what's safe during pregnancy.\n**The Consequence:** No exercise leads to excessive weight gain, poor labor preparation, difficult postpartum recovery. Unsafe exercise risks injury to you or baby.\n**How the App Fixes This:** The app provides trimester-specific, pregnancy-safe workouts with clear modifications. You'll know exactly what's safe and beneficial for each stage.\n**Timeline:** Start with gentle pregnancy-safe movement within 3 days. Build to consistent 3-4x/week routine within 2 weeks."
      : gap.practice === "Prenatal Nutrition"
        ? "**What This Means:** You're not eating pregnancy-specific nutrition focused on baby's development needs.\n**The Consequence:** Without adequate folate, iron, calcium, protein, and DHA, baby's development suffers and you risk complications like anemia, preeclampsia, gestational diabetes, and poor fetal growth.\n**How the App Fixes This:** The app provides pregnancy-specific meal plans with the exact nutrients you and baby need. You'll know what to eat, when, and why.\n**Timeline:** Implement prenatal nutrition protocols within 2-3 days. See improved energy and reduced symptoms within 1 week."
        : gap.practice === "Supplementation"
          ? "**What This Means:** You're not taking a complete prenatal supplement protocol.\n**The Consequence:** Even with good nutrition, it's nearly impossible to get enough folate, iron, calcium, and DHA from food alone. Deficiencies affect baby's brain development and your health.\n**How the App Fixes This:** The app provides a complete supplement protocol (prenatal vitamin, iron, calcium, DHA, vitamin D) with specific brands and doses.\n**Timeline:** Start prenatal supplements immediately. See improved energy within 1-2 weeks as iron levels improve."
          : gap.practice === "Stress Management"
            ? "**What This Means:** You're experiencing high stress without effective management strategies.\n**The Consequence:** Chronic stress during pregnancy affects baby's development, increases preterm labor risk, and makes all symptoms worse. Stress hormones cross the placenta.\n**How the App Fixes This:** The app provides pregnancy-safe stress management techniques (breathwork, meditation, gentle movement) that calm your nervous system.\n**Timeline:** Start daily stress management practices within 1 day. Notice reduced anxiety within 3-5 days of consistent practice."
            : gap.practice === "Sleep Quality"
              ? "**What This Means:** You're not getting the 8-10 hours of quality sleep your body needs during pregnancy.\n**The Consequence:** Poor sleep increases pregnancy complications, makes all symptoms worse, affects baby's development, and leaves you exhausted. Sleep is when your body heals and baby grows.\n**How the App Fixes This:** The app provides sleep optimization strategies (positioning, timing, environment, supplements) specifically for pregnancy.\n**Timeline:** Implement sleep protocols within 1-2 days. See improved sleep quality within 3-5 days."
              : gap.practice === "Pelvic Floor Training"
                ? "**What This Means:** You're not doing pelvic floor exercises to prepare for labor and prevent postpartum issues.\n**The Consequence:** Weak pelvic floor increases tearing risk during delivery and leads to postpartum incontinence, prolapse (organs dropping), and painful sex. Prevention now saves months of rehab later.\n**How the App Fixes This:** The app provides clear pelvic floor exercise instruction with demonstrations. You'll learn how to do them correctly and consistently.\n**Timeline:** Start pelvic floor exercises within 2 days. Build to daily practice within 1 week. See improved strength within 2-3 weeks."
                : gap.practice === "Diastasis Prevention"
                  ? "**What This Means:** You're not aware of or preventing diastasis recti (abdominal separation during pregnancy).\n**The Consequence:** 60% of pregnant women develop diastasis recti, which makes postpartum recovery harder, causes chronic back pain, and creates the 'mommy pooch.' Prevention is easier than fixing it later.\n**How the App Fixes This:** The app provides diastasis prevention exercises and teaches you which movements to avoid. You'll protect your core throughout pregnancy.\n**Timeline:** Start prevention exercises within 3 days. Maintain throughout pregnancy to minimize separation."
                  : gap.practice === "Symptom Management"
                    ? "**What This Means:** You're struggling with pregnancy symptoms (nausea, fatigue, pain) without effective management strategies.\n**The Consequence:** Unmanaged symptoms affect your nutrition, movement, mental health, and ability to function. They make pregnancy feel unbearable.\n**How the App Fixes This:** The app provides evidence-based strategies for managing nausea, fatigue, pain, and other symptoms through nutrition, movement, and supplements.\n**Timeline:** Implement symptom management protocols within 1-2 days. See improvement within 3-5 days."
                    : gap.practice === "Wellness Tracking"
                      ? "**What This Means:** You're not tracking important wellness metrics (weight, blood pressure, symptoms, baby's movements).\n**The Consequence:** Without tracking, potential issues can go unnoticed until they're serious. You and your doctor miss patterns that indicate problems.\n**How the App Fixes This:** The app includes tracking tools for weight, blood pressure, symptoms, baby's movements, and more. You'll have data to share with your doctor.\n**Timeline:** Start tracking within 1 day. Establish consistent tracking habit within 1 week."
                      : "This gap is affecting your pregnancy wellness. The app provides specific protocols to address this area."
}`,
  )
  .join("\n\n")}

**What the app does differently:** We provide a complete, integrated system that addresses all these gaps simultaneously—not just information, but a done-for-you plan with daily guidance, tracking, and support.`,
    }
  }

  const getGapExplanation = (practice: string, score: number): string => {
    if (score >= 8) {
      return `You're doing great in this area! Keep up the excellent work. ${practice} is a strong point for you.`
    }
    switch (practice) {
      case "Prenatal Care":
        return "Consistent prenatal care is crucial for monitoring your health and baby's development. Let's focus on making sure you have regular check-ins with your healthcare provider."
      case "Exercise Safety":
        return "Ensuring your exercise routine is pregnancy-safe is vital. We can help you find effective and safe ways to stay active throughout your pregnancy."
      case "Prenatal Nutrition":
        return "Nourishing your body with pregnancy-specific nutrients is key. We can guide you on making food choices that support both your health and your baby's growth."
      case "Supplementation":
        return "Prenatal supplements are essential to fill nutritional gaps. We can help you understand which supplements are important and why."
      case "Stress Management":
        return "Managing stress is important for both your well-being and your baby's. We offer techniques to help you relax and cope with pregnancy-related stress."
      case "Sleep Quality":
        return "Quality sleep is fundamental for recovery and development. We can provide strategies to improve your sleep patterns during pregnancy."
      case "Pelvic Floor Training":
        return "Pelvic floor exercises are important for labor preparation and postpartum recovery. We can guide you through effective exercises."
      case "Diastasis Prevention":
        return "Understanding and preventing diastasis recti is key for core health during and after pregnancy. We can provide you with the necessary information and exercises."
      case "Symptom Management":
        return "Pregnancy symptoms can be challenging. We can offer strategies to help you manage common discomforts like nausea and fatigue."
      case "Wellness Tracking":
        return "Tracking your wellness metrics provides valuable insights. We can help you establish a tracking routine that works for you."
      default:
        return `Focusing on ${practice} can make a significant difference in your pregnancy journey. Let's explore how we can improve this area.`
    }
  }

  const getComprehensiveGapExplanation = (practice: string, score: number) => {
    if (score >= 8) {
      return {
        status: "strong",
        explanation: `You're doing great in this area! Keep up the excellent work. ${practice} is a strong point for you.`,
      }
    }

    const explanations: Record<
      string,
      { whatThisMeans: string; consequence: string; howAppFixes: string; timeline: string }
    > = {
      "Prenatal Care": {
        whatThisMeans: "You're not receiving consistent prenatal care or medical monitoring throughout your pregnancy.",
        consequence:
          "Without regular checkups, potential complications (gestational diabetes, preeclampsia, fetal growth issues) can go undetected until they're serious. You're missing critical screenings, measurements, and guidance that protect you and baby.",
        howAppFixes:
          "While the app doesn't replace medical care, it helps you prepare for appointments, track symptoms between visits, understand what to monitor, and know when to call your doctor. We provide guidance on what questions to ask and what's normal vs. concerning.",
        timeline:
          "Start tracking symptoms now and schedule your next prenatal appointment within 1 week. Establish regular appointment schedule within 2 weeks.",
      },
      "Exercise Safety": {
        whatThisMeans: "You're either not exercising, doing unsafe exercises, or unsure what's safe during pregnancy.",
        consequence:
          "No exercise leads to excessive weight gain, poor labor preparation, difficult postpartum recovery, and increased risk of gestational diabetes. Unsafe exercise risks injury to you or baby, including falls, overheating, or abdominal trauma.",
        howAppFixes:
          "The app provides trimester-specific, pregnancy-safe workouts with clear modifications as your pregnancy progresses. You'll know exactly what's safe and beneficial for each stage, with demonstrations and guidance.",
        timeline:
          "Start with gentle pregnancy-safe movement within 3 days. Build to consistent 3-4x/week routine within 2 weeks. See improved energy and reduced symptoms within 1 week.",
      },
      "Prenatal Nutrition": {
        whatThisMeans: "You're not eating pregnancy-specific nutrition focused on baby's development needs.",
        consequence:
          "Without adequate folate, iron, calcium, protein, and DHA, baby's brain and organ development suffers. You risk complications like anemia, preeclampsia, gestational diabetes, and poor fetal growth. Baby may have developmental delays or birth defects.",
        howAppFixes:
          "The app provides pregnancy-specific meal plans with the exact nutrients you and baby need at each stage. You'll know what to eat, when, and why—with simple recipes and shopping lists.",
        timeline:
          "Implement prenatal nutrition protocols within 2-3 days. See improved energy and reduced symptoms within 1 week. Support optimal fetal development throughout pregnancy.",
      },
      Supplementation: {
        whatThisMeans: "You're not taking a complete prenatal supplement protocol.",
        consequence:
          "Even with good nutrition, it's nearly impossible to get enough folate, iron, calcium, and DHA from food alone. Deficiencies affect baby's brain development, increase birth defect risk, and leave you anemic and exhausted.",
        howAppFixes:
          "The app provides a complete supplement protocol (prenatal vitamin, iron, calcium, DHA, vitamin D) with specific brands, doses, and timing for optimal absorption.",
        timeline:
          "Start prenatal supplements immediately. See improved energy within 1-2 weeks as iron levels improve. Support baby's brain development throughout pregnancy.",
      },
      "Stress Management": {
        whatThisMeans: "You're experiencing high stress without effective management strategies.",
        consequence:
          "Chronic stress during pregnancy affects baby's brain development, increases preterm labor risk, raises blood pressure, and makes all symptoms worse. Stress hormones (cortisol) cross the placenta and affect baby's stress response system.",
        howAppFixes:
          "The app provides pregnancy-safe stress management techniques (breathwork, meditation, gentle movement, journaling) that calm your nervous system and reduce cortisol levels.",
        timeline:
          "Start daily stress management practices within 1 day. Notice reduced anxiety within 3-5 days of consistent practice. Protect baby's development throughout pregnancy.",
      },
      "Sleep Quality": {
        whatThisMeans: "You're not getting the 8-10 hours of quality sleep your body needs during pregnancy.",
        consequence:
          "Poor sleep increases pregnancy complications (preeclampsia, gestational diabetes, preterm labor), makes all symptoms worse, affects baby's development, and leaves you exhausted. Sleep is when your body heals and baby grows.",
        howAppFixes:
          "The app provides sleep optimization strategies (positioning for each trimester, timing, environment, supplements, relaxation techniques) specifically for pregnancy discomforts.",
        timeline:
          "Implement sleep protocols within 1-2 days. See improved sleep quality within 3-5 days. Maintain throughout pregnancy for optimal health.",
      },
      "Pelvic Floor Training": {
        whatThisMeans: "You're not doing pelvic floor exercises to prepare for labor and prevent postpartum issues.",
        consequence:
          "Weak pelvic floor increases tearing risk during delivery and leads to postpartum incontinence (leaking when you sneeze/cough), prolapse (organs dropping), and painful sex. Prevention now saves months of rehab later.",
        howAppFixes:
          "The app provides clear pelvic floor exercise instruction with video demonstrations. You'll learn how to do Kegels correctly, when to do them, and how to prepare for pushing during labor.",
        timeline:
          "Start pelvic floor exercises within 2 days. Build to daily practice within 1 week. See improved strength and control within 2-3 weeks.",
      },
      "Diastasis Prevention": {
        whatThisMeans: "You're not aware of or preventing diastasis recti (abdominal separation during pregnancy).",
        consequence:
          "60% of pregnant women develop diastasis recti, which makes postpartum recovery harder, causes chronic back pain, creates the 'mommy pooch,' and affects core function. Prevention is much easier than fixing it after birth.",
        howAppFixes:
          "The app provides diastasis prevention exercises and teaches you which movements to avoid (crunches, planks, heavy lifting). You'll protect your core throughout pregnancy and set yourself up for easier postpartum recovery.",
        timeline:
          "Start prevention exercises within 3 days. Maintain throughout pregnancy to minimize separation. Significantly easier postpartum recovery.",
      },
      "Symptom Management": {
        whatThisMeans:
          "You're struggling with pregnancy symptoms (nausea, fatigue, pain, heartburn) without effective management strategies.",
        consequence:
          "Unmanaged symptoms affect your nutrition (can't eat well), movement (too tired to exercise), mental health (anxiety and depression), and ability to function. Severe symptoms can lead to dehydration, malnutrition, and pregnancy complications.",
        howAppFixes:
          "The app provides evidence-based strategies for managing nausea, fatigue, pain, and other symptoms through nutrition, movement, and supplements.",
        timeline:
          "Implement symptom management protocols within 1-2 days. See improvement within 3-5 days. Adjust strategies as symptoms change throughout pregnancy.",
      },
      "Wellness Tracking": {
        whatThisMeans:
          "You're not tracking important wellness metrics (weight gain, blood pressure, symptoms, baby's movements).",
        consequence:
          "Without tracking, potential issues can go unnoticed until they're serious. You and your doctor miss patterns that indicate problems like preeclampsia, gestational diabetes, or fetal distress. You can't identify what's helping or hurting.",
        howAppFixes:
          "The app includes tracking tools for weight, blood pressure, symptoms, baby's movements, contractions, and more. You'll have data to share with your doctor and identify patterns that need attention.",
        timeline:
          "Start tracking within 1 day. Establish consistent tracking habit within 1 week. Use data to optimize your pregnancy health throughout.",
      },
    }

    const explanation = explanations[practice]
    if (!explanation) {
      return {
        status: "needs-work",
        explanation: `Focusing on ${practice} can make a significant difference in your pregnancy journey.`,
      }
    }

    return {
      status: "needs-work",
      whatThisMeans: explanation.whatThisMeans,
      consequence: explanation.consequence,
      howAppFixes: explanation.howAppFixes,
      timeline: explanation.timeline,
    }
  }

  const breakdown = getDetailedBreakdown()
  const personalizedResponse = quizState.additionalNotes ? getPersonalizedResponse(quizState.additionalNotes) : null

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

  const getTierTestimonials = () => {
    if (tier === "high") {
      return [
        {
          name: "Jessica M.",
          score: "Score: 78/120",
          quote:
            "I was already doing most things right, but the app helped me optimize the last 20%. I had the smoothest labor and easiest postpartum recovery of all my friends.",
          result: "Optimized pregnancy, 6-hour labor, back to pre-pregnancy weight in 8 weeks",
        },
        {
          name: "Amanda K.",
          score: "Score: 82/120",
          quote:
            "The VIP coaching helped me prepare mentally and physically for labor. I felt so confident and in control during delivery.",
          result: "Unmedicated birth, no tearing, felt amazing postpartum",
        },
      ]
    } else if (tier === "medium") {
      return [
        {
          name: "Rachel T.",
          score: "Score: 55/120",
          quote:
            "I was doing some things right but had major gaps. The app gave me a clear plan to follow. My energy improved within a week and I felt so much better the rest of my pregnancy.",
          result: "Avoided gestational diabetes, gained healthy weight, smooth delivery",
        },
        {
          name: "Lauren S.",
          score: "Score: 62/120",
          quote:
            "I didn't know what was safe during pregnancy and was too scared to exercise. The app showed me exactly what to do. I stayed active my entire pregnancy and recovered so fast postpartum.",
          result: "Stayed fit throughout pregnancy, 8-hour labor, no complications",
        },
      ]
    } else {
      return [
        {
          name: "Emily R.",
          score: "Score: 28/120",
          quote:
            "I was struggling with severe nausea and had no idea what to eat or how to exercise. The app's protocols helped me manage my symptoms and I actually started feeling good during pregnancy.",
          result: "Nausea reduced 70%, gained healthy weight, prepared for labor",
        },
        {
          name: "Sarah J.",
          score: "Score: 35/120",
          quote:
            "I was overwhelmed and didn't know where to start. The app gave me a step-by-step plan. I went from barely functioning to feeling strong and confident.",
          result: "Energy improved dramatically, avoided complications, smooth delivery",
        },
      ]
    }
  }

  return (
    <div className="min-h-screen p-4" style={{ background: "linear-gradient(135deg, #F8F5F2, #F0E6D2)" }}>
      <div className="max-w-4xl mx-auto">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>

        {/* Score Circle */}
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
                Your Pregnancy Wellness Score
              </h1>
              <Badge className="text-lg px-4 py-2" style={{ backgroundColor: getTierColor(), color: "white" }}>
                {getTierLabel()}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl mb-8">
          <CardHeader>
            <CardTitle className="text-2xl" style={{ color: "#A15C2F" }}>
              What Your Score Means
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {tier === "high" && (
              <>
                <p className="text-lg leading-relaxed" style={{ color: "#3A2412" }}>
                  <strong>Congratulations, {quizState.name}!</strong> You're in the top 15% of pregnant women. You're
                  attending prenatal care, doing pregnancy-safe exercise, eating well, managing stress, and preparing
                  your body for labor and postpartum recovery.
                </p>
                <p className="text-lg leading-relaxed" style={{ color: "#3A2412" }}>
                  <strong>What this means for your pregnancy:</strong> You're significantly reducing your risk of
                  complications like gestational diabetes, preeclampsia, and excessive weight gain. You're preparing
                  your body for an easier labor and faster postpartum recovery. You're supporting optimal fetal
                  development.
                </p>
                <p className="text-lg leading-relaxed" style={{ color: "#3A2412" }}>
                  <strong>The opportunity:</strong> You're doing most things right, but there are still 2-3 areas where
                  optimization could make your pregnancy even better. Small improvements in these areas can be the
                  difference between a good pregnancy and an exceptional one.
                </p>
              </>
            )}
            {tier === "medium" && (
              <>
                <p className="text-lg leading-relaxed" style={{ color: "#3A2412" }}>
                  <strong>{quizState.name}, you're building momentum!</strong> You've got solid foundations in
                  place—you're doing several things right. But there are 3-5 key gaps preventing you from feeling your
                  best and optimizing your pregnancy health.
                </p>
                <p className="text-lg leading-relaxed" style={{ color: "#3A2412" }}>
                  <strong>What this means for your pregnancy:</strong> You're at moderate risk for complications like
                  gestational diabetes, excessive weight gain, or difficult labor. You may be experiencing symptoms
                  (fatigue, nausea, pain) that are making pregnancy harder than it needs to be. Your postpartum recovery
                  may be more challenging without addressing these gaps.
                </p>
                <p className="text-lg leading-relaxed" style={{ color: "#3A2412" }}>
                  <strong>The opportunity:</strong> Closing these 3-5 gaps can dramatically improve how you feel during
                  pregnancy, reduce complication risk, and set you up for easier labor and postpartum recovery. Small,
                  strategic changes make a huge difference.
                </p>
              </>
            )}
            {tier === "low" && (
              <>
                <p className="text-lg leading-relaxed" style={{ color: "#3A2412" }}>
                  <strong>{quizState.name}, you're experiencing common pregnancy challenges.</strong> You may be
                  struggling with symptoms, unsure what's safe, or overwhelmed by conflicting advice. You're not
                  alone—many women start here.
                </p>
                <p className="text-lg leading-relaxed" style={{ color: "#3A2412" }}>
                  <strong>What this means for your pregnancy:</strong> Without addressing these gaps, you're at higher
                  risk for complications like gestational diabetes, preeclampsia, excessive weight gain, and difficult
                  labor. You may be experiencing severe symptoms that are affecting your quality of life. Your
                  postpartum recovery will likely be more challenging.
                </p>
                <p className="text-lg leading-relaxed" style={{ color: "#3A2412" }}>
                  <strong>The good news:</strong> Small, strategic changes can significantly improve your pregnancy
                  health. You don't need to be perfect—you just need to start addressing the top 3-5 gaps. Most women
                  see dramatic improvements within 1-2 weeks of implementing the right protocols.
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Detailed 10-point breakdown */}
        <Card className="border-0 shadow-xl mb-8">
          <CardHeader>
            <CardTitle className="text-2xl" style={{ color: "#A15C2F" }}>
              Your Detailed Pregnancy Breakdown
            </CardTitle>
            <p className="text-base" style={{ color: "#3A2412" }}>
              Here's exactly how your score was calculated across 10 key pregnancy wellness practices:
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
                    <span className="font-medium" style={{ color: "#3A2412" }}>
                      {item.practice}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold" style={{ color: "#A15C2F" }}>
                      {item.score}/{item.maxScore}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {personalizedResponse && (
          <Card className="border-0 shadow-xl mb-8" style={{ borderLeft: "6px solid #A15C2F" }}>
            <CardHeader>
              <CardTitle className="text-2xl" style={{ color: "#A15C2F" }}>
                💬 You Also Mentioned: Your Personalized Pregnancy Journey
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 rounded-lg" style={{ backgroundColor: "#F3E5F5" }}>
                <p className="italic text-lg" style={{ color: "#666" }}>
                  You shared: "{quizState.additionalNotes}"
                </p>
              </div>

              <p className="text-lg leading-relaxed" style={{ color: "#3A2412" }}>
                Based on your assessment, we'll create a customized pregnancy wellness plan that addresses your unique
                situation. Our program combines evidence-based protocols with personalized support to help you achieve
                your goal of a healthy pregnancy and optimal preparation for labor and postpartum.
              </p>

              <div className="p-6 rounded-lg border-2" style={{ borderColor: "#FFB74D", backgroundColor: "#FFF8E1" }}>
                <h3 className="text-xl font-bold mb-4" style={{ color: "#A15C2F" }}>
                  How This Connects to Your Score:
                </h3>
                <p className="mb-4" style={{ color: "#3A2412" }}>
                  Your concern about <strong>{personalizedResponse.concern.toLowerCase()}</strong> is directly related
                  to the gaps we identified. Here's what's holding you back:
                </p>
                <div className="space-y-4">
                  {breakdown
                    .filter((item) => item.score < 8)
                    .slice(0, 3)
                    .map((gap, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <span className="text-orange-600 font-bold text-lg flex-shrink-0">•</span>
                        <div>
                          <p className="font-bold" style={{ color: "#A15C2F" }}>
                            {gap.practice} ({gap.score}/10):
                          </p>
                          <p style={{ color: "#3A2412" }}>
                            {gap.practice.includes("Prenatal Care")
                              ? "You're not receiving consistent prenatal care or medical monitoring. Regular checkups are critical for catching potential complications early and ensuring baby's healthy development."
                              : gap.practice.includes("Exercise")
                                ? "You're either not exercising or unsure what's safe during pregnancy. Safe, consistent movement supports your health, prepares you for labor, and aids postpartum recovery."
                                : gap.practice.includes("Nutrition")
                                  ? "Your nutrition isn't optimized for pregnancy. Proper eating supports baby's development, your energy levels, and reduces complication risk."
                                  : gap.practice.includes("Supplementation")
                                    ? "You're not taking a complete prenatal supplement protocol. Key nutrients like folate, iron, and DHA are essential for baby's brain development and your health."
                                    : gap.practice.includes("Stress")
                                      ? "High stress affects baby's development and increases complication risk. Stress management techniques help you stay calm and support a healthy pregnancy."
                                      : gap.practice.includes("Sleep")
                                        ? "You're not getting adequate quality sleep. Sleep is when your body heals and baby grows - it's essential for pregnancy health."
                                        : gap.practice.includes("Pelvic")
                                          ? "You're not doing pelvic floor exercises. These prepare you for labor, reduce tearing risk, and prevent postpartum issues like incontinence."
                                          : gap.practice.includes("Diastasis")
                                            ? "You're not aware of diastasis recti prevention. Without proper core work, you risk abdominal separation that makes postpartum recovery harder."
                                            : gap.practice.includes("Symptom")
                                              ? "You're struggling with pregnancy symptoms without effective management. Proper strategies can significantly reduce nausea, fatigue, and discomfort."
                                              : `This gap is affecting your pregnancy wellness. Addressing it will help you feel better and support a healthier pregnancy.`}
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
                        These aren't just "nice to haves"—these gaps are directly affecting your pregnancy health and
                        baby's development. But here's the good news: they're ALL fixable with the right protocols and
                        support.
                      </p>
                    </div>

                    <div>
                      <p className="font-bold text-lg mb-3" style={{ color: "#A15C2F" }}>
                        What the App Does:
                      </p>
                      <div className="space-y-2">
                        <p className="flex items-start gap-2" style={{ color: "#3A2412" }}>
                          <span className="text-green-600 flex-shrink-0">✅</span>
                          <span>Complete pregnancy wellness system (all 10 practice areas covered)</span>
                        </p>
                        <p className="flex items-start gap-2" style={{ color: "#3A2412" }}>
                          <span className="text-green-600 flex-shrink-0">✅</span>
                          <span>Personalized protocols based on YOUR gaps and trimester</span>
                        </p>
                        <p className="flex items-start gap-2" style={{ color: "#3A2412" }}>
                          <span className="text-green-600 flex-shrink-0">✅</span>
                          <span>Pregnancy-safe workouts and modifications</span>
                        </p>
                        <p className="flex items-start gap-2" style={{ color: "#3A2412" }}>
                          <span className="text-green-600 flex-shrink-0">✅</span>
                          <span>Expert guidance and community support</span>
                        </p>
                        <p className="flex items-start gap-2" style={{ color: "#3A2412" }}>
                          <span className="text-green-600 flex-shrink-0">✅</span>
                          <span>Evidence-based interventions for optimal pregnancy health</span>
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="font-bold text-lg mb-2" style={{ color: "#A15C2F" }}>
                        Timeline:
                      </p>
                      <p style={{ color: "#3A2412" }}>
                        Most women see improved energy and reduced symptoms within 1-2 weeks, with continued
                        improvements throughout pregnancy leading to easier labor and faster postpartum recovery.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {tier === "high" && (
          <Card className="border-0 shadow-xl mb-8" style={{ background: "linear-gradient(135deg, #F8F5F2, #FFF8E1)" }}>
            <CardHeader>
              <CardTitle className="text-2xl" style={{ color: "#A15C2F" }}>
                You're in the Top 15% - Here's What's Next
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-lg" style={{ color: "#3A2412" }}>
                {quizState.name}, you're doing SO much right. You're attending prenatal care, doing pregnancy-safe
                exercise, managing stress, and preparing your body for labor. You're ahead of 85% of pregnant women.
              </p>

              <div className="space-y-6">
                <h3 className="text-xl font-bold" style={{ color: "#A15C2F" }}>
                  The 3 Optimization Opportunities:
                </h3>
                {breakdown
                  .filter((item) => item.score < 8)
                  .slice(0, 3)
                  .map((gap, index) => {
                    const explanation = getComprehensiveGapExplanation(gap.practice, gap.score)
                    if (explanation.status === "strong") return null
                    return (
                      <div
                        key={index}
                        className="p-6 rounded-lg space-y-4"
                        style={{ backgroundColor: "#FFF3E0", borderLeft: "4px solid #FFB74D" }}
                      >
                        <h4 className="font-bold text-xl" style={{ color: "#3A2412" }}>
                          {index + 1}. {gap.practice} ({gap.score}/10)
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <p className="font-semibold mb-1" style={{ color: "#A15C2F" }}>
                              What This Means:
                            </p>
                            <p style={{ color: "#3A2412" }}>{explanation.whatThisMeans}</p>
                          </div>
                          <div>
                            <p className="font-semibold mb-1" style={{ color: "#A15C2F" }}>
                              The Consequence:
                            </p>
                            <p style={{ color: "#3A2412" }}>{explanation.consequence}</p>
                          </div>
                          <div>
                            <p className="font-semibold mb-1" style={{ color: "#A15C2F" }}>
                              How the App Fixes This:
                            </p>
                            <p style={{ color: "#3A2412" }}>{explanation.howAppFixes}</p>
                          </div>
                          <div>
                            <p className="font-semibold mb-1" style={{ color: "#A15C2F" }}>
                              Timeline:
                            </p>
                            <p style={{ color: "#3A2412" }}>{explanation.timeline}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold" style={{ color: "#A15C2F" }}>
                  Women at Your Score Level:
                </h3>
                {getTierTestimonials().map((testimonial, index) => (
                  <div key={index} className="p-4 rounded-lg" style={{ backgroundColor: "#F8F5F2" }}>
                    <p className="italic mb-2" style={{ color: "#3A2412" }}>
                      "{testimonial.quote}"
                    </p>
                    <p className="font-semibold" style={{ color: "#A15C2F" }}>
                      — {testimonial.name}
                    </p>
                    <p className="text-sm" style={{ color: "#666" }}>
                      {testimonial.score} • {testimonial.result}
                    </p>
                  </div>
                ))}
              </div>

              <div className="text-center p-8 bg-white rounded-lg border-4" style={{ borderColor: "#A15C2F" }}>
                <h3 className="text-2xl font-bold mb-4" style={{ color: "#A15C2F" }}>
                  VIP Pregnancy Optimization Program
                </h3>
                <p className="text-lg mb-6" style={{ color: "#3A2412" }}>
                  For high-performing women who want exclusive 1-on-1 coaching to optimize every aspect of pregnancy,
                  labor prep, and postpartum planning.
                </p>
                <Button
                  size="lg"
                  className="w-full md:w-auto text-white px-6 py-3 text-base md:px-12 md:py-6 md:text-xl font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                  style={{ background: "linear-gradient(135deg, #A15C2F, #C27B48)" }}
                  onClick={() => {
                    const appUrl = new URL("https://catalystmomofficial.com/register")
                    appUrl.searchParams.set("email", quizState.email)
                    appUrl.searchParams.set("name", quizState.name)
                    appUrl.searchParams.set("score", score.toString())
                    appUrl.searchParams.set("tier", tier)
                    appUrl.searchParams.set("assessment", "pregnancy")
                    appUrl.searchParams.set("trimester", quizState.trimester)
                    appUrl.searchParams.set("weeks_pregnant", quizState.weeksPregnant)
                    appUrl.searchParams.set("goal", quizState.primaryGoal)
                    window.open(appUrl.toString(), "_blank")
                  }}
                >
                  Book Your VIP Strategy Call
                </Button>
                <p className="text-sm mt-4" style={{ color: "#3A2412", opacity: 0.7 }}>
                  Limited to 10 clients per month • Investment: $197/month
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {tier === "medium" && (
          <Card className="border-0 shadow-xl mb-8" style={{ background: "linear-gradient(135deg, #F8F5F2, #FFF8E1)" }}>
            <CardHeader>
              <CardTitle className="text-2xl" style={{ color: "#A15C2F" }}>
                You're Building Momentum - Let's Close the Gaps
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-lg" style={{ color: "#3A2412" }}>
                {quizState.name}, you've got solid foundations! You're doing many things right, but there are 3 key gaps
                preventing breakthrough results.
              </p>

              <div className="space-y-6">
                <h3 className="text-xl font-bold" style={{ color: "#A15C2F" }}>
                  Your 3 Priority Areas:
                </h3>
                {breakdown
                  .filter((item) => item.score < 8)
                  .slice(0, 3)
                  .map((gap, index) => {
                    const explanation = getComprehensiveGapExplanation(gap.practice, gap.score)
                    if (explanation.status === "strong") return null
                    return (
                      <div
                        key={index}
                        className="p-6 rounded-lg space-y-4"
                        style={{ backgroundColor: "#FFF3E0", borderLeft: "4px solid #FFB74D" }}
                      >
                        <h4 className="font-bold text-xl" style={{ color: "#3A2412" }}>
                          {index + 1}. {gap.practice} ({gap.score}/10)
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <p className="font-semibold mb-1" style={{ color: "#A15C2F" }}>
                              What This Means:
                            </p>
                            <p style={{ color: "#3A2412" }}>{explanation.whatThisMeans}</p>
                          </div>
                          <div>
                            <p className="font-semibold mb-1" style={{ color: "#A15C2F" }}>
                              The Consequence:
                            </p>
                            <p style={{ color: "#3A2412" }}>{explanation.consequence}</p>
                          </div>
                          <div>
                            <p className="font-semibold mb-1" style={{ color: "#A15C2F" }}>
                              How the App Fixes This:
                            </p>
                            <p style={{ color: "#3A2412" }}>{explanation.howAppFixes}</p>
                          </div>
                          <div>
                            <p className="font-semibold mb-1" style={{ color: "#A15C2F" }}>
                              Timeline:
                            </p>
                            <p style={{ color: "#3A2412" }}>{explanation.timeline}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold" style={{ color: "#A15C2F" }}>
                  Women at Your Score Level:
                </h3>
                {getTierTestimonials().map((testimonial, index) => (
                  <div key={index} className="p-4 rounded-lg" style={{ backgroundColor: "#F8F5F2" }}>
                    <p className="italic mb-2" style={{ color: "#3A2412" }}>
                      "{testimonial.quote}"
                    </p>
                    <p className="font-semibold" style={{ color: "#A15C2F" }}>
                      — {testimonial.name}
                    </p>
                    <p className="text-sm" style={{ color: "#666" }}>
                      {testimonial.score} • {testimonial.result}
                    </p>
                  </div>
                ))}
              </div>

              <div className="text-center p-8 bg-white rounded-lg border-4" style={{ borderColor: "#A15C2F" }}>
                <h3 className="text-2xl font-bold mb-4" style={{ color: "#A15C2F" }}>
                  Join the Catalyst Mom App
                </h3>
                <p className="text-lg mb-6" style={{ color: "#3A2412" }}>
                  Get pregnancy-safe workouts, meal plans, symptom management protocols, labor prep, and community
                  support—all in one app.
                </p>
                <Button
                  size="lg"
                  className="w-full md:w-auto text-white px-6 py-3 text-base md:px-12 md:py-6 md:text-xl font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                  style={{ background: "linear-gradient(135deg, #A15C2F, #C27B48)" }}
                  onClick={() => {
                    const appUrl = new URL("https://catalystmomofficial.com/register")
                    appUrl.searchParams.set("email", quizState.email)
                    appUrl.searchParams.set("name", quizState.name)
                    appUrl.searchParams.set("score", score.toString())
                    appUrl.searchParams.set("tier", tier)
                    appUrl.searchParams.set("assessment", "pregnancy")
                    appUrl.searchParams.set("trimester", quizState.trimester)
                    appUrl.searchParams.set("weeks_pregnant", quizState.weeksPregnant)
                    appUrl.searchParams.set("goal", quizState.primaryGoal)
                    window.open(appUrl.toString(), "_blank")
                  }}
                >
                  Join Now - $29/month
                </Button>
                <p className="text-sm mt-4" style={{ color: "#3A2412", opacity: 0.7 }}>
                  Start seeing results in 7 days • Cancel anytime • No contracts
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {tier === "low" && (
          <Card className="border-0 shadow-xl mb-8" style={{ background: "linear-gradient(135deg, #F8F5F2, #FFF8E1)" }}>
            <CardHeader>
              <CardTitle className="text-2xl" style={{ color: "#A15C2F" }}>
                Let's Build Your Pregnancy Wellness Foundations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-lg" style={{ color: "#3A2412" }}>
                {quizState.name}, you're experiencing some common pregnancy challenges. The good news? Small, strategic
                changes can significantly improve your pregnancy health.
              </p>

              <div className="space-y-6">
                <h3 className="text-xl font-bold" style={{ color: "#A15C2F" }}>
                  Your Top 5 Focus Areas:
                </h3>
                {breakdown
                  .filter((item) => item.score < 8)
                  .slice(0, 5)
                  .map((gap, index) => {
                    const explanation = getComprehensiveGapExplanation(gap.practice, gap.score)
                    if (explanation.status === "strong") return null
                    return (
                      <div
                        key={index}
                        className="p-6 rounded-lg space-y-4"
                        style={{ backgroundColor: "#FFEBEE", borderLeft: "4px solid #E57373" }}
                      >
                        <h4 className="font-bold text-xl" style={{ color: "#3A2412" }}>
                          {index + 1}. {gap.practice} ({gap.score}/10)
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <p className="font-semibold mb-1" style={{ color: "#A15C2F" }}>
                              What This Means:
                            </p>
                            <p style={{ color: "#3A2412" }}>{explanation.whatThisMeans}</p>
                          </div>
                          <div>
                            <p className="font-semibold mb-1" style={{ color: "#A15C2F" }}>
                              The Consequence:
                            </p>
                            <p style={{ color: "#3A2412" }}>{explanation.consequence}</p>
                          </div>
                          <div>
                            <p className="font-semibold mb-1" style={{ color: "#A15C2F" }}>
                              How the App Fixes This:
                            </p>
                            <p style={{ color: "#3A2412" }}>{explanation.howAppFixes}</p>
                          </div>
                          <div>
                            <p className="font-semibold mb-1" style={{ color: "#A15C2F" }}>
                              Timeline:
                            </p>
                            <p style={{ color: "#3A2412" }}>{explanation.timeline}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold" style={{ color: "#A15C2F" }}>
                  Women at Your Score Level:
                </h3>
                {getTierTestimonials().map((testimonial, index) => (
                  <div key={index} className="p-4 rounded-lg" style={{ backgroundColor: "#F8F5F2" }}>
                    <p className="italic mb-2" style={{ color: "#3A2412" }}>
                      "{testimonial.quote}"
                    </p>
                    <p className="font-semibold" style={{ color: "#A15C2F" }}>
                      — {testimonial.name}
                    </p>
                    <p className="text-sm" style={{ color: "#666" }}>
                      {testimonial.score} • {testimonial.result}
                    </p>
                  </div>
                ))}
              </div>

              <div className="text-center p-8 bg-white rounded-lg border-4" style={{ borderColor: "#A15C2F" }}>
                <h3 className="text-2xl font-bold mb-4" style={{ color: "#A15C2F" }}>
                  Join the Catalyst Mom App
                </h3>
                <p className="text-lg mb-6" style={{ color: "#3A2412" }}>
                  Get pregnancy-safe workouts, meal plans, symptom management protocols, labor prep, and community
                  support—all in one app.
                </p>
                <Button
                  size="lg"
                  className="w-full md:w-auto text-white px-6 py-3 text-base md:px-12 md:py-6 md:text-xl font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                  style={{ background: "linear-gradient(135deg, #A15C2F, #C27B48)" }}
                  onClick={() => {
                    const appUrl = new URL("https://catalystmomofficial.com/register")
                    appUrl.searchParams.set("email", quizState.email)
                    appUrl.searchParams.set("name", quizState.name)
                    appUrl.searchParams.set("score", score.toString())
                    appUrl.searchParams.set("tier", tier)
                    appUrl.searchParams.set("assessment", "pregnancy")
                    appUrl.searchParams.set("trimester", quizState.trimester)
                    appUrl.searchParams.set("weeks_pregnant", quizState.weeksPregnant)
                    appUrl.searchParams.set("goal", quizState.primaryGoal)
                    window.open(appUrl.toString(), "_blank")
                  }}
                >
                  Join Now - $29/month
                </Button>
                <p className="text-sm mt-4" style={{ color: "#3A2412", opacity: 0.7 }}>
                  Start seeing results in 7 days • Cancel anytime • No contracts
                </p>
              </div>
              <div className="text-center p-6 bg-amber-50 rounded-lg">
                <h3 className="text-lg font-bold mb-2" style={{ color: "#A15C2F" }}>
                  Questions?
                </h3>
                <p style={{ color: "#3A2412" }}>Email: support@catalystmom.online</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
