"use client";

import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { useParams } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { SingleImageDropzone } from "./single-image-dropzone";
import { useEdgeStore } from "@/lib/edgestore";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Progress } from "./ui/progress";
import { Skeleton } from "./ui/skeleton";

export const CoverImageModal = ({ children }: { children: React.ReactNode}) => {
  const params = useParams();
  const { edgestore } = useEdgeStore();
  const [progress, setProgress] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const friendId = params.friendId;

  const friend = useQuery(api.friends.getFriendDetails, {
    friendId: friendId as Id<"friends">
  })

  const sendMessageWithFile = useMutation(api.messages.addMessage);

  const [file, setFile] = useState<File>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onClose = () => {
    setFile(undefined);
    setIsSubmitting(false);
    setDialogOpen(false);
  };

  const onChange = async (file?: File) => {
    if (file) {
      setIsSubmitting(true);
      setFile(file);

      const res = await edgestore.publicFiles.upload({
        file, 
        onProgressChange(progress) {
          setProgress(progress);
        },
      })


      await sendMessageWithFile({
        file: true,
        message: res.url,
        friendId: friendId as Id<"friends">,
      })

      onClose();
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="my-4">
          <DialogTitle className="text-center">
            Send a file
          </DialogTitle>
          <DialogDescription className="text-center">
            Select a file to send it.
          </DialogDescription>
        </DialogHeader>
        <SingleImageDropzone
          className="w-full outline-none"
          disabled={isSubmitting}
          value={file}
          onChange={onChange}
        />
        {isSubmitting && (
          <div className="flex flex-row items-center w-full gap-2">
            <Progress value={progress} />
            <p className="text-sm font-medium">{progress}%</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};


