# CLAUDE-decisions.md - Architecture Decisions Record

**Purpose**: Document architectural decisions and their rationale to prevent questioning past choices and creating parallel architectures.
**Last Updated**: Novembre 2025

---

## 📋 How to Use This File

**Before making a decision**:
1. Check if a similar decision was already made
2. Understand the rationale behind past choices
3. If changing a decision, document WHY and update this file

**When to add a decision**:
- Technology/package choices (why X instead of Y)
- Architecture patterns (why this structure over another)
- Major refactoring decisions
- Breaking changes or deprecations

---

## Decision Template

```markdown
### DEC-XXX: [Decision Title]

**Date**: [Date]
**Status**: ✅ Adopted | 🚧 Proposed | ❌ Rejected | 🔄 Superseded by DEC-YYY
**Context**: [What problem are we solving?]

**Decision**: [What we decided to do]

**Rationale**:
- ✅ Pro 1
- ✅ Pro 2
- ❌ Alternative X rejected because [reason]
- ❌ Alternative Y rejected because [reason]

**Consequences**:
- Impact on [area]
- Breaking change: [Yes/No + details]
- Migration path: [If applicable]

**Related**:
- Implements: [CLAUDE-patterns.md pattern]
- References: [Link to docs, PR, issue]
```

---

## 🎯 Active Decisions

### DEC-001: Use @supabase/ssr instead of @supabase/auth-helpers-nextjs

**Date**: Octobre 2025
**Status**: ✅ Adopted

**Context**: The `@supabase/auth-helpers-nextjs` package is deprecated and causes session management issues in Next.js 14+.

**Decision**: Use `@supabase/ssr` with `getAll()`/`setAll()` cookie pattern for all Supabase clients.

**Rationale**:
- ✅ `@supabase/ssr` is the official, maintained package
- ✅ Properly handles cookies in Next.js App Router
- ✅ Prevents session breaking issues
- ❌ Old package causes random logouts and session loss
- ❌ Old package has no support or fixes

**Consequences**:
- All Supabase clients must use new pattern
- Three client files: `client.ts`, `server.ts`, `middleware.ts`
- Breaking change: Must migrate existing code
- Migration documented in: [rules/SUPABASE_RULES.md](rules/SUPABASE_RULES.md)

**Related**:
- Pattern: [SUPABASE_RULES.md](rules/SUPABASE_RULES.md)
- Blocks: Any use of deprecated package

---

### DEC-002: Canonical File Locations (No Alternatives)

**Date**: Octobre 2025
**Status**: ✅ Adopted

**Context**: Developers were creating similar files in different locations (e.g., `lib/api/users.ts` AND `lib/services/user-service.ts` with duplicate logic).

**Decision**: Enforce ONE canonical location for each code type. See [Standard Locations table](CLAUDE.md#-standard-locations).

**Rationale**:
- ✅ Prevents parallel architectures
- ✅ Easy to find code (predictable structure)
- ✅ Reduces duplication
- ❌ Alternative "flexible structure" rejected (caused confusion)
- ❌ "Organize by feature" rejected (harder to find cross-cutting code)

**Consequences**:
- Mandatory SEARCH workflow before creating files
- `code-searcher` subagent enforces this
- Easier onboarding (clear structure)

**Related**:
- Pattern: [ARCHITECTURE_RULES.md](rules/ARCHITECTURE_RULES.md)
- Enforced by: `code-searcher` subagent

---

### DEC-003: File Size Hard Limit (300 lines)

**Date**: Octobre 2025
**Status**: ✅ Adopted

**Context**: Large files (> 500 lines) became unmaintainable, hard to test, and violated Single Responsibility Principle.

**Decision**: Hard limit of 300 lines per file. Warning at 250 lines. Mandatory refactoring before adding more.

**Rationale**:
- ✅ Forces good architecture (SRP)
- ✅ Easier to test small files
- ✅ Easier to understand (< 5 min read)
- ✅ Easier to refactor
- ❌ "No limit" rejected (created god files)
- ❌ "500 lines" rejected (still too large)

**Consequences**:
- Files must be split at 250 lines
- Extract: hooks → components → utils
- Breaking change: Existing large files need refactoring

**Related**:
- Rule: [ARCHITECTURE_RULES.md#file-organization-rules](rules/ARCHITECTURE_RULES.md#-file-organization-rules)
- Pattern: How to split documented in ARCHITECTURE_RULES.md

---

### DEC-004: TypeScript `any` Requires Documentation

**Date**: Octobre 2025
**Status**: ✅ Adopted

**Context**: Use of `any` type defeats TypeScript benefits and hides bugs at compile time.

**Decision**: `any` is FORBIDDEN by default. Allowed ONLY if properly documented with 4 required fields.

**Rationale**:
- ✅ Type safety is critical for maintainability
- ✅ Documentation forces developers to think about alternatives
- ✅ Temporary `any` usage is tracked (migration plan required)
- ❌ "Never use any" rejected (too strict for edge cases)
- ❌ "Allow any freely" rejected (defeats TypeScript purpose)

**Consequences**:
- Must document: JUSTIFICATION, ALTERNATIVES TRIED, MIGRATION PLAN, APPROVED BY
- Pre-commit checklist includes `any` check
- Code review rejects undocumented `any`

**Related**:
- Rule: [TYPESCRIPT_RULES.md](rules/TYPESCRIPT_RULES.md)
- Pattern: Documentation format in TYPESCRIPT_RULES.md

---

### DEC-005: Server Components by Default

**Date**: Octobre 2025
**Status**: ✅ Adopted

**Context**: Next.js 14 App Router defaults to Server Components for better performance.

**Decision**: Use Server Components by default. Add `'use client'` ONLY when necessary (hooks, events, browser APIs).

**Rationale**:
- ✅ Faster page loads (less JavaScript)
- ✅ Better SEO (server-side rendering)
- ✅ Direct database access (secure)
- ❌ "Client components everywhere" rejected (slower, unnecessary)

**Consequences**:
- Must understand Server vs Client Components
- Clearly document when `'use client'` is needed
- Pattern documented in: [NEXTJS_RULES.md](rules/NEXTJS_RULES.md)

**Related**:
- Rule: [NEXTJS_RULES.md](rules/NEXTJS_RULES.md)

---

### DEC-006: Memory Bank System for Pattern Documentation

**Date**: Novembre 2025
**Status**: ✅ Adopted

**Context**: Developers were recreating patterns and making decisions that were already made, causing duplication and inconsistency.

**Decision**: Implement Memory Bank System with `CLAUDE-patterns.md` and `CLAUDE-decisions.md` to document established patterns and architectural decisions.

**Rationale**:
- ✅ Prevents reinventing the wheel
- ✅ Maintains consistency across codebase
- ✅ Provides clear rationale for decisions
- ✅ Helps onboarding new developers
- ❌ "Code comments only" rejected (not centralized, hard to find)
- ❌ "Wiki documentation" rejected (separate from code, gets outdated)

**Consequences**:
- Must check Memory Bank before creating new patterns
- Must update Memory Bank when establishing new patterns
- `code-searcher` subagent checks these files
- Living documentation that evolves with codebase

**Related**:
- File: [CLAUDE-patterns.md](CLAUDE-patterns.md)
- File: [CLAUDE-decisions.md](CLAUDE-decisions.md) (this file)
- Enforced by: `code-searcher` subagent

---

### DEC-007: code-searcher Subagent for Duplication Prevention

**Date**: Novembre 2025
**Status**: ✅ Adopted

**Context**: Manual code searches were inconsistent and developers sometimes skipped searching before creating new code.

**Decision**: Create dedicated `code-searcher` subagent to search codebase, check patterns, validate locations, and assess duplication risk.

**Rationale**:
- ✅ Consistent search methodology
- ✅ Checks Memory Bank automatically
- ✅ Provides structured recommendations
- ✅ Enforces SEARCH workflow
- ❌ "Manual search only" rejected (inconsistent, easily skipped)
- ❌ "Automated linting only" rejected (can't understand context)

**Consequences**:
- Mandatory step in SEARCH workflow
- Uses Haiku model for cost efficiency
- Provides structured reports (Reuse/Extend/Create)
- Reduces token usage in main context

**Related**:
- Agent: [.claude/agents/code-searcher.md](agents/code-searcher.md)
- Workflow: [CLAUDE.md#mandatory-workflow](CLAUDE.md#-mandatory-workflow---follow-every-time)

---

## 🚧 Proposed Decisions

(None currently)

---

## ❌ Rejected Decisions

### REJ-001: Organize Code by Feature Instead of Type

**Date**: Octobre 2025
**Status**: ❌ Rejected

**Proposed**: Organize all files by feature (e.g., `features/cases/` contains components, hooks, services, types).

**Why Rejected**:
- ❌ Cross-cutting concerns hard to find (e.g., where are ALL hooks?)
- ❌ Code reuse more difficult (features become silos)
- ❌ Duplicate utilities likely (each feature creates its own)
- ✅ Canonical locations easier to navigate and enforce

**Alternative**: Use `components/features/[domain]/` for feature-specific UI only, keep other code organized by type.

---

### REJ-002: Allow Flexible File Sizes

**Date**: Octobre 2025
**Status**: ❌ Rejected

**Proposed**: No hard limit on file size, let developers decide based on complexity.

**Why Rejected**:
- ❌ Led to 500+ line god files
- ❌ Violated Single Responsibility Principle
- ❌ Unmaintainable and hard to test
- ✅ Hard limit (300 lines) forces better architecture

**Alternative**: 300 line hard limit with warning at 250 lines.

---

## 📌 Decision Numbering

- **DEC-XXX**: Active decisions (001-999)
- **REJ-XXX**: Rejected decisions (for reference)
- **SUPERSEDED**: Mark old decisions as superseded when replaced

---

## 🔍 Search Tips

Find relevant decisions:

```bash
# Search by topic
rg "Supabase|TypeScript|any|file size" .claude/CLAUDE-decisions.md

# Find all adopted decisions
rg "Status.*Adopted" .claude/CLAUDE-decisions.md

# Find decisions affecting a specific area
rg "Consequences.*component|hook|service" .claude/CLAUDE-decisions.md
```

---

**Last Updated**: Novembre 2025
**Active Decisions**: 7
**Rejected Decisions**: 2
