import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { auth } from "./auth";

const entityTypes = v.union(
  v.literal("character"),
  v.literal("place"),
  v.literal("faction"),
  v.literal("artifact"),
  v.literal("lore")
);

type EntityType = "character" | "place" | "faction" | "artifact" | "lore";

const tableMap: Record<EntityType, "characters" | "places" | "factions" | "artifacts" | "lore"> = {
  character: "characters",
  place: "places",
  faction: "factions",
  artifact: "artifacts",
  lore: "lore",
};

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
    entityType: entityTypes,
  },
  handler: async (ctx, { worldId, entityType }) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return [];

    const membership = await checkMembership(ctx, worldId, userId);
    if (!membership) return [];

    const table = tableMap[entityType];
    const entities = await ctx.db
      .query(table)
      .withIndex("by_world", (q: any) => q.eq("worldId", worldId))
      .collect();

    return entities;
  },
});

export const get = query({
  args: {
    id: v.string(),
    entityType: entityTypes,
  },
  handler: async (ctx, { id, entityType }) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;

    const table = tableMap[entityType];
    const entityId = ctx.db.normalizeId(table, id);
    if (!entityId) return null;

    const entity = await ctx.db.get(entityId);
    if (!entity) return null;

    const worldId = (entity as any).worldId;
    const membership = await checkMembership(ctx, worldId, userId);
    if (!membership) return null;

    return entity;
  },
});

export const count = query({
  args: {
    worldId: v.id("worlds"),
  },
  handler: async (ctx, { worldId }) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;

    const membership = await checkMembership(ctx, worldId, userId);
    if (!membership) return null;

    const counts: Record<string, number> = {};
    for (const [type, table] of Object.entries(tableMap)) {
      const entities = await ctx.db
        .query(table)
        .withIndex("by_world", (q: any) => q.eq("worldId", worldId))
        .collect();
      counts[type] = entities.length;
    }

    return counts;
  },
});

export const create = mutation({
  args: {
    worldId: v.id("worlds"),
    entityType: entityTypes,
    name: v.string(),
    description: v.optional(v.string()),
    // Type-specific optional fields
    title: v.optional(v.string()),
    appearance: v.optional(v.string()),
    personality: v.optional(v.string()),
    background: v.optional(v.string()),
    geography: v.optional(v.string()),
    climate: v.optional(v.string()),
    significance: v.optional(v.string()),
    goals: v.optional(v.string()),
    beliefs: v.optional(v.string()),
    headquarters: v.optional(v.string()),
    origin: v.optional(v.string()),
    powers: v.optional(v.string()),
    currentLocation: v.optional(v.string()),
    category: v.optional(v.string()),
    source: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const membership = await checkMembership(ctx, args.worldId, userId);
    if (!membership) throw new Error("Not a member of this world");
    if (!canWrite(membership.role)) throw new Error("Not authorized");

    const now = Date.now();
    const table = tableMap[args.entityType];

    // Build entity data based on type
    const base = {
      worldId: args.worldId,
      name: args.name,
      description: args.description,
      createdBy: userId,
      createdAt: now,
      updatedAt: now,
    };

    let data: any;
    switch (args.entityType) {
      case "character":
        data = { ...base, title: args.title, appearance: args.appearance, personality: args.personality, background: args.background };
        break;
      case "place":
        data = { ...base, geography: args.geography, climate: args.climate, significance: args.significance };
        break;
      case "faction":
        data = { ...base, goals: args.goals, beliefs: args.beliefs, headquarters: args.headquarters };
        break;
      case "artifact":
        data = { ...base, origin: args.origin, powers: args.powers, currentLocation: args.currentLocation };
        break;
      case "lore":
        data = { ...base, category: args.category, source: args.source };
        break;
    }

    const id = await ctx.db.insert(table, data);
    return id;
  },
});

export const update = mutation({
  args: {
    id: v.string(),
    entityType: entityTypes,
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    title: v.optional(v.string()),
    appearance: v.optional(v.string()),
    personality: v.optional(v.string()),
    background: v.optional(v.string()),
    geography: v.optional(v.string()),
    climate: v.optional(v.string()),
    significance: v.optional(v.string()),
    goals: v.optional(v.string()),
    beliefs: v.optional(v.string()),
    headquarters: v.optional(v.string()),
    origin: v.optional(v.string()),
    powers: v.optional(v.string()),
    currentLocation: v.optional(v.string()),
    category: v.optional(v.string()),
    source: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const table = tableMap[args.entityType];
    const entityId = ctx.db.normalizeId(table, args.id);
    if (!entityId) throw new Error("Invalid entity ID");

    const entity = await ctx.db.get(entityId);
    if (!entity) throw new Error("Entity not found");

    const membership = await checkMembership(ctx, entity.worldId, userId);
    if (!membership) throw new Error("Not a member of this world");
    if (!canWrite(membership.role)) throw new Error("Not authorized");

    // Build patch with only provided fields
    const { id: _id, entityType: _type, ...updates } = args;
    const patch: Record<string, any> = { updatedAt: Date.now() };

    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        patch[key] = value;
      }
    }

    await ctx.db.patch(entityId, patch);
  },
});

export const remove = mutation({
  args: {
    id: v.string(),
    entityType: entityTypes,
  },
  handler: async (ctx, { id, entityType }) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const table = tableMap[entityType];
    const entityId = ctx.db.normalizeId(table, id);
    if (!entityId) throw new Error("Invalid entity ID");

    const entity = await ctx.db.get(entityId);
    if (!entity) throw new Error("Entity not found");

    const membership = await checkMembership(ctx, entity.worldId, userId);
    if (!membership) throw new Error("Not a member of this world");
    if (!canWrite(membership.role)) throw new Error("Not authorized");

    await ctx.db.delete(entityId);
  },
});
