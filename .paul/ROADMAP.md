# Roadmap: Lorekeeper

## Overview

Lorekeeper ships in one milestone (v0.1 MVP): seven phases that build the full collaborative worldbuilding workflow — from auth and world creation, through entity management, relationships, timeline, AI consistency checking, a visual relationship graph, and finally the propose/review/merge contribution workflow.

## Current Milestone

**v0.1 MVP** (v0.1.0)
Status: In progress
Phases: 5 of 8 complete

## Phases

| Phase | Name | Plans | Status | Completed |
|-------|------|-------|--------|-----------|
| 1 | Auth & Worlds | 3 | Complete | 2026-03-15 |
| 2 | Entity Management | 3 | Complete | 2026-03-15 |
| 3 | Relationships & Linking | TBD | Not started | - |
| 4 | Timeline | 2 | Complete | 2026-03-20 |
| 5 | AI Consistency Checker | 2 | Planning | - |
| 6 | Contribution Workflow | TBD | Not started | - |
| 7 | Visual Hierarchy Display | 1 | Complete | 2026-03-21 |
| 8 | User Profile Page | TBD | Not started | - |

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
- [x] 02-01: Entity schema + Convex CRUD + world hub navigation
- [x] 02-02: Entity list pages + create dialogs + WorldCard link fix
- [x] 02-03: Entity detail pages + edit/delete

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
- [x] 04-01: Events schema + CRUD + Timeline tab + list/detail pages + create/edit/delete dialogs
- [x] 04-02: Entity linking on events + visual chronology view + typography overhaul

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
- [ ] 05-01: Backend — consistencyScans schema + Convex action + Claude API integration + scan queries
- [ ] 05-02: Frontend — scan trigger UI + results display + status tracking

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

### Phase 7: Visual Hierarchy Display

**Goal:** An interactive visual graph showing how entities relate to each other — nodes connected by directional lines, visually pleasing and fun to explore
**Depends on:** Phase 3 (relationships data), Phase 2 (entities)
**Research:** Likely (graph visualization libraries — React Flow, D3-force, Cytoscape, vis.js, etc.)
**Research topics:** Best React-compatible graph/network visualization library, force-directed layout options, styling/theming for dark UI, performance with 100+ nodes

**Scope:**
- Interactive node-and-edge graph per world
- Entities as styled nodes (icon/color by type), relationships as labeled directed edges
- Pan, zoom, drag nodes
- Click node to navigate to entity detail
- Visually polished — fits the dark/purple aesthetic

**Plans:**
- [x] 07-01: Graph page — @xyflow/react + dagre layout, custom entity nodes, relationship edges, EntityNav tab

### Phase 8: User Profile Page

**Goal:** User profile page where users can view and edit their personal data (name, email, avatar, etc.)
**Depends on:** Phase 1 (auth, users table)
**Research:** Unlikely (standard form patterns)

**Scope:**
- Profile page at /profile or /settings
- View and edit name, email, avatar
- Form validation and save feedback

**Plans:**
- [ ] 08-01: TBD

---
*Roadmap created: 2026-03-15*
*Last updated: 2026-03-22*
