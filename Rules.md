# Catalyst Mom Project: Master Instructions & Rules

## 1. Core Branding & Ethics
- **Visual Identity:** All pages and search engine results must display Catalyst Mom branding, including the logo/favicon.
- **Brand Colors:** Use the established palette: Brown, Orange, and "Milky" White backgrounds.
- **Tone:** Empathetic and actionable. 
- **Medical Ethics:** Avoid fear-based medical claims (e.g., do not list preeclampsia or diabetes as direct quiz results).

## 2. Technical Infrastructure
- **Paths:** Maintain and support `/postpartum-assessment`, `/pregnancy-assessment`, and `/ttc-assessment`.
- **Modularization:** Keep files under 1,000 lines. Move UI chunks (Testimonials, Pricing, Feature Grids) to separate functions or the `/components` folder.
- **Tag Integrity:** Always verify balanced tags (divs, sections) before outputting code to prevent Vercel build crashes.

## 3. Analytics & Lead Capture
- **Tracking ID:** `G-24S9C7GFLK` (Environment Variable: `NEXT_PUBLIC_GA_ID`).
- **Consent Mode:** No tracking fires until the 'Accept' button on the cookie banner is clicked.
- **Database:** All 3 assessment types must route leads (Name, Email, Score) to the 'Healthy' Supabase project `leads` table.

## 4. Navigation & Links
- **Primary Dashboard:** All "Go to Dashboard" buttons or post-signup redirects must point to: `https://catalystmomofficial.com/dashboard`
- **Link Persistence:** Ensure URL parameters (like `?score=X`) are appended to the dashboard link if needed for personalized onboarding.

## 5. Content & Testimonials
- **Stage-Specific Content:** Always use testimonials relevant to the current assessment stage (e.g., use "TTC success stories" only for the `/ttc-assessment`).
- **Testimonial Structure:** All testimonials must be passed into the `TestimonialsBlock` component using the `Testimonial[]` array format.
- **Tone:** Testimonials should highlight emotional relief, physical wellness, and clarity gained through the Catalyst Mom platform.
