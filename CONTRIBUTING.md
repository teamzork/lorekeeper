# Contributing to Lorekeeper

## Setup

```bash
git clone <repo-url>
cd lorekeeper
```

Open in Claude Code. The Ganger coordination skills are included in `.claude/skills/` — no separate install needed.

## Register yourself

```
/ganger-setup
```

Enter your handle (e.g. `@maya`). This creates a local `.ganger/config.md` (gitignored — never committed).

## Check what's available

```
/ganger-status
```

## Claim a phase

```
/ganger-claim <N>
```

This creates your feature branch and locks the phase to you in the shared `TEAM-STATE.md`.

## When you're done

```
/ganger-handoff
```

Leave a note describing your schema, API contracts, or anything the next contributor needs. Open a PR for your branch.

## After a PR merges

```
/ganger-done <N>
```

This marks the phase merged and surfaces newly unblocked phases to the team.

---

## Global install (optional)

If you work on multiple Ganger-enabled repos, install the skills globally so they're always available:

```bash
cp -r .claude/skills/ganger-* ~/.claude/skills/
```

Restart Claude Code after copying.
