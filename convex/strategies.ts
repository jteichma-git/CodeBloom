import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("strategies").filter(q => q.eq(q.field("isActive"), true)).collect();
  },
});

export const getById = query({
  args: { id: v.id("strategies") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    instructions: v.string(),
    researchSupport: v.union(v.literal("high"), v.literal("medium"), v.literal("low")),
    categories: v.array(v.string()),
    emotions: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("strategies", {
      ...args,
      isActive: true,
    });
  },
});

export const getGlobalRatings = query({
  args: {},
  handler: async (ctx) => {
    // Get all user logs (no user filtering for global stats)
    const allLogs = await ctx.db.query("userLogs").collect();
    
    // Group by strategy and calculate averages
    const ratingsByStrategy: Record<string, { total: number; count: number }> = {};
    
    for (const log of allLogs) {
      const strategyId = log.strategyId;
      const rating = log.rating;
      // Only include logs with both strategyId and rating
      if (strategyId && rating) {
        if (!ratingsByStrategy[strategyId]) {
          ratingsByStrategy[strategyId] = { total: 0, count: 0 };
        }
        ratingsByStrategy[strategyId].total += rating;
        ratingsByStrategy[strategyId].count += 1;
      }
    }
    
    // Calculate averages
    const globalRatings: Record<string, number> = {};
    for (const [strategyId, stats] of Object.entries(ratingsByStrategy)) {
      globalRatings[strategyId] = stats.total / stats.count;
    }
    
    return globalRatings;
  },
});