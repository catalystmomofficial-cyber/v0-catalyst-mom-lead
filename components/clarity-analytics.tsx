"use client"

import Script from "next/script"
import { useEffect, useState } from "react"

/**
 * ClarityAnalytics
 * ─────────────────────────────────────────────────────────────────
 * Renders the Microsoft Clarity tag ONLY after the user has accepted
 * the cookie banner — same consent gate as <GoogleAnalytics>.
 * ─────────────────────────────────────────────────────────────────
 */
export default function ClarityAnalytics({ projectId }: { projectId: string }) {
  const [consentGiven, setConsentGiven] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("cookie_consent")
    if (stored === "accepted") {
      setConsentGiven(true)
      return
    }

    const handler = () => {
      const updated = localStorage.getItem("cookie_consent")
      if (updated === "accepted") {
        setConsentGiven(true)
      }
    }

    window.addEventListener("cookieConsentUpdated", handler)
    return () => window.removeEventListener("cookieConsentUpdated", handler)
  }, [])

  if (!consentGiven || !projectId) return null

  return (
    <Script id="microsoft-clarity" strategy="afterInteractive">
      {`
        (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${projectId}");
      `}
    </Script>
  )
}
