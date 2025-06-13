// supa_database/types/database.ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          university: string | null
          access_code: string | null
          subscription_tier: 'free' | 'premium' | 'enterprise'
          credits_remaining: number
          created_at: string
          updated_at: string
          last_login: string | null
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          university?: string | null
          access_code?: string | null
          subscription_tier?: 'free' | 'premium' | 'enterprise'
          credits_remaining?: number
          created_at?: string
          updated_at?: string
          last_login?: string | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          university?: string | null
          access_code?: string | null
          subscription_tier?: 'free' | 'premium' | 'enterprise'
          credits_remaining?: number
          created_at?: string
          updated_at?: string
          last_login?: string | null
        }
      }
      projects: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          industry: string | null
          target_market: string | null
          status: 'draft' | 'analyzing' | 'completed' | 'archived'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          industry?: string | null
          target_market?: string | null
          status?: 'draft' | 'analyzing' | 'completed' | 'archived'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          industry?: string | null
          target_market?: string | null
          status?: 'draft' | 'analyzing' | 'completed' | 'archived'
          created_at?: string
          updated_at?: string
        }
      }
      personas: {
        Row: {
          id: string
          project_id: string
          name: string
          role: string
          company: string | null
          description: string
          pain_points: Json
          goals: Json
          demographics: Json
          ai_generated: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          name: string
          role: string
          company?: string | null
          description: string
          pain_points: Json
          goals: Json
          demographics: Json
          ai_generated?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          name?: string
          role?: string
          company?: string | null
          description?: string
          pain_points?: Json
          goals?: Json
          demographics?: Json
          ai_generated?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      project_analysis: {
        Row: {
          id: string
          project_id: string
          analysis_type: 'market_validation' | 'competitive_analysis' | 'pitch_review' | 'persona_feedback'
          content: Json
          insights: Json
          confidence_score: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          analysis_type: 'market_validation' | 'competitive_analysis' | 'pitch_review' | 'persona_feedback'
          content: Json
          insights: Json
          confidence_score?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          analysis_type?: 'market_validation' | 'competitive_analysis' | 'pitch_review' | 'persona_feedback'
          content?: Json
          insights?: Json
          confidence_score?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      chat_messages: {
        Row: {
          id: string
          project_id: string
          persona_id: string | null
          sender_type: 'user' | 'ai' | 'persona'
          message: string
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          persona_id?: string | null
          sender_type: 'user' | 'ai' | 'persona'
          message: string
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          persona_id?: string | null
          sender_type?: 'user' | 'ai' | 'persona'
          message?: string
          metadata?: Json | null
          created_at?: string
        }
      }
      access_codes: {
        Row: {
          id: string
          code: string
          university: string
          max_uses: number | null
          current_uses: number
          expires_at: string | null
          created_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          code: string
          university: string
          max_uses?: number | null
          current_uses?: number
          expires_at?: string | null
          created_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          code?: string
          university?: string
          max_uses?: number | null
          current_uses?: number
          expires_at?: string | null
          created_at?: string
          created_by?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Custom types for application use
export interface UserProfile {
  id: string
  email: string
  full_name?: string
  university?: string
  subscription_tier: 'free' | 'premium' | 'enterprise'
  credits_remaining: number
}

interface MetricValue {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  tooltip: string;
}

interface ProjectMetrics {
  Potential: {
    TAM: MetricValue;
    PEs: MetricValue;
    MGR: MetricValue;
    PMS: MetricValue;
  };
  Profitability: {
    CAC: MetricValue;
    CLTV: MetricValue;
    CAC_CLTV_ratio: MetricValue;
    Avg_gross_margin: MetricValue;
    CAC_Payback: MetricValue;
  };
  Time_to_Market: {
    Sales_Cycle: MetricValue;
    Time_to_MVP: MetricValue;
    Seed_to_Launch: MetricValue;
    Time_to_revenue: MetricValue;
  };
}

interface AnalysisSection {
  title: string;
  content: string;
}

interface ProjectAnalysisData {
  Key_Trends: {
    title: string;
    summary: string;
    sections: AnalysisSection[];
  };
  Netnographic: {
    title: string;
    summary: string;
    sections: AnalysisSection[];
  };
}

interface ProjectOverview {
  Problem: string;
  Solution: string;
  Target_Market: string;
  Business_Model: string;
  Competition: string;
  Unique_selling_point: string;
  Marketing_Strategy: string;
}

// The main, corrected Project type
export interface Project {
  id: string;
  user_id: string;
  name: string; // Changed from title to name
  description: string;
  industry: string;
  created_at: string;
  updated_at: string;
  locked: boolean;
  description_completeness: number;
  stage: 'Idea' | 'Prototype' | 'MVP' | 'Series A' | 'Series B' | 'Series C'; // Changed from status to stage
  files: any[];
  overview: ProjectOverview | null;
  metrics: ProjectMetrics | null;
  analysis: ProjectAnalysisData | null;
  deck: any | null;
}

export interface Persona {
  id: string
  project_id: string
  name: string
  role: string
  company?: string
  description: string
  pain_points: string[]
  goals: string[]
  demographics: Record<string, any>
  ai_generated: boolean
}

export interface ChatMessage {
  id: string
  project_id: string
  persona_id?: string
  sender_type: 'user' | 'ai' | 'persona'
  message: string
  metadata?: Record<string, any>
  created_at: string
}

export interface ProjectAnalysis {
  id: string
  project_id: string
  analysis_type: 'market_validation' | 'competitive_analysis' | 'pitch_review' | 'persona_feedback'
  content: Record<string, any>
  insights: Record<string, any>
  confidence_score?: number
  created_at: string
}
