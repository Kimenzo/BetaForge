-- =============================================
-- BetaForge Vector Database Schema
-- Migration: Enable pgvector and create tables
-- =============================================
-- Run this AFTER the base schema.sql

-- Enable pgvector extension (requires Supabase to have it enabled)
CREATE EXTENSION IF NOT EXISTS vector;

-- =============================================
-- Vector Embeddings Storage
-- =============================================

-- Documents table for general vector storage
CREATE TABLE IF NOT EXISTS document_embeddings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  embedding vector(1024), -- Jina v3 default, adjust based on provider
  metadata JSONB DEFAULT '{}',
  document_type TEXT NOT NULL DEFAULT 'general',
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bug report embeddings for semantic deduplication
CREATE TABLE IF NOT EXISTS bug_embeddings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bug_report_id UUID REFERENCES bug_reports(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  embedding vector(1024),
  content_hash TEXT NOT NULL, -- For quick duplicate check
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agent memory embeddings for semantic retrieval
CREATE TABLE IF NOT EXISTS agent_memory_embeddings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id TEXT NOT NULL,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  session_id UUID REFERENCES test_sessions(id) ON DELETE SET NULL,
  memory_type TEXT NOT NULL CHECK (memory_type IN (
    'observation', 'action', 'reflection', 
    'bug-pattern', 'user-preference', 'conversation'
  )),
  content TEXT NOT NULL,
  embedding vector(1024),
  importance FLOAT DEFAULT 0.5 CHECK (importance >= 0 AND importance <= 1),
  metadata JSONB DEFAULT '{}',
  access_count INTEGER DEFAULT 0,
  accessed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Knowledge base embeddings
CREATE TABLE IF NOT EXISTS knowledge_embeddings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT NOT NULL CHECK (category IN (
    'testing-pattern', 'bug-pattern', 'ux-guideline',
    'accessibility', 'platform-quirk', 'reproduction-step', 'fix-suggestion'
  )),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  embedding vector(1024),
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  source TEXT NOT NULL DEFAULT 'system' CHECK (source IN ('system', 'learned', 'user-defined')),
  confidence FLOAT DEFAULT 0.8 CHECK (confidence >= 0 AND confidence <= 1),
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- Vector Search Indexes (IVFFlat for performance)
-- =============================================

-- Create indexes for fast similarity search
-- IVFFlat is faster for large datasets, HNSW is more accurate but uses more memory

CREATE INDEX IF NOT EXISTS idx_document_embeddings_vector 
  ON document_embeddings 
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

CREATE INDEX IF NOT EXISTS idx_bug_embeddings_vector 
  ON bug_embeddings 
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

CREATE INDEX IF NOT EXISTS idx_agent_memory_embeddings_vector 
  ON agent_memory_embeddings 
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

CREATE INDEX IF NOT EXISTS idx_knowledge_embeddings_vector 
  ON knowledge_embeddings 
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- Additional indexes for filtering
CREATE INDEX IF NOT EXISTS idx_document_embeddings_project 
  ON document_embeddings(project_id);
CREATE INDEX IF NOT EXISTS idx_document_embeddings_type 
  ON document_embeddings(document_type);

CREATE INDEX IF NOT EXISTS idx_bug_embeddings_project 
  ON bug_embeddings(project_id);

CREATE INDEX IF NOT EXISTS idx_agent_memory_project_agent 
  ON agent_memory_embeddings(project_id, agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_memory_type 
  ON agent_memory_embeddings(memory_type);

CREATE INDEX IF NOT EXISTS idx_knowledge_category 
  ON knowledge_embeddings(category);
CREATE INDEX IF NOT EXISTS idx_knowledge_tags 
  ON knowledge_embeddings USING GIN(tags);

-- =============================================
-- Vector Search Functions
-- =============================================

-- Semantic search for documents
CREATE OR REPLACE FUNCTION search_documents(
  query_embedding vector(1024),
  match_threshold FLOAT DEFAULT 0.7,
  match_count INT DEFAULT 10,
  filter_project_id UUID DEFAULT NULL,
  filter_type TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  metadata JSONB,
  document_type TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    de.id,
    de.content,
    de.metadata,
    de.document_type,
    1 - (de.embedding <=> query_embedding) AS similarity
  FROM document_embeddings de
  WHERE 
    (filter_project_id IS NULL OR de.project_id = filter_project_id)
    AND (filter_type IS NULL OR de.document_type = filter_type)
    AND 1 - (de.embedding <=> query_embedding) > match_threshold
  ORDER BY de.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Find similar bugs for deduplication
CREATE OR REPLACE FUNCTION find_similar_bugs(
  query_embedding vector(1024),
  target_project_id UUID,
  match_threshold FLOAT DEFAULT 0.85,
  match_count INT DEFAULT 5
)
RETURNS TABLE (
  bug_report_id UUID,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    be.bug_report_id,
    1 - (be.embedding <=> query_embedding) AS similarity
  FROM bug_embeddings be
  WHERE 
    be.project_id = target_project_id
    AND 1 - (be.embedding <=> query_embedding) > match_threshold
  ORDER BY be.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Search agent memories
CREATE OR REPLACE FUNCTION search_agent_memories(
  query_embedding vector(1024),
  target_agent_id TEXT,
  target_project_id UUID,
  memory_types TEXT[] DEFAULT NULL,
  match_threshold FLOAT DEFAULT 0.6,
  match_count INT DEFAULT 20,
  min_importance FLOAT DEFAULT 0.0
)
RETURNS TABLE (
  id UUID,
  memory_type TEXT,
  content TEXT,
  importance FLOAT,
  metadata JSONB,
  similarity FLOAT,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ame.id,
    ame.memory_type,
    ame.content,
    ame.importance,
    ame.metadata,
    1 - (ame.embedding <=> query_embedding) AS similarity,
    ame.created_at
  FROM agent_memory_embeddings ame
  WHERE 
    ame.agent_id = target_agent_id
    AND ame.project_id = target_project_id
    AND ame.importance >= min_importance
    AND (memory_types IS NULL OR ame.memory_type = ANY(memory_types))
    AND 1 - (ame.embedding <=> query_embedding) > match_threshold
  ORDER BY 
    -- Rank by combination of similarity and importance
    (1 - (ame.embedding <=> query_embedding)) * 0.7 + ame.importance * 0.3 DESC
  LIMIT match_count;
END;
$$;

-- Search knowledge base
CREATE OR REPLACE FUNCTION search_knowledge(
  query_embedding vector(1024),
  categories TEXT[] DEFAULT NULL,
  filter_tags TEXT[] DEFAULT NULL,
  match_threshold FLOAT DEFAULT 0.6,
  match_count INT DEFAULT 10,
  min_confidence FLOAT DEFAULT 0.5
)
RETURNS TABLE (
  id UUID,
  category TEXT,
  title TEXT,
  content TEXT,
  tags TEXT[],
  confidence FLOAT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ke.id,
    ke.category,
    ke.title,
    ke.content,
    ke.tags,
    ke.confidence,
    1 - (ke.embedding <=> query_embedding) AS similarity
  FROM knowledge_embeddings ke
  WHERE 
    ke.confidence >= min_confidence
    AND (categories IS NULL OR ke.category = ANY(categories))
    AND (filter_tags IS NULL OR ke.tags && filter_tags)
    AND 1 - (ke.embedding <=> query_embedding) > match_threshold
  ORDER BY ke.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- =============================================
-- Row Level Security
-- =============================================

ALTER TABLE document_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE bug_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_memory_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_embeddings ENABLE ROW LEVEL SECURITY;

-- Document embeddings: Users can access their project's documents
CREATE POLICY "Users can view project documents" ON document_embeddings
  FOR SELECT USING (
    project_id IS NULL OR
    EXISTS (SELECT 1 FROM projects WHERE projects.id = document_embeddings.project_id AND projects.user_id = auth.uid())
  );

CREATE POLICY "Users can create project documents" ON document_embeddings
  FOR INSERT WITH CHECK (
    project_id IS NULL OR
    EXISTS (SELECT 1 FROM projects WHERE projects.id = document_embeddings.project_id AND projects.user_id = auth.uid())
  );

-- Bug embeddings: Follow project ownership
CREATE POLICY "Users can view bug embeddings" ON bug_embeddings
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = bug_embeddings.project_id AND projects.user_id = auth.uid())
  );

CREATE POLICY "Users can create bug embeddings" ON bug_embeddings
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = bug_embeddings.project_id AND projects.user_id = auth.uid())
  );

-- Agent memories: Follow project ownership  
CREATE POLICY "Users can view agent memories" ON agent_memory_embeddings
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = agent_memory_embeddings.project_id AND projects.user_id = auth.uid())
  );

CREATE POLICY "Users can create agent memories" ON agent_memory_embeddings
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = agent_memory_embeddings.project_id AND projects.user_id = auth.uid())
  );

-- Knowledge base: Everyone can read system knowledge
CREATE POLICY "Everyone can view knowledge" ON knowledge_embeddings
  FOR SELECT USING (true);

-- Only service role can insert knowledge (or add user-specific policies)
CREATE POLICY "Service can manage knowledge" ON knowledge_embeddings
  FOR ALL USING (auth.role() = 'service_role');

-- =============================================
-- Trigger to update accessed_at on memory read
-- =============================================

CREATE OR REPLACE FUNCTION update_memory_access()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE agent_memory_embeddings 
  SET 
    access_count = access_count + 1,
    accessed_at = NOW()
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
