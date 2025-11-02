# Guide Row Level Security (RLS) - Formelio

**Version**: 1.0
**Date**: Octobre 2025
**Projet**: Formelio - Sécurité et Performance RLS Supabase

---

## 📋 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Concepts fondamentaux](#concepts-fondamentaux)
3. [Patterns de policies](#patterns-de-policies)
4. [Optimisation de performance](#optimisation-de-performance)
5. [JWT Custom Claims](#jwt-custom-claims)
6. [Multi-Tenant Architecture](#multi-tenant-architecture)
7. [Security Definer Functions](#security-definer-functions)
8. [Common Pitfalls](#common-pitfalls)
9. [Testing RLS](#testing-rls)

---

## Vue d'ensemble

**Row Level Security (RLS)** est le mécanisme de sécurité principal de Supabase qui contrôle l'accès aux données **ligne par ligne** au niveau de la base de données PostgreSQL.

### Pourquoi RLS est critique ?

```
Sans RLS : API publique expose TOUTES les données
Avec RLS : Chaque requête est filtrée automatiquement selon les policies
```

**Analogie** : RLS = WHERE clause automatique sur chaque requête SQL.

```sql
-- User query
SELECT * FROM cases;

-- Avec RLS activé, devient automatiquement :
SELECT * FROM cases WHERE auth.uid() = user_id;
```

---

## Concepts fondamentaux

### Activation RLS

```sql
-- ⚠️ OBLIGATOIRE sur toutes les tables publiques
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
```

**Sans RLS activé** : ❌ Aucune donnée accessible via l'API (clé `anon`)

**Avec RLS activé** : ✅ Données filtrées selon les policies définies

---

### Types de policies

| Type | Clause | Usage |
|------|--------|-------|
| **SELECT** | `USING` | Quelles lignes user peut voir |
| **INSERT** | `WITH CHECK` | Quelles lignes user peut créer |
| **UPDATE** | `USING` + `WITH CHECK` | Lignes modifiables + validation post-update |
| **DELETE** | `USING` | Quelles lignes user peut supprimer |
| **ALL** | `USING` + `WITH CHECK` | Toutes opérations |

---

## Patterns de policies

### 1. SELECT Policy - Lecture des données

```sql
-- ✅ Pattern de base : User voit ses propres cases
CREATE POLICY "users_read_own_cases" ON cases
FOR SELECT
TO authenticated
USING (
  auth.uid() IS NOT NULL AND
  auth.uid() = user_id
);
```

**Explication** :
- `TO authenticated` : Seulement users authentifiés
- `auth.uid() IS NOT NULL` : Protection contre null (CRITIQUE)
- `auth.uid() = user_id` : Filtrage par ownership

---

### 2. INSERT Policy - Création de données

```sql
-- ✅ User peut créer un case pour lui-même uniquement
CREATE POLICY "users_insert_own_cases" ON cases
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL AND
  auth.uid() = user_id
);
```

**IMPORTANT** : `WITH CHECK` valide les **nouvelles valeurs** insérées.

**Protection** :
```typescript
// ❌ Attaque : User essaie de créer un case pour quelqu'un d'autre
await supabase.from('cases').insert({
  title: 'Dossier',
  user_id: 'other-user-id', // ❌ Bloqué par WITH CHECK
});

// ✅ OK : User crée pour lui-même
await supabase.from('cases').insert({
  title: 'Dossier',
  user_id: currentUser.id, // ✅ Autorisé
});
```

---

### 3. UPDATE Policy - Modification

```sql
-- ✅ User peut modifier ses propres cases
CREATE POLICY "users_update_own_cases" ON cases
FOR UPDATE
TO authenticated
USING (
  auth.uid() IS NOT NULL AND
  auth.uid() = user_id
)
WITH CHECK (
  auth.uid() IS NOT NULL AND
  auth.uid() = user_id
);
```

**Double vérification** :
1. `USING` : Vérifie que la ligne **actuelle** appartient au user
2. `WITH CHECK` : Vérifie que la ligne **modifiée** appartient toujours au user

**Protection** :
```typescript
// ❌ Attaque : User essaie de changer le owner
await supabase.from('cases')
  .update({ user_id: 'other-user-id' })
  .eq('id', caseId);
// ❌ Bloqué par WITH CHECK
```

---

### 4. DELETE Policy - Suppression

```sql
-- ✅ User peut supprimer ses propres cases
CREATE POLICY "users_delete_own_cases" ON cases
FOR DELETE
TO authenticated
USING (
  auth.uid() IS NOT NULL AND
  auth.uid() = user_id
);
```

---

### 5. ALL Policy - Toutes opérations

```sql
-- ✅ Admin peut tout faire
CREATE POLICY "admins_all_access" ON cases
FOR ALL
TO authenticated
USING (
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
)
WITH CHECK (
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);
```

---

## Optimisation de performance

### ⚠️ Problème : RLS peut être TRÈS LENT

Sans optimisation, RLS peut ralentir les requêtes de **95-99%**.

**Benchmark** (table 100k lignes) :
```
Sans RLS : 10ms
Avec RLS non optimisé : 2000ms (200x plus lent!)
Avec RLS optimisé : 50ms (5x plus lent seulement)
```

---

### Technique #1 : Ajouter des indexes ⭐ Gain 99.94%

```sql
-- ❌ Sans index
CREATE POLICY "users_select" ON cases
FOR SELECT USING (auth.uid() = user_id);
-- Scan séquentiel de toute la table !

-- ✅ Avec index
CREATE INDEX idx_cases_user_id ON cases(user_id);
-- Index lookup direct !
```

**Règle** : Index sur **toutes** les colonnes utilisées dans RLS policies.

```sql
-- Formelio indexes recommandés
CREATE INDEX idx_cases_user_id ON cases(user_id);
CREATE INDEX idx_documents_case_id ON documents(case_id);
CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_messages_user_id ON messages(user_id);
```

---

### Technique #2 : Wrapper auth.uid() dans SELECT ⭐ Gain 94.97%

```sql
-- ❌ LENT : auth.uid() appelé pour CHAQUE ligne
CREATE POLICY "users_select" ON cases
FOR SELECT USING (auth.uid() = user_id);

-- ✅ RAPIDE : auth.uid() appelé UNE FOIS, mis en cache
CREATE POLICY "users_select_optimized" ON cases
FOR SELECT USING (
  (SELECT auth.uid()) = user_id
);
```

**Raison** : Postgres cache le résultat de `(SELECT auth.uid())` pour toute la requête.

---

### Technique #3 : Toujours spécifier le role ⭐ Gain 99.78%

```sql
-- ❌ LENT : Policy évaluée pour tous les roles
CREATE POLICY "users_select" ON cases
FOR SELECT USING (auth.uid() = user_id);

-- ✅ RAPIDE : Policy ignorée pour role 'anon'
CREATE POLICY "users_select_to_auth" ON cases
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);
```

**Impact** : Un user non authentifié ne déclenchera même pas l'évaluation de la policy.

---

### Technique #4 : Ajouter filtres explicites ⭐ Gain 94.74%

```sql
-- ❌ Requête sans filtre (laisse tout à RLS)
const { data } = await supabase.from('cases').select('*');

-- ✅ Requête avec filtre explicite (aide Postgres à optimiser)
const { data } = await supabase.from('cases')
  .select('*')
  .eq('user_id', user.id); // Même si RLS applique déjà ce filtre !
```

**Raison** : Postgres peut mieux optimiser le query plan avec un filtre explicite.

---

### Technique #5 : Security Definer Functions ⭐ Gain 99.993%

Pour les queries avec **JOINS** complexes, wrappez dans une fonction `SECURITY DEFINER`.

```sql
-- ❌ TRÈS LENT : RLS sur cases + documents + users
SELECT c.*, d.*, u.*
FROM cases c
JOIN documents d ON d.case_id = c.id
JOIN users u ON u.id = c.user_id
WHERE c.user_id = auth.uid();

-- ✅ RAPIDE : Function SECURITY DEFINER bypass RLS
CREATE FUNCTION get_user_cases_with_docs(p_user_id uuid)
RETURNS TABLE (
  case_id uuid,
  case_title text,
  doc_id uuid,
  doc_name text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id,
    c.title,
    d.id,
    d.name
  FROM cases c
  JOIN documents d ON d.case_id = c.id
  WHERE c.user_id = p_user_id;
END;
$$;

-- Grant access
GRANT EXECUTE ON FUNCTION get_user_cases_with_docs(uuid) TO authenticated;

-- Usage depuis Supabase client
const { data } = await supabase.rpc('get_user_cases_with_docs', {
  p_user_id: user.id
});
```

**⚠️ ATTENTION** : Valider **manuellement** les permissions dans la fonction.

---

### Technique #6 : Minimiser les joins dans policies

```sql
-- ❌ LENT : Join dans policy
CREATE POLICY "team_members_access" ON cases
FOR SELECT USING (
  user_id IN (
    SELECT tm.user_id
    FROM team_members tm
    JOIN teams t ON t.id = tm.team_id
    WHERE t.id = cases.team_id
  )
);

-- ✅ RAPIDE : Subquery sans join sur table source
CREATE POLICY "team_members_access_optimized" ON cases
FOR SELECT USING (
  team_id IN (
    SELECT team_id
    FROM team_members
    WHERE user_id = (SELECT auth.uid())
  )
);
```

---

### Checklist optimisation complète

Pour chaque table avec RLS :

- [ ] ✅ Index sur colonnes RLS (`user_id`, `team_id`, etc.)
- [ ] ✅ Wrapper `auth.uid()` dans `(SELECT auth.uid())`
- [ ] ✅ Spécifier `TO authenticated` ou `TO anon`
- [ ] ✅ Filtres explicites `.eq()` dans queries
- [ ] ✅ Considérer Security Definer pour joins complexes
- [ ] ✅ Éviter joins directs dans policies

---

## JWT Custom Claims

### Accès aux données JWT

```sql
-- Structure JWT Supabase
{
  "aud": "authenticated",
  "exp": 1234567890,
  "sub": "user-uuid",
  "email": "user@example.com",
  "app_metadata": {
    "role": "admin",
    "teams": ["team1-uuid", "team2-uuid"]
  },
  "user_metadata": {
    "name": "John Doe"
  }
}
```

**⚠️ CRITIQUE** :
- `app_metadata` : ✅ NON modifiable par user (safe pour authorization)
- `user_metadata` : ❌ Modifiable par user (JAMAIS pour authorization)

---

### Pattern 1 : Role-Based Access Control (RBAC)

```sql
-- Définir roles dans app_metadata (via Dashboard Supabase ou fonction serveur)

-- Policy admin : accès complet
CREATE POLICY "admins_full_access" ON cases
FOR ALL
TO authenticated
USING (
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

-- Policy client : accès limité
CREATE POLICY "clients_read_own" ON cases
FOR SELECT
TO authenticated
USING (
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'client'
  AND auth.uid() = user_id
);
```

**Setter le role** (Server-Side uniquement) :
```typescript
// app/api/admin/set-role/route.ts
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // Service role key
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

await supabaseAdmin.auth.admin.updateUserById(userId, {
  app_metadata: { role: 'admin' },
});
```

---

### Pattern 2 : Multi-Tenant avec Teams

```sql
-- app_metadata.teams = ["team1-uuid", "team2-uuid"]

CREATE POLICY "team_members_access" ON cases
FOR SELECT
TO authenticated
USING (
  team_id IN (
    SELECT jsonb_array_elements_text(
      auth.jwt() -> 'app_metadata' -> 'teams'
    )::uuid
  )
);
```

**Setter les teams** :
```typescript
await supabaseAdmin.auth.admin.updateUserById(userId, {
  app_metadata: {
    teams: ['team1-uuid', 'team2-uuid'],
  },
});
```

---

### Pattern 3 : MFA Enforcement

```sql
-- Restreindre opérations sensibles aux users avec MFA activé
CREATE POLICY "sensitive_delete_requires_mfa" ON transactions
FOR DELETE
TO authenticated
USING (
  (auth.jwt() ->> 'aal') = 'aal2' -- Assurance Level 2 (MFA confirmed)
  AND auth.uid() = user_id
);
```

**aal levels** :
- `aal1` : Password seul
- `aal2` : Password + MFA

---

## Multi-Tenant Architecture

### Pattern Account-Centric (Makerkit)

```sql
-- Table accounts (organisations ou personal)
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT CHECK (type IN ('personal', 'team')) NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table account_members (relation users ↔ accounts)
CREATE TABLE account_members (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('owner', 'admin', 'member')) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, account_id)
);

-- Table cases (appartient à un account)
CREATE TABLE cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID REFERENCES accounts(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  -- ...
);

-- RLS : User accède aux cases de ses accounts
CREATE POLICY "account_members_access_cases" ON cases
FOR SELECT
TO authenticated
USING (
  account_id IN (
    SELECT account_id
    FROM account_members
    WHERE user_id = (SELECT auth.uid())
  )
);

-- RLS : Seul owner/admin peut modifier
CREATE POLICY "account_admins_update_cases" ON cases
FOR UPDATE
TO authenticated
USING (
  account_id IN (
    SELECT account_id
    FROM account_members
    WHERE user_id = (SELECT auth.uid())
      AND role IN ('owner', 'admin')
  )
)
WITH CHECK (
  account_id IN (
    SELECT account_id
    FROM account_members
    WHERE user_id = (SELECT auth.uid())
      AND role IN ('owner', 'admin')
  )
);
```

**Avantages** :
- ✅ User peut appartenir à plusieurs organisations
- ✅ Permissions granulaires (owner, admin, member)
- ✅ Facile de changer d'organisation (UI avec dropdown)

---

## Security Definer Functions

### Quand utiliser ?

- ✅ Queries avec JOINs complexes (3+ tables)
- ✅ Opérations atomiques (créer case + documents en une transaction)
- ✅ Calculs complexes (agrégations, stats)

### Pattern complet

```sql
-- Function pour créer case + documents en une transaction
CREATE FUNCTION create_case_with_documents(
  p_title TEXT,
  p_description TEXT,
  p_document_names TEXT[]
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_case_id UUID;
  v_user_id UUID;
  v_doc_name TEXT;
BEGIN
  -- 1. Récupérer user_id (validation)
  v_user_id := auth.uid();

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  -- 2. Créer case
  INSERT INTO cases (user_id, title, description)
  VALUES (v_user_id, p_title, p_description)
  RETURNING id INTO v_case_id;

  -- 3. Créer documents
  FOREACH v_doc_name IN ARRAY p_document_names
  LOOP
    INSERT INTO documents (case_id, user_id, name)
    VALUES (v_case_id, v_user_id, v_doc_name);
  END LOOP;

  RETURN v_case_id;
END;
$$;

-- Grant access
GRANT EXECUTE ON FUNCTION create_case_with_documents(TEXT, TEXT, TEXT[]) TO authenticated;

-- Revoke access from anon
REVOKE EXECUTE ON FUNCTION create_case_with_documents(TEXT, TEXT, TEXT[]) FROM anon;
```

**Usage** :
```typescript
const { data: caseId } = await supabase.rpc('create_case_with_documents', {
  p_title: 'Mon dossier',
  p_description: 'Description',
  p_document_names: ['doc1.pdf', 'doc2.pdf'],
});
```

**⚠️ SÉCURITÉ** :
- ✅ `SECURITY DEFINER` bypass RLS → DOIT valider permissions manuellement
- ✅ `SET search_path = public` prévient schema injection
- ✅ `GRANT ... TO authenticated` limite accès
- ✅ Toujours vérifier `auth.uid()` dans la fonction

---

## Common Pitfalls

### ❌ Erreur #1 : Oublier NULL check

```sql
-- ❌ DANGER : Quand user non auth, auth.uid() = null
CREATE POLICY "users_select" ON cases
FOR SELECT USING (auth.uid() = user_id);
-- null = 'uuid' → false (OK mais permet requêtes non auth)

-- ✅ TOUJOURS vérifier null
CREATE POLICY "users_select_safe" ON cases
FOR SELECT USING (
  auth.uid() IS NOT NULL AND
  auth.uid() = user_id
);
```

---

### ❌ Erreur #2 : Utiliser user_metadata pour authorization

```sql
-- ❌ DANGER : user_metadata modifiable par user
CREATE POLICY "users_by_role" ON cases
FOR SELECT USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);
-- User peut modifier son user_metadata via Supabase client !

-- ✅ Utiliser app_metadata (non modifiable)
CREATE POLICY "admins_only" ON cases
FOR SELECT USING (
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);
```

---

### ❌ Erreur #3 : Oublier RLS sur tables annexes

```sql
-- ✅ RLS sur cases
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;

-- ❌ OUBLI : RLS pas activé sur documents !
-- ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Résultat : User peut voir TOUS les documents même sans RLS !
```

**Solution** : Activer RLS sur **toutes** les tables `public`.

---

### ❌ Erreur #4 : SELECT policy manquante pour UPDATE

```sql
-- ❌ ERREUR : UPDATE policy sans SELECT policy
CREATE POLICY "users_update" ON cases
FOR UPDATE USING (auth.uid() = user_id);

-- User ne peut pas UPDATE car ne peut pas SELECT la ligne !

-- ✅ Ajouter SELECT policy
CREATE POLICY "users_select" ON cases
FOR SELECT USING (auth.uid() = user_id);
```

---

### ❌ Erreur #5 : Security Definer function en schema public

```sql
-- ❌ DANGER : Function accessible directement via API
CREATE FUNCTION admin_delete_all_cases() ...
-- User peut appeler via supabase.rpc() !

-- ✅ Créer dans schema privé
CREATE SCHEMA private;
CREATE FUNCTION private.admin_delete_all_cases() ...
-- Pas accessible via API
```

---

## Testing RLS

### Test local avec psql

```sql
-- Se connecter en tant que user authentifié
SET request.jwt.claims = '{
  "sub": "user-uuid",
  "role": "authenticated",
  "app_metadata": {"role": "client"}
}';

-- Tester SELECT
SELECT * FROM cases;
-- Devrait retourner seulement les cases du user

-- Tester INSERT
INSERT INTO cases (user_id, title) VALUES ('other-user-id', 'Test');
-- Devrait échouer (WITH CHECK violation)
```

---

### Test avec Supabase client

```typescript
// Test en tant que user authentifié
const { data: cases } = await supabase.from('cases').select('*');
console.log(cases); // Seulement les cases du user

// Test insertion valide
const { data, error } = await supabase.from('cases').insert({
  user_id: user.id,
  title: 'Mon case',
});
console.log(error); // null

// Test insertion invalide
const { data, error } = await supabase.from('cases').insert({
  user_id: 'other-user-id',
  title: 'Attaque',
});
console.log(error); // Policy violation
```

---

### Checklist tests RLS

- [ ] ✅ User authentifié voit seulement ses données
- [ ] ✅ User non authentifié ne voit rien
- [ ] ✅ User ne peut pas insérer pour quelqu'un d'autre
- [ ] ✅ User ne peut pas modifier données d'un autre
- [ ] ✅ User ne peut pas supprimer données d'un autre
- [ ] ✅ Admin peut accéder à toutes les données (si applicable)
- [ ] ✅ Policies performantes (< 100ms avec 10k lignes)

---

## Checklist déploiement

### Avant production

- [ ] ✅ RLS activé sur toutes les tables `public`
- [ ] ✅ Policies créées pour SELECT, INSERT, UPDATE, DELETE
- [ ] ✅ NULL checks dans toutes les policies
- [ ] ✅ Indexes sur colonnes RLS
- [ ] ✅ `auth.uid()` wrappé dans `(SELECT auth.uid())`
- [ ] ✅ Roles spécifiés (`TO authenticated`)
- [ ] ✅ Tests RLS passés
- [ ] ✅ Performance validée (< 100ms)
- [ ] ✅ Security Definer functions auditées
- [ ] ✅ app_metadata utilisé pour roles (pas user_metadata)

---

## Documentation officielle

📚 **Ressources** :
- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL RLS Docs](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Supabase Auth Deep Dive](https://supabase.com/docs/guides/auth)

---

**Version** : 1.0
**Dernière mise à jour** : Octobre 2025
**Projet** : Formelio

💙 **Formelio** - Votre temps, notre priorité
