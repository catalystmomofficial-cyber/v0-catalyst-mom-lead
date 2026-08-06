import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_ANON_KEY || ''
)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const {
      user_name,
      primary_goal,
      score,
      tier,
      user_concern,
      medical_clearance,
      diastasis_recti,
      pelvic_floor,
      nutrition_protein,
    } = body

    // Validate required fields
    if (!user_name || !primary_goal || score === undefined || !tier) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Insert the assessment
    const { data, error } = await supabase
      .from('postpartum_assessments')
      .insert([
        {
          user_name,
          primary_goal,
          score: parseInt(score),
          tier,
          user_concern: user_concern || null,
          medical_clearance: medical_clearance || null,
          diastasis_recti: diastasis_recti || null,
          pelvic_floor: pelvic_floor || null,
          nutrition_protein: nutrition_protein || null,
        },
      ])
      .select()

    if (error) {
      console.error('[v0] Supabase insert error:', error)
      return Response.json(
        { error: 'Failed to save assessment' },
        { status: 500 }
      )
    }

    return Response.json({ success: true, data }, { status: 201 })
  } catch (error) {
    console.error('[v0] Assessment API error:', error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// The unauthenticated GET handler that used to live here has been removed.
//
// It ran `.select('*')` against the assessments table with no auth check of any
// kind, so `GET /api/assessments?limit=100&offset=0` returned every woman's name, email, score and free-text
// concern to anyone who asked for it. The comment above it said "for
// analytics/admin". There was no admin check, and nothing in this codebase ever
// called it.
//
// If an admin view is needed, it authenticates first and selects the columns it
// needs — never `*`, and never from a route that answers to the public internet.
