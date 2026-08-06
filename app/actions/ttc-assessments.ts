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

// The `get…Assessments` server action that used to live here has been removed.
//
// It selected `*` from the assessments table with no auth check. Server actions
// compile to callable POST endpoints whether or not the app ever calls them, so
// this was a second way to read every woman's assessment — same data, different
// door. Nothing in this codebase called it.
