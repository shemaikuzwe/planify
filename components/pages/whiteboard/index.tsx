"use client";
import WhiteBoards from "@/components/excalidraw/drawings";
import { Button } from "@/components/ui/button";
import { MessageSquare, Presentation } from "lucide-react";
import Header from "@/components/ui/header";
import { useState } from "react";
import Search from "@/components/ui/search";
import { useNavigate } from "react-router";

export default function AppIndex() {
  const router = useNavigate();
  const [search, setSearch] = useState<string | null>(null);
  return (
    <div className="flex  min-h-screen w-full">
      <div className=" w-full">
        <Header
          title="Whiteboard"
          icon={<Presentation className="h-5 w-5 " />}
        />
        <div className="max-w-6xl mx-auto mt-4">
          <div className="flex gap-4 justify-end items-center mb-8">
            <Search search={search} setSearch={setSearch} />
            <Button
              onClick={() => router(`/app/whiteboard/${crypto.randomUUID()}`)}
            >
              <MessageSquare size={16} />
              New
            </Button>
          </div>
          <WhiteBoards search={search} />
        </div>
      </div>
    </div>
  );
}
