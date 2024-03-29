"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Paperclip, SendHorizontal } from "lucide-react";
import { redirect, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "convex/react";
import Link from "next/link";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { CoverImageModal } from "@/components/cover-image";
import Image from "next/image";

export default function Page() {
  const clerkUser = useUser();
  const params = useParams();
  const friendId = params.friendId;
  const user = useQuery(api.users.getUserByEmail, {
    email: clerkUser.user?.emailAddresses[0].emailAddress as string,
  });
  const [message, setMessage] = useState("");
  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  const friend = useQuery(api.friends.getFriendDetails, {
    friendId: friendId as Id<"friends">,
  });
  const getMessages = useQuery(api.messages.getMessages, {
    friendId: friendId as Id<"friends">,
  });

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [getMessages]);

  const sendMessage = useMutation(api.messages.addMessage);

  if (friend === undefined) {
    return <div>Loading...</div>;
  }

  if (getMessages === undefined) {
    return <div>Loading messages</div>;
  }

  if (friend === null) {
    return redirect("/");
  }

  const handleFileClick = async () => {
    
  }

  const handleSend = async () => {

    if(message === '') {
      return;
    }

      await sendMessage({
        message,
        friendId: friendId as Id<"friends">,
        file: false,
      });
    setMessage("");
  };

  return (
    <div className="col-span-9">
      <Card>
        <CardHeader>
          <CardTitle>Chat with {friend.nameFriendTo}</CardTitle>
        </CardHeader>

        <div className="overflow-y-auto max-h-[calc(100vh-12rem)]">
          <CardContent>
            <CardDescription>
              This is the beginning of your legendary conversation with{" "}
              {friend.nameFriendTo}.
            </CardDescription>
            {getMessages?.map((message, index) => (
              <div
                ref={index === getMessages.length - 1 ? lastMessageRef : null}
                className={`flex my-2 ${
                  message.senderId === user?._id
                    ? "justify-end"
                    : "justify-start"
                }`}
                key={message._id}
              >
                <div
                  className={`${
                    message.senderId === user?._id
                      ? "bg-primary text-muted rounded-l-md rounded-tr-md"
                      : "bg-muted text-primary rounded-r-md rounded-tl-md"
                  } p-2`}
                >
                  {message.file === false ? (
                    <h1>{message.content}</h1>
                  ) : (
                    <Link target="_blank" rel="noopener noreferrer" href={message.content}>
                    <Image src={message.content} alt='image' className="cursor-pointer" width={500} height={200} /></Link>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </div>

        <CardFooter className="flex justify-between gap-2 sticky bottom-0 bg-background py-4">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSend();
              }
            }}
            placeholder={`Message ${
              friend.friendTo === user?._id
                ? friend.nameFriendOf
                : friend.nameFriendTo
            }`}
          />
          <CoverImageModal><Button>
            <Paperclip className="w-5 h-5" />
          </Button></CoverImageModal>
          <Button>
            <SendHorizontal onClick={() => handleSend()} className="w-5 h-5" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
