import { supabaseBrowserClient } from './supabase/client';
import { Project, ProjectStage } from '@/types';

export const createProject = async (
  project: {
    name: string;
    industry: string;
    description: string;
    stage: ProjectStage;
  },
  userId: string | undefined
) => {
  if (!userId) {
    console.error('User ID not provided to createProject function.');
    return null;
  }

  const newProject = {
    ...project,
    user_id: userId,
    locked: true,
  };

  const { data, error } = await supabaseBrowserClient
    .from('projects')
    .insert([newProject])
    .select();

  if (error) {
    console.error('Error creating project:', error);
    return null;
  }

  return data ? data[0] : null;
};
