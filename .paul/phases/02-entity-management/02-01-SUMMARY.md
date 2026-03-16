---
phase: 02-entity-management
plan: 01
subsystem: database, api, ui
tags: [convex, schema, entities, crud, navigation]

requires:
  - phase: 01-auth-and-worlds
    provides: worlds table, memberships table, auth pattern, world detail page
provides:
  - 5 entity tables (characters, places, factions, artifacts, lore)
  - Unified CRUD functions (convex/entities.ts)
  - World hub layout with tab navigation
  - Entity count query
affects: [02-02 entity list UI, 02-03 entity detail pages, phase 3 relationships]

tech-stack:
  added: []
  patterns: [unified entity CRUD with entityType dispatch, world hub layout with tab nav]

key-files:
  created: [convex/entities.ts, components/worlds/EntityNav.tsx, app/(app)/worlds/[worldId]/layout.tsx, app/(app)/worlds/[worldId]/entities/page.tsx, app/(app)/worlds/[worldId]/members/page.tsx]
  modified: [convex/schema.ts, app/(app)/worlds/[worldId]/page.tsx]

key-decisions:
  - "Separate tables per entity type for clean indexing and type safety"
  - "Unified convex/entities.ts dispatches to correct table via entityType param"
  - "Entity pages use query param (?type=character) rather than separate routes per type"

patterns-established:
  - "Entity CRUD: checkMembership helper + canWrite role check in every mutation"
  - "World sub-pages: layout.tsx handles world fetch + nav, child pages focus on content"

duration: ~10min
started: 2026-03-15T00:00:00Z
completed: 2026-03-15T00:10:00Z
---

# Phase 2 Plan 01: Entity Schema + CRUD + World Hub Summary

**5 entity tables with unified CRUD functions and world hub navigation with tab-based entity routing**

## Performance

| Metric | Value |
|--------|-------|
| Duration | ~10min |
| Tasks | 2 completed |
| Files modified | 7 |

## Acceptance Criteria Results

| Criterion | Status | Notes |
|-----------|--------|-------|
| AC-1: Entity Schema Defined | Pass | 5 tables with worldId, name, description, type-specific fields, timestamps, by_world index |
| AC-2: Entity CRUD Functions Work | Pass | list, get, count, create, update, remove all registered via `npx convex codegen` |
| AC-3: Permission Checks Enforced | Pass | checkMembership + canWrite guards on all mutations; viewers read-only |
| AC-4: World Hub Navigation | Pass | Tab nav with Overview, Characters, Places, Factions, Artifacts, Lore, Members tabs |

## Accomplishments

- Added 5 entity tables to Convex schema with type-specific optional fields (appearance/personality for characters, geography/climate for places, etc.)
- Created unified `convex/entities.ts` with 6 functions (list, get, count, create, update, remove) dispatching to correct table via entityType param
- Restructured world detail page into hub layout with EntityNav component and sub-page routing
- Moved members list to dedicated /members sub-page, created placeholder /entities page

## Files Created/Modified

| File | Change | Purpose |
|------|--------|---------|
| `convex/schema.ts` | Modified | Added characters, places, factions, artifacts, lore tables |
| `convex/entities.ts` | Created | Unified CRUD functions with role-based permission checks |
| `components/worlds/EntityNav.tsx` | Created | Tab navigation component for world sub-pages |
| `app/(app)/worlds/[worldId]/layout.tsx` | Created | World layout with header, description, and EntityNav |
| `app/(app)/worlds/[worldId]/page.tsx` | Modified | Simplified to overview with entity count stats |
| `app/(app)/worlds/[worldId]/members/page.tsx` | Created | Members list + invite dialog (moved from old world page) |
| `app/(app)/worlds/[worldId]/entities/page.tsx` | Created | Placeholder entity page reading ?type= query param |

## Decisions Made

| Decision | Rationale | Impact |
|----------|-----------|--------|
| Separate tables per entity type | Clean indexing, type safety, no polymorphic queries | Each entity type has own table with specific fields |
| Unified entities.ts with entityType dispatch | Avoids 5 near-identical CRUD files | Single file to maintain; uses `any` casts for dynamic table access |
| Query param routing (?type=character) | Single entities page handles all types | Simpler routing; EntityNav builds correct URLs |

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

| Issue | Resolution |
|-------|------------|
| TypeScript errors with dynamic `db.get` returning union of all table types | Used `(entity as any).worldId` cast in get function |
| Convex API types not generated for new entities module | Ran `npx convex codegen` to regenerate |

## Next Phase Readiness

**Ready:**
- Schema deployed, CRUD functions registered
- World hub navigation provides clear routing to entity pages
- Plan 02-02 can build entity list UI + create dialogs on this foundation

**Concerns:**
- None

**Blockers:**
- None

---
*Phase: 02-entity-management, Plan: 01*
*Completed: 2026-03-15*
