# Lorekeeper

## What This Is

Lorekeeper is a collaborative worldbuilding SaaS for fiction writers. Teams of co-authors can create a shared universe bible — defining characters, places, factions, artifacts, and lore — then link entities together and build a timeline of events. An AI consistency checker (Claude) scans the world for contradictions before any contribution merges, keeping canon clean across parallel contributors.

## Core Value

Co-authors can build and maintain a consistent shared universe bible, with AI catching contradictions before they become canon.

## Current State

| Attribute | Value |
|-----------|-------|
| Version | 0.1.0 |
| Status | Prototype |
| Last Updated | 2026-03-15 |

## Requirements

### Validated (Shipped)
- [x] Auth — sign up, sign in, sign out with password provider — Phase 1
- [x] Worlds — create world, dashboard, detail page — Phase 1
- [x] Invitations — invite collaborators by email with role assignment — Phase 1
- [x] Entity Management — Characters, Places, Factions, Artifacts, Lore CRUD — Phase 2

### Active (In Progress)
- [ ] Phase 3: Relationships & Linking — connect entities (lives in, belongs to, allied with)

### Planned (Next)
- [ ] Phase 4: Timeline — events with dates, linked to entities, visual chronology
- [ ] Phase 5: AI Consistency Checker — Claude scans world for contradictions on demand
- [ ] Phase 6: Contribution Workflow — propose changes, review diffs, merge into canon

### Out of Scope
- Mobile native apps — web-first
- Real-time co-editing (Google Docs style) — async proposal/review workflow instead

## Target Users

**Primary:** Fiction writers working in shared universes
- Co-authors collaborating on novels, RPG settings, or transmedia worlds
- Need consistency across hundreds of interconnected details
- Frustration: contradictions discovered late, after they're embedded in canon

**Secondary:** Solo worldbuilders who want AI-assisted consistency checking

## Context

**Technical Context:**
- Next.js App Router + TypeScript
- Convex — database, real-time subscriptions, auth
- Tailwind CSS + Radix UI
- Zustand — local UI state
- Claude API — AI consistency checker
- Vercel — deploy

## Constraints

### Technical Constraints
- Must deploy to Vercel (serverless)
- Database must be Convex
- Auth via Convex auth

### Business Constraints
- Claude API usage should be on-demand (not automatic on every save) to control costs

## Key Decisions

| Decision | Rationale | Date | Status |
|----------|-----------|------|--------|
| Propose → Review → Merge workflow | Prevents inconsistent changes from immediately becoming canon; mirrors how collaborative fiction editing works | 2026-03-15 | Active |
| AI checker on-demand, not automatic | Cost control; writers can batch check before merging | 2026-03-15 | Active |
| Password auth via @convex-dev/auth | Simplest provider for MVP; can add OAuth later | 2026-03-15 | Active |
| Dark theme with purple primary | Fits fantasy/worldbuilding aesthetic | 2026-03-15 | Active |
| Routes: /dashboard, /worlds/[id] | Route groups (app)/(auth) for layout separation | 2026-03-15 | Active |
| Separate tables per entity type | Clean indexing and type safety; unified CRUD via entityType dispatch | 2026-03-15 | Active |
| Plain text for entity fields (no rich text editor) | MVP simplicity; can upgrade to TipTap/Slate later | 2026-03-15 | Active |

## Success Metrics

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Core workflow complete (auth → entities → AI check → merge) | v0.1.0 | — | In progress |

## Tech Stack

| Layer | Technology | Notes |
|-------|------------|-------|
| Framework | Next.js App Router | TypeScript |
| Database | Convex | Real-time, auth included |
| Frontend | Tailwind CSS + Radix UI | |
| State | Zustand | Local UI state only |
| AI | Claude API | Consistency checker |
| Hosting | Vercel | |

---
*PROJECT.md — Updated when requirements or context change*
*Last updated: 2026-03-15 after Phase 2*
