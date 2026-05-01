# Catalyst Mom Project: Master Instructions & Rules

## 1. Core Branding & Ethics
- **Visual Identity:** All pages and search engine results must display Catalyst Mom branding, including the logo/favicon.
- **Tone:** Empathetic and actionable.
- **Medical Ethics:** Avoid fear-based medical claims (e.g., do not list preeclampsia or diabetes as direct quiz results).

## 2. Technical Infrastructure
- **Paths:** Maintain and support `/postpartum-assessment`, `/pregnancy-assessment`, and `/ttc-assessment`.
- **Modularization:** Keep files under 1,000 lines. Move UI chunks (Testimonials, Pricing) to separate functions or the `/components` folder.
- **Tag Integrity:** Always verify balanced tags (divs, sections) before outputting code to prevent Vercel build crashes.

## 3. Analytics & Lead Capture
- **Tracking ID:** `G-24S9C7GFLK` (Environment Variable: `NEXT_PUBLIC_GA_ID`).
- **Consent Mode:** No tracking fires until the 'Accept' button on the cookie banner is clicked.
- **Database:** All 3 assessment types must route leads (Name, Email, Score) to the 'Healthy' Supabase project leads table.
