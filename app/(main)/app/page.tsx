"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAction, useMutation } from "convex/react";
import { useState } from "react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import Head from "next/head";
import { Rocket, Sparkles } from "lucide-react";
import UpgradeModal from "@/components/modals/upgrade";

export default function Page() {
  const [username, setUsername] = useState("");
  const addFriend = useMutation(api.friends.addFriend);

  const handleSubmit = async () => {
    const promise = addFriend({
      friendDiscId: username as Id<"friends">,
    });

    toast.promise(promise, {
      success: "Friend request sent!",
      error(error) {
        return error.data;
      },
      loading: "Sending friend request...",
    });

    setUsername("");
  };
  return (
    <div className="col-span-8">
      <Head>
        <title>Add friend</title>
      </Head>
      <Card className="h-full w-full">
        <CardHeader className="flex flex-row w-full justify-between">
          <div>
            <CardTitle>Add friend</CardTitle>
            <CardDescription>
              Enter your friend&apos;s DiscID here.
            </CardDescription>
          </div>

          <div>
            <UpgradeModal>
              <Button size="lg" className="gap-2">
                <Rocket className="w-6 h-6" />
                Upgrade to Turbo
              </Button>
            </UpgradeModal>
          </div>
        </CardHeader>
        <CardContent className="flex justify-between gap-2">
          <Input
            placeholder="username#0000"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <Button onClick={() => handleSubmit()}>Send friend request</Button>
        </CardContent>
      </Card>
    </div>
  );
}
