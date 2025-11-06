# Migration Guide: v2.0 → v3.0 Pragmatic

**Date**: 2025-11-04
**Philosophy Change**: Dogmatic → Pragmatic

---

## 🎯 What Changed and Why

### Core Philosophy Shift

**v2.0**: Rules as laws ("NEVER", "FORBIDDEN", "MUST")
**v3.0**: Rules as guidelines ("AVOID", "PREFERRED", "RECOMMENDED")

**Why**: Real development requires pragmatism. Absolute rules create frustration and malicious compliance.

---

## 📝 File Changes

### Renamed Files

| Old Name | New Name | Reason |
|----------|----------|--------|
| `CLAUDE-patterns.md` | `PATTERNS.md` | Simpler, human-friendly |
| `CLAUDE-decisions.md` | `DECISIONS.md` | Simpler, human-friendly |

### Updated Files

- **CLAUDE.md**: Reduced from 234 → 318 lines (but 80% more readable)
  - Added P0/P1/P2 priority levels
  - Added "Quick Find" index
  - Added Glossary
  - Replaced "NEVER" with "AVOID + WHY"

---

## 🔧 Stack Version Fix

**CRITICAL**: Fixed Next.js version incohérence

- ❌ **v2.0**: Confused (CLAUDE.md said 14, DEC-008 said 15)
- ✅ **v3.0**: Confirmed **Next.js 15** everywhere

**Action**: All documentation now references Next.js 15 consistently.

---

## 📏 File Size Rules Change

### v2.0 (Dogmatic)

```markdown
❌ Files > 300 lines are FORBIDDEN
🚨 CRITICAL - MUST split NOW at 250 lines
```

### v3.0 (Pragmatic)

```markdown
⚠️ REVIEW files > 300 lines
Guidelines:
- < 200 lines: Ideal ✅
- 200-300 lines: Acceptable ⚠️
- 300-500 lines: Review critically 🔍
- > 500 lines: Strong code smell 🚨

Exceptions:
- Generated code
- Complex state machines
- Test files

Decision criteria: Can someone understand in < 10 minutes?
```

**Why**: A well-organized 350-line file is better than artificially split 3×120-line files with forced abstractions.

---

## 🚫 "NEVER" → "AVOID + WHY"

### Examples of Changes

**TypeScript `any`**:

**v2.0**: `❌ any type is FORBIDDEN`
**v3.0**: `❌ AVOID undocumented any` + exceptions listed + "when breaking" guidance

**Parallel Architectures**:

**v2.0**: `❌ NEVER CREATE PARALLEL ARCHITECTURES`
**v3.0**: `⚠️ Search before creating` + "When to skip: Prototyping, tight deadlines"

---

## 🎚️ Priority Levels (NEW)

### P0 - Critical (Break Production)

**Non-negotiable**. These prevent prod issues:
- RLS enabled on tables (GDPR)
- Use `@supabase/ssr` not auth-helpers (session breaks)
- Use `getUser()` not `getSession()` on server (security)

### P1 - Important (Break Quality)

**Strongly recommended** with reasonable exceptions:
- No undocumented `any` (unless documented why)
- Files < 500 lines (unless justified)
- Search before creating (unless prototyping)

### P2 - Recommended (Best Practices)

**Follow when possible**, skip when they slow you down:
- Server Components by default
- Standard locations
- Semantic HTML

---

## 📚 Memory Bank Strategy

### v2.0 (Growing Forever)

```
Pattern count: 8 → will grow to 50+ patterns
Decision count: 10 → will grow to 100+ ADRs
Problem: Documentation explosion, maintenance nightmare
```

### v3.0 (Dev Phase Only)

```markdown
**During development**: Use PATTERNS.md + DECISIONS.md
**After v1.0 launch**: Archive as reference, STOP growing

Prevents: Documentation graveyard
```

---

## 🔍 Quick Find Index (NEW)

Added task-based navigation:

```markdown
**I need to...**
- Create a form → PATTERNS.md#forms
- Setup Supabase → SUPABASE_RULES.md
- Add translations → PATTERNS.md#i18n
```

**Benefit**: Find answers in seconds, not minutes.

---

## 📖 Glossary (NEW)

Added definitions for all technical terms:
- Canonical Location
- Server Component vs Client Component
- RLS, SSR, Memory Bank
- etc.

**Benefit**: No more guessing what terms mean.

---

## 🤝 What Stayed the Same

### Still Critical

These rules are **unchanged** because they're essential:

1. **Supabase Auth**: Use `@supabase/ssr` ONLY
2. **RLS**: Always enabled on all tables
3. **Server validation**: Always use `getUser()` on server
4. **Standard locations**: Still the canonical reference
5. **Semantic HTML**: Still required for a11y

### Still Recommended

- Server Components by default
- react-hook-form + Zod for forms
- next-intl for i18n
- Search before creating

**What changed**: The **tone** (guideline vs law) and **flexibility** (exceptions documented).

---

## ✅ Migration Checklist

### For Claude AI

- [x] Read new CLAUDE.md philosophy
- [x] Use P0/P1/P2 priority system
- [x] Accept documented exceptions to P1/P2 rules
- [x] Stop enforcing hard 300-line limit
- [x] Use pragmatic language ("AVOID" not "NEVER")
- [x] Reference PATTERNS.md / DECISIONS.md (not CLAUDE-*)

### For Human Developers

- [ ] Read new CLAUDE.md (10 min read)
- [ ] Understand P0/P1/P2 levels
- [ ] Know when to break rules (and how to document it)
- [ ] Use Quick Find index for fast lookups
- [ ] Reference Glossary when confused

---

## 🎯 Key Takeaways

### Before (v2.0)

- 5,153 lines of documentation
- Dogmatic rules ("NEVER", "FORBIDDEN")
- Hard 300-line limit
- Memory Bank grows forever
- Optimized for AI, not humans

### After (v3.0)

- ~1,500 essential lines + references
- Pragmatic guidelines ("AVOID + WHY")
- Flexible file size with clear criteria
- Memory Bank frozen after v1.0
- **Optimized for humans, usable by AI**

---

## 💡 Philosophy

> **v2.0**: "Perfect is the goal"
> **v3.0**: "Shipped is the goal"

- **Pragmatic** over dogmatic
- **Productive** over perfect
- **Adaptable** over rigid
- **Human** over AI-first

---

**Questions?** Check [CLAUDE.md](CLAUDE.md) Quick Find section.

**Version**: 3.0 Pragmatic
**Effective**: 2025-11-04
