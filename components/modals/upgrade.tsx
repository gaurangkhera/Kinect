"use client";

import { api } from "@/convex/_generated/api";
import { useAction } from "convex/react";
import React from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Loader2, Rocket } from "lucide-react";

export default function UpgradeModal({ children }: { children: React.ReactNode}) {
  const subscribe = useAction(api.stripe.pay)
  const [submitting, setSubmitting] = React.useState(false);

  async function handleUpgrade(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    setSubmitting(true);
    // Call to our action
    const paymentUrl = await subscribe();
    console.log(paymentUrl)
    // Redirect to Stripe's checkout website
    setSubmitting(false);
    window.location.href = paymentUrl!;
  }
    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upgrade to premium</DialogTitle>
                    <DialogDescription>
                        Get access to all premium features
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    {!submitting ? (
                        <Button size="lg" className="gap-2" onClick={handleUpgrade}><Rocket className="w-6 h-6" /> Upgrade to Turbo</Button>
                    ) : (
                        <Button disabled size="icon"><Loader2 className="w-6 h-6 animate-spin" /></Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}