import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { auth } from "./auth";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return [];

    // Get worlds owned by user
    const ownedWorlds = await ctx.db
      .query("worlds")
      .withIndex("by_owner", (q) => q.eq("ownerId", userId))
      .collect();

    // Get memberships for this user (includes owner memberships)
    const memberships = await ctx.db
      .query("memberships")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    // Get worlds from memberships (non-owned)
    const memberWorldIds = memberships
      .filter((m) => m.role !== "owner")
      .map((m) => m.worldId);

    const memberWorlds = await Promise.all(
      memberWorldIds.map((id) => ctx.db.get(id))
    );

    // Build result with role info
    const ownedWithRole = ownedWorlds.map((w) => ({
      ...w,
      role: "owner" as const,
    }));

    const sharedWithRole = memberWorlds
      .filter((w): w is NonNullable<typeof w> => w !== null)
      .map((w) => {
        const membership = memberships.find((m) => m.worldId === w._id);
        return {
          ...w,
          role: membership!.role,
        };
      });

    return [...ownedWithRole, ...sharedWithRole];
  },
});

export const get = query({
  args: { worldId: v.id("worlds") },
  handler: async (ctx, { worldId }) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;

    const world = await ctx.db.get(worldId);
    if (!world) return null;

    // Check if user is owner or has membership
    if (world.ownerId !== userId) {
      const membership = await ctx.db
        .query("memberships")
        .withIndex("by_world_and_user", (q) =>
          q.eq("worldId", worldId).eq("userId", userId)
        )
        .first();
      if (!membership) return null;
    }

    return world;
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    visibility: v.union(v.literal("public"), v.literal("private")),
  },
  handler: async (ctx, { name, description, visibility }) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const now = Date.now();

    const worldId = await ctx.db.insert("worlds", {
      name,
      description,
      visibility,
      ownerId: userId,
      createdAt: now,
    });

    // Create owner membership
    await ctx.db.insert("memberships", {
      worldId,
      userId,
      role: "owner",
      invitedAt: now,
      joinedAt: now,
    });

    return worldId;
  },
});
