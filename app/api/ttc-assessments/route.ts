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

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const email = request.nextUrl.searchParams.get('email')

    let query = supabase.from('ttc_assessments').select('*')
    
    if (email) {
      query = query.eq('email', email)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error('[v0] TTC assessment fetch error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('[v0] TTC assessment GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch assessments' }, { status: 500 })
  }
}
