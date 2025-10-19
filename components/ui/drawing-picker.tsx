"use client";

import { useState } from "react";
import {
  Search,
  Lock,
  Plus,
  ArrowUpDown,
  PanelLeftCloseIcon,
  HomeIcon,
  Folder,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/store/dexie";
import { formatDate } from "@/lib/utils/utils";
import { useRouter } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "./sheet";
import Link from "next/link";

interface DrawingPickerProps {
  defaultDrawingId: string;
}
export default function DrawingPicker({
  defaultDrawingId,
}: DrawingPickerProps) {
  const drawings = useLiveQuery(
    async () => await db.drawings.orderBy("updatedAt").toArray(),
  );
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const filteredDrawings =
    !searchQuery || searchQuery.trim() === ""
      ? drawings
      : drawings?.filter((drawing) =>
          drawing.name.toLowerCase().includes(searchQuery.toLowerCase()),
        );
  return (
    <Sheet>
      <SheetContent
        side="left"
        className={
          "border border-border  rounded-lg bg-card flex flex-col transition-all duration-200 ease-out w-80 py-4 px-2"
        }
      >
        {/* Header */}
        <div className="p-4 mt-4 flex flex-col gap-2 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <button className="flex items-center gap-2 text-sm font-medium">
              <Folder className="w-4 h-4" />
              <span>Workspace</span>
              {/*<ChevronDown className="w-4 h-4" />*/}
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9  border-0 h-9 text-sm"
            />
          </div>

          <Button variant={"ghost"} asChild>
            <Link href={"/"} className="w-full flex justify-start items-center">
              <HomeIcon />
              Home
            </Link>
          </Button>
        </div>

        {/* Section Header */}
        <div className="px-4 py-3 flex items-center justify-between border-b border-border ">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">Recent</h2>
          </div>

          <div className="flex gap-2">
            <Button size={"icon"} className="h-6 w-6" variant={"outline"}>
              <ArrowUpDown />
            </Button>
            <Button size="icon" className="h-6 w-6" asChild>
              <Link href={`/app/whiteboard/${crypto.randomUUID()}`}>
                <Plus className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
        <div className="flex flex-col overflow-y-auto w-full">
          {filteredDrawings?.map((drawing) => (
            <div
              key={drawing.id}
              onClick={() => router.push(`/app/whiteboard/${drawing.id}`)}
              className={cn(
                "w-full text-left transition-colors border-l-2 hover:bg-secondary/50 px-4 py-3",
                drawing.id === defaultDrawingId
                  ? "bg-primary/10 border-l-primary"
                  : "border-l-transparent",
              )}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-medium text-sm leading-tight text-pretty">
                  {drawing.name}
                </h3>
              </div>
              <div className="flex  w-full flex-col justify-center items-start gap-2 text-xs text-muted-foreground">
                <span>by You</span>
                <div className="flex items-start gap-4  justify-between">
                  <span>{formatDate(drawing.updatedAt)}</span>
                  {/*<Lock className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />*/}
                </div>
              </div>
            </div>
          ))}
        </div>
      </SheetContent>

      <SheetTrigger asChild>
        <Button
          size="icon"
          variant={"outline"}
          className={cn(
            "absolute top-0 z-10 h-8 w-8 transition-all  duration-300 left-12",
          )}
          title={"Expand Sidebar"}
        >
          <PanelLeftCloseIcon
            className={"w-4 h-4 transition-transform duration-300"}
          />
        </Button>
      </SheetTrigger>
    </Sheet>
  );
}
