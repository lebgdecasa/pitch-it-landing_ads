// pages/project/[id]/index.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import * as ga from '@/lib/ga';
import Link from 'next/link';
import { ChevronLeft, Edit, Download, Users, AlertTriangle, Lightbulb, Briefcase, Swords, Sparkles, Megaphone } from 'lucide-react';
import ProjectLayout from '@/components/layout/ProjectLayout';
import dynamic from 'next/dynamic';
import { preprocessAnalysisData } from '@/utils/analysisPreprocessor';

// Component imports
const ShareTeamDialog = dynamic(() => import('../../../components/project/ShareTeamDialog'), { ssr: false });
import ActionButtons from '../../../components/project/ActionButtons';
import { AnalysisSection } from '../../../components/project/dashboard/AnalysisSection';
import { MetricsDisplay } from '../../../components/project/dashboard/MetricsDisplay';
import { Button } from '../../../components/ui/button';
import PersonaCard from '../../../components/client-components/persona/PersonaCard';
import PersonaModal from '../../../components/client-components/persona/PersonaModal';
const GroupChat = dynamic(() => import('../../../components/project/chat/GroupChat').then(mod => mod.GroupChat), { ssr: false });

// Supabase imports
import { useProjects, useProjectById } from '../../../supa_database/hooks/useProject';
import { usePersonas } from '../../../supa_database/hooks/usePersonas';
import { supabase } from '../../../supa_database/config/supabase'; // Ensure Supabase client is imported
import { useAuthContext } from '../../../supa_database/components/AuthProvider'; // Import useAuthContext
import Head from 'next/dist/shared/lib/head';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { GetServerSideProps } from 'next';

// Type definitions
interface StageInfo {
  [key: string]: {
    color: string;
    label: string;
    description: string;
  };
}

interface ProjectPageProps {
  isDummy?: boolean;
  dummyProject?: any; // Using `any` for flexibility, but you can create a specific dummy type
  dummyPersonas?: any[];
}

const PitchDetail = ({ label, value, icon: Icon, color }: {
  label: string;
  value: string;
  icon?: React.ElementType;
  color?: string
}) => {
  const { t } = useTranslation('common');
  return (
  <div className="mb-4">
    <div className="flex items-center mb-1">
      {Icon && <Icon className={`h-4 w-4 mr-2 ${color || "text-gray-500"}`} />}
      <h4 className="text-sm font-medium text-gray-500">{label}</h4>
    </div>
    <p className="text-gray-800 ml-6">{value || t('not_defined_yet')}</p>
  </div>
)};

export default function ProjectPage({ isDummy = false, dummyProject, dummyPersonas = [] }: ProjectPageProps) {
  const router = useRouter();
  const { t } = useTranslation('common');
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

  const { project: fetchedProject, loading: projectLoading, error: projectError } = useProjectById(
    isDummy ? undefined : (projectIdToFetch)
  );

  const { personas: fetchedPersonas, loading: personasLoading, error: personasError } = usePersonas(
    isDummy ? undefined : (projectIdToFetch)
  );

  const project = isDummy ? dummyProject : fetchedProject;
  const personas = isDummy ? dummyPersonas : fetchedPersonas;

  const [selectedPersona, setSelectedPersona] = useState<number | null>(null);

  useEffect(() => {
    if (!isDummy && projectIdFromRouter) {
      ga.trackProjectOpen(projectIdFromRouter as string);
    }
  }, [isDummy, projectIdFromRouter]);

  if (!isDummy) {
    if (authLoading || projectLoading || personasLoading) {
      return <div>{t('loading')}</div>;
    }
    if (!user) {
      return <div className="p-4">{t('auth_required')}</div>;
    }
    if (projectError || personasError) {
      return <div className="p-4">{t('error_loading_project_or_personas')}</div>;
    }
  }

  if (!project) {
    return <div className="p-4">{t('project_data_not_available')}</div>;
  }

  const [showGroupChat, setShowGroupChat] = useState(false);

  if (authLoading || (!profile && !user && authLoading !== false) ) { // Adjusted loading check
    return <div>{t('loading_user_info')}</div>;
  }

  if (profile && profile.subscription_tier === 'free') {
    // This condition is primarily handled by useEffect, but this can be a fallback.
    return <div>{t('redirecting_for_plan')}</div>;
  }

  if (projectLoading || personasLoading) {
    let statusMessage = t('loading');
    if (authLoading) statusMessage = t('authenticating_user');
    else if (projectLoading) statusMessage = t('loading_project_details');
    else if (personasLoading) statusMessage = t('loading_personas');
    return <div className="p-4">{statusMessage}</div>;
  }

  // If not authenticated after auth check, show an appropriate message
  if (!user) {
    return <div className="p-4">{t('auth_required')}</div>;
  }

  // Handle project-specific errors first
  if (projectError) {
    // Check for our custom "not found or access denied" message
    if (projectError === 'Project not found or access denied.') {
      return <div className="p-4">{t('project_not_found_or_denied', { userId: user?.id })}</div>;
    }
    // Display other project errors
    return <div className="p-4">{t('error_loading_project', { error: projectError })}</div>;
  }

  // Handle personas error if project loaded successfully but personas failed
  if (personasError) {
    return <div className="p-4">{t('error_loading_personas', { error: personasError })}</div>;
  }

  // If there was no project error, but project is still null (should be caught by projectError now)
  if (!project) {
    return <div className="p-4">{t('project_data_not_available', { userId: user?.id })}</div>;
  }

  const stageInfo: StageInfo = {
    'Idea': { color: 'bg-blue-100 text-blue-800', label: t('project_stage_idea_label'), description: t('project_stage_idea_desc') },
    'Prototype': { color: 'bg-purple-100 text-purple-800', label: t('project_stage_prototype_label'), description: t('project_stage_prototype_desc') },
    'MVP': { color: 'bg-green-100 text-green-800', label: t('project_stage_mvp_label'), description: t('project_stage_mvp_desc') },
    'Series A': { color: 'bg-amber-100 text-amber-800', label: t('project_stage_series_a_label'), description: t('project_stage_series_a_desc') },
    'Series B': { color: 'bg-indigo-100 text-indigo-800', label: t('project_stage_series_b_label'), description: t('project_stage_series_b_desc') },
    'Series C': { color: 'bg-teal-100 text-teal-800', label: t('project_stage_series_c_label'), description: t('project_stage_series_c_desc') }
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
    <>
      <Head>
        <title> {t('project_page_title', { projectName: project.name })}</title>
        <meta name="description" content={t('project_page_description')} />
      </Head>
      <ProjectLayout>
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{project.name}</h1>
              <div className="flex items-center mt-2">
                <span className={`${currentStage.color} text-xs px-2 py-1 rounded-full font-medium mr-2`}>{currentStage.label}</span>
                <span className="text-gray-500 text-sm">{currentStage.description}</span>
              </div>
            </div>
            <div className="flex mt-4 md:mt-0 space-x-2">
              <Button variant="outline" size="sm" asChild>
                {/* Onboarding: Disable link in dummy mode */}
                <Link href={isDummy ? "#" : `/project/${project.id}/edit`}>
                  <Edit className="h-4 w-4 mr-1" />
                  <span>{t('edit_button') || 'Edit'}</span>
                </Link>
              </Button>
              {/* Onboarding: The Share dialog can be complex to simulate, so we can just disable it or simplify it */}
              {!isDummy && (
                  <ShareTeamDialog projectId={project.id} projectName={project.name} variant="outline" size="sm" isOpen={false} onClose={() => {}} />
              )}
            </div>
          </div>

          {/* Main content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {/* Left column */}
              {/* Metrics */}
              {transformedMetrics && (
                <div className="mb-6">
                  <MetricsDisplay metrics={transformedMetrics} />
                </div>
              )}
              {/* Project Overview */}
              <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">{t('project_overview')}</h2>
                <p className="text-gray-600 mb-6">{project.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                  <PitchDetail label={t('problem_label')} value={project.overview?.Problem || ""} icon={AlertTriangle} color="text-red-300" />
                  <PitchDetail label={t('solution_label')} value={project.overview?.Solution || ""} icon={Lightbulb} color="text-blue-300" />
                  {/* ... other PitchDetail components */}
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
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('target_personas')}</h2>
                {personas && personas.length > 0 && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      {personas.map((persona: any, index: number) => (
                        <PersonaCard key={persona.id} persona={persona} onShowDetails={() => setSelectedPersona(index)} />
                      ))}
                    </div>
                    <Button
                      onClick={() => {
                        if (isDummy) return; // Disable router push in dummy mode
                        ga.trackButtonClick('chat_with_personas', 'project_dashboard');
                        router.push(`/project/${project.id}/chat`);
                      }}
                      className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                      <Users className="h-5 w-5 mr-2" />
                      {t('chat_with_personas')}
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold mb-4">{t('actions_title')}</h2>
                <ActionButtons projectId={project.id} onRunPulse={function (): void {
                  throw new Error('Function not implemented.');
                } } onBookDemo={function (): void {
                  throw new Error('Function not implemented.');
                } } isPulseRunning={false} />
              </div>
            </div>
          </div>
          {/* Persona Modal */}
          {selectedPersona !== null && personas[selectedPersona] && (
            <PersonaModal persona={personas[selectedPersona]} isOpen={selectedPersona !== null} onClose={() => setSelectedPersona(null)} />
          )}
        </div>
      </ProjectLayout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common'])),
  },
});
