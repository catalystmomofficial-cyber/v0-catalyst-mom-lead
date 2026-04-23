"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent")
    if (!consent) {
      setVisible(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem("cookie_consent", "accepted")
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 px-4 py-4 sm:px-6 sm:py-5"
      style={{ backgroundColor: "#1A1008", borderTop: "2px solid #B5651D" }}
    >
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-sm leading-relaxed" style={{ color: "rgba(253,246,238,0.85)" }}>
          We use cookies to personalise your experience and analyse site traffic. By continuing you agree to our{" "}
          <Link
            href="/privacy-policy"
            className="underline underline-offset-2 hover:opacity-80 transition-opacity"
            style={{ color: "#B5651D" }}
          >
            Privacy Policy
          </Link>
          .
        </p>
        <button
          onClick={handleAccept}
          className="shrink-0 px-6 py-2.5 text-sm font-semibold rounded text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#B5651D" }}
        >
          Accept
        </button>
      </div>
    </div>
  )
}
