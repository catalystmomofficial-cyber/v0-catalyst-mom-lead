import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy — Catalyst Mom",
  description: "How Catalyst Mom collects, uses, and protects your personal information.",
}

const privacyHtml = `
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Jost:wght@300;400;500&display=swap" rel="stylesheet">
<style>
  .pm { --copper:#B5651D;--copper-dark:#8B4513;--peach:#F4C5A0;--peach-light:#FAE0CC;--cream:#FDF6EE;--cream-dark:#F5EBE0;--charcoal:#2C2218;--warm-gray:#8A7060;--dark-brown:#1A1008; }
  .pm * { margin:0;padding:0;box-sizing:border-box; }
  .pm { background:var(--cream);color:var(--charcoal);font-family:'Jost',sans-serif;font-weight:300;line-height:1.8; }
  .pm header { background:var(--dark-brown);padding:1.5rem 2rem;display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid var(--copper); }
  .pm .logo { font-family:'Playfair Display',serif;font-size:1.2rem;color:var(--peach);font-style:italic;text-decoration:none; }
  .pm .back-btn { font-size:0.75rem;letter-spacing:0.15em;text-transform:uppercase;color:var(--warm-gray);text-decoration:none;border:1px solid rgba(138,112,96,0.3);padding:0.5rem 1.2rem;transition:all 0.3s ease;font-weight:500; }
  .pm .back-btn:hover { color:var(--peach);border-color:var(--peach); }
  .pm .policy-hero { background:var(--dark-brown);padding:4rem 2rem 3rem;text-align:center;position:relative;overflow:hidden; }
  .pm .policy-hero::before { content:'';position:absolute;inset:0;background:radial-gradient(ellipse at center,rgba(181,101,29,0.15) 0%,transparent 70%); }
  .pm .policy-hero-inner { position:relative;z-index:1;max-width:600px;margin:0 auto; }
  .pm .policy-eyebrow { font-size:0.65rem;letter-spacing:0.3em;text-transform:uppercase;color:var(--copper);margin-bottom:1rem;font-weight:500; }
  .pm .policy-title { font-family:'Playfair Display',serif;font-size:clamp(2rem,5vw,3rem);font-weight:400;color:white;margin-bottom:1rem; }
  .pm .policy-title em { font-style:italic;color:var(--peach); }
  .pm .policy-dates { font-size:0.85rem;color:var(--warm-gray); }
  .pm .policy-content { max-width:780px;margin:0 auto;padding:4rem 2rem 6rem; }
  .pm .policy-intro { background:var(--cream-dark);border-left:4px solid var(--copper);padding:2rem 2.5rem;margin-bottom:3rem;font-size:1rem;color:var(--charcoal);line-height:1.85; }
  .pm .policy-section { margin-bottom:3rem;padding-bottom:3rem;border-bottom:1px solid rgba(181,101,29,0.1); }
  .pm .policy-section:last-of-type { border-bottom:none; }
  .pm .section-heading { font-family:'Playfair Display',serif;font-size:1.4rem;font-weight:700;color:var(--copper);margin-bottom:1rem;display:flex;align-items:center;gap:0.8rem; }
  .pm .section-heading::after { content:'';flex:1;height:1px;background:linear-gradient(to right,rgba(181,101,29,0.3),transparent); }
  .pm .sub-heading { font-size:1rem;font-weight:600;color:var(--charcoal);margin:1.5rem 0 0.6rem; }
  .pm .policy-section p { font-size:0.95rem;color:var(--charcoal);line-height:1.85;margin-bottom:0.8rem; }
  .pm .policy-section p em { font-style:italic;color:var(--warm-gray);font-size:0.9rem; }
  .pm .policy-section p strong { font-weight:600;color:var(--charcoal); }
  .pm .policy-list { list-style:none;margin:0.8rem 0 1rem;display:flex;flex-direction:column;gap:0.5rem;padding:0; }
  .pm .policy-list li { font-size:0.92rem;color:var(--charcoal);display:flex;align-items:flex-start;gap:0.8rem;line-height:1.7; }
  .pm .policy-list li::before { content:'—';color:var(--copper);font-weight:700;flex-shrink:0;margin-top:0.05rem; }
  .pm .contact-box { background:var(--charcoal);padding:2.5rem;margin-top:1.5rem;position:relative;overflow:hidden; }
  .pm .contact-box::before { content:'';position:absolute;top:0;left:0;width:4px;height:100%;background:linear-gradient(to bottom,var(--copper),var(--peach)); }
  .pm .contact-box p { color:rgba(253,246,238,0.8)!important;font-size:0.9rem!important;margin-bottom:0.4rem!important; }
  .pm .contact-box strong { color:var(--peach)!important; }
  .pm .contact-box a { color:var(--copper);text-decoration:none; }
  .pm .contact-box a:hover { color:var(--peach);text-decoration:underline; }
  .pm .important-note { background:rgba(181,101,29,0.06);border:1px solid rgba(181,101,29,0.2);padding:1.2rem 1.5rem;margin-top:1rem;font-size:0.88rem!important;color:var(--warm-gray)!important;font-style:italic; }
  .pm footer { background:var(--dark-brown);border-top:1px solid rgba(181,101,29,0.15);padding:2rem 3rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem; }
  .pm .footer-logo { font-family:'Playfair Display',serif;font-size:1rem;color:var(--peach);font-style:italic; }
  .pm .footer-tagline { font-size:0.75rem;color:var(--warm-gray); }
  @media(max-width:640px){
    .pm header{padding:1.2rem 1.5rem;}
    .pm .policy-content{padding:3rem 1.5rem 4rem;}
    .pm .policy-intro{padding:1.5rem;}
    .pm footer{flex-direction:column;text-align:center;padding:1.5rem;}
  }
</style>

<div class="pm">
  <header>
    <img src="/catalyst-mom-logo.png" alt="Catalyst Mom" style="height: 32px; width: auto;" />
    <a href="/" class="back-btn">Back to Assessment</a>
  </header>

  <div class="policy-hero">
    <div class="policy-hero-inner">
      <div class="policy-eyebrow">Legal</div>
      <h1 class="policy-title">Privacy <em>Policy</em></h1>
      <p class="policy-dates">Effective Date: April 22, 2026 &nbsp;&middot;&nbsp; Last Updated: April 22, 2026</p>
    </div>
  </div>

  <div class="policy-content">

    <div class="policy-intro">
      Welcome to Catalyst Mom. We are committed to protecting your privacy and handling your personal information with care, transparency, and respect. This Privacy Policy explains how we collect, use, store, and protect your information when you use the Catalyst Mom app and assessment website (collectively, the "Platform").
      <br><br>
      By using our Platform, you agree to the terms of this Privacy Policy. If you do not agree, please do not use our services.
    </div>

    <div class="policy-section">
      <h2 class="section-heading">1. Who We Are</h2>
      <p>Catalyst Mom is a maternal wellness platform designed to support women through every stage of motherhood &mdash; Trying to Conceive (TTC), Pregnancy, and Postpartum recovery.</p>
      <ul class="policy-list" style="margin-top:1rem;">
        <li><strong>App:</strong> catalystmomofficial.com</li>
        <li><strong>Assessment:</strong> catalystmom.online</li>
        <li><strong>Contact:</strong> admin@catalystmom.online</li>
      </ul>
    </div>

    <div class="policy-section">
      <h2 class="section-heading">2. Information We Collect</h2>
      <p>We collect the following types of information:</p>
      <p class="sub-heading">2.1 Information You Provide Directly</p>
      <ul class="policy-list">
        <li>Name and email address when you create an account or complete the assessment</li>
        <li>Motherhood stage selection (TTC, Pregnancy, or Postpartum)</li>
        <li>Health and wellness information you voluntarily enter (mood, sleep, symptoms, measurements)</li>
        <li>Payment information processed securely through Stripe &mdash; we do not store card details</li>
        <li>Messages and content posted in community groups</li>
        <li>Responses to assessments and questionnaires</li>
        <li>Communications with our support team</li>
      </ul>
      <p class="sub-heading">2.2 Information Collected Automatically</p>
      <ul class="policy-list">
        <li>Device type, browser, and operating system</li>
        <li>IP address and approximate location</li>
        <li>Pages visited, features used, and time spent on the Platform</li>
        <li>Push notification preferences and interaction data</li>
        <li>Cookies and similar tracking technologies</li>
      </ul>
      <p class="sub-heading">2.3 Information from Third Parties</p>
      <ul class="policy-list">
        <li>If you sign in with Google, we receive your name and email address from Google</li>
        <li>Payment status and transaction confirmation from Stripe</li>
        <li>Email engagement data from Omnisend and Resend</li>
      </ul>
    </div>

    <div class="policy-section">
      <h2 class="section-heading">3. How We Use Your Information</h2>
      <p>We use your information to:</p>
      <ul class="policy-list">
        <li>Create and manage your account</li>
        <li>Personalise your experience based on your motherhood stage</li>
        <li>Deliver workout programs, meal plans, wellness content, and expert resources</li>
        <li>Process payments and manage subscriptions</li>
        <li>Send you push notifications, reminders, and program updates (with your consent)</li>
        <li>Send transactional and marketing emails (you can unsubscribe at any time)</li>
        <li>Improve our Platform through analytics and user feedback</li>
        <li>Respond to your questions and support requests</li>
        <li>Comply with legal obligations</li>
      </ul>
    </div>

    <div class="policy-section">
      <h2 class="section-heading">4. Sensitive Health Information</h2>
      <p>Catalyst Mom is a wellness platform. Some information you share with us &mdash; such as postpartum symptoms, cycle data, pregnancy details, and physical measurements &mdash; is sensitive in nature.</p>
      <p>We treat all health-related information with the highest level of care. We do not sell this information. We do not share it with third parties for advertising purposes. We use it solely to personalise your experience on the Platform.</p>
      <p class="important-note">Catalyst Mom provides wellness information for educational purposes only and is not a substitute for professional medical advice.</p>
    </div>

    <div class="policy-section">
      <h2 class="section-heading">5. How We Share Your Information</h2>
      <p>We do not sell your personal data. We may share your information only in the following circumstances:</p>
      <p class="sub-heading">5.1 Service Providers</p>
      <p>We work with trusted third-party providers who help us operate the Platform:</p>
      <ul class="policy-list">
        <li><strong>Supabase</strong> &mdash; database, authentication, and backend infrastructure</li>
        <li><strong>Stripe</strong> &mdash; payment processing</li>
        <li><strong>Omnisend / Resend</strong> &mdash; email communication</li>
        <li><strong>Firebase</strong> &mdash; push notifications</li>
      </ul>
      <p>All service providers are contractually required to protect your data and use it only for the purposes we specify.</p>
      <p class="sub-heading">5.2 Community Content</p>
      <p>Content you post in community groups is visible to other members of that group. Please do not share sensitive personal information in public community spaces.</p>
      <p class="sub-heading">5.3 Legal Requirements</p>
      <p>We may disclose your information if required by law, court order, or to protect the rights and safety of our users or the public.</p>
    </div>

    <div class="policy-section">
      <h2 class="section-heading">6. Cookies and Tracking</h2>
      <p>We use cookies and similar technologies to:</p>
      <ul class="policy-list">
        <li>Keep you logged in to your account</li>
        <li>Remember your preferences</li>
        <li>Analyse how the Platform is used</li>
        <li>Improve performance and user experience</li>
      </ul>
      <p>You can control cookie settings through your browser. Note that disabling cookies may affect some features of the Platform.</p>
    </div>

    <div class="policy-section">
      <h2 class="section-heading">7. Push Notifications</h2>
      <p>If you install the Catalyst Mom app on your device and grant permission, we may send you push notifications including workout reminders, program updates, community alerts, and wellness check-ins.</p>
      <p>You can turn off push notifications at any time through your device settings or within the app.</p>
    </div>

    <div class="policy-section">
      <h2 class="section-heading">8. Data Retention</h2>
      <p>We retain your personal information for as long as your account is active or as needed to provide our services. If you delete your account, we will delete your personal data within 30 days, except where we are required to retain it by law.</p>
      <p>Anonymous and aggregated data that cannot identify you may be retained indefinitely for analytics purposes.</p>
    </div>

    <div class="policy-section">
      <h2 class="section-heading">9. Data Security</h2>
      <p>We take the security of your data seriously. We implement industry-standard measures including:</p>
      <ul class="policy-list">
        <li>Encrypted data transmission (HTTPS/TLS)</li>
        <li>Secure authentication through Supabase</li>
        <li>Access controls limiting who can view your data</li>
        <li>Regular security reviews</li>
      </ul>
      <p>No system is 100% secure. While we work hard to protect your information, we cannot guarantee absolute security. If you believe your account has been compromised, please contact us immediately.</p>
    </div>

    <div class="policy-section">
      <h2 class="section-heading">10. Your Rights</h2>
      <p>Depending on where you are located, you may have the following rights regarding your personal data:</p>
      <ul class="policy-list">
        <li><strong>Access</strong> &mdash; request a copy of the personal data we hold about you</li>
        <li><strong>Correction</strong> &mdash; request that we correct inaccurate or incomplete data</li>
        <li><strong>Deletion</strong> &mdash; request that we delete your personal data</li>
        <li><strong>Portability</strong> &mdash; request your data in a machine-readable format</li>
        <li><strong>Objection</strong> &mdash; object to certain types of processing</li>
        <li><strong>Withdrawal of consent</strong> &mdash; withdraw consent for marketing communications at any time</li>
      </ul>
      <p>To exercise any of these rights, please contact us at admin@catalystmom.online. We will respond within 30 days.</p>
    </div>

    <div class="policy-section">
      <h2 class="section-heading">11. Children's Privacy</h2>
      <p>Catalyst Mom is designed for adult women navigating motherhood. Our Platform is not intended for children under the age of 18. We do not knowingly collect personal information from anyone under 18. If we become aware that a child under 18 has provided us with personal information, we will delete it immediately.</p>
    </div>

    <div class="policy-section">
      <h2 class="section-heading">12. International Users</h2>
      <p>Catalyst Mom is operated globally. If you are accessing our Platform from outside the country where our servers are located, please be aware that your information may be transferred to and processed in different countries. By using our Platform, you consent to this transfer.</p>
      <p>If you are located in the European Economic Area (EEA) or the United Kingdom, we process your data in accordance with the General Data Protection Regulation (GDPR). If you are located in California, we comply with the California Consumer Privacy Act (CCPA).</p>
    </div>

    <div class="policy-section">
      <h2 class="section-heading">13. Third-Party Links</h2>
      <p>Our Platform may contain links to third-party websites or services. We are not responsible for the privacy practices of those third parties. We encourage you to review their privacy policies before providing any information.</p>
    </div>

    <div class="policy-section">
      <h2 class="section-heading">14. Changes to This Privacy Policy</h2>
      <p>We may update this Privacy Policy from time to time. When we make significant changes, we will notify you by email or through a notice on the Platform. Your continued use of the Platform after changes are posted constitutes your acceptance of the updated policy.</p>
      <p>We encourage you to review this policy periodically.</p>
    </div>

    <div class="policy-section">
      <h2 class="section-heading">15. Contact Us</h2>
      <p>If you have any questions, concerns, or requests regarding this Privacy Policy or how we handle your data, please contact us:</p>
      <div class="contact-box">
        <p><strong>Catalyst Mom</strong></p>
        <p>Email: <a href="mailto:admin@catalystmom.online">admin@catalystmom.online</a></p>
        <p>App: catalystmomofficial.com</p>
        <p>Assessment: catalystmom.online</p>
        <br>
        <p>We are committed to resolving any concerns you have about your privacy promptly and transparently.</p>
      </div>
    </div>

  </div>

  <footer>
    <div class="footer-logo">Catalyst Mom</div>
    <div class="footer-tagline">Built from love. For every mama on the journey.</div>
    <div class="footer-tagline">&copy; 2026 Catalyst Mom. All Rights Reserved.</div>
  </footer>
</div>
`

export default function PrivacyPolicyPage() {
  return <div dangerouslySetInnerHTML={{ __html: privacyHtml }} />
}
