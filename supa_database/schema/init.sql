-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.access_codes (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  code text NOT NULL UNIQUE,
  university text NOT NULL,
  max_uses integer,
  current_uses integer DEFAULT 0,
  expires_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  created_by uuid,
  CONSTRAINT access_codes_pkey PRIMARY KEY (id),
  CONSTRAINT access_codes_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id)
);
CREATE TABLE public.chat_messages (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  project_id uuid NOT NULL,
  content text NOT NULL,
  sender character varying NOT NULL,
  sender_type character varying NOT NULL CHECK (sender_type::text = ANY (ARRAY['user'::character varying, 'persona'::character varying]::text[])),
  persona_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  mentions jsonb,
  CONSTRAINT chat_messages_pkey PRIMARY KEY (id),
  CONSTRAINT chat_messages_persona_id_fkey FOREIGN KEY (persona_id) REFERENCES public.personas(id),
  CONSTRAINT chat_messages_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id)
);
CREATE TABLE public.personas (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  project_id uuid NOT NULL,
  name text NOT NULL,
  role text NOT NULL,
  company text,
  description text NOT NULL,
  pain_points jsonb DEFAULT '[]'::jsonb,
  goals jsonb DEFAULT '[]'::jsonb,
  demographics jsonb DEFAULT '{}'::jsonb,
  ai_generated boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  prompt text,
  CONSTRAINT personas_pkey PRIMARY KEY (id),
  CONSTRAINT personas_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id)
);
CREATE TABLE public.projects (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  description text,
  industry text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  locked boolean DEFAULT true,
  description_completeness numeric CHECK (description_completeness >= 0.0 AND description_completeness <= 1.0),
  stage USER-DEFINED,
  files jsonb DEFAULT '[]'::jsonb,
  overview jsonb DEFAULT '{}'::jsonb,
  metrics jsonb DEFAULT '{}'::jsonb,
  analysis jsonb DEFAULT '{}'::jsonb,
  deck jsonb,
  status text,
  CONSTRAINT projects_pkey PRIMARY KEY (id),
  CONSTRAINT projects_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.users (
  id uuid NOT NULL,
  email text NOT NULL UNIQUE,
  full_name text,
  university text,
  access_code text,
  subscription_tier USER-DEFINED DEFAULT 'free'::subscription_tier,
  credits_remaining integer DEFAULT 3,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  last_login timestamp with time zone,
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
