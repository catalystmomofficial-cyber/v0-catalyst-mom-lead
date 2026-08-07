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
  lead?: string
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
        "Your AI coach already knows your goals, your answers, and where you're starting—so you never have to explain your story twice.",
      ],
    },
    {
      emoji: "👩‍⚕️",
      title: "Your dedicated maternal wellness coach",
      body: [
        "Every two weeks, you'll meet one-on-one with your dedicated maternal wellness coach to review your progress, celebrate wins, solve challenges, and adjust your plan together",
      ],
    },
    {
      emoji: "🤝",
      title: "Your community",
      lead: "You're joining mothers who are rebuilding alongside you.",
      body: [
        "Ask the questions you'd never say out loud, watch someone two weeks ahead of you get through the thing you're in, and stop doing postpartum on your own.",
      ],
    },
    {
      emoji: "📚",
      title: "Your resources",
      lead: "Your trusted Catalyst Mom guides—all in one place.",
      body: [
        "The digital guides you've relied on are now built into your recovery experience, alongside meal plans, practical wellness resources, and your 500 welcome credits.",
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
        "Your AI coach already knows your goals, your answers, and where you're starting—so you never have to explain your story twice.",
      ],
    },
    {
      emoji: "👩‍⚕️",
      title: "Your dedicated maternal wellness coach",
      body: [
        "Every two weeks, you'll meet one-on-one with your dedicated maternal wellness coach to review your progress, celebrate wins, solve challenges, and adjust your plan together",
      ],
    },
    {
      emoji: "🤝",
      title: "Your community",
      lead: "You're joining women who are at the same stage as you.",
      body: [
        "Ask the questions you'd never say out loud, hear from women a few weeks ahead of you, and stop working it out from search results at 2am.",
      ],
    },
    {
      emoji: "📚",
      title: "Your resources",
      lead: "Your trusted Catalyst Mom guides—all in one place.",
      body: [
        "The digital guides you've relied on are now built into your pregnancy experience, alongside meal plans, practical wellness resources, and your 500 welcome credits.",
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
        "Your AI coach already knows your goals, your answers, and where you're starting—so you never have to explain your story twice.",
      ],
    },
    {
      emoji: "👩‍⚕️",
      title: "Your dedicated maternal wellness coach",
      body: [
        "Every two weeks, you'll meet one-on-one with your dedicated maternal wellness coach to review your progress, celebrate wins, solve challenges, and adjust your plan together",
      ],
    },
    {
      emoji: "🤝",
      title: "Your community",
      lead: "You're joining women who are trying alongside you.",
      body: [
        "Ask the questions you'd never say out loud, sit with women who know exactly what a two-week wait feels like, and stop carrying it by yourself.",
      ],
    },
    {
      emoji: "📚",
      title: "Your resources",
      lead: "Your trusted Catalyst Mom guides—all in one place.",
      body: [
        "The digital guides you've relied on are now built into your fertility experience, alongside meal plans, practical wellness resources, and your 500 welcome credits.",
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
        The moment you create your free account, your personalised {WORD[stage]} plan will already be
        waiting for you.
      </p>

      <div className="space-y-4">
        {SECTIONS[stage].map((section) => (
          <div
            key={section.title}
            className="rounded-lg p-4"
            style={{ backgroundColor: "#FFFFFF", border: `1px solid ${EDGE}` }}
          >
            <p className="font-bold text-sm mb-1" style={{ color: COPPER }}>
              {section.emoji} {section.title}
            </p>
            {section.lead && (
              <p className="text-sm font-semibold mt-0.5 mb-2" style={{ color: INK }}>
                {section.lead}
              </p>
            )}
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
