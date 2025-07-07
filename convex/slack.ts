"use node";

import { action, internalAction, internalMutation, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { api, internal } from "./_generated/api";

export const syncSlackUsers = action({
  args: {
    channelId: v.optional(v.string()),
  },
  handler: async (ctx, { channelId }) => {
    const token = process.env.SLACK_BOT_TOKEN;
    if (!token) {
      throw new Error("SLACK_BOT_TOKEN not configured");
    }

    try {
      let url = "https://slack.com/api/users.list";
      if (channelId) {
        url = `https://slack.com/api/conversations.members?channel=${channelId}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      
      if (!data.ok) {
        throw new Error(`Slack API error: ${data.error}`);
      }

      const members = channelId ? data.members : data.members;
      
      if (channelId) {
        // Get user details for channel members
        const userDetails = await Promise.all(
          members.map(async (userId: string) => {
            const userResponse = await fetch(`https://slack.com/api/users.info?user=${userId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            });
            const userData = await userResponse.json();
            return userData.ok ? userData.user : null;
          })
        );
        
        // Store users in database
        for (const user of userDetails.filter(Boolean)) {
          if (!user.is_bot && !user.deleted) {
            await ctx.runMutation(internal.slack.upsertSlackUser, {
              slackId: user.id,
              name: user.real_name || user.name,
              email: user.profile?.email,
              isActive: true,
            });
          }
        }
      } else {
        // Store all workspace users
        for (const user of data.members) {
          if (!user.is_bot && !user.deleted) {
            await ctx.runMutation(internal.slack.upsertSlackUser, {
              slackId: user.id,
              name: user.real_name || user.name,
              email: user.profile?.email,
              isActive: true,
            });
          }
        }
      }

      return { success: true, count: members.length };
    } catch (error) {
      console.error("Error syncing Slack users:", error);
      throw error;
    }
  },
});

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


export const sendDirectMessage = internalAction({
  args: {
    userId: v.string(),
    message: v.optional(v.string()),
    blocks: v.optional(v.string()),
  },
  handler: async (ctx, { userId, message, blocks }) => {
    const token = process.env.SLACK_BOT_TOKEN;
    if (!token) {
      throw new Error("SLACK_BOT_TOKEN not configured");
    }

    try {
      // Open DM channel
      const dmResponse = await fetch("https://slack.com/api/conversations.open", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          users: userId,
        }),
      });

      const dmData = await dmResponse.json();
      if (!dmData.ok) {
        throw new Error(`Failed to open DM: ${dmData.error}`);
      }

      // Send message
      const messageBody: any = {
        channel: dmData.channel.id,
      };

      if (message) {
        messageBody.text = message;
      }

      if (blocks) {
        messageBody.blocks = JSON.parse(blocks);
      }

      const messageResponse = await fetch("https://slack.com/api/chat.postMessage", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageBody),
      });

      const messageData = await messageResponse.json();
      if (!messageData.ok) {
        throw new Error(`Failed to send message: ${messageData.error}`);
      }

      return { success: true, messageTs: messageData.ts };
    } catch (error) {
      console.error("Error sending DM:", error);
      throw error;
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