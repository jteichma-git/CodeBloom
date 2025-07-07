/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as clearDatabase from "../clearDatabase.js";
import type * as crons from "../crons.js";
import type * as migration from "../migration.js";
import type * as pairing from "../pairing.js";
import type * as seedStrategies from "../seedStrategies.js";
import type * as slack from "../slack.js";
import type * as strategies from "../strategies.js";
import type * as userLogs from "../userLogs.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  clearDatabase: typeof clearDatabase;
  crons: typeof crons;
  migration: typeof migration;
  pairing: typeof pairing;
  seedStrategies: typeof seedStrategies;
  slack: typeof slack;
  strategies: typeof strategies;
  userLogs: typeof userLogs;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
