'use server'

import { createClient } from '@/lib/supabase/server'

export async function savePregnancyAssessment(data: any) {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from('pregnancy_assessments')
      .insert([data])

    if (error) {
      console.error('[v0] Save pregnancy assessment error:', error)
      throw new Error(error.message)
    }

    console.log('[v0] Pregnancy assessment saved successfully')
    return { success: true }
  } catch (error) {
    console.error('[v0] Save pregnancy assessment exception:', error)
    throw error
  }
}

export async function getPregnancyAssessments(email?: string) {
  try {
    const supabase = await createClient()

    let query = supabase.from('pregnancy_assessments').select('*')
    
    if (email) {
      query = query.eq('email', email)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error('[v0] Fetch pregnancy assessments error:', error)
      throw new Error(error.message)
    }

    return data
  } catch (error) {
    console.error('[v0] Fetch pregnancy assessments exception:', error)
    throw error
  }
}
