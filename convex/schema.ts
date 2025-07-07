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
    researchSupport: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    // Support both old and new field names during migration
    categories: v.optional(v.array(v.string())), // Old field
    emotions: v.optional(v.array(v.string())), // Old field
    emotionCategories: v.optional(v.array(v.string())), // New field
    strategyCategories: v.optional(v.array(v.string())), // New field
    estimatedMinutes: v.optional(v.number()),
    isActive: v.optional(v.boolean()), // From old schema
  }),

  userRatings: defineTable({
    userId: v.string(),
    strategyId: v.id("strategies"),
    rating: v.number(), // 1-5 scale
    notes: v.optional(v.string()),
    context: v.optional(v.string()), // emotion or category they were addressing
  })
    .index("by_userId", ["userId"])
    .index("by_strategyId", ["strategyId"])
    .index("by_userId_strategyId", ["userId", "strategyId"]),

  userLogs: defineTable({
    userId: v.string(),
    strategyId: v.id("strategies"),
    // Migration compatibility fields
    completedAt: v.optional(v.number()), // Made optional for migration
    effectivenessRating: v.optional(v.number()), // 1-5 scale, optional for migration
    rating: v.optional(v.number()), // Old field name, optional
    notes: v.optional(v.string()),
    note: v.optional(v.string()), // Old field name, optional
    context: v.optional(v.string()), // what they were addressing, optional for migration
    // Old fields from previous schema
    filterType: v.optional(v.string()),
    selectedFilter: v.optional(v.string()),
  })
    .index("by_userId", ["userId"]),
});
