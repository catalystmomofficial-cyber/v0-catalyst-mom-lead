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

const supabase = createClient()

const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const getPersonalizedResponse = (notes: string, breakdown: any[]) => {
  const lowerNotes = notes.toLowerCase()

  // Template 1: PCOS
  if (lowerNotes.includes("pcos") || lowerNotes.includes("polycystic")) {
    const topGaps = breakdown.filter((item) => item.score < 8).slice(0, 3)
    return {
      concern: "PCOS and Fertility",
      response: `I hear you on the PCOS struggle. It's frustrating when your body doesn't cooperate with your timeline. Here's what's happening: PCOS creates a perfect storm of hormonal imbalances—high insulin, elevated androgens, irregular ovulation. But here's the good news: PCOS is one of the MOST responsive conditions to lifestyle interventions.

Based on your assessment, here are the specific gaps making your PCOS worse:

${topGaps.map((gap, i) => `${i + 1}. **${gap.practice} (${gap.score}/10)**: ${getDetailedGapExplanation(gap.practice).consequence} ${getDetailedGapExplanation(gap.practice).appSolution}`).join("\n\n")}

**The PCOS-Fertility Connection:**
Your gaps are directly worsening your PCOS symptoms. Poor nutrition → insulin resistance → more androgens → less ovulation. High stress → cortisol spikes → more insulin resistance. No cycle tracking → you don't know IF or WHEN you ovulate.

**What the App Does for PCOS:**
✅ PCOS-specific meal plans (low-glycemic, anti-inflammatory, hormone-balancing)
✅ Ovulation tracking tools (because PCOS makes timing CRITICAL)
✅ Supplement protocols proven for PCOS (Inositol, NAC, Vitamin D, Omega-3s)
✅ Stress management (cortisol control is KEY for PCOS)
✅ Community of women with PCOS who GET IT

**Timeline:** Most women with PCOS see cycle regulation in 2-3 months, ovulation improvements in 3-4 months.`,
    }
  }

  // Template 2: Irregular Cycles
  if (lowerNotes.includes("irregular") || lowerNotes.includes("cycle") || lowerNotes.includes("period")) {
    const topGaps = breakdown.filter((item) => item.score < 8).slice(0, 3)
    return {
      concern: "Irregular Cycles",
      response: `Irregular cycles are SO frustrating when you're trying to conceive. You can't plan, you can't predict, and you feel like your body is working against you. I get it.

Here's what's likely causing your irregular cycles—and it's directly related to your assessment gaps:

${topGaps.map((gap, i) => `${i + 1}. **${gap.practice} (${gap.score}/10)**: ${getDetailedGapExplanation(gap.practice).consequence} ${getDetailedGapExplanation(gap.practice).appSolution}`).join("\n\n")}

**Why This Matters for Irregular Cycles:**
Irregular cycles = irregular ovulation = unpredictable fertile windows. You're trying to hit a moving target. But here's the thing: irregular cycles are almost ALWAYS fixable with the right interventions.

**What the App Does:**
✅ Cycle tracking system to identify YOUR patterns (even if irregular)
✅ Hormone-balancing nutrition protocols
✅ Stress management tools (stress is a MAJOR cycle disruptor)
✅ Supplement protocols for cycle regulation
✅ Ovulation prediction tools that work even with irregular cycles

**Timeline:** Most women see cycle regulation within 2-4 cycles of consistent implementation.`,
    }
  }

  // Template 3: Age Concerns
  if (
    lowerNotes.includes("age") ||
    lowerNotes.includes("old") ||
    lowerNotes.includes("35") ||
    lowerNotes.includes("40")
  ) {
    const topGaps = breakdown.filter((item) => item.score < 8).slice(0, 3)
    return {
      concern: "Age and Fertility",
      response: `I understand the age anxiety. The "biological clock" narrative is EVERYWHERE, and it creates so much pressure. But here's what the research actually shows: while age matters, OPTIMIZATION matters MORE.

A 38-year-old with optimized fertility health often conceives faster than a 28-year-old with poor habits. Your assessment shows specific areas where optimization will make the BIGGEST difference:

${topGaps.map((gap, i) => `${i + 1}. **${gap.practice} (${gap.score}/10)**: ${getDetailedGapExplanation(gap.practice).consequence} ${getDetailedGapExplanation(gap.practice).appSolution}`).join("\n\n")}

**Age-Related Fertility Facts:**
- Egg quality matters more than egg quantity
- Lifestyle interventions can improve egg quality in 90 days (one egg maturation cycle)
- Stress about age actually WORSENS fertility outcomes
- Proper supplementation (CoQ10, etc.) has been shown to improve outcomes for women 35+

**What the App Does for Age-Related Concerns:**
✅ Egg quality optimization protocols (nutrition, supplements, lifestyle)
✅ Advanced tracking to maximize timing (critical when fertile windows are shorter)
✅ Stress management (because age anxiety is real and counterproductive)
✅ Community of women 35+ who are successfully conceiving

**Timeline:** Egg quality improvements take 3 months (one full egg maturation cycle). Many women see results in 3-6 months.`,
    }
  }

  // Template 4: Stress/Overwhelm
  if (
    lowerNotes.includes("stress") ||
    lowerNotes.includes("overwhelm") ||
    lowerNotes.includes("anxious") ||
    lowerNotes.includes("anxiety")
  ) {
    const topGaps = breakdown.filter((item) => item.score < 8).slice(0, 3)
    return {
      concern: "Stress and TTC",
      response: `The stress of TTC is REAL. Every month feels like a test you're failing. Every pregnancy announcement feels like a punch. The "just relax" advice makes you want to scream. I see you.

Here's what's happening: chronic stress elevates cortisol, which suppresses reproductive hormones. Your body literally thinks it's in survival mode and deprioritizes reproduction. But your assessment shows specific stressors that are making it worse:

${topGaps.map((gap, i) => `${i + 1}. **${gap.practice} (${gap.score}/10)**: ${getDetailedGapExplanation(gap.practice).consequence} ${getDetailedGapExplanation(gap.practice).appSolution}`).join("\n\n")}

**The Stress-Fertility Connection:**
High stress → High cortisol → Suppressed ovulation → Delayed conception. Studies show women with high stress take 45% longer to conceive. But here's the key: you can't just "relax"—you need TOOLS.

**What the App Does:**
✅ Daily stress management protocols (breathwork, meditation, fertility yoga)
✅ Community support (you're not alone in this)
✅ 1-on-1 Human Check-ins — Bi-weekly expert progress reviews.
�� Tracking tools to reduce the mental load
✅ Evidence-based protocols so you KNOW you're doing the right things

**Timeline:** Stress hormone improvements can happen in 2-4 weeks. Fertility improvements follow in 1-2 cycles.`,
    }
  }

  // Template 5: Partner Issues
  if (
    lowerNotes.includes("partner") ||
    lowerNotes.includes("husband") ||
    lowerNotes.includes("spouse") ||
    lowerNotes.includes("male factor")
  ) {
    const topGaps = breakdown.filter((item) => item.score < 8).slice(0, 3)
    return {
      concern: "Partner Involvement",
      response: `Partner challenges in TTC are SO common and rarely talked about. Whether it's male factor issues, lack of engagement, or just feeling like you're carrying the mental load alone—it's exhausting.

Here's what your assessment shows about YOUR fertility optimization (because you can only control what you can control):

${topGaps.map((gap, i) => `${i + 1}. **${gap.practice} (${gap.score}/10)**: ${getDetailedGapExplanation(gap.practice).consequence} ${getDetailedGapExplanation(gap.practice).appSolution}`).join("\n\n")}

**The Partner Factor:**
While you can't control your partner's health or engagement, you CAN optimize YOUR side of the equation. And often, when partners see YOU taking action and getting results, they become more engaged.

**What the App Does:**
✅ Partner education resources (help them understand the process)
✅ Shareable cycle reports (so they know when timing matters)
✅ Male fertility optimization guides (if he's willing)
✅ Communication tools for navigating TTC as a couple
✅ Community support from women in similar situations

**Timeline:** Your fertility improvements: 2-3 months. Partner engagement often improves when they see your commitment and results.`,
    }
  }

  // Template 6: Don't Know Where to Start
  if (
    lowerNotes.includes("don't know") ||
    lowerNotes.includes("confused") ||
    lowerNotes.includes("overwhelmed") ||
    lowerNotes.includes("where to start")
  ) {
    const topGaps = breakdown.filter((item) => item.score < 8).slice(0, 3)
    return {
      concern: "Feeling Overwhelmed",
      response: `The overwhelm is REAL. There's so much conflicting advice—track this, eat that, avoid this, supplement with that. It's paralyzing. You just want someone to tell you EXACTLY what to do.

Based on your assessment, here are your 3 highest-impact areas (fix these FIRST):

${topGaps.map((gap, i) => `${i + 1}. **${gap.practice} (${gap.score}/10)**: ${getDetailedGapExplanation(gap.practice).consequence} ${getDetailedGapExplanation(gap.practice).appSolution}`).join("\n\n")}

**Why This Matters:**
You don't need to do EVERYTHING. You need to do the RIGHT things in the RIGHT order. These 3 gaps are your highest leverage points—fix these and you'll see the biggest improvements fastest.

**What the App Does:**
✅ Step-by-step protocols (no guessing, no overwhelm)
✅ Prioritized action plans (what to do first, second, third)
✅ All the tools in one place (tracking, nutrition, workouts, supplements)
✅ 24/7 Catalyst AI Expert — Instant answers to any wellness question.
✅ Community support from women who've been where you are

**Timeline:** You'll feel less overwhelmed within 1 week. You'll see measurable improvements in 4-6 weeks.`,
    }
  }

  // Default Template: General Support
  const topGaps = breakdown.filter((item) => item.score < 8).slice(0, 3)
  return {
    concern: "Your TTC Journey",
    response: `Thank you for sharing your TTC journey with me. Based on your assessment, I can see exactly what's holding you back—and more importantly, how to fix it.

Here are the 3 key gaps preventing faster conception:

${topGaps.map((gap, i) => `${i + 1}. **${gap.practice} (${gap.score}/10)**: ${getDetailedGapExplanation(gap.practice).consequence} ${getDetailedGapExplanation(gap.practice).appSolution}`).join("\n\n")}

**What This Means:**
These aren't just "nice to haves"—these gaps are directly delaying conception. But here's the good news: they're ALL fixable with the right protocols and support.

**What the App Does:**
✅ Complete fertility optimization system (all 10 practice areas covered)
✅ Personalized protocols based on YOUR gaps
✅ Daily tracking and accountability
✅ Expert guidance and community support
✅ Evidence-based interventions that actually work

**Timeline:** Most women see measurable improvements in 4-8 weeks, with conception often following in 2-4 cycles.`,
  }
}

const getDetailedGapExplanation = (practice: string) => {
  const explanations: Record<
    string,
    { whatThisMeans: string; consequence: string; appSolution: string; timeline: string }
  > = {
    "Cycle Tracking": {
      whatThisMeans:
        "You're not tracking your menstrual cycle consistently. This means you don't know when you're most fertile, can't identify irregular patterns, and are timing intercourse based on guesses instead of data.",
      consequence:
        "Without cycle data, you're trying to conceive blindfolded. Most couples in this situation waste 6-12 months trying on the WRONG days. You might be ovulating on Day 18, not Day 14—and missing your window entirely.",
      appSolution:
        "The app provides a digital cycle tracker, fertile window calculator, pattern recognition alerts, and shareable reports for your doctor. You'll know EXACTLY when you're fertile.",
      timeline: "2-3 cycles of tracking = you'll know your patterns exactly",
    },
    "Ovulation Awareness": {
      whatThisMeans:
        "You're not confirming ovulation. You might think you ovulate on Day 14 (the 'average'), but without tracking, you have no idea if or when it's actually happening.",
      consequence:
        "Without ovulation confirmation, you're guessing. Studies show couples who track ovulation conceive 2-3x faster than those who don't. You could be trying on completely wrong days.",
      appSolution:
        "The app includes OPK tracking, BBT charting guides, cervical mucus education, and timing recommendations. You'll KNOW when you ovulate.",
      timeline: "1-2 cycles to confirm your ovulation pattern",
    },
    "Fertility Nutrition": {
      whatThisMeans:
        "You're not eating fertility-supporting foods consistently. Your nutrition isn't optimized for egg quality, hormone balance, or implantation support.",
      consequence:
        "Poor nutrition directly impacts egg quality (takes 90 days to mature an egg), hormone production, and your body's ability to support early pregnancy. You're leaving conception to chance.",
      appSolution:
        "The app provides hormone-balancing meal plans, egg quality boosters, implantation-supporting foods, and anti-inflammatory recipes. Every meal supports your fertility.",
      timeline: "1-2 months for hormone improvements, 3 months for egg quality",
    },
    Supplementation: {
      whatThisMeans:
        "You're not taking fertility-supporting supplements. Folate, CoQ10, Vitamin D, and other key nutrients are missing from your protocol.",
      consequence:
        "These aren't optional—they directly impact egg quality, implantation, and early pregnancy development. Deficiencies can delay conception by months and increase miscarriage risk.",
      appSolution:
        "The app provides a complete supplement protocol with exact dosages, timing recommendations, and recommended brands. No guessing.",
      timeline: "3 months for full egg quality improvements (one egg maturation cycle)",
    },
    "Stress Management": {
      whatThisMeans:
        "Chronic stress is affecting your fertility hormones. High cortisol suppresses ovulation and reduces conception chances.",
      consequence:
        "Studies show women with high stress take 45% longer to conceive. Your body thinks it's in survival mode and deprioritizes reproduction.",
      appSolution:
        "The app includes daily breathwork, meditation, fertility yoga, and mindset coaching. You'll have tools to manage stress, not just advice to 'relax.'",
      timeline: "2-4 weeks for stress hormone improvements, 1-2 cycles for fertility impact",
    },
    "Sleep Quality": {
      whatThisMeans:
        "You're not getting 7-9 hours of quality sleep. Sleep is when your body produces reproductive hormones.",
      consequence:
        "Poor sleep = poor hormone production. Studies show women who sleep less than 7 hours have 15% lower conception rates. Your body can't make the hormones it needs.",
      appSolution:
        "The app provides sleep optimization protocols, bedtime routines, and circadian rhythm support. You'll sleep better and produce more reproductive hormones.",
      timeline: "2-3 weeks for sleep improvements, 1-2 months for hormone impact",
    },
    "Exercise Balance": {
      whatThisMeans:
        "You're either not exercising enough (sedentary) or exercising too intensely. Both extremes suppress fertility.",
      consequence:
        "Too little exercise = insulin resistance and hormone imbalances. Too much exercise = suppressed ovulation. You need the 'Goldilocks zone'—just right.",
      appSolution:
        "The app provides conception-boosting workouts (moderate intensity, fertility-safe exercises). You'll exercise in the sweet spot for fertility.",
      timeline: "4-6 weeks for metabolic improvements, 2-3 months for full fertility impact",
    },
    "Alcohol Consumption": {
      whatThisMeans:
        "Alcohol consumption impacts egg quality and hormone balance. Even moderate drinking affects fertility.",
      consequence:
        "Studies show even 3-5 drinks per week reduces conception rates by 18%. Alcohol disrupts hormone production and damages developing eggs.",
      appSolution:
        "The app provides education on alcohol's impact, mocktail recipes, and support for reducing consumption. You'll make informed choices.",
      timeline: "Immediate hormone improvements, 3 months for egg quality (one maturation cycle)",
    },
    "Smoking/Nicotine": {
      whatThisMeans:
        "Smoking significantly reduces fertility by damaging eggs, disrupting hormones, and reducing implantation rates.",
      consequence:
        "Smoking ages your ovaries by 10+ years and reduces conception chances by 30-40%. It's one of the biggest fertility destroyers.",
      appSolution:
        "The app provides cessation support, alternative stress management tools, and community accountability. Quitting is the single best thing you can do.",
      timeline: "3-6 months for full fertility recovery after quitting",
    },
    "Wellness Tracking": {
      whatThisMeans:
        "You're not tracking fertility metrics (BBT, cervical mucus, etc.). Without data, you can't identify patterns or optimize timing.",
      consequence:
        "No tracking = no insights. You're flying blind. You might have a luteal phase defect, anovulatory cycles, or other issues you don't even know about.",
      appSolution:
        "The app provides comprehensive tracking tools for all fertility metrics. You'll have data to share with your doctor and optimize your approach.",
      timeline: "2-3 cycles to identify patterns and optimize",
    },
  }

  return (
    explanations[practice] || {
      whatThisMeans: "This area needs attention to optimize your fertility.",
      consequence: "This gap may be delaying conception.",
      appSolution: "The app provides comprehensive protocols and support.",
      timeline: "2-3 months for improvements",
    }
  )
}

export default function TTCAssessment() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [quizState, setQuizState] = useState<QuizState>({
    name: "",
    email: "",
    ttcDuration: "",
    cycleTracking: "",
    ovulationAwareness: "",
    fertilityNutrition: "",
    supplementation: "",
    stress: "",
    sleep: "",
    exercise: "",
    alcohol: "",
    smoking: "",
    workoutRoutine: "",
    tracking: "",
    primaryGoal: "",
    biggestObstacle: "",
    supportType: "",
    dietaryRestrictions: "",
    additionalNotes: "",
  })
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [scoreTier, setScoreTier] = useState<"low" | "medium" | "high">("low")
  const [isLoading, setIsLoading] = useState(false)

  const questions = [
    {
      id: "ttc-duration",
      title: "How long have you been trying to conceive?",
      subtitle: "This helps us understand where you are in your journey",
      type: "radio",
      field: "ttcDuration",
      options: [
        { value: "less-3", label: "Less than 3 months" },
        { value: "3-6", label: "3 to 6 months" },
        { value: "6-12", label: "6 to 12 months" },
        { value: "1-2", label: "1 to 2 years" },
        { value: "2+", label: "2 years or more" },
      ],
    },
    {
      id: "cycle-tracking",
      title: "Are you tracking your menstrual cycle?",
      subtitle: "Understanding your cycle is foundational for conception",
      type: "radio",
      field: "cycleTracking",
      options: [
        { value: "yes-app", label: "Yes, using an app or method consistently" },
        { value: "sometimes", label: "Sometimes, but not consistently" },
        { value: "irregular", label: "My cycle is too irregular to track" },
        { value: "no", label: "No, I am not tracking it" },
      ],
    },
    {
      id: "ovulation",
      title: "Do you know when you ovulate?",
      subtitle: "Timing is one of the most critical factors for conception",
      type: "radio",
      field: "ovulationAwareness",
      options: [
        { value: "yes", label: "Yes, I track ovulation signs or use OPKs" },
        { value: "roughly", label: "Roughly, but not precisely" },
        { value: "irregular", label: "My cycle is too irregular to predict" },
        { value: "no", label: "No, I have no idea" },
      ],
    },
    {
      id: "fertility-nutrition",
      title: "How well are you nourishing your body for fertility?",
      subtitle: "Nutrition directly impacts egg quality and hormone balance",
      type: "radio",
      field: "fertilityNutrition",
      options: [
        { value: "yes", label: "Well — I focus on fertility-supporting foods" },
        { value: "sometimes", label: "Okay — I try but it is inconsistent" },
        { value: "trying", label: "I eat healthy but do not focus on fertility specifically" },
        { value: "no", label: "Poorly — I eat whatever is available" },
      ],
    },
    {
      id: "stress",
      title: "How would you describe your stress levels right now?",
      subtitle: "Chronic stress directly impacts reproductive hormones",
      type: "radio",
      field: "stress",
      options: [
        { value: "low", label: "Low — I manage stress well" },
        { value: "moderate", label: "Moderate — some stress but manageable" },
        { value: "high", label: "High — I am constantly stressed" },
        { value: "very-high", label: "Very high — the TTC journey is consuming me" },
      ],
    },
    {
      id: "sleep",
      title: "Are you getting 7 to 9 hours of quality sleep most nights?",
      subtitle: "Sleep is when your body produces reproductive hormones",
      type: "radio",
      field: "sleep",
      options: [
        { value: "yes", label: "Yes, 7 to 9 hours most nights" },
        { value: "mostly", label: "Mostly, but some nights less" },
        { value: "no", label: "No, I average 5 to 6 hours" },
        { value: "poor", label: "Less than 5 hours most nights" },
      ],
    },
    {
      id: "name",
      title: "Almost there! What is your first name?",
      subtitle: "So we can personalize your fertility score",
      type: "text",
      field: "name",
      placeholder: "Enter your first name",
    },
    {
      id: "email",
      title: "Where should we send your personalized results?",
      subtitle: "We will email your full fertility assessment breakdown",
      type: "email",
      field: "email",
      placeholder: "your@email.com",
    },
    {
      id: "primary-goal",
      title: "What is your primary goal right now?",
      subtitle: "This helps us personalize your roadmap",
      type: "radio",
      field: "primaryGoal",
      options: [
        { value: "conceive", label: "Get pregnant as soon as possible" },
        { value: "optimize", label: "Optimize my overall fertility health" },
        { value: "understand", label: "Understand my cycle and ovulation better" },
        { value: "prepare", label: "Prepare my body before trying" },
        { value: "support", label: "Get support through the emotional toll of TTC" },
      ],
    },
    {
      id: "biggest-obstacle",
      title: "What is the biggest thing stopping you right now?",
      subtitle: "Knowing this helps us support you better",
      type: "radio",
      field: "biggestObstacle",
      options: [
        { value: "dont-know", label: "I do not know where to start" },
        { value: "irregular", label: "Irregular cycles or a condition like PCOS" },
        { value: "stress", label: "Stress and the emotional weight of trying" },
        { value: "no-support", label: "No support or accountability" },
        { value: "overwhelmed", label: "Overwhelmed by conflicting advice online" },
      ],
    },
    {
      id: "additional-notes",
      title: "Anything else we should know?",
      subtitle: "Share any conditions, concerns, or context that might help",
      type: "textarea",
      field: "additionalNotes",
      placeholder: "E.g., PCOS, endometriosis, irregular cycles, partner concerns...",
    },
  ]

  const calculateScore = () => {
    let totalScore = 0

    // Q1: TTC duration (always 10 — for context, not scored negatively)
    totalScore += 10

    // Q2: Cycle tracking
    if (quizState.cycleTracking === "yes-app") totalScore += 10
    else if (quizState.cycleTracking === "sometimes") totalScore += 6
    else if (quizState.cycleTracking === "irregular") totalScore += 3
    else totalScore += 0

    // Q3: Ovulation awareness
    if (quizState.ovulationAwareness === "yes") totalScore += 10
    else if (quizState.ovulationAwareness === "roughly") totalScore += 6
    else if (quizState.ovulationAwareness === "irregular") totalScore += 3
    else totalScore += 0

    // Q4: Fertility nutrition
    if (quizState.fertilityNutrition === "yes") totalScore += 10
    else if (quizState.fertilityNutrition === "sometimes") totalScore += 6
    else if (quizState.fertilityNutrition === "trying") totalScore += 3
    else totalScore += 0

    // Q5: Stress
    if (quizState.stress === "low") totalScore += 10
    else if (quizState.stress === "moderate") totalScore += 6
    else if (quizState.stress === "high") totalScore += 2
    else totalScore += 0

    // Q7: Sleep
    if (quizState.sleep === "yes") totalScore += 10
    else if (quizState.sleep === "mostly") totalScore += 7
    else if (quizState.sleep === "no") totalScore += 2
    else totalScore += 0

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

        const customProperties = {
          assessment_type: "TTC",
          score: calculatedScore,
          score_tier: tier,
          ttc_duration: quizState.ttcDuration, // Corrected from quizState.duration
          primary_goal: quizState.primaryGoal,
          biggest_obstacle: quizState.biggestObstacle,
          cycle_tracking: quizState.cycleTracking,
          ovulation_awareness: quizState.ovulationAwareness,
        }

        const omnisendResult = await addContactToOmnisend({
          email: quizState.email,
          firstName: quizState.name,
          tags: ["ttc-assessment", `score-${tier}`],
          customProperties: customProperties,
        })

        console.log("[v0] TTC Omnisend first call result:", omnisendResult)

        const { data, error: supabaseError } = await supabase
          .from("lead_responses")
          .insert({
            name: quizState.name,
            email: quizState.email,
            primary_goal: quizState.primaryGoal,
            activity_level: quizState.exercise || "not-specified",
            equipment: quizState.workoutRoutine || "not-specified",
            dietary_preferences: quizState.dietaryRestrictions || "none",
            special_notes: JSON.stringify({
              assessment_type: "ttc",
              score: calculatedScore,
              score_tier: tier,
              ttc_duration: quizState.ttcDuration,
              biggest_obstacle: quizState.biggestObstacle,
              support_preference: quizState.supportType,
              additional_notes: quizState.additionalNotes,
              cycle_tracking: quizState.cycleTracking,
              ovulation_awareness: quizState.ovulationAwareness,
              fertility_nutrition: quizState.fertilityNutrition,
              supplementation: quizState.supplementation,
              stress: quizState.stress,
              sleep: quizState.sleep,
              alcohol: quizState.alcohol,
              smoking: quizState.smoking,
              tracking: quizState.tracking,
            }),
            created_at: new Date().toISOString(),
          })
          .select()

        console.log("[v0] Supabase insert response:", data)

        if (data && data[0]) {
          sessionStorage.setItem("ttc_assessment_id", data[0].id)
          const resultsUrl = `https://catalystmom.online/results/${data[0].id}`

          // Second Omnisend call - update with results URL
          const omnisendUpdateResult = await addContactToOmnisend({
            email: quizState.email,
            firstName: quizState.name,
            tags: ["ttc-assessment", `score-${tier}`],
            customProperties: {
              ...customProperties,
              results_url: resultsUrl,
            },
          })

          console.log("[v0] TTC Omnisend second call result:", omnisendUpdateResult)
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

    return value !== ""
  }

  if (showResults) {
    return <TTCResultsPage score={score} tier={scoreTier} quizState={quizState} />
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
              <div>
                <img src="/catalyst-mom-logo.png" alt="Catalyst Mom" className="h-8 w-8" />
              </div>
              <span className="font-bold" style={{ color: "#A15C2F" }}>
                Catalyst Mom - TTC
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

function TTCResultsPage({
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
        practice: "Cycle Tracking",
        score:
          quizState.cycleTracking === "yes-app"
            ? 10
            : quizState.cycleTracking === "sometimes"
              ? 5
              : quizState.cycleTracking === "irregular"
                ? 3
                : 0,
        maxScore: 10,
        status:
          quizState.cycleTracking === "yes-app"
            ? "excellent"
            : quizState.cycleTracking === "sometimes"
              ? "good"
              : "needs-attention",
      },
      {
        practice: "Ovulation Awareness",
        score:
          quizState.ovulationAwareness === "yes"
            ? 10
            : quizState.ovulationAwareness === "roughly"
              ? 5
              : quizState.ovulationAwareness === "irregular"
                ? 2
                : 0,
        maxScore: 10,
        status:
          quizState.ovulationAwareness === "yes"
            ? "excellent"
            : quizState.ovulationAwareness === "roughly"
              ? "good"
              : "needs-attention",
      },
      {
        practice: "Fertility Nutrition",
        score:
          quizState.fertilityNutrition === "yes"
            ? 10
            : quizState.fertilityNutrition === "sometimes"
              ? 5
              : quizState.fertilityNutrition === "trying"
                ? 3
                : 0,
        maxScore: 10,
        status:
          quizState.fertilityNutrition === "yes"
            ? "excellent"
            : quizState.fertilityNutrition === "sometimes"
              ? "good"
              : "needs-attention",
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
        status:
          quizState.supplementation === "yes"
            ? "excellent"
            : quizState.supplementation === "some"
              ? "good"
              : "needs-attention",
      },
      {
        practice: "Stress Management",
        score: quizState.stress === "low" ? 10 : quizState.stress === "moderate" ? 5 : 0,
        maxScore: 10,
        status: quizState.stress === "low" ? "excellent" : quizState.stress === "moderate" ? "good" : "needs-attention",
      },
      {
        practice: "Sleep Quality",
        score: quizState.sleep === "yes" ? 10 : quizState.sleep === "mostly" ? 7 : 0,
        maxScore: 10,
        status: quizState.sleep === "yes" ? "excellent" : quizState.sleep === "mostly" ? "good" : "needs-attention",
      },
      {
        practice: "Exercise Balance",
        score:
          quizState.exercise === "yes"
            ? 10
            : quizState.exercise === "sometimes"
              ? 5
              : quizState.exercise === "intense"
                ? 2
                : 0,
        maxScore: 10,
        status:
          quizState.exercise === "yes" ? "excellent" : quizState.exercise === "sometimes" ? "good" : "needs-attention",
      },
      {
        practice: "Alcohol Consumption",
        score:
          quizState.alcohol === "none"
            ? 10
            : quizState.alcohol === "occasional"
              ? 7
              : quizState.alcohol === "regular"
                ? 3
                : 0,
        maxScore: 10,
        status:
          quizState.alcohol === "none" ? "excellent" : quizState.alcohol === "occasional" ? "good" : "needs-attention",
      },
      {
        practice: "Smoking/Nicotine",
        score: quizState.smoking === "no" ? 10 : quizState.smoking === "occasional" ? 5 : 0,
        maxScore: 10,
        status:
          quizState.smoking === "no" ? "excellent" : quizState.smoking === "occasional" ? "good" : "needs-attention",
      },
      {
        practice: "Wellness Tracking",
        score: quizState.tracking === "yes" ? 10 : quizState.tracking === "some" ? 5 : 0,
        maxScore: 10,
        status: quizState.tracking === "yes" ? "excellent" : quizState.tracking === "some" ? "good" : "needs-attention",
      },
    ]
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

  const personalizedResponse = quizState.additionalNotes
    ? getPersonalizedResponse(quizState.additionalNotes, getDetailedBreakdown())
    : null

  const getAppRegistrationUrl = () => {
    const assessmentId = sessionStorage.getItem("ttc_assessment_id")
    const appUrl = new URL("https://catalystmomofficial.com/dashboard")
    appUrl.searchParams.set("name", quizState.name)
    appUrl.searchParams.set("email", quizState.email)

    if (assessmentId) {
      appUrl.searchParams.set("assessment_id", assessmentId)
    }
    appUrl.searchParams.set("score", score.toString())
    appUrl.searchParams.set("tier", tier)
    appUrl.searchParams.set("assessment", "ttc")
    appUrl.searchParams.set("goal", quizState.primaryGoal)
    appUrl.searchParams.set("obstacle", quizState.biggestObstacle)

    return appUrl.toString()
  }

  return (
    <div className="min-h-screen p-4" style={{ background: "linear-gradient(135deg, #F8F5F2, #F0E6D2)" }}>
      <div className="max-w-4xl mx-auto">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
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
            {tier === "medium" && (
              <p className="text-lg mt-2 font-semibold" style={{ color: "#A15C2F" }}>
                There are 3 key gaps preventing breakthrough results—and fixing them could cut your time to conception
                in HALF.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Detailed Breakdown */}
        <Card className="border-0 shadow-xl mb-8">
          <CardHeader>
            <CardTitle className="text-2xl" style={{ color: "#A15C2F" }}>
              📋 Your Fertility Optimization Breakdown
            </CardTitle>
            <p className="text-sm" style={{ color: "#3A2412" }}>
              Here's exactly how you scored across the 10 essential TTC practices:
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {getDetailedBreakdown().map((item, index) => (
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
                  <span className="font-medium" style={{ color: "#3A2412" }}>
                    {item.practice}
                  </span>
                </div>
                <span className="text-lg font-bold" style={{ color: "#A15C2F" }}>
                  {item.score}/{item.maxScore}
                </span>
              </div>
            ))}
            <div className="border-t-4 pt-4 mt-4" style={{ borderColor: "#A15C2F" }}>
              <div className="flex items-center justify-between">
                <p className="text-xl font-bold" style={{ color: "#A15C2F" }}>
                  TOTAL SCORE:
                </p>
                <p className="text-3xl font-bold" style={{ color: "#A15C2F" }}>
                  {score}/110
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personalization Section START */}
        {personalizedResponse && (
          <Card className="border-0 shadow-xl mb-8" style={{ borderLeft: "6px solid #A15C2F" }}>
            <CardHeader>
              <CardTitle className="text-2xl" style={{ color: "#A15C2F" }}>
                💬 You Also Mentioned: Your Personalized TTC Journey
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 rounded-lg" style={{ backgroundColor: "#F3E5F5" }}>
                <p className="italic text-lg" style={{ color: "#666" }}>
                  You shared: "{quizState.additionalNotes}"
                </p>
              </div>

              <p className="text-lg leading-relaxed" style={{ color: "#3A2412" }}>
                Based on your assessment, we'll create a customized fertility optimization plan that addresses your
                unique situation. Our program combines evidence-based protocols with personalized support to help you
                achieve your goal of conception.
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
                  {getDetailedBreakdown()
                    .filter((item) => item.score < 8)
                    .slice(0, 3)
                    .map((gap, index) => {
                      const explanation = getDetailedGapExplanation(gap.practice)
                      return (
                        <div key={index} className="flex items-start gap-3">
                          <span className="text-orange-600 font-bold text-lg flex-shrink-0">•</span>
                          <div>
                            <p className="font-bold" style={{ color: "#A15C2F" }}>
                              {gap.practice} ({gap.score}/10):
                            </p>
                            <p style={{ color: "#3A2412" }}>
                              {gap.practice.includes("Cycle Tracking")
                                ? "You're not tracking your menstrual cycle consistently. This means you don't know when you're most fertile, can't identify irregular patterns, and are timing intercourse based on guesses."
                                : gap.practice.includes("Ovulation")
                                  ? "You're not confirming ovulation. Without tracking, you have no idea if or when it's actually happening, which means you could be trying on completely wrong days."
                                  : gap.practice.includes("Nutrition")
                                    ? "You're not eating fertility-supporting foods consistently. Your nutrition isn't optimized for egg quality, hormone balance, or implantation support."
                                    : gap.practice.includes("Supplementation")
                                      ? "You're not taking fertility-supporting supplements. Folate, CoQ10, Vitamin D, and other key nutrients are missing from your protocol."
                                      : gap.practice.includes("Stress")
                                        ? "Chronic stress is affecting your fertility hormones. High cortisol suppresses ovulation and reduces conception chances."
                                        : gap.practice.includes("Sleep")
                                          ? "You're not getting 7-9 hours of quality sleep. Sleep is when your body produces reproductive hormones."
                                          : gap.practice.includes("Exercise")
                                            ? "You're either not exercising enough or exercising too intensely. Both extremes suppress fertility - you need the 'Goldilocks zone.'"
                                            : gap.practice.includes("Alcohol")
                                              ? "Alcohol consumption impacts egg quality and hormone balance. Even moderate drinking affects fertility."
                                              : gap.practice.includes("Smoking")
                                                ? "Smoking significantly reduces fertility by damaging eggs, disrupting hormones, and reducing implantation rates."
                                                : `This gap is affecting your fertility. Addressing it will improve your chances of conception.`}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                </div>

                <div className="mt-6 pt-6 border-t-2" style={{ borderColor: "#FFB74D" }}>
                  <div className="space-y-4">
                    <div>
                      <p className="font-bold text-lg mb-2" style={{ color: "#A15C2F" }}>
                        What This Means:
                      </p>
                      <p style={{ color: "#3A2412" }}>
                        These aren't just "nice to haves"—these gaps are directly delaying conception. But here's the
                        good news: they're ALL fixable with the right protocols and support.
                      </p>
                    </div>

                    <div>
                      <p className="font-bold text-lg mb-3" style={{ color: "#A15C2F" }}>
                        What the App Does:
                      </p>
                      <div className="space-y-2">
                        <p className="flex items-start gap-2" style={{ color: "#3A2412" }}>
                          <span className="text-green-600 flex-shrink-0">✅</span>
                          <span>Complete fertility optimization system (all 10 practice areas covered)</span>
                        </p>
                        <p className="flex items-start gap-2" style={{ color: "#3A2412" }}>
                          <span className="text-green-600 flex-shrink-0">✅</span>
                          <span>Personalized protocols based on YOUR gaps</span>
                        </p>
                        <p className="flex items-start gap-2" style={{ color: "#3A2412" }}>
                          <span className="text-green-600 flex-shrink-0">✅</span>
                          <span>Daily tracking and accountability</span>
                        </p>
                        <p className="flex items-start gap-2" style={{ color: "#3A2412" }}>
                          <span className="text-green-600 flex-shrink-0">✅</span>
                          <span>Expert guidance and community support</span>
                        </p>
                        <p className="flex items-start gap-2" style={{ color: "#3A2412" }}>
                          <span className="text-green-600 flex-shrink-0">✅</span>
                          <span>Evidence-based interventions that actually work</span>
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="font-bold text-lg mb-2" style={{ color: "#A15C2F" }}>
                        Timeline:
                      </p>
                      <p style={{ color: "#3A2412" }}>
                        Most women see measurable improvements in 4-8 weeks, with conception often following in 2-4
                        cycles.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        {/* Personalization Section END */}

        <Card className="border-0 shadow-xl mb-8">
          <CardHeader>
            <CardTitle className="text-2xl" style={{ color: "#A15C2F" }}>
              💡 What Your {score}/110 Score Really Means
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg" style={{ color: "#3A2412" }}>
              {tier === "high" &&
                `${quizState.name}, you're doing a lot right! You're ahead of 70% of women trying to conceive. Your foundations are solid, and with a few optimizations, you could be in the 90+ range.`}
              {tier === "medium" &&
                `${quizState.name}, you're building momentum! You're ahead of 60% of women trying to conceive, but you have 3 key gaps that are holding you back from breakthrough results.`}
              {tier === "low" &&
                `${quizState.name}, there's significant opportunity here. You're experiencing common challenges that most women face when starting their TTC journey. The good news? These gaps are ALL fixable.`}
            </p>
            {tier === "low" && (
              <>
                <p className="text-lg font-semibold" style={{ color: "#A15C2F" }}>
                  Here's what your score means in practical terms:
                </p>
                <div className="space-y-2">
                  <p className="flex items-start gap-2" style={{ color: "#3A2412" }}>
                    <span className="text-red-500 font-bold">•</span>
                    <span>
                      You're likely trying to conceive without key data (cycle tracking, ovulation confirmation)
                    </span>
                  </p>
                  <p className="flex items-start gap-2" style={{ color: "#3A2412" }}>
                    <span className="text-red-500 font-bold">•</span>
                    <span>Your nutrition and supplementation aren't optimized for fertility</span>
                  </p>
                  <p className="flex items-start gap-2" style={{ color: "#3A2412" }}>
                    <span className="text-red-500 font-bold">•</span>
                    <span>Lifestyle factors (stress, sleep, exercise) may be working against you</span>
                  </p>
                  <p className="flex items-start gap-2" style={{ color: "#3A2412" }}>
                    <span className="text-red-500 font-bold">•</span>
                    <span>You're missing the support and accountability to stay consistent</span>
                  </p>
                </div>
                <p className="text-lg font-semibold" style={{ color: "#A15C2F" }}>
                  The Consequence: Without addressing these gaps, you could spend 6-12+ months trying without
                  success—not because something is wrong with you, but because you're missing the optimization piece.
                </p>
                <p className="text-lg" style={{ color: "#3A2412" }}>
                  The Good News: Fix these gaps, and you could cut your time to conception in HALF. Most women at your
                  score who join the app see measurable improvements in 4-8 weeks.
                </p>
              </>
            )}
            {tier === "medium" && (
              <>
                <p className="text-lg font-semibold" style={{ color: "#A15C2F" }}>
                  But you have 3 key gaps that are holding you back from breakthrough results—and based on what you
                  shared, these gaps are DIRECTLY causing delays in conception.
                </p>
                <p className="text-lg" style={{ color: "#3A2412" }}>
                  Fix these 3 areas, and you could cut your time to conception in HALF. You're closer than you think.
                </p>
              </>
            )}
            {tier === "high" && (
              <>
                <p className="text-lg" style={{ color: "#3A2412" }}>
                  You're tracking, you're eating well, you're managing stress. You're doing more than most. But there
                  are still 1-2 areas where optimization could make the difference between "trying for months" and
                  "pregnant next cycle."
                </p>
                <p className="text-lg font-semibold" style={{ color: "#A15C2F" }}>
                  At your level, it's about PRECISION, not overhaul. Small tweaks = big results.
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Ready to Optimize */}
        <Card className="border-0 shadow-xl mb-8" style={{ background: "linear-gradient(135deg, #F8F5F2, #FFF8E1)" }}>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl mb-2" style={{ color: "#A15C2F" }}>
              🚀 Close ALL Your Gaps: Join the Catalyst Mom App
            </CardTitle>
            <p className="text-lg" style={{ color: "#3A2412" }}>
              You're at {score}/110 - imagine hitting 80-95+ in 8-12 weeks.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-lg">
                <div className="flex items-start gap-3">
                  <span className="text-green-600 text-2xl flex-shrink-0">✅</span>
                  <div>
                    <p className="font-bold mb-1" style={{ color: "#A15C2F" }}>
                      Complete Cycle Tracking System
                    </p>
                    <p className="text-sm" style={{ color: "#3A2412" }}>
                      Digital tracker, fertile window calculator, pattern recognition, shareable reports for your
                      doctor.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg">
                <div className="flex items-start gap-3">
                  <span className="text-green-600 text-2xl flex-shrink-0">✅</span>
                  <div>
                    <p className="font-bold mb-1" style={{ color: "#A15C2F" }}>
                      Ovulation Confirmation Tools
                    </p>
                    <p className="text-sm" style={{ color: "#3A2412" }}>
                      OPK tracker, BBT charting guide, cervical mucus education, timing recommendations.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg">
                <div className="flex items-start gap-3">
                  <span className="text-green-600 text-2xl flex-shrink-0">✅</span>
                  <div>
                    <p className="font-bold mb-1" style={{ color: "#A15C2F" }}>
                      Fertility-Optimized Meal Plans
                    </p>
                    <p className="text-sm" style={{ color: "#3A2412" }}>
                      Hormone-balancing nutrition, egg quality boosters, implantation-supporting foods.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg">
                <div className="flex items-start gap-3">
                  <span className="text-green-600 text-2xl flex-shrink-0">✅</span>
                  <div>
                    <p className="font-bold mb-1" style={{ color: "#A15C2F" }}>
                      TTC Supplement Protocol
                    </p>
                    <p className="text-sm" style={{ color: "#3A2412" }}>
                      Exactly what to take, when to take it, recommended brands (Folate, CoQ10, Vitamin D, etc.).
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg">
                <div className="flex items-start gap-3">
                  <span className="text-green-600 text-2xl flex-shrink-0">✅</span>
                  <div>
                    <p className="font-bold mb-1" style={{ color: "#A15C2F" }}>
                      Stress Management System
                    </p>
                    <p className="text-sm" style={{ color: "#3A2412" }}>
                      Breathwork, meditation, fertility yoga, mindset coaching.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg">
                <div className="flex items-start gap-3">
                  <span className="text-green-600 text-2xl flex-shrink-0">✅</span>
                  <div>
                    <p className="font-bold mb-1" style={{ color: "#A15C2F" }}>
                      Conception-Boosting Workouts
                    </p>
                    <p className="text-sm" style={{ color: "#3A2412" }}>
                      Goldilocks zone exercises (not too much, not too little—just right for fertility).
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg">
                <div className="flex items-start gap-3">
                  <span className="text-green-600 text-2xl flex-shrink-0">✅</span>
                  <div>
                    <p className="font-bold mb-1" style={{ color: "#A15C2F" }}>
                      TTC Community
                    </p>
                    <p className="text-sm" style={{ color: "#3A2412" }}>
                      300+ women trying to conceive right now. Support, hope, shared experiences.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg">
                <div className="flex items-start gap-3">
                  <span className="text-green-600 text-2xl flex-shrink-0">✅</span>
                  <div>
                    <p className="font-bold mb-1" style={{ color: "#A15C2F" }}>
                      Weekly Group Coaching Calls
                    </p>
                    <p className="text-sm" style={{ color: "#3A2412" }}>
                      Ask questions, get expert guidance, troubleshoot challenges.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center p-6 bg-white rounded-lg">
              <p className="text-3xl font-bold mb-2" style={{ color: "#A15C2F" }}>
                $29/month
              </p>
              <p className="text-sm" style={{ color: "#3A2412", opacity: 0.7 }}>
                Less than one acupuncture session. Cancel anytime. No contracts.
              </p>
            </div>

            <div className="text-center">
              <Button
                size="lg"
                className="w-full md:w-auto text-white px-6 py-3 text-base md:px-12 md:py-6 md:text-xl font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                style={{ background: "linear-gradient(135deg, #A15C2F, #C27B48)" }}
                onClick={() => {
                  window.open(getAppRegistrationUrl(), "_blank")
                }}
              >
                Join the Catalyst Mom App Now - $29/month
              </Button>
              <p className="text-sm mt-4" style={{ color: "#3A2412", opacity: 0.7 }}>
                Start seeing results in 7 days. Cancel anytime. No contracts.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Testimonials */}
        <Card className="border-0 shadow-xl mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-center" style={{ color: "#A15C2F" }}>
              💬 What Women at Your Score Say
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {tier === "low" && (
              <>
                <div className="p-6 bg-white rounded-lg border-2" style={{ borderColor: "#E8D5C4" }}>
                  <p className="italic mb-3" style={{ color: "#3A2412" }}>
                    "I scored 38/110 and had been trying for 11 months with NO luck. I thought something was wrong with
                    me. After joining the app and actually TRACKING my cycle properly, I realized I was ovulating on Day
                    18, not Day 14. I was timing everything wrong. Got pregnant 8 weeks later."
                  </p>
                  <p className="font-semibold" style={{ color: "#A15C2F" }}>
                    — Rachel M., Now 22 weeks pregnant
                  </p>
                </div>
                <div className="p-6 bg-white rounded-lg border-2" style={{ borderColor: "#E8D5C4" }}>
                  <p className="italic mb-3" style={{ color: "#3A2412" }}>
                    "My score was 34/110. I wasn't tracking anything, just 'trying whenever.' The app showed me my exact
                    fertile window and we hit it perfectly. Pregnant on the second cycle of using the app. SECOND
                    CYCLE."
                  </p>
                  <p className="font-semibold" style={{ color: "#A15C2F" }}>
                    — Jen K., TTC for 9 months → Pregnant in 6 weeks
                  </p>
                </div>
                <div className="p-6 bg-white rounded-lg border-2" style={{ borderColor: "#E8D5C4" }}>
                  <p className="italic mb-3" style={{ color: "#3A2412" }}>
                    "The stress management tools alone were worth it. I was so anxious every month. The breathwork and
                    community support helped me RELAX. And guess what? I got pregnant the month I stopped obsessing."
                  </p>
                  <p className="font-semibold" style={{ color: "#A15C2F" }}>
                    — Leah T., TTC for 7 months → Pregnant in 10 weeks
                  </p>
                </div>
              </>
            )}
            {tier === "medium" && (
              <>
                <div className="p-6 bg-white rounded-lg border-2" style={{ borderColor: "#E8D5C4" }}>
                  <p className="italic mb-3" style={{ color: "#3A2412" }}>
                    "I scored 52/110—I was doing SOME things right, but not consistently. The app gave me the structure
                    and accountability I needed. Fixed my supplement protocol, optimized my nutrition, and got pregnant
                    3 months later."
                  </p>
                  <p className="font-semibold" style={{ color: "#A15C2F" }}>
                    — Maria S., TTC for 8 months → Pregnant in 12 weeks
                  </p>
                </div>
                <div className="p-6 bg-white rounded-lg border-2" style={{ borderColor: "#E8D5C4" }}>
                  <p className="italic mb-3" style={{ color: "#3A2412" }}>
                    "My score was 58/110. I knew what to do, but I wasn't doing it consistently. The app's tracking and
                    community kept me accountable. Pregnant on my 4th cycle after joining."
                  </p>
                  <p className="font-semibold" style={{ color: "#A15C2F" }}>
                    — Ashley R., TTC for 6 months → Pregnant in 4 months
                  </p>
                </div>
                <div className="p-6 bg-white rounded-lg border-2" style={{ borderColor: "#E8D5C4" }}>
                  <p className="italic mb-3" style={{ color: "#3A2412" }}>
                    "I was overwhelmed by all the conflicting advice. The app gave me ONE clear protocol to follow. No
                    more guessing. Pregnant 10 weeks after joining."
                  </p>
                  <p className="font-semibold" style={{ color: "#A15C2F" }}>
                    — Nicole P., TTC for 5 months → Pregnant in 10 weeks
                  </p>
                </div>
              </>
            )}
            {tier === "high" && (
              <>
                <div className="p-6 bg-white rounded-lg border-2" style={{ borderColor: "#E8D5C4" }}>
                  <p className="italic mb-3" style={{ color: "#3A2412" }}>
                    "I scored 78/110—I was already doing a lot right, but the app helped me optimize the last 10%. The
                    advanced tracking tools showed me I had a short luteal phase. Fixed it with targeted supplements.
                    Pregnant 6 weeks later."
                  </p>
                  <p className="font-semibold" style={{ color: "#A15C2F" }}>
                    — Emma L., TTC for 4 months → Pregnant in 6 weeks
                  </p>
                </div>
                <div className="p-6 bg-white rounded-lg border-2" style={{ borderColor: "#E8D5C4" }}>
                  <p className="italic mb-3" style={{ color: "#3A2412" }}>
                    "My score was 82/110. I thought I was doing everything right, but the app helped me small tweaks
                    that made a BIG difference. Pregnant on my 2nd cycle after joining."
                  </p>
                  <p className="font-semibold" style={{ color: "#A15C2F" }}>
                    — TTC Mama · Catalyst Mom Community
                  </p>
                </div>
                <div className="p-6 bg-white rounded-lg border-2" style={{ borderColor: "#E8D5C4" }}>
                  <p className="italic mb-3" style={{ color: "#3A2412" }}>
                    "The precision tracking tools were game-changers. I was close, but not quite hitting my fertile
                    window perfectly. The app helped me nail the timing. Pregnant immediately."
                  </p>
                  <p className="font-semibold" style={{ color: "#A15C2F" }}>
                    — TTC Mama · Catalyst Mom Community
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Ready to Optimize */}
        <Card className="border-0 shadow-xl mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl" style={{ color: "#A15C2F" }}>
              Ready to Optimize Your Fertility?
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-lg" style={{ color: "#3A2412" }}>
              Join 300+ women who are actively working toward conception with evidence-based protocols and expert
              support.
            </p>
            <Button
              size="lg"
              className="w-full md:w-auto text-white px-6 py-3 text-base md:px-12 md:py-6 md:text-xl font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
              style={{ background: "linear-gradient(135deg, #A15C2F, #C27B48)" }}
              onClick={() => window.open(getAppRegistrationUrl(), "_blank")}
            >
              Join Now - $29/month
            </Button>
            <div className="mt-6 p-4 bg-amber-50 rounded-lg">
              <p className="font-semibold mb-1" style={{ color: "#A15C2F" }}>
                Questions?
              </p>
              <p style={{ color: "#3A2412" }}>Email: admin@catalystmom.online</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
