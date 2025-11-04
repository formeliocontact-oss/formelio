# Formelio - Project Rules

**Version**: 2.0 Optimized
**Stack**: Next.js 14 + TypeScript 5.2+ + Supabase + Shadcn UI + Tailwind
**Package Manager**: npm

---

## 🤖 AI Guidance

* **Use code-searcher subagent** for all code searches, inspections, and duplication checks - give it full context for the task
* After receiving search results, carefully reflect and determine optimal next steps before proceeding
* For maximum efficiency, invoke multiple tools simultaneously rather than sequentially when operations are independent
* Before finishing, verify your solution against project rules
* **NEVER create files** unless absolutely necessary for the goal
* **ALWAYS prefer editing** an existing file to creating a new one
* **NEVER proactively create documentation files** (*.md) unless explicitly requested
* When you update core files, also update the Memory Bank System files

## 📚 Memory Bank System

This project uses a structured memory bank to maintain architectural consistency and prevent duplication. **ALWAYS check these files FIRST before starting work:**

**Note**: These files are NOT auto-loaded (no `@` import) to save tokens. The `code-searcher` subagent reads them automatically when needed.

### Core Context Files

* **[CLAUDE-patterns.md](CLAUDE-patterns.md)** - Established code patterns and conventions (components, hooks, services)
* **[CLAUDE-decisions.md](CLAUDE-decisions.md)** - Architecture decisions and rationale (why we chose X over Y)

**CRITICAL**: Reference these files to understand established patterns and avoid creating parallel implementations.

### When to Update Memory Bank

Update Memory Bank files when you:
- ✅ Create a new reusable pattern (component structure, hook pattern, service pattern)
- ✅ Make an architectural decision (technology choice, structure choice, pattern choice)
- ✅ Refactor code to eliminate duplication (document the new pattern)
- ✅ Discover a better way to do something (replace old pattern with new)

---

## 🚨 MANDATORY WORKFLOW - Follow EVERY Time

### Before Creating ANY Code:

**Step 1: SEARCH First** (Prevent parallel architectures)

**Use the code-searcher subagent:**
```
"Use code-searcher subagent to find any existing [component/hook/service/function]
related to [functionality]. Check for similar implementations, established patterns
in CLAUDE-patterns.md, and validate the canonical location."
```

**OR search manually:**
```bash
rg "FunctionName|ComponentName" --type ts --type tsx
rg "use[A-Z].*keyword" hooks/
rg ".*Service" lib/services/
```

**Step 2: Check Memory Bank & [Standard Locations](rules/ARCHITECTURE_RULES.md#-canonical-locations)**

**Step 3: Decision**
- ✅ Found similar code? → **REUSE** or **EXTEND** it
- ✅ Creating new? → Use **STANDARD location ONLY**
- ❌ **NEVER** create parallel implementation

---

## ❌ ABSOLUTE PROHIBITIONS

### 1. NO Parallel Architectures
- ❌ NEVER duplicate functionality in different locations
- ✅ ALWAYS search before creating
- ✅ ALWAYS reuse existing patterns
- **Details**: [rules/ARCHITECTURE_RULES.md](rules/ARCHITECTURE_RULES.md)

### 2. NO Undocumented `any`
- ❌ `any` type is FORBIDDEN by default
- ✅ ALLOWED only if properly documented:
  ```typescript
  const data: any = legacyAPI();
  // JUSTIFICATION: [reason]
  // ALTERNATIVES TRIED: [what failed]
  // MIGRATION PLAN: [how to fix]
  // APPROVED BY: [who + date]
  ```
- **Details**: [rules/TYPESCRIPT_RULES.md](rules/TYPESCRIPT_RULES.md)

### 3. NO Unmaintainable Files
- ❌ Files > 300 lines are FORBIDDEN
- ⚠️ If file reaches 250 lines → **STOP and REFACTOR**
- **Criteria**: Readable (< 5 min), Testable, Focused (1 responsibility)
- **Details**: [rules/ARCHITECTURE_RULES.md#-file-organization-rules](rules/ARCHITECTURE_RULES.md#-file-organization-rules)

### 4. NO Div Soup
- ❌ NEVER use nested divs without semantic meaning
- ✅ Use: `<header>`, `<nav>`, `<main>`, `<article>`, `<button>`
- **Details**: [rules/HTML_SEMANTIC_RULES.md](rules/HTML_SEMANTIC_RULES.md)

### 5. NO @supabase/auth-helpers-nextjs
- ❌ DEPRECATED package - breaks production
- ✅ Use `@supabase/ssr` with `getAll()`/`setAll()` pattern
- **Details**: [rules/SUPABASE_RULES.md](rules/SUPABASE_RULES.md)

---

## ✅ MUST ALWAYS DO

- ✅ **Search for existing code** before creating new files
- ✅ **Extract duplicated logic** to hooks/utils
- ✅ **Split files > 250 lines** immediately
- ✅ **Use semantic HTML** (no div soup)
- ✅ **Type everything explicitly** (no implicit types)
- ✅ **Server Components by default** (Client only when needed)
- ✅ **Enable RLS on all tables** (Row Level Security)

---

## 📁 Standard Locations

**ONE way to organize code. NO alternatives.**

| What | Where | Example |
|------|-------|---------|
| Feature Component | `components/features/[domain]/` | `components/features/cases/case-card.tsx` |
| UI Component | `components/ui/` | `components/ui/button.tsx` |
| Custom Hook | `hooks/use-[domain]-[action].ts` | `hooks/use-case-update.ts` |
| Business Logic | `lib/services/[domain]-service.ts` | `lib/services/case-service.ts` |
| API Client | `lib/api/[domain].ts` | `lib/api/cases.ts` |
| Utility | `lib/utils/[domain]-utils.ts` | `lib/utils/date-utils.ts` |
| Type | `types/[domain].ts` | `types/case.ts` |
| Validation | `lib/validations/[domain].ts` | `lib/validations/case.ts` |

**Full table**: [rules/ARCHITECTURE_RULES.md](rules/ARCHITECTURE_RULES.md)

---

## 📏 File Size Limits

- **< 150 lines**: ✅ Ideal, maintainable
- **150-250 lines**: ⚠️ Warning - consider splitting
- **250-300 lines**: 🚨 CRITICAL - MUST split NOW
- **> 300 lines**: ❌ FORBIDDEN

**How to split**: Extract hooks → Extract components → Extract utils

---

## 🎯 Tech Stack Critical Rules

### TypeScript
- Strict mode enabled (all flags)
- NO `any` (or documented exception)
- Explicit types always
- **Details**: [rules/TYPESCRIPT_RULES.md](rules/TYPESCRIPT_RULES.md)

### Supabase
- Use `@supabase/ssr` ONLY
- `getAll()`/`setAll()` for cookies
- RLS enabled on all tables
- 3 client files: `client.ts`, `server.ts`, `middleware.ts`
- **Details**: [rules/SUPABASE_RULES.md](rules/SUPABASE_RULES.md)

### Next.js
- Server Components by default
- `'use client'` only for: hooks, events, browser APIs
- App Router structure
- **Details**: [rules/NEXTJS_RULES.md](rules/NEXTJS_RULES.md)

### HTML
- Semantic tags required
- Accessibility (a11y) compliance
- **Details**: [rules/HTML_SEMANTIC_RULES.md](rules/HTML_SEMANTIC_RULES.md)

### Forms (react-hook-form + Zod)
- Use `react-hook-form` for ALL forms
- Validate with Zod schemas in `lib/validations/`
- Use `zodResolver` for integration
- Pattern in `components/forms/[name]-form.tsx`
- **Details**: [CLAUDE-patterns.md](CLAUDE-patterns.md)

### Internationalization (next-intl)
- ALL user-facing text in `i18n/messages/fr.json`
- Use `useTranslations()` hook
- FR-only for MVP (ready for EN)
- NEVER hardcode strings in components
- **Details**: [CLAUDE-patterns.md](CLAUDE-patterns.md)

### Tailwind CSS v4
- Use `@tailwindcss/postcss` bridge (NOT pure v4)
- v3 syntax (`@tailwind`) in globals.css
- NO `@import`, `@theme`, `@plugin` directives
- **Details**: [TAILWIND_V4_COMPATIBILITY.md](TAILWIND_V4_COMPATIBILITY.md)

### Testing & Documentation
- Unit tests with Vitest (next to source files)
- E2E tests with Cypress in `cypress/e2e/`
- Storybook for reusable UI components
- Stories in `stories/[Name].stories.tsx`

---

## 📋 Pre-Commit Checklist

**Run before EVERY commit:**

- [ ] **Searched for similar code** (no parallel architectures)
- [ ] **NO `any` types** (or documented)
- [ ] **NO files > 300 lines**
- [ ] **NO code duplication**
- [ ] **Used standard locations**
- [ ] **Semantic HTML** (no div soup)
- [ ] **NO `@supabase/auth-helpers-nextjs`**
- [ ] `npm run lint` ✅
- [ ] `npm run type-check` ✅

---

## 📚 Detailed Rules

**Architecture & Anti-Duplication**: [rules/ARCHITECTURE_RULES.md](rules/ARCHITECTURE_RULES.md)
**TypeScript Strict Typing**: [rules/TYPESCRIPT_RULES.md](rules/TYPESCRIPT_RULES.md)
**Supabase Auth & RLS**: [rules/SUPABASE_RULES.md](rules/SUPABASE_RULES.md)
**HTML Semantic & A11y**: [rules/HTML_SEMANTIC_RULES.md](rules/HTML_SEMANTIC_RULES.md)
**Next.js App Router**: [rules/NEXTJS_RULES.md](rules/NEXTJS_RULES.md)

---

**Version**: 2.0 Optimized for Maintainability
**Focus**: Anti-Duplication + File Size + Type Safety
**Last Updated**: Octobre 2025
