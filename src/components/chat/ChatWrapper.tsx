"use client";

import Messages from "./Messages";
import ChatInput from "./ChatInput";
import { trpc } from "@/app/_trpc/client";
import { Loader2, XCircle } from "lucide-react";

interface ChatWrapperProps {
  fileId: string;
}

const ChatWrapper = ({ fileId }: ChatWrapperProps) => {
  const { data, isLoading } = trpc.getFileUploadStatus.useQuery(
    {
      fileId,
    },
    {
      refetchInterval: (data) =>
        data?.status === "SUCCESS" || data?.status === "FAILED" ? false : 500,
    }
  );

  if (isLoading)
    return (
      <div className="relative min-h-full bg-stone-50 flex divide-y  divide-stone-200 flex-col justify-between gap-2">
        <div className="flex-1 flex justify-center items-center flex-col mb-28">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 text-pink-500 animate-spin" />
            <h3 className="font-semibold text-xl ">Loading...</h3>
            <p className="text-stone-500 text-sm">
              we&apos;re preparing your PDF.
            </p>
          </div>
        </div>
        <ChatInput />
      </div>
    );

  if (data?.status === "PROCESSING")
    return (
      <div className="relative min-h-full bg-stone-50 flex divide-y  divide-stone-200 flex-col justify-between gap-2">
        <div className="flex-1 flex justify-center items-center flex-col mb-28">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 text-pink-500 animate-spin" />
            <h3 className="font-semibold text-xl ">processing PDF...</h3>
            <p className="text-stone-500 text-sm">this won&apos;t take long.</p>
          </div>
        </div>
        <ChatInput />
      </div>
    );

  if (data?.status === "FAILED")
    return (
      <div className="relative min-h-full bg-stone-50 flex divide-y  divide-stone-200 flex-col justify-between gap-2">
        <div className="flex-1 flex justify-center items-center flex-col mb-28">
          <div className="flex flex-col items-center gap-2">
            <XCircle className="h-8 w-8 text-red-700 animate-spin" />
            <h3 className="font-semibold text-xl ">File size too big</h3>
            <p className="text-stone-500 text-sm">
              try uploading a smaller file
            </p>
          </div>
        </div>
        <ChatInput />
      </div>
    );

  return (
    <div className="relative min-h-full bg-zinc-50 flex divide-y divide-stone-200 flex-col justify-between gap-2">
      <div className="flex-1 justify-between flex flex-col mb-28">
        <Messages />
      </div>
      <ChatInput isDisabled />
    </div>
  );
};

export default ChatWrapper;
