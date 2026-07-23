"use client"

import { useEffect, useState } from "react"

// Mobile-only sticky bottom CTA for the results pages. Clarity showed moms
// reading the whole page without ever clicking: the fixed CTAs sit at set
// scroll positions, so whenever conviction peaks mid-read there's no button
// in view. This keeps one thumb-tap available from the moment she's past the
// first offer until she leaves. Desktop is untouched (md:hidden).
export function StickyCta({
  href,
  label,
  subline = "$29/month founding seat · cancel anytime",
  revealAfter = 700,
}: {
  href: string
  label: string
  subline?: string
  revealAfter?: number
}) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > revealAfter)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [revealAfter])

  return (
    <div
      className={`md:hidden fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div
        className="mx-3 mb-3 rounded-2xl shadow-2xl border p-3"
        style={{ backgroundColor: "rgba(255,255,255,0.97)", borderColor: "#E8D5C4" }}
      >
        <a
          href={href}
          className="block w-full text-center text-white font-bold py-3 px-4 rounded-xl text-base leading-snug"
          style={{ background: "linear-gradient(135deg, #A15C2F, #C27B48)" }}
        >
          {label}
        </a>
        <p className="text-center text-[11px] mt-1.5" style={{ color: "#8A7060" }}>
          {subline}
        </p>
      </div>
    </div>
  )
}
