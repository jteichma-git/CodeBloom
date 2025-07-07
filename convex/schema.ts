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
    emotionCategories: v.array(v.string()),
    strategyCategories: v.array(v.string()),
    estimatedMinutes: v.number(),
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
    completedAt: v.number(),
    effectivenessRating: v.number(), // 1-5 scale
    notes: v.optional(v.string()),
    context: v.string(), // what they were addressing
  })
    .index("by_userId", ["userId"])
    .index("by_userId_completedAt", ["userId", "completedAt"]),
});
