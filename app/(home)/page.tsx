import Chat from "@/components/excalidraw/chat";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MessageSquare, Presentation } from "lucide-react";
import Header from "@/components/ui/header";

export default function Page() {
  return (
    <div className="flex  min-h-screen w-full">
      <div className=" w-full">
        <Header
          title="Whiteboard"
          icon={<Presentation className="h-5 w-5 " />}
        />
        <div className="max-w-6xl mx-auto mt-4">
          <div className="flex justify-end items-center mb-8">
            <Button asChild>
              <Link href={`/whiteboard/${crypto.randomUUID()}`}>
                <MessageSquare size={16} />
                New Whiteboard
              </Link>
            </Button>
          </div>
          <Chat />
        </div>
      </div>
    </div>
  );
}
