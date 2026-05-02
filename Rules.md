# Catalyst Mom Project: Master Instructions & Rules

## 1. Core Branding & Ethics
- **Visual Identity:** All pages and search engine results must display Catalyst Mom branding, including the logo/favicon.
- **Brand Colors:** Use the established palette: Brown (primary), Orange (accents), and "Milky" White backgrounds.
- **Tone:** Empathetic, grounded, and actionable. 
- **Medical Ethics:** Avoid fear-based medical claims (e.g., do not list preeclampsia, diabetes, or miscarriage risk as direct quiz results).

## 2. Technical Infrastructure
- **Paths:** Maintain and support `/postpartum-assessment`, `/pregnancy-assessment`, and `/ttc-assessment`.
- **Modularization:** Keep files under 1,000 lines. Move UI chunks (Testimonials, Pricing, Feature Grids) to separate functions or the `/components` folder.
- **Tag Integrity:** Always verify balanced tags (divs, sections) before outputting code to prevent Vercel build crashes.

## 3. Analytics & Lead Capture
- **Tracking ID:** `G-24S9C7GFLK` (Environment Variable: `NEXT_PUBLIC_GA_ID`).
- **Consent Mode:** No tracking fires until the 'Accept' button on the cookie banner is clicked.
- **Database:** All 3 assessment types must route leads (Name, Email, Score) to the 'Healthy' Supabase project `leads` table.

## 4. Navigation & Flow
- **Primary Redirect:** Assessment CTA buttons must point to `https://catalystmomofficial.com/signup`.
- **Pre-Filling Data:** The signup URL must include parameters: `name`, `email`, `score`, `tier`, and `stage`.
- **Encoding:** All parameters must be wrapped in `encodeURIComponent()` to ensure the link does not break on special characters (like '@').
- **Final Destination:** The `/signup` page is a bridge; it must pre-fill user details and automatically redirect the user to the `/dashboard` after account creation.

## 5. Content & Testimonials
- **Stage-Specific Content:** Use only testimonials relevant to the current assessment stage (e.g., TTC stories for `/ttc-assessment`).
- **Testimonial Structure:** Pass testimonials into the `TestimonialsBlock` component using the `Testimonial[]` array format.
- **Tone:** Highlight emotional relief, physical wellness, and clarity gained through the platform.
