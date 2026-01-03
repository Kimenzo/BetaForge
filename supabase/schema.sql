-- BetaForge Database Schema for Supabase
-- Run this in the Supabase SQL Editor to set up your database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  platform TEXT[] DEFAULT ARRAY['web'],
  access_url TEXT,
  app_package BYTEA,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Test Sessions table
CREATE TABLE IF NOT EXISTS test_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'queued' CHECK (status IN ('queued', 'running', 'completed', 'failed')),
  trigger_type TEXT DEFAULT 'manual' CHECK (trigger_type IN ('manual', 'webhook', 'scheduled')),
  trigger_metadata JSONB DEFAULT '{}',
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agent Executions table
CREATE TABLE IF NOT EXISTS agent_executions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES test_sessions(id) ON DELETE CASCADE,
  agent_persona TEXT NOT NULL,
  status TEXT DEFAULT 'queued' CHECK (status IN ('queued', 'running', 'completed', 'failed')),
  environment_config JSONB DEFAULT '{}',
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  interaction_log JSONB[] DEFAULT ARRAY[]::JSONB[],
  screenshots TEXT[] DEFAULT ARRAY[]::TEXT[],
  screen_recording TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bug Reports table
CREATE TABLE IF NOT EXISTS bug_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  execution_id UUID REFERENCES agent_executions(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  severity TEXT DEFAULT 'medium' CHECK (severity IN ('critical', 'high', 'medium', 'low')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'fixed', 'wont_fix', 'duplicate')),
  title TEXT NOT NULL,
  description TEXT,
  reproduction_steps JSONB[] DEFAULT ARRAY[]::JSONB[],
  expected_behavior TEXT,
  actual_behavior TEXT,
  screenshots TEXT[] DEFAULT ARRAY[]::TEXT[],
  console_errors JSONB[] DEFAULT ARRAY[]::JSONB[],
  network_logs JSONB[] DEFAULT ARRAY[]::JSONB[],
  environment_info JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agent Personas table (for custom agents)
CREATE TABLE IF NOT EXISTS agent_personas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  personality_traits JSONB DEFAULT '[]',
  testing_strategy TEXT,
  system_prompt TEXT,
  device_config JSONB DEFAULT '{}',
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_test_sessions_project_id ON test_sessions(project_id);
CREATE INDEX IF NOT EXISTS idx_test_sessions_status ON test_sessions(status);
CREATE INDEX IF NOT EXISTS idx_agent_executions_session_id ON agent_executions(session_id);
CREATE INDEX IF NOT EXISTS idx_bug_reports_execution_id ON bug_reports(execution_id);
CREATE INDEX IF NOT EXISTS idx_bug_reports_project_id ON bug_reports(project_id);
CREATE INDEX IF NOT EXISTS idx_bug_reports_severity ON bug_reports(severity);
CREATE INDEX IF NOT EXISTS idx_bug_reports_status ON bug_reports(status);

-- Row Level Security (RLS) Policies
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bug_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_personas ENABLE ROW LEVEL SECURITY;

-- Projects: Users can only see their own projects
CREATE POLICY "Users can view own projects" ON projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own projects" ON projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects" ON projects
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects" ON projects
  FOR DELETE USING (auth.uid() = user_id);

-- Test Sessions: Users can only see sessions for their projects
CREATE POLICY "Users can view own test sessions" ON test_sessions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = test_sessions.project_id AND projects.user_id = auth.uid())
  );

CREATE POLICY "Users can create test sessions for own projects" ON test_sessions
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = test_sessions.project_id AND projects.user_id = auth.uid())
  );

-- Agent Executions: Users can only see executions for their sessions
CREATE POLICY "Users can view own agent executions" ON agent_executions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM test_sessions ts
      JOIN projects p ON p.id = ts.project_id
      WHERE ts.id = agent_executions.session_id AND p.user_id = auth.uid()
    )
  );

-- Bug Reports: Users can only see reports for their projects
CREATE POLICY "Users can view own bug reports" ON bug_reports
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = bug_reports.project_id AND projects.user_id = auth.uid())
  );

CREATE POLICY "Users can update own bug reports" ON bug_reports
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = bug_reports.project_id AND projects.user_id = auth.uid())
  );

-- Agent Personas: Users can only see their own custom personas
CREATE POLICY "Users can view own agent personas" ON agent_personas
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own agent personas" ON agent_personas
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own agent personas" ON agent_personas
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own agent personas" ON agent_personas
  FOR DELETE USING (auth.uid() = user_id);

-- Updated at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bug_reports_updated_at
  BEFORE UPDATE ON bug_reports
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agent_personas_updated_at
  BEFORE UPDATE ON agent_personas
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
