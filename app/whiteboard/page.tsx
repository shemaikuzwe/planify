"use client";
import Chat from "@/components/excalidraw/chat";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { Navbar } from "@/components/ui/navbar";

export default function Page() {
  return (
    <div className="flex gap-2 min-h-screen w-full">
      <Navbar />
      <div className="p-4 w-full">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-end items-center mb-8">
            <Button asChild>
              <Link href={`/whiteboard/${crypto.randomUUID()}`}>
                <MessageSquare size={16} />
                New Drawing
              </Link>
            </Button>
          </div>
          <Chat />
        </div>
      </div>
    </div>
  );
}
