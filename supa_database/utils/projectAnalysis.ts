// supa_database/utils/projectAnalysis.ts
import { supabase } from '../config/supabase'
import { ProjectAnalysis } from '../types/database'

export const createProjectAnalysis = async (
  analysisData: Omit<ProjectAnalysis, 'id' | 'created_at' | 'updated_at'>
) => {
  try {
    const { data, error } = await (supabase as any)
      .from('project_analysis')
      .insert(analysisData)
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Failed to create analysis'
    }
  }
}

export const getProjectAnalysis = async (projectId: string, analysisType?: string) => {
  try {
    let query = supabase
      .from('project_analysis')
      .select('*')
      .eq('project_id', projectId)

    if (analysisType) {
      query = query.eq('analysis_type', analysisType)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) throw error
    return { data, error: null }
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Failed to fetch analysis'
    }
  }
}

export const updateProjectAnalysis = async (
  id: string,
  updates: Partial<ProjectAnalysis>
) => {
  try {
    const { data, error } = await (supabase as any)
      .from('project_analysis')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Failed to update analysis'
    }
  }
}
