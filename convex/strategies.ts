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