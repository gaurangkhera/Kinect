"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/convex/_generated/api";
import { UserProfile, useUser } from "@clerk/clerk-react";
import { useMutation, useQuery } from "convex/react";
import { Check, Clipboard } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useMediaQuery } from 'react-responsive'
import { Metadata } from "next";
import Head from "next/head";

export default function Page() {
  const clerkUser = useUser();
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' })
  const [icon, setIcon] = useState(<Clipboard className="w-4 h-4" />);
  const updateUser = useMutation(api.users.updateUser);
  const user = useQuery(api.users.getUserByEmail, {
    email: clerkUser.user?.emailAddresses[0].emailAddress as string,
  });
  const [discId, setDiscId] = useState(user?.discId.split("#")[0]);
  const userIdentifier = user?.discId.split("#")[1];

  const copyUserDiscID = () => {
    window.navigator.clipboard.writeText(user?.discId as string);
    setIcon(<Check className="w-4 h-4" />);

    setTimeout(() => {
      setIcon(<Clipboard className="w-4 h-4" />);
    }, 3500);
  };

  const saveChanges = async () => {
    const promise = updateUser({
      newDiscId: `${discId}#${userIdentifier}`,
    });

    toast.promise(promise, {
      success: "Changes saved!",
      loading: "Saving changes...",
      error(error) {
        return error.data
      },
    });
  };
  return (
    <Card>
      <Head>
        <title>Account</title>
      </Head>
      <CardHeader>
        <CardTitle>Account</CardTitle>
        <CardDescription>Edit your account settings here.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="account" className="w-full h-full">
          <TabsList className="grid md:w-1/4 grid-cols-2">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account</CardTitle>
                <CardDescription>
                  Make changes to your account here. Click save when you're
                  done.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 overflow-x-hidden">
              {!isMobile ? (<UserProfile
    appearance={
      {
        variables: {
          colorPrimary: '#ABEB47',
          colorBackground:"#090B04",
          colorText:"#FFFFFF",
        },
      }
    }
/>) : (
  <UserProfile
  appearance={
    {
      variables: {
        colorPrimary: '#ABEB47',
        colorBackground:"#090B04",
        colorText:"#FFFFFF",
      },
      elements: {
       card: {
        display: 'flex',
        width: '80%'
       }
      }
    }
  }
/>
)}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>
                  Change your profile settings here.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="new">New username</Label>
                  <div className="flex border border-muted rounded-md gap-1 items-center space-x-2">
                    <Input
                      id="new"
                      className="flex-grow px-2 py-1"
                      value={discId}
                      onChange={(e) => setDiscId(e.target.value)}
                    />
                    <div className="px-2 py-1 bg-background rounded-lg text-right">
                      <Label>#{userIdentifier}</Label>
                    </div>
                    <Button
                      variant={"outline"}
                      size="icon"
                      onClick={() => copyUserDiscID()}
                    >
                      {icon}
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => saveChanges()}>Save</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
