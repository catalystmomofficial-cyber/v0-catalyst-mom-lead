"use server"

// Provider-agnostic AI concern reflection — currently Groq (free tier, no
// training on API data). Swapping to Claude later is a one-file change:
// only GROQ_URL/GROQ_MODEL/the fetch call below need to move.

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
const GROQ_MODEL = "llama-3.3-70b-versatile"

export interface ConcernReflectionInput {
  concern: string
  stage: "postpartum" | "pregnancy" | "ttc"
  primaryGoal?: string
  biggestObstacle?: string
  // Structured assessment answers (e.g. medical_clearance, weeks_postpartum,
  // diastasis_recti) so the model can connect her concern to the real root
  // cause and adapt the "next step" framing. Empty values are ignored.
  profile?: Record<string, string | number | undefined | null>
}

export interface ConcernReflectionResult {
  crisis: boolean
  reflection: string
}

// Hard-coded and never AI-generated — a model must never be trusted to get a
// crisis resource number right. The model only decides yes/no; we own the text.
const CRISIS_MESSAGE =
  "We hear you, and you don't have to carry this alone. If you're thinking about harming yourself or your baby, please call or text 988 (Suicide & Crisis Lifeline) right now — free, confidential, available 24/7. For postpartum-specific support, you can also reach Postpartum Support International at 1-800-944-4773. If you or your baby are in immediate danger, please call 911."

const SYSTEM_PROMPT = `You are a sharp, marketing-minded content assistant for Catalyst Mom, a maternal wellness app covering trying-to-conceive (TTC), pregnancy, and postpartum. A mom just finished a wellness assessment. You are given her free-text concern in her own words, her main goal, her biggest obstacle, and structured answers from her assessment. Write a SHORT reflection (2-4 sentences, ~45-75 words) that makes her feel precisely understood and leaves her leaning forward — so she keeps reading toward the plan that appears further down the page.

HOW TO MAKE IT LAND — this is the whole job:
1. Mirror the SPECIFIC thing she wrote, in her own language. Never a generic version of it.
2. CONNECT it. Tie her concern to her stated goal and to the likely root cause, then to the idea that the right approach in the right order addresses that root. This connection is what makes her believe it's solvable. Example logic: postpartum low-back pain + a diastasis-recti goal → the deep core and the low back commonly work together, so it reads as one root, not two separate problems.
3. Use her structured answers to sharpen the message AND set the next-step framing:
   - Not yet medically cleared, or very early postpartum → the move right now is gentle, staged recovery once she's cleared, never pushing harder. Respecting this builds trust.
   - Cleared → she's ready; it's about rebuilding in the right order/sequence.
   - Reflect her real state (exhausted, in pain, no support) so she feels seen.
4. Leave her with the sense that the path is clearer and closer than it has felt. Do NOT close with a flat "you've got this" or "you can do it."

HARD RULES:
- Never diagnose her or any condition. You MAY reference common, widely-accepted functional patterns for her stage ("the core and low back often work together", "energy runs low while the body is still healing") as general tendencies, using words like "often/commonly/tends to" — never as a definitive statement about HER body, never a risk percentage, never a medical outcome.
- Never promise a specific outcome: no guaranteed pregnancy, cure, timeline, or result. If she wants to conceive, frame it as getting her body to its strongest, most ready state and giving her efforts the best chance — never "you will get pregnant."
- Never use fear, shame, or urgency-through-anxiety.
- Only reference what she actually wrote or answered. Never invent specifics she didn't state.
- Do NOT praise her for completing the assessment or for "taking a step", "acknowledging", "reaching out", or "having courage." No filler openers — go straight to her real situation.
- Do not mention pricing, the app by name, coaching, or any purchase — that happens elsewhere on the page.
- Warm, plain-language, direct, second person ("you"). 2-4 sentences.

CRITICAL SAFETY CHECK — read her text carefully for ANY signal of:
- Suicidal thoughts, self-harm, thoughts of harming her baby
- Postpartum psychosis signs (hearing voices, delusions, feeling detached from reality)
- Domestic violence or feeling unsafe at home
- A medical emergency (heavy bleeding, chest pain, can't breathe, severe symptoms needing immediate care)

If ANY such signal is present — even mild or ambiguous — set "crisis" to true. Do not attempt to console her yourself in the reflection field when crisis is true; a fixed safe message will be shown instead of whatever you write there.

Respond ONLY with strict JSON, no other text, in exactly this shape:
{"crisis": boolean, "reflection": string}`

// Some moms type a non-answer in the free-text box ("No", "n/a", "nothing",
// ".") meaning "nothing to add". Treat those exactly like a blank box so the
// reflection never awkwardly quotes them back ("You've said 'No'…").
const NON_ANSWERS = new Set([
  "no", "n", "na", "n a", "none", "nothing", "nope", "nil", "nada", "nah",
  "not really", "no thanks", "no thank you", "idk", "i don t know",
  "not sure", "nothing else", "no comment", "all good",
])

function isNonAnswer(raw: string): boolean {
  const s = raw.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim()
  return s === "" || NON_ANSWERS.has(s)
}

function formatProfile(profile?: Record<string, string | number | undefined | null>): string {
  if (!profile) return ""
  const lines = Object.entries(profile)
    .filter(([, v]) => v !== undefined && v !== null && String(v).trim() !== "")
    .map(([k, v]) => `- ${k}: ${v}`)
  return lines.length ? lines.join("\n") : ""
}

export async function generateConcernReflection(
  input: ConcernReflectionInput
): Promise<ConcernReflectionResult | null> {
  const concern = input.concern?.trim()
  if (!concern || isNonAnswer(concern)) return null

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    console.log("[v0] Groq - API key not configured, skipping reflection")
    return null
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 8000)

  const profileBlock = formatProfile(input.profile)

  try {
    const response = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        temperature: 0.6,
        max_tokens: 300,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `Stage: ${input.stage}
Her main goal: ${input.primaryGoal || "not specified"}
Her biggest obstacle: ${input.biggestObstacle || "not specified"}
Her assessment answers:
${profileBlock || "- (none provided)"}
What she wrote: "${concern}"

Write the reflection now. Mirror her exact words, connect her concern to her goal and its likely root cause, adapt the next step to her assessment answers (especially medical clearance and how far postpartum she is), and follow the JSON output format exactly.`,
          },
        ],
      }),
      signal: controller.signal,
    })

    if (!response.ok) {
      console.error("[v0] Groq - Error:", response.status, await response.text())
      return null
    }

    const data = await response.json()
    const raw = data?.choices?.[0]?.message?.content
    if (!raw) return null

    let parsed: { crisis?: boolean; reflection?: string }
    try {
      parsed = JSON.parse(raw)
    } catch {
      console.error("[v0] Groq - Failed to parse JSON:", raw)
      return null
    }

    if (parsed.crisis) {
      console.log("[v0] Groq - Crisis signal detected, showing safe resource message")
      return { crisis: true, reflection: CRISIS_MESSAGE }
    }

    if (!parsed.reflection || typeof parsed.reflection !== "string") return null

    return { crisis: false, reflection: parsed.reflection.trim() }
  } catch (error) {
    console.error("[v0] Groq - Exception:", error)
    return null
  } finally {
    clearTimeout(timeout)
  }
}
