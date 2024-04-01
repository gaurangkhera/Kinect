import { ConvexError, v } from "convex/values";
import { MutationCtx, QueryCtx, internalMutation, mutation, query } from "./_generated/server";

export const createUser = internalMutation({
  args: { name: v.string(), email: v.string(), tokenIdentifier: v.string() },
  async handler(ctx, args) {
    await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
      discId: `${args.name?.replace(/\s/g, "").toLowerCase()}#${Math.floor(1000 + Math.random() * 9000)}`,
      tokenIdentifier: args.tokenIdentifier,
      stripeId: '',
    })
  },
})

export const getUser = query({
  args: { tokenIdentifier: v.string() },
  async handler(ctx, args) {
    return await ctx.db.query("users").withIndex("by_token", (q) => q.eq("tokenIdentifier", args.tokenIdentifier)).first()
  },
})

export const getUserById = query({
  args: {
    userId: v.id('users')
  },
  async handler(ctx, args) {
    return await ctx.db.get(args.userId)
  },
})

export const getUserByEmail = query({
  args: { 
    email: v.string(),
  },
  async handler(ctx, args) {
    return await ctx.db.query("users").withIndex("by_email", (q) => q.eq("email", args.email)).first()
  },
})

export const updateUser = mutation({
  args: {
    email: v.string(),
    newDiscId: v.string(),
  },
  async handler(ctx, args) {
    const user = await getUserByEmail(ctx, { email: args.email })

    if (!user) {
      throw new ConvexError("User not found")
    }

    await ctx.db.patch(user._id, {
      discId: args.newDiscId,
    })

    return user;
  },
})