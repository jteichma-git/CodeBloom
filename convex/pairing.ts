import { action, internalAction, mutation, query } from "./_generated/server";
import { v, ConvexError } from "convex/values";
import { api, internal } from "./_generated/api";

export const createRandomPairings = action({
  args: {
    excludeRecentDays: v.optional(v.number()),
  },
  handler: async (ctx, { excludeRecentDays = 14 }) => {
    // Get all available users (active, not opted out, not snoozed)
    const users = await ctx.runQuery(api.config.getAvailableUsers);
    
    if (users.length < 2) {
      throw new ConvexError("Need at least 2 active users to create pairings");
    }

    // Get recent pairing history for each user
    const userPairings = new Map();
    for (const user of users) {
      const history = await ctx.runQuery(api.slack.getPairingHistory, {
        userId: user._id,
        daysBack: excludeRecentDays,
      });
      userPairings.set(user._id, new Set(
        history.map(p => p.user1Id === user._id ? p.user2Id : p.user1Id)
      ));
    }

    // Shuffle users for random pairing
    const shuffledUsers = [...users].sort(() => Math.random() - 0.5);
    const pairs: Array<{ user1: typeof users[0], user2: typeof users[0] }> = [];
    const used = new Set<string>();

    // Try to create pairs avoiding recent matches
    for (let i = 0; i < shuffledUsers.length; i++) {
      if (used.has(shuffledUsers[i]._id)) continue;

      const user1 = shuffledUsers[i];
      const recentPartners = userPairings.get(user1._id) || new Set();

      // Find a partner who hasn't been paired recently
      let partner = null;
      for (let j = i + 1; j < shuffledUsers.length; j++) {
        const candidate = shuffledUsers[j];
        if (!used.has(candidate._id) && !recentPartners.has(candidate._id)) {
          partner = candidate;
          break;
        }
      }

      // If no non-recent partner found, just take any available
      if (!partner) {
        for (let j = i + 1; j < shuffledUsers.length; j++) {
          const candidate = shuffledUsers[j];
          if (!used.has(candidate._id)) {
            partner = candidate;
            break;
          }
        }
      }

      if (partner) {
        pairs.push({ user1, user2: partner });
        used.add(user1._id);
        used.add(partner._id);
      }
    }

    // Handle odd person out (could be enhanced to create groups of 3)
    const unpaired = shuffledUsers.filter(u => !used.has(u._id));
    if (unpaired.length > 0) {
      console.log(`${unpaired.length} user(s) couldn't be paired this round:`, unpaired.map(u => u.name));
    }

    // Store pairings in database
    const scheduledAt = Date.now();
    const pairingIds = [];

    for (const { user1, user2 } of pairs) {
      const pairingId = await ctx.runMutation(internal.pairing.createPairingMutation, {
        user1Id: user1._id,
        user2Id: user2._id,
        scheduledAt,
        status: "scheduled" as const,
      });
      pairingIds.push(pairingId);
    }

    return {
      pairingIds,
      pairCount: pairs.length,
      unpairedCount: unpaired.length,
    };
  },
});

export const createPairingMutation = mutation({
  args: {
    user1Id: v.id("slackUsers"),
    user2Id: v.id("slackUsers"),
    scheduledAt: v.number(),
    status: v.union(v.literal("scheduled"), v.literal("sent"), v.literal("completed")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("pairings", args);
  },
});

export const sendPairingMessages = action({
  args: {
    pairingIds: v.optional(v.array(v.id("pairings"))),
  },
  handler: async (ctx, { pairingIds }) => {
    // If no specific pairings provided, get all scheduled ones
    let pairings;
    if (pairingIds) {
      pairings = await Promise.all(
        pairingIds.map(id => ctx.runQuery(internal.pairing.getPairing, { id }))
      );
    } else {
      pairings = await ctx.runQuery(internal.pairing.getScheduledPairings);
    }

    const results = [];

    for (const pairing of pairings) {
      if (!pairing || pairing.status !== "scheduled") continue;

      try {
        // Get user details
        const user1 = await ctx.runQuery(internal.pairing.getSlackUser, { id: pairing.user1Id });
        const user2 = await ctx.runQuery(internal.pairing.getSlackUser, { id: pairing.user2Id });

        if (!user1 || !user2) {
          console.error("Missing user data for pairing:", pairing._id);
          continue;
        }

        // Create personalized messages with opt-out options
        const message1 = createPairingMessage(user1.name, user2.name);
        const message2 = createPairingMessage(user2.name, user1.name);
        const blocks1 = createPairingBlocks(user1.name, user2.name);
        const blocks2 = createPairingBlocks(user2.name, user1.name);

        // Send messages
        const result1 = await ctx.runAction(internal.slack.sendDirectMessage, {
          userId: user1.slackId,
          message: message1,
          blocks: blocks1,
        });

        const result2 = await ctx.runAction(internal.slack.sendDirectMessage, {
          userId: user2.slackId,
          message: message2,
          blocks: blocks2,
        });

        // Update pairing status
        await ctx.runMutation(internal.pairing.updatePairingStatus, {
          id: pairing._id,
          status: "sent",
          messageTs: result1.messageTs,
        });

        // Update user lastPairedAt
        await ctx.runMutation(internal.slack.updateLastPaired, {
          userId: user1._id,
          timestamp: Date.now(),
        });
        await ctx.runMutation(internal.slack.updateLastPaired, {
          userId: user2._id,
          timestamp: Date.now(),
        });

        results.push({
          pairingId: pairing._id,
          success: true,
          users: [user1.name, user2.name],
        });

      } catch (error) {
        console.error(`Failed to send pairing messages for ${pairing._id}:`, error);
        results.push({
          pairingId: pairing._id,
          success: false,
          error: error.message,
        });
      }
    }

    return results;
  },
});

function createPairingMessage(userName: string, partnerName: string): string {
  const messages = [
    `Hi ${userName}! 👋 You've been paired with ${partnerName} for a coffee chat this week. Reach out to them to schedule a 15-30 minute conversation. Get to know each other and share what you're working on!`,
    
    `Hey ${userName}! ☕ Time for a coffee chat! You've been matched with ${partnerName}. Why not grab a coffee (virtual or in-person) and have a quick chat about life, work, or anything interesting?`,
    
    `Hello ${userName}! 🤝 You and ${partnerName} have been paired up for a friendly chat this week. Take 20-30 minutes to connect and learn something new about each other!`,
  ];
  
  return messages[Math.floor(Math.random() * messages.length)];
}

function createPairingBlocks(userName: string, partnerName: string): string {
  const blocks = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `Hi ${userName}! 👋 You've been paired with *${partnerName}* for a coffee chat this week.`
      }
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "Reach out to them to schedule a 15-30 minute conversation. Get to know each other and share what you're working on!"
      }
    },
    {
      type: "divider"
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "_Not available this week? You can manage your coffee chat preferences:_"
      }
    },
    {
      type: "actions",
      elements: [
        {
          type: "button",
          text: { type: "plain_text", text: "Snooze 1 Week" },
          action_id: "snooze_1week",
          style: "primary"
        },
        {
          type: "button",
          text: { type: "plain_text", text: "Snooze 1 Month" },
          action_id: "snooze_1month"
        },
        {
          type: "button",
          text: { type: "plain_text", text: "Opt Out" },
          action_id: "opt_out",
          style: "danger"
        }
      ]
    }
  ];

  return JSON.stringify(blocks);
}

export const getPairing = query({
  args: { id: v.id("pairings") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

export const getSlackUser = query({
  args: { id: v.id("slackUsers") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

export const getScheduledPairings = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("pairings")
      .filter((q) => q.eq(q.field("status"), "scheduled"))
      .collect();
  },
});

export const updatePairingStatus = mutation({
  args: {
    id: v.id("pairings"),
    status: v.union(v.literal("scheduled"), v.literal("sent"), v.literal("completed")),
    messageTs: v.optional(v.string()),
  },
  handler: async (ctx, { id, status, messageTs }) => {
    const updates: any = { status };
    if (messageTs) {
      updates.messageTs = messageTs;
    }
    return await ctx.db.patch(id, updates);
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

export const runScheduledPairing = internalAction({
  args: {
    interval: v.string(),
  },
  handler: async (ctx, { interval }) => {
    console.log(`Starting ${interval} coffee chat pairings...`);
    
    try {
      // Check if this interval is currently configured
      const configuredInterval = await ctx.runQuery(api.config.getBotConfig, {
        key: "pairingInterval",
        defaultValue: "weekly",
      });

      if (configuredInterval !== interval) {
        console.log(`Skipping ${interval} pairing - configured for ${configuredInterval}`);
        return { skipped: true, reason: `Configured for ${configuredInterval}` };
      }

      // Handle bi-weekly logic - only run every other week
      if (interval === "biweekly") {
        const lastBiweeklyRun = await ctx.runQuery(api.config.getBotConfig, {
          key: "lastBiweeklyRun",
          defaultValue: 0,
        });
        
        const twoWeeksAgo = Date.now() - (14 * 24 * 60 * 60 * 1000);
        if (lastBiweeklyRun > twoWeeksAgo) {
          console.log("Skipping bi-weekly pairing - too recent");
          return { skipped: true, reason: "Too recent for bi-weekly" };
        }

        // Update last run time
        await ctx.runMutation(api.config.setBotConfig, {
          key: "lastBiweeklyRun",
          value: Date.now(),
          description: "Last time bi-weekly pairing ran",
        });
      }

      // Get configured exclude days
      const excludeRecentDays = await ctx.runQuery(api.config.getBotConfig, {
        key: "excludeRecentDays",
        defaultValue: 14,
      }) as number;

      // Create random pairings
      const pairingResult = await ctx.runAction(internal.pairing.createRandomPairings, {
        excludeRecentDays,
      });
      
      console.log(`Created ${pairingResult.pairCount} pairings, ${pairingResult.unpairedCount} unpaired`);
      
      // Send pairing messages
      const messageResults = await ctx.runAction(internal.pairing.sendPairingMessages, {
        pairingIds: pairingResult.pairingIds,
      });
      
      const successCount = messageResults.filter(r => r.success).length;
      const failureCount = messageResults.filter(r => !r.success).length;
      
      console.log(`Sent ${successCount} pairing messages, ${failureCount} failures`);
      
      return {
        interval,
        pairingCount: pairingResult.pairCount,
        unpairedCount: pairingResult.unpairedCount,
        messagesSuccess: successCount,
        messagesFailure: failureCount,
      };
    } catch (error) {
      console.error(`${interval} pairing failed:`, error);
      throw error;
    }
  },
});