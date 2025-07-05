import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// The schema defines your data model for the database.
// For more information, see https://docs.convex.dev/database/schema
export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    name: v.string(),
  }).index("by_clerkId", ["clerkId"]),
  
  strategies: defineTable({
    title: v.string(),
    description: v.string(),
    instructions: v.string(),
    researchSupport: v.union(v.literal("high"), v.literal("medium"), v.literal("low")),
    categories: v.array(v.string()),
    emotions: v.array(v.string()),
    isActive: v.boolean(),
  }),
  
  userLogs: defineTable({
    userId: v.id("users"),
    strategyId: v.optional(v.id("strategies")),
    title: v.optional(v.string()), // For "Reflection" entries
    rating: v.optional(v.number()), // Optional for reflections
    note: v.optional(v.string()),
    selectedFilter: v.optional(v.string()),
    filterType: v.optional(v.union(v.literal("category"), v.literal("emotion"))),
  }).index("by_userId", ["userId"]),
});
