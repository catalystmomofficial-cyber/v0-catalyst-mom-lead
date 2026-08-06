// ─────────────────────────────────────────────────────────────────────────────
// What's already been prepared for her.
//
// Not "your personalised space includes" — that describes a container, and
// nobody wants a container. She just finished an emotional assessment and is
// asking "can you actually help me?", so this answers what has already
// happened rather than what the app contains. Order is Plan → Coach →
// Community → Resources: here's what we built, you're not doing this alone,
// neither are they, and everything else is already inside.
//
// The coach block sells the benefit rather than proving she's human. "A coach
// who is an actual human being" reads defensive, like it's arguing with a
// suspicion she hasn't voiced yet.
// ─────────────────────────────────────────────────────────────────────────────

const COPPER = "#A15C2F"
const INK = "#3A2412"
const MUTED = "#8A7060"
const CREAM = "#F8F5F2"
const EDGE = "#E8D5C4"

type Stage = "postpartum" | "pregnancy" | "ttc"

interface Section {
  emoji: string
  title: string
  lead: string
  body: string[]
}

const WORD: Record<Stage, string> = {
  postpartum: "recovery",
  pregnancy: "pregnancy",
  ttc: "fertility",
}

const SECTIONS: Record<Stage, Section[]> = {
  postpartum: [
    {
      emoji: "📋",
      title: "Your plan starts here",
      lead: "Here's what we've already built.",
      body: [
        "We've already built your roadmap from the answers you just gave us. Your first recovery session is waiting.",
        "Every recommendation is matched to where your body is today — not where a generic program assumes it is.",
        "Your AI coach is already trained on your answers, so you never start a conversation from scratch.",
      ],
    },
    {
      emoji: "👩‍⚕️",
      title: "Your dedicated recovery coach",
      lead: "You're not doing this alone.",
      body: [
        "A dedicated coach reviews your progress every two weeks and adjusts your plan with you — what's working, what hurts, what comes next.",
      ],
    },
    {
      emoji: "🤝",
      title: "Your community",
      lead: "Neither are these moms.",
      body: [
        "Ask the questions you'd never say out loud, watch someone two weeks ahead of you get through the thing you're in, and stop doing postpartum on your own.",
      ],
    },
    {
      emoji: "📚",
      title: "Your resources",
      lead: "Everything you need is already inside.",
      body: [
        "Meal plans built for a healing body, not a diet. The wellness library, including guides for what you're dealing with today. And 500 welcome credits, added the moment your account exists.",
      ],
    },
  ],
  pregnancy: [
    {
      emoji: "📋",
      title: "Your plan starts here",
      lead: "Here's what we've already built.",
      body: [
        "We've already built your roadmap from the answers you just gave us. Your first session is waiting.",
        "Every recommendation is matched to where your body is today and which trimester you're in — not where a generic program assumes it is.",
        "Your AI coach is already trained on your answers, so you never start a conversation from scratch.",
      ],
    },
    {
      emoji: "👩‍⚕️",
      title: "Your dedicated pregnancy & birth-prep coach",
      lead: "You're not doing this alone.",
      body: [
        "A dedicated coach reviews your progress every two weeks and adjusts your plan with you — what's working, what's changed this trimester, what comes next.",
      ],
    },
    {
      emoji: "🤝",
      title: "Your community",
      lead: "Neither are these women.",
      body: [
        "Ask the questions you'd never say out loud, hear from women a few weeks ahead of you, and stop working it out from search results at 2am.",
      ],
    },
    {
      emoji: "📚",
      title: "Your resources",
      lead: "Everything you need is already inside.",
      body: [
        "Meal plans built for pregnancy, not a diet. The wellness library, including guides for what you're dealing with today. And 500 welcome credits, added the moment your account exists.",
      ],
    },
  ],
  ttc: [
    {
      emoji: "📋",
      title: "Your plan starts here",
      lead: "Here's what we've already built.",
      body: [
        "We've already built your roadmap from the answers you just gave us. Your first steps are waiting.",
        "Every recommendation is matched to where your cycle and your body are today — not where a generic program assumes they are.",
        "Your AI coach is already trained on your answers, so you never start a conversation from scratch.",
      ],
    },
    {
      emoji: "👩‍⚕️",
      title: "Your dedicated fertility coach",
      lead: "You're not doing this alone.",
      body: [
        "A dedicated coach reviews your progress every two weeks and adjusts your plan with you — what's working, what your cycle is telling us, what comes next.",
      ],
    },
    {
      emoji: "🤝",
      title: "Your community",
      lead: "Neither are these women.",
      body: [
        "Ask the questions you'd never say out loud, sit with women who know exactly what a two-week wait feels like, and stop carrying it by yourself.",
      ],
    },
    {
      emoji: "📚",
      title: "Your resources",
      lead: "Everything you need is already inside.",
      body: [
        "Meal plans built around egg quality and hormone balance. The wellness library, including guides for what you're dealing with today. And 500 welcome credits, added the moment your account exists.",
      ],
    },
  ],
}

export function WhatsWaiting({ stage }: { stage: Stage }) {
  return (
    <div className="mb-8 rounded-lg p-5" style={{ backgroundColor: CREAM, border: `1px solid ${EDGE}` }}>
      {/* The sentence that turns the list from "here's our app" into "here's
          yours". It has to come before anything else on the block. */}
      <p className="text-center font-bold text-lg mb-1" style={{ color: COPPER }}>
        Everything below has already been prepared from the answers you just gave us.
      </p>
      <p className="text-center text-sm mb-5" style={{ color: MUTED }}>
        The moment you create your free account, your {WORD[stage]} plan is already there.
      </p>

      <div className="space-y-4">
        {SECTIONS[stage].map((section) => (
          <div
            key={section.title}
            className="rounded-lg p-4"
            style={{ backgroundColor: "#FFFFFF", border: `1px solid ${EDGE}` }}
          >
            <p className="font-bold text-sm" style={{ color: COPPER }}>
              {section.emoji} {section.title}
            </p>
            <p className="text-sm font-semibold mt-0.5 mb-2" style={{ color: INK }}>
              {section.lead}
            </p>
            {section.body.map((line, i) => (
              <p key={i} className="text-sm leading-relaxed mb-1.5 last:mb-0" style={{ color: INK }}>
                {line}
              </p>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default WhatsWaiting
