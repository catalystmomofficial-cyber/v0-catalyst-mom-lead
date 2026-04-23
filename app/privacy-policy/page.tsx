import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy — Catalyst Mom",
  description: "How Catalyst Mom collects, uses, and protects your personal information.",
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="pb-10" style={{ borderBottom: "1px solid rgba(181,101,29,0.1)" }}>
    <h2
      className="text-xl font-bold mb-4 flex items-center gap-3"
      style={{ color: "#B5651D", fontFamily: "Georgia, serif" }}
    >
      {title}
      <span className="flex-1 h-px" style={{ background: "linear-gradient(to right, rgba(181,101,29,0.3), transparent)" }} />
    </h2>
    <div className="space-y-3 text-sm" style={{ color: "#2C2218" }}>
      {children}
    </div>
  </div>
)

const SubHeading = ({ children }: { children: React.ReactNode }) => (
  <p className="font-semibold mt-5 mb-2" style={{ color: "#2C2218" }}>
    {children}
  </p>
)

const List = ({ items }: { items: React.ReactNode[] }) => (
  <ul className="space-y-2 my-3">
    {items.map((item, i) => (
      <li key={i} className="flex items-start gap-3 text-sm leading-relaxed" style={{ color: "#2C2218" }}>
        <span className="font-bold mt-0.5 shrink-0" style={{ color: "#B5651D" }}>—</span>
        <span>{item}</span>
      </li>
    ))}
  </ul>
)

export default function PrivacyPolicyPage() {
  return (
    <div style={{ backgroundColor: "#FDF6EE", color: "#2C2218", fontFamily: "sans-serif", lineHeight: 1.8 }}>

      {/* Header */}
      <header
        className="flex justify-between items-center px-6 py-5"
        style={{ backgroundColor: "#1A1008", borderBottom: "3px solid #B5651D" }}
      >
        <Link href="/" className="text-lg italic" style={{ color: "#F4C5A0", fontFamily: "Georgia, serif" }}>
          Catalyst Mom
        </Link>
        <Link
          href="/"
          className="text-xs tracking-widest uppercase font-medium px-5 py-2 border transition-colors"
          style={{ color: "#8A7060", borderColor: "rgba(138,112,96,0.3)" }}
        >
          Back to Assessment
        </Link>
      </header>

      {/* Hero */}
      <div
        className="text-center px-6 py-16 relative overflow-hidden"
        style={{ backgroundColor: "#1A1008" }}
      >
        <div className="relative z-10 max-w-xl mx-auto">
          <p className="text-xs tracking-widest uppercase mb-4 font-medium" style={{ color: "#B5651D" }}>
            Legal
          </p>
          <h1 className="text-4xl sm:text-5xl mb-4" style={{ color: "white", fontFamily: "Georgia, serif", fontWeight: 400 }}>
            Privacy <em style={{ fontStyle: "italic", color: "#F4C5A0" }}>Policy</em>
          </h1>
          <p className="text-sm" style={{ color: "#8A7060" }}>
            Effective Date: April 22, 2026 &nbsp;&middot;&nbsp; Last Updated: April 22, 2026
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-16 space-y-12">

        {/* Intro */}
        <div
          className="p-8 text-base leading-loose"
          style={{ backgroundColor: "#F5EBE0", borderLeft: "4px solid #B5651D" }}
        >
          Welcome to Catalyst Mom. We are committed to protecting your privacy and handling your personal information with care, transparency, and respect. This Privacy Policy explains how we collect, use, store, and protect your information when you use the Catalyst Mom app and assessment website (collectively, the &ldquo;Platform&rdquo;).
          <br /><br />
          By using our Platform, you agree to the terms of this Privacy Policy. If you do not agree, please do not use our services.
        </div>

        <Section title="1. Who We Are">
          <p>Catalyst Mom is a maternal wellness platform designed to support women through every stage of motherhood &mdash; Trying to Conceive (TTC), Pregnancy, and Postpartum recovery.</p>
          <List items={[
            <><strong>App:</strong> catalystmomofficial.com</>,
            <><strong>Assessment:</strong> catalystmom.online</>,
            <><strong>Contact:</strong> admin@catalystmom.online</>,
          ]} />
        </Section>

        <Section title="2. Information We Collect">
          <p>We collect the following types of information:</p>
          <SubHeading>2.1 Information You Provide Directly</SubHeading>
          <List items={[
            "Name and email address when you create an account or complete the assessment",
            "Motherhood stage selection (TTC, Pregnancy, or Postpartum)",
            "Health and wellness information you voluntarily enter (mood, sleep, symptoms, measurements)",
            "Payment information processed securely through Stripe — we do not store card details",
            "Messages and content posted in community groups",
            "Responses to assessments and questionnaires",
            "Communications with our support team",
          ]} />
          <SubHeading>2.2 Information Collected Automatically</SubHeading>
          <List items={[
            "Device type, browser, and operating system",
            "IP address and approximate location",
            "Pages visited, features used, and time spent on the Platform",
            "Push notification preferences and interaction data",
            "Cookies and similar tracking technologies",
          ]} />
          <SubHeading>2.3 Information from Third Parties</SubHeading>
          <List items={[
            "If you sign in with Google, we receive your name and email address from Google",
            "Payment status and transaction confirmation from Stripe",
            "Email engagement data from Omnisend and Resend",
          ]} />
        </Section>

        <Section title="3. How We Use Your Information">
          <p>We use your information to:</p>
          <List items={[
            "Provide, personalise, and improve our Platform",
            "Create and manage your account, send service updates",
            "Process payments and verify transactions",
            "Send you wellness reminders, community alerts, and marketing communications",
            "Improve our Platform through analytics and user feedback",
            "Respond to your questions and support requests",
            "Comply with legal obligations",
          ]} />
        </Section>

        <Section title="4. Sensitive Health Information">
          <p>Catalyst Mom is a wellness platform. Some information you share with us &mdash; such as postpartum symptoms, cycle data, pregnancy details, and physical measurements &mdash; is sensitive in nature.</p>
          <p>We treat all health-related information with the highest level of care. We do not sell this information. We do not share it with third parties for advertising purposes. We use it solely to personalise your experience on the Platform.</p>
          <p
            className="text-sm italic mt-4 px-5 py-4"
            style={{ backgroundColor: "rgba(181,101,29,0.06)", border: "1px solid rgba(181,101,29,0.2)", color: "#8A7060" }}
          >
            Catalyst Mom provides wellness information for educational purposes only and is not a substitute for professional medical advice.
          </p>
        </Section>

        <Section title="5. How We Share Your Information">
          <p>We do not sell your personal data. We may share your information only in the following circumstances:</p>
          <SubHeading>5.1 Service Providers</SubHeading>
          <p>We work with trusted third-party providers who help us operate the Platform:</p>
          <List items={[
            <><strong>Supabase</strong> — database, authentication, and backend infrastructure</>,
            <><strong>Stripe</strong> — payment processing</>,
            <><strong>Omnisend / Resend</strong> — email communication</>,
            <><strong>Firebase</strong> — push notifications</>,
          ]} />
          <p>All service providers are contractually required to protect your data and use it only for the purposes we specify.</p>
          <SubHeading>5.2 Community Content</SubHeading>
          <p>Content you post in community groups is visible to other members of that group. Please do not share sensitive personal information in public community spaces.</p>
          <SubHeading>5.3 Legal Requirements</SubHeading>
          <p>We may disclose your information if required by law, court order, or to protect the rights and safety of our users or the public.</p>
        </Section>

        <Section title="6. Cookies and Tracking">
          <p>We use cookies and similar technologies to:</p>
          <List items={[
            "Keep you logged in to your account",
            "Remember your preferences",
            "Analyse how the Platform is used",
            "Improve performance and user experience",
          ]} />
          <p>You can control cookie settings through your browser. Note that disabling cookies may affect some features of the Platform.</p>
        </Section>

        <Section title="7. Push Notifications">
          <p>If you install the Catalyst Mom app on your device and grant permission, we may send you push notifications including workout reminders, program updates, community alerts, and wellness check-ins.</p>
          <p>You can turn off push notifications at any time through your device settings or within the app.</p>
        </Section>

        <Section title="8. Data Retention">
          <p>We retain your personal information for as long as your account is active or as needed to provide our services. If you delete your account, we will delete your personal data within 30 days, except where we are required to retain it by law.</p>
          <p>Anonymous and aggregated data that cannot identify you may be retained indefinitely for analytics purposes.</p>
        </Section>

        <Section title="9. Data Security">
          <p>We take the security of your data seriously. We implement industry-standard measures including:</p>
          <List items={[
            "Encrypted data transmission (HTTPS/TLS)",
            "Secure authentication through Supabase",
            "Access controls limiting who can view your data",
            "Regular security reviews",
          ]} />
          <p>No system is 100% secure. While we work hard to protect your information, we cannot guarantee absolute security. If you believe your account has been compromised, please contact us immediately.</p>
        </Section>

        <Section title="10. Your Rights">
          <p>Depending on where you are located, you may have the following rights regarding your personal data:</p>
          <List items={[
            <><strong>Access</strong> — request a copy of the personal data we hold about you</>,
            <><strong>Correction</strong> — request that we correct inaccurate or incomplete data</>,
            <><strong>Deletion</strong> — request that we delete your personal data</>,
            <><strong>Portability</strong> — request your data in a machine-readable format</>,
            <><strong>Objection</strong> — object to certain types of processing</>,
            <><strong>Withdrawal of consent</strong> — withdraw consent for marketing communications at any time</>,
          ]} />
          <p>To exercise any of these rights, please contact us at admin@catalystmom.online. We will respond within 30 days.</p>
        </Section>

        <Section title="11. Children's Privacy">
          <p>Catalyst Mom is designed for adult women navigating motherhood. Our Platform is not intended for children under the age of 18. We do not knowingly collect personal information from anyone under 18. If we become aware that a child under 18 has provided us with personal information, we will delete it immediately.</p>
        </Section>

        <Section title="12. International Users">
          <p>Catalyst Mom is operated globally. If you are accessing our Platform from outside the country where our servers are located, please be aware that your information may be transferred to and processed in different countries. By using our Platform, you consent to this transfer.</p>
          <p>If you are located in the European Economic Area (EEA) or the United Kingdom, we process your data in accordance with the General Data Protection Regulation (GDPR). If you are located in California, we comply with the California Consumer Privacy Act (CCPA).</p>
        </Section>

        <Section title="13. Third-Party Links">
          <p>Our Platform may contain links to third-party websites or services. We are not responsible for the privacy practices of those third parties. We encourage you to review their privacy policies before providing any information.</p>
        </Section>

        <Section title="14. Changes to This Privacy Policy">
          <p>We may update this Privacy Policy from time to time. When we make significant changes, we will notify you by email or through a notice on the Platform. Your continued use of the Platform after changes are posted constitutes your acceptance of the updated policy.</p>
          <p>We encourage you to review this policy periodically.</p>
        </Section>

        <Section title="15. Contact Us">
          <p>If you have any questions, concerns, or requests regarding this Privacy Policy or how we handle your data, please contact us:</p>
          <div
            className="mt-4 p-8 relative overflow-hidden"
            style={{ backgroundColor: "#2C2218", paddingLeft: "2.5rem", borderLeft: "4px solid #B5651D" }}
          >
            <p className="text-sm mb-1" style={{ color: "rgba(253,246,238,0.8)" }}>
              <strong style={{ color: "#F4C5A0" }}>Catalyst Mom</strong>
            </p>
            <p className="text-sm mb-1" style={{ color: "rgba(253,246,238,0.8)" }}>Email: admin@catalystmom.online</p>
            <p className="text-sm mb-1" style={{ color: "rgba(253,246,238,0.8)" }}>App: catalystmomofficial.com</p>
            <p className="text-sm mb-4" style={{ color: "rgba(253,246,238,0.8)" }}>Assessment: catalystmom.online</p>
            <p className="text-sm" style={{ color: "rgba(253,246,238,0.8)" }}>
              We are committed to resolving any concerns you have about your privacy promptly and transparently.
            </p>
          </div>
        </Section>

      </div>

      {/* Footer */}
      <footer
        className="flex flex-col sm:flex-row justify-between items-center gap-3 px-8 py-6 flex-wrap"
        style={{ backgroundColor: "#1A1008", borderTop: "1px solid rgba(181,101,29,0.15)" }}
      >
        <span className="italic text-base" style={{ color: "#F4C5A0", fontFamily: "Georgia, serif" }}>Catalyst Mom</span>
        <span className="text-xs" style={{ color: "#8A7060" }}>Built from love. For every mama on the journey.</span>
        <span className="text-xs" style={{ color: "#8A7060" }}>&copy; 2026 Catalyst Mom. All Rights Reserved.</span>
      </footer>

    </div>
  )
}
