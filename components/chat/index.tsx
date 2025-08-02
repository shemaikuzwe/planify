
"use client"

import type React from "react"

import { useState } from "react"
import { Paperclip, ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"


export default function Chat() {
  const [message, setMessage] = useState("")
   const session = useSession()
   const user = session.data?.user
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      // Handle message submission here
      console.log("Message sent:", message)
      setMessage("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 w-full">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-medium">Hello, {user?.name?.split(" ")[0]}</h1>
        </div>

        {/* Chat Input */}
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
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Send a message..."
                className="border-none px-2 outline-none focus:outline-none focus:ring-0 w-full resize-none"
                rows={2}
              />
              
              <Button
                type="submit"
                disabled={!message.trim()}
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
