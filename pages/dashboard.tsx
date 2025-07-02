"use client";

import React, { useEffect, useState, MouseEvent } from 'react';
import Link from 'next/link';
import { PlusCircle, Loader2, Trash2 } from 'lucide-react';
import { useAuthContext } from '@/supa_database/components/AuthProvider';
import { Button } from '@/components/ui/button';
import { ProjectStage, Project } from '@/types';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useProjects } from '@/supa_database/hooks/useProject';
// import ConfirmationDialog from '@/components/modals/ConfirmationDialog'; // Lazy loaded
import dynamic from 'next/dynamic';
import Head from 'next/head';

const ConfirmationDialog = dynamic(() => import('@/components/modals/ConfirmationDialog'), { ssr: false });

// Project card component for dashboard
const ProjectCard = ({
  id,
  name,
  description,
  stage,
  updatedAt,
  locked,
  onDeleteRequest // Changed from onDeleteClick to onDeleteRequest
}: {
  id: string;
  name: string;
  description: string;
  stage: ProjectStage;
  updatedAt: string | number | Date;
  locked?: boolean;
  onDeleteRequest: (projectId: string, projectName: string) => void; // Updated prop type
}) => {
  // Get stage color and label, aligned with project/[id]/index.tsx
  const stageInfo: Record<ProjectStage, { color: string; label: string; }> = {
    [ProjectStage.IDEA]: { color: 'bg-blue-100 text-blue-800', label: 'Idea' },
    [ProjectStage.PROTOTYPE]: { color: 'bg-purple-100 text-purple-800', label: 'Prototype' },
    [ProjectStage.MVP]: { color: 'bg-green-100 text-green-800', label: 'MVP' },
    [ProjectStage.PRE_SEED]: { color: 'bg-red-100 text-gray-800', label: 'PRE SEED' }, // Kept from original dashboard as not in project page
    [ProjectStage.SEED]: { color: 'bg-yellow-100 text-yellow-800', label: 'SEED' }, // Kept from original dashboard as not in project page
    [ProjectStage.SERIES_A]: { color: 'bg-amber-100 text-amber-800', label: 'SERIES A' },
    [ProjectStage.SERIES_B]: { color: 'bg-indigo-100 text-indigo-800', label: 'SERIES B' },
    [ProjectStage.SERIES_C]: { color: 'bg-teal-100 text-teal-800', label: 'SERIES C' },
  };

  const { color, label } = stageInfo[stage] || { color: 'bg-gray-100 text-gray-800', label: 'UNKNOWN' };
  const formattedDate = new Date(updatedAt).toLocaleDateString();

  const handleDeleteClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); // Prevent Link navigation
    event.stopPropagation(); // Stop event bubbling
    onDeleteRequest(id, name || 'Untitled Project'); // Pass project name as well
  };

  const isLocked = locked || false; // Default to false if not provided

  return (
    <Link href={isLocked ? "#" : `/project/${id}/index_2`} passHref legacyBehavior>
      <a className="block cursor-pointer h-full group"> {/* Removed relative */}
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-5 border border-gray-100 h-full flex flex-col justify-between">
          <div> {/* Content wrapper */}
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-semibold text-gray-900 truncate pr-2">{name || 'Untitled Project'}</h3>
              <span className={`${color} text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap`}>{label}</span>
            </div>
            <p className="text-gray-600 text-sm line-clamp-2 mb-4">{description}</p>
          </div>
          <div className="flex justify-between items-center text-xs text-gray-500 mt-auto">
            <span>Last updated: {formattedDate}</span>
            {/* Delete Icon - now on the bottom right */}
            <button
              type="button"
              onClick={handleDeleteClick}
              className="p-1.5 rounded-full text-red-500 hover:bg-red-100 transition-colors cursor-pointer ml-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
              aria-label={`Delete project ${name || 'Untitled Project'}`}
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </a>
    </Link>
  );
};

export default function Dashboard() {
  const { user } = useAuthContext();
  // Use the useProjects hook
  const { projects: fetchedProjects, loading, error, refetch, deleteProject } = useProjects(user?.id); // Added deleteProject
  const [projects, setProjects] = useState<Project[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    if (fetchedProjects) {
      // Map Supabase project data to the Project type expected by ProjectCard
      const mappedProjects = fetchedProjects.map((p: any) => {
        let mappedStageValue: ProjectStage = ProjectStage.IDEA; // Default to IDEA

        if (p.stage && typeof p.stage === 'string') {
          const dbStageLower = p.stage.toLowerCase();
          // Check if this lowercase db stage value exists in our ProjectStage enum values
          const enumValues = Object.values(ProjectStage) as string[];
          if (enumValues.includes(dbStageLower)) {
            mappedStageValue = dbStageLower as ProjectStage;
          } else {
            console.warn(`Unknown project stage from DB: '${p.stage}', defaulting to IDEA. Expected one of: ${enumValues.join(', ')}`);
          }
        } else if (p.stage) {
          console.warn(`Project stage from DB is not a string: `, p.stage, `Defaulting to IDEA.`);
        }


        return {
          id: p.id,
          userId: p.user_id,
          name: p.name, // Changed from p.title based on user feedback
          description: p.description || '',
          tagline: p.tagline || '',
          industry: p.industry || '',
          locked: p.locked,
          createdAt: p.created_at,
          updatedAt: p.updated_at,
          stage: mappedStageValue, // Use the correctly mapped lowercase stage value
          pitch: p.pitch || { problem: '', solution: '', targetMarket: '', businessModel: '', competition: '', uniqueSellingPoint: '', marketingStrategy: '' },
          // locked: p.locked // Assuming 'locked' might come from your data
        };
      });
      setProjects(mappedProjects);
    }
  }, [fetchedProjects]);

  useEffect(() => {
    if (user?.id) {
      refetch();
    }
  }, [user?.id, refetch]);

  const handleDeleteRequest = (projectId: string, projectName: string) => {
    setProjectToDelete({ id: projectId, name: projectName });
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (projectToDelete) {
      await deleteProject(projectToDelete.id);
      // Optionally, refetch projects or filter out the deleted project locally
      // refetch(); // Or setProjects(projects.filter(p => p.id !== projectToDelete.id));
      setProjectToDelete(null);
      setShowDeleteConfirm(false);
    }
  };

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
          <h2 className="text-2xl font-bold mb-4">Please Log In</h2>
          <p className="mb-6 text-center">You need to be logged in to view your dashboard.</p>
          <Button asChild>
            <Link href="/auth">Log In</Link> {/* Changed from /login to /auth based on file structure */}
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          <p className="mt-4 text-lg text-gray-700">Loading your projects...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-4 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-red-700">Error Loading Projects</h2>
          <p className="mb-6 text-center text-red-600">{error}</p>
          <Button onClick={() => refetch()} className="bg-red-600 hover:bg-red-700 text-white">
            Try Again
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
    <><Head>
      <title>Dashboard | NexTraction</title>
      <meta name="description" content="Manage and track your business ideas and projects." />
    </Head><DashboardLayout>
        <div className="mx-auto p-4 md:p-6 max-w-7xl">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Projects</h1>
              <p className="text-gray-600 mt-1">Manage and track your business ideas</p>
            </div>
            {projects.length > 0 && (
              <Button asChild size="lg" className="rounded-full bg-blue-700 text-white hover:bg-blue-800 transition-colors">
                <Link href="/wizard" className="flex items-center">
                  <PlusCircle className="mr-2 h-5 w-5" />
                  New Project
                </Link>
              </Button>
            )}
          </div>

          {projects.length === 0 ? (
            <div className="w-fit mx-auto flex flex-col items-center justify-center text-center border-gray-200 rounded-lg p-10 md:p-20 lg:p-40 min-h-[50vh] md:min-h-[60vh]">
              <h3 className="font-semibold text-2xl md:text-3xl mb-4">No projects yet</h3>
              <p className="text-gray-600 mb-8 max-w-md">Get started by creating your first project. Let's bring your idea to life.</p>
              <Button asChild size="lg" className="bg-blue-600 text-white hover:bg-blue-700">
                {/* Assuming /project/creation/wizard is the correct path for the wizard */}
                <Link href="/wizard" className="flex items-center">
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Create Project
                </Link>
              </Button>
            </div>
          ) : (
            <>
              {/* Recent Projects */}
              {sortedProjects.length > 0 && (
                <div className="mb-10">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Projects</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sortedProjects.slice(0, 3).map((project) => (
                      <ProjectCard
                        key={project.id}
                        id={project.id}
                        name={project.name}
                        description={project.description}
                        stage={project.stage}
                        updatedAt={project.updatedAt.toString()}
                        onDeleteRequest={handleDeleteRequest} // Pass new handler
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Projects by Stage */}
              {Object.entries(projectsByStage).map(([stage, stageProjects]) => {
                if (stageProjects.length === 0) return null;

                const stageLabels = {
                  [ProjectStage.IDEA]: "Idea Stage",
                  [ProjectStage.SERIES_A]: "Series A Stage",
                  [ProjectStage.SERIES_B]: "Series B Stage",
                  [ProjectStage.SERIES_C]: "Series C Stage",
                  [ProjectStage.PRE_SEED]: "Pre-Seed Stage",
                  [ProjectStage.SEED]: "Seed Stage",
                  [ProjectStage.PROTOTYPE]: "Prototype Stage",
                  [ProjectStage.MVP]: "MVP Stage",
                };

                return (
                  <div key={stage} className="mb-10">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">{stageLabels[stage as ProjectStage]}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {stageProjects.map((project) => (
                        <ProjectCard
                          key={project.id}
                          id={project.id}
                          name={project.name}
                          description={project.description}
                          stage={project.stage}
                          updatedAt={project.updatedAt.toString()}
                          onDeleteRequest={handleDeleteRequest} // Pass new handler
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
              {/* Fallback if all categories are empty but projects array is not (e.g. stage mismatch) */}
              {sortedProjects.length > 0 && Object.values(projectsByStage).every(arr => arr.length === 0) && (
                <div className="mb-10">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">All Projects</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sortedProjects.map((project) => (
                      <ProjectCard
                        key={project.id}
                        id={project.id}
                        name={project.name}
                        description={project.description}
                        stage={project.stage}
                        updatedAt={project.updatedAt.toString()}
                        onDeleteRequest={handleDeleteRequest} // Pass new handler
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Confirmation Dialog for Deletion */}
        {projectToDelete && (
          <ConfirmationDialog
            isOpen={showDeleteConfirm}
            onClose={() => {
              setShowDeleteConfirm(false);
              setProjectToDelete(null);
            } }
            onConfirm={handleConfirmDelete}
            title={`Delete Project: ${projectToDelete.name}`}
            description="Are you sure you want to delete this project? This action cannot be undone and all associated data will be lost."
            confirmButtonText="Delete"
            confirmButtonClassName="bg-red-600 hover:bg-red-700 text-white" />
        )}
      </DashboardLayout></>
  );
}
