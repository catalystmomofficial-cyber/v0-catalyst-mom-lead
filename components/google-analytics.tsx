"use client"

import Script from "next/script"
import { useEffect, useState } from "react"

/**
 * GoogleAnalytics
 * ─────────────────────────────────────────────────────────────────
 * Renders the GA4 <Script> tags ONLY after the user has accepted
 * the cookie banner.
 *
 * Cookie consent is expected to be persisted in localStorage under
 * the key "cookieConsent" with the value "true".
 * The component listens for:
 *  1. An initial localStorage read on mount
 *  2. A custom "cookieConsentUpdated" event dispatched by
 *     <CookieBanner> when the user accepts/declines
 * ─────────────────────────────────────────────────────────────────
 */
export default function GoogleAnalytics({ gaId }: { gaId: string }) {
  const [consentGiven, setConsentGiven] = useState(false)

  useEffect(() => {
    // ── 1. Check consent already stored from a previous visit ────
    const stored = localStorage.getItem("cookieConsent")
    if (stored === "true") {
      setConsentGiven(true)
      return // No need to keep listening
    }

    // ── 2. Listen for the banner decision in this session ────────
    const handler = () => {
      const updated = localStorage.getItem("cookieConsent")
      if (updated === "true") {
        setConsentGiven(true)
      }
    }

    window.addEventListener("cookieConsentUpdated", handler)
    return () => window.removeEventListener("cookieConsentUpdated", handler)
  }, [])

  // Don't inject anything until consent is confirmed
  if (!consentGiven || !gaId) return null

  return (
    <>
      {/* Load GA4 library */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />

      {/* Configure GA4 — runs once the library is ready */}
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  )
}
