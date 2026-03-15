import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { auth } from "./auth";

export const listByWorld = query({
  args: { worldId: v.id("worlds") },
  handler: async (ctx, { worldId }) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return [];

    // Verify requesting user is a member
    const world = await ctx.db.get(worldId);
    if (!world) return [];

    const isOwner = world.ownerId === userId;
    if (!isOwner) {
      const membership = await ctx.db
        .query("memberships")
        .withIndex("by_world_and_user", (q) =>
          q.eq("worldId", worldId).eq("userId", userId)
        )
        .first();
      if (!membership) return [];
    }

    // Get all memberships for this world
    const memberships = await ctx.db
      .query("memberships")
      .withIndex("by_world", (q) => q.eq("worldId", worldId))
      .collect();

    // Join with user data
    const membersWithUsers = await Promise.all(
      memberships.map(async (m) => {
        const user = await ctx.db.get(m.userId);
        return {
          ...m,
          userName: user?.name ?? "Unknown",
          userEmail: user?.email ?? "",
        };
      })
    );

    return membersWithUsers;
  },
});

export const invite = mutation({
  args: {
    worldId: v.id("worlds"),
    email: v.string(),
    role: v.union(v.literal("editor"), v.literal("viewer")),
  },
  handler: async (ctx, { worldId, email, role }) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Verify requesting user is the world owner
    const world = await ctx.db.get(worldId);
    if (!world) throw new Error("World not found");
    if (world.ownerId !== userId) throw new Error("Only the owner can invite");

    // Look up user by email
    const invitee = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", email))
      .first();

    if (!invitee) {
      return { success: false, message: "No user found with that email. They need to sign up first." };
    }

    // Check for self-invite
    if (invitee._id === userId) {
      return { success: false, message: "You can't invite yourself." };
    }

    // Check for duplicate membership
    const existing = await ctx.db
      .query("memberships")
      .withIndex("by_world_and_user", (q) =>
        q.eq("worldId", worldId).eq("userId", invitee._id)
      )
      .first();

    if (existing) {
      return { success: false, message: "This user is already a member." };
    }

    await ctx.db.insert("memberships", {
      worldId,
      userId: invitee._id,
      role,
      invitedAt: Date.now(),
    });

    return { success: true, message: `Invited ${invitee.name ?? email} as ${role}.` };
  },
});
