"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function ResultsPage({ params }: { params: { id: string } }) {
  const [quizState, setQuizState] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()
      const { data: response } = await supabase
        .from("lead_responses")
        .select("*")
        .eq("id", params.id)
        .single()

      if (!response) {
        setNotFound(true)
        setLoading(false)
        return
      }

      try {
        setQuizState(JSON.parse(response.special_notes || "{}"))
      } catch {
        setQuizState({})
      }
      setLoading(false)
    }
    fetchData()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, #F8F5F2, #F0E6D2)" }}>
        <p style={{ color: "#3A2412" }}>Loading your results…</p>
      </div>
    )
  }

  if (notFound || !quizState) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, #F8F5F2, #F0E6D2)" }}>
        <p style={{ color: "#3A2412" }}>Results not found.</p>
      </div>
    )
  }

  const score = quizState.score || 0
  const tier = quizState.score_tier || quizState.scoreTier || "low"

  const isTTC = quizState.cycleTracking !== undefined
  const isPregnancy = quizState.weeksPregnant !== undefined
  const isPostpartum = quizState.weeksPostpartum !== undefined

  if (isTTC) return <TTCResults score={score} tier={tier} quizState={quizState} />
  if (isPregnancy) return <PregnancyResults score={score} tier={tier} quizState={quizState} />
  if (isPostpartum) return <PostpartumResults score={score} tier={tier} quizState={quizState} />

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, #F8F5F2, #F0E6D2)" }}>
      <p style={{ color: "#3A2412" }}>Unknown assessment type.</p>
    </div>
  )
}

function getTierColor(score: number) {
  if (score <= 40) return "#E57373"
  if (score <= 70) return "#FFB74D"
  return "#81C784"
}

function getTierLabel(score: number) {
  if (score <= 40) return "Early Foundations Stage"
  if (score <= 70) return "Building Momentum Stage"
  return "Thriving & Ready Stage"
}

function DashboardButton({ quizState }: { quizState: any }) {
  return (
    <div className="mt-8">
      <Button
        size="lg"
        className="w-full md:w-auto text-white px-6 py-3 font-bold rounded-xl shadow-lg"
        style={{ background: "linear-gradient(135deg, #A15C2F, #C27B48)" }}
        onClick={() =>
          window.open(`https://catalystmomofficial.com/dashboard?assessment_id=${quizState.id}`, "_blank")
        }
      >
        Access Your Full Plan in the App
      </Button>
    </div>
  )
}

function TTCResults({ score, tier, quizState }: { score: number; tier: string; quizState: any }) {
  const color = getTierColor(score)
  return (
    <div className="min-h-screen p-4" style={{ background: "linear-gradient(135deg, #F8F5F2, #F0E6D2)" }}>
      <div className="max-w-4xl mx-auto">
        <Card className="border-0 shadow-xl mb-8">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <div className="w-32 h-32 rounded-full mx-auto flex items-center justify-center mb-4" style={{ backgroundColor: color }}>
                <span className="text-5xl font-bold text-white">{score}</span>
              </div>
              <h1 className="text-3xl font-bold mb-2" style={{ color: "#3A2412" }}>Your TTC Fertility Score</h1>
              <Badge className="text-lg px-4 py-2" style={{ backgroundColor: color, color: "white" }}>
                {getTierLabel(score)}
              </Badge>
            </div>
            <p className="text-lg" style={{ color: "#3A2412" }}>
              {tier === "high" && "You're on the right track! You've got solid foundations with room to optimize."}
              {tier === "medium" && "You're building momentum! There are key gaps to address for breakthrough results."}
              {tier === "low" && "There's significant opportunity to improve your fertility health."}
            </p>
            <DashboardButton quizState={quizState} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function PregnancyResults({ score, tier, quizState }: { score: number; tier: string; quizState: any }) {
  const color = getTierColor(score)
  return (
    <div className="min-h-screen p-4" style={{ background: "linear-gradient(135deg, #F8F5F2, #F0E6D2)" }}>
      <div className="max-w-4xl mx-auto">
        <Card className="border-0 shadow-xl mb-8">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <div className="w-32 h-32 rounded-full mx-auto flex items-center justify-center mb-4" style={{ backgroundColor: color }}>
                <span className="text-5xl font-bold text-white">{score}</span>
              </div>
              <h1 className="text-3xl font-bold mb-2" style={{ color: "#3A2412" }}>Your Pregnancy Wellness Score</h1>
              <Badge className="text-lg px-4 py-2" style={{ backgroundColor: color, color: "white" }}>
                {getTierLabel(score)}
              </Badge>
            </div>
            <p className="text-lg" style={{ color: "#3A2412" }}>
              {tier === "high" && "Congratulations! You're in the top 15% of pregnant women."}
              {tier === "medium" && "You're building momentum! You've got solid foundations but key gaps exist."}
              {tier === "low" && "You're experiencing common pregnancy challenges that we can help you fix."}
            </p>
            <DashboardButton quizState={quizState} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function PostpartumResults({ score, tier, quizState }: { score: number; tier: string; quizState: any }) {
  const color = getTierColor(score)
  return (
    <div className="min-h-screen p-4" style={{ background: "linear-gradient(135deg, #F8F5F2, #F0E6D2)" }}>
      <div className="max-w-4xl mx-auto">
        <Card className="border-0 shadow-xl mb-8">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <div className="w-32 h-32 rounded-full mx-auto flex items-center justify-center mb-4" style={{ backgroundColor: color }}>
                <span className="text-5xl font-bold text-white">{score}</span>
              </div>
              <h1 className="text-3xl font-bold mb-2" style={{ color: "#3A2412" }}>Your Postpartum Wellness Score</h1>
              <Badge className="text-lg px-4 py-2" style={{ backgroundColor: color, color: "white" }}>
                {getTierLabel(score)}
              </Badge>
            </div>
            <p className="text-lg" style={{ color: "#3A2412" }}>
              {tier === "high" && "Wow! You're doing SO much right - you're in the TOP 15%."}
              {tier === "medium" && "You've got some solid foundations in place!"}
              {tier === "low" && "You're experiencing some common challenges keeping you from feeling your best."}
            </p>
            <DashboardButton quizState={quizState} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
