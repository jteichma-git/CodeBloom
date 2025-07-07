import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Weekly pairings - every Monday at 9 AM UTC
crons.weekly(
  "weekly coffee pairings",
  { dayOfWeek: "monday", hourUTC: 9, minuteUTC: 0 },
  internal.pairing.runScheduledPairing,
  { interval: "weekly" }
);

// Bi-weekly pairings - every other Monday at 9 AM UTC
crons.weekly(
  "biweekly coffee pairings",
  { dayOfWeek: "monday", hourUTC: 9, minuteUTC: 0 },
  internal.pairing.runScheduledPairing,
  { interval: "biweekly" }
);

// Monthly pairings - first Monday of each month at 9 AM UTC
crons.monthly(
  "monthly coffee pairings",
  { day: 1, hourUTC: 9, minuteUTC: 0 },
  internal.pairing.runScheduledPairing,
  { interval: "monthly" }
);

export default crons;