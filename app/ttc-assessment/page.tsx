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
import { ValueStack, CharterScarcity, Guarantee, FounderNote } from "@/components/offer-stack"
import { generateConcernReflection, type ConcernReflectionResult } from "@/lib/ai-reflection"
import { ConcernReflectionCard } from "@/components/concern-reflection"
import { GlowingEffect } from "@/components/ui/glowing-effect"
const supabase = createClient()
// Note: Google Analytics (G-24S9C7GFLK) is injected via layout.tsx with cookie-consent gating.
// No inline GA code is needed in this file.

// ─── Types ────────────────────────────────────────────────────────────────────

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

interface BreakdownItem {
  practice: string
  score: number
  maxScore: number
  status: "excellent" | "good" | "needs-attention"
}

interface Testimonial {
  quote: string
  author: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)

// ─── Utility: Gap Explanations ────────────────────────────────────────────────
// Ethics-reviewed: empathetic, no direct risk attribution or fear-based claims.

function getDetailedGapExplanation(practice: string) {
  const map: Record<string, { whatThisMeans: string; consequence: string; appSolution: string; timeline: string }> = {
    "Cycle Tracking": {
      whatThisMeans:
        "You're not tracking your menstrual cycle consistently. This means you may not have a clear picture of your fertile window or any irregular patterns.",
      consequence:
        "Without cycle data, timing can become a guessing game. Understanding your cycle's unique rhythm is one of the most empowering steps you can take when trying to conceive.",
      appSolution:
        "The app provides a digital cycle tracker, fertile window calculator, pattern recognition alerts, and shareable reports. You'll have real data about YOUR cycle.",
      timeline: "2-3 cycles of tracking to understand your patterns clearly.",
    },
    "Ovulation Awareness": {
      whatThisMeans:
        "You're not yet confirming ovulation. Many women assume they ovulate on a 'textbook' day, but every body is different.",
      consequence:
        "Knowing when you ovulate — not just estimating — helps you time things with confidence. Without this data, you may be working with assumptions rather than your actual window.",
      appSolution:
        "The app includes OPK tracking, BBT charting guides, cervical mucus education, and timing recommendations. You'll know when ovulation is actually happening for you.",
      timeline: "1-2 cycles to confirm your ovulation pattern.",
    },
    "Fertility Nutrition": {
      whatThisMeans:
        "You're not yet eating in a way that's specifically focused on fertility support. General healthy eating is a great start, but fertility nutrition goes deeper.",
      consequence:
        "Nutrition influences egg quality (which develops over 90 days), hormone production, and the body's ability to support early pregnancy. It's one of the most impactful areas to optimize.",
      appSolution:
        "The app provides hormone-balancing meal plans, egg quality-supporting foods, anti-inflammatory recipes, and clear guidance — every meal can work for you.",
      timeline: "1-2 months for hormone improvements, 3 months for egg quality support.",
    },
    "Supplementation": {
      whatThisMeans:
        "You're not yet taking fertility-supporting supplements. Folate, CoQ10, Vitamin D, and other key nutrients are missing from your daily routine.",
      consequence:
        "These nutrients play an important role in egg quality, hormone function, and overall reproductive health. Without them, your body may be working with less than optimal support.",
      appSolution:
        "The app provides a complete supplement protocol with exact dosages, timing recommendations, and recommended brands — no guesswork needed.",
      timeline: "3 months to support a full egg maturation cycle.",
    },
    "Stress Management": {
      whatThisMeans:
        "Chronic stress is affecting your wellbeing and may be influencing your reproductive hormones. The TTC journey itself can be a significant source of stress.",
      consequence:
        "Elevated stress hormones can interfere with ovulation and make the monthly cycle feel emotionally exhausting. Managing stress is an important part of holistic fertility support — and your own wellbeing.",
      appSolution:
        "The app includes daily breathwork, meditation, fertility yoga, and mindset coaching. Real tools for real relief — not just advice to 'relax.'",
      timeline: "2-4 weeks for meaningful stress reduction, with fertility benefits following.",
    },
    "Sleep Quality": {
      whatThisMeans:
        "You're not consistently getting 7-9 hours of quality sleep — the window during which your body produces key reproductive hormones.",
      consequence:
        "Poor sleep affects hormone regulation, energy levels, and emotional resilience during what can be an emotionally demanding journey. It's one of the most overlooked fertility foundations.",
      appSolution:
        "The app provides sleep optimization protocols, bedtime routines, and circadian rhythm support tailored for TTC.",
      timeline: "2-3 weeks for sleep quality improvements, with hormonal benefits building over 1-2 months.",
    },
    "Exercise Balance": {
      whatThisMeans:
        "You're either not moving enough or exercising at an intensity that may not be optimal for fertility. Both extremes can affect hormone balance.",
      consequence:
        "Very low activity can contribute to metabolic imbalances, while very high intensity exercise can sometimes suppress ovulation. There's a supportive middle ground that works with your body.",
      appSolution:
        "The app provides conception-friendly workouts — moderate intensity, fertility-safe exercises in the sweet spot for hormonal balance.",
      timeline: "4-6 weeks for metabolic improvements.",
    },
    "Alcohol Consumption": {
      whatThisMeans:
        "Alcohol consumption can affect hormone balance and egg quality, even at moderate levels.",
      consequence:
        "Alcohol influences the hormonal environment your eggs develop in. Reducing or eliminating it is one of the more impactful positive steps you can take.",
      appSolution:
        "The app provides education on alcohol's impact on fertility, mocktail recipes, and support for making informed choices.",
      timeline: "Hormone environment begins improving quickly; egg quality support builds over 3 months.",
    },
    "Smoking/Nicotine": {
      whatThisMeans:
        "Nicotine use significantly affects egg quality, hormone function, and overall reproductive health.",
      consequence:
        "Smoking is one of the most impactful lifestyle factors for fertility. Supporting yourself to quit is one of the most meaningful things you can do for your TTC journey.",
      appSolution:
        "The app provides cessation support, alternative stress management tools, and community accountability.",
      timeline: "Meaningful fertility improvements with sustained cessation over 3-6 months.",
    },
    "Wellness Tracking": {
      whatThisMeans:
        "You're not yet tracking fertility metrics like BBT or cervical mucus. Without data, patterns are invisible.",
      consequence:
        "Comprehensive tracking helps you and your care provider understand what's happening in your cycle — and identify anything that might benefit from attention.",
      appSolution:
        "The app provides comprehensive tracking tools for all fertility metrics, with data you can share with your doctor.",
      timeline: "2-3 cycles to identify meaningful patterns.",
    },
  }

  return (
    map[practice] || {
      whatThisMeans: "This area can be optimized to better support your fertility journey.",
      consequence: "Addressing this gap gives your body more of what it needs for conception.",
      appSolution: "The app provides comprehensive protocols and community support.",
      timeline: "2-3 months for meaningful improvements.",
    }
  )
}

// ─── Utility: Score Breakdown ─────────────────────────────────────────────────

function getDetailedBreakdown(qs: QuizState): BreakdownItem[] {
  return [
    {
      practice: "Cycle Tracking",
      score: qs.cycleTracking === "yes-app" ? 10 : qs.cycleTracking === "sometimes" ? 5 : qs.cycleTracking === "irregular" ? 3 : 0,
      maxScore: 10,
      status: qs.cycleTracking === "yes-app" ? "excellent" : qs.cycleTracking === "sometimes" ? "good" : "needs-attention",
    },
    {
      practice: "Ovulation Awareness",
      score: qs.ovulationAwareness === "yes" ? 10 : qs.ovulationAwareness === "roughly" ? 5 : qs.ovulationAwareness === "irregular" ? 2 : 0,
      maxScore: 10,
      status: qs.ovulationAwareness === "yes" ? "excellent" : qs.ovulationAwareness === "roughly" ? "good" : "needs-attention",
    },
    {
      practice: "Fertility Nutrition",
      score: qs.fertilityNutrition === "yes" ? 10 : qs.fertilityNutrition === "sometimes" ? 5 : qs.fertilityNutrition === "trying" ? 3 : 0,
      maxScore: 10,
      status: qs.fertilityNutrition === "yes" ? "excellent" : qs.fertilityNutrition === "sometimes" ? "good" : "needs-attention",
    },
    {
      practice: "Supplementation",
      score: qs.supplementation === "yes" ? 10 : qs.supplementation === "some" ? 5 : qs.supplementation === "unsure" ? 2 : 0,
      maxScore: 10,
      status: qs.supplementation === "yes" ? "excellent" : qs.supplementation === "some" ? "good" : "needs-attention",
    },
    {
      practice: "Stress Management",
      score: qs.stress === "low" ? 10 : qs.stress === "moderate" ? 5 : 0,
      maxScore: 10,
      status: qs.stress === "low" ? "excellent" : qs.stress === "moderate" ? "good" : "needs-attention",
    },
    {
      practice: "Sleep Quality",
      score: qs.sleep === "yes" ? 10 : qs.sleep === "mostly" ? 7 : 0,
      maxScore: 10,
      status: qs.sleep === "yes" ? "excellent" : qs.sleep === "mostly" ? "good" : "needs-attention",
    },
    {
      practice: "Exercise Balance",
      score: qs.exercise === "yes" ? 10 : qs.exercise === "sometimes" ? 5 : qs.exercise === "intense" ? 2 : 0,
      maxScore: 10,
      status: qs.exercise === "yes" ? "excellent" : qs.exercise === "sometimes" ? "good" : "needs-attention",
    },
    {
      practice: "Alcohol Consumption",
      score: qs.alcohol === "none" ? 10 : qs.alcohol === "occasional" ? 7 : qs.alcohol === "regular" ? 3 : 0,
      maxScore: 10,
      status: qs.alcohol === "none" ? "excellent" : qs.alcohol === "occasional" ? "good" : "needs-attention",
    },
    {
      practice: "Smoking/Nicotine",
      score: qs.smoking === "no" ? 10 : qs.smoking === "occasional" ? 5 : 0,
      maxScore: 10,
      status: qs.smoking === "no" ? "excellent" : qs.smoking === "occasional" ? "good" : "needs-attention",
    },
    {
      practice: "Wellness Tracking",
      score: qs.tracking === "yes" ? 10 : qs.tracking === "some" ? 5 : 0,
      maxScore: 10,
      status: qs.tracking === "yes" ? "excellent" : qs.tracking === "some" ? "good" : "needs-attention",
    },
  ]
}

// ─── Utility: Personalized Response ──────────────────────────────────────────
// Ethics-reviewed: empathetic tone, no direct fear-based medical claims.

function getPersonalizedResponse(notes: string, breakdown: BreakdownItem[]) {
  const lower = notes.toLowerCase()
  const gaps = breakdown.filter((item) => item.score < 8).slice(0, 3)

  const formatGaps = () =>
    gaps
      .map((gap, i) => {
        const exp = getDetailedGapExplanation(gap.practice)
        return `${i + 1}. **${gap.practice} (${gap.score}/10):** ${exp.consequence} ${exp.appSolution}`
      })
      .join("\n\n")

  if (lower.includes("pcos") || lower.includes("polycystic")) {
    return {
      concern: "PCOS and Fertility",
      response: `PCOS is one of the most common reasons cycles become unpredictable — and one of the most responsive conditions to lifestyle changes. Many women with PCOS find that targeted nutrition, cycle tracking, and stress management make a meaningful difference.\n\n**Here's how your gaps connect:**\n\n${formatGaps()}\n\n**What the App Does for PCOS:**\n✅ PCOS-friendly meal plans (low-glycemic, anti-inflammatory, hormone-balancing)\n✅ Ovulation tracking tools tailored for irregular cycles\n✅ Supplement protocols used for PCOS support (Inositol, NAC, Vitamin D, Omega-3s)\n✅ Stress management tools for cortisol regulation\n✅ Community of women navigating PCOS together\n\n**Timeline:** Many women with PCOS see cycle improvements within 2-3 months of consistent lifestyle changes.`,
    }
  }

  if (lower.includes("irregular") || lower.includes("cycle") || lower.includes("period")) {
    return {
      concern: "Irregular Cycles",
      response: `Irregular cycles can make TTC feel unpredictable and frustrating. The encouraging news is that cycle irregularity is often very responsive to targeted lifestyle support — especially nutrition, stress reduction, and consistent tracking.\n\n**Here's how your gaps connect:**\n\n${formatGaps()}\n\n**What the App Does:**\n✅ Cycle tracking system to identify YOUR patterns, even if irregular\n✅ Hormone-balancing nutrition protocols\n✅ Stress management tools (stress is a major cycle disruptor)\n✅ Supplement protocols for cycle support\n✅ Ovulation prediction tools designed for irregular cycles\n\n**Timeline:** Many women see cycle improvements within 2-4 cycles of consistent implementation.`,
    }
  }

  if (lower.includes("age") || lower.includes("old") || lower.includes("35") || lower.includes("40")) {
    return {
      concern: "Age and Fertility",
      response: `The "biological clock" narrative creates a lot of unnecessary pressure. While age is a factor, what matters enormously is how well-optimized your fertility health is. Many women in their late 30s and beyond conceive successfully with the right support.\n\n**Here's how your gaps connect:**\n\n${formatGaps()}\n\n**What the App Does:**\n✅ Egg quality optimization protocols (nutrition, targeted supplements, lifestyle)\n✅ Advanced tracking to maximize timing and cycle understanding\n✅ Stress management — because age-related anxiety is real and worth addressing\n✅ Community of women 35+ supporting each other through this journey\n\n**Timeline:** Egg quality is influenced over a 90-day maturation cycle. Consistent optimization over 3 months can make a real difference.`,
    }
  }

  if (lower.includes("stress") || lower.includes("overwhelm") || lower.includes("anxious") || lower.includes("anxiety")) {
    return {
      concern: "Stress and TTC",
      response: `The emotional weight of TTC is real and deserves to be taken seriously. Stress affects reproductive hormones — and "just relax" is not actually helpful advice. You need real tools.\n\n**Here's how your gaps connect:**\n\n${formatGaps()}\n\n**What the App Does:**\n✅ Daily stress management protocols (breathwork, meditation, fertility yoga)\n✅ Supportive community of women who genuinely understand\n✅ 1-on-1 Human Check-ins — bi-weekly expert progress reviews\n✅ Tracking tools to reduce mental load\n✅ Evidence-based protocols so you know you're doing the right things\n\n**Timeline:** Many women notice meaningful stress reduction within 2-4 weeks of consistent daily practice.`,
    }
  }

  if (lower.includes("partner") || lower.includes("husband") || lower.includes("spouse") || lower.includes("male factor")) {
    return {
      concern: "Partner Involvement",
      response: `Navigating TTC as a couple — especially when there are differing levels of engagement or concern about male factor — is more common than it seems and rarely talked about openly.\n\n**Here's how your gaps connect:**\n\n${formatGaps()}\n\n**What the App Does:**\n✅ Partner education resources (help them understand the process)\n✅ Shareable cycle reports so they know when timing matters\n✅ Male fertility optimization guides if he's open to it\n✅ Communication tools for navigating TTC as a couple\n✅ Community support from women in similar situations\n\n**Timeline:** Your own fertility optimization can begin immediately, and visible progress often encourages more partner engagement.`,
    }
  }

  if (lower.includes("don't know") || lower.includes("confused") || lower.includes("overwhelmed") || lower.includes("where to start")) {
    return {
      concern: "Finding a Starting Point",
      response: `There's so much conflicting advice — track this, eat that, supplement with that, avoid this. The overwhelm is understandable. What you need is a clear, prioritized plan.\n\n**Based on your assessment, here are your 3 highest-impact areas:**\n\n${formatGaps()}\n\n**What the App Does:**\n✅ Step-by-step protocols — no guessing, no overwhelm\n✅ Prioritized action plans: what to do first, second, third\n✅ All the tools in one place (tracking, nutrition, workouts, supplements)\n✅ 24/7 Catalyst AI Expert — instant answers to any wellness question\n✅ Community support from women who've been where you are\n\n**Timeline:** Most women feel meaningfully less overwhelmed within 1 week of having a clear plan to follow.`,
    }
  }

  // Default
  return {
    concern: "Your TTC Journey",
    response: `Every TTC journey is unique, and yours deserves personalized attention. Based on your assessment, here are the key areas to focus on:\n\n${formatGaps()}\n\n**What the App Does:**\n✅ Complete fertility optimization system (all 10 practice areas)\n✅ Personalized protocols based on YOUR gaps\n✅ Daily tracking and accountability\n✅ Expert guidance and community support\n✅ Evidence-based interventions that actually work\n\n**Timeline:** Most women see meaningful improvements in 4-8 weeks of consistent implementation.`,
  }
}

// ─── Shared UI: Testimonials Block ───────────────────────────────────────────

function TestimonialsBlock({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <div className="space-y-4">
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

// ─── Shared UI: App Feature Grid ──────────────────────────────────────────────

const APP_FEATURES = [
  { title: "Complete Cycle Tracking System", body: "Digital tracker, fertile window calculator, pattern recognition, shareable reports for your doctor." },
  { title: "Ovulation Confirmation Tools", body: "OPK tracker, BBT charting guide, cervical mucus education, timing recommendations." },
  { title: "Fertility-Optimized Meal Plans", body: "Hormone-balancing nutrition, egg quality support, implantation-supporting foods." },
  { title: "TTC Supplement Protocol", body: "Exactly what to take, when to take it, recommended brands (Folate, CoQ10, Vitamin D, and more)." },
  { title: "Stress Management System", body: "Breathwork, meditation, fertility yoga, mindset coaching." },
  { title: "Conception-Friendly Workouts", body: "Moderate-intensity, fertility-safe exercise that supports hormonal balance." },
  { title: "TTC Community", body: "300+ women trying to conceive right now. Support, shared experiences, genuine understanding." },
  { title: "Weekly Group Coaching Calls", body: "Ask questions, get expert guidance, troubleshoot challenges with real support." },
]

function AppFeatureGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {APP_FEATURES.map((f, i) => (
        <div key={i} className="relative rounded-lg">
          <GlowingEffect disabled={false} proximity={60} spread={25} borderWidth={2} inactiveZone={0.4} />
          <div className="relative p-4 bg-white rounded-lg h-full">
            <div className="flex items-start gap-3">
              <span className="text-green-600 text-2xl flex-shrink-0">✅</span>
              <div>
                <p className="font-bold mb-1" style={{ color: "#A15C2F" }}>{f.title}</p>
                <p className="text-sm" style={{ color: "#3A2412" }}>{f.body}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Shared UI: Pricing CTA ───────────────────────────────────────────────────

function PricingCTA({
  quizState, score, tier, label,
}: {
  quizState: QuizState; score: number; tier: string; label: string
}) {
  const getUrl = () => {
    const url = new URL("https://catalystmomofficial.com/signup")
    url.searchParams.set("name", quizState.name)
    url.searchParams.set("email", quizState.email)
    url.searchParams.set("score", score.toString())
    url.searchParams.set("tier", tier)
    url.searchParams.set("stage", "ttc")
    url.searchParams.set("primary_goal", quizState.primaryGoal)
    url.searchParams.set("biggest_obstacle", quizState.biggestObstacle)
    url.searchParams.set("birth_experience", "")
    return url.toString()
  }

  return (
    <div className="text-center">
      <Button
        size="lg"
        className="w-full md:w-auto text-white px-6 py-3 text-base md:px-12 md:py-6 md:text-xl font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
        style={{ background: "linear-gradient(135deg, #A15C2F, #C27B48)" }}
        onClick={() => { window.location.href = getUrl() }}
      >
        {label}
      </Button>
      <p className="text-sm mt-4" style={{ color: "#3A2412", opacity: 0.7 }}>
        $29/month founding seat • Start seeing results in 7 days • Cancel anytime • No contracts
      </p>
    </div>
  )
}

// ─── Obstacle crusher — answers the #1 obstacle she told us about ────────────
function ObstacleAnswer({ obstacle }: { obstacle: string }) {
  const answers: Record<string, { said: string; answer: string }> = {
    "dont-know": {
      said: "I do not know where to start",
      answer:
        "That's the app's whole job: your assessment just built your starting point. From day one you get one clear protocol — cycle tracking, nutrition, lifestyle — in order, one step at a time. No more guessing where to begin.",
    },
    irregular: {
      said: "Irregular cycles or a condition like PCOS",
      answer:
        "Then generic 'track day 14' advice was never going to work for you. Your protocol adapts to YOUR cycle data, and your 1:1 fertility coach helps you read what your body is actually doing — not what a textbook says it should do.",
    },
    stress: {
      said: "Stress and the emotional weight of trying",
      answer:
        "The emotional weight is real — and carrying it alone makes everything harder. Your protocol includes stress and nervous-system work, and your coach and community mean the 2am worry finally has somewhere to go.",
    },
    "no-support": {
      said: "No support or accountability",
      answer:
        "That ends today. A dedicated 1:1 coach who knows your history, biweekly check-ins, and a private community of women on the same road. You'll never be doing this alone again.",
    },
    overwhelmed: {
      said: "Overwhelmed by conflicting advice online",
      answer:
        "One plan, one coach, zero contradictions. Your protocol is built from your assessment — not from a hundred arguing forums — so you always know exactly what to do next and can finally ignore the noise.",
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

// ─── Main Quiz Component ──────────────────────────────────────────────────────

export default function TTCAssessment() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [quizState, setQuizState] = useState<QuizState>({
    name: "", email: "", ttcDuration: "", cycleTracking: "", ovulationAwareness: "",
    fertilityNutrition: "", supplementation: "", stress: "", sleep: "", exercise: "",
    alcohol: "", smoking: "", workoutRoutine: "", tracking: "", primaryGoal: "",
    biggestObstacle: "", supportType: "", dietaryRestrictions: "", additionalNotes: "",
  })
  const [showResults, setShowResults] = useState(false)
  const [concernReflection, setConcernReflection] = useState<ConcernReflectionResult | null>(null)
  const [score, setScore] = useState(0)
  const [scoreTier, setScoreTier] = useState<"low" | "medium" | "high">("low")
  const [isLoading, setIsLoading] = useState(false)

  const questions = [
    {
      id: "ttc-duration", title: "How long have you been trying to conceive?",
      subtitle: "This helps us understand where you are in your journey",
      type: "radio", field: "ttcDuration",
      options: [
        { value: "less-3", label: "Less than 3 months" },
        { value: "3-6", label: "3 to 6 months" },
        { value: "6-12", label: "6 to 12 months" },
        { value: "1-2", label: "1 to 2 years" },
        { value: "2+", label: "2 years or more" },
      ],
    },
    {
      id: "cycle-tracking", title: "Are you tracking your menstrual cycle?",
      subtitle: "Understanding your cycle is foundational for conception",
      type: "radio", field: "cycleTracking",
      options: [
        { value: "yes-app", label: "Yes, using an app or method consistently" },
        { value: "sometimes", label: "Sometimes, but not consistently" },
        { value: "irregular", label: "My cycle is too irregular to track" },
        { value: "no", label: "No, I am not tracking it" },
      ],
    },
    {
      id: "ovulation", title: "Do you know when you ovulate?",
      subtitle: "Timing is one of the most critical factors for conception",
      type: "radio", field: "ovulationAwareness",
      options: [
        { value: "yes", label: "Yes, I track ovulation signs or use OPKs" },
        { value: "roughly", label: "Roughly, but not precisely" },
        { value: "irregular", label: "My cycle is too irregular to predict" },
        { value: "no", label: "No, I have no idea" },
      ],
    },
    {
      id: "fertility-nutrition", title: "How well are you nourishing your body for fertility?",
      subtitle: "Nutrition directly impacts egg quality and hormone balance",
      type: "radio", field: "fertilityNutrition",
      options: [
        { value: "yes", label: "Well — I focus on fertility-supporting foods" },
        { value: "sometimes", label: "Okay — I try but it is inconsistent" },
        { value: "trying", label: "I eat healthy but do not focus on fertility specifically" },
        { value: "no", label: "Poorly — I eat whatever is available" },
      ],
    },
    {
      id: "stress", title: "How would you describe your stress levels right now?",
      subtitle: "Chronic stress directly impacts reproductive hormones",
      type: "radio", field: "stress",
      options: [
        { value: "low", label: "Low — I manage stress well" },
        { value: "moderate", label: "Moderate — some stress but manageable" },
        { value: "high", label: "High — I am constantly stressed" },
        { value: "very-high", label: "Very high — the TTC journey is consuming me" },
      ],
    },
    {
      id: "sleep", title: "Are you getting 7 to 9 hours of quality sleep most nights?",
      subtitle: "Sleep is when your body produces reproductive hormones",
      type: "radio", field: "sleep",
      options: [
        { value: "yes", label: "Yes, 7 to 9 hours most nights" },
        { value: "mostly", label: "Mostly, but some nights less" },
        { value: "no", label: "No, I average 5 to 6 hours" },
        { value: "poor", label: "Less than 5 hours most nights" },
      ],
    },
    {
      id: "name", title: "Almost there! What is your first name?",
      subtitle: "So we can personalize your fertility score",
      type: "text", field: "name", placeholder: "Enter your first name",
    },
    {
      id: "email", title: "Where should we send your personalized results?",
      subtitle: "We will email your full fertility assessment breakdown",
      type: "email", field: "email", placeholder: "your@email.com",
    },
    {
      id: "primary-goal", title: "What is your primary goal right now?",
      subtitle: "This helps us personalize your roadmap",
      type: "radio", field: "primaryGoal",
      options: [
        { value: "conceive", label: "Get pregnant as soon as possible" },
        { value: "optimize", label: "Optimize my overall fertility health" },
        { value: "understand", label: "Understand my cycle and ovulation better" },
        { value: "prepare", label: "Prepare my body before trying" },
        { value: "support", label: "Get support through the emotional toll of TTC" },
      ],
    },
    {
      id: "biggest-obstacle", title: "What is the biggest thing stopping you right now?",
      subtitle: "Knowing this helps us support you better",
      type: "radio", field: "biggestObstacle",
      options: [
        { value: "dont-know", label: "I do not know where to start" },
        { value: "irregular", label: "Irregular cycles or a condition like PCOS" },
        { value: "stress", label: "Stress and the emotional weight of trying" },
        { value: "no-support", label: "No support or accountability" },
        { value: "overwhelmed", label: "Overwhelmed by conflicting advice online" },
      ],
    },
    {
      id: "additional-notes", title: "Anything else we should know?",
      subtitle: "Share any conditions, concerns, or context that might help",
      type: "textarea", field: "additionalNotes",
      placeholder: "E.g., PCOS, endometriosis, irregular cycles, partner concerns...",
    },
  ]

  const calculateScore = () => {
    let s = 10 // TTC duration: context, not scored negatively
    if (quizState.cycleTracking === "yes-app") s += 10
    else if (quizState.cycleTracking === "sometimes") s += 6
    else if (quizState.cycleTracking === "irregular") s += 3
    if (quizState.ovulationAwareness === "yes") s += 10
    else if (quizState.ovulationAwareness === "roughly") s += 6
    else if (quizState.ovulationAwareness === "irregular") s += 3
    if (quizState.fertilityNutrition === "yes") s += 10
    else if (quizState.fertilityNutrition === "sometimes") s += 6
    else if (quizState.fertilityNutrition === "trying") s += 3
    if (quizState.stress === "low") s += 10
    else if (quizState.stress === "moderate") s += 6
    else if (quizState.stress === "high") s += 2
    if (quizState.sleep === "yes") s += 10
    else if (quizState.sleep === "mostly") s += 7
    else if (quizState.sleep === "no") s += 2
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
        stage: "ttc",
        primaryGoal: quizState.primaryGoal,
        biggestObstacle: quizState.biggestObstacle,
        profile: {
          ttc_duration: quizState.ttcDuration,
          cycle_tracking: quizState.cycleTracking,
          ovulation_awareness: quizState.ovulationAwareness,
          fertility_nutrition: quizState.fertilityNutrition,
          stress: quizState.stress,
          sleep: quizState.sleep,
          support: quizState.supportType,
        },
      }).catch(() => null)
      setConcernReflection(reflection)

      const customProperties = {
        assessment_type: "TTC",
        score: calculatedScore,
        score_tier: tier,
        ttc_duration: quizState.ttcDuration,
        primary_goal: quizState.primaryGoal,
        biggest_obstacle: quizState.biggestObstacle,
        cycle_tracking: quizState.cycleTracking,
        ovulation_awareness: quizState.ovulationAwareness,
        fertility_nutrition: quizState.fertilityNutrition,
        supplementation: quizState.supplementation,
        stress: quizState.stress,
        sleep: quizState.sleep,
        alcohol: quizState.alcohol,
        smoking: quizState.smoking,
        support_type: quizState.supportType,
        concern: quizState.additionalNotes,
        concern_reflection: reflection && !reflection.crisis ? reflection.reflection : undefined,
      }

      try {
        await addContactToOmnisend({
          email: quizState.email,
          firstName: quizState.name,
          tags: ["ttc-assessment", `score-${tier}`],
          customProperties,
        })
      } catch (omnisendError) {
        console.error("[omnisend] first call error:", omnisendError)
      }

      // ── Lead Capture: ttc_assessments table ────────────────────────────────
      const { data, error: supabaseError } = await supabase
        .from("ttc_assessments")
        .insert({
          name: quizState.name,
          email: quizState.email,
          ttc_duration: quizState.ttcDuration || null,
          workout_routine: quizState.workoutRoutine || null,
          tracking: quizState.tracking || null,
          primary_goal: quizState.primaryGoal || null,
          biggest_obstacle: quizState.biggestObstacle || null,
          support_type: quizState.supportType || null,
          dietary_restrictions: quizState.dietaryRestrictions || null,
          additional_notes: quizState.additionalNotes || null,
          score: calculatedScore,
        })
        .select()

      if (supabaseError) console.error("[supabase] insert error:", supabaseError)

      if (data?.[0]) {
        sessionStorage.setItem("ttc_assessment_id", data[0].id)
        const resultsUrl = `https://catalystmomofficial.com/dashboard?assessment_id=${data[0].id}`
        try {
          await addContactToOmnisend({
            email: quizState.email,
            firstName: quizState.name,
            tags: ["ttc-assessment", `score-${tier}`],
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
    return val !== ""
  }

  if (showResults) {
    return <TTCResultsPage score={score} tier={scoreTier} quizState={quizState} concernReflection={concernReflection} />
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
              <span className="font-bold" style={{ color: "#A15C2F" }}>Catalyst Mom - TTC</span>
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

function TTCResultsPage({
  score, tier, quizState, concernReflection,
}: {
  score: number
  tier: "low" | "medium" | "high"
  quizState: QuizState
  concernReflection: ConcernReflectionResult | null
}) {
  const breakdown = getDetailedBreakdown(quizState)
  const personalizedResponse = quizState.additionalNotes.trim()
    ? getPersonalizedResponse(quizState.additionalNotes, breakdown)
    : null
  const gaps = breakdown.filter((item) => item.score < 8).slice(0, 3)

  const getTierColor = () => score <= 40 ? "#E57373" : score <= 70 ? "#FFB74D" : "#81C784"
  const getTierLabel = () =>
    score <= 40 ? "Early Foundations Stage" : score <= 70 ? "Building Momentum Stage" : "Thriving & Ready Stage"

  const testimonialsByTier: Record<string, Testimonial[]> = {
    low: [
      { quote: "I scored 38/110 and had been trying for 11 months. After actually tracking my cycle properly I realized I was ovulating on Day 18, not Day 14. I was timing everything wrong. Got pregnant a few weeks later.", author: "— Rachel M., now 22 weeks pregnant" },
      { quote: "My score was 34/110. I wasn't tracking anything, just 'trying whenever.' The app showed me my exact fertile window. Pregnant on the second cycle of using the app.", author: "— Jen K., TTC for 9 months" },
      { quote: "The stress management tools alone were worth it. The breathwork and community support genuinely helped me feel calmer every month.", author: "— Leah T., TTC for 7 months" },
    ],
    medium: [
      { quote: "I scored 52/110 — doing SOME things right, but not consistently. The app gave me structure and accountability. Fixed my supplement protocol, optimized my nutrition, and got pregnant a few months later.", author: "— Maria S., TTC for 8 months" },
      { quote: "My score was 58/110. I knew what to do but wasn't doing it consistently. The app's tracking and community kept me accountable.", author: "— Ashley R., TTC for 6 months" },
      { quote: "I was overwhelmed by conflicting advice. The app gave me ONE clear protocol to follow. No more guessing.", author: "— Nicole P., TTC for 5 months" },
    ],
    high: [
      { quote: "I scored 78/110 — already doing a lot right, but the app helped me fine-tune the last details. The advanced tracking showed me I had a short luteal phase. Fixed it with targeted supplements.", author: "— Emma L., TTC for 4 months" },
      { quote: "My score was 82/110. The app helped me with small tweaks that made a big difference. Pregnant on my 2nd cycle after joining.", author: "— TTC Mama · Catalyst Mom Community" },
      { quote: "The precision tracking tools were game-changers. I was close, but not quite hitting my fertile window perfectly. The app helped me nail the timing.", author: "— TTC Mama · Catalyst Mom Community" },
    ],
  }

  const ttcProtocolSteps = [
    { label: "Cycle Tracking Setup", done: true },
    { label: "Fertile Window Mapping", done: true },
    { label: "Fertility Nutrition Blueprint", done: false },
    { label: "Supplement Protocol", done: false },
    { label: "Stress & Sleep Reset", done: false },
    { label: "Ovulation Precision Plan", done: false },
  ]
  const completedSteps = ttcProtocolSteps.filter((s) => s.done).length
  const totalSteps = ttcProtocolSteps.length
  const pctDone = Math.round((completedSteps / totalSteps) * 100)

  return (
    <div className="min-h-screen p-4" style={{ background: "linear-gradient(135deg, #F8F5F2, #F0E6D2)" }}>
      <div className="max-w-4xl mx-auto">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />Back to Home
          </Button>
        </Link>

        {/* Score Display */}
        <Card className="border-0 shadow-xl mb-6">
          <CardContent className="p-8 text-center">
            <div className="mb-4">
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
              {tier === "high" &&
                `${score}/110 — solid foundations. Here's what matters: fertility readiness compounds. Every fundamental you refine now stacks in your favor, cycle after cycle.`}
              {tier === "medium" &&
                `${score}/110 — real momentum. And here's the good news about fertility: readiness compounds. Every gap you close now keeps paying you back, cycle after cycle.`}
              {tier === "low" &&
                `${score}/110 — which means most of your levers are still unpulled. That's genuinely good news: fertility readiness compounds, and every fundamental you put in place from today stacks in your favor, cycle after cycle.`}
            </p>
          </CardContent>
        </Card>

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
                  Your personalised fertility plan is {pctDone}% built.
                </p>
                <p className="text-sm" style={{ color: "#3A2412", opacity: 0.7 }}>
                  Complete your setup inside the app to unlock the full protocol.
                </p>
              </div>
            </div>
            <div className="space-y-2 mb-5">
              {ttcProtocolSteps.map((step, i) => (
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
                    <span className="text-green-600 text-xl flex-shrink-0">✓</span>
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
              👇 Unlock the remaining {totalSteps - completedSteps} steps — personalised to your score &amp; goals
            </p>
            <PricingCTA
              quizState={quizState}
              score={score}
              tier={tier}
              label="Start My Fertility Optimisation Plan"
            />
          </CardContent>
        </Card>

        {/* Detailed Breakdown */}
        <Card className="border-0 shadow-xl mb-8">
          <CardHeader>
            <CardTitle className="text-2xl" style={{ color: "#A15C2F" }}>
              📋 Your Fertility Optimization Breakdown
            </CardTitle>
            <p className="text-sm" style={{ color: "#3A2412" }}>
              Here&apos;s exactly how you scored across the 10 essential TTC practices:
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
                <span className="text-lg font-bold" style={{ color: "#A15C2F" }}>
                  {item.score}/{item.maxScore}
                </span>
              </div>
            ))}
            <div className="border-t-4 pt-4 mt-4" style={{ borderColor: "#A15C2F" }}>
              <div className="flex items-center justify-between">
                <p className="text-xl font-bold" style={{ color: "#A15C2F" }}>TOTAL SCORE:</p>
                <p className="text-3xl font-bold" style={{ color: "#A15C2F" }}>{score}/110</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personalized Section */}
        {concernReflection ? (
          <ConcernReflectionCard
            concern={quizState.additionalNotes}
            reflection={concernReflection.reflection}
            crisis={concernReflection.crisis}
          />
        ) : personalizedResponse && (
          <Card className="border-0 shadow-xl mb-8" style={{ borderLeft: "6px solid #A15C2F" }}>
            <CardHeader>
              <CardTitle className="text-2xl" style={{ color: "#A15C2F" }}>
                💬 You Also Mentioned: Your Personalized TTC Journey
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 rounded-lg" style={{ backgroundColor: "#F3E5F5" }}>
                <p className="italic text-lg" style={{ color: "#666" }}>
                  You shared: &ldquo;{quizState.additionalNotes}&rdquo;
                </p>
              </div>
              <p className="text-lg leading-relaxed" style={{ color: "#3A2412" }}>
                Based on your assessment, we&apos;ll create a customized fertility optimization plan that addresses your
                unique situation — combining evidence-based protocols with personalized support.
              </p>
              <div className="p-6 rounded-lg border-2" style={{ borderColor: "#FFB74D", backgroundColor: "#FFF8E1" }}>
                <h3 className="text-xl font-bold mb-4" style={{ color: "#A15C2F" }}>
                  How This Connects to Your Score:
                </h3>
                <div className="space-y-4">
                  {gaps.map((gap, index) => {
                    const exp = getDetailedGapExplanation(gap.practice)
                    return (
                      <div key={index} className="flex items-start gap-3">
                        <span className="text-orange-600 font-bold text-lg flex-shrink-0">•</span>
                        <div>
                          <p className="font-bold" style={{ color: "#A15C2F" }}>
                            {gap.practice} ({gap.score}/10):
                          </p>
                          <p style={{ color: "#3A2412" }}>{exp.whatThisMeans}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="mt-6 pt-6 border-t-2" style={{ borderColor: "#FFB74D" }}>
                  <p className="font-bold text-lg mb-3" style={{ color: "#A15C2F" }}>What the App Does:</p>
                  <div className="space-y-2">
                    {[
                      "Complete fertility optimization system (all 10 practice areas)",
                      "Personalized protocols based on YOUR gaps",
                      "Daily tracking and accountability",
                      "Expert guidance and community support",
                      "Evidence-based interventions that work with your body",
                    ].map((item, i) => (
                      <p key={i} className="flex items-start gap-2" style={{ color: "#3A2412" }}>
                        <span className="text-green-600 flex-shrink-0">✅</span>
                        <span>{item}</span>
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* What Your Score Means */}
        <Card className="border-0 shadow-xl mb-8">
          <CardHeader>
            <CardTitle className="text-2xl" style={{ color: "#A15C2F" }}>
              💡 What Your {score}/110 Score Really Means
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg" style={{ color: "#3A2412" }}>
              {tier === "high" &&
                `${quizState.name}, you're doing a lot right! Your foundations are solid — with a few targeted optimizations, you could be in the 90+ range.`}
              {tier === "medium" &&
                `${quizState.name}, you're building momentum! You have good foundations in some areas, but there are 3 key gaps worth addressing for stronger results.`}
              {tier === "low" &&
                `${quizState.name}, there's real opportunity here. You're experiencing common challenges that many women face — and the good news is these gaps are ALL addressable with the right support.`}
            </p>

            {tier === "low" && (
              <div className="space-y-2">
                {[
                  "You may be trying to conceive without full cycle data (tracking, ovulation confirmation)",
                  "Nutrition and supplementation have room to be more fertility-focused",
                  "Lifestyle factors (stress, sleep, exercise) have meaningful optimization potential",
                  "Having structured support and accountability can make a real difference",
                ].map((point, i) => (
                  <p key={i} className="flex items-start gap-2" style={{ color: "#3A2412" }}>
                    <span className="font-bold" style={{ color: "#A15C2F" }}>•</span>
                    <span>{point}</span>
                  </p>
                ))}
                <p className="text-lg" style={{ color: "#3A2412" }}>
                  Addressing these gaps gives your body the best possible support for conception — and most women
                  see meaningful changes within 4-8 weeks of consistent implementation.
                </p>
              </div>
            )}

            {tier === "medium" && (
              <p className="text-lg" style={{ color: "#3A2412" }}>
                Closing these 3 gaps can meaningfully improve your fertility health. You&apos;re closer than you think.
              </p>
            )}

            {tier === "high" && (
              <>
                <p className="text-lg" style={{ color: "#3A2412" }}>
                  You&apos;re tracking, eating well, and managing stress. You&apos;re doing more than most. There are
                  still 1-2 areas where precision optimization could make a real difference.
                </p>
                <p className="text-lg font-semibold" style={{ color: "#A15C2F" }}>
                  At your level, it&apos;s about PRECISION, not overhaul. Small tweaks = meaningful results.
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* App Features + Pricing */}
        <Card className="border-0 shadow-xl mb-8" style={{ background: "linear-gradient(135deg, #F8F5F2, #FFF8E1)" }}>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl mb-2" style={{ color: "#A15C2F" }}>
              🚀 Close ALL Your Gaps: Join the Catalyst Mom App
            </CardTitle>
            <p className="text-lg" style={{ color: "#3A2412" }}>
              You&apos;re at {score}/110 — imagine hitting 80-95+ in 8-12 weeks.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <AppFeatureGrid />
            <div className="p-6 bg-white rounded-lg">
              <CharterScarcity coachLabel="your dedicated fertility coach" tierPrice="$129/month" />
              <ValueStack
                items={[
                  { label: "2 private 1:1 Progression Syncs/month with your dedicated fertility coach", value: "$400/mo", hero: true },
                  { label: "Personalized fertility-optimization protocol (built from your score)", value: "$297" },
                  { label: "24/7 AI fertility coach — answers any time of night", value: "$97/mo" },
                  { label: "Cycle-tracking & ovulation-timing system", value: "$149" },
                  { label: "Fertility nutrition & egg-quality frameworks", value: "$99" },
                  { label: "Stress & hormone-balance protocols", value: "$79" },
                  { label: "Private TTC community + weekly check-ins", value: "$30/mo" },
                ]}
                total="$1,151"
                regularPrice="$129/month"
                price="$29/month"
              />
              <p className="text-center text-sm mb-1" style={{ color: "#3A2412", opacity: 0.7 }}>
                That&apos;s less than one acupuncture session — for everything, every month.
              </p>
            </div>
            <ObstacleAnswer obstacle={quizState.biggestObstacle} />
            <PricingCTA
              quizState={quizState}
              score={score}
              tier={tier}
              label="Claim My Founding Seat"
            />
            <Guarantee>
              Follow your fertility protocol for 30 days. If you don&apos;t feel more in control of your cycle and your body,
              email us and we&apos;ll refund every penny — and you keep the roadmap.
            </Guarantee>
          </CardContent>
        </Card>

        {/* Testimonials */}
        <Card className="border-0 shadow-xl mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-center" style={{ color: "#A15C2F" }}>
              💬 What Women at Your Score Say
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TestimonialsBlock testimonials={testimonialsByTier[tier] || testimonialsByTier.medium} />
          </CardContent>
        </Card>

        {/* Final CTA */}
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
            <PricingCTA
              quizState={quizState}
              score={score}
              tier={tier}
              label="Claim My Founding Seat"
            />
            <div className="mt-6 p-4 bg-amber-50 rounded-lg">
              <p className="font-semibold mb-1" style={{ color: "#A15C2F" }}>Questions?</p>
              <p style={{ color: "#3A2412" }}>Email: admin@catalystmom.online</p>
            </div>
          </CardContent>
        </Card>

        <FounderNote stage="ttc" />
      </div>
    </div>
  )
}
