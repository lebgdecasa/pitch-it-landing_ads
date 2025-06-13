// supa_database/hooks/useProjects.ts
import { useState, useEffect, useCallback } from 'react' // Added useCallback
import { supabase } from '../config/supabase'
import { Project } from '../types/database'

export const useProjects = (userId?: string) => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProjects = useCallback(async () => { // Wrapped in useCallback
    if (!userId) { // Added a guard to prevent fetching if userId is not available
      setProjects([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })

      if (error) throw error
      setProjects(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch projects')
    } finally {
      setLoading(false)
    }
  }, [userId]); // Added userId to dependency array

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects]) // Now depends on the memoized fetchProjects

  const createProject = async (projectData: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert(projectData)
        .select()
        .single()

      if (error) throw error
      setProjects(prev => [data, ...prev])
      return { data, error: null }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to create project'
      setError(errorMsg)
      return { data: null, error: errorMsg }
    }
  }

  const updateProject = async (id: string, updates: Partial<Project>) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      setProjects(prev => prev.map(p => p.id === id ? data : p))
      return { data, error: null }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to update project'
      setError(errorMsg)
      return { data: null, error: errorMsg }
    }
  }

  const deleteProject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)

      if (error) throw error
      setProjects(prev => prev.filter(p => p.id !== id))
      return { error: null }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete project'
      setError(errorMsg)
      return { error: errorMsg }
    }
  }

  return {
    projects,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
    refetch: fetchProjects
  }
}

export const useProjectById = (projectId: string | undefined) => {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjectById = async () => {
    if (!projectId) {
      setProject(null);
      setLoading(false);
      setError(null); // Clear error if no projectId
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .maybeSingle(); // Changed from .single() to .maybeSingle()

      if (fetchError) {
        // Log the specific error code and message for better debugging
        console.error(`Supabase fetch error: ${fetchError.code} - ${fetchError.message}`, fetchError);
        // PGRST116 is "The result contains 0 rows"
        // PGRST100 is "Not a single item selected" (can happen with .single() if RLS blocks)
        // A 406 error might present differently, so we catch generic fetchError too.
        if (fetchError.code === 'PGRST116') {
          setError('Project not found or access denied.');
        } else {
          setError(fetchError.message || 'Failed to fetch project.');
        }
        setProject(null);
      } else if (!data) {
        // If maybeSingle() returns null data and no error, it means no row was found.
        setError('Project not found or access denied.');
        setProject(null);
      } else {
        setProject(data);
      }
    } catch (err) {
      console.error("Error fetching project by ID:", err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred while fetching the project.');
      setProject(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectById();
  }, [projectId]);

  return {
    project,
    loading,
    error,
    refetchProject: fetchProjectById,
  };
};
