import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Run every Monday at 9 AM UTC
crons.weekly(
  "monday coffee pairings",
  { dayOfWeek: "monday", hourUTC: 9, minuteUTC: 0 },
  internal.pairing.runWeeklyPairing
);

export default crons;