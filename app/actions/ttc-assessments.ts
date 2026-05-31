'use server'

import { createClient } from '@/lib/supabase/server'

export async function saveTTCAssessment(data: any) {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from('ttc_assessments')
      .insert([data])

    if (error) {
      console.error('[v0] Save TTC assessment error:', error)
      throw new Error(error.message)
    }

    console.log('[v0] TTC assessment saved successfully')
    return { success: true }
  } catch (error) {
    console.error('[v0] Save TTC assessment exception:', error)
    throw error
  }
}

export async function getTTCAssessments(email?: string) {
  try {
    const supabase = await createClient()

    let query = supabase.from('ttc_assessments').select('*')
    
    if (email) {
      query = query.eq('email', email)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error('[v0] Fetch TTC assessments error:', error)
      throw new Error(error.message)
    }

    return data
  } catch (error) {
    console.error('[v0] Fetch TTC assessments exception:', error)
    throw error
  }
}
