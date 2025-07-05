import { internalMutation } from "./_generated/server";

export const clearAllData = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Get all tables
    const tables = ["strategies", "userLogs"];
    
    for (const table of tables) {
      const documents = await ctx.db.query(table as any).collect();
      for (const doc of documents) {
        await ctx.db.delete(doc._id);
      }
      console.log(`Cleared ${documents.length} documents from ${table}`);
    }
  },
});