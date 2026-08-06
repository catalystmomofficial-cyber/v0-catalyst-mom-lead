import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const supabase = await createClient()

    const { error } = await supabase
      .from('ttc_assessments')
      .insert([data])

    if (error) {
      console.error('[v0] TTC assessment insert error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] TTC assessment API error:', error)
    return NextResponse.json({ error: 'Failed to save assessment' }, { status: 500 })
  }
}

// The unauthenticated GET handler that used to live here has been removed.
//
// It ran `.select('*')` against the assessments table with no auth check of any
// kind, so `GET /api/ttc-assessments` returned every woman's name, email, score and free-text
// concern to anyone who asked for it. The comment above it said "for
// analytics/admin". There was no admin check, and nothing in this codebase ever
// called it.
//
// If an admin view is needed, it authenticates first and selects the columns it
// needs — never `*`, and never from a route that answers to the public internet.
