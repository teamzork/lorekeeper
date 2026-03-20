import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { auth } from "./auth";

async function checkMembership(
  ctx: { db: any },
  worldId: any,
  userId: any
): Promise<{ role: string } | null> {
  const world = await ctx.db.get(worldId);
  if (!world) return null;

  if (world.ownerId === userId) {
    return { role: "owner" };
  }

  const membership = await ctx.db
    .query("memberships")
    .withIndex("by_world_and_user", (q: any) =>
      q.eq("worldId", worldId).eq("userId", userId)
    )
    .first();

  return membership;
}

function canWrite(role: string): boolean {
  return role === "owner" || role === "editor";
}

export const list = query({
  args: {
    worldId: v.id("worlds"),
  },
  handler: async (ctx, { worldId }) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return [];

    const membership = await checkMembership(ctx, worldId, userId);
    if (!membership) return [];

    const events = await ctx.db
      .query("events")
      .withIndex("by_world", (q: any) => q.eq("worldId", worldId))
      .collect();

    // Sort by creation time ascending (chronological)
    return events.sort((a: any, b: any) => a._creationTime - b._creationTime);
  },
});

export const get = query({
  args: {
    id: v.id("events"),
  },
  handler: async (ctx, { id }) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;

    const event = await ctx.db.get(id);
    if (!event) return null;

    const membership = await checkMembership(ctx, event.worldId, userId);
    if (!membership) return null;

    return event;
  },
});

export const count = query({
  args: {
    worldId: v.id("worlds"),
  },
  handler: async (ctx, { worldId }) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return 0;

    const membership = await checkMembership(ctx, worldId, userId);
    if (!membership) return 0;

    const events = await ctx.db
      .query("events")
      .withIndex("by_world", (q: any) => q.eq("worldId", worldId))
      .collect();

    return events.length;
  },
});

const entityLinkValidator = v.object({
  entityId: v.string(),
  entityType: v.string(),
  entityName: v.string(),
});

export const create = mutation({
  args: {
    worldId: v.id("worlds"),
    name: v.string(),
    date: v.string(),
    description: v.optional(v.string()),
    era: v.optional(v.string()),
    significance: v.optional(v.string()),
    entityLinks: v.optional(v.array(entityLinkValidator)),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const membership = await checkMembership(ctx, args.worldId, userId);
    if (!membership) throw new Error("Not a member of this world");
    if (!canWrite(membership.role)) throw new Error("Not authorized");

    const now = Date.now();
    const id = await ctx.db.insert("events", {
      worldId: args.worldId,
      name: args.name,
      date: args.date,
      description: args.description,
      era: args.era,
      significance: args.significance,
      entityLinks: args.entityLinks,
      createdBy: userId,
      createdAt: now,
      updatedAt: now,
    });

    return id;
  },
});

export const update = mutation({
  args: {
    id: v.id("events"),
    name: v.optional(v.string()),
    date: v.optional(v.string()),
    description: v.optional(v.string()),
    era: v.optional(v.string()),
    significance: v.optional(v.string()),
    entityLinks: v.optional(v.array(entityLinkValidator)),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const event = await ctx.db.get(args.id);
    if (!event) throw new Error("Event not found");

    const membership = await checkMembership(ctx, event.worldId, userId);
    if (!membership) throw new Error("Not a member of this world");
    if (!canWrite(membership.role)) throw new Error("Not authorized");

    const { id: _id, ...updates } = args;
    const patch: Record<string, any> = { updatedAt: Date.now() };

    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        patch[key] = value;
      }
    }

    await ctx.db.patch(args.id, patch);
  },
});

export const remove = mutation({
  args: {
    id: v.id("events"),
  },
  handler: async (ctx, { id }) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const event = await ctx.db.get(id);
    if (!event) throw new Error("Event not found");

    const membership = await checkMembership(ctx, event.worldId, userId);
    if (!membership) throw new Error("Not a member of this world");
    if (!canWrite(membership.role)) throw new Error("Not authorized");

    await ctx.db.delete(id);
  },
});
