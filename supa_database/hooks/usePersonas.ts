// supa_database/hooks/usePersonas.ts
import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { Persona } from '../types/database';

export function usePersonas(projectId: string | undefined) {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) {
      setLoading(false);
      return;
    }

    async function fetchPersonas() {
      try {
        const { data, error } = await supabase
          .from('personas')
          .select('*')
          .eq('project_id', projectId)
          .order('created_at', { ascending: true });

        if (error) throw error;
        setPersonas(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch personas');
      } finally {
        setLoading(false);
      }
    }

    fetchPersonas();
  }, [projectId]);

  return { personas, loading, error };
}
