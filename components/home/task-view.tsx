"use client"

import { use, useState } from "react"
import { Check, Edit2, Trash2, CheckCheck, X, Clock, Calendar1 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { capitalizeWords, cn, formatDate } from "@/lib/utils"
import { Task } from "@/lib/drizzle"
import { getPriorityIcon, getTaskStatusVariants } from "../ui/variants"
import { useRouter } from "next/navigation"
import Link from "next/link"
import MarkdownEditor from "../ui/mark-down-editor"
import { TaskStatusIndicator } from "../ui/task-status"
import { TaskStatus } from "@/lib/types"
import { ToggleTaskStatus } from "@/lib/actions"

interface Props {
  taskPromise: Promise<Task>
}

export function TaskView({ taskPromise }: Props) {
  const task = use(taskPromise)
  const router = useRouter()
  const [isHovering, setIsHovering] = useState(false)
  const [edit, setEdit] = useState<string | null>(null)
  const toggleTaskCompletion = async (taskId: string, status: TaskStatus) => {
    await ToggleTaskStatus(taskId, status)
  }

  return (
    <div
      className="rounded-md w-120"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="flex items-center justify-between p-2 bg-primary/70 rounded-md">
        <div className="flex items-center gap-2">
          <TaskStatusIndicator status={task.status} onChange={(status) => toggleTaskCompletion(task.id, status)} />
          <div
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium",
              getTaskStatusVariants(task.status)
            )}
          >
            {task.status === "COMPLETED" && <Check className="h-3 w-3" />}
            {capitalizeWords(task.status.replaceAll("_", " "))}
          </div>
        </div>

        {isHovering && (
          <div className="flex items-center gap-1">
            <Button
              variant="secondary"
              size="icon"
              className="w-7 h-7"
              asChild
            >
              <Link href={`/edit/${task.id}`}>
                <Edit2 className="h-3.5 w-3.5" />
                <span className="sr-only">Edit</span>
              </Link>
            </Button>
            <Button
              variant="destructive"
              size="icon"
              className="w-7 h-7"
            //   onClick={onDelete}
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        )}
      </div>

      <div className="p-3 space-y-4 ">
        <div className="flex justify-between">
          <div className="flex items-start gap-2">
            {task.priority && <div className="mt-0.5">{getPriorityIcon(task.priority)}</div>}
            <h3 className="text-sm font-medium">{task.text}</h3>
          </div>
          <div className="flex flex-col justify-end">
            {task.time && (
              <div className="flex items-center gap-1 text-xs text-neutral-400">
                <Clock className="h-3 w-3" />
                <span>{task.time}</span>
              </div>
            )}
            {
              task.dueDate && (
                <div className="flex items-center gap-1 text-xs text-neutral-400">
                  <Calendar1 className="h-3 w-3" />
                  <span>{formatDate(task.dueDate)}</span>
                </div>
              )
            }
          </div>
        </div>
        <div className="flex flex-col">
          {edit && (
            <div className="flex gap-2 justify-end">
              <Button size={"icon"} variant={"outline"} className="w-7 h-7" onClick={() => setEdit(null)}>
                <X className="h-3.5 w-3.5" />
              </Button>
              <Button size={"icon"} className="w-7 h-7">
                <CheckCheck className="h-3.5 w-3.5" />
              </Button>

            </div>
          )}
          <MarkdownEditor initialMarkdown="# Task" onChange={(val) => setEdit(val)} />
        </div>
      </div>
    </div>
  )
}
