"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function StageRouter() {
  const stages = [
    {
      id: "ttc",
      title: "Trying to Conceive",
      emoji: "🤰",
      description: "Optimize your fertility and prepare your body for conception",
      href: "/ttc-assessment",
      color: "#A15C2F",
    },
    {
      id: "pregnancy",
      title: "I'm Pregnant",
      emoji: "👶",
      description: "Prepare for a safe, comfortable birth and healthy pregnancy",
      href: "/pregnancy-assessment",
      color: "#A15C2F",
    },
    {
      id: "postpartum",
      title: "I'm Postpartum",
      emoji: "💪",
      description: "Recover, heal your core, and reclaim your strength & energy",
      href: "/postpartum-assessment",
      color: "#A15C2F",
    },
  ]

  return (
    <div className="min-h-screen p-4 sm:p-6" style={{ background: "linear-gradient(135deg, #F8F5F2, #F0E6D2)" }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="flex items-center justify-center mb-6">
            <img src="/catalyst-mom-logo.png" alt="Catalyst Mom" className="h-16 w-16 sm:h-20 sm:w-20" />
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold mb-4 leading-tight px-4" style={{ color: "#A15C2F" }}>
            Your body has been through something extraordinary. Find out where your recovery really stands.
          </h1>

          <p className="text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed px-4 mb-2" style={{ color: "#3A2412" }}>
            Take our free 2-minute assessment designed for your stage. Get your personal Maternal Wellness Score and a roadmap built around where you actually are.
          </p>
        </div>

        {/* Stage Cards */}
        <div className="grid md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {stages.map((stage) => (
            <Link key={stage.id} href={stage.href}>
              <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer h-full bg-white">
                <CardContent className="p-6 sm:p-8 flex flex-col items-center text-center h-full justify-between">
                  <div>
                    <div className="text-5xl sm:text-6xl mb-4">{stage.emoji}</div>
                    <h3 className="text-xl sm:text-2xl font-bold mb-3" style={{ color: "#A15C2F" }}>
                      {stage.title}
                    </h3>
                    <p className="text-base sm:text-lg leading-relaxed mb-6" style={{ color: "#3A2412" }}>
                      {stage.description}
                    </p>
                  </div>

                  <Button
                    className="w-full text-white font-bold py-3 rounded-xl text-base sm:text-lg shadow-lg hover:shadow-xl transition-all"
                    style={{ background: "linear-gradient(135deg, #A15C2F, #C27B48)" }}
                  >
                    Take {stage.title} Quiz →
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Social Proof */}
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-lg sm:text-xl font-semibold mb-8" style={{ color: "#A15C2F" }}>
            After supporting over 2,000 mamas with our digital guides, we built the Catalyst Mom App to take your recovery even deeper.
          </p>

          <div className="grid md:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border-l-4" style={{ borderLeftColor: "#A15C2F" }}>
              <p className="text-sm sm:text-base italic mb-3" style={{ color: "#3A2412" }}>
                &ldquo;I couldn&apos;t sneeze without leaking and my belly still looked 5 months pregnant. Three weeks into this program my core finally feels like mine again. I actually cried during my check-in. Do not sleep on this.&rdquo;
              </p>
              <p className="text-xs sm:text-sm font-semibold" style={{ color: "#A15C2F" }}>
                — Postpartum Mama · Catalyst Mom Community
              </p>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border-l-4" style={{ borderLeftColor: "#A15C2F" }}>
              <p className="text-sm sm:text-base italic mb-3" style={{ color: "#3A2412" }}>
                &ldquo;I had been trying for 8 months and felt completely lost. I didn&apos;t even know my cycle properly — I was just guessing. This program helped me understand what my body was actually doing. Two months in, I finally felt like I had a real plan and not just hope.&rdquo;
              </p>
              <p className="text-xs sm:text-sm font-semibold" style={{ color: "#A15C2F" }}>
                — TTC Mama · Catalyst Mom Community
              </p>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border-l-4" style={{ borderLeftColor: "#A15C2F" }}>
              <p className="text-sm sm:text-base italic mb-3" style={{ color: "#3A2412" }}>
                &ldquo;I was terrified of tearing again after my first birth. I started the birth ball protocol in my third trimester and did the breathing exercises every single day. When labour hit I actually felt prepared. My midwife was shocked at how in control I was — and I didn&apos;t tear at all this time.&rdquo;
              </p>
              <p className="text-xs sm:text-sm font-semibold" style={{ color: "#A15C2F" }}>
                — Pregnancy Mama · Catalyst Mom Community
              </p>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border-l-4" style={{ borderLeftColor: "#A15C2F" }}>
              <p className="text-sm sm:text-base italic mb-3" style={{ color: "#3A2412" }}>
                &ldquo;My second VBAC was completely different. After doing the low-impact exercises throughout my pregnancy, when labour finally kicked in I felt in control the whole way through. I pushed my baby out in 10 minutes. My first VBAC took over an hour of pushing. This program changed everything.&rdquo;
              </p>
              <p className="text-xs sm:text-sm font-semibold" style={{ color: "#A15C2F" }}>
                — VBAC Mama · Catalyst Mom Community
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-8 border-t" style={{ borderTopColor: "#E8D5C4" }}>
          <p className="text-sm sm:text-base" style={{ color: "#3A2412" }}>
            Free personalized assessment • Get your wellness score & roadmap • No credit card required
          </p>
          <p className="text-xs mt-4" style={{ color: "#8A7060" }}>
            <Link href="/privacy-policy" className="underline hover:opacity-70 transition-opacity">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
