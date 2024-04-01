import { v } from "convex/values";
import { internalMutation, query } from "./_generated/server";
import { getUser } from "./friends";

export const markPending = internalMutation({
  args: { stripeId: v.string() },
  handler: async (ctx, { stripeId }) => {
    const identity = await ctx.auth.getUserIdentity();
    const tokenId = identity?.tokenIdentifier;
    const user = await getUser(ctx, tokenId!)
    if(!user) return null;
    await ctx.db.patch(user._id, {
        stripeId
    })
  },
});

export const fulfill = internalMutation({
  args: { stripeId: v.string() },
  handler: async (ctx, { stripeId }) => {
    const identity = await ctx.auth.getUserIdentity();
    const tokenId = identity?.tokenIdentifier;
    const user = await getUser(ctx, tokenId!)
    if(!user) return null;
    await ctx.db.patch(user._id, {
        stripeId
    })
  },
});