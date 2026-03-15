import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  // Auth tables from @convex-dev/auth (includes users, sessions, etc.)
  // Extended with profile fields
  ...authTables,

  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    // Required by @convex-dev/auth
    isAnonymous: v.optional(v.boolean()),
  }).index("email", ["email"]),

  // worlds — the primary unit of collaboration
  worlds: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    visibility: v.union(v.literal("public"), v.literal("private")),
    ownerId: v.id("users"),
    createdAt: v.number(),
  }).index("by_owner", ["ownerId"]),

  // memberships — links users to worlds with roles
  memberships: defineTable({
    worldId: v.id("worlds"),
    userId: v.id("users"),
    role: v.union(
      v.literal("owner"),
      v.literal("editor"),
      v.literal("viewer")
    ),
    invitedAt: v.number(),
    joinedAt: v.optional(v.number()), // null = invite pending
  })
    .index("by_world", ["worldId"])
    .index("by_user", ["userId"])
    .index("by_world_and_user", ["worldId", "userId"]),
});
