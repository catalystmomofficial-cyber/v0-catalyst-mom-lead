import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { stage, name, email, score, tier } = await request.json()

    // Generate PDF content based on stage
    const guideContent = generateGuideContent(stage, name, score, tier)

    // Return PDF data
    return NextResponse.json({
      success: true,
      downloadUrl: `/guides/${stage}-recovery-guide.pdf`,
      guideContent,
    })
  } catch (error) {
    console.error("[v0] Error generating guide:", error)
    return NextResponse.json({ success: false, error: "Failed to generate guide" }, { status: 500 })
  }
}

function generateGuideContent(stage: string, name: string, score: number, tier: string) {
  const guides = {
    postpartum: {
      title: "Postpartum Recovery Guide",
      subtitle: "Your Roadmap to Healing & Thriving After Baby",
      sections: [
        {
          title: "Your Recovery Timeline",
          content: [
            "Weeks 0-6: Focus on rest, gentle movement, and bonding",
            "Weeks 6-12: Begin core-safe exercises with medical clearance",
            "Months 3-6: Progressive strength training and cardio",
            "Months 6-12: Advanced training and goal-specific programming",
            "12+ Months: Maintenance and optimization",
          ],
        },
        {
          title: "Core-Safe Movements",
          content: [
            "✅ DO: Diaphragmatic breathing, pelvic tilts, bird dogs",
            "✅ DO: Modified planks (wall or incline), dead bugs",
            "✅ DO: Glute bridges, squats with proper form",
            "❌ AVOID: Crunches, sit-ups, full planks (until cleared)",
            "❌ AVOID: Heavy lifting without core engagement",
          ],
        },
        {
          title: "Nutrition for Healing",
          content: [
            "🥩 Protein: 80-100g daily (healing, milk production, energy)",
            "💧 Hydration: 10+ glasses if breastfeeding",
            "🥬 Iron-rich foods: Spinach, red meat, lentils",
            "🥑 Healthy fats: Avocado, nuts, salmon (brain health)",
            "🍊 Vitamin C: Citrus, berries (tissue repair)",
          ],
        },
        {
          title: "When to Seek Help",
          content: [
            "🚨 Severe abdominal separation (3+ finger gap)",
            "🚨 Pelvic pain or incontinence beyond 12 weeks",
            "🚨 Persistent exhaustion despite rest",
            "🚨 Postpartum depression or anxiety symptoms",
          ],
        },
        {
          title: "Next Steps",
          content: [
            "📱 Join the Catalyst Mom community for support",
            "📅 Schedule your 6-week postpartum checkup",
            "📝 Track your progress with our app",
            "💪 Start with 10-minute daily movement",
          ],
        },
      ],
    },
    ttc: {
      title: "TTC Wellness Guide",
      subtitle: "Optimize Your Body for Conception",
      sections: [
        {
          title: "Your Fertility Timeline",
          content: [
            "Month 1-3: Foundation building (nutrition, exercise, stress)",
            "Month 3-6: Optimization phase (cycle tracking, supplements)",
            "Month 6-12: Advanced strategies (medical consultation if needed)",
            "12+ Months: Fertility specialist consultation recommended",
          ],
        },
        {
          title: "Fertility-Boosting Exercises",
          content: [
            "✅ Moderate cardio (30 min, 3-4x/week)",
            "✅ Strength training (builds hormone balance)",
            "✅ Yoga and stretching (reduces stress)",
            "❌ AVOID: Excessive high-intensity training",
            "❌ AVOID: Overtraining (can disrupt cycles)",
          ],
        },
        {
          title: "Nutrition for Conception",
          content: [
            "🥚 Folate: Leafy greens, fortified grains",
            "🐟 Omega-3s: Salmon, walnuts, chia seeds",
            "🥩 Iron: Red meat, spinach, lentils",
            "🥛 Calcium: Dairy, fortified plant milk",
            "🌰 Zinc: Nuts, seeds, whole grains",
          ],
        },
        {
          title: "Lifestyle Factors",
          content: [
            "😴 Sleep: 7-9 hours nightly (hormone regulation)",
            "🧘 Stress: Daily relaxation practice",
            "🚭 Avoid: Smoking, excessive alcohol, caffeine",
            "💊 Supplements: Prenatal vitamins, CoQ10 (consult doctor)",
          ],
        },
        {
          title: "Next Steps",
          content: [
            "📱 Track your cycle with our app",
            "📅 Schedule preconception checkup",
            "📝 Start fertility-focused meal plans",
            "💪 Begin fertility-optimized workouts",
          ],
        },
      ],
    },
    pregnancy: {
      title: "Pregnancy Wellness Guide",
      subtitle: "Stay Strong & Healthy Throughout Your Journey",
      sections: [
        {
          title: "Trimester-by-Trimester Guide",
          content: [
            "First Trimester: Focus on nausea management, gentle movement",
            "Second Trimester: Energy returns - build strength safely",
            "Third Trimester: Prepare for labor, maintain mobility",
          ],
        },
        {
          title: "Pregnancy-Safe Exercises",
          content: [
            "✅ Walking, swimming, prenatal yoga",
            "✅ Modified strength training (lighter weights)",
            "✅ Pelvic floor exercises (Kegels)",
            "❌ AVOID: Contact sports, high-impact activities",
            "❌ AVOID: Lying flat on back after 20 weeks",
          ],
        },
        {
          title: "Nutrition for Pregnancy",
          content: [
            "🥬 Folate: Prevents neural tube defects",
            "🥛 Calcium: 1000mg daily (baby's bones)",
            "🥩 Iron: 27mg daily (blood volume increase)",
            "🐟 DHA: Brain development (low-mercury fish)",
            "💧 Hydration: 10+ glasses daily",
          ],
        },
        {
          title: "Warning Signs",
          content: [
            "🚨 Severe abdominal pain or cramping",
            "🚨 Vaginal bleeding or fluid leakage",
            "🚨 Severe headaches or vision changes",
            "🚨 Decreased fetal movement",
          ],
        },
        {
          title: "Next Steps",
          content: [
            "📱 Join our pregnancy support community",
            "📅 Schedule regular prenatal appointments",
            "📝 Start pregnancy-safe meal plans",
            "💪 Begin trimester-specific workouts",
          ],
        },
      ],
    },
  }

  return guides[stage as keyof typeof guides] || guides.postpartum
}
