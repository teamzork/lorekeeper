# Project State

## Project Reference

See: .paul/PROJECT.md (updated 2026-03-22 after Phase 7)

**Core value:** Co-authors can build and maintain a consistent shared universe bible, with AI catching contradictions before they become canon.
**Current focus:** v0.1 MVP — Phase 7 complete, ready for next phase.

## Current Position

Milestone: v0.1 MVP (v0.1.0)
Phase: 7 of 8 (Visual Hierarchy Display) — Complete
Plan: 07-01 complete
Status: Phase 7 done, ready to plan next phase
Last activity: 2026-03-22 — Phase 7 complete, transitioned

Progress:
- Milestone: [██████░░░░] 63% (5/8 phases)
- Phase 7: [██████████] 100%

## Loop Position

Current loop state:
```
PLAN ──▶ APPLY ──▶ UNIFY
  ✓        ✓        ✓     [Loop complete — Phase 7 done]
```

## Accumulated Context

### Decisions
| Decision | Phase | Impact |
|----------|-------|--------|
| Dark theme, purple primary | Phase 1 | All UI follows this palette |
| Access control in Convex queries | Phase 1 | All future queries check membership |
| Separate tables per entity type | Phase 2 | characters, places, factions, artifacts, lore tables |
| Unified convex/entities.ts for all CRUD | Phase 2 | Single file with entityType param dispatching to correct table |
| Events get own table + CRUD file | Phase 4 | Events are conceptually distinct from entities |
| Lora serif + Courier Prime mono | Phase 4 | Literary serif for UI, typewriter mono for writer content |
| Amber/gold accent for temporal markers | Phase 4 | --accent token, distinct from interactive purple |
| Entity links denormalized on events | Phase 4 | Avoids N+1 queries |
| Free-form date strings | Phase 4 | Fantasy worlds have arbitrary calendars |
| Added Phase 7: Visual Hierarchy Display | Phase 5 | Extends milestone scope — visual relationship graph |
| Added Phase 8: User Profile Page | Phase 5 | Extends milestone scope — profile editing |
| @xyflow/react + dagre for graph viz | Phase 7 | React Flow for nodes/edges, dagre for layout computation |
| Type-specific border colors on graph nodes | Phase 7 | purple/emerald/amber/cyan/rose for visual entity distinction |

### Deferred Issues
- Phase 5 plan 05-01 mid-apply: Convex codegen error with "use node" + internalQuery. Needs fix when resuming Phase 5.

### Blockers/Concerns
None active.

## Session Continuity

Last session: 2026-03-22
Stopped at: Phase 7 complete, transitioned
Next action: Plan next phase (Phase 3, 5, 6, or 8 — check ROADMAP for dependencies)
Resume file: .paul/ROADMAP.md
Resume context:
- Phase 7 branch feat/ganger-phase-7-vsm needs merge to main
- convex/consistency.ts has TS errors (Phase 5 WIP, not Phase 7)

---
*STATE.md — Updated after every significant action*
