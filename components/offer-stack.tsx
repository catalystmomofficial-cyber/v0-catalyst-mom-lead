import type { ReactNode } from "react"
import { CheckCircle2 } from "lucide-react"

export type StackItem = {
  label: string
  hero?: boolean
}

// ─── What's inside — no prices ──────────────────────────────────────────────
//
// This used to be a full price stack: à-la-carte dollar values, a $1,151 anchor,
// the regular tier struck through, then the founding price. It was doing the
// opposite of its job. A woman reaches the end of a ten-minute assessment,
// meets a number, and leaves — she never gets far enough to want the thing.
//
// Desire stays, the number goes. She sees what is waiting, creates a free
// account, uses her first steps, and meets the price from the inside once the
// product has already done something for her. Nothing on the results page asks
// her for money, so nothing on the results page states a price.
export function ValueStack({ items }: { items: StackItem[] }) {
  return (
    <div
      className="text-left mb-4 p-4 rounded-lg"
      style={{ backgroundColor: "#F8F5F2", border: "1px solid #E8D5C4" }}
    >
      <p className="text-center font-bold mb-3" style={{ color: "#A15C2F" }}>
        What&apos;s waiting inside your account:
      </p>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-2 text-sm" style={{ color: "#3A2412" }}>
            <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-600" />
            <span className={item.hero ? "font-bold" : ""}>{item.label}</span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-center leading-snug" style={{ color: "#8A7060" }}>
        One place — instead of separate apps for tracking, workouts, meal plans, and recovery.
      </p>
      <div className="mt-3 rounded-lg p-3 text-left" style={{ backgroundColor: "#FFF8E1", border: "1px solid #F0C089" }}>
        <p className="text-sm font-semibold" style={{ color: "#A15C2F" }}>
          🎁 Your welcome gift: 500 credits
        </p>
        <p className="text-xs mt-0.5" style={{ color: "#3A2412", opacity: 0.85 }}>
          Added the moment your account is created — put them straight toward any of our premium guides inside the app.
        </p>
      </div>
    </div>
  )
}

// ─── Charter Founder scarcity (honest, mechanism-backed) ────────────────────
// The constraint is real — coach time, first 100 members — so it stays. What
// leaves is every number attached to it, because scarcity that arrives bolted
// to a price reads as pressure to pay rather than a reason to claim a place.
export function CharterScarcity({
  coachLabel = "your dedicated coach",
}: {
  coachLabel?: string
}) {
  return (
    <div
      className="mb-4 p-4 rounded-lg text-left"
      style={{ backgroundColor: "#FFF3E0", border: "1px solid #F0C089" }}
    >
      <p className="font-bold mb-1" style={{ color: "#A15C2F" }}>
        🔒 You&apos;d be joining as a Charter Founder — the first 100
      </p>
      <p className="text-sm" style={{ color: "#3A2412" }}>
        Creating your account holds your Charter Founder place: full app access, community events, and
        <strong> 2 private 1:1 Progression Syncs each month with {coachLabel}</strong> on founding terms,
        for as long as you stay. Once the first 100 places are taken, the 1:1 Syncs move to the standard
        coaching tier. Claiming your place costs nothing today.
      </p>
    </div>
  )
}

// ─── Free to start ──────────────────────────────────────────────────────────
// Replaces the refund guarantee on the results page. A money-back promise only
// makes sense next to an ask for money; here it introduced the idea of paying
// at the exact moment we are telling her she doesn't have to.
export function FreeToStart() {
  return (
    <div
      className="mt-4 p-4 rounded-lg text-left"
      style={{ backgroundColor: "#F1F8F4", border: "1px solid #A5D6A7" }}
    >
      <p className="font-bold mb-1 flex items-center gap-2" style={{ color: "#2E7D32" }}>
        🛡️ Free to create — no card, no trial clock
      </p>
      <p className="text-sm" style={{ color: "#3A2412" }}>
        Your score, your gaps, and everything you wrote here save straight into your account, and your first
        steps are ready to use. Anything paid, you decide on later — from the inside, once it has actually
        done something for you.
      </p>
    </div>
  )
}

// ─── Founder note — the real founder story, rendered ONCE per results view ──
// Same true story on every stage — only the stage-specific phrase changes,
// so it doesn't read as a copy-pasted "postpartum" line on TTC/pregnancy.
const FOUNDER_STAGE_COPY = {
  postpartum: {
    wentThrough: "postpartum",
    closingLine: "Postpartum shouldn’t be something women survive alone.",
  },
  pregnancy: {
    wentThrough: "pregnancy",
    closingLine: "Pregnancy shouldn’t be something women navigate alone.",
  },
  ttc: {
    wentThrough: "trying to conceive, month after month,",
    closingLine: "Trying to conceive shouldn’t be something women go through alone.",
  },
} as const

export function FounderNote({ stage = "postpartum" }: { stage?: "postpartum" | "pregnancy" | "ttc" }) {
  const { wentThrough, closingLine } = FOUNDER_STAGE_COPY[stage]
  return (
    <div className="mt-8 mb-4">
      <div
        className="p-5 rounded-lg text-left"
        style={{ backgroundColor: "#F8F5F2", border: "1px solid #E8D5C4" }}
      >
        <p className="text-sm leading-relaxed italic" style={{ color: "#5C3D2E" }}>
          &ldquo;I didn&apos;t build Catalyst Mom as a fitness expert or a tech founder. I built it as a husband who
          watched his wife go through {wentThrough} with no family nearby. Her parents weren&apos;t close. Mine
          weren&apos;t either. It was just us — and I had no idea how hard it really was until I was living it with
          her every single day. I also built it carrying grief. Watching what my own mother went through, the things
          she silently endured — that shaped me. It made me want something different for the women in my life, and
          eventually for every mother I&apos;ve never met. {closingLine}
          I couldn&apos;t find anything that truly helped my wife the way she deserved to be helped. So I built it.
          Catalyst Mom exists because love sometimes looks like doing the hard thing — building the village when there
          isn&apos;t one. Every woman who comes through this assessment — I see my wife in her. I see my mother in
          her. That&apos;s why we don&apos;t do generic. That&apos;s why this is personal.&rdquo;
        </p>
        <p className="text-sm font-semibold mt-3" style={{ color: "#A15C2F" }}>
          — The Founder, Catalyst Mom
        </p>
      </div>
    </div>
  )
}

// ─── Risk reversal / guarantee ──────────────────────────────────────────────
export function Guarantee({ children }: { children: ReactNode }) {
  return (
    <div
      className="mt-4 p-4 rounded-lg text-left"
      style={{ backgroundColor: "#F1F8F4", border: "1px solid #A5D6A7" }}
    >
      <p className="font-bold mb-1 flex items-center gap-2" style={{ color: "#2E7D32" }}>
        🛡️ Our 30-Day &ldquo;Feel It or It&apos;s Free&rdquo; Guarantee
      </p>
      <p className="text-sm" style={{ color: "#3A2412" }}>
        {children}
      </p>
    </div>
  )
}
