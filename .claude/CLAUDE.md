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

## 🔍 Code Patterns

**Full templates with examples** → See [archive/PATTERNS.md](archive/PATTERNS.md)

Quick syntax reminders:
- **Server Component** (default): No `'use client'`, can `await` data
- **Client Component**: Add `'use client'`, can use hooks/events
- **Hooks**: Return `{ data, loading, error }` pattern
- **Services**: Class with private `supabase`, export singleton
- **Types**: Interface for entities, Type for unions
- **Validation**: Zod schemas in `lib/validations/`

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

**Design & UI**:
- [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) - Color palette, typography, spacing tokens

**Error Handling**:
- [ERROR_HANDLING_GUIDE.md](../docs/03-development/ERROR_HANDLING_GUIDE.md) - Error types, patterns, useSafeAction

**Rules**:
- [archive/PATTERNS.md](archive/PATTERNS.md) - Full pattern templates
- [archive/DECISIONS.md](archive/DECISIONS.md) - Architecture decisions
- [archive/rules/SUPABASE_RULES.md](archive/rules/SUPABASE_RULES.md) - Supabase details
- [archive/rules/NEXTJS_RULES.md](archive/rules/NEXTJS_RULES.md) - Server/Client deep-dive
- [archive/TAILWIND_V4_COMPATIBILITY.md](archive/TAILWIND_V4_COMPATIBILITY.md) - Tailwind v4 tech doc


**Philosophy**: Pragmatic over perfect. Ship fast, iterate.

**Last Updated**: 2025-11-12
**Lines**: ~100 (Optimized for token efficiency)
