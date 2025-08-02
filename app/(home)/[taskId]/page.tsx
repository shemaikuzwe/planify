import KanbanBoard from "@/components/kanban-board";
import Header from "@/components/ui/header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getCategoryTasks } from "@/lib/data/task";
import { ListTodo } from "lucide-react";

export default async function page({ params }: { params: Promise<{ taskId: string }> }) {
  const taskId = (await params).taskId
  const tasks = getCategoryTasks(taskId)

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <Header title="Tasks" icon={<ListTodo className="h-5 w-5 " />} />
      <ScrollArea>
        <KanbanBoard statusPromise={tasks} />
      </ScrollArea>
    </div>
  )
} 