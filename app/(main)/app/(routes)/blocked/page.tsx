"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useMutation, useQuery } from "convex/react";
import { CircleX, FilterX, MoreHorizontal, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/clerk-react";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Head from "next/head";

export default function Page() {
  const friends = useQuery(api.friends.getUserFriends);
  const unblock = useMutation(api.friends.unBlockUser)
  const clerkUser = useUser();
  

  const currentUser = useQuery(api.users.getUserByEmail, {
    email: clerkUser.user?.emailAddresses[0].emailAddress as string,
  })

  if(!currentUser) {
    return null;
  }

  if (friends === undefined) {
    return (
      <>
        <Skeleton className="h-12 w-full my-1" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full my-1" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full my-1" />
      </>
    );
  }

  const unblockHandler = (friendId: string, e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const promise = unblock({
        friendId: friendId as Id<"friends">,
    })

    toast.promise(promise, {
        success: "User unblocked!",
        error(error) {
            return error.data
        },
        loading: "Unblocking user..."
    })
  }

  const blocked = friends.filter((f) => f.blocked)

  return (
    <Card className="h-full w-full">
      <Head>
        <title>Account</title>
      </Head>
      <CardHeader>
        <CardTitle>Blocked users</CardTitle>
        <CardDescription>See people you've blocked here.</CardDescription>
      </CardHeader>
      <CardContent>
        {blocked.length > 0 ? (
          blocked.map((friend) => (
            <div
              className="group my-1"
            >
              <div
                className={`group-hover:bg-muted group-hover:text-primary rounded-lg p-3 gap-2 flex flex-row items-center justify-between cursor-pointer
                }`}
              >
                <div className="flex flex-row gap-2 items-center min-w-0">
                  <div className="group-hover:bg-primary group-hover:text-muted text-primary bg-muted rounded-full p-2">
                    <User className="w-5 h-5" />
                  </div>
                  <p className="truncate flex-grow">
                    {friend.friendTo === currentUser._id
                      ? friend.nameFriendOf
                      : friend.nameFriendTo}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="icon"
                      className="w-8 h-8 text-primary"
                      variant={"outline"}
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                    onClick={(e) => unblockHandler(friend._id, e)}
                      className="gap-1"
                    >
                      <CircleX className="w-4 h-4" /> Unblock
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))
        ) : (
          <div>
            <FilterX className="w-16 h-16 mx-auto text-muted-foreground" />
            <p className="text-muted-foreground text-center">No blocked users.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
