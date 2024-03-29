import { mutation, query } from "./_generated/server";
import { ConvexError } from "convex/values";
import { v } from "convex/values";
import { getUser } from "./friends";

export const addMessage = mutation({
    args: {
        message: v.string(),
        friendId: v.id('friends'),
        file: v.boolean(),
    },
    async handler(ctx, args) {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new ConvexError("Not authenticated");
        }

        const currentUser = await getUser(ctx, identity.tokenIdentifier);
        if (!currentUser) {
            throw new ConvexError("User not found.");
        }

        const friendOf = await ctx.db.query('friends').withIndex('by_friendOf', (q) => q.eq('friendOf', currentUser._id)).first();
        const friendTo = await ctx.db.query('friends').withIndex('by_friendTo', (q) => q.eq('friendTo', currentUser._id)).first();

        if (!friendOf && !friendTo) {
            throw new ConvexError('Friend not found')
        }

            const message = await ctx.db.insert('messages', {
                content: args.message,
                friendId: args.friendId,
                senderId: currentUser._id,
                file: args.file,
            });

        return { message }
    },
});

export const getMessages = query({
    args: {
        friendId: v.id('friends'),
    },
    async handler(ctx, args) {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new ConvexError("Not authenticated");
        }
        const currentUser = await getUser(ctx, identity.tokenIdentifier);

        if (!currentUser) {
            throw new ConvexError('Not found');
        }

        const friendOf = await ctx.db.query('friends').withIndex('by_friendOf', (q) => q.eq('friendOf', currentUser._id)).first();
        const friendTo = await ctx.db.query('friends').withIndex('by_friendTo', (q) => q.eq('friendTo', currentUser._id)).first();

        if (!friendOf && !friendTo) {
            throw new ConvexError('Friend not found')
        }


        const messages = await ctx.db.query('messages').withIndex('by_friendId', (q) => q.eq('friendId', args.friendId)).collect();

        return messages;
    },
})