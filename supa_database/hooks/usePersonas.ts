// supa_database/hooks/usePersonas.ts
import { useState, useEffect } from 'react'
import { supabase } from '../config/supabase'
import { Persona } from '../types/database'

export const usePersonas = (projectId?: string) => {
  const [personas, setPersonas] = useState<Persona[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (projectId) {
      fetchPersonas()
    }
  }, [projectId])

  const fetchPersonas = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('personas')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setPersonas(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch personas')
    } finally {
      setLoading(false)
    }
  }

  const createPersona = async (personaData: Omit<Persona, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('personas')
        .insert(personaData)
        .select()
        .single()

      if (error) throw error
      setPersonas(prev => [data, ...prev])
      return { data, error: null }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to create persona'
      setError(errorMsg)
      return { data: null, error: errorMsg }
    }
  }

  const updatePersona = async (id: string, updates: Partial<Persona>) => {
    try {
      const { data, error } = await supabase
        .from('personas')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      setPersonas(prev => prev.map(p => p.id === id ? data : p))
      return { data, error: null }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to update persona'
      setError(errorMsg)
      return { data: null, error: errorMsg }
    }
  }

  const deletePersona = async (id: string) => {
    try {
      const { error } = await supabase
        .from('personas')
        .delete()
        .eq('id', id)

      if (error) throw error
      setPersonas(prev => prev.filter(p => p.id !== id))
      return { error: null }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete persona'
      setError(errorMsg)
      return { error: errorMsg }
    }
  }

  return {
    personas,
    loading,
    error,
    createPersona,
    updatePersona,
    deletePersona,
    refetch: fetchPersonas
  }
}
