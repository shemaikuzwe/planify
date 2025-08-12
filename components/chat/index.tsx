
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


export default function Chat() {
  const [input, setInput] = useState<string>("")
  const { messages, sendMessage, error, status } = useChat<UIMessage>({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
  });
  const session = useSession()
  const user = session.data?.user
  const isEmpty = messages.length === 0

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput("");
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 w-full">
      <div className="w-full max-w-2xl">
        {isEmpty ? (
          <div className="text-center mb-8">
            <h1 className="text-2xl font-medium">Hello, {user?.name?.split(" ")[0]}</h1>
          </div>
        ) : (
          <Messages messages={messages} error={error} loading={status == "streaming"} reload={sendMessage} />
        )}

        <form onSubmit={handleSubmit} className="relative">
          <div className="relative rounded-lg border">
            <div className="flex items-center gap-2 p-4 focus-within:ring-2 focus-within:rounded-md focus-within:ring-ring/50">
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
                // onKeyDown={handleKeyDown}
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
        </form>
      </div>
    </div>
  )
}
