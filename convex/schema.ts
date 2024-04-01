// NOTE: You can remove this file. Declaring the shape
// of the database is entirely optional in Convex.
// See https://docs.convex.dev/database/schemas.

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema(
  {
    users: defineTable({
      name: v.string(),
      email: v.string(),
      tokenIdentifier: v.string(),
      discId: v.string(),
      stripeId: v.optional(v.string()),
    }).index("by_token", ["tokenIdentifier"])
      .index('by_discId', ["discId"])
      .index("by_email", ["email"]),
    friends: defineTable({
      nameFriendOf: v.string(),
      nameFriendTo: v.string(),
      friendOf: v.string(),
      friendTo: v.string(),
      active: v.boolean(),
      blocked: v.boolean(),
    }).index('by_friendOf', ['friendOf'])
      .index('by_friendTo', ['friendTo']),
    messages: defineTable({
      content: v.string(),
      file: v.boolean(),
      friendId: v.id('friends'),
      senderId: v.id('users'),
    }).index('by_friendId', ['friendId']),
    blocks: defineTable({
      blocked: v.id('users'),
      nameBlocked: v.string(),
      blocker: v.id('users'),
      nameBlocker: v.string(),
    }).index('by_blocked', ['blocked'])
      .index('by_blocker', ['blocker']),
  },
  // If you ever get an error about schema mismatch
  // between your data and your schema, and you cannot
  // change the schema to match the current data in your database,
  // you can:
  //  1. Use the dashboard to delete tables or individual documents
  //     that are causing the error.
  //  2. Change this option to `false` and make changes to the data
  //     freely, ignoring the schema. Don't forget to change back to `true`!
  { schemaValidation: true }
);
