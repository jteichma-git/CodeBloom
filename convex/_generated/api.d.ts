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
import type * as migration from "../migration.js";
import type * as seedStrategies from "../seedStrategies.js";
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
  migration: typeof migration;
  seedStrategies: typeof seedStrategies;
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
