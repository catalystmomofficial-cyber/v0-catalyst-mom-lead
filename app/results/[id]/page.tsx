import { createClient } from "@/lib/supabase/client"
import { notFound } from "next/navigation"
import { PostpartumResultsClient } from "./postpartum-results-client"

export const dynamic = "force-dynamic"

export default async function ResultsPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  const { data: response } = await supabase.from("lead_responses").select("*").eq("id", params.id).single()

  if (!response) {
    notFound()
  }

  let quizState: any = {}
  try {
    quizState = JSON.parse(response.special_notes || "{}")
  } catch (e) {
    console.error("Error parsing special_notes", e)
  }

  const score = quizState.score || 0
  const tier = quizState.scoreTier || "low"

  const isTTC = quizState.cycleTracking !== undefined
  const isPregnancy = quizState.weeksPregnant !== undefined
  const isPostpartum = quizState.weeksPostpartum !== undefined

  if (isTTC) {
    return <TTCResultsWrapper score={score} tier={tier} quizState={quizState} />
  }

  if (isPregnancy) {
    return <PregnancyResultsWrapper score={score} tier={tier} quizState={quizState} />
  }

  if (isPostpartum) {
    return <PostpartumResultsWrapper score={score} tier={tier} quizState={quizState} />
  }

  return <div>Unknown assessment type</div>
}

// Client wrapper for TTC results
function TTCResultsWrapper({ score, tier, quizState }: { score: number; tier: string; quizState: any }) {
  return <TTCResults score={score} tier={tier} quizState={quizState} />
}

// Client wrapper for Pregnancy results
function PregnancyResultsWrapper({ score, tier, quizState }: { score: number; tier: string; quizState: any }) {
  return <PregnancyResults score={score} tier={tier} quizState={quizState} />
}

// Client wrapper for Postpartum results
function PostpartumResultsWrapper({ score, tier, quizState }: { score: number; tier: string; quizState: any }) {
  return <PostpartumResultsClient score={score} tier={tier} quizState={quizState} />
}

function TTCResults({ score, tier, quizState }: { score: number; tier: string; quizState: any }) {
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
    <div className="min-h-screen p-4" style={{ background: "linear-gradient(135deg, #F8F5F2, #F0E6D2)" }}>
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
                Your TTC Fertility Score
              </h1>
              <Badge className="text-lg px-4 py-2" style={{ backgroundColor: getTierColor(), color: "white" }}>
                {getTierLabel()}
              </Badge>
            </div>
            <p className="text-lg" style={{ color: "#3A2412" }}>
              {tier === "high" && "You're on the right track! You've got solid foundations with room to optimize."}
              {tier === "medium" && "You're building momentum! There are key gaps to address for breakthrough results."}
              {tier === "low" && "There's significant opportunity to improve your fertility health."}
            </p>
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function PregnancyResults({ score, tier, quizState }: { score: number; tier: string; quizState: any }) {
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
    <div className="min-h-screen p-4" style={{ background: "linear-gradient(135deg, #F8F5F2, #F0E6D2)" }}>
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
                Your Pregnancy Wellness Score
              </h1>
              <Badge className="text-lg px-4 py-2" style={{ backgroundColor: getTierColor(), color: "white" }}>
                {getTierLabel()}
              </Badge>
            </div>
            <p className="text-lg" style={{ color: "#3A2412" }}>
              {tier === "high" && "Congratulations! You're in the top 15% of pregnant women."}
              {tier === "medium" && "You're building momentum! You've got solid foundations but key gaps exist."}
              {tier === "low" && "You're experiencing common pregnancy challenges that we can help you fix."}
            </p>
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


