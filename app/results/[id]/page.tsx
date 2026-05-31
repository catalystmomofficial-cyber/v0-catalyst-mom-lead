"use client"

import { useEffect } from 'react'
import { createClient } from "@/lib/supabase/client"
import { notFound } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { saveAssessment } from "@/app/actions/assessments"

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
    return <TTCResults score={score} tier={tier} quizState={quizState} />
  }

  if (isPregnancy) {
    return <PregnancyResults score={score} tier={tier} quizState={quizState} />
  }

  if (isPostpartum) {
    return <PostpartumResults score={score} tier={tier} quizState={quizState} />
  }

  return <div>Unknown assessment type</div>
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

function PostpartumResults({ score, tier, quizState }: { score: number; tier: string; quizState: any }) {
  // --- 1. Sanitize User Name Input ---
  const rawName = quizState.userName || quizState.name || ""
  const cleanName = (rawName.trim().length < 2 || /^[bcdfghjklmnpqrstvwxyz]+$/i.test(rawName.trim()) || rawName.toLowerCase() === 'none') 
    ? "Mama" 
    : rawName.trim()

  // --- 2. Extract Assessment Variables ---
  const primaryGoal: 'heal-dr' | 'weight-loss' | 'strength' | 'full-body' = quizState.primary_goal || quizState.primaryGoal || 'full-body'
  const userConcern = quizState.userConcern || quizState.concern || ""
  
  // --- 3. Determine Score Bracket (HIGH: 0-40, MEDIUM: 41-70, LOW: 71-100) ---
  let scoreBracket: 'high' | 'medium' | 'low' = 'medium'
  if (score <= 40) scoreBracket = 'high'
  else if (score > 70) scoreBracket = 'low'

  // --- Save Assessment Data ---
  useEffect(() => {
    const saveData = async () => {
      try {
        await saveAssessment({
          user_name: cleanName,
          primary_goal: primaryGoal,
          score: score,
          tier: scoreBracket,
          user_concern: userConcern || undefined,
          medical_clearance: quizState.medicalClearance,
          diastasis_recti: quizState.diastasisRecti,
          pelvic_floor: quizState.pelvicFloor,
          nutrition_protein: quizState.nutritionProtein,
        })
        console.log('[v0] Assessment saved successfully')
      } catch (error) {
        console.error('[v0] Failed to save assessment:', error)
      }
    }

    saveData()
  }, [])

  // --- 4. Goal-Based Action Plan Hooks ---
  const getGoalHook = () => {
    if (primaryGoal === 'heal-dr') {
      if (scoreBracket === 'high') {
        return `Your assessment shows a core baseline that needs immediate, gentle attention. Traditional gym exercises (like crunches, planks, or heavy twisting) will actually force your abdominal walls further apart and make the "mom pooch" look more prominent. The Catalyst Mom App has unlocked your specialized Knit-Healing Layer 1 Protocol. These are daily, zero-strain 15-minute foundational movements designed to close the gap safely from the inside out before you move to heavy full-body training.`
      } else if (scoreBracket === 'medium') {
        return `You have a solid starting foundation, but your core walls still lack the intra-abdominal support to handle everyday straining. The app has set your dashboard to Layer 2 Core Stabilization, focusing on knitting the deep transverse abdominis muscles together so you can lift your baby and move without core doming or back pain.`
      } else {
        return `Great work keeping your core engaged! Your dashboard is configured for Advanced Core Integration, protecting your alignment during functional, everyday movements while safely toning the outer layers.`
      }
    } else if (primaryGoal === 'weight-loss') {
      if (scoreBracket === 'high') {
        return `Trying to lose weight by cutting calories or doing intense cardio right now will backfire. When your body is fighting exhaustion and healing internal tissues, extreme stress patterns crash your metabolism and stall weight loss. The app focuses on your foundational recovery first: simple, zero-prep protein frameworks and nervous-system-calming movements that naturally lower cortisol and trigger sustainable fat loss without draining your energy.`
      } else if (scoreBracket === 'medium') {
        return `To trigger safe fat loss while protecting your healing tissues, your dashboard focuses on efficient, low-impact metabolic circuits paired with high-protein postpartum food structures. No extreme tracking required.`
      } else {
        return `Your energy systems are stable. Your dashboard will safely advance your workout intensity to lean muscle preservation and active conditioning blocks.`
      }
    } else if (primaryGoal === 'strength' || primaryGoal === 'full-body') {
      if (scoreBracket === 'high') {
        return `You are ready to feel strong again, which is amazing! However, trying to jump straight into traditional weighted squats, overhead presses, or running with a core foundation at this tier is like trying to build a brick house on quicksand. The app is locking out high-pressure movements for now. Your starting routine focuses entirely on stabilizing your hips, glutes, and inner pelvic wall so you can build the unbreakable foundation needed for heavy lifting without injury.`
      } else if (scoreBracket === 'medium') {
        return `Your structural foundation is coming back online. Your dashboard is introducing resistance bands and bodyweight progressive loads, ensuring your inner core matches your outer muscle strength step-for-step.`
      } else {
        return `Your core and pelvic alignment are ready for external load resistance. The app opens your full strength pathways, allowing you to lift heavier and progress safely.`
      }
    }
    return `Your assessment shows promising foundations. The app will guide your personalized recovery path.`
  }

  // --- 5. Check for Diastasis Recti Concern & Override Message ---
  const getDiastasisMessage = () => {
    const concernLower = userConcern.toLowerCase()
    if (['dr', 'diastasis', 'gap', 'pooch', 'ab separation'].some(keyword => concernLower.includes(keyword))) {
      return `You shared that you are dealing with Diastasis Recti (ab separation). Trying to fix a core gap with traditional workouts like crunches or planks will actually push your abdominal walls further apart and make the "mom pooch" worse. Inside the Catalyst Mom App, your 15-minute daily protocol skips the dangerous movements entirely. We focus exclusively on deep transverse abdominis (TVA) knit-healing exercises designed to draw those muscles back together, flatten your belly from the inside out, and safely rebuild your core strength.`
    }
    return null
  }

  // --- 6. Dynamic Button Text ---
  const getButtonText = () => {
    if (primaryGoal === 'heal-dr') return 'Heal My Core & Close The Ab Gap — $29/month'
    if (primaryGoal === 'weight-loss') return 'Drop the Pooch & Reclaim My Energy — $29/month'
    if (primaryGoal === 'strength' || primaryGoal === 'full-body') return 'Rebuild My Postpartum Strength Safely — $29/month'
    return 'Join the Catalyst Mom App Now — $29/month'
  }

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

  const diastasisMessage = getDiastasisMessage()

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
                {cleanName}, Your Postpartum Wellness Score
              </h1>
              <Badge className="text-lg px-4 py-2" style={{ backgroundColor: getTierColor(), color: "white" }}>
                {getTierLabel()}
              </Badge>
            </div>
            
            <div className="space-y-4 my-6 text-left max-w-2xl mx-auto p-4 bg-white/50 rounded-xl border border-stone-200">
              <p className="text-md leading-relaxed font-semibold mb-2" style={{ color: '#3A2412' }}>
                📊 Your {primaryGoal === 'heal-dr' ? 'Deep Core Action Plan' : primaryGoal === 'weight-loss' ? 'Postpartum Metabolic Recovery' : 'Path to True Functional Strength'}:
              </p>
              <p className="text-md leading-relaxed" style={{ color: '#3A2412' }}>
                {getGoalHook()}
              </p>
              {diastasisMessage && (
                <p className="text-md leading-relaxed pt-2 border-t border-dashed border-gray-300" style={{ color: '#3A2412' }}>
                  💬 Your Diastasis Recti Recovery: {diastasisMessage}
                </p>
              )}
            </div>

            <p className="text-lg mt-4" style={{ color: "#3A2412" }}>
              {scoreBracket === "high" && "Wow! You're doing SO much right - you're in the TOP 15%."}
              {scoreBracket === "medium" && "You've got some solid foundations in place!"}
              {scoreBracket === "low" && "You're experiencing some common challenges keeping you from feeling your best."}
            </p>

            <div className="mt-8">
              <Button
                size="lg"
                className="w-full md:w-auto text-white px-8 py-4 text-md font-bold rounded-xl shadow-lg transition-transform hover:scale-[1.02]"
                style={{ background: "linear-gradient(135deg, #A15C2F, #C27B48)" }}
                onClick={() =>
                  window.open(`https://catalystmomofficial.com/dashboard?assessment_id=${quizState.id}`, "_blank")
                }
              >
                {getButtonText()}
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                Feel more connected to your core in just 7 days. Cancel anytime. No contracts. Protocol requires only 15 mins/day.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
