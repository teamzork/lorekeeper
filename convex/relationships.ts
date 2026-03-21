import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { auth } from "./auth";

type EntityType = "character" | "place" | "faction" | "artifact" | "lore";

const entityTypes = v.union(
  v.literal("character"),
  v.literal("place"),
  v.literal("faction"),
  v.literal("artifact"),
  v.literal("lore")
);

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
  if (world.ownerId === userId) return { role: "owner" };
  const membership = await ctx.db
    .query("memberships")
    .withIndex("by_world_and_user", (q: any) =>
      q.eq("worldId", worldId).eq("userId", userId)
    )
    .first();
  return membership;
}

export const listForEntity = query({
  args: {
    entityId: v.string(),
    worldId: v.id("worlds"),
  },
  handler: async (ctx, { entityId, worldId }) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return [];

    const membership = await checkMembership(ctx, worldId, userId);
    if (!membership) return [];

    const outgoing = await ctx.db
      .query("relationships")
      .withIndex("by_from", (q: any) => q.eq("fromId", entityId))
      .collect();

    const incoming = await ctx.db
      .query("relationships")
      .withIndex("by_to", (q: any) => q.eq("toId", entityId))
      .collect();

    const results = [];

    for (const rel of outgoing) {
      const table = tableMap[rel.toType as EntityType];
      const otherId = ctx.db.normalizeId(table, rel.toId);
      if (!otherId) continue;
      const other = await ctx.db.get(otherId);
      if (!other) continue;
      results.push({
        _id: rel._id,
        label: rel.label,
        direction: "outgoing" as const,
        otherId: rel.toId,
        otherType: rel.toType as EntityType,
        otherName: other.name as string,
      });
    }

    for (const rel of incoming) {
      const table = tableMap[rel.fromType as EntityType];
      const otherId = ctx.db.normalizeId(table, rel.fromId);
      if (!otherId) continue;
      const other = await ctx.db.get(otherId);
      if (!other) continue;
      results.push({
        _id: rel._id,
        label: rel.label,
        direction: "incoming" as const,
        otherId: rel.fromId,
        otherType: rel.fromType as EntityType,
        otherName: other.name as string,
      });
    }

    return results;
  },
});

export const create = mutation({
  args: {
    worldId: v.id("worlds"),
    fromId: v.string(),
    fromType: entityTypes,
    toId: v.string(),
    toType: entityTypes,
    label: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const membership = await checkMembership(ctx, args.worldId, userId);
    if (!membership) throw new Error("Not a member of this world");
    if (membership.role === "viewer") throw new Error("Not authorized");

    return await ctx.db.insert("relationships", {
      worldId: args.worldId,
      fromId: args.fromId,
      fromType: args.fromType,
      toId: args.toId,
      toType: args.toType,
      label: args.label,
      createdBy: userId,
      createdAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: {
    id: v.id("relationships"),
    worldId: v.id("worlds"),
  },
  handler: async (ctx, { id, worldId }) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const membership = await checkMembership(ctx, worldId, userId);
    if (!membership) throw new Error("Not a member of this world");
    if (membership.role === "viewer") throw new Error("Not authorized");

    await ctx.db.delete(id);
  },
});

export const listForWorld = query({
  args: { worldId: v.id("worlds") },
  handler: async (ctx, { worldId }) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return [];

    const membership = await checkMembership(ctx, worldId, userId);
    if (!membership) return [];

    return await ctx.db
      .query("relationships")
      .withIndex("by_world", (q: any) => q.eq("worldId", worldId))
      .collect();
  },
});
