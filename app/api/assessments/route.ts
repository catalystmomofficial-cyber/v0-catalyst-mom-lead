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

// GET endpoint to fetch assessments (for analytics/admin)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') || '100'
    const offset = searchParams.get('offset') || '0'

    const { data, error, count } = await supabase
      .from('postpartum_assessments')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1)

    if (error) {
      console.error('[v0] Supabase query error:', error)
      return Response.json(
        { error: 'Failed to fetch assessments' },
        { status: 500 }
      )
    }

    return Response.json({ data, total: count })
  } catch (error) {
    console.error('[v0] Assessment GET error:', error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
