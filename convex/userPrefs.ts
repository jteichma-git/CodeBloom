"use node";

import { action, internalAction } from "./_generated/server";
import { v } from "convex/values";
import { api, internal } from "./_generated/api";

export const handleSlackInteraction = action({
  args: {
    payload: v.string(),
  },
  handler: async (ctx, { payload }) => {
    const interaction = JSON.parse(payload);
    
    if (interaction.type === "block_actions") {
      const action = interaction.actions[0];
      const userId = interaction.user.id;
      
      if (action.action_id === "opt_out") {
        await ctx.runMutation(api.config.updateUserPreferences, {
          slackId: userId,
          isOptedOut: true,
        });
        
        return {
          response_type: "ephemeral",
          text: "✅ You've been opted out of coffee chat pairings. Use `/coffee opt-in` to rejoin anytime."
        };
      }
      
      if (action.action_id === "snooze_1week") {
        const snoozeUntil = Date.now() + (7 * 24 * 60 * 60 * 1000);
        await ctx.runMutation(api.config.updateUserPreferences, {
          slackId: userId,
          snoozeUntil,
          snoozeReason: "Snoozed for 1 week",
        });
        
        return {
          response_type: "ephemeral",
          text: "😴 You've been snoozed from coffee chats for 1 week. You'll automatically rejoin next week."
        };
      }
      
      if (action.action_id === "snooze_1month") {
        const snoozeUntil = Date.now() + (30 * 24 * 60 * 60 * 1000);
        await ctx.runMutation(api.config.updateUserPreferences, {
          slackId: userId,
          snoozeUntil,
          snoozeReason: "Snoozed for 1 month",
        });
        
        return {
          response_type: "ephemeral",
          text: "😴 You've been snoozed from coffee chats for 1 month. You'll automatically rejoin next month."
        };
      }
    }
    
    return { response_type: "ephemeral", text: "Unknown action" };
  },
});

export const handleSlashCommand = action({
  args: {
    command: v.string(),
    text: v.string(),
    userId: v.string(),
    userName: v.string(),
  },
  handler: async (ctx, { command, text, userId, userName }) => {
    const args = text.trim().toLowerCase();
    
    if (command === "/coffee") {
      if (args === "opt-out") {
        await ctx.runMutation(api.config.updateUserPreferences, {
          slackId: userId,
          isOptedOut: true,
        });
        
        return {
          response_type: "ephemeral",
          text: "✅ You've been opted out of coffee chat pairings. Use `/coffee opt-in` to rejoin anytime."
        };
      }
      
      if (args === "opt-in") {
        await ctx.runMutation(api.config.updateUserPreferences, {
          slackId: userId,
          isOptedOut: false,
          snoozeUntil: undefined,
          snoozeReason: undefined,
        });
        
        return {
          response_type: "ephemeral",
          text: "✅ Welcome back! You're now opted in for coffee chat pairings."
        };
      }
      
      if (args === "snooze") {
        return {
          response_type: "ephemeral",
          blocks: [
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: "How long would you like to snooze coffee chat pairings?"
              }
            },
            {
              type: "actions",
              elements: [
                {
                  type: "button",
                  text: { type: "plain_text", text: "1 Week" },
                  action_id: "snooze_1week",
                  style: "primary"
                },
                {
                  type: "button",
                  text: { type: "plain_text", text: "1 Month" },
                  action_id: "snooze_1month"
                },
                {
                  type: "button",
                  text: { type: "plain_text", text: "Opt Out Completely" },
                  action_id: "opt_out",
                  style: "danger"
                }
              ]
            }
          ]
        };
      }
      
      if (args === "status") {
        const user = await ctx.runQuery(api.config.getUserPreferences, { slackId: userId });
        
        if (!user) {
          return {
            response_type: "ephemeral",
            text: "❌ You're not registered in the coffee chat system. Contact an admin."
          };
        }
        
        let status = "✅ Active - You'll be included in coffee chat pairings";
        
        if (user.isOptedOut) {
          status = "❌ Opted out - Use `/coffee opt-in` to rejoin";
        } else if (user.snoozeUntil && user.snoozeUntil > Date.now()) {
          const snoozeEnd = new Date(user.snoozeUntil).toLocaleDateString();
          status = `😴 Snoozed until ${snoozeEnd} - ${user.snoozeReason}`;
        }
        
        return {
          response_type: "ephemeral",
          text: `*Coffee Chat Status:* ${status}`
        };
      }
      
      // Default help message
      return {
        response_type: "ephemeral",
        text: `*Coffee Chat Commands:*
• \`/coffee status\` - Check your current status
• \`/coffee opt-out\` - Opt out of all pairings
• \`/coffee opt-in\` - Opt back in to pairings
• \`/coffee snooze\` - Temporarily pause pairings`
      };
    }
    
    return {
      response_type: "ephemeral",
      text: "Unknown command"
    };
  },
});

export const sendOptOutMessage = internalAction({
  args: {
    userId: v.string(),
    pairingId: v.id("pairings"),
  },
  handler: async (ctx, { userId, pairingId }) => {
    const blocks = [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "Not feeling up for a coffee chat right now? No worries! You can:"
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
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: "You can also use `/coffee` commands to manage your preferences anytime."
          }
        ]
      }
    ];

    return await ctx.runAction(internal.slackActions.sendDirectMessage, {
      userId,
      blocks: JSON.stringify(blocks),
    });
  },
});