"use client"
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface AIResult {
  headline: string
  situation: string
  insight: string
  topGaps: string[]
  programFix: string
  urgencyNote: string
}

interface Props {
  type: "postpartum" | "ttc" | "pregnancy"
  answers: Record<string, string>
  name: string
  tierColor: string
}

export function AIAssessmentResult({ type, answers, name, tierColor }: Props) {
  const [result, setResult] = useState<AIResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function fetchResult() {
      try {
        const res = await fetch("/api/ai-assessment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type, answers, name }),
        })
        if (!res.ok) throw new Error("API error")
        const data = await res.json()
        if (!cancelled) setResult(data.result)
      } catch {
        if (!cancelled) setError(true)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchResult()
    return () => { cancelled = true }
  }, [])

  if (loading) {
    return (
      <Card className="border-0 shadow-xl mb-6">
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <div
              className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin"
              style={{ borderColor: tierColor, borderTopColor: "transparent" }}
            />
            <p className="text-lg font-semibold" style={{ color: "#3A2412" }}>
              Analysing your answers…
            </p>
            <p className="text-sm" style={{ color: "#A15C2F" }}>
              Building your personalised assessment
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !result) return null

  return (
    <Card className="border-0 shadow-xl mb-6" style={{ borderLeft: `6px solid ${tierColor}` }}>
      <CardContent className="p-8 space-y-6">

        {/* Headline */}
        <h2 className="text-2xl font-bold leading-snug" style={{ color: "#3A2412" }}>
          {result.headline}
        </h2>

        {/* Situation — validation */}
        <p className="text-lg leading-relaxed" style={{ color: "#3A2412" }}>
          {result.situation}
        </p>

        {/* Insight — connect the dots */}
        <div className="p-5 rounded-xl" style={{ backgroundColor: "#FFF8E1", borderLeft: `4px solid #FFB74D` }}>
          <p className="text-sm font-bold uppercase mb-2" style={{ color: "#A15C2F" }}>
            What your answers reveal
          </p>
          <p className="leading-relaxed" style={{ color: "#3A2412" }}>
            {result.insight}
          </p>
        </div>

        {/* Top gaps */}
        <div>
          <p className="font-bold mb-3" style={{ color: "#A15C2F" }}>
            Your 3 key focus areas:
          </p>
          <div className="space-y-2">
            {result.topGaps.map((gap, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: "#FFEBEE" }}>
                <span className="font-bold text-lg flex-shrink-0" style={{ color: "#E57373" }}>
                  {i + 1}
                </span>
                <span style={{ color: "#3A2412" }}>{gap}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Program fix */}
        <div className="p-5 rounded-xl" style={{ backgroundColor: "#F1F8F4", borderLeft: `4px solid #81C784` }}>
          <p className="text-sm font-bold uppercase mb-2" style={{ color: "#2E7D32" }}>
            How Catalyst Mom fixes this for you
          </p>
          <p className="leading-relaxed" style={{ color: "#3A2412" }}>
            {result.programFix}
          </p>
        </div>

        {/* Urgency note */}
        <p className="text-sm font-semibold text-center italic" style={{ color: "#A15C2F" }}>
          ⏱ {result.urgencyNote}
        </p>

      </CardContent>
    </Card>
  )
}
