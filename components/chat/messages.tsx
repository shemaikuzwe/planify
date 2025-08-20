"use client";
import { UserMessage } from "@/components/ai/user-mesage";
import React, { forwardRef } from "react";
import { SpinnerMessage } from "@/components/ai/spinner-message";
import { ChatRequestOptions } from "ai";
import { BotMessage } from "@/components/ai/bot-message";
import { UIMessage } from "@/lib/types/ai";
interface MessageProps {
    messages: UIMessage[];
    error: Error | undefined;
    loading: boolean;
    reload: (
        chatRequestOptions?: ChatRequestOptions
    ) => Promise<void>;
}

const Messages = forwardRef<HTMLDivElement, MessageProps>(function Messages(
    { messages, error, loading, reload }: MessageProps,
    ref
) {
    return (
        <div
            ref={ref}
            className={
                "w-full max-w-full flex flex-col gap-4 p-1 sm:p-5 md:p-4 lg:p-1"
            }
        >
            {messages.map((message,idx) => (
                <div key={idx} className={"flex flex-col w-full"}>
                    {message.role === "user" ? (
                        <UserMessage>
                            <div className="ml-1 mt-4 flex-1 flex-col  gap-2 w-full">
                                {/* {message.experimental_attachments &&
                  message.experimental_attachments.map((attachment, index) => (
                    <ViewAttachment key={index} attachment={attachment} />
                  ))} */}
                                {message.parts
                                    .filter(part => part.type === "text")
                                    .map(part => part.text)
                                    .join("\n")}

                            </div>
                        </UserMessage>
                    ) : (
                        <BotMessage isLoading={loading} reload={reload}>
                            {message.parts
                                .filter(part => part.type === "text")
                                .map(part => part.text)
                                .join("\n")}
                        </BotMessage>
                    )}
                </div>
            ))}
            {loading && messages[messages.length - 1].role === "user" && (
                <div className="flex flex-col w-full">
                    <SpinnerMessage />
                </div>
            )}
            {error && (
                <div className="flex flex-col w-full">
                    <BotMessage
                        isLoading={loading}
                        className="text-red-500"
                        reload={reload}
                    >
                        Unable to generate response. Please try again
                    </BotMessage>
                </div>
            )}
        </div>
    );
});

export default Messages;