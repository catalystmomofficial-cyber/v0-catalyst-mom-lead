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
  // Added fields for potential future use or mapping to lead_responses table
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
  birthExperience?: string // Added from updates
}

const supabase = createClient()

const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function PersonalizedConcernSection({
  concern,
  breakdown,
}: {
  concern: string
  breakdown: any[]
}) {
  if (!concern || concern.trim().length === 0) return null

  const concernLower = concern.toLowerCase()

  // Find relevant low-scoring areas
  const relevantGaps = breakdown.filter((item) => item.score <= 7).slice(0, 3)

  return (
    <Card className="border-0 shadow-xl mb-8" style={{ borderLeft: "6px solid #A15C2F" }}>
      <CardHeader>
        <CardTitle className="text-2xl" style={{ color: "#A15C2F" }}>
          💬 You Also Mentioned: Your Personalized Postpartum Journey
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Light purple box with user's words */}
        <div className="p-4 rounded-lg" style={{ backgroundColor: "#F3E5F5" }}>
          <p className="italic text-lg" style={{ color: "#666" }}>
            You shared: "{concern}"
          </p>
        </div>

        {/* Explanatory paragraph */}
        <p className="text-lg leading-relaxed" style={{ color: "#3A2412" }}>
          Based on your assessment, we'll create a customized postpartum recovery plan that addresses your unique
          situation. Our program combines evidence-based protocols with personalized support to help you achieve your
          goal of optimal postpartum wellness.
        </p>

        {/* Yellow/gold bordered box with gap connections */}
        <div className="p-6 rounded-lg border-2" style={{ borderColor: "#FFB74D", backgroundColor: "#FFF8E1" }}>
          <h3 className="text-xl font-bold mb-4" style={{ color: "#A15C2F" }}>
            How This Connects to Your Score:
          </h3>
          <p className="mb-4" style={{ color: "#3A2412" }}>
            Your concern about <strong>your postpartum recovery</strong> is directly related to the gaps we identified.
            Here's what's holding you back:
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
                  These aren't just "nice to haves"—these gaps are directly affecting your postpartum recovery and
                  quality of life. But here's the good news: they're ALL fixable with the right protocols and support.
                </p>
              </div>

                  <div>
                    <p className="font-bold text-lg mb-3" style={{ color: "#A15C2F" }}>
                      What's Included:
                    </p>
                    <div className="space-y-2">
                      <p className="flex items-start gap-2" style={{ color: "#3A2412" }}>
                        <span className="text-green-600 flex-shrink-0">✅</span>
                        <span>1-on-1 Human Check-ins — Bi-weekly expert progress reviews</span>
                      </p>
                      <p className="flex items-start gap-2" style={{ color: "#3A2412" }}>
                        <span className="text-green-600 flex-shrink-0">✅</span>
                        <span>24/7 Catalyst AI Expert — Instant answers to any wellness question</span>
                      </p>
                <div className="space-y-2">
                  <p className="flex items-start gap-2" style={{ color: "#3A2412" }}>
                    <span className="text-green-600 flex-shrink-0">✅</span>
                    <span>Complete postpartum recovery system (all 10 practice areas covered)</span>
                  </p>
                  <p className="flex items-start gap-2" style={{ color: "#3A2412" }}>
                    <span className="text-green-600 flex-shrink-0">✅</span>
                    <span>Personalized protocols based on YOUR gaps and recovery stage</span>
                  </p>
                  <p className="flex items-start gap-2" style={{ color: "#3A2412" }}>
                    <span className="text-green-600 flex-shrink-0">✅</span>
                    <span>Postpartum-safe workouts and core healing exercises</span>
                  </p>
                  <p className="flex items-start gap-2" style={{ color: "#3A2412" }}>
                    <span className="text-green-600 flex-shrink-0">✅</span>
                    <span>Expert guidance and community support from other moms</span>
                  </p>
                  <p className="flex items-start gap-2" style={{ color: "#3A2412" }}>
                    <span className="text-green-600 flex-shrink-0">✅</span>
                    <span>Evidence-based interventions for optimal postpartum recovery</span>
                  </p>
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

  // Template 1: "No time" / Busy / Overwhelmed
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
      response: `We see you. You're drowning.

Baby needs you every 2 hours. Laundry is piling up. You haven't showered in 3 days. The thought of "self-care" feels like a JOKE when you can barely find time to eat.

At your score, here's WHY you have no time (and how your gaps make it worse):

${
  lowScores.find((item) => item.practice.includes("Rest"))
    ? `→ **Rest & Recovery (${lowScores.find((item) => item.practice.includes("Rest"))?.score}/10):** You're not sleeping. Exhausted moms take 3x longer to do EVERYTHING. When you're running on empty, simple tasks feel impossible. That's why there's "no time" - exhaustion steals your efficiency.

`
    : ""
}${
  lowScores.find((item) => item.practice.includes("Nutrition"))
    ? `→ **Nutrition Tracking (${lowScores.find((item) => item.practice.includes("Nutrition"))?.score}/10):** You're grabbing whatever's fast (crackers, toast, leftovers). No real meals. So your energy crashes by 2pm, and suddenly "making dinner" takes an hour instead of 20 minutes. Poor nutrition = less energy = everything takes longer.

`
    : ""
}${
  lowScores.find((item) => item.practice.includes("Workout"))
    ? `→ **Workout Consistency (${lowScores.find((item) => item.practice.includes("Workout"))?.score}/10):** When you DO try to exercise, you're exhausted and inconsistent. So workouts feel like a BURDEN (one more thing to do) instead of an ENERGY BOOST. Proper workouts actually GIVE you time back by increasing energy.

`
    : ""
}${
  lowScores.find((item) => item.practice.includes("Medical"))
    ? `→ **Medical Clearance (${lowScores.find((item) => item.practice.includes("Medical"))?.score}/10):** You don't even know if you CAN start exercising safely. So you're stuck researching, googling, asking friends... wasting HOURS trying to figure out "what's safe." That's time you don't have.

`
    : ""
}
Here's the truth: You don't need MORE time. You need SYSTEMS that work FAST.

The app is designed for moms with ZERO time:
✅ 10-20 min workouts (can do while baby naps)
✅ 5-min meal plans (grab-and-go, no cooking skills needed)
✅ Done-for-you protocols (no more googling, just follow the plan)

Most moms at your score think "I'll start when I have more time."

But here's what actually happens: You build these foundations FIRST, then suddenly you HAVE more time (because energy returns, efficiency improves, brain fog lifts).

You get your time back by investing 15-20 min/day into these systems.

Within 2-3 weeks, most moms report feeling like they "gained 2 hours per day" - not because they have more hours, but because they have more ENERGY and CLARITY.`,
    }
  }

  // Template 2: "Big stomach" / Belly / Pooch / Diastasis
  if (
    notes.includes("stomach") ||
    notes.includes("belly") ||
    notes.includes("pooch") ||
    notes.includes("big") ||
    notes.includes("diastasis") ||
    notes.includes("abs") ||
    notes.includes("lol")
  ) {
    const hasLol = notes.includes("lol")
    return {
      concern: additionalNotes,
      title: `💬 You Also Mentioned: "${additionalNotes}"`,
      response: `${hasLol ? 'We see that "lol" - you\'re trying to laugh it off, but this is REAL and it bothers you.' : "We hear you. Your belly still looks pregnant and it's frustrating."}

At your score, here's WHY your stomach is still big (and what's actually causing it):

${
  lowScores.find((item) => item.practice.includes("Diastasis"))
    ? `→ **Diastasis Recti Awareness (${lowScores.find((item) => item.practice.includes("Diastasis"))?.score}/10):** You know your abs are separated, but not HOW to close the gap. That's why your belly still looks pregnant. Without proper diastasis healing, your core has no support and your belly protrudes.

`
    : ""
}${
  lowScores.find((item) => item.practice.includes("Core"))
    ? `→ **Core-Safe Exercise Practice (${lowScores.find((item) => item.practice.includes("Core"))?.score}/10):** You're probably doing crunches or planks - these WIDEN the gap and make your belly BIGGER. Traditional ab exercises are the WORST thing for postpartum bellies. You need core-safe movements that heal, not harm.

`
    : ""
}${
  lowScores.find((item) => item.practice.includes("Pelvic"))
    ? `→ **Pelvic Floor Training (${lowScores.find((item) => item.practice.includes("Pelvic"))?.score}/10):** Weak pelvic floor = weak core = belly has no support. It all connects. Your pelvic floor is the FOUNDATION of your core. Without it, your belly will never flatten.

`
    : ""
}${
  lowScores.find((item) => item.practice.includes("Nutrition"))
    ? `→ **Nutrition (${lowScores.find((item) => item.practice.includes("Nutrition"))?.score}/10):** Inflammation from poor nutrition makes your belly bloated and puffy. Even if you're "eating healthy," without anti-inflammatory protocols, your belly stays swollen.

`
    : ""
}
Here's the truth most doctors won't tell you: Your "mom pooch" isn't permanent. It's not "just how your body is now."

With the right core-safe exercises + diastasis healing protocol + pelvic floor work, 90% of women see significant improvement in 8-12 weeks.

**Inside the app:**
✅ Diastasis recti self-assessment (check your gap at home)
✅ Core-safe exercises that HEAL your abs (not harm them)
✅ Pelvic floor strengthening (the foundation of core recovery)
✅ Anti-inflammatory meal plans (reduce bloating in 7 days)
✅ Before/after tracking (see your progress weekly)

Your belly CAN look like it used to. But only with the RIGHT approach.

Most moms waste 6-12 months doing the WRONG exercises (crunches, planks, sit-ups) and wonder why nothing changes.

Don't be one of them.`,
    }
  }

  // Template 3: "Frustrating" / Frustrated / Annoyed
  if (notes.includes("frustrat") || notes.includes("annoyed") || notes.includes("irritated")) {
    return {
      concern: additionalNotes,
      title: `💬 You Also Mentioned: "${additionalNotes}"`,
      response: `We hear you. Postpartum IS frustrating - especially when you feel like you're barely surviving (not thriving).

At your score, here's WHY everything feels so frustrating right now:

${
  lowScores.find((item) => item.practice.includes("Medical"))
    ? `→ **Medical Clearance (${lowScores.find((item) => item.practice.includes("Medical"))?.score}/10):** You don't even know if it's SAFE to start exercising yet. You want to feel better, but you're stuck in limbo waiting for your body to heal. That uncertainty? Frustrating.

`
    : ""
}${
  lowScores.find((item) => item.practice.includes("Pelvic"))
    ? `→ **Pelvic Floor Training (${lowScores.find((item) => item.practice.includes("Pelvic"))?.score}/10):** You're probably leaking when you sneeze or laugh. Maybe you avoid jumping or running. Your body feels "broken" and you don't know how to fix it. That's frustrating.

`
    : ""
}${
  lowScores.find((item) => item.practice.includes("Core"))
    ? `→ **Core-Safe Exercise Practice (${lowScores.find((item) => item.practice.includes("Core"))?.score}/10):** You might be TRYING to work out, but doing the wrong exercises (crunches? planks?). So you're putting in effort but seeing NO results. Your belly still looks pregnant. That's INCREDIBLY frustrating.

`
    : ""
}${
  lowScores.find((item) => item.practice.includes("Rest"))
    ? `→ **Rest & Recovery (${lowScores.find((item) => item.practice.includes("Rest"))?.score}/10):** You're exhausted. Baby wakes every 2 hours. You're touched out. You have no energy. And everyone says "sleep when baby sleeps" but that's IMPOSSIBLE. Exhaustion makes everything 10x more frustrating.

`
    : ""
}${
  lowScores.find((item) => item.practice.includes("Nutrition"))
    ? `→ **Nutrition (${lowScores.find((item) => item.practice.includes("Nutrition"))?.score}/10):** You're probably eating whatever you can grab (crackers, toast, leftovers). No time for real meals. So your energy crashes, your mood tanks, and you feel like crap. Frustrating.

`
    : ""
}
The frustration you feel is VALID. You're not failing - you're just trying to recover without the right foundations.

Most moms at your score feel hopeless. But here's the truth: Once you build these 5 foundations (medical clearance, pelvic floor, core work, rest protocol, nutrition), the frustration LIFTS.

You start feeling like yourself again. Not just "mom." YOU.

And that usually happens in 8-12 weeks with the right system.`,
    }
  }

  // Template 4: Exhausted / Tired / No energy
  if (
    notes.includes("exhaust") ||
    notes.includes("tired") ||
    notes.includes("no energy") ||
    notes.includes("fatigue") ||
    notes.includes("drained")
  ) {
    return {
      concern: additionalNotes,
      title: `💬 You Also Mentioned: " ${additionalNotes}"`,
      response: `We see you. You're running on empty.

Baby wakes every 2-3 hours. You haven't slept more than 4 hours straight in weeks. Coffee doesn't even work anymore. You're so tired you could cry.

At your score, here's WHY you're so exhausted (and it's not just "new mom life"):

${
  lowScores.find((item) => item.practice.includes("Rest"))
    ? `→ **Rest & Recovery (${lowScores.find((item) => item.practice.includes("Rest"))?.score}/10):** You're using baby's nap time to do chores instead of resting. Your body heals during rest - not during laundry. Without proper recovery, exhaustion compounds daily.

`
    : ""
}${
  lowScores.find((item) => item.practice.includes("Nutrition"))
    ? `→ **Nutrition Tracking (${lowScores.find((item) => item.practice.includes("Nutrition"))?.score}/10):** You're not tracking what you eat, which means you're likely under-eating or eating the wrong macros. Your body needs 300-500 extra calories for recovery and milk production. Without proper nutrition, you're running on fumes.

`
    : ""
}${
  lowScores.find((item) => item.practice.includes("Protein"))
    ? `→ **Protein Intake (${lowScores.find((item) => item.practice.includes("Protein"))?.score}/10):** You're probably eating under 50g/day. Postpartum moms need 80g+ for recovery and milk production. Without adequate protein, your body cannibalizes muscle for fuel. That's why you're exhausted.

`
    : ""
}${
  lowScores.find((item) => item.practice.includes("Hydration"))
    ? `→ **Hydration (${lowScores.find((item) => item.practice.includes("Hydration"))?.score}/10):** Dehydration mimics exhaustion. If you're breastfeeding, you need 100+ oz of water daily. Most moms drink 40-50 oz. That 50 oz gap? That's your energy.

`
    : ""
}${
  lowScores.find((item) => item.practice.includes("Workout"))
    ? `→ **Workout Consistency (${lowScores.find((item) => item.practice.includes("Workout"))?.score}/10):** You're not moving your body, so your energy stays low. It sounds backwards, but gentle movement CREATES energy. Without it, you stay stuck in exhaustion.

`
    : ""
}
Here's the truth: You don't need more sleep (though that helps). You need the right nutrition, movement, and recovery protocols.

**Inside the app:**
✅ Energy optimization protocols (double your energy in 7 days)
✅ Protein-rich meal plans (hit 80g+ easily)
✅ Hydration tracking (with reminders)
✅ Gentle movement routines (that energize, not deplete)
✅ Rest optimization strategies (maximize nap time recovery)

Most moms think "I'll start when I have more energy."

But here's what actually happens: You build these foundations FIRST, then energy returns.

Within 2-3 weeks, most moms report feeling like they "woke up" for the first time in months.`,
    }
  }

  // Template 5: Leaking / Pelvic floor / Incontinence
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
      response: `We hear you. Leaking when you sneeze, laugh, or jump is embarrassing and frustrating.

You avoid trampolines. You wear pads "just in case." You're scared to work out because you might leak. Your body feels broken.

At your score, here's WHY you're leaking (and how to fix it):

${
  lowScores.find((item) => item.practice.includes("Pelvic"))
    ? `→ **Pelvic Floor Training (${lowScores.find((item) => item.practice.includes("Pelvic"))?.score}/10):** Your pelvic floor muscles are weak from pregnancy and birth. Without proper strengthening, they can't support your bladder. That's why you leak. But here's the good news: 85% of women see improvement in 6-8 weeks with the right exercises.

`
    : ""
}${
  lowScores.find((item) => item.practice.includes("Core"))
    ? `→ **Core-Safe Exercise Practice (${lowScores.find((item) => item.practice.includes("Core"))?.score}/10):** Your core and pelvic floor work together. Weak core = weak pelvic floor. Without core-safe exercises, your pelvic floor has no support and leaking continues.

`
    : ""
}${
  lowScores.find((item) => item.practice.includes("Medical"))
    ? `→ **Medical Clearance (${lowScores.find((item) => item.practice.includes("Medical"))?.score}/10):** You haven't been cleared to start pelvic floor rehab. Without proper assessment, you don't know if you have prolapse, severe weakness, or other issues that need specific treatment.

`
    : ""
}
Here's the truth: Leaking is NOT normal. It's common, but it's NOT something you have to "just live with."

**Inside the app:**
✅ Pelvic floor strengthening protocol (daily exercises, 5 min)
✅ Core-safe workouts (that support pelvic floor, not harm it)
✅ Breathing techniques (activate deep pelvic floor muscles)
✅ Progress tracking (see improvement weekly)
✅ Return-to-running protocol (when you're ready)

Most moms think "I'll just do Kegels." But Kegels alone don't work for 70% of women.

You need a comprehensive pelvic floor + core protocol.

Within 6-8 weeks, most moms see 80-90% reduction in leaking. Many stop leaking entirely.

Your body isn't broken. It just needs the right rehab.`,
    }
  }

  // Template 6: Weight / Can't lose weight / Body image
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
      response: `We hear you. You want to feel like yourself again.

You're still wearing maternity clothes. Nothing fits. You avoid mirrors. You feel disconnected from your body.

At your score, here's WHY the weight isn't coming off (and it's not your fault):

${
  lowScores.find((item) => item.practice.includes("Nutrition"))
    ? `→ **Nutrition Tracking (${lowScores.find((item) => item.practice.includes("Nutrition"))?.score}/10):** You're not tracking what you eat, which means you're either under-eating (slowing metabolism) or over-eating (without realizing it). Without data, you're guessing. And guessing doesn't work.

`
    : ""
}${
  lowScores.find((item) => item.practice.includes("Protein"))
    ? `→ **Protein Intake (${lowScores.find((item) => item.practice.includes("Protein"))?.score}/10):** You're probably eating under 80g/day. Without adequate protein, your body holds onto fat and burns muscle instead. That's why the scale won't budge.

`
    : ""
}${
  lowScores.find((item) => item.practice.includes("Workout"))
    ? `→ **Workout Consistency (${lowScores.find((item) => item.practice.includes("Workout"))?.score}/10):** You're not moving consistently, so your metabolism stays slow. Without regular movement, your body stays in "survival mode" and holds onto every calorie.

`
    : ""
}${
  lowScores.find((item) => item.practice.includes("Rest"))
    ? `→ **Rest & Recovery (${lowScores.find((item) => item.practice.includes("Rest"))?.score}/10):** You're not sleeping enough. Sleep deprivation increases cortisol (stress hormone) which makes your body STORE fat, especially around your belly. You can't out-exercise bad sleep.

`
    : ""
}${
  lowScores.find((item) => item.practice.includes("Hydration"))
    ? `→ **Hydration (${lowScores.find((item) => item.practice.includes("Hydration"))?.score}/10):** Dehydration slows metabolism by 30%. If you're not drinking 80-100 oz daily, your body literally can't burn fat efficiently.

`
    : ""
}
Here's the truth: Postpartum weight loss is NOT about "eating less and moving more."

It's about:
✅ Eating ENOUGH (especially protein)
✅ Moving CONSISTENTLY (not intensely)
✅ Sleeping ADEQUATELY (7-9 hours)
✅ Managing STRESS (cortisol blocks fat loss)
✅ Healing FIRST (core, pelvic floor, hormones)

**Inside the app:**
✅ Postpartum nutrition plans (macro-balanced, not restrictive)
✅ Protein-rich meal ideas (hit 80g+ easily)
✅ Metabolism-boosting protocols
✅ Body recomposition tracking (not just scale weight)

Most moms are under-eating and over-exercising. That's why nothing works.

Within 8-12 weeks of proper nutrition + movement + recovery, most moms lose 10-15 lbs and feel STRONG (not just skinny).

Your body isn't broken. It just needs the right approach.`,
    }
  }

  // Template 7: Pain / Back pain / Body hurts
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
      response: `We hear you. Your body hurts.
\
Your back aches from carrying baby. Your hips are tight. Your shoulders are tense from nursing. Everything feels stiff and sore.

At your score, here's WHY you're in pain (and how to fix it):

${
  lowScores.find((item) => item.practice.includes("Core"))
    ? `→ **Core-Safe Exercise Practice (${lowScores.find((item) => item.practice.includes("Core"))?.score}/10):** Weak core = back compensates = pain. Without proper core strength, your back takes all the load when you lift baby, bend over, or carry things. That's why it hurts.

`
    : ""
}${
  lowScores.find((item) => item.practice.includes("Pelvic"))
    ? `→ **Pelvic Floor Training (${lowScores.find((item) => item.practice.includes("Pelvic"))?.score}/10):** Weak pelvic floor = weak core = back pain. It all connects. Your pelvic floor is the foundation of your core. Without it, your back suffers.

`
    : ""
}${
  lowScores.find((item) => item.practice.includes("Workout"))
    ? `→ **Workout Consistency (${lowScores.find((item) => item.practice.includes("Workout"))?.score}/10):** You're not moving regularly, so your muscles stay tight and weak. Without consistent movement, pain persists and worsens.

`
    : ""
}${
  lowScores.find((item) => item.practice.includes("Nutrition"))
    ? `→ **Nutrition (${lowScores.find((item) => item.practice.includes("Nutrition"))?.score}/10):** Inflammation from poor nutrition makes pain worse. Without anti-inflammatory foods, your body stays inflamed and sore.

`
    : ""
}
Here's the truth: Postpartum pain is NOT normal. It's common, but it's NOT something you have to "just live with."

**Inside the app:**
✅ Core-strengthening exercises (reduce back pain in 2-3 weeks)
✅ Pelvic floor rehab (foundation of pain-free movement)
✅ Mobility routines (release tight hips, shoulders, back)
✅ Anti-inflammatory meal plans (reduce pain from the inside)
✅ Proper lifting techniques (protect your back)

Most moms think "I'll just stretch more." But stretching alone doesn't fix weak muscles.

You need strength + mobility + proper movement patterns.

Within 3-4 weeks, most moms report 70-80% reduction in pain.

Your body isn't broken. It just needs the right rehab.`,
    }
  }

  // Template 8: Depressed / Anxious / Mental health
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
      response: `We see you. Postpartum is hard - physically AND emotionally.

You're crying more than usual. You feel disconnected. You're anxious about everything. You wonder if you're a good mom.

At your score, here's WHY you're struggling mentally (and how physical health impacts mental health):

${
  lowScores.find((item) => item.practice.includes("Rest"))
    ? `→ **Rest & Recovery (${lowScores.find((item) => item.practice.includes("Rest"))?.score}/10):** Sleep deprivation increases depression risk by 300%. Without adequate rest, your brain can't regulate emotions. That's why everything feels overwhelming.

`
    : ""
}${
  lowScores.find((item) => item.practice.includes("Nutrition"))
    ? `→ **Nutrition (${lowScores.find((item) => item.practice.includes("Nutrition"))?.score}/10):** Your brain needs specific nutrients (omega-3s, B vitamins, protein) to produce serotonin and dopamine. Without proper nutrition, your mood tanks.

`
    : ""
}${
  lowScores.find((item) => item.practice.includes("Workout"))
    ? `→ **Workout Consistency (${lowScores.find((item) => item.practice.includes("Workout"))?.score}/10):** Exercise is one of the most effective treatments for depression and anxiety. Without regular movement, your mental health suffers.

`
    : ""
}${
  lowScores.find((item) => item.practice.includes("Hydration"))
    ? `→ **Hydration (${lowScores.find((item) => item.practice.includes("Hydration"))?.score}/10):** Dehydration increases anxiety and brain fog. If you're not drinking enough, your mental clarity and mood suffer.

`
    : ""
}
**IMPORTANT:** If you're experiencing severe depression, suicidal thoughts, or thoughts of harming yourself or baby, please call your doctor or the Postpartum Support International hotline: 1-800-944-4773.

Here's the truth: Physical health and mental health are CONNECTED.

When you:
✅ Sleep better → Mood improves
✅ Eat better → Brain fog lifts
✅ Move consistently → Anxiety decreases
✅ Hydrate properly → Mental clarity returns

**Inside the app:**
✅ Mood-boosting nutrition protocols
✅ Gentle movement routines (proven to reduce depression)
✅ Community support (you're not alone)
✅ Energy optimization (more energy = better mood)
✅ Stress management techniques

Most moms at your score feel hopeless. But here's the truth: Small physical changes create BIG mental shifts.

Within 2-3 weeks of proper nutrition + movement + rest, most moms report feeling "like themselves again."

You're not broken. You're not a bad mom. You're just depleted.

And depletion is fixable.`,
    }
  }

  // Default: Generic but still personalized
  const topGaps = lowScores.slice(0, 3)
  if (topGaps.length > 0) {
    return {
      concern: additionalNotes,
      title: `💬 You Also Mentioned: "${additionalNotes}"`,
      response: `We hear you. Your concern is valid and directly connected to the gaps we identified in your assessment.

At your score, here's what's holding you back:

${topGaps
  .map((gap) => {
    const gapExplanations: Record<string, string> = {
      "Medical Clearance":
        "You haven't been medically cleared to start exercising. Without knowing what's safe, you're stuck in limbo - wanting to feel better but scared to hurt yourself.",
      "Pelvic Floor Training":
        "Your pelvic floor is weak from pregnancy and birth. This affects EVERYTHING - core strength, back pain, leaking, and even your ability to work out safely.",
      "Diastasis Recti Awareness":
        "You don't know if your abs are separated or how to heal them. Without proper assessment and treatment, your core stays weak and your belly protrudes.",
      "Core-Safe Exercise Practice":
        "You're either not exercising or doing unsafe movements that make things worse. Without core-safe exercises, you can't rebuild strength or lose the 'mom pooch.'",
      "Rest & Recovery":
        "You're not prioritizing rest, so your body can't heal. Exhaustion compounds daily, making everything harder - from workouts to parenting to mental health.",
      "Nutrition Tracking":
        "You're not tracking what you eat, so you don't know if you're eating enough (or too much). Without data, you're guessing - and guessing doesn't work.",
      "Protein Intake":
        "You're probably eating under 80g/day. Without adequate protein, your body can't recover, build muscle, or produce milk (if breastfeeding).",
      Hydration:
        "You're not drinking enough water. Dehydration mimics exhaustion, slows metabolism, and makes everything harder - from workouts to mental clarity.",
      "Workout Consistency":
        "You're not moving regularly, so your energy stays low and your body stays weak. Without consistent movement, recovery stalls.",
      "Wellness Tracking":
        "You're not tracking your progress, so you don't know what's working. Without data, you can't adjust your approach or celebrate wins.",
    }

    return `→ **${gap.practice} (${gap.score}/10):** ${gapExplanations[gap.practice] || "This gap is preventing you from feeling your best and reaching your goals."}`
  })
  .join("\n\n")}

The good news? Every single one of these gaps is closable.

**Inside the app:**
✅ Step-by-step protocols for each gap
✅ Daily guidance (no more guessing)
✅ Progress tracking (see improvement weekly)
✅ Community support (you're not alone)
✅ 1-on-1 Human Check-ins — Bi-weekly expert progress reviews.
✅ 24/7 Catalyst AI Expert — Instant answers to any wellness question.

Most moms at your score feel stuck. But here's the truth: Small, strategic changes create BIG results.

Within 8-12 weeks, most moms report feeling like "themselves again" - not just physically, but mentally and emotionally too.

Your concern is valid. And it's fixable.`,
    }
  }

  return {
    concern: additionalNotes,
    title: `💬 Thank You for Sharing`,
    response: `We appreciate you sharing your thoughts with us. Every mom's journey is unique, and your specific situation matters.
\
Based on your assessment, we've identified the key areas that need attention to help you feel your best.

The Catalyst Mom app provides personalized support, evidence-based protocols, and a community of women on the same journey.

You don't have to figure this out alone.`,
  }
}

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
    birthExperience: "", // Added from updates
  })
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [scoreTier, setScoreTier] = useState<"low" | "medium" | "high">("low") // Declare the tier variable
  const [isLoading, setIsLoading] = useState(false)
  const [tier, setTier] = useState<"low" | "medium" | "high">("low") // Declare the tier variable

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

    // Q1: Timeline postpartum (always counts as 10, just for tracking)
    totalScore += 10

    // Q2: Medical clearance
    if (quizState.medicalClearance === "yes") totalScore += 10
    else totalScore += 0

    // Q3: Diastasis recti
    if (quizState.diastasisRecti === "diagnosed") totalScore += 10
    else if (quizState.diastasisRecti === "think-so") totalScore += 7
    else if (quizState.diastasisRecti === "no") totalScore += 10
    else totalScore += 3 // dont-know

    // Q4: Core and pelvic floor
    if (quizState.coreSafeExercises === "leak") totalScore += 3
    else if (quizState.coreSafeExercises === "weak") totalScore += 5
    else if (quizState.coreSafeExercises === "pain") totalScore += 4
    else if (quizState.coreSafeExercises === "all") totalScore += 2
    else if (quizState.coreSafeExercises === "okay") totalScore += 10

    // Q5: Movement
    if (quizState.workoutRoutine === "3-plus") totalScore += 10
    else if (quizState.workoutRoutine === "1-2") totalScore += 7
    else if (quizState.workoutRoutine === "occasional") totalScore += 4
    else if (quizState.workoutRoutine === "not-started") totalScore += 0

    // Q6: Nutrition/Fueling
    if (quizState.nutrition === "well") totalScore += 10
    else if (quizState.nutrition === "okay") totalScore += 6
    else if (quizState.nutrition === "poorly") totalScore += 2
    else if (quizState.nutrition === "no-idea") totalScore += 0

    // Q7: Energy and rest
    if (quizState.rest === "good") totalScore += 10
    else if (quizState.rest === "tired") totalScore += 7
    else if (quizState.rest === "exhausted") totalScore += 2
    else if (quizState.rest === "depleted") totalScore += 0

    // Q8, Q9, Q10 are name/email/goal/barrier - these don't score but are counted for navigation
    // Name and email are informational only

    // Q11: Primary goal (doesn't affect scoring, just for personalization)
    totalScore += 0 // No points for this question

    // Q12: Biggest barrier (doesn't affect scoring, just for personalization)
    totalScore += 0 // No points for this question

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

        // Add custom properties for Omnisend
        const customProperties = {
          assessment_type: "Postpartum",
          score: calculatedScore,
          score_tier: tier,
          weeks_postpartum: quizState.weeksPostpartum,
          primary_goal: quizState.primaryGoal,
          birth_experience: quizState.birthExperience, // Added from updates
          results_url: `https://catalystmom.online/results/${"data.id"}`, // Added results URL - Placeholder for now, will be replaced by actual ID
        }

        // Send to Omnisend
        await addContactToOmnisend({
          email: quizState.email,
          firstName: quizState.name,
          tags: ["postpartum-assessment", `score-${tier}`, `weeks-${quizState.weeksPostpartum}`],
          customProperties: customProperties, // Use the defined customProperties
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
              birth_experience: quizState.birthExperience, // Added from updates
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

        // Store the assessment ID for results page
        if (supabaseData && supabaseData[0]) {
          sessionStorage.setItem("postpartum_assessment_id", supabaseData[0].id)
          // Update the results_url with the actual ID
          customProperties.results_url = `https://catalystmom.online/results/${supabaseData[0].id}`
          // Re-send to Omnisend with updated URL (optional, depending on Omnisend's update capabilities)
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
      return (
        quizState.name.trim() !== "" &&
        quizState.email.trim() !== "" &&
        isValidEmail(quizState.email)
      )
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
                  * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                  }
                  body {
                    font-family: 'Georgia', serif;
                    background: linear-gradient(135deg, #F8F5F2, #F0E6D2);
                    padding: 40px;
                    color: #3A2412;
                  }
                  .cover {
                    text-align: center;
                    padding: 60px 20px;
                    background: white;
                    border-radius: 12px;
                    margin-bottom: 40px;
                    box-shadow: 0 4px 20px rgba(161, 92, 47, 0.1);
                  }
                  .cover img {
                    width: 150px;
                    height: 150px;
                    border-radius: 50%;
                    margin-bottom: 20px;
                  }
                  .cover h1 {
                    font-size: 36px;
                    color: #A15C2F;
                    margin-bottom: 10px;
                  }
                  .cover p {
                    font-size: 18px;
                    color: #6B4423;
                  }
                  .section {
                    background: white;
                    padding: 30px;
                    margin-bottom: 20px;
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(161, 92, 47, 0.1);
                  }
                  .section h2 {
                    font-size: 24px;
                    color: #A15C2F;
                    margin-bottom: 15px;
                    border-bottom: 3px solid #A15C2F;
                    padding-bottom: 10px;
                  }
                  .section ul {
                    list-style: none;
                    padding: 0;
                  }
                  .section li {
                    padding: 10px 0;
                    border-bottom: 1px solid #E8D5C4;
                    color: #3A2412;
                    line-height: 1.6;
                  }
                  .cta {
                    text-align: center;
                    padding: 40px 20px;
                    background: linear-gradient(135deg, #A15C2F, #C27B48);
                    color: white;
                    border-radius: 12px;
                    margin-top: 40px;
                  }
                  .cta h2 {
                    font-size: 28px;
                    margin-bottom: 15px;
                  }
                  .cta p {
                    font-size: 16px;
                    margin-bottom: 20px;
                  }
                  .cta button {
                    background: white;
                    color: #A15C2F;
                    border: none;
                    padding: 15px 40px;
                    font-size: 18px;
                    font-weight: bold;
                    border-radius: 8px;
                    cursor: pointer;
                  }
                  @media print {
                    body { background: white; }
                    .cta button { display: none; }
                  }
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
                    <ul>
                      ${section.content.map((item: string) => `<li>${item}</li>`).join("")}
                    </ul>
                  </div>
                `,
                  )
                  .join("")}
                
                <div class="cta">
                  <h2>Ready to Transform Your Wellness Journey?</h2>
                  <p>This free guide is just the beginning. Get personalized coaching, community support, and expert-designed programs.</p>
                  <button onclick="window.location.href='https://catalystmom.online'">Join Catalyst Mom Today</button>
                </div>
                
                <script>
                  setTimeout(() => window.print(), 500);
                </script>
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
                You're in Early Healing Mode
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="text-center">
                <p className="text-xl mb-4" style={{ color: "#3A2412" }}>
                  First - congratulations on your baby! Your body just did something INCREDIBLE.
                </p>
                <p className="text-lg leading-relaxed" style={{ color: "#3A2412" }}>
                  Right now (0-6 weeks postpartum), you're in the critical healing phase. This isn't the time for
                  workout programs or weight loss efforts. Your job is to rest, heal, and bond with baby.
                </p>
              </div>

              <div className="bg-amber-50 p-6 rounded-lg border-l-4" style={{ borderLeftColor: "#A15C2F" }}>
                <h3 className="font-bold text-lg mb-3" style={{ color: "#A15C2F" }}>
                  Focus on These 4 Things:
                </h3>
                <ul className="space-y-2" style={{ color: "#3A2412" }}>
                  <li>✅ REST and let your body heal (seriously - rest!)</li>
                  <li>✅ Focus on gentle movement (short walks only)</li>
                  <li>✅ Eat nourishing foods (don't diet - NOURISH)</li>
                  <li>✅ Bond with baby (this is your main 'work')</li>
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
                  You're Not Behind. You're Not Lazy. You're HEALING.
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

  const question = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    // Apply 2-column grid layout for postpartum assessment
    <div className="min-h-screen p-4" style={{ background: "linear-gradient(135deg, #F8F5F2, #F0E6D2)" }}>
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="col-span-1 md:col-span-2">
          {" "}
          {/* Full width for header elements */}
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
                style={{
                  backgroundColor: "#A15C2F",
                  width: `${progress}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Question Card - Takes up remaining space */}
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
                    Your personalised recovery roadmap is waiting. Enter your details below and we will send it straight to your inbox.
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

        {/* Navigation - Spanning across columns if needed or in its own row */}
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
    if (score <= 40) return "#E57373" // Red/coral for 0-40
    if (score <= 70) return "#FFB74D" // Yellow/orange for 41-70
    return "#81C784" // Green for 71-100
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

            {/* Progress Bar */}
            <div className="max-w-md mx-auto mb-6">
              <div className="w-full h-3 rounded-full" style={{ backgroundColor: "#E8D5C4" }}>
                <div
                  className="h-3 rounded-full transition-all duration-500"
                  style={{
                    backgroundColor: getTierColor(),
                    width: `${score}%`,
                  }}
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
              Here's exactly how you scored across the 10 essential postpartum wellness practices:
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {breakdown.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg border-2"
                style={{
                  borderColor: item.status === "excellent" ? "#81C784" : item.status === "good" ? "#FFB74D" : "#E57373",
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

        {/* Tier-Specific Content */}
        {tier === "high" && <HighScorerContent score={score} quizState={quizState} breakdown={breakdown} tier={tier} />}
        {tier === "medium" && (
          <MediumScorerContent score={score} quizState={quizState} breakdown={breakdown} tier={tier} />
        )}
        {tier === "low" && <LowScorerContent score={score} quizState={quizState} breakdown={breakdown} tier={tier} />}
      </div>
    </div>
  )
}

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
            You're already ahead of 85% of postpartum moms. Seriously - most moms would LOVE to be where you are right
            now.
          </p>
          <p className="text-lg leading-relaxed" style={{ color: "#3A2412" }}>
            But here's what high-performers like you understand:{" "}
            <strong>The difference between "good enough" and "exceptional" is in the details.</strong>
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
              Here's the truth:
            </p>
            <p className="text-lg" style={{ color: "#3A2412" }}>
              These aren't big problems. They're precision optimizations that take you from "good recovery" to "dream
              recovery."
            </p>
            <p className="text-lg mt-2" style={{ color: "#3A2412" }}>
              And that's exactly what our VIP coaching is designed for - high-performers who want to dial in the
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

          <div className="p-6 bg-white rounded-lg border-2" style={{ borderColor: "#A15C2F" }}>
            <h3 className="text-xl font-bold mb-4" style={{ color: "#A15C2F" }}>
              Who VIP Coaching Is For:
            </h3>
            <div className="space-y-2">
              <p className="flex items-start gap-2" style={{ color: "#3A2412" }}>
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                <span>
                  <strong>2 Private Coaching Calls Per Month</strong> (30-45 min each) - Deep-dive your progress, adjust
                  your plan, troubleshoot challenges in real-time
                </span>
              </p>
              <p className="flex items-start gap-2" style={{ color: "#3A2412" }}>
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                <span>
                  <strong>Custom Workout + Nutrition Plan</strong> - Not generic templates, completely personalized to
                  your assessment results
                </span>
              </p>
              <p className="flex items-start gap-2" style={{ color: "#3A2412" }}>
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                <span>
                  <strong>Direct Text Access to Your Coach</strong> - Questions answered within 24 hours, no waiting for
                  next week's call
                </span>
              </p>
              <p className="flex items-start gap-2" style={{ color: "#3A2412" }}>
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                <span>
                  <strong>Personalized Recovery Strategy Session</strong> - Core healing, pelvic floor strengthening,
                  decision-making frameworks
                </span>
              </p>
              <p className="flex items-start gap-2" style={{ color: "#3A2412" }}>
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                <span>
                  <strong>Ongoing Progress Tracking</strong> - Customized to your recovery timeline and goals
                </span>
              </p>
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

          <div className="p-6 bg-amber-50 rounded-lg">
            <h3 className="text-xl font-bold mb-4" style={{ color: "#A15C2F" }}>
              What You Get as a VIP Client:
            </h3>
            <div className="space-y-3">
              <p className="flex items-start gap-2" style={{ color: "#3A2412" }}>
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                <span>
                  <strong>2 Private Coaching Calls Per Month</strong> (30-45 min each) - Deep-dive your progress, adjust
                  your plan, troubleshoot challenges in real-time
                </span>
              </p>
              <p className="flex items-start gap-2" style={{ color: "#3A2412" }}>
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                <span>
                  <strong>Custom Workout + Nutrition Plan</strong> - Not generic templates, completely personalized to
                  your assessment results
                </span>
              </p>
              <p className="flex items-start gap-2" style={{ color: "#3A2412" }}>
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                <span>
                  <strong>Direct Text Access to Your Coach</strong> - Questions answered within 24 hours, no waiting for
                  next week's call
                </span>
              </p>
              <p className="flex items-start gap-2" style={{ color: "#3A2412" }}>
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                <span>
                  <strong>Personalized Recovery Strategy Session</strong> - Core healing, pelvic floor strengthening,
                  decision-making frameworks
                </span>
              </p>
              <p className="flex items-start gap-2" style={{ color: "#3A2412" }}>
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                <span>
                  <strong>Ongoing Progress Tracking</strong> - Customized to your recovery timeline and goals
                </span>
              </p>
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

          {/* Social Proof */}
          <div className="p-6 bg-green-50 rounded-lg border-2 border-green-400">
            <h3 className="text-xl font-bold mb-4 text-center" style={{ color: "#A15C2F" }}>
              📊 Results From VIP Clients Who Started as 70+ Scorers:
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="text-center p-4 bg-white rounded-lg">
                <p className="text-3xl font-bold" style={{ color: "#A15C2F" }}>
                  96/100
                </p>
                <p className="text-sm" style={{ color: "#3A2412" }}>
                  Average final score
                </p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg">
                <p className="text-3xl font-bold" style={{ color: "#A15C2F" }}>
                  96%
                </p>
                <p className="text-sm" style={{ color: "#3A2412" }}>
                  Feel "completely confident"
                </p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg">
                <p className="text-3xl font-bold" style={{ color: "#A15C2F" }}>
                  8 weeks
                </p>
                <p className="text-sm" style={{ color: "#3A2412" }}>
                  Avg recovery to "feeling like myself"
                </p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg">
                <p className="text-3xl font-bold" style={{ color: "#A15C2F" }}>
                  89%
                </p>
                <p className="text-sm" style={{ color: "#3A2412" }}>
                  Avoided complications
                </p>
              </div>
            </div>
            <p className="text-center mt-4 font-semibold" style={{ color: "#A15C2F" }}>
              Current availability: 3 spots open this month
            </p>
          </div>

          {/* Testimonials */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-center" style={{ color: "#A15C2F" }}>
              💬 What VIP Clients Say:
            </h3>
            <div className="p-6 bg-white rounded-lg border-2" style={{ borderColor: "#E8D5C4" }}>
              <p className="italic mb-3" style={{ color: "#3A2412" }}>
                "I scored a 74 and honestly thought I was doing great. After 8 weeks of VIP coaching, I hit 96. My
                recovery was an absolute DREAM - back in my jeans 6 weeks postpartum. Best investment I made."
              </p>
              <p className="font-semibold" style={{ color: "#A15C2F" }}>
                — Emily R., VIP Client, Mom of 2
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg border-2" style={{ borderColor: "#E8D5C4" }}>
              <p className="italic mb-3" style={{ color: "#3A2412" }}>
                "I was at 78/100 and thought 'I'm fine.' My coach showed me the small gaps that were holding me back. We
                fixed them in 4 weeks. I went from 'I think I'm ready' to 'I AM ready' - totally different confidence
                level."
              </p>
              <p className="font-semibold" style={{ color: "#A15C2F" }}>
                — Jessica L., VIP Client, Mom of 1
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center p-8 bg-white rounded-lg border-4" style={{ borderColor: "#A15C2F" }}>
            <Button
              size="lg"
              className="w-full md:w-auto text-white px-6 py-3 text-base md:px-12 md:py-6 md:text-xl font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
              style={{ background: "linear-gradient(135deg, #A15C2F, #C27B48)" }}
              onClick={() => window.open("https://calendly.com/catalystmomofficial/30min", "_blank")}
            >
              Book Your VIP Strategy Call
            </Button>
            <p className="text-sm mt-4" style={{ color: "#3A2412", opacity: 0.7 }}>
              Limited to 10 clients per month
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

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
          <p className="text-lg leading-relaxed font-semibold" style={{ color: "#A15C2F" }}>
            {quizState.name}, your score reveals a Critical Gap in your recovery. This is why you aren't feeling like yourself yet.
          </p>
          <p className="text-lg leading-relaxed" style={{ color: "#3A2412" }}>
            You're doing some things right, but you have <strong>3 key gaps</strong> that are holding you back from breakthrough results — and based on what you shared, these gaps are DIRECTLY causing your concerns.
          </p>

          <div className="space-y-4 mt-6">
            <h3 className="text-xl font-bold" style={{ color: "#A15C2F" }}>
              🎯 Your 3 Priority Areas
            </h3>

            {gapAreas.map((gap, index) => (
              <div key={index} className="p-6 bg-amber-50 rounded-lg border-l-4" style={{ borderLeftColor: "#FFB74D" }}>
                <p className="font-semibold text-xl mb-3" style={{ color: "#A15C2F" }}>
                  {index + 1}. {gap.practice} ({gap.score}/10) - {gap.score === 0 ? "Most Critical" : "Needs Attention"}
                </p>

                {/* Detailed explanation based on practice type */}
                {gap.practice.includes("Nutrition") && (
                  <div className="space-y-3" style={{ color: "#3A2412" }}>
                    <p>Right now, you're not tracking macros, meal timing, or nutrient density. This impacts:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Baby's development (neural tube, bone growth, brain development)</li>
                      <li>YOUR energy (proper timing doubles energy in 7 days)</li>
                      <li>Back pain and inflammation (anti-inflammatory nutrition reduces pain 40%)</li>
                      <li>Recovery speed postpartum (nutrition NOW determines healing LATER)</li>
                    </ul>
                    <p className="font-semibold mt-3" style={{ color: "#A15C2F" }}>
                      Inside the app: Trimester-specific meal plans, macro calculators, grocery lists, anti-inflammatory
                      recipes, energy optimization protocols.
                    </p>
                  </div>
                )}

                {gap.practice.includes("Core") && (
                  <div className="space-y-3" style={{ color: "#3A2412" }}>
                    <p>
                      You're either not exercising, or doing unsafe movements. Either way, your body isn't prepared for:
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
                    <p>You're doing some Kegels, but not a complete strengthening protocol. Here's why this matters:</p>
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
                      You're probably eating under 50g/day. Postpartum moms need 80g+ for recovery and milk production.
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
                    <p>You haven't been medically cleared for exercise yet. This is critical for safety:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Your uterus needs time to shrink back to normal size</li>
                      <li>Internal healing takes 6+ weeks minimum</li>
                      <li>Exercising too soon can cause complications</li>
                      <li>Medical clearance ensures you're ready to start safely</li>
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
                        <li>You're at higher risk for complications</li>
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

      {/* Join App CTA */}
      <Card className="border-0 shadow-xl mb-8" style={{ background: "linear-gradient(135deg, #F8F5F2, #FFF8E1)" }}>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl mb-2" style={{ color: "#A15C2F" }}>
            🚀 Close ALL Your Gaps: Join the Catalyst Mom App
          </CardTitle>
          <p className="text-lg" style={{ color: "#3A2412" }}>
            You're at {score}/100 - imagine hitting 85-90+ in the next 6 weeks.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-6 bg-white rounded-lg border-2" style={{ borderColor: "#A15C2F" }}>
            <h3 className="text-xl font-bold mb-4" style={{ color: "#A15C2F" }}>
              Inside the app, you'll get:
            </h3>
            <div className="space-y-3">
              <p className="flex items-start gap-2" style={{ color: "#3A2412" }}>
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                <span>
                  <strong>Complete Postpartum Recovery Tracker</strong> - Closes your medical clearance and tracking
                  gaps
                </span>
              </p>
              <p className="flex items-start gap-2" style={{ color: "#3A2412" }}>
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                <span>
                  <strong>Core-Safe Workout Programs</strong> - Closes your exercise gap with 15-20 min daily routines
                </span>
              </p>
              <p className="flex items-start gap-2" style={{ color: "#3A2412" }}>
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                <span>
                  <strong>Postpartum Nutrition Plans</strong> - Closes your nutrition gap with meal plans and macro
                  tracking
                </span>
              </p>
              <p className="flex items-start gap-2" style={{ color: "#3A2412" }}>
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                <span>
                  <strong>12-Week Pelvic Floor Protocol</strong> - Reduces tearing risk by 85%, prevents prolapse
                </span>
              </p>
              <p className="flex items-start gap-2" style={{ color: "#3A2412" }}>
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                <span>
                  <strong>Diastasis Recti Healing System</strong> - Safe core exercises that heal your "mom pooch"
                </span>
              </p>
              <p className="flex items-start gap-2" style={{ color: "#3A2412" }}>
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                <span>
                  <strong>Community of 1,000+ Postpartum Moms</strong> - Support, shared experiences, accountability
                </span>
              </p>
              <p className="flex items-start gap-2" style={{ color: "#3A2412" }}>
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                <span>
                  <strong>Weekly Group Coaching Calls</strong> - Ask questions, get expert guidance, troubleshoot
                  challenges
                </span>
              </p>
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

            <div className="mt-6 text-center p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg">
              <p className="text-3xl font-bold mb-2" style={{ color: "#A15C2F" }}>
                💰 $29/month
              </p>
              <p className="text-sm" style={{ color: "#3A2412", opacity: 0.7 }}>
                Expert-led recovery for less than the cost of a single physical therapy co-pay. Cancel anytime. No contracts.
              </p>
            </div>
          </div>

          {/* Social Proof */}
          <div className="p-6 bg-green-50 rounded-lg border-2 border-green-400">
            <h3 className="text-xl font-bold mb-4 text-center" style={{ color: "#A15C2F" }}>
              💬 What Moms Who Started Where You Are Say:
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg">
                <p className="italic mb-2" style={{ color: "#3A2412" }}>
                  "I scored 32/100 and felt hopeless. After 12 weeks in the app, I hit 78. My energy is back, my core is
                  healing, and I finally feel like myself again."
                </p>
                <p className="font-semibold text-sm" style={{ color: "#A15C2F" }}>
                  Postpartum Mama · Catalyst Mom Community
                </p>
              </div>
              <div className="p-4 bg-white rounded-lg">
                <p className="italic mb-2" style={{ color: "#3A2412" }}>
                  "I was doing everything wrong - crunches, skipping meals, no pelvic floor work. The app taught me the
                  RIGHT way. My diastasis recti is almost healed!"
                </p>
                <p className="font-semibold text-sm" style={{ color: "#A15C2F" }}>
                  Postpartum Mama · Catalyst Mom Community
                </p>
              </div>
            </div>
          </div>

          {/* CTA Button */}
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
                appUrl.searchParams.set("assessment", "postpartum")
                appUrl.searchParams.set("weeks_postpartum", quizState.weeksPostpartum)
                appUrl.searchParams.set("goal", quizState.primaryGoal)
                window.open(appUrl.toString(), "_blank")
              }}
            >
              Join the Catalyst Mom App Now - $29/month
            </Button>
            <p className="text-sm mt-4" style={{ color: "#3A2412", opacity: 0.7 }}>
              Feel more connected to your core in just 7 days. Cancel anytime. No contracts.
            </p>
          </div>

          {/* Questions */}
          <div className="text-center p-6 bg-amber-50 rounded-lg">
            <h3 className="text-lg font-bold mb-2" style={{ color: "#A15C2F" }}>
              Questions?
            </h3>
            <p style={{ color: "#3A2412" }}>Email: support@catalystmom.online</p>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

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
  const criticalGaps = breakdown.filter((item) => item.score <= 3).slice(0, 3)
  const allGaps = breakdown.filter((item) => item.score <= 5).slice(0, 3)
  const gapsToShow = criticalGaps.length > 0 ? criticalGaps : allGaps

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
          <p className="text-lg leading-relaxed font-semibold" style={{ color: "#A15C2F" }}>
            {quizState.name}, your score reveals a Critical Gap in your recovery. This is why you aren't feeling like yourself yet.
          </p>
          <p className="text-lg leading-relaxed" style={{ color: "#3A2412" }}>
            But here's the truth: Your body is READY to heal. It's just missing the right protocols. Small, strategic changes can make a MASSIVE difference in how you feel — and fast.
          </p>

          {/* Critical Safety Issues */}
          <div className="space-y-4">
            {quizState.medicalClearance !== "yes" && (
              <div className="p-6 bg-red-50 rounded-lg border-l-4 border-red-400">
                <p className="font-semibold text-xl mb-3" style={{ color: "#A15C2F" }}>
                  🚨 URGENT: Medical Clearance Required
                </p>
                <p className="mb-3" style={{ color: "#3A2412" }}>
                  Before starting ANY workout program, you need medical clearance from your doctor - especially if you
                  had a C-section or complications.
                </p>
                <p className="font-semibold" style={{ color: "#3A2412" }}>
                  Why this matters:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1" style={{ color: "#3A2412" }}>
                  <li>Your uterus needs 6+ weeks to shrink back to normal size</li>
                  <li>Internal healing takes time (especially C-section incisions)</li>
                  <li>Exercising too soon can cause serious complications</li>
                  <li>Medical clearance ensures you're ready to start safely</li>
                </ul>
              </div>
            )}

            {quizState.coreSafeExercises === "crunches" && (
              <div className="p-6 bg-red-50 rounded-lg border-l-4 border-red-400">
                <p className="font-semibold text-xl mb-3" style={{ color: "#A15C2F" }}>
                  🚨 STOP: You're Doing Unsafe Exercises
                </p>
                <p className="mb-3" style={{ color: "#3A2412" }}>
                  Crunches and sit-ups are the WORST exercises for postpartum moms. They can make diastasis recti WORSE,
                  not better.
                </p>
                <p className="font-semibold" style={{ color: "#3A2412" }}>
                  What happens if you keep doing them:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1" style={{ color: "#3A2412" }}>
                  <li>Diastasis recti worsens by 60%</li>
                  <li>"Mom pooch" becomes permanent</li>
                  <li>Back pain increases</li>
                  <li>Pelvic floor dysfunction develops</li>
                </ul>
                <p className="mt-3 font-semibold" style={{ color: "#A15C2F" }}>
                  The app will show you SAFE core exercises that actually heal your abs.
                </p>
              </div>
            )}
          </div>

          {/* Priority Gaps */}
          <div className="space-y-4 mt-6">
            <h3 className="text-xl font-bold" style={{ color: "#A15C2F" }}>
              🎯 Your Priority Areas to Fix First:
            </h3>

            {gapsToShow.map((gap, index) => (
              <div key={index} className="p-6 bg-amber-50 rounded-lg border-l-4" style={{ borderLeftColor: "#FFB74D" }}>
                <p className="font-semibold text-xl mb-3" style={{ color: "#A15C2F" }}>
                  {index + 1}. {gap.practice} ({gap.score}/10) - Critical Gap
                </p>

                {gap.practice.includes("Nutrition") && (
                  <div className="space-y-3" style={{ color: "#3A2412" }}>
                    <p className="font-semibold">This is THE #1 reason you're exhausted and not losing weight.</p>
                    <p>Without proper nutrition tracking:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>You're likely under-eating (slows metabolism)</li>
                      <li>Or eating the wrong macros at wrong times (energy crashes)</li>
                      <li>Milk supply suffers (if breastfeeding)</li>
                      <li>Recovery takes 2-3x longer</li>
                    </ul>
                    <p className="font-semibold mt-3" style={{ color: "#A15C2F" }}>
                      Inside the app: Simple meal plans (no complicated recipes), macro tracking made easy, grocery
                      lists, energy optimization that works in 7 days.
                    </p>
                  </div>
                )}

                {gap.practice.includes("Protein") && (
                  <div className="space-y-3" style={{ color: "#3A2412" }}>
                    <p className="font-semibold">You're probably eating under 50g/day. You need 80g+ for recovery.</p>
                    <p>Without adequate protein:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Constant exhaustion (protein = energy)</li>
                      <li>Muscle loss (your body eats muscle for fuel)</li>
                      <li>Slow healing (wounds, tears, C-section)</li>
                      <li>Low milk supply (if breastfeeding)</li>
                    </ul>
                    <p className="font-semibold mt-3" style={{ color: "#A15C2F" }}>
                      Inside the app: Protein-rich meal ideas, quick snacks that hit 20g+, macro tracking, recipes that
                      make 80g easy.
                    </p>
                  </div>
                )}

                {gap.practice.includes("Pelvic Floor") && (
                  <div className="space-y-3" style={{ color: "#3A2412" }}>
                    <p className="font-semibold">
                      Without pelvic floor training, you're at 85% higher risk for complications.
                    </p>
                    <p>What happens without proper training:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Incontinence (leaking when you laugh, sneeze, jump)</li>
                      <li>That "falling out" feeling, pelvic heaviness, or the leaking when you sneeze/laugh that you've been told is "normal." It is NOT normal, and you don't have to live with it.</li>
                      <li>Pain or tension during intimacy that ruins your confidence. We address the root cause of pelvic tension so you can feel like yourself again.</li>
                      <li>The "Mummy Tummy" or core gap (Diastasis Recti) that makes you look 4 months pregnant when you aren't. We don't just "work out"—we close the gap and restore your stomach's strength.</li>
                    </ul>
                    <p className="font-semibold mt-3" style={{ color: "#A15C2F" }}>
                      Inside the app: 12-week pelvic floor protocol (5 min/day), proper Kegel technique, progress
                      tracking, prevention strategies.
                    </p>
                  </div>
                )}

                {gap.practice.includes("Core") && (
                  <div className="space-y-3" style={{ color: "#3A2412" }}>
                    <p className="font-semibold">
                      Without core-safe exercises, your "mom pooch" and back pain will persist.
                    </p>
                    <p>What happens without proper core work:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Diastasis recti worsens or never heals</li>
                      <li>"Mom pooch" becomes permanent</li>
                      <li>Chronic back pain develops</li>
                      <li>Pelvic floor dysfunction worsens</li>
                    </ul>
                    <p className="font-semibold mt-3" style={{ color: "#A15C2F" }}>
                      Inside the app: Core-safe exercises (NO crunches), diastasis recti healing protocols, 10-20 min
                      workouts, safe progressions.
                    </p>
                  </div>
                )}

                {!gap.practice.includes("Nutrition") &&
                  !gap.practice.includes("Protein") &&
                  !gap.practice.includes("Pelvic Floor") &&
                  !gap.practice.includes("Core") && (
                    <div className="space-y-3" style={{ color: "#3A2412" }}>
                      <p>This gap is preventing you from feeling your best and recovering properly.</p>
                      <p>Without addressing this:</p>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Recovery takes 2-3x longer</li>
                        <li>You're at higher risk for complications</li>
                        <li>Energy and wellness continue to suffer</li>
                        <li>Long-term health may be impacted</li>
                      </ul>
                      <p className="font-semibold mt-3" style={{ color: "#A15C2F" }}>
                        Inside the app: Step-by-step protocols, expert guidance, and personalized support to close this
                        gap.
                      </p>
                    </div>
                  )}
              </div>
            ))}
          </div>

          <div className="p-6 bg-green-50 rounded-lg border-2 border-green-400 mt-6">
            <p className="text-xl font-semibold mb-2 text-center" style={{ color: "#A15C2F" }}>
              You're Not Behind. You're Not Lazy. You're Not Broken.
            </p>
            <p className="text-lg text-center" style={{ color: "#3A2412" }}>
              You just need the right guidance and support system. And that's exactly what the Catalyst Mom App
              provides.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Join App CTA */}
      <Card className="border-0 shadow-xl mb-8" style={{ background: "linear-gradient(135deg, #F8F5F2, #FFF8E1)" }}>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl mb-2" style={{ color: "#A15C2F" }}>
            🚀 Let's Build Your Foundation Together
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
              <p className="flex items-start gap-2" style={{ color: "#3A2412" }}>
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                <span>
                  <strong>Step-by-Step Postpartum Recovery Roadmap</strong> - No guessing, just follow the plan
                </span>
              </p>
              <p className="flex items-start gap-2" style={{ color: "#3A2412" }}>
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                <span>
                  <strong>Core-Safe Workouts (10-20 min)</strong> - Safe for diastasis recti, C-sections, and beginners
                </span>
              </p>
              <p className="flex items-start gap-2" style={{ color: "#3A2412" }}>
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                <span>
                  <strong>Simple Meal Plans</strong> - No complicated recipes, just easy nutrition that works
                </span>
              </p>
              <p className="flex items-start gap-2" style={{ color: "#3A2412" }}>
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                <span>
                  <strong>Pelvic Floor Healing Protocol</strong> - Prevent incontinence, prolapse, and painful sex
                </span>
              </p>
              <p className="flex items-start gap-2" style={{ color: "#3A2412" }}>
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                <span>
                  <strong>Diastasis Recti Recovery System</strong> - Heal your "mom pooch" safely and effectively
                </span>
              </p>
              <p className="flex items-start gap-2" style={{ color: "#3A2412" }}>
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                <span>
                  <strong>Community Support</strong> - 2,000+ mamas supported who understand what you're going through
                </span>
              </p>
              <p className="flex items-start gap-2" style={{ color: "#3A2412" }}>
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                <span>
                  <strong>Weekly Coaching Calls</strong> - Get your questions answered by experts
                </span>
              </p>
            </div>

            <div className="mt-6 text-center p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg">
              <p className="text-3xl font-bold mb-2" style={{ color: "#A15C2F" }}>
                💰 $29/month
              </p>
              <p className="text-sm" style={{ color: "#3A2412", opacity: 0.7 }}>
                Expert-led recovery for less than the cost of a single physical therapy co-pay. Cancel anytime. No contracts.
              </p>
            </div>
          </div>

          {/* Social Proof */}
          <div className="p-6 bg-green-50 rounded-lg border-2 border-green-400">
            <h3 className="text-xl font-bold mb-4 text-center" style={{ color: "#A15C2F" }}>
              💬 What Moms Who Started Where You Are Say:
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg">
                <p className="italic mb-2" style={{ color: "#3A2412" }}>
                  "I scored 32/100 and felt hopeless. After 12 weeks in the app, I hit 78. My energy is back, my core is
                  healing, and I finally feel like myself again."
                </p>
                <p className="font-semibold text-sm" style={{ color: "#A15C2F" }}>
                  Postpartum Mama · Catalyst Mom Community
                </p>
              </div>
              <div className="p-4 bg-white rounded-lg">
                <p className="italic mb-2" style={{ color: "#3A2412" }}>
                  "I was doing everything wrong - crunches, skipping meals, no pelvic floor work. The app taught me the
                  RIGHT way. My diastasis recti is almost healed!"
                </p>
                <p className="font-semibold text-sm" style={{ color: "#A15C2F" }}>
                  Postpartum Mama · Catalyst Mom Community
                </p>
              </div>
            </div>
          </div>

          {/* CTA Button */}
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
                appUrl.searchParams.set("assessment", "postpartum")
                appUrl.searchParams.set("weeks_postpartum", quizState.weeksPostpartum)
                appUrl.searchParams.set("goal", quizState.primaryGoal)
                window.open(appUrl.toString(), "_blank")
              }}
            >
              Join the Catalyst Mom App Now - $29/month
            </Button>
            <p className="text-sm mt-4" style={{ color: "#3A2412", opacity: 0.7 }}>
              Feel more connected to your core in just 7 days. Cancel anytime. No contracts.
            </p>
          </div>

          {/* Questions */}
          <div className="text-center p-6 bg-amber-50 rounded-lg">
            <h3 className="text-lg font-bold mb-2" style={{ color: "#A15C2F" }}>
              Questions?
            </h3>
            <p style={{ color: "#3A2412" }}>Email: support@catalystmom.online</p>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
