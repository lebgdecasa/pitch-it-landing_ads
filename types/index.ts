// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  plan: 'free' | 'pro' | 'enterprise';
  createdAt: string;
  projectsCount: number;
  imageUrl?: string; // Added for user profile image
}

// Pitch Types
export interface Pitch {
  problem: string;
  solution: string;
  targetMarket: string;
  businessModel: string;
  competition: string;
  uniqueSellingPoint: string;
  marketingStrategy: string;
  fullDescription?: string; // Added for the new pitch assistant workflow
}

// Pitch Deck Types
export interface PitchDeckSlide {
  id: string;
  type: 'cover' | 'problem' | 'solution' | 'market' | 'product' | 'traction' | 'team' | 'competition' | 'business-model' | 'financials' | 'ask' | 'contact';
  content: Record<string, string>;
}

export interface PitchDeck {
  slides: PitchDeckSlide[];
}

// Feedback Types
export interface Feedback {
  id: string;
  vcName: string;
  overallScore: number;
  strengthPoints: string[];
  improvementPoints: string[];
  notes: string;
  createdAt: string;
}

// Project Types
export enum ProjectStage {
  IDEA = 'idea',
  PROTOTYPE = 'prototype',
  MVP = 'mvp',
  PRE_SEED = 'pre seed',
  SEED = 'seed',
  SERIES_A = 'series a',
  SERIES_B = 'series b',
  SERIES_C = 'series c'
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  description: string;
  tagline?: string;
  industry: string;
  createdAt: string;
  updatedAt: string;
  stage: ProjectStage;
  pitch: Pitch;
  pitchDeck?: PitchDeck;
  feedback?: Feedback[];
  score?: number;
}

// Group Chat Types
export interface ChatMessage {
  id: string;
  persona: 'founder' | 'investor' | 'mentor' | 'customer' | 'user';
  content: string;
  timestamp: string;
  avatarUrl?: string;
}

export interface ChatPersona {
  id: string;
  name: string;
  role: 'founder' | 'investor' | 'mentor' | 'customer' | 'user';
  avatarUrl?: string;
}

// Analytics Types
export interface ProjectMetrics {
  totalProjects: number;
  completedProjects: number;
  averageFeedbackScore: number;
  projectsByStage: Record<ProjectStage, number>;
}
