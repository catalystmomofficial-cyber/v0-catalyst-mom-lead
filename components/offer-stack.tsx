import type { ReactNode } from "react"
import { CheckCircle2 } from "lucide-react"

export type StackItem = {
  label: string
  value: string
  hero?: boolean
}

// ─── Value stack + anchor + founding price ──────────────────────────────────
// Lists the à-la-carte value of everything included, anchors to a big total,
// shows the regular tier price struck through, then reveals the founding price
// so it reads as a steal, not a cost.
export function ValueStack({
  items,
  total,
  regularPrice,
  price = "$29/month",
}: {
  items: StackItem[]
  total: string
  regularPrice?: string
  price?: string
}) {
  return (
    <div
      className="text-left mb-4 p-4 rounded-lg"
      style={{ backgroundColor: "#F8F5F2", border: "1px solid #E8D5C4" }}
    >
      <p className="text-center font-bold mb-3" style={{ color: "#A15C2F" }}>
        Everything you unlock today:
      </p>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-start justify-between gap-3">
            <span className="flex items-start gap-2 text-sm" style={{ color: "#3A2412" }}>
              <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-600" />
              <span className={item.hero ? "font-bold" : ""}>{item.label}</span>
            </span>
            <span className="text-sm whitespace-nowrap" style={{ color: "#8A7060" }}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
      <div
        className="mt-3 pt-3 border-t flex items-center justify-between"
        style={{ borderColor: "#E8D5C4" }}
      >
        <span className="font-bold" style={{ color: "#3A2412" }}>
          Total value
        </span>
        <span className="font-bold" style={{ color: "#3A2412" }}>
          {total}
        </span>
      </div>
      {regularPrice && (
        <div className="mt-1 flex items-center justify-between">
          <span className="text-sm" style={{ color: "#8A7060" }}>
            Regular price
          </span>
          <span className="text-sm line-through" style={{ color: "#8A7060" }}>
            {regularPrice}
          </span>
        </div>
      )}
      <div className="mt-1 flex items-center justify-between">
        <span className="font-bold" style={{ color: "#A15C2F" }}>
          Your founding seat
        </span>
        <span className="text-xl font-bold" style={{ color: "#A15C2F" }}>
          {price}
        </span>
      </div>
      <p className="mt-3 text-xs text-center leading-snug" style={{ color: "#8A7060" }}>
        One subscription — instead of separate apps for tracking, workouts, meal plans, and recovery. It all lives in one place.
      </p>
    </div>
  )
}

// ─── Charter Founder scarcity (honest, mechanism-backed) ────────────────────
// Only 100 seats get the 1:1 coaching at the founding price. After that, the
// 1:1 syncs move to the ongoing coaching tier. Real constraint (coach time),
// not a fake countdown.
export function CharterScarcity({
  coachLabel = "your dedicated coach",
  tierPrice = "$129/month",
}: {
  coachLabel?: string
  tierPrice?: string
}) {
  return (
    <div
      className="mb-4 p-4 rounded-lg text-left"
      style={{ backgroundColor: "#FFF3E0", border: "1px solid #F0C089" }}
    >
      <p className="font-bold mb-1" style={{ color: "#A15C2F" }}>
        🔒 The Charter Founder Membership — only 100 seats
      </p>
      <p className="text-sm" style={{ color: "#3A2412" }}>
        As a founding member you lock in full app access, community events, and your
        <strong> 2 private 1:1 Progression Syncs each month with {coachLabel}</strong> — at this price
        <strong> forever</strong>. Once the first 100 seats are filled, the 1:1 Syncs move exclusively to
        the {tierPrice} tier. The app stays — the founding rate on 1:1 coaching does not.
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
