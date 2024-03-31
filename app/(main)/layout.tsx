"use client";

import "@/app/globals.css";
import { Toaster } from "sonner";
import { Inter } from "next/font/google";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Home, PanelLeft, User } from "lucide-react";
import Link from "next/link";
import { useUser } from "@clerk/clerk-react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { ThemeProvider } from "@/components/theme-provider";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { Sheet, SheetContent, SheetFooter, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const font = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const clerkUser = useUser();
  const pathname = usePathname();
  const currentUser = useQuery(api.users.getUserByEmail, {
    email: clerkUser.user?.emailAddresses[0].emailAddress as string,
  });
  const friends = useQuery(api.friends.getUserFriends);

  if (!currentUser) {
    return null;
  }

  return (
    <html lang="en">
      <body className={font.className}>
        <Toaster position="top-center" richColors />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          <div className="flex h-screen gap-2 p-2 noscroll">
            <div className="z-[99999] md:hidden block top-0 right-0 absolute p-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button size="icon" variant="outline">
                    <PanelLeft className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="z-[9999999]" side="right">
                  <Link href={`/`} className="group my-1">
                    <div
                      className={`group-hover:bg-muted group-hover:text-primary rounded-lg p-3 gap-2 flex flex-row items-center cursor-pointer ${
                        pathname === `/`
                          ? "bg-primary text-background"
                          : "bg-background text-primary text-background"
                      }`}
                    >
                      <div className="group-hover:bg-primary group-hover:text-muted text-primary bg-muted rounded-full p-2">
                        <Home className="w-5 h-5" />
                      </div>
                      Home
                    </div>
                  </Link>
                  {friends === undefined ? (
                    <>
                      <Skeleton className="h-12 w-full my-1" />
                      <Skeleton className="h-12 w-full" />
                    </>
                  ) : (
                    friends.map((friend) => (
                      <Link
                        key={friend._id}
                        href={`/chat/${friend._id}`}
                        className="group my-1"
                      >
                        <div
                          className={`group-hover:bg-muted group-hover:text-primary rounded-lg p-3 gap-2 flex flex-row items-center cursor-pointer ${
                            pathname === `/chat/${friend._id}`
                              ? "bg-primary text-background"
                              : "bg-background text-primary text-background"
                          }`}
                        >
                          <div className="group-hover:bg-primary group-hover:text-muted text-primary bg-muted rounded-full p-2">
                            <User className="w-5 h-5" />
                          </div>
                          {friend.friendTo === currentUser._id
                            ? friend.nameFriendOf
                            : friend.nameFriendTo}
                        </div>
                      </Link>
                    ))
                  )}
                  <SheetFooter className="bottom-0 fixed mb-4">
                  <Link href="/account" className="group">
                    <div
                      className={`group-hover:bg-muted group-hover:text-primary rounded-lg p-3 gap-2 flex flex-row items-center cursor-pointer ${
                        pathname === `/account`
                          ? "bg-primary text-background"
                          : "bg-background text-primary text-background"
                      }`}
                    >
                      <div className="rounded-full overflow-hidden">
                        <Image
                          src={clerkUser.user?.imageUrl as string}
                          width={40}
                          height={40}
                          alt="user-img"
                        />
                      </div>
                      {currentUser.name}
                    </div>
                  </Link>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
            <div className={`w-64 h-full overflow-auto md:block hidden`}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Friends</CardTitle>
                  <CardDescription>See your friends here.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={`/`} className="group my-1">
                    <div
                      className={`group-hover:bg-muted group-hover:text-primary rounded-lg p-3 gap-2 flex flex-row items-center cursor-pointer ${
                        pathname === `/`
                          ? "bg-primary text-background"
                          : "bg-background text-primary text-background"
                      }`}
                    >
                      <div className="group-hover:bg-primary group-hover:text-muted text-primary bg-muted rounded-full p-2">
                        <Home className="w-5 h-5" />
                      </div>
                      Home
                    </div>
                  </Link>
                  {friends === undefined ? (
                    <>
                      <Skeleton className="h-12 w-full my-1" />
                      <Skeleton className="h-12 w-full" />
                    </>
                  ) : (
                    friends.map((friend) => (
                      <Link
                        key={friend._id}
                        href={`/chat/${friend._id}`}
                        className="group my-1"
                      >
                        <div
                          className={`group-hover:bg-muted group-hover:text-primary rounded-lg p-3 gap-2 flex flex-row items-center cursor-pointer ${
                            pathname === `/chat/${friend._id}`
                              ? "bg-primary text-background"
                              : "bg-background text-primary text-background"
                          }`}
                        >
                          <div className="group-hover:bg-primary group-hover:text-muted text-primary bg-muted rounded-full p-2">
                            <User className="w-5 h-5" />
                          </div>
                          {friend.friendTo === currentUser._id
                            ? friend.nameFriendOf
                            : friend.nameFriendTo}
                        </div>
                      </Link>
                    ))
                  )}
                </CardContent>
                <CardFooter className="bottom-0 fixed">
                  <Link href="/account" className="group">
                    <div
                      className={`group-hover:bg-muted group-hover:text-primary rounded-lg p-3 gap-2 flex flex-row items-center cursor-pointer ${
                        pathname === `/account`
                          ? "bg-primary text-background"
                          : "bg-background text-primary text-background"
                      }`}
                    >
                      <div className="rounded-full overflow-hidden">
                        <Image
                          src={clerkUser.user?.imageUrl as string}
                          width={40}
                          height={40}
                          alt="user-img"
                        />
                      </div>
                      {currentUser.name}
                    </div>
                  </Link>
                </CardFooter>
              </Card>
            </div>
            <div className="flex-grow overflow-auto">{children}</div>
          </div>
        </ThemeProvider>
      </body>
      <style jsx>{`
        @media (min-width: 768px) {
          button {
            display: none;
          }
        }
      `}</style>
    </html>
  );
}
