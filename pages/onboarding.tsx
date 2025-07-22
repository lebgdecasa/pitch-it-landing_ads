// @/pages/onboarding.tsx
import { useState, useEffect } from 'react';
import { ShepherdJourneyProvider } from 'react-shepherd';
import Shepherd from 'shepherd.js';
import type { StepOptions } from 'shepherd.js';

// Importez vos vrais composants
import DashboardPage from './dashboard';
import {ProjectWizard} from '@/components/wizard/main_components/ProjectWizard';
import ProjectDashboard from './project/[id]';
import ChatPage from './project/[id]/chat';

// Importez les données fictives
import { dummyProject, dummyPersonas, dummyChatMessages } from '@/lib/onboarding-dummy-data';

// Le layout de base pour l'onboarding
import DashboardLayout from '@/components/layout/DashboardLayout';

// Import for server-side props
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { GetServerSideProps } from 'next';

// Options générales pour le tour
const tourOptions = {
  defaultStepOptions: {
    cancelIcon: {
      enabled: true,
    },
    classes: 'shadow-md bg-white p-4 rounded-lg shepherd-element',
    scrollTo: { behavior: 'smooth' as const, block: 'center' as const },
  },
  useModalOverlay: true,
};


const OnboardingComponent = () => {
  const [view, setView] = useState('emptyDashboard');
  const [tour, setTour] = useState<Shepherd.Tour | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    // Create tour instance
    if (typeof window !== 'undefined' && isClient) {
      const newTour = new Shepherd.Tour(tourOptions);
      setTour(newTour);
    }
  }, [isClient]);

  // Définition des étapes du tour
  // On le fait ici pour avoir accès à `tour` et `setView`
const steps: StepOptions[] = [
    // Étape 1: Dashboard vide
    {
      id: 'welcome',
      // Correction 3: Mettre le titre dans le texte avec du HTML
      text: "<h3>Bienvenue !</h3><p>Voici votre tableau de bord. Pour commencer, créons un nouveau projet.</p>",
      attachTo: { element: '.dashboard-header', on: 'bottom' },
      buttons: [{ text: 'Commençons !', action: tour?.next }],
    },
    {
      id: 'new-project',
      text: "Cliquez ici pour lancer l'assistant de création. C'est ici que la magie commence.",
      attachTo: { element: '#new-project-btn', on: 'bottom' },
      advanceOn: { selector: '#new-project-btn', event: 'click' },
      beforeShowPromise: () => new Promise(resolve => {
        setView('emptyDashboard');
        setTimeout(resolve, 100);
      })
    },
    // Étapes du Wizard
    {
      id: 'wizard-step1',
      text: "<h3>Étape 1 : Les bases</h3><p>Indiquez le nom de votre projet et son secteur d'activité. Ces informations nous aident à personnaliser l'analyse.</p>",
      attachTo: { element: '#project-name-input', on: 'bottom' },
      beforeShowPromise: () => new Promise(resolve => {
        setView('wizard');
        setTimeout(resolve, 100);
      }),
      buttons: [{ text: 'Suivant', action: tour?.next }]
    },
    {
      id: 'wizard-step2',
      text: "<h3>Étape 2 : La description</h3><p>C'est l'étape la plus importante ! Décrivez votre produit en détail. Notre assistant vous guidera.</p>",
      attachTo: { element: '#description-textarea', on: 'top' },
      buttons: [{ text: 'Suivant', action: tour?.next }]
    },
    {
      id: 'wizard-step3',
      text: "<h3>Étape 3 : Votre avancement</h3><p>Dites-nous où vous en êtes. Cela nous permet d'ajuster nos recommandations.</p>",
      attachTo: { element: '#project-stage-selector', on: 'top' },
      buttons: [{ text: 'Terminer', action: () => {
          setView('lockedDashboard');
          tour?.next();
      }}]
    },
    // Dashboard avec projet "locked"
    {
      id: 'dashboard-locked',
      text: "<h3>Projet en cours d'analyse</h3><p>Excellent ! Votre projet est créé et nous avons lancé les analyses. Il est pour l'instant 'verrouillé'.</p>",
      attachTo: { element: '.project-card-locked', on: 'bottom' },
      buttons: [{ text: 'Suivant', action: tour?.next }]
    },
    {
      id: 'email-notification',
      text: "<h3>Vous recevrez un e-mail</h3><p>Comme celui-ci, pour vous notifier dès que l'analyse est prête. Continuons la visite.</p>",
      buttons: [{ text: 'J\'ai compris !', action: () => {
        setView('projectDashboard');
        tour?.next();
      }}]
    },
    // ... Vous pouvez ajouter ici les étapes pour le ProjectDashboard et le ChatPage sur le même modèle
    {
      id: 'final',
      text: '<h3>Vous êtes prêt !</h3><p>Explorez votre rapport, discutez avec vos personas et n\'oubliez pas que de nouvelles fonctionnalités arrivent bientôt !</p>',
      buttons: [{
        text: 'Terminer l\'onboarding',
        action: () => {
          window.location.href = '/dashboard';
        }
      }]
    }
  ];

  useEffect(() => {
    if (tour && isClient) {
        // Vider les étapes existantes pour éviter les doublons lors du rechargement à chaud en développement
        try {
          while(tour.steps.length > 0) {
              tour.removeStep(tour.steps[0].id);
          }
          tour.addSteps(steps);
          tour.start();
        } catch (error) {
          console.error('Error setting up tour:', error);
        }
    }
  }, [tour, isClient]);


  const renderView = () => {
    try {
      switch (view) {
        case 'wizard':
          return <ProjectWizard isDummy={true} />;
        case 'lockedDashboard':
          return <DashboardPage isDummy={true} dummyProjects={[dummyProject]} />;
        case 'projectDashboard':
          // Renommer la prop `dummyProject` de la page en `project` pour correspondre à son attente
          return <ProjectDashboard isDummy={true} dummyProject={dummyProject} dummyPersonas={dummyPersonas} />;
        case 'chat':
          // Correction 4: S'assurer que les props pour ChatPage sont correctes
          return (
            <ChatPage
              isDummy={true}
              dummyProject={dummyProject}
              dummyPersonas={dummyPersonas}
              dummyMessages={dummyChatMessages.map(msg => ({
                ...msg,
                sender_type: msg.sender_type === 'persona' ? 'persona' : 'user',
                timestamp: new Date(msg.timestamp)
              }))}
            />
          );
        case 'emptyDashboard':
        default:
          return <DashboardPage isDummy={true} dummyProjects={[]} />;
      }
    } catch (error) {
      console.error('Error rendering view:', error);
      return <div>Error rendering view: {view}</div>;
    }
  };

  return (
    <DashboardLayout>
      {isClient && isHydrated ? renderView() : <div className="p-8 text-center">Loading onboarding...</div>}
    </DashboardLayout>
  );
}

// Le composant Provider doit englober le reste
// Correction 5: Utiliser ShepherdJourneyProvider et passer les étapes directement au composant enfant
const OnboardingPage = () => (
    <ShepherdJourneyProvider>
      <OnboardingComponent />
    </ShepherdJourneyProvider>
);


export default OnboardingPage;

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common'])),
  },
});
