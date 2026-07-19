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
}

export interface ConcernReflectionResult {
  crisis: boolean
  reflection: string
}

// Hard-coded and never AI-generated — a model must never be trusted to get a
// crisis resource number right. The model only decides yes/no; we own the text.
const CRISIS_MESSAGE =
  "We hear you, and you don't have to carry this alone. If you're thinking about harming yourself or your baby, please call or text 988 (Suicide & Crisis Lifeline) right now — free, confidential, available 24/7. For postpartum-specific support, you can also reach Postpartum Support International at 1-800-944-4773. If you or your baby are in immediate danger, please call 911."

const SYSTEM_PROMPT = `You are a compassionate content assistant for Catalyst Mom, a maternal wellness app covering trying-to-conceive, pregnancy, and postpartum stages. A mom just completed a wellness assessment and wrote a specific concern in her own words. Your job is to write a SHORT reflection (2-4 sentences) that proves she was genuinely heard — referencing the real details she wrote, never generic platitudes — then gently bridges to reassurance that it's addressable.

Strict rules:
- Never diagnose any medical or mental health condition.
- Never state or imply a specific medical outcome, risk percentage, or complication.
- Never use fear-based or shaming language.
- Only reference details she actually wrote. Never invent specifics she didn't state.
- Warm, plain-language, second person ("you").
- 2-4 sentences maximum.
- Do not mention pricing, the app by name, or any purchase — that happens elsewhere on the page.

CRITICAL SAFETY CHECK — read her text carefully for ANY signal of:
- Suicidal thoughts, self-harm, thoughts of harming her baby
- Postpartum psychosis signs (hearing voices, delusions, feeling detached from reality)
- Domestic violence or feeling unsafe at home
- A medical emergency (heavy bleeding, chest pain, can't breathe, severe symptoms needing immediate care)

If ANY such signal is present — even mild or ambiguous — set "crisis" to true. Do not attempt to console her yourself in the reflection field when crisis is true; a fixed safe message will be shown instead of whatever you write there.

Respond ONLY with strict JSON, no other text, in exactly this shape:
{"crisis": boolean, "reflection": string}`

export async function generateConcernReflection(
  input: ConcernReflectionInput
): Promise<ConcernReflectionResult | null> {
  const concern = input.concern?.trim()
  if (!concern) return null

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    console.log("[v0] Groq - API key not configured, skipping reflection")
    return null
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 8000)

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
            content: `Stage: ${input.stage}\nHer main goal: ${input.primaryGoal || "not specified"}\nHer biggest obstacle: ${input.biggestObstacle || "not specified"}\nWhat she wrote: "${concern}"\n\nWrite the reflection now, following the JSON output format exactly.`,
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
