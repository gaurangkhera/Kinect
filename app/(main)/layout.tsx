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
} from "@/components/ui/card";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Home, User } from "lucide-react";
import Link from "next/link";
import { useUser } from "@clerk/clerk-react";
import { getUserByEmail } from "@/convex/users";
import { usePathname } from "next/navigation";

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
        <div className="flex h-screen gap-2 p-2">
          <div className="w-64 h-full overflow-auto">
            <Card>
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
                {friends?.map((friend) => (
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
                ))}
              </CardContent>
            </Card>
          </div>
          <div className="flex-grow overflow-auto">{children}</div>
        </div>
      </body>
    </html>
  );
}
