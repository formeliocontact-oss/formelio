# Formelio - AI Quick Reference

**Version**: 4.0 Condensed
**For**: AI rapid lookup (humans: see README.md)
**Lines**: ~150

---

## 🚨 CRITICAL RULES (P0 - Never Break)

```typescript
// 1. SUPABASE AUTH
❌ import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
✅ import { createServerClient } from '@supabase/ssr'

// 2. SERVER AUTH VALIDATION
❌ const { data: { session } } = await supabase.auth.getSession()
✅ const { data: { user } } = await supabase.auth.getUser()

// 3. ROW LEVEL SECURITY
✅ ALTER TABLE your_table ENABLE ROW LEVEL SECURITY;
```

---

## 📦 Stack

- **Next.js 15.0.0** + **React 19.0.0** + **TypeScript 5.2+**
- **Supabase**: `@supabase/ssr` (clients: client.ts, server.ts, middleware.ts)
- **Tailwind v4**: `@tailwindcss/postcss` bridge (v3 syntax, no pure v4)
- **Forms**: react-hook-form + Zod + zodResolver
- **i18n**: next-intl (FR-only MVP)
- **UI**: Shadcn UI

---

## 📁 Canonical Locations

| Type | Location | Naming |
|------|----------|--------|
| Feature component | `components/features/[domain]/` | `case-card.tsx` |
| UI component | `components/ui/` | `button.tsx` |
| Form | `components/forms/` | `case-form.tsx` |
| Hook | `hooks/` | `use-case-update.ts` |
| Service | `lib/services/` | `case-service.ts` |
| API function | `lib/api/` | `cases.ts` |
| Type | `types/` | `case.ts` |
| Validation | `lib/validations/` | `case.ts` |

**Search before creating**: `rg "YourPattern"` + check [archive/PATTERNS.md](archive/PATTERNS.md)

---

## 🔍 Code Patterns (Minimal Syntax)

### Server Component (default)
```typescript
// app/page.tsx (no 'use client')
export default async function Page() {
  const data = await fetchData()
  return <div>{data}</div>
}
```

### Client Component
```typescript
// components/features/cases/case-card.tsx
'use client'
import { useState } from 'react'

export function CaseCard({ case: caseData }: CaseCardProps) {
  const [loading, setLoading] = useState(false)
  return <article>{caseData.title}</article>
}
```

### Data Fetch Hook
```typescript
// hooks/use-cases.ts
'use client'
import { createClient } from '@/lib/supabase/client'

export function useCases() {
  const [data, setData] = useState<Case[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetch() {
      const supabase = createClient()
      const { data, error } = await supabase.from('cases').select('*')
      if (error) setError(error.message)
      else setData(data || [])
      setLoading(false)
    }
    fetch()
  }, [])

  return { data, loading, error }
}
```

### Form (react-hook-form + Zod)
```typescript
// components/forms/case-form.tsx
'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

export function CaseForm({ onSubmit }: { onSubmit: (data: FormData) => Promise<void> }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema)
  })
  return <form onSubmit={handleSubmit(onSubmit)}>{/* fields */}</form>
}
```

### Service (Business Logic)
```typescript
// lib/services/case-service.ts
import { createClient } from '@/lib/supabase/server'

export class CaseService {
  private supabase = createClient()

  async getCaseById(id: string): Promise<Case | null> {
    const { data, error } = await this.supabase.from('cases').select('*').eq('id', id).single()
    if (error) return null
    return data
  }
}

export const caseService = new CaseService()
```

### Types
```typescript
// types/case.ts
export interface Case {
  id: string
  title: string
  status: CaseStatus
  user_id: string
  created_at: string
  updated_at: string
}

export type CaseStatus = 'pending' | 'in_progress' | 'completed'
export type CaseInput = Omit<Case, 'id' | 'created_at' | 'updated_at'>
```

### Validation
```typescript
// lib/validations/case.ts
import { z } from 'zod'

export const caseSchema = z.object({
  title: z.string().min(3).max(100),
  status: z.enum(['pending', 'in_progress', 'completed']),
  user_id: z.string().uuid(),
})

export type CaseInput = z.infer<typeof caseSchema>
```

---

## 🔎 Search Commands

```bash
# Find existing implementations
rg "use[A-Z]" hooks/                      # Hooks
rg "export function.*Card" components/     # Components
rg "class.*Service" lib/services/          # Services
rg "export interface" types/               # Types
rg "Schema.*z\.object" lib/validations/    # Validations
```

---

## ⚠️ Important Guidelines (P1)

- **File size**: < 200 lines ideal, review > 300, refactor > 500
- **TypeScript**: Avoid undocumented `any` (justify + migration plan)
- **Semantic HTML**: Use `<article>`, `<nav>`, `<button>` not `<div>`
- **Server Components**: Default (add `'use client'` only for hooks/events)

---

## 📚 Detailed Docs (Human Reference)

**Archived**:
- [archive/PATTERNS.md](archive/PATTERNS.md) - Full pattern templates
- [archive/DECISIONS.md](archive/DECISIONS.md) - Architecture decisions
- [archive/rules/SUPABASE_RULES.md](archive/rules/SUPABASE_RULES.md) - Supabase details
- [archive/rules/NEXTJS_RULES.md](archive/rules/NEXTJS_RULES.md) - Server/Client deep-dive
- [archive/TAILWIND_V4_COMPATIBILITY.md](archive/TAILWIND_V4_COMPATIBILITY.md) - Tailwind v4 tech doc

---

**Philosophy**: Pragmatic over perfect. Ship fast, iterate.

**Last Updated**: 2025-11-05
**Lines**: 149
