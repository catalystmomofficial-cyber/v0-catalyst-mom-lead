"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

// ─────────────────────────────────────────────────────────────────────────────
// Conversion blocks for the results pages.
//
// The results page used to be read end-to-end without anything happening. Three
// reasons, all fixed here:
//
//  1. The reflection — the one moment on the page where she reads her own words
//     back and feels understood — had no door attached to it. She hit peak
//     conviction and the next thing was a generic card. ReflectionCta puts the
//     door exactly where the conviction is.
//  2. Nobody clicks into an unknown. WhatHappensNext says plainly what the next
//     60 seconds look like, including the email confirmation, so the click is
//     not a leap.
//  3. Nothing on the page answered the objections she is actually holding
//     (is this safe, is the coach real, I have no time, what if it isn't for
//     me). ObjectionFaq answers them next to the ask instead of leaving her to
//     resolve them alone, which she resolves by leaving.
// ─────────────────────────────────────────────────────────────────────────────

const COPPER = "#A15C2F"
const INK = "#3A2412"
const MUTED = "#8A7060"
const CREAM = "#F8F5F2"
const EDGE = "#E8D5C4"

type Stage = "postpartum" | "pregnancy" | "ttc"

// ─── The door under her reflection ───────────────────────────────────────────

const REFLECTION_LINE: Record<Stage, string> = {
  pregnancy:
    "This is the part of pregnancy nobody walks you through — and it is exactly what your plan is built around.",
  postpartum:
    "This is the part of recovery nobody walks you through — and it is exactly what your plan is built around.",
  ttc: "This is the part of trying nobody walks you through — and it is exactly what your plan is built around.",
}

export function ReflectionCta({
  href,
  stage,
  firstName,
  label = "Save this and show me how we work on it",
}: {
  href: string
  stage: Stage
  firstName?: string
  label?: string
}) {
  const name = firstName?.trim().split(" ")[0]
  return (
    <div
      className="mt-2 rounded-lg p-4 text-center"
      style={{ backgroundColor: CREAM, border: `1px solid ${EDGE}` }}
    >
      <p className="text-sm leading-snug mb-3" style={{ color: INK }}>
        {name ? `${name}, y` : "Y"}ou don&apos;t have to work this one out on your own.{" "}
        {REFLECTION_LINE[stage]}
      </p>
      <a
        href={href}
        className="block w-full md:inline-block md:w-auto text-center text-white font-bold py-3 px-6 rounded-xl shadow-lg leading-snug"
        style={{ background: "linear-gradient(135deg, #A15C2F, #C27B48)" }}
      >
        {label}
      </a>
      <p className="text-xs mt-2" style={{ color: MUTED }}>
        Free account · no card needed · this saves into it
      </p>
    </div>
  )
}

// ─── What the next 60 seconds actually look like ─────────────────────────────
//
// PARKED FOR THE PAYWALL. WhatHappensNext and ObjectionFaq below are no longer
// rendered on the results page — that page is down to one screen. Both belong
// on the upgrade screen inside the app, where she is deciding about money and
// the objections are live. Kept here so the copy moves rather than gets
// rewritten from memory.

const NEXT_STEPS: Record<Stage, string[]> = {
  pregnancy: [
    "Your free account is created with this assessment already loaded — no card, nothing to retype.",
    "Confirm your email (we send the link straight away — check spam if it's slow).",
    "Your trimester plan, your coach, and your 500 welcome credits are waiting inside.",
  ],
  postpartum: [
    "Your free account is created with this assessment already loaded — no card, nothing to retype.",
    "Confirm your email (we send the link straight away — check spam if it's slow).",
    "Your recovery plan, your coach, and your 500 welcome credits are waiting inside.",
  ],
  ttc: [
    "Your free account is created with this assessment already loaded — no card, nothing to retype.",
    "Confirm your email (we send the link straight away — check spam if it's slow).",
    "Your cycle plan, your coach, and your 500 welcome credits are waiting inside.",
  ],
}

export function WhatHappensNext({ stage }: { stage: Stage }) {
  return (
    <div
      className="mt-6 rounded-lg p-4 text-left"
      style={{ backgroundColor: "#FFFFFF", border: `1px solid ${EDGE}` }}
    >
      <p className="font-bold mb-3 text-sm" style={{ color: COPPER }}>
        What happens the moment you tap it
      </p>
      <ol className="space-y-2">
        {NEXT_STEPS[stage].map((s, i) => (
          <li key={i} className="flex items-start gap-3 text-sm" style={{ color: INK }}>
            <span
              className="flex-shrink-0 w-5 h-5 rounded-full text-white text-xs font-bold flex items-center justify-center mt-0.5"
              style={{ backgroundColor: COPPER }}
            >
              {i + 1}
            </span>
            <span>{s}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

// ─── Objections, answered next to the ask ────────────────────────────────────

const SAFETY_Q: Record<Stage, { q: string; a: string }> = {
  pregnancy: {
    q: "Is any of this safe while I'm pregnant?",
    a: "Everything is built for pregnancy specifically and adjusts by trimester — it is not a general fitness plan with a warning label bolted on. If something isn't right for where you are, it isn't in your plan. And your coach is there to check anything you're unsure about before you do it.",
  },
  postpartum: {
    q: "Is any of this safe this soon after birth?",
    a: "Your plan starts from where your body actually is, including whether you've been cleared yet. Nothing asks you to push. If you aren't cleared, your plan is the gentle, staged work that comes first — not the work that comes later.",
  },
  ttc: {
    q: "Will this actually help while we're trying?",
    a: "Nobody can promise you a pregnancy, and we won't. What this does is get your cycle, your nutrition, your sleep, and your stress into the strongest state they can be in, so your efforts have the best conditions to work with.",
  },
}

function faqFor(stage: Stage) {
  return [
    SAFETY_Q[stage],
    {
      q: "Do I have to pay to get in?",
      a: "No. Creating your account is free and there's no card involved. Everything from this assessment saves into it and your first steps are ready to open. Anything paid you decide on later, from the inside, once it has actually done something for you.",
    },
    {
      q: "Is the coach a real person, or a bot?",
      a: "A real person. Your monthly Progression Syncs are private 1:1 calls with a coach who has read this assessment before you speak — they're part of the founding membership, and you'll see them waiting inside. The AI coach is separate and it's there from the moment you're in, for the 2am questions.",
    },
    {
      q: "I barely have time. Honestly.",
      a: "That is the assumption the plan is built on. Sessions are short and sequenced, so you're never choosing which of six things to do — you open it and the next thing is already picked for you.",
    },
    {
      q: "What happens to everything I just filled in?",
      a: "It comes with you. Your score, your gaps, and what you wrote in your own words load straight into your plan and your coach's notes — you never fill this in twice.",
    },
  ]
}

export function ObjectionFaq({ stage }: { stage: Stage }) {
  const [open, setOpen] = useState<number | null>(0)
  const items = faqFor(stage)

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-3 text-center" style={{ color: COPPER }}>
        Before you decide
      </h3>
      <div className="rounded-lg overflow-hidden" style={{ border: `1px solid ${EDGE}` }}>
        {items.map((item, i) => (
          <div key={i} style={{ borderTop: i === 0 ? "none" : `1px solid ${EDGE}` }}>
            <button
              type="button"
              onClick={() => setOpen(open === i ? null : i)}
              aria-expanded={open === i}
              className="w-full flex items-center justify-between gap-3 text-left px-4 py-3"
              style={{ backgroundColor: open === i ? CREAM : "#FFFFFF" }}
            >
              <span className="font-semibold text-sm" style={{ color: INK }}>
                {item.q}
              </span>
              <ChevronDown
                className="h-4 w-4 flex-shrink-0 transition-transform"
                style={{ color: COPPER, transform: open === i ? "rotate(180deg)" : "none" }}
              />
            </button>
            {open === i && (
              <p className="px-4 pb-4 text-sm leading-relaxed" style={{ color: INK, backgroundColor: CREAM }}>
                {item.a}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
