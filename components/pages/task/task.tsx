import KanbanBoard from "@/components/kanban-board";
import Header from "@/components/ui/header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { db } from "@/lib/store/dexie";
import { useLiveQuery } from "dexie-react-hooks";
import { ListTodo } from "lucide-react";

interface Props {
  id: string;
  type?: string;
}

export default function Task({ id, type = "Task" }: Props) {
  console.log("id", id);
  const page = useLiveQuery(async () => await db.pages.get({ id: id }));
  console.log("page", page);
  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <Header
        title={page?.name ?? type}
        icon={<ListTodo className="h-5 w-5 " />}
      />
      <ScrollArea>
        <KanbanBoard taskId={id} />
      </ScrollArea>
    </div>
  );
}
