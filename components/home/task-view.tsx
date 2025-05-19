"use client"

import { use, useEffect, useState, useTransition } from "react"
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
import { editName, saveTaskDescription, ToggleTaskStatus } from "@/lib/actions"
import DeleteDialog from "../ui/delete-dialog"

interface Props {
  taskPromise: Promise<Task>
}

export function TaskView({ taskPromise }: Props) {
  const task = use(taskPromise)
  const [inlineEditText, setInlineEditText] = useState<string | null>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [edit, setEdit] = useState<string | null>(task.description ?? null)
  const toggleTaskCompletion = async (taskId: string, status: TaskStatus) => {
    await ToggleTaskStatus(taskId, status)
  }
  const handleSaveDescription = async () => {
    if (!edit) return
    await saveTaskDescription(task.id, edit)
    setIsEditing(false)
  }
  const saveInlineEdit=async ()=>{
    if(!inlineEditText || !inlineEditText.trim() || inlineEditText === task.text) return
    await editName({taskId: task.id, text: inlineEditText})
    setInlineEditText(null)
  }
  useEffect(() => {
    if (!edit) return;
    if (edit !== task.description) setIsEditing(true)
  }, [edit])

  return (
    <div
      className="rounded-md w-120"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="flex items-center justify-between p-2 bg-primary/30 rounded-md">
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
             <DeleteDialog id={task.id} type="task" text={task.text} />
          </div>
        )}
      </div>

      <div className="p-3 space-y-4 ">
        <div className="flex justify-between w-full">
          <div className="flex items-start gap-2">
            {task.priority && <div className="mt-0.5">{getPriorityIcon(task.priority)}</div>}
          {inlineEditText ?(
            <input
              type="text"
              value={inlineEditText}
              onChange={(e) => setInlineEditText(e.target.value)}
              onKeyDown={(e)=>{
                if(e.key ==="Enter") saveInlineEdit()
                if(e.key ==="Escape") setInlineEditText(null)
              }}
              onBlur={saveInlineEdit}
              className="flex-1 border-b border-gray-200 bg-transparent py-0.5 text-sm focus:border-gray-400 focus:outline-none font-medium"
              autoFocus
            />
          ):(  <h3 className="text-sm font-medium" onDoubleClick={() => setInlineEditText(task.text)}>{task.text}</h3>)}
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
          {isEditing && (
            <div className="flex gap-2 justify-end">
              <Button size={"icon"} variant={"outline"} className="w-7 h-7" onClick={() => {
                setEdit(task.description ?? null)
                setIsEditing(false)
              }}>
                <X className="h-3.5 w-3.5" />
              </Button>
              <Button size={"icon"} className="w-7 h-7" onClick={handleSaveDescription}>
                <CheckCheck className="h-3.5 w-3.5" />
              </Button>

            </div>
          )}
          <MarkdownEditor markdown={edit} onChange={(val) => setEdit(val)} />
        </div>
      </div>
    </div>
  )
}
