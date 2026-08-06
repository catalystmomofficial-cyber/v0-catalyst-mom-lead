import type { ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ConcernReflectionCard({
  concern,
  reflection,
  crisis,
  footer,
}: {
  concern: string
  reflection: string
  crisis: boolean
  /**
   * The next step, rendered inside this card rather than after it. This is the
   * highest-conviction moment on the page — she has just read her own words
   * understood — and it used to dead-end into a card boundary. Never rendered
   * when crisis is true: a woman in crisis gets resources, not an offer.
   */
  footer?: ReactNode
}) {
  if (crisis) {
    return (
      <Card className="border-0 shadow-xl mb-8" style={{ borderLeft: "6px solid #2E7D32" }}>
        <CardHeader>
          <CardTitle className="text-2xl" style={{ color: "#2E7D32" }}>
            💛 We&apos;re Here With You
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg leading-relaxed" style={{ color: "#3A2412" }}>
            {reflection}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-xl mb-8" style={{ borderLeft: "6px solid #A15C2F" }}>
      <CardHeader>
        <CardTitle className="text-2xl" style={{ color: "#A15C2F" }}>
          💬 You Told Us
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 rounded-lg" style={{ backgroundColor: "#F3E5F5" }}>
          <p className="italic text-lg" style={{ color: "#666" }}>
            &ldquo;{concern}&rdquo;
          </p>
        </div>
        <p className="text-lg leading-relaxed" style={{ color: "#3A2412" }}>
          {reflection}
        </p>
        {footer}
      </CardContent>
    </Card>
  )
}
