import { internalMutation } from "./_generated/server";

export const clearOldStrategies = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Get all strategies
    const strategies = await ctx.db.query("strategies").collect();
    
    // Delete all strategies
    for (const strategy of strategies) {
      await ctx.db.delete(strategy._id);
    }
    
    console.log(`Cleared ${strategies.length} old strategies`);
    
    // Also clear user logs to avoid orphaned references
    const userLogs = await ctx.db.query("userLogs").collect();
    for (const log of userLogs) {
      await ctx.db.delete(log._id);
    }
    
    console.log(`Cleared ${userLogs.length} user logs`);
  },
});