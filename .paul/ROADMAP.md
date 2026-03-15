# Roadmap: Lorekeeper

## Overview

Lorekeeper ships in one milestone (v0.1 MVP): six sequential phases that build the full collaborative worldbuilding workflow — from auth and world creation, through entity management, relationships, timeline, AI consistency checking, and finally the propose/review/merge contribution workflow.

## Current Milestone

**v0.1 MVP** (v0.1.0)
Status: In progress
Phases: 1 of 6 complete

## Phases

| Phase | Name | Plans | Status | Completed |
|-------|------|-------|--------|-----------|
| 1 | Auth & Worlds | 3 | Complete | 2026-03-15 |
| 2 | Entity Management | TBD | Not started | - |
| 3 | Relationships & Linking | TBD | Not started | - |
| 4 | Timeline | TBD | Not started | - |
| 5 | AI Consistency Checker | TBD | Not started | - |
| 6 | Contribution Workflow | TBD | Not started | - |

## Phase Details

### Phase 1: Auth & Worlds

**Goal:** Users can sign up, create a world, and invite collaborators
**Depends on:** Nothing (first phase)
**Research:** Unlikely (Convex auth is established)
**Owner:** @vsm (in-progress)

**Scope:**
- User authentication via Convex auth
- World creation (name, description, visibility)
- Invite collaborators by email/username
- World dashboard (list of owned + shared worlds)

**Plans:**
- [x] 01-01: Project scaffold (Next.js + Convex + Tailwind + schema)
- [x] 01-02: Auth flow (sign up, sign in, sign out, route protection)
- [x] 01-03: Worlds dashboard + invite collaborators

### Phase 2: Entity Management

**Goal:** Users can create and manage Characters, Places, Factions, Artifacts, and Lore entries with rich text fields
**Depends on:** Phase 1 (world context, auth)
**Research:** Unlikely (CRUD patterns)

**Scope:**
- Entity types: Character, Place, Faction, Artifact, Lore
- Rich text fields (description, history, notes)
- Entity list and detail views per world

**Plans:**
- [ ] 02-01: TBD

### Phase 3: Relationships & Linking

**Goal:** Users can connect entities with typed relationships (lives in, belongs to, allied with)
**Depends on:** Phase 2 (entities must exist)
**Research:** Unlikely (graph relationship patterns in Convex)

**Scope:**
- Relationship types per entity pair
- Link UI on entity detail pages
- Relationship graph view

**Plans:**
- [ ] 03-01: TBD

### Phase 4: Timeline

**Goal:** Users can create events with dates, link them to entities, and view a visual chronology
**Depends on:** Phase 2 (entities to link to)
**Research:** Unlikely (timeline UI is standard)

**Scope:**
- Event creation with in-world dates
- Entity links on events
- Visual timeline view

**Plans:**
- [ ] 04-01: TBD

### Phase 5: AI Consistency Checker

**Goal:** Claude scans a world for contradictions on demand and returns flagged issues
**Depends on:** Phase 3, Phase 4 (full world data: entities + relationships + timeline)
**Research:** Likely (Claude API prompt design, context window management for large worlds)
**Research topics:** Prompt structure for consistency checking, chunking strategies for large worlds, output format for flagged contradictions

**Scope:**
- On-demand consistency scan per world
- Claude analyzes entities, relationships, and timeline
- Flagged contradiction report with entity references

**Plans:**
- [ ] 05-01: TBD

### Phase 6: Contribution Workflow

**Goal:** Contributors can propose changes, owners review diffs, and approved changes merge into canon
**Depends on:** Phase 5 (AI check runs before merge)
**Research:** Unlikely (proposal/review pattern)

**Scope:**
- Proposal creation (entity changes bundled)
- Diff view for reviewer
- AI consistency check gate before merge
- Approve/reject with comments
- Merge into world canon

**Plans:**
- [ ] 06-01: TBD

---
*Roadmap created: 2026-03-15*
*Last updated: 2026-03-15*
