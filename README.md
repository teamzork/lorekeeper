# Lorekeeper

Collaborative worldbuilding for fiction writers. Build a shared universe bible — characters, places, factions, events — with multiple co-authors contributing in parallel. AI flags consistency errors before they become canon.

## What it does

- Create a **World** and invite collaborators
- Define **Entities**: Characters, Places, Factions, Artifacts, Lore entries
- Link entities together (Character *lives in* Place, *belongs to* Faction)
- Build a **Timeline** of events anchored to entities
- Run the **Consistency Checker** — Claude scans your world for contradictions before a contribution merges
- **Propose → Review → Merge** workflow for collaborative canon changes

## Stack

- **Next.js** App Router + TypeScript
- **Convex** — database, real-time subscriptions, auth
- **Tailwind CSS** + Radix UI
- **Zustand** — local UI state
- **Claude API** — AI consistency checker
- **Vercel** — deploy

## Phases

| # | Phase | Description |
|---|---|---|
| 1 | Auth & Worlds | Sign up, create a world, invite collaborators |
| 2 | Entity Management | Characters, Places, Factions CRUD with rich text fields |
| 3 | Relationships & Linking | Connect entities — lives in, belongs to, allied with |
| 4 | Timeline | Events with dates, linked to entities, visual chronology |
| 5 | AI Consistency Checker | Claude scans a world for contradictions on demand |
| 6 | Contribution Workflow | Propose changes, review diffs, merge into canon |
