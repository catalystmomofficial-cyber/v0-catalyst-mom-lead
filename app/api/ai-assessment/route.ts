import Anthropic from "@anthropic-ai/sdk"
import { NextRequest, NextResponse } from "next/server"

const client = new Anthropic()

// ── Prompts per assessment type ───────────────────────────────────────────────

function buildPostpartumPrompt(answers: Record<string, string>, name: string): string {
  return `You are the expert health coach behind Catalyst Mom — a postpartum wellness program for mothers. A new member just completed their postpartum assessment. Write their personalised results.

MEMBER NAME: ${name}

THEIR ANSWERS:
- Weeks postpartum: ${answers.weeksPostpartum}
- Medical clearance for exercise: ${answers.medicalClearance}
- Diastasis recti (ab separation): ${answers.diastasisRecti}
- Doing core-safe exercises: ${answers.coreSafeExercises}
- Pelvic floor exercises: ${answers.pelvicFloor}
- Eating nutritious meals: ${answers.nutrition}
- Getting enough protein: ${answers.proteinIntake}
- Rest / sleep quality: ${answers.rest}
- Hydration: ${answers.hydration}
- Current workout routine: ${answers.workoutRoutine}
- Primary goal: ${answers.primaryGoal}
- Biggest obstacle: ${answers.biggestObstacle}
- Support preference: ${answers.supportType}
- Dietary restrictions: ${answers.dietaryRestrictions}
- Additional notes from ${name}: ${answers.additionalNotes || "None"}

YOUR JOB: Write a warm, personal, expert assessment that does THREE things:

1. VALIDATES & NAMES their exact situation (use their name, reference their specific answers — not generic). Make them feel truly seen.

2. EXPLAINS what's really going on in their body right now (brief, empathetic, credible — like a knowledgeable friend who is also a health expert). Connect the dots between their answers to reveal the pattern they haven't seen.

3. BRIDGES to the solution — show specifically how the Catalyst Mom program fixes the exact problems they described. This should feel like the natural next step, not a sales pitch.

TONE: Warm, direct, credible. Like a trusted expert friend — not a doctor giving a diagnosis, not a salesperson. Real talk.

FORMAT your response as JSON with these exact keys:
{
  "headline": "A punchy 1-line personal headline (use their name, reference their main challenge)",
  "situation": "2-3 sentences validating exactly what they're going through based on their specific answers",
  "insight": "2-3 sentences connecting the dots — what's really causing their main struggles (reference their actual answers)",
  "topGaps": ["gap 1 specific to their answers", "gap 2", "gap 3"],
  "programFix": "3-4 sentences showing specifically how Catalyst Mom solves their specific problems (not generic — tie directly to their answers)",
  "urgencyNote": "1 sentence on why starting now (at their specific stage: ${answers.weeksPostpartum} postpartum) matters"
}

Return ONLY the JSON object. No markdown, no preamble.`
}

function buildTTCPrompt(answers: Record<string, string>, name: string): string {
  return `You are the expert fertility coach behind Catalyst Mom — a program for women trying to conceive. A new member just completed their fertility assessment. Write their personalised results.

MEMBER NAME: ${name}

THEIR ANSWERS:
- How long trying to conceive: ${answers.ttcDuration}
- Cycle tracking: ${answers.cycleTracking}
- Ovulation awareness: ${answers.ovulationAwareness}
- Fertility nutrition habits: ${answers.fertilityNutrition}
- Supplementation: ${answers.supplementation}
- Stress levels: ${answers.stress}
- Sleep quality: ${answers.sleep}
- Exercise routine: ${answers.exercise}
- Alcohol consumption: ${answers.alcohol}
- Smoking: ${answers.smoking}
- Workout routine: ${answers.workoutRoutine}
- Currently tracking: ${answers.tracking}
- Primary goal: ${answers.primaryGoal}
- Biggest obstacle: ${answers.biggestObstacle}
- Support preference: ${answers.supportType}
- Dietary restrictions: ${answers.dietaryRestrictions}
- Additional notes from ${name}: ${answers.additionalNotes || "None"}

YOUR JOB: Write a warm, personal, expert assessment that does THREE things:

1. VALIDATES & NAMES their exact situation (use their name, reference their specific answers — not generic). Make them feel truly seen and not alone.

2. EXPLAINS what's really happening with their fertility journey right now. Connect their specific answers to reveal what factors are working against them that they may not have considered.

3. BRIDGES to the solution — show specifically how the Catalyst Mom fertility program addresses their exact situation. Should feel like the logical next step.

TONE: Warm, hopeful, expert, direct. Not clinical. Not salesy. Like a fertility-savvy friend who's been through it.

FORMAT your response as JSON with these exact keys:
{
  "headline": "A punchy 1-line personal headline (use their name, reference their TTC journey length and main challenge)",
  "situation": "2-3 sentences validating exactly what they're going through based on their specific answers",
  "insight": "2-3 sentences connecting the dots — what their specific answers reveal about what might be getting in the way",
  "topGaps": ["gap 1 specific to their answers", "gap 2", "gap 3"],
  "programFix": "3-4 sentences showing specifically how Catalyst Mom solves their specific fertility challenges (tie directly to their answers)",
  "urgencyNote": "1 sentence on why optimising now matters for their fertility window"
}

Return ONLY the JSON object. No markdown, no preamble.`
}

function buildPregnancyPrompt(answers: Record<string, string>, name: string): string {
  return `You are the expert pregnancy wellness coach behind Catalyst Mom — a program for pregnant women. A new member just completed their pregnancy assessment. Write their personalised results.

MEMBER NAME: ${name}

THEIR ANSWERS:
- Trimester: ${answers.trimester}
- Weeks pregnant: ${answers.weeksPregnant}
- Prenatal care status: ${answers.prenatalCare}
- Exercise safety awareness: ${answers.exerciseSafety}
- Pelvic floor exercises: ${answers.pelvicFloor}
- Nutrition habits: ${answers.nutrition}
- Diastasis recti awareness: ${answers.diastasisRecti}
- Energy levels: ${answers.energy}
- Sleep quality: ${answers.sleep}
- Stress management: ${answers.stress}
- Supplement routine: ${answers.supplementation}
- Current workout routine: ${answers.workoutRoutine}
- Tracking symptoms: ${answers.tracking}
- Primary goal: ${answers.primaryGoal}
- Biggest obstacle: ${answers.biggestObstacle}
- Support preference: ${answers.supportType}
- Dietary restrictions: ${answers.dietaryRestrictions}
- Additional notes from ${name}: ${answers.additionalNotes || "None"}

YOUR JOB: Write a warm, personal, expert assessment that does THREE things:

1. VALIDATES & NAMES their exact pregnancy situation (use their name, their specific trimester, reference their actual answers — not generic).

2. EXPLAINS what's really happening in their body at this stage and how their specific answers reveal their key gaps. Make them feel understood and informed.

3. BRIDGES to the solution — show specifically how Catalyst Mom's pregnancy program fills the exact gaps they described. Natural next step, not a pitch.

TONE: Warm, nurturing, expert, encouraging. Like a knowledgeable friend who's also a women's health expert. Not scary. Not salesy.

FORMAT your response as JSON with these exact keys:
{
  "headline": "A punchy 1-line personal headline (use their name, reference their trimester and main situation)",
  "situation": "2-3 sentences validating exactly what they're experiencing based on their specific answers",
  "insight": "2-3 sentences connecting the dots — what this trimester combined with their answers reveals about their key needs right now",
  "topGaps": ["gap 1 specific to their answers", "gap 2", "gap 3"],
  "programFix": "3-4 sentences showing specifically how Catalyst Mom addresses their exact pregnancy wellness needs (tie directly to their answers)",
  "urgencyNote": "1 sentence on why building these foundations now (in their specific trimester) sets them up for birth and beyond"
}

Return ONLY the JSON object. No markdown, no preamble.`
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const { type, answers, name } = await req.json()

    if (!type || !answers || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    let prompt: string
    if (type === "postpartum") {
      prompt = buildPostpartumPrompt(answers, name)
    } else if (type === "ttc") {
      prompt = buildTTCPrompt(answers, name)
    } else if (type === "pregnancy") {
      prompt = buildPregnancyPrompt(answers, name)
    } else {
      return NextResponse.json({ error: "Unknown assessment type" }, { status: 400 })
    }

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    })

    const raw = message.content[0].type === "text" ? message.content[0].text : ""

    let parsed
    try {
      parsed = JSON.parse(raw)
    } catch {
      // strip any accidental markdown fences
      const cleaned = raw.replace(/^```json?\s*/i, "").replace(/```\s*$/i, "").trim()
      parsed = JSON.parse(cleaned)
    }

    return NextResponse.json({ result: parsed })
  } catch (err) {
    console.error("AI assessment error:", err)
    return NextResponse.json({ error: "Failed to generate assessment" }, { status: 500 })
  }
}
