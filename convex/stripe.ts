"use node";

import { v } from "convex/values";
import { action, internalAction } from "./_generated/server";
import Stripe from "stripe";
import { internal } from "./_generated/api";

export const pay = action({
  handler: async ({ runMutation }) => {
    const domain = process.env.HOSTING_URL ?? "http://localhost:3000";
    const stripe = new Stripe('sk_test_51P0Q4TSHWHdBZGNzZzYjfFmeasQFqC1IOX2D67Sv6uIQyDiqBPBxG1VAxfoUc6t4A7MiuOalQSj5UJ1CPulUMst700FsjISFC3', {
      apiVersion: "2023-10-16",
    });
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: "price_1P0QLgSHWHdBZGNzh6j2ISpL",
          quantity: 1,
        },
      ],
      mode: "subscription",
      billing_address_collection: "required",
      success_url: `${domain}`,
      cancel_url: `${domain}`,
    });

    await runMutation(internal.payments.markPending, {
      stripeId: session.id,
    });
    console.log(session.url)
    return session.url;
  },
});

export const fulfill = internalAction({
  args: { signature: v.string(), payload: v.string() },
  handler: async ({ runMutation }, { signature, payload }) => {
    const stripe = new Stripe(process.env.STRIPE_KEY!, {
      apiVersion: "2023-10-16",
    });

    const webhookSecret = process.env.STRIPE_WEBHOOKS_SECRET as string;
    try {
      const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret
      );
      if (event.type === "checkout.session.completed") {
        const stripeId = (event.data.object as { id: string }).id;
        await runMutation(internal.payments.fulfill, { stripeId });
      }
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, error: (err as { message: string }).message };
    }
  },
});