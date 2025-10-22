"use client";
import KanbanBoard from "@/components/kanban-board";
import Header from "@/components/ui/header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { db } from "@/lib/store/dexie";
import { useLiveQuery } from "dexie-react-hooks";
import { ListTodo } from "lucide-react";
import { useParams } from "next/navigation";

export default function page() {
  const { taskId } = useParams<{ taskId: string }>();
  if (!taskId) {
    throw new Error("something went wrong");
  }
  const page = useLiveQuery(async () => await db.pages.get({ id: taskId }));
  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <Header
        title={page?.name ?? "Task"}
        icon={<ListTodo className="h-5 w-5 " />}
      />
      <ScrollArea>
        <KanbanBoard taskId={taskId} />
      </ScrollArea>
    </div>
  );
}
