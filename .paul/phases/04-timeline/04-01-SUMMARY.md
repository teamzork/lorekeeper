---
phase: 04-timeline
plan: 01
subsystem: ui, database
tags: [convex, next.js, timeline, events, crud]

requires:
  - phase: 02-entity-management
    provides: entity CRUD patterns, world detail layout, EntityNav, dialog components
provides:
  - events table with full CRUD (convex/events.ts)
  - Timeline tab in world navigation
  - Timeline list page with EventCard grid
  - Event detail page with edit/delete
  - Create/Edit/Delete event dialogs
affects: [04-02 entity linking, 05 AI consistency checker]

tech-stack:
  added: []
  patterns: [separate CRUD file per domain concept, free-form date strings]

key-files:
  created: [convex/events.ts, components/events/EventCard.tsx, components/events/CreateEventDialog.tsx, components/events/EditEventDialog.tsx, components/events/DeleteEventDialog.tsx, app/(app)/worlds/[worldId]/timeline/page.tsx, app/(app)/worlds/[worldId]/timeline/[eventId]/page.tsx]
  modified: [convex/schema.ts, components/worlds/EntityNav.tsx]

key-decisions:
  - "Events get own table + CRUD file, not shoehorned into entity dispatch"
  - "Free-form date strings — fantasy worlds have arbitrary calendars"
  - "Sort by _creationTime for now; Plan 02 may add manual sortOrder"

patterns-established:
  - "Domain-specific Convex CRUD files (events.ts) alongside entity dispatch (entities.ts)"
  - "Timeline tab active state matches pathname.startsWith for subpaths"

duration: ~15min
started: 2026-03-20T00:00:00Z
completed: 2026-03-20T00:15:00Z
---

# Phase 4 Plan 01: Events CRUD + Timeline UI Summary

**Events table with full CRUD, Timeline navigation tab, list/detail pages, and create/edit/delete dialogs — following entity patterns but as a separate domain concept.**

## Performance

| Metric | Value |
|--------|-------|
| Duration | ~15min |
| Tasks | 3 completed |
| Files created | 7 |
| Files modified | 2 |

## Acceptance Criteria Results

| Criterion | Status | Notes |
|-----------|--------|-------|
| AC-1: Event creation | Pass | Create dialog with name, date, description, era, significance |
| AC-2: Event listing (chronological) | Pass | Grid view sorted by _creationTime ascending |
| AC-3: Event detail view | Pass | All fields displayed, edit/delete buttons present |
| AC-4: Event editing | Pass | Edit dialog pre-fills all fields, saves via update mutation |
| AC-5: Event deletion | Pass | Confirmation dialog, removes event, redirects to timeline |
| AC-6: Timeline navigation tab | Pass | Clock icon tab between Lore and Members, active on subpaths |

## Accomplishments

- Created `events` Convex table with full CRUD queries/mutations including membership checks
- Added Timeline tab to world navigation with correct active state on subpaths
- Built complete event management UI: list page, detail page, create/edit/delete dialogs

## Files Created/Modified

| File | Change | Purpose |
|------|--------|---------|
| `convex/schema.ts` | Modified | Added events table definition |
| `convex/events.ts` | Created | CRUD queries + mutations with membership checks |
| `components/worlds/EntityNav.tsx` | Modified | Added Timeline tab with Clock icon |
| `components/events/EventCard.tsx` | Created | Event card for grid display (name, date, era, description) |
| `components/events/CreateEventDialog.tsx` | Created | Create event dialog with all fields |
| `components/events/EditEventDialog.tsx` | Created | Edit event dialog with pre-populated fields |
| `components/events/DeleteEventDialog.tsx` | Created | Delete confirmation dialog |
| `app/(app)/worlds/[worldId]/timeline/page.tsx` | Created | Timeline list page with empty state |
| `app/(app)/worlds/[worldId]/timeline/[eventId]/page.tsx` | Created | Event detail page |

## Decisions Made

| Decision | Rationale | Impact |
|----------|-----------|--------|
| Separate events.ts (not entity dispatch) | Events have different fields/semantics than entities | Clean separation of concerns |
| Free-form date string field | Fantasy worlds have arbitrary calendar systems | No date picker or parsing needed |
| EntityNav uses startsWith for Timeline active state | Matches on /timeline and /timeline/[eventId] subpaths | Consistent tab highlighting |

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

| Issue | Resolution |
|-------|------------|
| Convex generated types missing `events` API | Ran `npx convex codegen` to regenerate |
| Next.js build trace error on `_not-found` | Pre-existing issue, unrelated to changes |

## Next Phase Readiness

**Ready:**
- Events table and CRUD fully operational
- Timeline pages integrated into world navigation
- Foundation ready for Plan 04-02 (entity linking + visual chronology)

**Concerns:**
- None

**Blockers:**
- None

---
*Phase: 04-timeline, Plan: 01*
*Completed: 2026-03-20*
