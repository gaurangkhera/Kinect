import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server";
import { ConvexError, v } from "convex/values";

export async function getUser(ctx: QueryCtx | MutationCtx, tokenIdentifier: string) {
    const user = await ctx.db.query('users').withIndex('by_token', (q) => q.eq('tokenIdentifier', tokenIdentifier)).first();
    return user;
}

export const addFriend = mutation({
    args: {
        friendDiscId: v.string(),
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


        const friendUser = await ctx.db.query('users').withIndex('by_discId', (q) => q.eq('discId', args.friendDiscId)).first();
        if (!friendUser) {
            throw new ConvexError("User not found.");
        }

        if (currentUser._id === friendUser._id) {
            throw new ConvexError('You can\'t send yourself a friend request.')
        }

        const friendCheck = await ctx.db.query('friends').withIndex('by_friendOf', (q) => q.eq('friendOf', currentUser._id)).first()
            && await ctx.db.query('friends').withIndex('by_friendTo', (q) => q.eq('friendTo', friendUser._id)).first();

        if (friendCheck) {
            throw new ConvexError('You\'re already friends with this user.')
        }

        const friend = await ctx.db.insert('friends', {
            nameFriendOf: currentUser.name,
            nameFriendTo: friendUser.name,
            friendOf: currentUser._id,
            friendTo: friendUser._id
        });

        return { friend }
    },
})

export const removeFriend = mutation({
    args: {
        friendId: v.id('friends'),
    },
    async handler(ctx, args) {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new ConvexError("Not authenticated");
        }
        const userId = identity.subject;
        const friendOne = (await ctx.db.query('friends').collect()).filter((friend) => friend.friendOf === userId && friend.friendTo === args.friendId)[0];
        await ctx.db.delete(friendOne._id);
        await ctx.db.delete(args.friendId);

        return { success: true };
    },
});

export const getUserFriends = query({
    async handler(ctx) {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new ConvexError("Not authenticated");
        }

        const tokenIdentifier = identity.tokenIdentifier;
        const user = await getUser(ctx, tokenIdentifier);

        if (!user) {
            throw new ConvexError("User not found.");
        }

        const friendsOfUser = await ctx.db.query('friends').withIndex('by_friendOf', (q) => q.eq('friendOf', user._id)).collect();
        const userIsFriendTo = await ctx.db.query('friends').withIndex('by_friendTo', (q) => q.eq('friendTo', user._id)).collect();

        const friends = [...friendsOfUser, ...userIsFriendTo];

        return friends;
    },
})

export const getFriendDetails = query({
    args: {
        friendId: v.id('friends'),
    },
    async handler(ctx, args) {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new ConvexError("Not authenticated");
        }

        const friend = await ctx.db.get(args.friendId);

        return friend;
    },
})