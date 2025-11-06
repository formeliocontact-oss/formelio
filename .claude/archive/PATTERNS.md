# CLAUDE-patterns.md - Established Code Patterns

**Purpose**: Document established code patterns and conventions to prevent parallel implementations.
**Last Updated**: Novembre 2025

---

## 📋 How to Use This File

**Before creating new code**:
1. Search this file for similar patterns
2. Use the `code-searcher` subagent to find existing implementations
3. Follow established patterns instead of inventing new ones
4. Update this file when you create a new reusable pattern

---

## 🎯 Component Patterns

### Pattern: Feature Component Structure

**When to use**: Creating domain-specific components (cases, documents, users, etc.)

**Location**: `components/features/[domain]/[component-name].tsx`

**Template**:
```typescript
// components/features/cases/case-card.tsx
'use client' // Only if hooks/events needed

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCaseUpdate } from '@/hooks/use-case-update';
import type { Case } from '@/types/case';

interface CaseCardProps {
  case: Case;
  onUpdate?: (id: string) => void;
}

export function CaseCard({ case: caseData, onUpdate }: CaseCardProps) {
  const [loading, setLoading] = useState(false);
  const { updateCase } = useCaseUpdate();

  const handleUpdate = async () => {
    setLoading(true);
    await updateCase(caseData.id);
    setLoading(false);
    onUpdate?.(caseData.id);
  };

  return (
    <article className="p-4 border rounded-lg">
      <h3>{caseData.title}</h3>
      <Button onClick={handleUpdate} disabled={loading}>
        Update
      </Button>
    </article>
  );
}
```

**Key points**:
- Props interface with `Props` suffix
- Extract logic to custom hooks
- Semantic HTML (`<article>`, not `<div>`)
- Loading states for async operations
- Optional callback props (`onUpdate?:`)

---

## 🪝 Hook Patterns

### Pattern: Data Fetching Hook

**When to use**: Fetching and managing server data on client

**Location**: `hooks/use-[domain]-[action].ts`

**Template**:
```typescript
// hooks/use-cases.ts
'use client'

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Case } from '@/types/case';

export function useCases() {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchCases() {
      try {
        const { data, error } = await supabase
          .from('cases')
          .select('*');

        if (error) throw error;
        setCases(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchCases();
  }, []);

  return { cases, loading, error };
}
```

**Key points**:
- Return object with data, loading, error
- Try/catch/finally for error handling
- Type the return value
- Use Supabase client (not server)

### Pattern: Action Hook

**When to use**: Performing mutations (create, update, delete)

**Location**: `hooks/use-[domain]-[action].ts`

**Template**:
```typescript
// hooks/use-case-update.ts
'use client'

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export function useCaseUpdate() {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const updateCase = async (id: string, data: Partial<Case>) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('cases')
        .update(data)
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error'
      };
    } finally {
      setLoading(false);
    }
  };

  return { updateCase, loading };
}
```

---

## 🔧 Service Patterns

### Pattern: Business Logic Service

**When to use**: Complex business logic, multiple data sources

**Location**: `lib/services/[domain]-service.ts`

**Template**:
```typescript
// lib/services/case-service.ts
import { createClient } from '@/lib/supabase/server';
import type { Case, CaseInput } from '@/types/case';

export class CaseService {
  private supabase = createClient();

  async getCaseById(id: string): Promise<Case | null> {
    const { data, error } = await this.supabase
      .from('cases')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('CaseService.getCaseById error:', error);
      return null;
    }

    return data;
  }

  async createCase(input: CaseInput): Promise<Case | null> {
    const { data, error } = await this.supabase
      .from('cases')
      .insert(input)
      .select()
      .single();

    if (error) {
      console.error('CaseService.createCase error:', error);
      return null;
    }

    return data;
  }
}

// Export singleton instance
export const caseService = new CaseService();
```

**Key points**:
- Class with private supabase instance
- Async methods with clear return types
- Error logging
- Export singleton instance
- Use server client for services

---

## 🗂️ API Client Patterns

### Pattern: API Function

**When to use**: Simple API wrappers, no complex logic

**Location**: `lib/api/[domain].ts`

**Template**:
```typescript
// lib/api/cases.ts
import { createClient } from '@/lib/supabase/client';
import type { Case } from '@/types/case';

export async function getCases(): Promise<Case[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('cases')
    .select('*');

  if (error) {
    console.error('getCases error:', error);
    return [];
  }

  return data || [];
}

export async function getCaseById(id: string): Promise<Case | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('cases')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('getCaseById error:', error);
    return null;
  }

  return data;
}
```

---

## 📝 Type Patterns

### Pattern: Domain Types

**Location**: `types/[domain].ts`

**Template**:
```typescript
// types/case.ts
export interface Case {
  id: string;
  title: string;
  description: string;
  status: CaseStatus;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export type CaseStatus = 'pending' | 'in_progress' | 'completed' | 'rejected';

export type CaseInput = Omit<Case, 'id' | 'created_at' | 'updated_at'>;
```

**Key points**:
- Interface for entities
- Type for unions/status
- `Input` type = Omit generated fields
- Match Supabase schema exactly

---

## ✅ Validation Patterns

### Pattern: Zod Schema

**Location**: `lib/validations/[domain].ts`

**Template**:
```typescript
// lib/validations/case.ts
import { z } from 'zod';

export const caseSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().max(1000),
  status: z.enum(['pending', 'in_progress', 'completed', 'rejected']),
  user_id: z.string().uuid(),
});

export type CaseInput = z.infer<typeof caseSchema>;
```

---

## 📌 When to Add New Patterns

Add a new pattern to this file when:
- ✅ You create a reusable structure that others should follow
- ✅ You refactor duplicated code into a pattern
- ✅ You solve a problem in a way that should be standard
- ❌ NOT for one-off implementations

---

## 📝 Form Pattern with react-hook-form + Zod (Context7 Verified)

**When to use**: All forms requiring validation

**Location**: `components/forms/[name]-form.tsx`

**Context7 Verified**: 2025-11-03

**Template**:
```typescript
'use client'

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  field: z.string().min(1, 'Required'),
});

type FormData = z.infer<typeof schema>;

export function MyForm({ onSubmit }: { onSubmit: (data: FormData) => Promise<void> }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  );
}
```

**Key points**:
- Schema in `lib/validations/`
- `zodResolver` for validation
- `isSubmitting` for loading state
- Shadcn UI components

---

## 🌐 i18n Pattern with next-intl (Context7 Verified)

**When to use**: All user-facing strings

**Location**: Component any, messages in `i18n/messages/[locale].json`

**Context7 Verified**: 2025-11-03

**Template**:
```typescript
'use client'

import { useTranslations } from 'next-intl';

export function MyComponent() {
  const t = useTranslations('namespace');

  return <button>{t('submit')}</button>;
}
```

**Key points**:
- `useTranslations` hook
- Namespace organization
- JSON message files (fr.json, en.json)

---

## 🔍 Pattern Search Tips

Use `code-searcher` subagent or search manually:

```bash
# Find component patterns
rg "export function.*Card" components/features/

# Find hook patterns
rg "export function use" hooks/

# Find service patterns
rg "class.*Service" lib/services/

# Find type patterns
rg "export interface" types/
```

---

**Last Updated**: Novembre 2025
**Patterns Count**: 8 documented patterns
