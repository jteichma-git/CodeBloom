import { internalMutation, mutation, query } from "./_generated/server";
import { v } from "convex/values";


export const upsertSlackUser = internalMutation({
  args: {
    slackId: v.string(),
    name: v.string(),
    email: v.optional(v.string()),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("slackUsers")
      .withIndex("by_slackId", (q) => q.eq("slackId", args.slackId))
      .unique();

    if (existing) {
      return await ctx.db.patch(existing._id, {
        name: args.name,
        email: args.email,
        isActive: args.isActive,
      });
    } else {
      return await ctx.db.insert("slackUsers", args);
    }
  },
});



export const getActiveSlackUsers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("slackUsers")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
  },
});

export const getPairingHistory = query({
  args: {
    userId: v.id("slackUsers"),
    daysBack: v.optional(v.number()),
  },
  handler: async (ctx, { userId, daysBack = 30 }) => {
    const cutoff = Date.now() - (daysBack * 24 * 60 * 60 * 1000);
    
    const pairings = await ctx.db
      .query("pairings")
      .filter((q) => 
        q.and(
          q.or(
            q.eq(q.field("user1Id"), userId),
            q.eq(q.field("user2Id"), userId)
          ),
          q.gte(q.field("scheduledAt"), cutoff)
        )
      )
      .collect();

    return pairings;
  },
});

export const updateLastPaired = mutation({
  args: {
    userId: v.id("slackUsers"),
    timestamp: v.number(),
  },
  handler: async (ctx, { userId, timestamp }) => {
    return await ctx.db.patch(userId, { lastPairedAt: timestamp });
  },
});