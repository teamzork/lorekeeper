---
phase: 04-timeline
plan: 02
subsystem: ui, database
tags: [convex, next.js, timeline, entity-linking, typography, lora, courier-prime]

requires:
  - phase: 04-timeline
    provides: events table, CRUD mutations, timeline pages
  - phase: 02-entity-management
    provides: entity list queries for link picker
provides:
  - Entity linking on events (entityLinks array with denormalized names)
  - Linked entities display on event detail page (grouped by type, clickable)
  - Entity picker UI (LinkEntitiesSection component)
  - Visual chronology view (TimelineView component with era grouping)
  - Chronicle/Timeline view toggle
  - Global typography: Lora serif + Courier Prime monospace
  - Warm amber accent color for temporal markers
affects: [05 AI consistency checker, 06 contribution workflow]

tech-stack:
  added: [Lora (Google Fonts), Courier Prime (Google Fonts)]
  patterns: [chronicle layout, left-gutter date column, era grouping, typewriter mono for prose content]

key-files:
  created: [components/events/LinkEntitiesSection.tsx, components/events/TimelineView.tsx]
  modified: [convex/schema.ts, convex/events.ts, components/events/CreateEventDialog.tsx, components/events/EditEventDialog.tsx, app/(app)/worlds/[worldId]/timeline/page.tsx, app/(app)/worlds/[worldId]/timeline/[eventId]/page.tsx, app/layout.tsx, app/globals.css, tailwind.config.ts, app/(app)/worlds/[worldId]/entities/[entityId]/page.tsx]

key-decisions:
  - "Entity links stored as denormalized array on event (not junction table)"
  - "Lora serif for all UI, Courier Prime monospace for writer-produced content"
  - "Gold amber accent (--accent: 45 90% 65%) for dates/temporal markers"
  - "Chronicle layout (left-border entries) replaces card grid for timeline list"
  - "Era grouping by consecutive runs, not global sort"

patterns-established:
  - "Writer-produced content uses font-mono (Courier Prime) globally"
  - "Temporal markers use accent color (amber/gold), not primary (purple)"
  - "Chronicle entries: date gutter left, content right, left-border accent"
  - "View toggles: segmented control with bg-card active indicator"

duration: ~25min
started: 2026-03-20T00:15:00Z
completed: 2026-03-20T00:40:00Z
---

# Phase 4 Plan 02: Entity Linking + Visual Chronology Summary

**Entity linking on events with picker UI, visual chronology view with era grouping, and global typography overhaul (Lora serif + Courier Prime typewriter mono) with warm amber temporal markers.**

## Performance

| Metric | Value |
|--------|-------|
| Duration | ~25min |
| Tasks | 3 auto tasks + 1 checkpoint (skipped — user redirected to /interface-design) |
| Files created | 2 |
| Files modified | 10 |

## Acceptance Criteria Results

| Criterion | Status | Notes |
|-----------|--------|-------|
| AC-1: Link entities to events | Pass | LinkEntitiesSection with type tabs, chip display, add/remove |
| AC-2: Linked entities display | Pass | Grouped by type on detail page, clickable links to entity detail |
| AC-3: Visual chronology view | Pass | TimelineView with era grouping, dot markers, chronicle aesthetic |

## Accomplishments

- Entity linking with denormalized names — picker UI with type tabs, chip display, integrated into create/edit dialogs
- Visual chronology view with era chapter dividers and dot markers on vertical line
- Global typography: Lora (serif) for all UI, Courier Prime (typewriter mono) for descriptions and textareas
- Amber/gold accent color for dates — temporal markers visually distinct from interactive purple

## Files Created/Modified

| File | Change | Purpose |
|------|--------|---------|
| `convex/schema.ts` | Modified | Added entityLinks field to events table |
| `convex/events.ts` | Modified | Added entityLinks to create/update args + validator |
| `components/events/LinkEntitiesSection.tsx` | Created | Entity picker with type tabs, chips, add/remove |
| `components/events/CreateEventDialog.tsx` | Modified | Integrated LinkEntitiesSection |
| `components/events/EditEventDialog.tsx` | Modified | Integrated LinkEntitiesSection + accepts worldId prop |
| `components/events/TimelineView.tsx` | Created | Visual chronology with era grouping and dot markers |
| `app/(app)/worlds/[worldId]/timeline/page.tsx` | Modified | Added Chronicle/Timeline view toggle |
| `app/(app)/worlds/[worldId]/timeline/[eventId]/page.tsx` | Modified | Linked entities section + gold dates + mono descriptions |
| `app/layout.tsx` | Modified | Lora + Courier Prime fonts, serif body |
| `app/globals.css` | Modified | Added --accent token, textarea font-mono rule |
| `tailwind.config.ts` | Modified | serif/mono font families, accent color |
| `app/(app)/worlds/[worldId]/entities/[entityId]/page.tsx` | Modified | font-mono on entity descriptions (consistency) |

## Decisions Made

| Decision | Rationale | Impact |
|----------|-----------|--------|
| Denormalized entity names in links | Avoids N+1 queries; names may go stale but detail page resolves fresh | Simple, fast reads |
| Lora + Courier Prime typography | Literary serif for worldbuilding UI; typewriter mono for writer content | App-wide change |
| Amber accent for dates | Temporal markers need visual distinction from interactive purple | New --accent token |
| Chronicle layout over card grid | Timelines are linear; card grids break narrative flow | Full-width entries with date gutter |
| Era grouping by consecutive runs | Events sorted chronologically; eras appear as natural chapter breaks | No global era index needed |

## Deviations from Plan

### Summary

| Type | Count | Impact |
|------|-------|--------|
| Scope additions | 2 | User-requested typography + accent color — enhances product |
| Approach changes | 1 | Chronicle layout replaced card grid per /interface-design |

**Total impact:** User-directed design improvements. No unplanned scope creep.

### Details

1. **Typography overhaul** — User requested Lora serif + Courier Prime mono mid-execution. Applied globally (layout.tsx, tailwind.config.ts, globals.css). Also applied font-mono to entity detail pages for consistency.

2. **Accent color** — Added --accent (amber/gold) for temporal markers. Plan used primary/purple for dates; interface design exploration revealed dates need distinct visual treatment.

3. **Chronicle layout** — Plan specified "alternating left/right cards on center line." User-initiated /interface-design exploration led to left-gutter chronicle layout instead. More readable, better narrative flow.

## Issues Encountered

| Issue | Resolution |
|-------|------------|
| Checkpoint skipped | User invoked /interface-design instead of verifying — design improvements folded into remaining work |
| EditEventDialog needed worldId prop | Added worldId prop to pass to LinkEntitiesSection |

## Next Phase Readiness

**Ready:**
- Full timeline functionality: events CRUD + entity linking + visual chronology
- Typography system established (serif + mono)
- Accent color system for temporal markers
- Foundation for Phase 5 (AI Consistency Checker has full world data: entities + relationships + timeline)

**Concerns:**
- Phase 3 (Relationships & Linking) is being worked by @dimka in parallel. Phase 5 depends on both Phase 3 and Phase 4.

**Blockers:**
- Phase 5 blocked until Phase 3 merges (@dimka)

---
*Phase: 04-timeline, Plan: 02*
*Completed: 2026-03-20*
