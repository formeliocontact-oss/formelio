-- Formelio SaaS - Initial Database Schema
-- Multi-tenant legal case management platform
-- Generated: 2025-01-05

-- ============================================================================
-- EXTENSIONS
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- ENUMS
-- ============================================================================

CREATE TYPE user_role AS ENUM ('admin', 'lawyer', 'assistant', 'client');
CREATE TYPE case_status AS ENUM ('draft', 'active', 'pending', 'closed', 'archived');
CREATE TYPE case_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE document_type AS ENUM ('contract', 'evidence', 'correspondence', 'pleading', 'judgment', 'other');

-- ============================================================================
-- TABLES
-- ============================================================================

-- Organizations (Multi-tenant)
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role user_role DEFAULT 'client',
  avatar_url TEXT,
  phone VARCHAR(50),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cases (Dossiers juridiques)
CREATE TABLE cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  reference VARCHAR(50) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status case_status DEFAULT 'draft',
  priority case_priority DEFAULT 'medium',
  client_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  responsible_lawyer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  due_date DATE,
  closed_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Case Collaborators (Partage de dossiers)
CREATE TABLE case_collaborators (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  can_edit BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(case_id, user_id)
);

-- Documents
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type document_type DEFAULT 'other',
  file_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR(100),
  uploaded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activities (Audit log / Timeline)
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX idx_profiles_organization ON profiles(organization_id);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_cases_organization ON cases(organization_id);
CREATE INDEX idx_cases_status ON cases(status);
CREATE INDEX idx_cases_client ON cases(client_id);
CREATE INDEX idx_cases_lawyer ON cases(responsible_lawyer_id);
CREATE INDEX idx_case_collaborators_case ON case_collaborators(case_id);
CREATE INDEX idx_case_collaborators_user ON case_collaborators(user_id);
CREATE INDEX idx_documents_organization ON documents(organization_id);
CREATE INDEX idx_documents_case ON documents(case_id);
CREATE INDEX idx_activities_organization ON activities(organization_id);
CREATE INDEX idx_activities_case ON activities(case_id);
CREATE INDEX idx_activities_created ON activities(created_at DESC);

-- ============================================================================
-- TRIGGERS (Updated_at)
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER organizations_updated_at BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER cases_updated_at BEFORE UPDATE ON cases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER documents_updated_at BEFORE UPDATE ON documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) - CRITICAL P0
-- ============================================================================

-- Enable RLS on ALL tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

-- Organizations: Users can only see their own organization
CREATE POLICY "Users can view their own organization"
  ON organizations FOR SELECT
  USING (
    id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Profiles: Users can see profiles in their organization
CREATE POLICY "Users can view profiles in their organization"
  ON profiles FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (id = auth.uid());

-- Cases: Users can see cases in their organization or shared with them
CREATE POLICY "Users can view cases in their organization"
  ON cases FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
    OR id IN (
      SELECT case_id FROM case_collaborators WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Lawyers can create cases in their organization"
  ON cases FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'lawyer')
    )
  );

CREATE POLICY "Responsible lawyers can update their cases"
  ON cases FOR UPDATE
  USING (
    responsible_lawyer_id = auth.uid()
    OR id IN (
      SELECT case_id FROM case_collaborators
      WHERE user_id = auth.uid() AND can_edit = TRUE
    )
  );

-- Case Collaborators
CREATE POLICY "Users can view case collaborators for accessible cases"
  ON case_collaborators FOR SELECT
  USING (
    case_id IN (
      SELECT id FROM cases WHERE organization_id IN (
        SELECT organization_id FROM profiles WHERE id = auth.uid()
      )
    )
  );

-- Documents
CREATE POLICY "Users can view documents in accessible cases"
  ON documents FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
    OR case_id IN (
      SELECT case_id FROM case_collaborators WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can upload documents to accessible cases"
  ON documents FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Activities
CREATE POLICY "Users can view activities in their organization"
  ON activities FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
    OR case_id IN (
      SELECT case_id FROM case_collaborators WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create activities"
  ON activities FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Generate unique case reference
CREATE OR REPLACE FUNCTION generate_case_reference(org_id UUID)
RETURNS VARCHAR(50) AS $$
DECLARE
  year VARCHAR(4);
  counter INTEGER;
  reference VARCHAR(50);
BEGIN
  year := EXTRACT(YEAR FROM NOW())::VARCHAR;

  SELECT COUNT(*) + 1 INTO counter
  FROM cases
  WHERE organization_id = org_id
  AND EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM NOW());

  reference := year || '-' || LPAD(counter::TEXT, 5, '0');
  RETURN reference;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- SEED DATA (Development only - remove in production)
-- ============================================================================

-- Example organization
INSERT INTO organizations (id, name, slug) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Cabinet Formelio', 'formelio');

-- Note: Profiles will be created via Supabase Auth signup
-- Example profile (comment out in production):
-- INSERT INTO profiles (id, organization_id, email, first_name, last_name, role) VALUES
--   (auth.uid(), '00000000-0000-0000-0000-000000000001', 'admin@formelio.com', 'Admin', 'Formelio', 'admin');
