// pages/project/[id]/index.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ChevronLeft, Edit, Download, Users, AlertTriangle, Lightbulb, Briefcase, Swords, Sparkles, Megaphone, Lock } from 'lucide-react';
import ProjectLayout from '@/components/layout/ProjectLayout_2';
import dynamic from 'next/dynamic';
import { useAuthContext } from '../../../supa_database/components/AuthProvider'; // Import useAuthContext
import Head from 'next/head';
import * as ga from '@/lib/ga';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { GetServerSideProps } from 'next';

// Component imports
// import ShareTeamDialog from '../../../components/project/ShareTeamDialog'; // Lazy loaded
const ShareTeamDialog = dynamic(() => import('../../../components/project/ShareTeamDialog'), { ssr: false });
import ActionButtons from '../../../components/project/ActionButtons_freemium_beta_';
import { AnalysisSection, type Report } from '../../../components/project/dashboard/AnalysisSection';
import { MetricsDisplay } from '../../../components/project/dashboard/MetricsDisplay';
import { Button } from '../../../components/ui/button';
import PersonaCard from '../../../components/client-components/persona/PersonaCard';
import PersonaModal from '../../../components/client-components/persona/PersonaModal';
import { preprocessAnalysisData } from '@/utils/analysisPreprocessor';
// import { GroupChat } from '../../../components/project/chat/GroupChat'; // Lazy loaded
const GroupChat = dynamic(() => import('../../../components/project/chat/GroupChat').then(mod => mod.GroupChat), { ssr: false });

// Supabase imports
import { useProjects, useProjectById } from '../../../supa_database/hooks/useProject';
import { usePersonas } from '../../../supa_database/hooks/usePersonas';
import { supabase } from '../../../supa_database/config/supabase'; // Ensure Supabase client is imported

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

export default function ProjectPage() {
  const router = useRouter();
  const { t } = useTranslation('common');
  const { id: projectIdFromRouter } = router.query;
  const { user, loading: authLoading, profile } = useAuthContext();

  useEffect(() => {
    if (projectIdFromRouter) {
      ga.trackProjectOpen(projectIdFromRouter as string);
    }
  }, [projectIdFromRouter]);

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
      if (profile.subscription_tier === 'premium' || profile.subscription_tier === 'enterprise') {
        router.push(`/project/${projectIdFromRouter}`);
      }
    }
  }, [authLoading, profile, router, projectIdFromRouter]);

  // Fetch project and personas only if authenticated and projectId is available
  const projectIdToFetch = authLoading || !user ? undefined : projectIdFromRouter as string;

  const { project, loading: projectLoading, error: projectError } = useProjectById(projectIdToFetch);
  const { personas, loading: personasLoading, error: personasError } = usePersonas(projectIdToFetch);

  const [selectedPersona, setSelectedPersona] = useState<number | null>(null);
  const [showGroupChat, setShowGroupChat] = useState(false);

  // Transform analysis data
  const processedAnalyses = useMemo(() => {
    if (!project?.analysis) return [];

    // The analysis object from the database should have structure like:
    // {
    //   Key_Trends: { ...key trends data },
    //   Netnographic: { ...netnographic data },
    //   Final: { ...final analysis data }
    // }

    return preprocessAnalysisData(project.analysis);
  }, [project?.analysis]);

  if (authLoading || (!profile && !user && authLoading !== false)) { // Adjusted loading check
    return <div>{t('loading_user_info')}</div>;
  }

  if (profile && (profile.subscription_tier === 'premium' || profile.subscription_tier === 'enterprise')) {
    // This condition is primarily handled by useEffect, but this can be a fallback.
    return <div>{t('redirecting_for_plan')}</div>;
  }

  if (project && project.locked) {
        return (
          <ProjectLayout>
            <div className="p-4 md:p-6 max-w-7xl mx-auto text-center">
              <Lock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold">{t('project_locked_title')}</h1>
              <p className="text-gray-600 mt-2">
                {t('project_locked_description')}
              </p>
              <Button asChild className="mt-4">
                  <Link href="/dashboard">{t('back_to_dashboard')}</Link>
              </Button>
            </div>
          </ProjectLayout>
        );
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
    return (
      <div className="p-4 text-center">
        <p>{t('auth_required')}</p>
        <Button asChild className="mt-4">
          <Link href="/">{t('back_to_homepage')}</Link>
        </Button>
      </div>
    );
  }

  // Handle project-specific errors first
  if (projectError) {
    // Check for our custom "not found or access denied" message
    if (projectError === 'Project not found or access denied.') {
      return (
        <div className="p-4 text-center">
          <p>{t('project_not_found_or_denied', { userId: user?.id })}</p>
          <Button asChild className="mt-4">
            <Link href="/">{t('back_to_homepage')}</Link>
          </Button>
        </div>
      );
    }
    // Display other project errors
    return (
      <div className="p-4 text-center">
        <p>{t('error_loading_project', { error: projectError })}</p>
        <Button asChild className="mt-4">
          <Link href="/">{t('back_to_homepage')}</Link>
        </Button>
      </div>
    );
  }

  // Handle personas error if project loaded successfully but personas failed
  if (personasError) {
    return (
      <div className="p-4 text-center">
        <p>{t('error_loading_personas', { error: personasError })}</p>
        <Button asChild className="mt-4">
          <Link href="/">{t('back_to_homepage')}</Link>
        </Button>
      </div>
    );
  }

  // If there was no project error, but project is still null (should be caught by projectError now)
  if (!project) {
    return (
      <div className="p-4 text-center">
        <p>{t('project_data_not_available', { userId: user?.id })}</p>
        <Button asChild className="mt-4">
          <Link href="/">{t('back_to_homepage')}</Link>
        </Button>
      </div>
    );
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

  return (
    <><Head>
      <title> {t('project_page_title', { projectName: project.name })}</title>
      <meta name="description" content={t('project_page_description')} />
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
            </div>
          </div>

          {/* Main content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column */}
            <div className="lg:col-span-2">
              {/* Metrics */}
              {transformedMetrics && (() => {
                const metricGroups = [
                  {
                    title: t('market_potential_title'),
                    metrics: {
                      [t('tam_label')]: transformedMetrics.tam,
                      [t('potential_earnings_label')]: transformedMetrics.potentialEarnings,
                      [t('market_growth_rate_label')]: transformedMetrics.marketGrowthRate,
                      [t('projected_market_share_label')]: transformedMetrics.projectedMarketShare,
                    },
                  },
                  {
                    title: t('profitability_title'),
                    metrics: {
                      [t('cac_label')]: transformedMetrics.cac,
                      [t('cltv_label')]: transformedMetrics.cltv,
                      [t('cac_cltv_ratio_label')]: transformedMetrics.cacCltvRatio,
                      [t('avg_gross_margin_label')]: transformedMetrics.averageGrossMargin,
                      [t('cac_payback_period_label')]: transformedMetrics.cacPayback,
                    },
                  },
                  {
                    title: t('time_to_market_title'),
                    metrics: {
                      [t('sales_cycle_label')]: transformedMetrics.salesCycle,
                      [t('time_to_mvp_label')]: transformedMetrics.timeToMvp,
                      [t('seed_to_launch_time_label')]: transformedMetrics.seedToLaunch,
                      [t('time_to_revenue_label')]: transformedMetrics.timeToRevenue,
                    },
                  },
                ];

                const sectionsToShow = metricGroups
                  .map(group => ({
                    ...group,
                    metrics: Object.entries(group.metrics).filter(([_, value]) => value != null && value.toString() !== ''),
                  }))
                  .filter(group => group.metrics.length > 0);

                if (sectionsToShow.length === 0) {
                  return null;
                }

                return (
                  <div className="mb-6">
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                      <h2 className="text-xl font-semibold mb-4">{t('metrics_title')}</h2>
                      {sectionsToShow.map((section, index) => (
                        <div key={section.title} className={index < sectionsToShow.length - 1 ? 'mb-6' : ''}>
                          <h3 className="text-lg font-semibold text-gray-800 mb-3">{section.title}</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                            {section.metrics.map(([label, value]) => (
                              <div key={label}>
                                <h4 className="text-sm font-medium text-gray-500">{label}</h4>
                                <p className="text-gray-800 font-medium mt-1">{String(value)}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Project Overview */}
              <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">{t('project_overview')}</h2>
                <p className="text-gray-600 mb-6">{project.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                  <PitchDetail
                    label={t('problem_label')}
                    value={project.overview?.Problem || ""}
                    icon={AlertTriangle}
                    color="text-red-300" />
                  <PitchDetail
                    label={t('solution_label')}
                    value={project.overview?.Solution || ""}
                    icon={Lightbulb}
                    color="text-blue-300" />
                  <PitchDetail
                    label={t('target_market_label')}
                    value={project.overview?.Target_Market || ""}
                    icon={Users}
                    color="text-green-300" />
                  <PitchDetail
                    label={t('business_model_label')}
                    value={project.overview?.Business_Model || ""}
                    icon={Briefcase}
                    color="text-yellow-300" />
                  <PitchDetail
                    label={t('competition_label')}
                    value={project.overview?.Competition || ""}
                    icon={Swords}
                    color="text-purple-300" />
                  <PitchDetail
                    label={t('usp_label')}
                    value={project.overview?.Unique_selling_point || ""}
                    icon={Sparkles}
                    color="text-pink-300" />
                  <PitchDetail
                    label={t('marketing_strategy_label')}
                    value={project.overview?.Marketing_Strategy || ""}
                    icon={Megaphone}
                    color="text-indigo-300" />
                </div>
              </div>

              {/* Analysis Section */}
              {processedAnalyses && processedAnalyses.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                  <AnalysisSection
                    analyses={processedAnalyses}
                  />
                </div>
              )}

              {/* Personas Section */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('target_personas')}</h2>
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
                          onShowDetails={() => {
                                                      ga.trackPersonasModalOpen();
                                                      setSelectedPersona(index);
                                                    }} />
                      ))}
                    </div>
                    <Button
                      onClick={() => {
                        ga.trackButtonClick('chat_with_personas', 'project_dashboard');
                        router.push(`/project/${project.id}/chat_2`)
                      }}
                      className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                      <Users className="h-5 w-5 mr-2" />
                      {t('chat_with_personas')}
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
                <h2 className="text-xl font-semibold mb-4">{t('actions_title')}</h2>
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
              background={personas[selectedPersona].demographics
                ? Object.entries(personas[selectedPersona].demographics)
                  .map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}: ${String(value)}`)
                  .join('; ')
                : undefined}
              goals={personas[selectedPersona].goals || []}
              challenges={personas[selectedPersona].pain_points || []}
            />
          )}
        </div>
      </ProjectLayout></>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common'])),
  },
});
