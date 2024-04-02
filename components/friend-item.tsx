"use client";

import { Ban, MoreHorizontal, Trash2, User } from "lucide-react";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useUser } from "@clerk/clerk-react";
import { Badge } from "./ui/badge";

export const FriendItem = ({ friend }: { friend: any }) => {
  const getFriendMessages = useQuery(api.messages.getMessages, {
    friendId: friend._id,
  })
  const clerkUser = useUser();
  const currentUser = useQuery(api.users.getUserByEmail, {
    email: clerkUser.user?.emailAddresses[0].emailAddress as string,
  });
  if (!currentUser) {
    return null;
  }
  const removeFriend = useMutation(api.friends.removeFriend);
  const blockFriend = useMutation(api.friends.blockUser);
  const blockFriendHandler = (
    friendId: string,
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    event.stopPropagation();
    const promise = blockFriend({ friendId: friendId as Id<"friends"> });

    toast.promise(promise, {
      success: "User blocked!",
      loading: "Blocking user...",
      error(error) {
        return error.data;
      },
    });
  };

  const removeFriendHandler = (
    friendId: string,
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    event.stopPropagation();
    const promise = removeFriend({ friendId: friendId as Id<"friends"> });
    toast.promise(promise, {
      success: "Friend removed!",
      loading: "Removing friend...",
      error(error) {
        return error.data;
      },
    });

    redirect("/app");
  };
  const pathname = usePathname();
  return (
    <Link
      key={friend._id}
      href={`/app/chat/${friend._id}`}
      className="group my-1"
    >
      <div
        className={`group-hover:bg-muted group-hover:text-primary rounded-lg p-3 gap-2 flex flex-row items-center justify-between cursor-pointer transition-all ${
          pathname === `/app/chat/${friend._id}`
            ? "bg-primary text-background"
            : "bg-background text-primary text-background"
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
          {getFriendMessages?.some((message) => message.senderId !== currentUser._id && message.readStatus === false) && (
            <Badge variant={"destructive"}>
                {getFriendMessages?.filter((message) => message.senderId !== currentUser._id && message.readStatus === false).length}
            </Badge>
          )}
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
          <DropdownMenuContent className="z-[999999999]">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={(e) => removeFriendHandler(friend._id, e)}
              className="gap-1"
            >
              <Trash2 className="w-4 h-4" /> Remove friend
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-1"
              onClick={(e) => blockFriendHandler(friend._id, e)}
            >
              <Ban className="w-4 h-4" /> Block
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Link>
  );
};
