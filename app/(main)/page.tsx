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
import { useMutation, useQuery } from 'convex/react'
import { useState } from "react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import { useUser } from "@clerk/clerk-react";
import { getUser } from "@/convex/friends";
import { ConvexError } from "convex/values";

export default function Page() {
    const [username, setUsername] = useState("");
    const addFriend = useMutation(api.friends.addFriend)
    const handleSubmit = async () => {
        const promise = addFriend({
          friendDiscId: username as Id<"friends">,
        })

        toast.promise(promise, {
          success: "Friend request sent!",
          error(error) {
            if (error instanceof ConvexError) {
              return error.data;
            }
            return "Failed to send friend request.";
          },
          loading: "Sending friend request..."
        })

        setUsername("");  
    }
  return (
      <div className="col-span-8">
        <Card className="w-1/2">
          <CardHeader>
            <CardTitle>Add friend</CardTitle>
            <CardDescription>
              Enter your friend's DiscID here.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-between gap-2">
            <Input placeholder="username#0000" value={username} onChange={(e) => setUsername(e.target.value)} required />
            <Button onClick={handleSubmit}>Send friend request</Button>
          </CardContent>
        </Card>
      </div>
  );
}
