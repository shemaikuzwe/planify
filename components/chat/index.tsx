
"use client"
import { useChat } from '@ai-sdk/react';
import type React from "react"
import { Paperclip, ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import { UIMessage } from '@/lib/types/ai';
import { DefaultChatTransport } from 'ai';
import { useState } from 'react';
import Messages from './messages';
import { ScrollArea } from '../ui/scroll-area';
import { AutoScroller } from './auto-scroller';
import { useIsMobile } from '@/hooks/use-mobile';
import { useScroll } from '@/hooks/scroll';
import ScrollAnchor from './scroll-anchor';


interface ChatProps {
  id: string
  initialMessages?: UIMessage[]
}
export default function Chat({ id, initialMessages }: ChatProps) {
  const [input, setInput] = useState<string>("")
  const { messages, sendMessage, error, status, regenerate } = useChat<UIMessage>({
    transport: new DefaultChatTransport({
      api: '/api/chat',
      body: { id }
    }),
    messages: initialMessages
  });
  const session = useSession()
  const user = session.data?.user
  const isEmpty = messages.length === 0

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput("");

    if (!isAtBottom) {
      scrollToBottom();
    }
  };
  const {
    isAtBottom,
    scrollToBottom,
    messagesRef,
    visibilityRef,
    handleScroll,
  } = useScroll<HTMLDivElement>();
  const isMobile = useIsMobile();
  return (
    <div className="flex flex-col flex-1 h-[calc(100vh-86px)] w-full overflow-hidden relative">
      {isEmpty ? (
        <>
          {/* Centered greeting and input form */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center w-full max-w-2xl px-4">
              <h1 className="text-2xl font-medium mb-8">Hello, {user?.name?.split(" ")[0]}</h1>

              <div className="mx-auto p-2">
                <div className="flex items-center gap-2 p-4 border border-border rounded-md focus-within:ring-2 focus-within:ring-ring/50">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="p-2 h-auto flex-shrink-0"
                  >
                    <Paperclip className="w-4 h-4" />
                  </Button>

                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSubmit(e);
                      }
                    }}
                    placeholder="Send a message..."
                    className="border-none px-2 outline-none focus:outline-none focus:ring-0 w-full resize-none"
                    rows={2}
                  />

                  <Button
                    type="submit"
                    disabled={!input.trim()}
                    size={"icon"}
                  >
                    <ArrowUp className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <ScrollArea
            onScrollCapture={handleScroll}
            className="flex-grow w-full overflow-y-auto mt-3"
          >
            <AutoScroller
              ref={visibilityRef}
              className="min-h-full w-full flex flex-col lg:max-w-2xl mx-auto p-1"
            >
              <Messages ref={messagesRef} messages={messages} error={error} loading={status == "streaming"} reload={regenerate} />
              {/* Bottom sentinel for precise scroll-to-bottom targeting */}
              <div ref={messagesRef} />
            </AutoScroller>
          </ScrollArea>
          <div className="mx-auto flex justify-center items-center pb-2 pt-0 z-10">
            <ScrollAnchor
              isAtBottom={isAtBottom}
              scrollToBottom={scrollToBottom}
            />
          </div>

          <div className="w-full z-10 mb-14">
            <div className="mx-auto p-2 max-w-xl">
              <div className="flex items-center gap-2 p-4 border border-border rounded-md focus-within:ring-2 focus-within:ring-ring/50">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="p-2 h-auto flex-shrink-0"
                >
                  <Paperclip className="w-4 h-4" />
                </Button>

                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyUp={(e) => {
                    if (e.key === "Enter") {
                      handleSubmit(e);
                    }
                  }}
                  placeholder="Send a message..."
                  className="border-none px-2 outline-none focus:outline-none focus:ring-0 w-full resize-none"
                  rows={2}
                />

                <Button
                  type="submit"
                  disabled={!input.trim()}
                  size={"icon"}
                >
                  <ArrowUp className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
