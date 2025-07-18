// lib/ga.ts
declare global {
    interface Window {
      gtag?: (...args: any[]) => void;
    }
  }

  export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

  // https://developers.google.com/analytics/devguides/collection/gtagjs/pages
  export const pageview = (url: string) => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('config', GA_TRACKING_ID, {
        page_path: url,
      });
    }
  };

  // https://developers.google.com/analytics/devguides/collection/gtagjs/events
  export const event = ({ action, category, label, value }: {
    action: string;
    category: string;
    label: string;
    value?: number;
  }) => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    }
  };

  // Auth Events
  export const trackLogin = (method: string) => {
    event({
      action: 'login',
      category: 'authentication',
      label: method,
    });
  };

  export const trackLogout = () => {
    event({
      action: 'logout',
      category: 'authentication',
      label: 'user_logout',
    });
  };

  export const trackRegistration = (method: string) => {
    event({
      action: 'sign_up',
      category: 'authentication',
      label: method,
    });
  };

  // Project Events
  export const trackProjectCreation = () => {
    event({
      action: 'create_project',
      category: 'project',
      label: 'new_project_created',
    });
  };

  export const trackProjectOpen = (projectId: string) => {
    event({
      action: 'open_project',
      category: 'project',
      label: `project_opened_${projectId}`,
    });
  };

  // Dashboard Events
  export const trackDashboardView = () => {
    event({
      action: 'view_dashboard',
      category: 'dashboard',
      label: 'dashboard_page_viewed',
    });
  };

  export const trackAnalysisModalOpen = () => {
    event({
      action: 'open_analysis_modal',
      category: 'dashboard',
      label: 'analysis_modal_opened',
    });
  };

  export const trackAnalysisReportOpen = (analysisId: string, analysisType: string) => {
    event({
      action: 'open_analysis_report',
      category: 'dashboard',
      label: `report_opened_${analysisType}_${analysisId}`,
    });
  };

  export const trackAnalysisReportDownload = (analysisId: string, analysisType: string) => {
    event({
      action: 'download_analysis_report',
      category: 'dashboard',
      label: `report_downloaded_${analysisType}_${analysisId}`,
    });
  };

  export const trackAnalysisReportViewDuration = (analysisId: string, analysisType: string, durationInSeconds: number) => {
    event({
      action: 'view_analysis_report_duration',
      category: 'dashboard',
      label: `report_viewed_${analysisType}_${analysisId}`,
      value: durationInSeconds,
    });
  };

  export const trackPersonasModalOpen = () => {
    event({
      action: 'open_personas_modal',
      category: 'dashboard',
      label: 'personas_modal_opened',
    });
  };

  // Chat Events
  export const trackChatPageView = () => {
    event({
      action: 'view_chat_page',
      category: 'chat',
      label: 'chat_page_viewed',
    });
  };

  export const trackChatMessageSent = () => {
    event({
      action: 'send_chat_message',
      category: 'chat',
      label: 'message_sent',
    });
  };

  export const trackChatInteraction = (interactionType: string) => {
    event({
      action: 'chat_interaction',
      category: 'chat',
      label: interactionType,
    });
  };

  // Generic Click Event
  export const trackButtonClick = (buttonName: string, page: string) => {
    event({
      action: 'button_click',
      category: 'engagement',
      label: `${buttonName}_on_${page}`,
    });
  };
