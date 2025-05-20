"use client"

import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import type { Todos } from "@/lib/data"
import type { TaskStatus } from "@/lib/types"
import { editGroupName, ToggleTaskStatus } from "@/lib/actions"
import { TaskStatusIndicator } from "../ui/task-status"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getPriorityIcon } from "../ui/variants"
import { Button } from "../ui/button"
import DeleteDialog from "../ui/delete-dialog"
import { formatShortDate } from "@/lib/utils"
import AddGroup from "./add-group"

interface Props {
  todos: Todos
}

export default function DailyTodoTable({ todos }: Props) {
  const router = useRouter()
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null)
  const [editCategoryName, setEditCategoryName] = useState("")

  const toggleTaskCompletion = async (taskId: string, status: TaskStatus) => {
    await ToggleTaskStatus(taskId, status)
  }

  const handleCategoryDoubleClick = (categoryId: string, name: string) => {
    setEditingCategoryId(categoryId)
    setEditCategoryName(name)
  }

  const saveCategoryEdit = async () => {
    if (!editCategoryName.trim() || !editingCategoryId) return
    await editGroupName(editingCategoryId, editCategoryName)
    setEditingCategoryId(null)
  }

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <div className="min-w-170 rounded-md border bg-background">
          <div className="grid grid-cols-12 border-b text-sm">
            <div className="col-span-1 p-3 font-medium">Status</div>
            <div className="col-span-4 p-3 font-medium">Project</div>
            <div className="col-span-2 p-3 font-medium">Time</div>
            <div className="col-span-2 p-3 font-medium">Due Date</div>
            <div className="col-span-1 p-3 font-medium text-center">Actions</div>
          </div>

          {todos?.[0].categories.map((category) => (
            <div key={category.id} className="border-b last:border-0">
              <div className="grid grid-cols-12 items-center bg-muted/30 px-3 py-2">
                <div className="col-span-6 flex items-center">
                  {editingCategoryId === category.id ? (
                    <input
                      type="text"
                      value={editCategoryName}
                      onChange={(e) => setEditCategoryName(e.target.value)}
                      onBlur={saveCategoryEdit}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveCategoryEdit()
                        if (e.key === "Escape") setEditingCategoryId(null)
                      }}
                      className="text-sm font-medium border-b focus:outline-none bg-transparent"
                      autoFocus
                    />
                  ) : (
                    <h3
                      className="text-sm font-medium cursor-pointer"
                      onDoubleClick={() => handleCategoryDoubleClick(category.id, category.name)}
                    >
                      {category.name}
                    </h3>
                  )}
                </div>
                <div className="col-span-6 flex items-center justify-end gap-2">
                  <Button asChild size="sm" variant="ghost" className="h-8">
                    <Link href={`/new/${category.id}`}>
                      <Plus className="w-4 h-4 mr-1" />
                      New task
                    </Link>
                  </Button>
                  <DeleteDialog id={category.id} type="group" text={category.name} />
                </div>
              </div>

              {category.tasks.map((task) => (
                <div
                  key={task.id}
                  className="grid grid-cols-12 items-center border-t hover:bg-muted/20 cursor-pointer transition-colors"
                  onClick={() => router.push(`/task/${task.id}`)}
                >
                  <div className="col-span-1 p-3">
                    <TaskStatusIndicator
                      status={task.status}
                      onChange={(status) => {
                        toggleTaskCompletion(task.id, status)
                      }}
                    />
                  </div>
                  <div className="col-span-4 p-3 flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {task.priority && (
                        <span className="text-xs text-muted-foreground">{getPriorityIcon(task.priority)}</span>
                      )}
                      <span className="font-medium">{task.text}</span>
                    </div>
                  </div>
                  <div className="col-span-2 p-3 text-sm text-muted-foreground">
                    {task.time}
                  </div>
                  <div className="col-span-2 p-3 text-sm text-muted-foreground">
                    {task.dueDate && formatShortDate(task.dueDate)}
                  </div>
                </div>
              ))}

              {category.tasks.length === 0 && (
                <div className="py-3 px-6 text-sm text-muted-foreground italic">No tasks in this Group</div>
              )}
            </div>
          ))}

          <div className="p-3 border-t">
            <AddGroup dailyTodoId={todos[0]?.id}/>
          </div>
        </div>
      </div>
    </div>
  )
}
