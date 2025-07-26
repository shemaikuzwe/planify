import KanbanBoard from "@/components/kanban-board";
import { getCategoryTasks } from "@/lib/data/task";

export default async function page({ params }: { params: Promise<{ taskId: string }> }) {
  const taskId = (await params).taskId
  const tasks = getCategoryTasks(taskId)

  return (
    <div className="flex justify-center pt-5 w-full">
      <KanbanBoard statusPromise={tasks} />
    </div>
  )
}