"use client"

import { useEffect, useRef, useState } from "react"

// Premium phone-mockup visual for the assessment landing hero.
// Adapted from a GSAP scroll-jacking "cinematic hero" concept — kept the
// depth/glass/tilt visual language, dropped the ScrollTrigger pin (wrong
// for a fast 2-minute quiz funnel) and the unrelated app-store content.
export function AssessmentHeroMockup() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const phoneRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>()
  const [mounted, setMounted] = useState(false)
  const [ringProgress, setRingProgress] = useState(0)

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true))
    const ringId = window.setTimeout(() => setRingProgress(78), 500)
    return () => {
      cancelAnimationFrame(id)
      window.clearTimeout(ringId)
    }
  }, [])

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const isTouch = window.matchMedia("(pointer: coarse)").matches
    if (reduceMotion || isTouch) return

    const handleMouseMove = (e: MouseEvent) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        if (!wrapperRef.current || !phoneRef.current) return
        const rect = wrapperRef.current.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        const xVal = Math.max(-1, Math.min(1, (e.clientX - cx) / (window.innerWidth / 2)))
        const yVal = Math.max(-1, Math.min(1, (e.clientY - cy) / (window.innerHeight / 2)))
        phoneRef.current.style.transform = `rotateY(${xVal * 8}deg) rotateX(${-yVal * 8}deg)`
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const circumference = 2 * Math.PI * 54

  return (
    <div ref={wrapperRef} className="relative mx-auto w-full max-w-sm" style={{ perspective: "1200px" }}>
      {/* Ambient glow behind the phone */}
      <div
        className="absolute inset-0 -z-10 rounded-full blur-3xl opacity-40"
        style={{ background: "radial-gradient(circle, #C27B48 0%, transparent 70%)" }}
        aria-hidden="true"
      />

      <div
        ref={phoneRef}
        className={`relative mx-auto transition-[opacity,transform] duration-700 ease-out will-change-transform ${mounted ? "opacity-100 scale-100" : "opacity-0 scale-95 translate-y-6"}`}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Phone bezel */}
        <div
          className="relative mx-auto w-[188px] h-[384px] sm:w-[240px] sm:h-[490px] rounded-[2.25rem] sm:rounded-[2.75rem] p-1.5 sm:p-2"
          style={{
            background: "linear-gradient(160deg, #3A2412 0%, #1C120A 100%)",
            boxShadow:
              "0 30px 60px -15px rgba(58,36,18,0.45), 0 15px 25px -8px rgba(58,36,18,0.35), inset 0 1px 1px rgba(255,255,255,0.15)",
          }}
        >
          {/* Screen */}
          <div
            className="relative w-full h-full rounded-[2.25rem] overflow-hidden"
            style={{ background: "linear-gradient(180deg, #FBF7F1 0%, #F3E9DB 100%)" }}
          >
            {/* Notch */}
            <div className="absolute top-1.5 sm:top-2 left-1/2 -translate-x-1/2 w-16 h-4 sm:w-20 sm:h-5 bg-[#1C120A] rounded-full z-20" />

            <div className="relative w-full h-full pt-7 px-4 pb-4 sm:pt-10 sm:px-5 sm:pb-6 flex flex-col">
              <p className="text-[9px] sm:text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: "#A15C2F" }}>
                Your Result
              </p>
              <p className="text-xs sm:text-sm font-bold mb-4 sm:mb-6" style={{ color: "#3A2412" }}>
                Maternal Wellness Score
              </p>

              {/* Score ring */}
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-4 sm:mb-6">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="54" fill="none" stroke="#E8D5C4" strokeWidth="9" />
                  <circle
                    cx="60"
                    cy="60"
                    r="54"
                    fill="none"
                    stroke="#A15C2F"
                    strokeWidth="9"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - (ringProgress / 100) * circumference}
                    style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(0.16, 1, 0.3, 1)" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl sm:text-3xl font-extrabold" style={{ color: "#3A2412" }}>
                    {ringProgress}
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-semibold" style={{ color: "#8A7060" }}>
                    out of 100
                  </span>
                </div>
              </div>

              {/* Widgets — hidden on the smallest screens to avoid clutter */}
              <div className="space-y-2.5 hidden sm:block">
                {[
                  { label: "Core Connection", pct: 82, accent: "#4C8C6B", tint: "rgba(76,140,107,0.12)" },
                  { label: "Pelvic Floor", pct: 65, accent: "#3E6FA8", tint: "rgba(62,111,168,0.12)" },
                ].map((w) => (
                  <div
                    key={w.label}
                    className="rounded-xl p-3 flex items-center gap-3"
                    style={{ background: "rgba(255,255,255,0.7)", border: "1px solid #E8D5C4" }}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: w.tint }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke={w.accent} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-semibold truncate" style={{ color: "#3A2412" }}>
                        {w.label}
                      </p>
                      <div className="h-1.5 w-full rounded-full mt-1" style={{ background: "#E8D5C4" }}>
                        <div
                          className="h-full rounded-full transition-all duration-1000 ease-out"
                          style={{ width: mounted ? `${w.pct}%` : "0%", background: w.accent }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating glass badges — hidden on the smallest screens to avoid clutter */}
      <div
        className={`hero-badge-in hero-badge-drift hidden sm:flex absolute -left-4 top-8 sm:-left-10 rounded-2xl px-4 py-3 items-center gap-3 backdrop-blur-md ${mounted ? "" : "opacity-0"}`}
        style={{
          background: "rgba(255,255,255,0.75)",
          border: "1px solid rgba(161,92,47,0.15)",
          boxShadow: "0 15px 35px -10px rgba(58,36,18,0.25)",
          animationDelay: "0.5s, 1.2s",
          animationFillMode: "backwards",
        }}
      >
        <span className="text-xl" aria-hidden="true">💛</span>
        <div>
          <p className="text-xs font-bold leading-none" style={{ color: "#3A2412" }}>2,000+ Mamas</p>
          <p className="text-[10px]" style={{ color: "#8A7060" }}>Supported</p>
        </div>
      </div>

      <div
        className={`hero-badge-in hero-badge-drift hidden sm:flex absolute -right-4 bottom-16 sm:-right-8 rounded-2xl px-4 py-3 items-center gap-3 backdrop-blur-md ${mounted ? "" : "opacity-0"}`}
        style={{
          background: "rgba(255,255,255,0.75)",
          border: "1px solid rgba(161,92,47,0.15)",
          boxShadow: "0 15px 35px -10px rgba(58,36,18,0.25)",
          animationDelay: "0.7s, 1.4s",
          animationFillMode: "backwards",
        }}
      >
        <span className="text-xl" aria-hidden="true">⏱️</span>
        <div>
          <p className="text-xs font-bold leading-none" style={{ color: "#3A2412" }}>Free</p>
          <p className="text-[10px]" style={{ color: "#8A7060" }}>2-Minute Assessment</p>
        </div>
      </div>
    </div>
  )
}
