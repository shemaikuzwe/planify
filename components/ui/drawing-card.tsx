"use client";

import type React from "react";

import { useRouter } from "next/navigation";
import {
  ChevronRight,
  MessageSquare,
  Pencil,
  MoreVertical,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate } from "@/lib/utils/utils";
import DeleteDialog from "./delete-dialog";
import { useState } from "react";
import { Input } from "./input";
import { db } from "@/lib/store/dexie";
import { syncChange } from "@/lib/utils/sync";
interface DrawingCardProps {
  id: string;
  name: string;
  updatedAt: Date | null;
}

export function DrawingCard({ id, name, updatedAt }: DrawingCardProps) {
  const router = useRouter();
  const [editingDrawingId, setEditingDrawingId] = useState(false);
  const [editDrawingName, setEditDrawingName] = useState("");
  const handleDoubleClick = () => {
    setEditingDrawingId(true);
    setEditDrawingName(name);
  };
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingDrawingId(true);
    setEditDrawingName(name);
  };
  const saveDrawingName = async () => {
    if (!editDrawingName.trim() || !editingDrawingId) return;
    db.drawings.update(id, { name: editDrawingName });
    syncChange("editDrawingName", { id, name: editDrawingName });
    setEditingDrawingId(false);
  };
  return (
    <Card
      className="px-3 border rounded-lg cursor-pointer"
      onClick={() => router.push(`/whiteboard/${id}`)}
    >
      <CardContent className="p-0">
        <div className="flex items-center justify-end">
          {/*<div className="flex items-center gap-2">
            <div className="p-2 rounded-full">
              <MessageSquare className="text-primary h-5 w-5" />
            </div>
          </div>*/}
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical size={16} />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="flex items-center cursor-pointer"
                onClick={handleEdit}
              >
                <Pencil size={16} className="mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <DeleteDialog text={name ?? "Drawing"} id={id} type="drawing">
                  <div className="flex gap-2 text-destructive items-center cursor-pointer">
                    <Trash2 size={16} className="mr-2" />
                    Delete
                  </div>
                </DeleteDialog>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className=" space-y-2">
          {editingDrawingId ? (
            <Input
              type="text"
              value={editDrawingName}
              onChange={(e) => setEditDrawingName(e.target.value)}
              onBlur={() => saveDrawingName()}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveDrawingName();
                if (e.key === "Escape") setEditDrawingName(name);
              }}
            />
          ) : (
            <p className="text-sm" onDoubleClick={handleDoubleClick}>
              {name}
            </p>
          )}
          <div className="flex items-center justify-start text-xs w-full">
            <span>{updatedAt ? formatDate(updatedAt) : ""}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
