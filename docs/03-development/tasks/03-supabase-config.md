# COMMON-03 - Supabase Configuration

**ID**: COMMON-03  
**Phase**: 0 (Setup)  
**Priority**: P0 (Critique)  
**Effort**: 3 heures  
**Status**: ðŸ”´ TODO  
**Branch**: `feature/phase0-setup`

---

## ðŸ“‹ Description

Configurer complÃ¨tement l'infrastructure Supabase pour le projet Formelio : crÃ©ation du projet, configuration de la base de donnÃ©es PostgreSQL, mise en place des politiques Row Level Security (RLS), configuration du storage pour les documents, et initialisation des tables nÃ©cessaires.

---

## ðŸŽ¯ Objectifs

1. CrÃ©er un projet Supabase en rÃ©gion EU
2. Configurer toutes les tables de la base de donnÃ©es
3. ImplÃ©menter les Row Level Security policies
4. Configurer le storage pour les documents PDF
5. CrÃ©er les fonctions et triggers nÃ©cessaires
6. GÃ©nÃ©rer les types TypeScript depuis le schÃ©ma

---

## âœ… Acceptance Criteria

- [ ] Projet Supabase crÃ©Ã© et accessible
- [ ] Variables d'environnement configurÃ©es (`.env.local`)
- [ ] SchÃ©ma SQL appliquÃ© avec succÃ¨s
- [ ] RLS activÃ© sur toutes les tables
- [ ] Policies de sÃ©curitÃ© testÃ©es et validÃ©es
- [ ] Storage bucket configurÃ© pour les documents
- [ ] Types TypeScript gÃ©nÃ©rÃ©s (`supabase/types.ts`)
- [ ] Seed data crÃ©Ã© pour le dÃ©veloppement
- [ ] Documentation des credentials (dans .env.example)

---

## ðŸ”§ Technical Implementation

### 1. CrÃ©ation du projet Supabase

```bash
# Via Supabase Dashboard (https://supabase.com)
# 1. New Project
# 2. Organization: Formelio
# 3. Project name: formelio-prod (ou formelio-dev pour dev)
# 4. Database password: [SECURE_PASSWORD]
# 5. Region: Europe (Frankfurt eu-central-1)
# 6. Pricing plan: Free tier pour dev, Pro pour prod
```

### 2. Configuration des variables d'environnement

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. SchÃ©ma SQL complet

CrÃ©er `supabase/migrations/20251028000001_initial_schema.sql` :

```sql
-- =====================================================
-- FORMELIO DATABASE SCHEMA
-- Version: 1.0
-- Date: Octobre 2025
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLES
-- =====================================================

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  profession TEXT CHECK (profession IN ('expert-comptable', 'avocat', 'notaire', 'autre')),
  company_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cases table
CREATE TABLE public.cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reference TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('rejected', 'complex', 'audit')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (
    status IN ('pending', 'in_progress', 'blocked', 'resolved', 'validated', 'cancelled')
  ),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  assigned_to UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  closed_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Documents table
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  document_type TEXT CHECK (
    document_type IN ('kbis', 'statuts', 'pv', 'justificatif', 'autre')
  ),
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Messages table (for chat)
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id),
  content TEXT NOT NULL,
  has_attachment BOOLEAN DEFAULT FALSE,
  attachment_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  read_at TIMESTAMPTZ,
  edited_at TIMESTAMPTZ
);

-- Transactions table
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'EUR',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (
    status IN ('pending', 'paid', 'failed', 'refunded', 'cancelled')
  ),
  payment_method TEXT CHECK (payment_method IN ('card', 'bank_transfer', 'other')),
  stripe_payment_intent_id TEXT UNIQUE,
  stripe_charge_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Invoices table
CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id UUID NOT NULL REFERENCES public.transactions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  invoice_number TEXT UNIQUE NOT NULL,
  pdf_path TEXT,
  amount_ht DECIMAL(10, 2) NOT NULL,
  amount_ttc DECIMAL(10, 2) NOT NULL,
  tva_rate DECIMAL(5, 2) DEFAULT 20.00,
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  due_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (
    type IN ('case_update', 'message', 'payment', 'document', 'system')
  ),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================

-- Cases
CREATE INDEX idx_cases_user_id ON public.cases(user_id);
CREATE INDEX idx_cases_status ON public.cases(status);
CREATE INDEX idx_cases_created_at ON public.cases(created_at DESC);
CREATE INDEX idx_cases_reference ON public.cases(reference);

-- Documents
CREATE INDEX idx_documents_case_id ON public.documents(case_id);
CREATE INDEX idx_documents_user_id ON public.documents(user_id);
CREATE INDEX idx_documents_uploaded_at ON public.documents(uploaded_at DESC);

-- Messages
CREATE INDEX idx_messages_case_id ON public.messages(case_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);
CREATE INDEX idx_messages_sender_id ON public.messages(sender_id);

-- Transactions
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_status ON public.transactions(status);
CREATE INDEX idx_transactions_created_at ON public.transactions(created_at DESC);

-- Notifications
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_read_at ON public.notifications(read_at);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Auto-generate case reference
CREATE OR REPLACE FUNCTION generate_case_reference()
RETURNS TEXT AS $$
DECLARE
  new_reference TEXT;
  reference_exists BOOLEAN;
BEGIN
  LOOP
    -- Format: FOR-YYYYMMDD-XXXX
    new_reference := 'FOR-' || 
                     TO_CHAR(NOW(), 'YYYYMMDD') || '-' ||
                     LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
    
    -- Check if exists
    SELECT EXISTS(SELECT 1 FROM public.cases WHERE reference = new_reference) 
    INTO reference_exists;
    
    EXIT WHEN NOT reference_exists;
  END LOOP;
  
  RETURN new_reference;
END;
$$ LANGUAGE plpgsql;

-- Auto-generate invoice number
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TEXT AS $$
DECLARE
  new_number TEXT;
  year TEXT;
  counter INTEGER;
BEGIN
  year := TO_CHAR(NOW(), 'YYYY');
  
  -- Get next counter for this year
  SELECT COALESCE(MAX(
    CAST(SUBSTRING(invoice_number FROM 'FA' || year || '-([0-9]+)') AS INTEGER)
  ), 0) + 1
  INTO counter
  FROM public.invoices
  WHERE invoice_number LIKE 'FA' || year || '-%';
  
  -- Format: FA-YYYY-NNNN
  new_number := 'FA-' || year || '-' || LPAD(counter::TEXT, 4, '0');
  
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Auto-set case reference
CREATE TRIGGER set_case_reference
  BEFORE INSERT ON public.cases
  FOR EACH ROW
  WHEN (NEW.reference IS NULL)
  EXECUTE FUNCTION (
    SELECT generate_case_reference() INTO NEW.reference;
  );

-- Update timestamps
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cases_updated_at
  BEFORE UPDATE ON public.cases
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Cases policies
CREATE POLICY "Users can view own cases"
  ON public.cases FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own cases"
  ON public.cases FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cases"
  ON public.cases FOR UPDATE
  USING (auth.uid() = user_id);

-- Documents policies
CREATE POLICY "Users can view own documents"
  ON public.documents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can upload documents"
  ON public.documents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own documents"
  ON public.documents FOR DELETE
  USING (auth.uid() = user_id);

-- Messages policies
CREATE POLICY "Users can view messages from own cases"
  ON public.messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.cases
      WHERE cases.id = messages.case_id
      AND cases.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can send messages to own cases"
  ON public.messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM public.cases
      WHERE cases.id = case_id
      AND cases.user_id = auth.uid()
    )
  );

-- Transactions policies
CREATE POLICY "Users can view own transactions"
  ON public.transactions FOR SELECT
  USING (auth.uid() = user_id);

-- Invoices policies
CREATE POLICY "Users can view own invoices"
  ON public.invoices FOR SELECT
  USING (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- =====================================================
-- STORAGE
-- =====================================================

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('documents', 'documents', false),
  ('invoices', 'invoices', false),
  ('avatars', 'avatars', true);

-- Storage policies for documents
CREATE POLICY "Users can upload documents"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view own documents"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own documents"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policies for avatars (public)
CREATE POLICY "Anyone can view avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- =====================================================
-- SEED DATA (Development only)
-- =====================================================

-- Note: Ã€ exÃ©cuter uniquement en dÃ©veloppement
-- CREATE OR REPLACE FUNCTION seed_dev_data() RETURNS void AS $$
-- BEGIN
--   -- Seed profiles, cases, etc.
-- END;
-- $$ LANGUAGE plpgsql;
```

### 4. GÃ©nÃ©rer les types TypeScript

```bash
# Installation Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref your-project-ref

# Generate types
supabase gen types typescript --project-id your-project-ref > lib/supabase/database.types.ts
```

### 5. CrÃ©er les helpers Supabase

```typescript
// lib/supabase/database.types.ts (gÃ©nÃ©rÃ©)
export type Json = /* ... */;
export interface Database {
  public: {
    Tables: {
      profiles: { /* ... */ },
      cases: { /* ... */ },
      // ...
    }
  }
}

// types/database.ts (helpers)
import { Database } from '@/lib/supabase/database.types';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Case = Database['public']['Tables']['cases']['Row'];
export type Document = Database['public']['Tables']['documents']['Row'];
export type Message = Database['public']['Tables']['messages']['Row'];
export type Transaction = Database['public']['Tables']['transactions']['Row'];
export type Invoice = Database['public']['Tables']['invoices']['Row'];

export type CaseInsert = Database['public']['Tables']['cases']['Insert'];
export type CaseUpdate = Database['public']['Tables']['cases']['Update'];
```

---

## ðŸ“— Dependencies

### Prerequisite
- âœ… COMMON-01: Project Setup (Next.js initialisÃ©)
- âœ… Compte Supabase crÃ©Ã©

### Bloquant pour
- âŒ P2-01: Auth System (nÃ©cessite les tables)
- âŒ P2-02: Dashboard Layout
- âŒ Toutes les tasks Phase 2 et 3

---

## ðŸ§ª Testing

### 1. VÃ©rifier la connexion

```typescript
// test-supabase-connection.ts
import { createClient } from '@/lib/supabase/client';

async function testConnection() {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .limit(1);
  
  if (error) {
    console.error('Connection failed:', error);
  } else {
    console.log('Connection successful!', data);
  }
}

testConnection();
```

### 2. Tester les RLS policies

```typescript
// test-rls.ts
async function testRLS() {
  const supabase = createClient();
  
  // Test: user can only see their own data
  const { data: cases } = await supabase
    .from('cases')
    .select('*');
  
  console.log('User cases:', cases);
  // Should only return cases where user_id = auth.uid()
}
```

### 3. Tester le storage

```typescript
// test-storage.ts
async function testStorage() {
  const supabase = createClient();
  const userId = (await supabase.auth.getUser()).data.user?.id;
  
  // Upload test file
  const { data, error } = await supabase.storage
    .from('documents')
    .upload(`${userId}/test.pdf`, file);
  
  console.log('Upload result:', data, error);
}
```

---

## ðŸ“š Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage Guide](https://supabase.com/docs/guides/storage)
- [PostgreSQL Functions](https://www.postgresql.org/docs/current/sql-createfunction.html)

---

## âš ï¸ Potential Issues

### Issue 1: RLS policies trop restrictives
**Symptom**: Erreurs 403 lors des requÃªtes  
**Solution**: VÃ©rifier les policies avec `SELECT * FROM pg_policies WHERE tablename = 'cases'`

### Issue 2: Storage upload Ã©choue
**Symptom**: Erreur lors de l'upload de fichiers  
**Solution**: VÃ©rifier les policies storage ET la taille max des fichiers (config bucket)

### Issue 3: Types TypeScript non Ã  jour
**Symptom**: Erreurs TypeScript aprÃ¨s changement de schÃ©ma  
**Solution**: Re-gÃ©nÃ©rer les types avec `supabase gen types`

---

## ðŸ‘¤ Assignee

DevOps / Backend developer

---

## ðŸ Completion Checklist

- [ ] Projet Supabase crÃ©Ã© en rÃ©gion EU
- [ ] Variables `.env.local` configurÃ©es
- [ ] Migration SQL exÃ©cutÃ©e avec succÃ¨s
- [ ] Toutes les tables crÃ©Ã©es
- [ ] RLS activÃ© et policies testÃ©es
- [ ] Storage buckets configurÃ©s
- [ ] Types TypeScript gÃ©nÃ©rÃ©s
- [ ] Connexion Supabase testÃ©e
- [ ] Seed data crÃ©Ã© (optionnel, dev)
- [ ] Documentation mise Ã  jour
- [ ] Commit: `feat(supabase): setup database and RLS`
- [ ] PR mergÃ©e dans `feature/phase0-setup`

---

**Estimated time**: 3 heures  
**Actual time**: ___ heures  
**Completed**: ___/___/2025
