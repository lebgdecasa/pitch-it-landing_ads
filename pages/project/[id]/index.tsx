// pages/project/[id]/index.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ChevronLeft, Edit, Download, Users, AlertTriangle, Lightbulb, Briefcase, Swords, Sparkles, Megaphone } from 'lucide-react';
import ProjectLayout from '@/components/layout/ProjectLayout';
import dynamic from 'next/dynamic';
import { preprocessAnalysisData } from '@/utils/analysisPreprocessor';

// Component imports
// import ShareTeamDialog from '../../../components/project/ShareTeamDialog'; // Lazy loaded
const ShareTeamDialog = dynamic(() => import('../../../components/project/ShareTeamDialog'), { ssr: false });
import ActionButtons from '../../../components/project/ActionButtons';
import { AnalysisSection } from '../../../components/project/dashboard/AnalysisSection';
import { MetricsDisplay } from '../../../components/project/dashboard/MetricsDisplay';
import { Button } from '../../../components/ui/button';
import PersonaCard from '../../../components/client-components/persona/PersonaCard';
import PersonaModal from '../../../components/client-components/persona/PersonaModal';
// import { GroupChat } from '../../../components/project/chat/GroupChat'; // Lazy loaded
const GroupChat = dynamic(() => import('../../../components/project/chat/GroupChat').then(mod => mod.GroupChat), { ssr: false });

// Supabase imports
import { useProjects, useProjectById } from '../../../supa_database/hooks/useProject';
import { usePersonas } from '../../../supa_database/hooks/usePersonas';
import { supabase } from '../../../supa_database/config/supabase'; // Ensure Supabase client is imported
import { useAuthContext } from '../../../supa_database/components/AuthProvider'; // Import useAuthContext
import Head from 'next/dist/shared/lib/head';

// Type definitions
interface StageInfo {
  [key: string]: {
    color: string;
    label: string;
    description: string;
  };
}

const PitchDetail = ({ label, value, icon: Icon, color }: {
  label: string;
  value: string;
  icon?: React.ElementType;
  color?: string
}) => (
  <div className="mb-4">
    <div className="flex items-center mb-1">
      {Icon && <Icon className={`h-4 w-4 mr-2 ${color || "text-gray-500"}`} />}
      <h4 className="text-sm font-medium text-gray-500">{label}</h4>
    </div>
    <p className="text-gray-800 ml-6">{value || "Not defined yet"}</p>
  </div>
);

export default function ProjectPage() {
  const router = useRouter();
  const { id: projectIdFromRouter } = router.query;
  const { user, loading: authLoading, profile } = useAuthContext();

  useEffect(() => {
    // Log current auth state when it changes or projectIdFromRouter changes
    if (!authLoading) {
      console.log('Auth context loaded. User:', user);
      console.log('Current authenticated user ID (from AuthContext):', user?.id);
      console.log('User profile:', profile);
      console.log('Project ID from router query:', projectIdFromRouter);
    } else {
      console.log('Auth context is loading...');
    }
  }, [user, authLoading, profile, projectIdFromRouter]);

  useEffect(() => {
    if (!authLoading && profile && projectIdFromRouter) {
      if (profile.subscription_tier === 'free') {
        router.push(`/project/${projectIdFromRouter}/index_2`);
      }
    }
  }, [authLoading, profile, router, projectIdFromRouter]);

  // Fetch project and personas only if authenticated and projectId is available
  const projectIdToFetch = authLoading || !user ? undefined : projectIdFromRouter as string;

  const { project, loading: projectLoading, error: projectError } = useProjectById(projectIdToFetch);
  const { personas, loading: personasLoading, error: personasError } = usePersonas(projectIdToFetch);

  const [selectedPersona, setSelectedPersona] = useState<number | null>(null);
  const [showGroupChat, setShowGroupChat] = useState(false);

  if (authLoading || (!profile && !user && authLoading !== false) ) { // Adjusted loading check
    return <div>Loading user information...</div>;
  }

  if (profile && profile.subscription_tier === 'free') {
    // This condition is primarily handled by useEffect, but this can be a fallback.
    return <div>Redirecting to the appropriate version for your plan...</div>;
  }

  if (projectLoading || personasLoading) {
    let statusMessage = "Loading...";
    if (authLoading) statusMessage = "Authenticating user...";
    else if (projectLoading) statusMessage = "Loading project details...";
    else if (personasLoading) statusMessage = "Loading personas...";
    return <div className="p-4">{statusMessage}</div>;
  }

  // If not authenticated after auth check, show an appropriate message
  if (!user) {
    return <div className="p-4">Authentication required. Please log in to view this project.</div>;
  }

  // Handle project-specific errors first
  if (projectError) {
    // Check for our custom "not found or access denied" message
    if (projectError === 'Project not found or access denied.') {
      return <div className="p-4">Project not found or access is denied. Please check the ID or your permissions. Logged UserID: {user?.id}</div>;
    }
    // Display other project errors
    return <div className="p-4">Error loading project data: {projectError}</div>;
  }

  // Handle personas error if project loaded successfully but personas failed
  if (personasError) {
    return <div className="p-4">Error loading associated personas: {personasError}</div>;
  }

  // If there was no project error, but project is still null (should be caught by projectError now)
  if (!project) {
    return <div className="p-4">Project data is not available. Logged UserID: {user?.id}</div>;
  }

  const stageInfo: StageInfo = {
    'Idea': { color: 'bg-blue-100 text-blue-800', label: 'IDEA', description: 'Define your business idea' },
    'Prototype': { color: 'bg-purple-100 text-purple-800', label: 'PROTOTYPE', description: 'Build your prototype' },
    'MVP': { color: 'bg-green-100 text-green-800', label: 'MVP', description: 'Launch your MVP' },
    'Series A': { color: 'bg-amber-100 text-amber-800', label: 'SERIES A', description: 'Series A funding' },
    'Series B': { color: 'bg-indigo-100 text-indigo-800', label: 'SERIES B', description: 'Series B funding' },
    'Series C': { color: 'bg-teal-100 text-teal-800', label: 'SERIES C', description: 'Series C funding' }
  };

  const currentStage = stageInfo[project.stage] || stageInfo['Idea'];

  // Transform database metrics to component format
  const transformedMetrics = project.metrics ? {
    tam: project.metrics.Potential?.TAM,
    potentialEarnings: project.metrics.Potential?.PEs,
    marketGrowthRate: project.metrics.Potential?.MGR,
    projectedMarketShare: project.metrics.Potential?.PMS,
    cac: project.metrics.Profitability?.CAC,
    cltv: project.metrics.Profitability?.CLTV,
    cacCltvRatio: project.metrics.Profitability?.CAC_CLTV_ratio,
    averageGrossMargin: project.metrics.Profitability?.Avg_gross_margin,
    cacPayback: project.metrics.Profitability?.CAC_Payback,
    salesCycle: project.metrics.Time_to_Market?.Sales_Cycle,
    timeToMvp: project.metrics.Time_to_Market?.Time_to_MVP,
    seedToLaunch: project.metrics.Time_to_Market?.Seed_to_Launch,
    timeToRevenue: project.metrics.Time_to_Market?.Time_to_revenue
  } : null;

  // Transform analysis data
  const analysisReports = preprocessAnalysisData(project.analysis);;
  if (project.analysis?.Key_Trends) {
    analysisReports.push({
      id: 'key_trends',
      title: project.analysis.Key_Trends.title,
      type: 'key_trends' as const,
      date: new Date().toISOString(),
      data: project.analysis.Key_Trends
    });
  }
  if (project.analysis?.Netnographic) {
    analysisReports.push({
      id: 'final',
      title: project.analysis.Netnographic.title,
      type: 'final' as const,
      date: new Date().toISOString(),
      data: project.analysis.Netnographic
    });
  }

  return (
    <><Head>
      <title> {project.name} | NexTraction</title>
      <meta name="description" content="Manage and track your business ideas and projects." />
    </Head><ProjectLayout>
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{project.name}</h1>
              <div className="flex items-center mt-2">
                <span className={`${currentStage.color} text-xs px-2 py-1 rounded-full font-medium mr-2`}>
                  {currentStage.label}
                </span>
                <span className="text-gray-500 text-sm">{currentStage.description}</span>
              </div>
            </div>

            <div className="flex mt-4 md:mt-0 space-x-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/project/${project.id}/edit`}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Link>
              </Button>
              <ShareTeamDialog
                projectId={project.id}
                projectName={project.name}
                variant="outline"
                size="sm" />
            </div>
          </div>

          {/* Main content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column */}
            <div className="lg:col-span-2">
              {/* Metrics */}
              {transformedMetrics && (
                <div className="mb-6">
                  <MetricsDisplay metrics={transformedMetrics} />
                </div>
              )}

              {/* Project Overview */}
              <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Project Overview</h2>
                <p className="text-gray-600 mb-6">{project.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                  <PitchDetail
                    label="Problem"
                    value={project.overview?.Problem || ""}
                    icon={AlertTriangle}
                    color="text-red-300" />
                  <PitchDetail
                    label="Solution"
                    value={project.overview?.Solution || ""}
                    icon={Lightbulb}
                    color="text-blue-300" />
                  <PitchDetail
                    label="Target Market"
                    value={project.overview?.Target_Market || ""}
                    icon={Users}
                    color="text-green-300" />
                  <PitchDetail
                    label="Business Model"
                    value={project.overview?.Business_Model || ""}
                    icon={Briefcase}
                    color="text-yellow-300" />
                  <PitchDetail
                    label="Competition"
                    value={project.overview?.Competition || ""}
                    icon={Swords}
                    color="text-purple-300" />
                  <PitchDetail
                    label="Unique Selling Point"
                    value={project.overview?.Unique_selling_point || ""}
                    icon={Sparkles}
                    color="text-pink-300" />
                  <PitchDetail
                    label="Marketing Strategy"
                    value={project.overview?.Marketing_Strategy || ""}
                    icon={Megaphone}
                    color="text-indigo-300" />
                </div>
              </div>

              {/* Analysis Section */}
              {analysisReports.length > 0 && (
                <div className="mb-6">
                  <AnalysisSection analyses={analysisReports} />
                </div>
              )}

              {/* Personas Section */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Target Personas</h2>
                {!showGroupChat && personas && personas.length > 0 && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      {personas.map((persona, index) => (
                        <PersonaCard
                          key={persona.id}
                          persona={{
                            id: persona.id,
                            name: persona.name,
                            role: persona.role,
                            company: persona.company,
                            description: persona.description,
                            accentColor: "#6366f1",
                            avatarUrl: undefined,
                            jobTitle: persona.role,
                            needsSnippet: persona.description.substring(0, 100) + '...'
                          }}
                          onShowDetails={() => setSelectedPersona(index)} />
                      ))}
                    </div>
                    <Button
                      onClick={() => router.push(`/project/${project.id}/chat`)}
                      className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                      <Users className="h-5 w-5 mr-2" />
                      Chat with Personas
                    </Button>
                  </>
                )}
                {showGroupChat && (
                  <GroupChat projectId={project.id} projectName={project.name} personas={personas} />
                )}
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold mb-4">Actions</h2>
                <ActionButtons projectId={project.id} />
              </div>
            </div>
          </div>

          {/* Persona Modal */}
          {selectedPersona !== null && personas[selectedPersona] && (
            <PersonaModal
              persona={{
                ...personas[selectedPersona],
                role: personas[selectedPersona].role as any, // Type assertion for role compatibility
                avatarUrl: undefined
              }}
              isOpen={selectedPersona !== null}
              onClose={() => setSelectedPersona(null)}
              jobTitle={personas[selectedPersona].role}
              needsDetails={personas[selectedPersona].description}
              background=""
              goals={personas[selectedPersona].goals || []}
              challenges={personas[selectedPersona].pain_points || []}
              preferredCommunication="" />
          )}
        </div>
      </ProjectLayout></>
  );
}
