import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import CookieBanner from "@/components/cookie-banner"
import GoogleAnalytics from "@/components/google-analytics"
import "./globals.css"

// ── Fonts — unchanged ─────────────────────────────────────────────────────────
const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

// ── Metadata ──────────────────────────────────────────────────────────────────
// Fix 2: Removed generator:'v0.app' (was overriding favicon/tab identity).
// Title and description now reflect the Catalyst Mom brand.
// Icons explicitly point to /catalyst-mom-logo.png so browsers and Google
// Search pick up the correct logo instead of the v0 default icon.
export const metadata: Metadata = {
  title: {
    // Shown on the home page tab; child pages can override the first segment
    default: "Catalyst Mom: Empowering your Pregnancy, Postpartum, and TTC Journey",
    // e.g. "TTC Assessment | Catalyst Mom"
    template: "%s | Catalyst Mom",
  },
  description:
    "Catalyst Mom: Empowering your Pregnancy, Postpartum, and TTC Journey. " +
    "Personalized wellness assessments and recovery roadmaps for every stage of motherhood.",

  // ── Favicon / browser-tab icon ─────────────────────────────────────────────
  icons: {
    // Primary favicon (browsers, Google Search)
    icon: [
      { url: "/catalyst-mom-logo.png", type: "image/png" },
    ],
    // Apple home-screen icon
    apple: { url: "/catalyst-mom-logo.png", type: "image/png" },
    // Shortcut for older browsers
    shortcut: "/catalyst-mom-logo.png",
  },

  // ── Open Graph (social sharing previews) ──────────────────────────────────
  openGraph: {
    title: "Catalyst Mom: Empowering your Pregnancy, Postpartum, and TTC Journey",
    description:
      "Personalized wellness assessments and recovery roadmaps for TTC, pregnancy, and postpartum.",
    images: [{ url: "/catalyst-mom-logo.png" }],
    type: "website",
  },
}

// ── Root Layout ───────────────────────────────────────────────────────────────
// Fix 3: This root layout wraps ALL routes automatically, including:
//   /ttc-assessment
//   /pregnancy-assessment
//   /postpartum-assessment
// No additional route configuration is needed here — Next.js App Router
// serves every page inside /app through this layout by default.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Fix 1: Read the GA Measurement ID from the environment.
  // Set NEXT_PUBLIC_GA_ID in Vercel → Project Settings → Environment Variables.
  const gaId = process.env.NEXT_PUBLIC_GA_ID ?? ""

  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}

        {/* Cookie consent banner — must render before GA so the user can
            accept before any tracking scripts fire. */}
        <CookieBanner />

        {/* Fix 1: Google Analytics — consent-gated client component.
            The <Script> tags inside GoogleAnalytics are injected only after
            the user clicks "Accept" in the cookie banner.
            Falls back silently (renders nothing) if gaId is empty or
            consent has not been given. */}
        <GoogleAnalytics gaId={gaId} />

        {/* Vercel product analytics — privacy-friendly, no cookie required */}
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
