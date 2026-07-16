import type { ReactNode } from "react"
import { CheckCircle2 } from "lucide-react"

export type StackItem = {
  label: string
  value: string
  hero?: boolean
}

// ─── Value stack + anchor + founding price ──────────────────────────────────
// Renders the à-la-carte value of everything included, anchors to a big total,
// then reveals the founding-member price so it reads as a deal, not a cost.
export function ValueStack({
  items,
  total,
  price = "$29/month",
}: {
  items: StackItem[]
  total: string
  price?: string
}) {
  return (
    <div
      className="text-left mb-5 p-4 rounded-lg"
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
        <span className="font-bold line-through" style={{ color: "#8A7060" }}>
          {total}
        </span>
      </div>
      <div className="mt-1 flex items-center justify-between">
        <span className="font-bold" style={{ color: "#A15C2F" }}>
          Founding member price
        </span>
        <span className="text-xl font-bold" style={{ color: "#A15C2F" }}>
          {price}
        </span>
      </div>
    </div>
  )
}

// ─── Founding-member urgency (honest scarcity — no fake countdowns) ──────────
export function FoundingUrgency() {
  return (
    <p
      className="text-center text-xs font-semibold mb-3 px-3 py-2 rounded-lg"
      style={{ backgroundColor: "#FFF3E0", color: "#A15C2F" }}
    >
      🔒 Founding-member pricing — locked in for life. This rate rises for the next cohort of mamas.
    </p>
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
