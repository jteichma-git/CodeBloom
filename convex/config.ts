import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const setBotConfig = mutation({
  args: {
    key: v.string(),
    value: v.union(v.string(), v.number(), v.boolean()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("botConfig")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .unique();

    if (existing) {
      return await ctx.db.patch(existing._id, {
        value: args.value,
        description: args.description,
      });
    } else {
      return await ctx.db.insert("botConfig", args);
    }
  },
});

export const getBotConfig = query({
  args: {
    key: v.string(),
    defaultValue: v.optional(v.union(v.string(), v.number(), v.boolean())),
  },
  handler: async (ctx, { key, defaultValue }) => {
    const config = await ctx.db
      .query("botConfig")
      .withIndex("by_key", (q) => q.eq("key", key))
      .unique();

    return config?.value ?? defaultValue;
  },
});

export const getAllBotConfig = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("botConfig").collect();
  },
});

export const updateUserPreferences = mutation({
  args: {
    slackId: v.string(),
    isOptedOut: v.optional(v.boolean()),
    snoozeUntil: v.optional(v.number()),
    snoozeReason: v.optional(v.string()),
  },
  handler: async (ctx, { slackId, ...updates }) => {
    const user = await ctx.db
      .query("slackUsers")
      .withIndex("by_slackId", (q) => q.eq("slackId", slackId))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    return await ctx.db.patch(user._id, updates);
  },
});

export const getUserPreferences = query({
  args: {
    slackId: v.string(),
  },
  handler: async (ctx, { slackId }) => {
    return await ctx.db
      .query("slackUsers")
      .withIndex("by_slackId", (q) => q.eq("slackId", slackId))
      .unique();
  },
});

export const getAvailableUsers = query({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    
    return await ctx.db
      .query("slackUsers")
      .filter((q) => 
        q.and(
          q.eq(q.field("isActive"), true),
          q.or(
            q.eq(q.field("isOptedOut"), undefined),
            q.neq(q.field("isOptedOut"), true)
          ),
          q.or(
            q.eq(q.field("snoozeUntil"), undefined),
            q.lt(q.field("snoozeUntil"), now)
          )
        )
      )
      .collect();
  },
});