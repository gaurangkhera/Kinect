import { Id } from "./_generated/dataModel";
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
            throw new ConvexError("Authentication required.");
        }

        const currentUser = await getUser(ctx, identity.tokenIdentifier);
        if (!currentUser) {
            throw new ConvexError("Please log in.");
        }

        const friendUser = await ctx.db.query('users').withIndex('by_discId', (q) => q.eq('discId', args.friendDiscId)).first();
        if (!friendUser) {
            throw new ConvexError("User not found.");
        }

        if (currentUser._id === friendUser._id) {
            throw new ConvexError('You can\'t friend yourself.')
        }

        // Check if the current user has blocked the friend user
        const currentUserHasBlocked = (await ctx.db.query('blocks').withIndex('by_blocker', (q) => q.eq('blocker', currentUser._id)).collect()).some((block) => block.blocked === friendUser._id);

        // Check if the friend user has blocked the current user
        const friendUserHasBlocked = (await ctx.db.query('blocks').withIndex('by_blocker', (q) => q.eq('blocker', friendUser._id)).collect()).some((block) => block.blocked === currentUser._id);

        // Check if both users have blocked each other
        if (currentUserHasBlocked && friendUserHasBlocked) {
            throw new ConvexError("Both users have blocked each other.");
        } else if (currentUserHasBlocked) {
            throw new ConvexError("You've blocked this user.");
        } else if (friendUserHasBlocked) {
            throw new ConvexError("You've been blocked by this user.");
        }
        const friendCheck = await ctx.db.query('friends').withIndex('by_friendOf', (q) => q.eq('friendOf', currentUser._id)).first()
            && await ctx.db.query('friends').withIndex('by_friendTo', (q) => q.eq('friendTo', friendUser._id)).first();

        const inactiveCheck = (await ctx.db.query('friends').withIndex('by_friendOf', (q) => q.eq('friendOf', currentUser._id)).collect()).filter((friend) => friend.friendTo === friendUser._id && !friend.active);

        if (friendCheck) {
            throw new ConvexError('You\'re already friends with this user.')
        }

        if(inactiveCheck.length > 0) {
            await ctx.db.patch(inactiveCheck[0]._id, {
                active: true
            })

            return inactiveCheck[0]
        }

        const friend = await ctx.db.insert('friends', {
            nameFriendOf: currentUser.discId.split('#')[0],
            nameFriendTo: friendUser.discId.split('#')[0],
            friendOf: currentUser._id,
            friendTo: friendUser._id,
            active: true,
            blocked: false,
        })

        return { friend }
    },
})

export const removeFriend = mutation({
    args: {
        friendId: v.id('friends')
    },
    async handler(ctx, args) {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new ConvexError("Authentication required.");
        }
        const tokenIdentifier = identity.tokenIdentifier;
        const user = await getUser(ctx, tokenIdentifier);

        const friend = await ctx.db.get(args.friendId);

        if(!friend || !user ) {
            throw new ConvexError('Friend or user not found.')
        }

        const canDelete = friend.friendOf === user._id || friend.friendTo === user._id;

        if(!canDelete) {
            throw new ConvexError("Unauthorized action.")
        }

        await ctx.db.patch(args.friendId, {
            active: false,
        });

        return friend;
    },
})

export const unBlockUser = mutation({
    args: {
        friendId: v.id('friends'),
    },
    async handler(ctx, args) {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new ConvexError("Authentication required.");
        }
        const tokenIdentifier = identity.tokenIdentifier;

        const currentUser = await getUser(ctx, tokenIdentifier);

        const friend = await ctx.db.get(args.friendId);

        if(!friend || !currentUser) {
            throw new ConvexError('Friend or user not found.')
        }

        const canUnblock = friend.friendOf === currentUser._id || friend.friendTo === currentUser._id;

        if(!canUnblock) {
            throw new ConvexError("Unauthorized action.")
        }

        await ctx.db.patch(args.friendId, {
            blocked: false,
        });

        const block = (await ctx.db.query('blocks').withIndex('by_blocker', (q) => q.eq('blocker', currentUser._id)).collect()).find((block) => block.blocked === friend.friendOf || block.blocked === friend.friendTo);


        if(!block) {
            throw new ConvexError('You haven\'t blocked this user.')
        }

        await ctx.db.delete(block._id);
    },
})

export const getUserFriends = query({
    async handler(ctx) {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new ConvexError("Authentication required.");
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

export const blockUser = mutation({
    args: {
        friendId: v.id('friends')
    },
    async handler(ctx, args) {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new ConvexError("Authentication required.");
        }

        const currentUser = await getUser(ctx, identity.tokenIdentifier);
        if (!currentUser) {
            throw new ConvexError("User not found.");
        }

        const friend = await ctx.db.get(args.friendId);
        if (!friend) {
            throw new ConvexError("Friend not found.");
        }

        // Get the ID of the other user
        const otherUserId = friend.friendOf === currentUser._id ? friend.friendTo : friend.friendOf;

        await ctx.db.patch(args.friendId, {
            blocked: true
        });

        const block = await ctx.db.insert('blocks', {
            blocked: otherUserId as Id<"users">,
            blocker: currentUser._id,
        });

        return { block }
    },
})

export const getFriendDetails = query({
    args: {
        friendId: v.id('friends'),
    },
    async handler(ctx, args) {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new ConvexError("Authentication required.");
        }

        const friend = await ctx.db.get(args.friendId);

        return friend;
    },
})