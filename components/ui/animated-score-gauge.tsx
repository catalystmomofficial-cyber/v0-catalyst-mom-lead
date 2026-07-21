"use client"

import { useEffect, useId, useState } from "react"
import { cn } from "@/lib/utils"

interface AnimatedScoreGaugeProps {
  /** Score 0–100. Drives both the arc fill and the count-up number. */
  value?: number
  /** Deep end of the arc gradient + number color (tier color). */
  toColor?: string
  /** Light end of the arc gradient. Defaults to toColor. */
  fromColor?: string
  /** Color of the "/100" caption under the number. */
  captionColor?: string
  /** Base (unfilled) track color. */
  trackColor?: string
  size?: number
  strokeWidth?: number
  durationMs?: number
  className?: string
}

// A semicircular score gauge. The arc sweeps and the number counts up together,
// driven by a single requestAnimationFrame tween (no framer-motion), and it
// snaps straight to the value when the viewer prefers reduced motion.
export function AnimatedScoreGauge({
  value = 0,
  toColor = "#A15C2F",
  fromColor,
  captionColor = "#8A7060",
  trackColor = "#E8D5C4",
  size = 260,
  strokeWidth,
  durationMs = 1500,
  className,
}: AnimatedScoreGaugeProps) {
  const uid = useId().replace(/[:]/g, "")
  const sw = strokeWidth ?? Math.max(12, size * 0.07)
  const center = size / 2
  const radius = size * 0.38
  const innerRadius = radius - sw - 4
  const circumference = Math.PI * radius
  const height = size * 0.64

  const clamped = Math.max(0, Math.min(100, value))
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches
    if (prefersReduced) {
      setCurrent(clamped)
      return
    }
    let raf = 0
    let start = 0
    const step = (ts: number) => {
      if (!start) start = ts
      const t = Math.min(1, (ts - start) / durationMs)
      const eased = 1 - Math.pow(1 - t, 3) // easeOutCubic
      setCurrent(clamped * eased)
      if (t < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [clamped, durationMs])

  const offset = circumference * (1 - current / 100)
  const arcPath = `M ${center - radius} ${center} A ${radius} ${radius} 0 0 1 ${center + radius} ${center}`

  return (
    <div className={cn("relative mx-auto", className)} style={{ width: size, height }}>
      <svg width={size} height={height} viewBox={`0 0 ${size} ${height}`} className="overflow-visible">
        <defs>
          <linearGradient id={`arc-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={fromColor ?? toColor} />
            <stop offset="100%" stopColor={toColor} />
          </linearGradient>
          <filter id={`shadow-${uid}`} x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#3A2412" floodOpacity="0.18" />
          </filter>
        </defs>

        {/* Faint inner guide line */}
        <path
          d={`M ${center - innerRadius} ${center} A ${innerRadius} ${innerRadius} 0 0 1 ${center + innerRadius} ${center}`}
          fill="none"
          stroke={captionColor}
          strokeWidth="1"
          opacity="0.35"
        />

        {/* Base track */}
        <path
          d={arcPath}
          fill="none"
          stroke={trackColor}
          strokeWidth={sw}
          strokeLinecap="round"
        />

        {/* Progress arc */}
        <path
          d={arcPath}
          fill="none"
          stroke={`url(#arc-${uid})`}
          strokeWidth={sw}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          filter={`url(#shadow-${uid})`}
        />
      </svg>

      {/* Center number + /100 caption, nudged into the bowl */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ transform: `translateY(${size * 0.05}px)` }}
      >
        <span className="font-bold leading-none tabular-nums" style={{ fontSize: size * 0.2, color: toColor }}>
          {Math.round(current)}
        </span>
        <span className="font-semibold leading-none mt-1" style={{ fontSize: size * 0.06, color: captionColor }}>
          / 100
        </span>
      </div>
    </div>
  )
}
