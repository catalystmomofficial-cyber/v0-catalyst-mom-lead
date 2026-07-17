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
import { trackQuizEvents } from "@/lib/analytics"
import { addContactToOmnisend } from "@/lib/omnisend"
import { createClient } from "@/lib/supabase/client"
import { ValueStack, CharterScarcity, Guarantee, FounderNote, type StackItem } from "@/components/offer-stack"
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

function getTierTestimonials(tier: "low" | "medium" | "high"): Testimonial[] {
  if (tier === "high") {
    return [
      {
        name: "Pregnancy Mama · Catalyst Mom Community",
        score: "Score: 78/100",
        quote: "I was already doing most things right, but the app helped me optimize the last 20%. I had the smoothest labor and easiest postpartum recovery of all my friends.",
        result: "Optimized pregnancy, 6-hour labor, back to pre-pregnancy weight in 8 weeks",
      },
      {
        name: "Amanda K.",
        score: "Score: 82/100",
        quote: "The VIP coaching helped me prepare mentally and physically for labor. I felt so confident and in control during delivery.",
        result: "Unmedicated birth, no tearing, felt amazing postpartum",
      },
    ]
  }
  if (tier === "medium") {
    return [
      {
        name: "Rachel T.",
        score: "Score: 55/100",
        quote: "I was doing some things right but had major gaps. The app gave me a clear plan to follow. My energy improved within a week and I felt so much better the rest of my pregnancy.",
        result: "Healthy weight gain, smooth delivery, strong postpartum start",
      },
      {
        name: "Lauren S.",
        score: "Score: 62/100",
        quote: "I didn't know what was safe during pregnancy and was too scared to exercise. The app showed me exactly what to do. I stayed active my entire pregnancy and recovered so fast postpartum.",
        result: "Stayed fit throughout pregnancy, 8-hour labor, no complications",
      },
    ]
  }
  return [
    {
      name: "Pregnancy Mama · Catalyst Mom Community",
      score: "Score: 28/100",
      quote: "I was struggling with severe nausea and had no idea what to eat or how to exercise. The app's protocols helped me manage my symptoms and I actually started feeling good during pregnancy.",
      result: "Nausea reduced significantly, healthy weight gain, prepared for labor",
    },
    {
      name: "Pregnancy Mama · Catalyst Mom Community",
      score: "Score: 35/100",
      quote: "I was overwhelmed and didn't know where to start. The app gave me a step-by-step plan. I went from barely functioning to feeling strong and confident.",
      result: "Energy improved dramatically, felt supported throughout pregnancy",
    },
  ]
}

// ─── Utility: Personalized Response ──────────────────────────────────────────
// Defined outside component; accepts breakdown so it doesn't need to re-derive it.

function getPersonalizedResponse(notes: string, breakdown: BreakdownItem[]) {
  const lower = notes.toLowerCase()
  const gaps = breakdown.filter((item) => item.score < 8).slice(0, 3)

  const gapLine = (gap: BreakdownItem): string => {
    const lines: Record<string, string> = {
      "Prenatal Nutrition": "Targeted nutrition strategies provide the specific macros and timing that support stable energy and symptom management.",
      "Exercise Safety": "Safe, stage-appropriate movement eases symptoms and improves how you feel — but you need clarity on what's right for your trimester.",
      "Supplementation": "Specific supplements can make a meaningful difference, but most women aren't sure which ones to take or when.",
      "Stress Management": "Your nervous system is directly connected to how you feel physically. Calming stress is one of the fastest routes to feeling better.",
      "Sleep Quality": "Rest is foundational. Improving sleep quality often shifts energy levels faster than almost anything else.",
      "Prenatal Care": "Regular check-ins give you and your provider the data to make informed, confident decisions together.",
      "Pelvic Floor Training": "Your pelvic floor is central to how your body handles pregnancy's demands — strengthening it now pays dividends.",
      "Wellness Tracking": "Tracking helps you spot patterns and bring useful data to your care team.",
    }
    return lines[gap.practice] || "Addressing this area will support how you feel throughout pregnancy."
  }

  const formatGaps = () =>
    gaps.map((g, i) => `${i + 1}. **${g.practice} (${g.score}/10):** ${gapLine(g)}`).join("\n\n")

  if (lower.includes("gestational diabetes") || lower.includes("gd") || lower.includes("blood sugar")) {
    return {
      concern: "Gestational Diabetes Management",
      response: `Managing blood sugar during pregnancy is very doable with the right nutrition and movement protocols — many women feel more in control than they expected once they have a clear plan.\n\n**Here's how your gaps connect:**\n\n${formatGaps()}\n\n**What the app does:**\n- GD-friendly meal plans with balanced carb-to-protein ratios\n- Safe movement protocols that support healthy glucose levels\n- Blood sugar pattern tracking\n- Community of moms navigating GD together\n\n**Timeline:** Most women feel more confident managing their numbers within 1-2 weeks of implementing the right protocols.`,
    }
  }
  if (lower.includes("high blood pressure") || lower.includes("preeclampsia") || lower.includes("hypertension")) {
    return {
      concern: "Blood Pressure During Pregnancy",
      response: `Managing blood pressure during pregnancy is something lifestyle factors can genuinely support — alongside your medical team's care.\n\n**Here's how your gaps connect:**\n\n${formatGaps()}\n\n**What the app does:**\n- Nutrition plans that support healthy BP (balanced sodium, magnesium-rich foods)\n- Safe movement for cardiovascular health\n- Stress management techniques\n- Tracking tools to monitor patterns between appointments\n- Designed to complement your care provider, not replace them\n\n**Timeline:** Many women notice positive shifts within 2-3 weeks of implementing nutrition and stress management together.`,
    }
  }
  if (lower.includes("nausea") || lower.includes("morning sickness") || lower.includes("vomiting") || lower.includes("sick")) {
    return {
      concern: "Nausea and Morning Sickness",
      response: `Severe nausea makes pregnancy genuinely hard — just getting through the day feels like a win. There are evidence-based strategies that can meaningfully reduce symptoms.\n\n**Here's how your gaps connect:**\n\n${formatGaps()}\n\n**What the app does:**\n- Anti-nausea meal timing and food combinations\n- Supplement protocol (B6, ginger, magnesium) with clear dosing\n- Gentle movement options for low-energy days\n- Stress and nervous system techniques that reduce nausea triggers\n\n**Timeline:** Most women see symptom reduction within 3-5 days of implementing the nutrition and supplement protocols.`,
    }
  }
  if (lower.includes("exhaust") || lower.includes("fatigue") || lower.includes("tired") || lower.includes("no energy")) {
    return {
      concern: "Pregnancy Fatigue and Exhaustion",
      response: `Pregnancy fatigue is real — not just being a bit tired, but bone-deep. There are specific strategies that can meaningfully improve your energy without adding more to your plate.\n\n**Here's how your gaps connect:**\n\n${formatGaps()}\n\n**What the app does:**\n- Energy-optimized meal plans (iron-rich, balanced blood sugar)\n- Targeted supplement protocol for fatigue\n- Gentle movement that energizes rather than depletes\n- Sleep optimization strategies designed for pregnancy\n\n**Timeline:** Most women notice real improvement within 1-2 weeks of addressing nutrition and sleep together.`,
    }
  }
  if (lower.includes("anxiety") || lower.includes("worried") || lower.includes("scared") || lower.includes("fear") || lower.includes("panic")) {
    return {
      concern: "Pregnancy Anxiety and Worry",
      response: `Pregnancy anxiety is incredibly common — especially if you've had a difficult experience before. You don't have to white-knuckle through it.\n\n**Here's how your gaps connect:**\n\n${formatGaps()}\n\n**What the app does:**\n- Pregnancy-safe breathwork and meditation (quick, daily)\n- Movement practices that calm your nervous system\n- Tracking tools that give you data and reassurance\n- Community of moms who genuinely understand\n\n**Timeline:** Most women notice reduced anxiety within 1-2 weeks of daily stress management practice.`,
    }
  }
  if (lower.includes("pelvic pain") || lower.includes("spd") || lower.includes("sciatica") || lower.includes("back pain")) {
    return {
      concern: "Pelvic Pain and Back Discomfort",
      response: `Pelvic pain and SPD can make every movement feel like a lot. The right exercises and modifications can significantly reduce pain and help you stay mobile.\n\n**Here's how your gaps connect:**\n\n${formatGaps()}\n\n**What the app does:**\n- Pelvic-stabilizing exercises that target the root cause\n- Pain-free movement modifications\n- Anti-inflammatory nutrition support\n- Positioning strategies for sleep and daily life\n\n**Timeline:** Most women notice improvement within 1-2 weeks of consistent pelvic stabilization work.`,
    }
  }
  if (lower.includes("previous complications") || lower.includes("last pregnancy") || lower.includes("loss") || lower.includes("miscarriage")) {
    return {
      concern: "Previous Pregnancy History",
      response: `Having a difficult previous experience creates a very different headspace for this pregnancy. You deserve to feel informed and supported, not just anxious.\n\n**Here's how your gaps connect:**\n\n${formatGaps()}\n\n**What the app does:**\n- Focuses on what you can control (nutrition, movement, stress, rest)\n- Works alongside your medical team's care\n- Tracking tools for reassurance between appointments\n- Community of moms with similar histories\n\n**Timeline:** Most women feel more grounded and less anxious within 2-3 weeks of having a clear, personalized plan.`,
    }
  }
  if (lower.includes("weight") || lower.includes("gain") || lower.includes("body image")) {
    return {
      concern: "Pregnancy Weight and Body Changes",
      response: `Your body is doing something extraordinary. You can feel strong and informed through all of it.\n\n**Here's how your gaps connect:**\n\n${formatGaps()}\n\n**What the app does:**\n- Focuses on healthy, appropriate weight gain — not restriction\n- Nutrition that supports both you and baby\n- Movement that builds strength and confidence\n- Mindset support around body changes\n\n**Timeline:** Most women feel more at ease with their body within 2-3 weeks of shifting focus to strength and nourishment.`,
    }
  }
  if (lower.includes("confused") || lower.includes("overwhelmed") || lower.includes("conflicting") || lower.includes("don't know")) {
    return {
      concern: "Navigating Conflicting Pregnancy Advice",
      response: `The internet has an endless supply of contradictory pregnancy advice. You need one clear, evidence-based source.\n\n**Here's how your gaps connect:**\n\n${formatGaps()}\n\n**What the app does:**\n- Clear, trimester-specific guidance based on evidence (not opinions)\n- Specific do's and don'ts for each stage\n- Education about the WHY behind recommendations\n- One trusted place to check, so you stop googling at midnight\n\n**Timeline:** Most women feel significantly more confident within 1 week of having consistent, reliable guidance.`,
    }
  }

  // Generic fallback
  return {
    concern: "Your Unique Pregnancy Journey",
    response: `Every pregnancy is different, and your situation deserves personalized attention. Based on your assessment, here are the key areas to focus on:\n\n${formatGaps()}\n\n**What the app does:** A complete, integrated system with daily guidance, tracking, and community support — so you're never guessing what to do next.`,
  }
}

// ─── Shared UI: Testimonials Block ────────────────────────────────────────────

function TestimonialsBlock({
  testimonials,
  title = "Women at Your Score Level:",
}: {
  testimonials: Testimonial[]
  title?: string
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold" style={{ color: "#A15C2F" }}>
        {title}
      </h3>
      {testimonials.map((t, i) => (
        <div key={i} className="p-4 rounded-lg" style={{ backgroundColor: "#F8F5F2" }}>
          <p className="italic mb-2" style={{ color: "#3A2412" }}>
            &ldquo;{t.quote}&rdquo;
          </p>
          <p className="font-semibold" style={{ color: "#A15C2F" }}>
            — {t.name}
          </p>
          <p className="text-sm" style={{ color: "#666" }}>
            {t.score} • {t.result}
          </p>
        </div>
      ))}
    </div>
  )
}

// ─── Shared UI: Pricing CTA ───────────────────────────────────────────────────

function PricingCTA({
  quizState,
  score,
  tier,
  heading,
  subheading,
  buttonLabel,
  footnote,
  isVip = false,
  condensed = false,
}: {
  quizState: QuizState
  score: number
  tier: string
  heading: string
  subheading: string
  buttonLabel: string
  footnote: string
  isVip?: boolean
  condensed?: boolean
}) {
  const handleClick = () => {
    const url = new URL("https://catalystmomofficial.com/signup")
    url.searchParams.set("name", quizState.name)
    url.searchParams.set("email", quizState.email)
    url.searchParams.set("score", score.toString())
    url.searchParams.set("tier", tier)
    url.searchParams.set("stage", quizState.trimester)
    url.searchParams.set("primary_goal", quizState.primaryGoal)
    url.searchParams.set("biggest_obstacle", quizState.biggestObstacle || "")
    url.searchParams.set("birth_experience", "")
    window.location.href = url.toString()
  }

  const stackItems: StackItem[] = [
    { label: "2 private 1:1 Progression Syncs/month with your dedicated pregnancy & birth-prep coach", value: "$400/mo", hero: true },
    { label: "Personalized birth-prep & pregnancy wellness protocol", value: "$297" },
    { label: "24/7 AI pregnancy coach — answers any time of night", value: "$97/mo" },
    { label: "Trimester-safe workout & mobility library", value: "$149" },
    { label: "Birth-prep breathing & positioning protocols (for an easier labor)", value: "$99" },
    { label: "Pregnancy nutrition frameworks", value: "$79" },
    { label: "Private mom community + weekly check-ins", value: "$30/mo" },
  ]

  return (
    <div className="text-center p-8 bg-white rounded-lg border-4" style={{ borderColor: "#A15C2F" }}>
      <h3 className="text-2xl font-bold mb-4" style={{ color: "#A15C2F" }}>
        {heading}
      </h3>
      <p className="text-lg mb-6" style={{ color: "#3A2412" }}>
        {subheading}
      </p>
      {isVip ? (
        <p className="text-sm mb-3" style={{ color: "#3A2412", opacity: 0.7 }}>
          Private 1-on-1 coaching like this runs <span className="line-through">$400/month</span> on its own — the ongoing
          coaching tier is $129/month.
        </p>
      ) : condensed ? (
        <p className="text-sm font-semibold mb-3" style={{ color: "#A15C2F" }}>
          Founding seat: $29/month — locked for life. Only 100 seats include the 1:1 coaching at this price.
        </p>
      ) : (
        <>
          <CharterScarcity coachLabel="your dedicated pregnancy & birth-prep coach" tierPrice="$129/month" />
          <ValueStack items={stackItems} total="$1,151" regularPrice="$129/month" price="$29/month" />
        </>
      )}
      <Button
        size="lg"
        onClick={handleClick}
        className="w-full md:w-auto text-white px-6 py-3 text-base md:px-12 md:py-6 md:text-xl font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
        style={{ background: "linear-gradient(135deg, #A15C2F, #C27B48)" }}
      >
        {buttonLabel}
      </Button>
      <p className="text-sm mt-4" style={{ color: "#3A2412", opacity: 0.7 }}>
        {footnote}
      </p>
      <Guarantee>
        {isVip
          ? "Show up for your calls and do the work for 30 days. If you don't feel real, measurable progress, we'll refund your first month in full — your coach carries the risk, not you."
          : "Follow your protocol for 30 days. If you don't feel more prepared, more comfortable, and more in control of your pregnancy, email us and we'll refund every penny — and you keep the roadmap."}
      </Guarantee>
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

function GapCard({ gap, index }: { gap: BreakdownItem; index: number }) {
  const explanation = getComprehensiveGapExplanation(gap.practice, gap.score)
  if (explanation.status === "strong") return null

  return (
    <div
      className="p-6 rounded-lg space-y-4"
      style={{ backgroundColor: "#FFF3E0", borderLeft: "4px solid #FFB74D" }}
    >
      <h4 className="font-bold text-xl" style={{ color: "#3A2412" }}>
        {index + 1}. {gap.practice} ({gap.score}/10)
      </h4>
      <div className="space-y-3">
        {explanation.whatThisMeans && (
          <div>
            <p className="font-semibold mb-1" style={{ color: "#A15C2F" }}>What This Means:</p>
            <p style={{ color: "#3A2412" }}>{explanation.whatThisMeans}</p>
          </div>
        )}
        {explanation.consequence && (
          <div>
            <p className="font-semibold mb-1" style={{ color: "#A15C2F" }}>Why It Matters:</p>
            <p style={{ color: "#3A2412" }}>{explanation.consequence}</p>
          </div>
        )}
        {explanation.howAppFixes && (
          <div>
            <p className="font-semibold mb-1" style={{ color: "#A15C2F" }}>How the App Helps:</p>
            <p style={{ color: "#3A2412" }}>{explanation.howAppFixes}</p>
          </div>
        )}
        {explanation.timeline && (
          <div>
            <p className="font-semibold mb-1" style={{ color: "#A15C2F" }}>Timeline:</p>
            <p style={{ color: "#3A2412" }}>{explanation.timeline}</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Main Quiz Component ──────────────────────────────────────────────────────

export default function PregnancyAssessment() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [quizState, setQuizState] = useState<QuizState>(initialQuizState)
  const [showResults, setShowResults] = useState(false)
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
    return <PregnancyResultsPage score={score} tier={scoreTier} quizState={quizState} />
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
  score, tier, quizState,
}: {
  score: number
  tier: "low" | "medium" | "high"
  quizState: QuizState
}) {
  const breakdown = getDetailedBreakdown(quizState)
  const gaps = breakdown.filter((item) => item.score < 8).slice(0, 3)
  const testimonials = getTierTestimonials(tier)
  const personalizedResponse = quizState.additionalNotes.trim()
    ? getPersonalizedResponse(quizState.additionalNotes, breakdown)
    : null

  const getTierColor = () => score <= 40 ? "#E57373" : score <= 70 ? "#FFB74D" : "#81C784"
  const getTierLabel = () =>
    score <= 40 ? "Early Foundations Stage" : score <= 70 ? "Building Momentum Stage" : "Thriving & Ready Stage"

  const pregnancyProtocolSteps = [
    { label: "Prenatal Nutrition Foundation", done: true },
    { label: "Safe Exercise Modifications", done: true },
    { label: "Pelvic Floor Prep Programme", done: false },
    { label: "Birth Prep Breathing Protocol", done: false },
    { label: "Trimester-by-Trimester Plan", done: false },
    { label: "Postpartum Transition Guide", done: false },
  ]
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
                  Complete your setup inside the app to unlock the full protocol.
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
              heading=""
              subheading=""
              buttonLabel="Start My Pregnancy Wellness Plan"
              footnote="Feel better in your body in just 7 days. Cancel anytime. No contracts."
            />
          </CardContent>
        </Card>

        {/* What Your Score Means */}
        <Card className="border-0 shadow-xl mb-8">
          <CardHeader>
            <CardTitle className="text-2xl" style={{ color: "#A15C2F" }}>What Your Score Means</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {tier === "high" && (
              <>
                <p className="text-lg leading-relaxed" style={{ color: "#3A2412" }}>
                  <strong>Congratulations, {quizState.name} — {score}/100 puts you in the top 15% of pregnant women
                  we assess.</strong> You&apos;re attending prenatal care, doing pregnancy-safe exercise, eating well,
                  managing stress, and preparing your body for labor and postpartum recovery.
                </p>
                <p className="text-lg leading-relaxed" style={{ color: "#3A2412" }}>
                  <strong>What this means for your pregnancy:</strong> You&apos;re building strong foundations that
                  support a healthy pregnancy, easier labor preparation, and a smoother postpartum recovery.
                </p>
                <p className="text-lg leading-relaxed" style={{ color: "#3A2412" }}>
                  <strong>The opportunity:</strong> There are still 2-3 areas where optimization could make your
                  pregnancy even better. Small improvements can be the difference between a good pregnancy and an
                  exceptional one.
                </p>
              </>
            )}
            {tier === "medium" && (
              <>
                <p className="text-lg leading-relaxed" style={{ color: "#3A2412" }}>
                  <strong>{quizState.name}, at {score}/100 you&apos;re building real momentum.</strong> You&apos;ve got
                  solid foundations in place and you&apos;re doing several things right. But there are 3-5 key gaps
                  preventing you from feeling your best — and they&apos;re the exact gaps your prep window exists to close.
                </p>
                <p className="text-lg leading-relaxed" style={{ color: "#3A2412" }}>
                  <strong>What this means for your pregnancy:</strong> You may be experiencing symptoms like fatigue,
                  nausea, or discomfort that are making pregnancy harder than it needs to be. Addressing these gaps
                  will help you feel better day to day and set you up for an easier labor and postpartum recovery.
                </p>
                <p className="text-lg leading-relaxed" style={{ color: "#3A2412" }}>
                  <strong>The opportunity:</strong> Closing these 3-5 gaps can dramatically improve how you feel.
                  Small, strategic changes make a huge difference.
                </p>
              </>
            )}
            {tier === "low" && (
              <>
                <p className="text-lg leading-relaxed" style={{ color: "#3A2412" }}>
                  <strong>{quizState.name}, {score}/100 is your starting line — not a verdict.</strong> You may be
                  struggling with symptoms, unsure what&apos;s safe, or drowning in conflicting advice. Most women
                  start exactly here — the difference is what happens next.
                </p>
                <p className="text-lg leading-relaxed" style={{ color: "#3A2412" }}>
                  <strong>Here&apos;s what matters:</strong> you&apos;re in your prep window right now. Everything you
                  build in it — strength, breath, positioning, fuel — is momentum your body carries straight into an
                  easier birth and a faster recovery. This is the highest-leverage time you will ever have.
                </p>
                <p className="text-lg leading-relaxed" style={{ color: "#3A2412" }}>
                  <strong>And it moves fast:</strong> most women feel a real difference within 1-2 weeks of starting
                  the right protocols. A {score} today is simply where the momentum starts.
                </p>
              </>
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

        {/* Personalized Additional Notes */}
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
                  You shared: &ldquo;{quizState.additionalNotes}&rdquo;
                </p>
              </div>
              <p className="text-lg leading-relaxed" style={{ color: "#3A2412" }}>
                Based on your assessment, we&apos;ll create a customized pregnancy wellness plan that addresses your
                unique situation — combining evidence-based protocols with personalized support.
              </p>
              <div className="p-6 rounded-lg border-2" style={{ borderColor: "#FFB74D", backgroundColor: "#FFF8E1" }}>
                <h3 className="text-xl font-bold mb-4" style={{ color: "#A15C2F" }}>
                  How This Connects to Your Score:
                </h3>
                <div className="space-y-4">
                  {gaps.map((gap, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <span className="text-orange-600 font-bold text-lg flex-shrink-0">•</span>
                      <div>
                        <p className="font-bold" style={{ color: "#A15C2F" }}>
                          {gap.practice} ({gap.score}/10):
                        </p>
                        <p style={{ color: "#3A2412" }}>
                          {getComprehensiveGapExplanation(gap.practice, gap.score).whatThisMeans}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t-2" style={{ borderColor: "#FFB74D" }}>
                  <p className="font-bold text-lg mb-3" style={{ color: "#A15C2F" }}>What the App Does:</p>
                  <div className="space-y-2">
                    {[
                      "Complete pregnancy wellness system (all 10 practice areas covered)",
                      "Personalized protocols based on YOUR gaps and trimester",
                      "Pregnancy-safe workouts and modifications",
                      "1-on-1 Human Check-ins — Bi-weekly expert progress reviews",
                      "24/7 Catalyst AI Expert — Instant answers to any wellness question",
                      "Evidence-based interventions for optimal pregnancy health",
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

        {/* Tier Content */}
        <Card className="border-0 shadow-xl mb-8" style={{ background: "linear-gradient(135deg, #F8F5F2, #FFF8E1)" }}>
          <CardHeader>
            <CardTitle className="text-2xl" style={{ color: "#A15C2F" }}>
              {tier === "high"
                ? "You're in the Top 15% — Here's What's Next"
                : tier === "medium"
                  ? "You're Building Momentum — Let's Close the Gaps"
                  : "Let's Build Your Foundation — Starting Today"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg" style={{ color: "#3A2412" }}>
              {tier === "high"
                ? `${quizState.name}, you're doing SO much right. You're ahead of 85% of pregnant women. Let's fine-tune the last few areas.`
                : tier === "medium"
                  ? `${quizState.name}, you've got solid foundations! You're doing many things right, but there are 3 key gaps preventing breakthrough results.`
                  : `${quizState.name}, you're not behind — you're just missing some foundations. And foundations are the easiest thing to build once you know what they are.`}
            </p>

            <div className="space-y-6">
              <h3 className="text-xl font-bold" style={{ color: "#A15C2F" }}>
                {tier === "high" ? "The 3 Optimization Opportunities:" : "Your 3 Priority Areas:"}
              </h3>
              {gaps.map((gap, index) => (
                <GapCard key={gap.practice} gap={gap} index={index} />
              ))}
            </div>

            <TestimonialsBlock testimonials={testimonials} />

            <PricingCTA
              quizState={quizState}
              score={score}
              tier={tier}
              heading={tier === "high" ? "VIP Pregnancy Optimization Program" : "Join the Catalyst Mom App"}
              subheading={
                tier === "high"
                  ? "For high-performing women who want exclusive 1-on-1 coaching to optimize every aspect of pregnancy, labor prep, and postpartum planning."
                  : tier === "medium"
                    ? "Get pregnancy-safe workouts, meal plans, symptom management protocols, labor prep, and community support — all in one app."
                    : "A step-by-step pregnancy wellness system designed for moms who want clear guidance without the overwhelm."
              }
              buttonLabel={tier === "high" ? "Book Your VIP Strategy Call" : "Claim My Founding Seat"}
              footnote={
                tier === "high"
                  ? "Ongoing coaching tier: $129/month • Charter Founder seats lock the same 1:1 at $29/month for life (only 100)"
                  : "$29/month founding seat • Start seeing results in 7 days • Cancel anytime • No contracts"
              }
              isVip={tier === "high"}
              condensed={tier !== "high"}
            />
          </CardContent>
        </Card>

        <FounderNote />
      </div>
    </div>
  )
}
