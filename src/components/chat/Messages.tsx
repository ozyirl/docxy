import { trpc } from "@/app/_trpc/client";
import { INFINTE_QUERY_LIMIT } from "@/config/infinte-query";
import { Loader2, MessageSquare } from "lucide-react";
import { useContext, useEffect, useRef } from "react";
import Skeleton from "react-loading-skeleton";
import { ChatContext } from "./ChatContext";
import Message from "./Message";
import { useIntersection } from "@mantine/hooks";

interface MessagesProps {
  fileId: string;
}
const Messages = ({ fileId }: MessagesProps) => {
  const { isLoading: isAiThinking } = useContext(ChatContext);

  const { data, isLoading, fetchNextPage } =
    trpc.getFileMessages.useInfiniteQuery(
      {
        fileId,
        limit: INFINTE_QUERY_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        keepPreviousData: true,
      }
    );

  const messages = data?.pages.flatMap((page) => page.messages);

  const loadingMessage = {
    createdAt: new Date().toISOString(),
    id: "loading-message",
    isUserMessage: false,
    text: (
      <span className="flex h-full items-center justify-center">
        <Loader2 className="h-4 w-4 animate-spin" />
      </span>
    ),
  };

  const combineMessages = [
    ...(isAiThinking ? [loadingMessage] : []),
    ...(messages ?? []),
  ];

  const lastMessageRef = useRef<HTMLDivElement>(null);
  const { ref, entry } = useIntersection({
    root: lastMessageRef.current,
    threshold: 1,
  });

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage]);
  return (
    <div className="flex max-h-[calc(100vh-3.5rem-7rem)] border-stone-200 flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-pink scrollbar-thumb-rounded scrollbar-track-pink-lighter scrollbar-w-2 scrolling-touch">
      {combineMessages && combineMessages.length > 0 ? (
        combineMessages.map((message, i) => {
          const isNextMessageSamePerson =
            combineMessages[i - 1]?.isUserMessage ===
            combineMessages[i]?.isUserMessage;

          if (i === combineMessages.length - 1) {
            return (
              <Message
                ref={ref}
                message={message}
                isNextMessageSamePerson={isNextMessageSamePerson}
                key={message.id}
              />
            );
          } else
            return (
              <Message
                message={message}
                isNextMessageSamePerson={isNextMessageSamePerson}
                key={message.id}
              />
            );
        })
      ) : isLoading ? (
        <div className="w-full flex flex-col gap-2 ">
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-2">
          <MessageSquare className="h-8 w-8 text-pink-500 " />
          <h3 className="font-semibold text-xl "> you&apos;re all set</h3>
          <p className="text-stone text-sm">
            ask your first question to get started.
          </p>
        </div>
      )}
    </div>
  );
};

export default Messages;
