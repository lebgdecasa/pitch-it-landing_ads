// @/components/onboarding/OnboardingTour.ts

import type { StepOptions } from 'shepherd.js';

declare global {
  interface Window {
    changeOnboardingView: (view: string) => void;
  }
}

export const tourOptions = {
  defaultStepOptions: {
    cancelIcon: {
      enabled: true,
    },
    classes: 'shadow-md bg-white p-4 rounded-lg',
    scrollTo: { behavior: 'smooth', block: 'center' },
  },
  useModalOverlay: true, // Grise le reste de la page pour focus l'utilisateur
};

// Logique pour changer de vue et passer à l'étape suivante
const nextStep = (view: string) => ({
  action: function () {
    window.changeOnboardingView(view);
    // @ts-ignore
    this.tour.next();
  },
  text: 'Suivant'
});

export const steps: StepOptions[] = [
  // Étape 1: Dashboard vide
  {
    id: 'welcome',
    title: "Bienvenue sur Pitch.it ! Voici votre tableau de bord. Pour l'instant, il est vide. Commençons par créer votre premier projet.",
    attachTo: { element: '.dashboard-header', on: 'bottom' },
    buttons: [{
      action() {
        // @ts-ignore
        this.tour.next()
      },
      text: 'Commençons !'
    }],
  },
  {
    id: 'new-project',
    text: "Cliquez sur ce bouton pour lancer l'assistant de création de projet. C'est ici que la magie commence.",
    attachTo: { element: '#new-project-btn', on: 'bottom' }, // **Action requise**: Assurez-vous que votre bouton "Nouveau projet" a l'ID `new-project-btn`
    advanceOn: { selector: '#new-project-btn', event: 'click' },
    when: {
      show: () => { window.changeOnboardingView('emptyDashboard'); }
    }
  },

  // Étapes du Wizard
  {
    id: 'wizard-step1',
    title: 'Étape 1: Les bases',
    text: "Indiquez ici le nom de votre projet et son secteur d'activité. Ces informations nous aident à personnaliser l'analyse pour vous.",
    attachTo: { element: '#project-name-input', on: 'bottom' }, // **Action requise**: Ajoutez les ID aux champs du wizard
    when: {
        show: () => { window.changeOnboardingView('wizard'); }
    },
    buttons: [nextStep('wizard')]
  },
  {
    id: 'wizard-step2',
    title: 'Étape 2: La description',
    text: "C'est l'étape la plus importante ! Décrivez votre produit en détail. Notre assistant vous guidera pour couvrir toutes les dimensions clés. Plus vous êtes précis, meilleure sera l'analyse.",
    attachTo: { element: '#description-textarea', on: 'top' },
    buttons: [nextStep('wizard')]
  },
  {
    id: 'wizard-step3',
    title: 'Étape 3: Votre avancement',
    text: "Dites-nous où vous en êtes : une simple idée, un prototype, ou un produit déjà lancé. Cela nous permet d'ajuster nos recommandations.",
    attachTo: { element: '#project-stage-selector', on: 'top' },
    buttons: [{
      action() {
        window.changeOnboardingView('lockedDashboard');
        // @ts-ignore
        this.tour.next();
      },
      text: 'Terminer'
    }]
  },

  // Dashboard avec projet "locked"
  {
    id: 'dashboard-locked',
    title: 'Projet en cours d\'analyse',
    text: "Excellent ! Votre projet est créé et nous avons lancé les analyses en arrière-plan. Il est pour l'instant 'verrouillé'.",
    attachTo: { element: '.project-card-locked', on: 'bottom' }, // **Action requise**: Ajoutez une classe `.project-card-locked` aux projets verrouillés
  },
  {
    id: 'email-notification',
    title: "Vous recevrez un e-mail",
    text: "Comme celui-ci, pour vous notifier dès que votre analyse est prête. En général, cela prend quelques minutes.",
    // Pas d'attachement, c'est une bulle d'info centrale. On pourrait y mettre une image de l'email.
    buttons: [{
        action() {
          window.changeOnboardingView('projectDashboard');
          // @ts-ignore
          this.tour.next();
        },
        text: "J'ai compris !"
      }]
  },

  // ... La suite du parcours (Project Dashboard, Personas, Chat, etc.) suivrait la même logique

  // Dernière Étape
  {
    id: 'final',
    title: 'Vous êtes prêt !',
    text: 'Explorez votre rapport, discutez avec vos personas et n\'oubliez pas que de nouvelles fonctionnalités arrivent bientôt !',
    buttons: [{
      text: 'Aller vers mon vrai dashboard',
      action() {
        // Redirige l'utilisateur vers son VRAI dashboard pour de bon
        window.location.href = '/dashboard';
      }
    }]
  }
];
