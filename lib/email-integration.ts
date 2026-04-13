// This handles email capture and tagging for segmentation

export interface EmailData {
  email: string
  name: string
  score: number
  scoreTier: "low" | "medium" | "high"
  weeksPostpartum: string
  primaryGoal: string
  biggestObstacle: string
  supportPreference: string
  dietaryRestrictions: string
}

export const sendToEmailPlatform = async (data: EmailData) => {
  try {
    // Send to your email platform (Mailchimp, ConvertKit, etc.)
    // This is a placeholder - configure with your actual email service
    const response = await fetch("/api/email-subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: data.email,
        name: data.name,
        tags: generateEmailTags(data),
        metadata: {
          score: data.score,
          scoreTier: data.scoreTier,
          weeksPostpartum: data.weeksPostpartum,
          primaryGoal: data.primaryGoal,
          biggestObstacle: data.biggestObstacle,
          supportPreference: data.supportPreference,
          dietaryRestrictions: data.dietaryRestrictions,
        },
      }),
    })

    if (!response.ok) {
      console.error("[v0] Email subscription failed:", await response.text())
    }
  } catch (error) {
    console.error("[v0] Error sending to email platform:", error)
  }
}

const generateEmailTags = (data: EmailData): string[] => {
  const tags = [
    "postpartum_quiz_complete",
    `postpartum_score_${data.scoreTier}`,
    `postpartum_stage_${data.weeksPostpartum}`,
    `goal_${data.primaryGoal}`,
    `obstacle_${data.biggestObstacle}`,
    `support_pref_${data.supportPreference}`,
  ]

  if (data.dietaryRestrictions && data.dietaryRestrictions !== "none") {
    tags.push(`dietary_${data.dietaryRestrictions}`)
  }

  return tags
}
