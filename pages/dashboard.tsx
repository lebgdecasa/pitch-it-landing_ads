"use client";

import React from 'react';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { useAuthContext } from '@/supa_database/components/AuthProvider';
import { Button } from '@/components/ui/button';
import { ProjectStage } from '@/types';
import DashboardLayout from '@/components/layout/DashboardLayout';

// Project card component for dashboard
const ProjectCard = ({
  id,
  name,
  description,
  stage,
  updatedAt
}: {
  id: string;
  name: string;
  description: string;
  stage: ProjectStage;
  updatedAt: string | number | Date;
  locked?: boolean;
}) => {
  // Get stage color and label
  const stageInfo: Record<ProjectStage, { color: string; label: string; }> = {
    [ProjectStage.IDEA]: { color: 'bg-blue-100 text-blue-800', label: 'IDEA' },
    [ProjectStage.SERIES_A]: { color: 'bg-purple-100 text-purple-800', label: 'SERIES A' },
    [ProjectStage.SERIES_B]: { color: 'bg-amber-100 text-amber-800', label: 'SERIES B' },
    [ProjectStage.SERIES_C]: { color: 'bg-green-100 text-green-800', label: 'SERIES C' },
    [ProjectStage.PROTOTYPE]: {
      color: 'bg-blue-100 text-gray-800',
      label: 'Prototype'
    },
    [ProjectStage.MVP]: {
      color: 'bg-gray-100 text-gray-800',
      label: 'MVP'
    },
    [ProjectStage.PRE_SEED]: {
      color: 'bg-red-100 text-gray-800',
      label: 'PRE SEED'
    },
    [ProjectStage.SEED]: {
      color: 'bg-yellow-100 text-yellow-800',
      label: 'SEED'
    }
  };

  const { color, label } = stageInfo[stage];
  const formattedDate = new Date(updatedAt).toLocaleDateString();

  return (
    <div className={`block `}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-5 border border-gray-100">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
          <span className={`${color} text-xs px-2 py-1 rounded-full font-medium`}>{label}</span>
        </div>
        <p className="text-gray-600 text-sm line-clamp-2 mb-4">{description}</p>
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>Last updated: {formattedDate}</span>
        </div>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const { user } = useAuthContext();
  const [projects, setProjects] = React.useState<any[]>([]);

  React.useEffect(() => {
    // Replace this with your actual fetch logic or supabase call
    async function fetchProjects() {
      if (!user) return;
      // Example: fetch from API or supabase
      // const { data } = await supabase.from('projects').select('*').eq('user_id', user.id);
      // setProjects(data || []);
      setProjects([]); // Placeholder: set your fetched projects here
    }
    fetchProjects();
  }, [user]);

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
          <h2 className="text-2xl font-bold mb-4">Please Log In</h2>
          <p className="mb-6 text-center">You need to be logged in to view your dashboard.</p>
          <Button asChild>
            <Link href="/login">Log In</Link>
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  // Get projects by stage for grouping
  const projectsByStage = {
    [ProjectStage.SERIES_C]: projects.filter(p => p.stage === ProjectStage.SERIES_C),
    [ProjectStage.SERIES_B]: projects.filter(p => p.stage === ProjectStage.SERIES_B),
    [ProjectStage.SERIES_A]: projects.filter(p => p.stage === ProjectStage.SERIES_A),
    [ProjectStage.IDEA]: projects.filter(p => p.stage === ProjectStage.IDEA),
    [ProjectStage.SEED]: projects.filter(p => p.stage === ProjectStage.SEED),
    [ProjectStage.PROTOTYPE]: projects.filter(p => p.stage === ProjectStage.PROTOTYPE),
    [ProjectStage.MVP]: projects.filter(p => p.stage === ProjectStage.MVP),
    [ProjectStage.PRE_SEED]: projects.filter(p => p.stage === ProjectStage.PRE_SEED),
  };

  // Sort projects by updated date (newest first)
  const sortedProjects = [...projects].sort((a, b) =>
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Projects</h1>
            <p className="text-gray-600 mt-1">Manage and track your business ideas</p>
          </div>
          {projects.length > 0 && (
            <Button asChild size="lg" className="rounded-full bg-blue-700 text-white">
              <Link href="/projects/new" className="flex items-center">
                <PlusCircle className="mr-2 h-5 w-5" />
                New Project
              </Link>
            </Button>
          )}
        </div>

        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center bg-gray-50 border border-gray-200 rounded-lg p-40 min-h-[60vh] center *: min-w-[96vw]">
            <h3 className="font-semibold text-3xl mb-4">No projects yet</h3>
            <p className="text-gray-600 mb-8 max-w-md">Get started by creating your first project. Let's bring your idea to life.</p>
            <Button asChild size="lg" className="bg-blue-600 text-white hover:bg-blue-700">
              <Link href="/wizard" className="flex items-center">
                <PlusCircle className="mr-2 h-5 w-5" />
                Create Project
              </Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Recent Projects */}
            <div className="mb-10">
              <h2 className="text-xl font-semibold mb-4">Recent Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedProjects.slice(0, 3).map((project) => (
                  <ProjectCard
                    key={project.id}
                    id={project.id}
                    name={project.name}
                    description={project.description}
                    stage={project.stage}
                    updatedAt={project.updatedAt.toString()}
                    locked={project.locked}
                  />
                ))}
              </div>
            </div>

            {/* Projects by Stage */}
            {Object.entries(projectsByStage).map(([stage, stageProjects]) => {
              if (stageProjects.length === 0) return null;

              const stageLabels = {
                [ProjectStage.IDEA]: "IDEA Stage",
                [ProjectStage.SERIES_A]: "SERIES A Stage",
                [ProjectStage.SERIES_B]: "SERIES B Stage",
                [ProjectStage.SERIES_C]: "SERIES C Stage",
                [ProjectStage.PRE_SEED]: "PRE SEED Stage",
                [ProjectStage.SEED]: "SEED Stage",
                [ProjectStage.PROTOTYPE]: "Prototype Stage",
                [ProjectStage.MVP]: "MVP Stage",
              };

              return (
                <div key={stage} className="mb-10">
                  <h2 className="text-xl font-semibold mb-4">{stageLabels[stage as ProjectStage]}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {stageProjects.map((project) => (
                      <ProjectCard
                        key={project.id}
                        id={project.id}
                        name={project.name}
                        description={project.description}
                        stage={project.stage}
                        updatedAt={project.updatedAt.toString()}
                        locked={project.locked}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
