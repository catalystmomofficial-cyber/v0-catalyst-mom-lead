import { CheckCircle2 } from "lucide-react"

// ─────────────────────────────────────────────────────────────────────────────
// "What's already waiting for you" — the value stack, doing a different job.
//
// The old stack answered "why is this worth $29?". Nobody on the results page
// is asking that yet. She is asking "if I create an account, what actually
// happens next?" So this lists what is waiting, grouped by outcome rather than
// dumped as features, with no money anywhere.
//
// Two things get deliberate prominence:
//
//  1. The human coach. Every wellness app has workouts and meal plans. Very few
//     have a real person who looks at her progress every two weeks and changes
//     the plan with her. It gets its own block, and it never says "Progression
//     Sync" — that is internal vocabulary she has never heard.
//  2. The community, sold as the feeling and not the headcount. The thing that
//     actually hurts postpartum is not only the leaking or the separation, it
//     is "I feel like I'm the only one". "2,000+ members" does not touch that.
// ─────────────────────────────────────────────────────────────────────────────

const COPPER = "#A15C2F"
const INK = "#3A2412"
const MUTED = "#8A7060"
const CREAM = "#F8F5F2"
const EDGE = "#E8D5C4"

type Stage = "postpartum" | "pregnancy" | "ttc"

interface Group {
  title: string
  items: string[]
}

const SPACE_NAME: Record<Stage, string> = {
  postpartum: "Your personalised recovery space includes",
  pregnancy: "Your personalised pregnancy space includes",
  ttc: "Your personalised fertility space includes",
}

const GROUPS: Record<Stage, Group[]> = {
  postpartum: [
    {
      title: "Your plan",
      items: [
        "A recovery roadmap built from the answers you just gave",
        "15-minute sessions matched to how far postpartum you are",
        "Core and pelvic floor work sequenced so nothing is done too early",
        "Your AI coach, already holding your goals and your answers",
      ],
    },
    {
      title: "Your support",
      items: [
        "A private community of mothers recovering at the same time as you",
        "Progress you can actually see, week over week",
      ],
    },
    {
      title: "Your resources",
      items: [
        "Meal plans built for a healing body, not a diet",
        "The wellness library, including guides for what you're dealing with today",
        "500 welcome credits, added the moment your account exists",
      ],
    },
  ],
  pregnancy: [
    {
      title: "Your plan",
      items: [
        "A pregnancy roadmap built from the answers you just gave",
        "15-minute sessions matched to your trimester",
        "Birth-prep breathing and positioning, sequenced week by week",
        "Your AI coach, already holding your goals and your answers",
      ],
    },
    {
      title: "Your support",
      items: [
        "A private community of women who are pregnant right now, alongside you",
        "Progress you can actually see, week over week",
      ],
    },
    {
      title: "Your resources",
      items: [
        "Meal plans built for pregnancy, not a diet",
        "The wellness library, including guides for what you're dealing with today",
        "500 welcome credits, added the moment your account exists",
      ],
    },
  ],
  ttc: [
    {
      title: "Your plan",
      items: [
        "A fertility roadmap built from the answers you just gave",
        "Cycle and ovulation tracking that works from your real data",
        "Movement kept in the range that supports your hormones",
        "Your AI coach, already holding your goals and your answers",
      ],
    },
    {
      title: "Your support",
      items: [
        "A private community of women trying at the same time as you",
        "Progress you can actually see, cycle over cycle",
      ],
    },
    {
      title: "Your resources",
      items: [
        "Meal plans built around egg quality and hormone balance",
        "The wellness library, including guides for what you're dealing with today",
        "500 welcome credits, added the moment your account exists",
      ],
    },
  ],
}

const COACH_LINE: Record<Stage, string> = {
  postpartum:
    "Every two weeks a real person sits down with your progress and changes your plan with you — what's working, what hurts, what comes next.",
  pregnancy:
    "Every two weeks a real person sits down with your progress and changes your plan with you — what's working, what's changed this trimester, what comes next.",
  ttc: "Every two weeks a real person sits down with your progress and changes your plan with you — what's working, what your cycle is telling us, what comes next.",
}

const COMMUNITY_LINE: Record<Stage, string> = {
  postpartum:
    "Ask the questions you'd never say out loud, watch someone two weeks ahead of you get through the thing you're in, and stop doing postpartum on your own.",
  pregnancy:
    "Ask the questions you'd never say out loud, hear from women a few weeks ahead of you, and stop working it out from search results at 2am.",
  ttc: "Ask the questions you'd never say out loud, sit with women who know exactly what a two-week wait feels like, and stop carrying it by yourself.",
}

const COMMUNITY_HEADING: Record<Stage, string> = {
  postpartum: "You recover next to mothers who are exactly where you are",
  pregnancy: "You go through it next to women who are exactly where you are",
  ttc: "You try next to women who are exactly where you are",
}

export function WhatsWaiting({ stage }: { stage: Stage }) {
  return (
    <div className="mb-8 rounded-lg p-5" style={{ backgroundColor: CREAM, border: `1px solid ${EDGE}` }}>
      <p className="text-center font-bold text-lg mb-4" style={{ color: COPPER }}>
        {SPACE_NAME[stage]}:
      </p>

      {/* The human coach, first and loud. It is the one thing on this list a
          competitor cannot ship by adding a feature. */}
      <div className="mb-4 rounded-lg p-4" style={{ backgroundColor: "#FFF3E0", border: `1px solid #F0C089` }}>
        <p className="font-bold text-sm mb-1" style={{ color: COPPER }}>
          👩‍⚕️ A coach who is an actual human being
        </p>
        <p className="text-sm leading-relaxed" style={{ color: INK }}>
          {COACH_LINE[stage]}
        </p>
      </div>

      <div className="space-y-4">
        {GROUPS[stage].map((group) => (
          <div key={group.title}>
            <p className="text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: MUTED }}>
              {group.title}
            </p>
            <div className="space-y-1.5">
              {group.items.map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-sm" style={{ color: INK }}>
                  <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-600" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* The community, sold as the feeling. A member count answers a question
          nobody asked; "I feel like I'm the only one" is the real one. */}
      <div className="mt-4 rounded-lg p-4" style={{ backgroundColor: "#FFFFFF", border: `1px solid ${EDGE}` }}>
        <p className="font-bold text-sm mb-1" style={{ color: COPPER }}>
          🤝 {COMMUNITY_HEADING[stage]}
        </p>
        <p className="text-sm leading-relaxed" style={{ color: INK }}>
          {COMMUNITY_LINE[stage]}
        </p>
      </div>

      <p className="mt-4 text-xs text-center leading-snug" style={{ color: MUTED }}>
        It all sits in one place, and it all starts from the assessment you just finished.
      </p>
    </div>
  )
}

export default WhatsWaiting
