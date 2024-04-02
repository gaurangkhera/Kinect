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
    newDiscId: v.string(),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Not authenticated");
    }

    const tokenIdentifier = identity.tokenIdentifier;

    const user = await getUser(ctx, {
      tokenIdentifier: tokenIdentifier
    });

    if (!user) {
      throw new ConvexError("User not found")
    }

    const friendTos = await ctx.db.query('friends').withIndex('by_friendTo', (q) => q.eq('friendTo', user._id)).collect();

    const friendOfs = await ctx.db.query('friends').withIndex('by_friendOf', (q) => q.eq('friendOf', user._id)).collect();

    await ctx.db.patch(user._id, {
      discId: args.newDiscId,
    })

    if (friendTos.length > 0) {
      for (const friendTo of friendTos) {
        await ctx.db.patch(friendTo._id, {
          nameFriendTo: args.newDiscId,
        })
      }
    }

    if(friendOfs.length > 0) {
      for (const friendOf of friendOfs) {
        await ctx.db.patch(friendOf._id, {
          nameFriendOf: args.newDiscId,
        })
      }
    }

    return user;
  },
})