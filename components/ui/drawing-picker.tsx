"use client";

import { useState } from "react";
import {
  Search,
  Lock,
  Plus,
  ChevronDown,
  Folder,
  ChevronRight,
  PanelLeftCloseIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/store/dexie";
import { formatDate } from "@/lib/utils/utils";
import { useRouter } from "next/navigation";

interface DrawingPickerProps {
  defaultDrawingId: string;
  isCollapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function DrawingPicker({
  defaultDrawingId,
  isCollapsed,
  setCollapsed,
}: DrawingPickerProps) {
  const drawings = useLiveQuery(async () => await db.drawings.toArray());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState(defaultDrawingId);
  const router = useRouter();
  const filteredDrawings =
    !searchQuery || searchQuery.trim() === ""
      ? drawings
      : drawings?.filter((drawing) =>
          drawing.name.toLowerCase().includes(searchQuery.toLowerCase()),
        );
  return (
    <div>
      <aside
        className={cn(
          "border border-border  rounded-lg bg-card flex flex-col transition-all duration-200 ease-out",
          isCollapsed
            ? "w-0 border-0 overflow-hidden"
            : "w-64 py-4 px-2 min-h-64",
        )}
      >
        {/* Header */}
        <div className="p-4 border-b border-border">
          {/*<div className="flex items-center justify-between mb-4">
            <button className="flex items-center gap-2 text-sm font-medium">
              <Folder className="w-4 h-4" />
              <span>My Workspace</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>*/}

          {/* Search */}
          <div className="relative">
            {/*<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />*/}
            <Input
              type="text"
              placeholder="Quick search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9  border-0 h-9 text-sm"
            />
            {/*<kbd className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              ⌘K
            </kbd>*/}
          </div>
        </div>

        {/* Section Header */}
        <div className="px-4 py-3 flex items-center justify-between border-b border-border">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-muted-foreground" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Recent
            </h2>
          </div>
          <Button size="icon" variant="ghost" className="h-6 w-6">
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Document List */}
        <div className="flex flex-col overflow-y-auto">
          {filteredDrawings?.map((drawing) => (
            <div
              key={drawing.id}
              onClick={() => router.push(`/whiteboard/${drawing.id}`)}
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
                {/*{drawing.isPrivate && (
                  <Lock className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
                )}*/}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {/*<span>by {drawing.}</span>*/}
                {/*<span>•</span>*/}
                <span>{formatDate(drawing.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <Button className="w-full" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New Drawing
          </Button>
        </div>
      </aside>

      <Button
        size="icon"
        variant={"outline"}
        onClick={() => setCollapsed(!isCollapsed)}
        className={cn(
          "absolute top-0 z-10 h-8 w-8 transition-all bg-muted-foreground duration-300",
          isCollapsed ? "left-4" : "left-[280px]",
        )}
        title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <PanelLeftCloseIcon
          className={cn(
            "w-4 h-4 transition-transform duration-300",
            !isCollapsed && "rotate-180",
          )}
        />
      </Button>
    </div>
  );
}
