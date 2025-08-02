"use client"

import { useEffect, useState } from "react"
import { Edit2, CheckCheck, X, Clock, Calendar1 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { capitalizeWords, cn, formatShortDate } from "@/lib/utils/utils"
import { Task, TaskStatus } from "@prisma/client"
import { getPriorityIcon } from "../ui/variants"
import Link from "next/link"
import MarkdownEditor from "../ui/mark-down-editor"
import { TaskStatusIndicator } from "../ui/task-status"
import { saveTaskDescription, toggleStatus } from "@/lib/actions/task"
import DeleteDialog from "../ui/delete-dialog"
import { Input } from "../ui/input"
import { Dialog, DialogTrigger, DialogContent } from "../ui/dialog"
import { TaskStatusTask } from "@/lib/types"
import { getColorVariants } from "@/lib/utils"

interface Props {
  task: Task
  children: React.ReactNode
  currStatus: TaskStatus
  status: TaskStatusTask[]
}

export function TaskView({ task, children, currStatus, status }: Props) {
  const [inlineEditText, setInlineEditText] = useState<string | null>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [edit, setEdit] = useState<string | null>(task.description ?? null)
  const toggleTaskCompletion = async (taskId: string, status: string) => {
    await toggleStatus(taskId, status)
  }
  const handleSaveDescription = async () => {
    if (!edit) return
    await saveTaskDescription(task.id, edit)
    setIsEditing(false)
  }
  // const saveInlineEdit=async ()=>{
  //   if(!inlineEditText || !inlineEditText.trim() || inlineEditText === task.text) return
  //   await editName({taskId: task.id, text: inlineEditText})
  //   setInlineEditText(null)
  // }
  useEffect(() => {
    if (!edit) return;
    if (edit !== task.description) setIsEditing(true)
  }, [edit])
  const colorVariants = getColorVariants(currStatus.primaryColor)
  return (
    <Dialog>
      <DialogTrigger className="w-full">
        {children}
      </DialogTrigger>
      <DialogContent className="w-340">
        <div
          className="rounded-md w-full"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div className={cn("flex items-center justify-between p-2 rounded-md w-full h-16", colorVariants.lightBg)}>
            <div className="flex items-center gap-2 ">
              <TaskStatusIndicator status={status} onChange={(status) => toggleTaskCompletion(task.id, status)} currStatusId={currStatus.id} />
              <div
                className={cn(
                  "flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium text-white",
                  colorVariants.textColor
                )}
              >
                {inlineEditText ? (
                  <Input
                    type="text"
                    value={inlineEditText}
                    onChange={(e) => setInlineEditText(e.target.value)}
                    // onKeyDown={(e)=>{
                    //   if(e.key ==="Enter") saveInlineEdit()
                    //   if(e.key ==="Escape") setInlineEditText(null)
                    // }}
                    // onBlur={saveInlineEdit}
                    className="text-sm w-55 font-medium"
                    autoFocus
                  />
                ) : (<h3 className="text-sm font-medium" onDoubleClick={() => setInlineEditText(task.text)}>{task.text}</h3>)}
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
                      <span>{formatShortDate(task.dueDate)}</span>
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
      </DialogContent>
    </Dialog>
  )
}
