# Supabase Setup Guide

## 📋 Schema Overview

Votre base de données Formelio comprend :

- **organizations** - Multi-tenant (cabinets juridiques)
- **profiles** - Utilisateurs (extend auth.users)
- **cases** - Dossiers juridiques
- **case_collaborators** - Partage de dossiers
- **documents** - Pièces jointes
- **activities** - Audit log / Timeline

## 🚀 Apply Migration

### Option 1: Via Supabase Dashboard (Recommandé)

1. Allez sur [https://gjbmreyqbortejuhjxkp.supabase.co](https://gjbmreyqbortejuhjxkp.supabase.co)
2. Cliquez sur **SQL Editor** dans le menu
3. Cliquez sur **New Query**
4. Copiez le contenu de `migrations/20250105_initial_schema.sql`
5. Collez dans l'éditeur SQL
6. Cliquez sur **Run** (en bas à droite)

### Option 2: Via Supabase CLI (Avancé)

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref gjbmreyqbortejuhjxkp

# Apply migration
supabase db push
```

## ✅ Vérification

Après application, vérifiez dans **Table Editor** :

- ✅ 6 tables créées
- ✅ RLS activé sur toutes les tables (icône cadenas 🔒)
- ✅ Policies présentes (onglet "Policies")

## 🔐 Row Level Security (RLS)

**CRITIQUE (P0)** : Toutes les tables ont RLS activé.

Policies principales :
- Multi-tenant strict (isolation par `organization_id`)
- Accès basé sur le rôle (admin, lawyer, assistant, client)
- Partage de dossiers via `case_collaborators`

## 📝 Seed Data

Le fichier de migration contient un exemple d'organisation :
- **Cabinet Formelio** (slug: `formelio`)

⚠️ **Production** : Supprimez la section "SEED DATA" avant de déployer en production.

## 🔄 Next Steps

Après application du schema :

1. ✅ Créer un compte utilisateur (Signup)
2. ✅ Lier le profil à l'organisation
3. ✅ Commencer à coder les features

## 🛠 Regenerate Types

Après toute modification du schema :

```bash
npx supabase gen types typescript --project-id gjbmreyqbortejuhjxkp > src/types/database.ts
```

## 📚 Documentation

- [Supabase RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase CLI](https://supabase.com/docs/reference/cli)
