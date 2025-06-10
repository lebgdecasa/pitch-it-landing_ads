-- supa_database/schema/init.sql
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE subscription_tier AS ENUM ('free', 'premium', 'enterprise');
CREATE TYPE project_status AS ENUM ('draft', 'analyzing', 'completed', 'archived');
CREATE TYPE analysis_type AS ENUM ('market_validation', 'competitive_analysis', 'pitch_review', 'persona_feedback');
CREATE TYPE sender_type AS ENUM ('user', 'ai', 'persona');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    university TEXT,
    access_code TEXT,
    subscription_tier subscription_tier DEFAULT 'free',
    credits_remaining INTEGER DEFAULT 3,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- Access codes table for student verification
CREATE TABLE public.access_codes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    university TEXT NOT NULL,
    max_uses INTEGER,
    current_uses INTEGER DEFAULT 0,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES public.users(id)
);

-- Projects table
CREATE TABLE public.projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    industry TEXT,
    target_market TEXT,
    status project_status DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Personas table
CREATE TABLE public.personas (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    company TEXT,
    description TEXT NOT NULL,
    pain_points JSONB DEFAULT '[]',
    goals JSONB DEFAULT '[]',
    demographics JSONB DEFAULT '{}',
    ai_generated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project analysis table
CREATE TABLE public.project_analysis (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    analysis_type analysis_type NOT NULL,
    content JSONB NOT NULL DEFAULT '{}',
    insights JSONB NOT NULL DEFAULT '{}',
    confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat messages table
CREATE TABLE public.chat_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    persona_id UUID REFERENCES public.personas(id) ON DELETE SET NULL,
    sender_type sender_type NOT NULL,
    message TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_access_code ON public.users(access_code);
CREATE INDEX idx_projects_user_id ON public.projects(user_id);
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_personas_project_id ON public.personas(project_id);
CREATE INDEX idx_project_analysis_project_id ON public.project_analysis(project_id);
CREATE INDEX idx_project_analysis_type ON public.project_analysis(analysis_type);
CREATE INDEX idx_chat_messages_project_id ON public.chat_messages(project_id);
CREATE INDEX idx_chat_messages_persona_id ON public.chat_messages(persona_id);
CREATE INDEX idx_chat_messages_created_at ON public.chat_messages(created_at);
CREATE INDEX idx_access_codes_code ON public.access_codes(code);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.access_codes ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users can only see and edit their own profile
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Projects policies
CREATE POLICY "Users can view own projects" ON public.projects
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own projects" ON public.projects
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects" ON public.projects
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects" ON public.projects
    FOR DELETE USING (auth.uid() = user_id);

-- Personas policies
CREATE POLICY "Users can view personas of own projects" ON public.personas
    FOR SELECT USING (
        auth.uid() IN (
            SELECT user_id FROM public.projects WHERE id = project_id
        )
    );

CREATE POLICY "Users can create personas for own projects" ON public.personas
    FOR INSERT WITH CHECK (
        auth.uid() IN (
            SELECT user_id FROM public.projects WHERE id = project_id
        )
    );

CREATE POLICY "Users can update personas of own projects" ON public.personas
    FOR UPDATE USING (
        auth.uid() IN (
            SELECT user_id FROM public.projects WHERE id = project_id
        )
    );

CREATE POLICY "Users can delete personas of own projects" ON public.personas
    FOR DELETE USING (
        auth.uid() IN (
            SELECT user_id FROM public.projects WHERE id = project_id
        )
    );

-- Project analysis policies
CREATE POLICY "Users can view analysis of own projects" ON public.project_analysis
    FOR SELECT USING (
        auth.uid() IN (
            SELECT user_id FROM public.projects WHERE id = project_id
        )
    );

CREATE POLICY "Users can create analysis for own projects" ON public.project_analysis
    FOR INSERT WITH CHECK (
        auth.uid() IN (
            SELECT user_id FROM public.projects WHERE id = project_id
        )
    );

CREATE POLICY "Users can update analysis of own projects" ON public.project_analysis
    FOR UPDATE USING (
        auth.uid() IN (
            SELECT user_id FROM public.projects WHERE id = project_id
        )
    );

-- Chat messages policies
CREATE POLICY "Users can view messages of own projects" ON public.chat_messages
    FOR SELECT USING (
        auth.uid() IN (
            SELECT user_id FROM public.projects WHERE id = project_id
        )
    );

CREATE POLICY "Users can create messages for own projects" ON public.chat_messages
    FOR INSERT WITH CHECK (
        auth.uid() IN (
            SELECT user_id FROM public.projects WHERE id = project_id
        )
    );

-- Access codes policies (public read for validation)
CREATE POLICY "Anyone can read access codes for validation" ON public.access_codes
    FOR SELECT USING (true);

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER set_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_personas_updated_at
    BEFORE UPDATE ON public.personas
    FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_project_analysis_updated_at
    BEFORE UPDATE ON public.project_analysis
    FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email)
    VALUES (NEW.id, NEW.email);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to validate access code
CREATE OR REPLACE FUNCTION validate_access_code(input_code TEXT)
RETURNS TABLE(valid BOOLEAN, university TEXT) AS $$
BEGIN
    RETURN QUERY
    SELECT
        (ac.max_uses IS NULL OR ac.current_uses < ac.max_uses) AND
        (ac.expires_at IS NULL OR ac.expires_at > NOW()) AS valid,
        ac.university
    FROM public.access_codes ac
    WHERE ac.code = input_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to use access code
CREATE OR REPLACE FUNCTION use_access_code(input_code TEXT, user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    code_record RECORD;
BEGIN
    SELECT * INTO code_record
    FROM public.access_codes
    WHERE code = input_code
    AND (max_uses IS NULL OR current_uses < max_uses)
    AND (expires_at IS NULL OR expires_at > NOW());

    IF FOUND THEN
        UPDATE public.access_codes
        SET current_uses = current_uses + 1
        WHERE id = code_record.id;

        UPDATE public.users
        SET access_code = input_code, university = code_record.university
        WHERE id = user_id;

        RETURN TRUE;
    ELSE
        RETURN FALSE;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
