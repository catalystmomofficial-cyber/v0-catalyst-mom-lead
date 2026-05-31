'use server'

export async function saveAssessment({
  user_name,
  primary_goal,
  score,
  tier,
  user_concern,
  medical_clearance,
  diastasis_recti,
  pelvic_floor,
  nutrition_protein,
}: {
  user_name: string
  primary_goal: string
  score: number
  tier: string
  user_concern?: string
  medical_clearance?: number
  diastasis_recti?: number
  pelvic_floor?: number
  nutrition_protein?: number
}) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/assessments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_name,
        primary_goal,
        score,
        tier,
        user_concern,
        medical_clearance,
        diastasis_recti,
        pelvic_floor,
        nutrition_protein,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to save assessment')
    }

    const data = await response.json()
    return { success: true, data: data.data }
  } catch (error) {
    console.error('[v0] Save assessment error:', error)
    throw error
  }
}
