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
import { format, isToday, isYesterday, isSameDay } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import Head from "next/head";

const DateSeparator = ({ date }: { date: number }) => {
  const formattedDate = format(date, "MMMM dd, yyyy");

  return (
    <div className="flex items-center my-4">
      <hr className="flex-grow" />
      <span className="mx-2 text-xs text-gray-500">{formattedDate}</span>
      <hr className="flex-grow" />
    </div>
  );
};

export default function Page() {
  const clerkUser = useUser();
  const params = useParams();
  const friendId = params.friendId;
  const [lastReadMessage, setLastReadMessage] = useState<Id<"messages">>();
  const user = useQuery(api.users.getUserByEmail, {
    email: clerkUser.user?.emailAddresses[0].emailAddress as string,
  });
  const [message, setMessage] = useState("");
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const markAsRead = useMutation(api.messages.markAsRead);

  const friend = useQuery(api.friends.getFriendDetails, {
    friendId: friendId as Id<"friends">,
  });
  const getMessages = useQuery(api.messages.getMessages, {
    friendId: friendId as Id<"friends">,
  });

  useEffect(() => {
    if(getMessages !== undefined) {
      const lastMessage = getMessages[getMessages.length - 1];
      if (lastMessage && lastMessage.senderId !== user?._id && lastMessage._id !== lastReadMessage) {
        markAsRead({ messageId: lastMessage._id });
        setLastReadMessage(lastMessage._id);
      }
      setTimeout(() => {
        lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [getMessages, user?._id, lastReadMessage]);

  const sendMessage = useMutation(api.messages.addMessage);

  if (friend === undefined || getMessages === undefined) {
    return (
      <div className="col-span-9 h-full">
        <Card className="h-full ">
          <CardHeader>
            <CardTitle>
              <Skeleton className="w-64 h-10" />
            </CardTitle>
          </CardHeader>

          <div className="overflow-y-auto h-full max-h-[calc(100vh-12rem)] noscroll">
            <CardContent className="gap-2">
              <Skeleton className="w-1/4 h-4 my-1" />
              <Skeleton className="w-1/2 h-4 my-1" />
              <Skeleton className="w-8 h-4 my-1" />
              <Skeleton className="w-20 h-4 my-1" />
              <Skeleton className="w-16 h-4" />
              <Skeleton className="w-1/4 h-4 my-1" />
              <Skeleton className="w-1/2 h-4 my-1" />
              <Skeleton className="w-8 h-4 my-1" />
              <Skeleton className="w-20 h-4 my-1" />
              <Skeleton className="w-16 h-4" />
              <Skeleton className="w-1/4 h-4 my-1" />
              <Skeleton className="w-1/2 h-4 my-1" />
              <Skeleton className="w-8 h-4 my-1" />
              <Skeleton className="w-20 h-4 my-1" />
              <Skeleton className="w-16 h-4" />
              <Skeleton className="w-1/4 h-4 my-1" />
              <Skeleton className="w-1/2 h-4 my-1" />
              <Skeleton className="w-8 h-4 my-1" />
              <Skeleton className="w-20 h-4 my-1" />
              <Skeleton className="w-16 h-4" />
              <Skeleton className="w-1/4 h-4 my-1" />
              <Skeleton className="w-1/2 h-4 my-1" />
              <Skeleton className="w-8 h-4 my-1" />
              <Skeleton className="w-20 h-4 my-1" />
              <Skeleton className="w-16 h-4" />
            </CardContent>
          </div>

          <CardFooter className="flex justify-between gap-2 sticky bottom-0 bg-background py-4">
            <Skeleton className="w-full h-10" />
            <Skeleton className="w-10 h-10" />
            <Skeleton className="w-10 h-10" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (friend === null) {
    return redirect("/");
  }

  const handleSend = async () => {
    if (message === "") {
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
    <div className="col-span-9 h-full">
        <Head>
          <title>Chat with {friend.friendTo === user?._id
                ? friend.nameFriendOf
                : friend.nameFriendTo}
              .</title>
        </Head>
      <Card className="h-full ">
        <CardHeader>
          <CardTitle>
            Chat with{" "}
            {friend.friendTo === user?._id
              ? friend.nameFriendOf
              : friend.nameFriendTo}
          </CardTitle>
        </CardHeader>

        <div className="overflow-y-auto h-full max-h-[calc(100vh-12rem)] noscroll">
          <CardContent>
            <CardDescription>
              This is the beginning of your legendary conversation with{" "}
              {friend.friendTo === user?._id
                ? friend.nameFriendOf
                : friend.nameFriendTo}
              .
            </CardDescription>
            {getMessages?.map((message, index) => {
              let messageDate = message._creationTime;
              let formattedDate = "";

              if (isToday(messageDate)) {
                formattedDate = format(messageDate, "HH:mm");
              } else if (isYesterday(messageDate)) {
                formattedDate = `Yesterday at ${format(messageDate, "HH:mm")}`;
              } else {
                formattedDate = format(messageDate, "dd/MM/yyyy HH:mm");
              }

              const nextMessage = getMessages[index + 1];
              const showSeparator =
                nextMessage &&
                !isSameDay(nextMessage._creationTime, messageDate);

              return (
                <>
                  <div
                    ref={
                      index === getMessages.length - 1 ? lastMessageRef : null
                    }
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
                        <Link
                          target="_blank"
                          rel="noopener noreferrer"
                          href={message.content}
                        >
                          <Image
                            src={message.content}
                            alt="image"
                            className="cursor-pointer"
                            width={500}
                            height={200}
                          />
                        </Link>
                      )}
                      <p
                        className={`flex font-medium text-xs ${
                          message.senderId === user?._id
                            ? "justify-end"
                            : "justify-start"
                        } ${message.file && "mb-0 my-2"}`}
                      >
                        {formattedDate}
                      </p>
                    </div>
                  </div>
                  {showSeparator && <DateSeparator date={nextMessage._creationTime} />}
                </>
              );
            })}
          </CardContent>
        </div>

        <CardFooter className="flex justify-between gap-2 sticky bottom-0 bg-background py-4">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                (async () => {
                  await handleSend();
                })();
              }
            }}
            placeholder={`Message ${
              friend.friendTo === user?._id
                ? friend.nameFriendOf
                : friend.nameFriendTo
            }`}
          />
          <CoverImageModal>
            <Button>
              <Paperclip className="w-5 h-5" />
            </Button>
          </CoverImageModal>
          <Button>
            <SendHorizontal onClick={() => handleSend()} className="w-5 h-5" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
