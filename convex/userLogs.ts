import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getUserLogs = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      return [];
    }

    const logs = await ctx.db
      .query("userLogs")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect();

    // Get strategy details for each log
    const logsWithStrategies = await Promise.all(
      logs.map(async (log) => {
        if (log.strategyId) {
          const strategy = await ctx.db.get(log.strategyId);
          return {
            ...log,
            strategyTitle: strategy?.title || "Unknown Strategy",
          };
        } else {
          // This is a "Random Musing" entry
          return {
            ...log,
            strategyTitle: log.title || "Random Musing",
          };
        }
      })
    );

    return logsWithStrategies;
  },
});

export const createLog = mutation({
  args: {
    strategyId: v.optional(v.id("strategies")),
    title: v.optional(v.string()), // For "Random Musing" entries
    rating: v.optional(v.number()),
    note: v.optional(v.string()),
    selectedFilter: v.optional(v.string()),
    filterType: v.optional(v.union(v.literal("category"), v.literal("emotion"))),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    return await ctx.db.insert("userLogs", {
      ...args,
      userId: user._id,
    });
  },
});