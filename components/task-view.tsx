"use client"

import { useState } from "react"
import { Check, Edit2, Clock, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils/utils"
import { Input } from "@/components/ui/input"

interface Task {
  id: string
  text: string
  status: string
  time?: string
  dueDate?: string
  priority?: string
}

interface Props {
  task: Task
  onStatusChange: (taskId: string, status: string) => void
  onTextChange: (taskId: string, text: string) => void
}

export function TaskView({ task, onStatusChange, onTextChange }: Props) {
  const [inlineEditText, setInlineEditText] = useState<string | null>(null)
  const [isHovering, setIsHovering] = useState(false)

  const getTaskStatusVariants = (status: string) => {
    switch (status) {
      case "TODO":
        return "bg-amber-500/20 text-amber-700"
      case "IN_PROGRESS":
        return "bg-purple-500/20 text-purple-700"
      case "COMPLETED":
      case "DONE":
        return "bg-green-500/20 text-green-700"
      default:
        return "bg-gray-500/20 text-gray-700"
    }
  }

  const capitalizeWords = (str: string) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  const saveInlineEdit = async () => {
    if (!inlineEditText || !inlineEditText.trim() || inlineEditText === task.text) {
      setInlineEditText(null)
      return
    }

    onTextChange(task.id, inlineEditText)
    setInlineEditText(null)
  }

  const formatShortDate = (dateStr: string) => {
    return dateStr // In a real app, you'd format this properly
  }

  return (
    <div
      className="rounded-md w-full"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="flex items-center justify-between p-2 bg-primary/30 rounded-md w-full">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={task.status === "COMPLETED" || task.status === "DONE"}
            onChange={() => {
              const newStatus = task.status === "COMPLETED" || task.status === "DONE" ? "TODO" : "COMPLETED"
              onStatusChange(task.id, newStatus)
            }}
            className="rounded-sm"
          />
          <div
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium",
              getTaskStatusVariants(task.status),
            )}
          >
            {(task.status === "COMPLETED" || task.status === "DONE") && <Check className="h-3 w-3" />}
            {capitalizeWords(task.status.replaceAll("_", " "))}
          </div>
        </div>

        {isHovering && (
          <div className="flex items-center gap-1">
            <Button variant="secondary" size="icon" className="w-7 h-7" onClick={() => setInlineEditText(task.text)}>
              <Edit2 className="h-3.5 w-3.5" />
              <span className="sr-only">Edit</span>
            </Button>
          </div>
        )}
      </div>

      <div className="p-2 space-y-2">
        <div className="flex justify-between w-full">
          <div className="flex items-start gap-2">
            {inlineEditText ? (
              <Input
                type="text"
                value={inlineEditText}
                onChange={(e) => setInlineEditText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveInlineEdit()
                  if (e.key === "Escape") setInlineEditText(null)
                }}
                onBlur={saveInlineEdit}
                className="text-sm w-55 font-medium"
                autoFocus
              />
            ) : (
              <h3 className="text-sm font-medium" onDoubleClick={() => setInlineEditText(task.text)}>
                {task.text}
              </h3>
            )}
          </div>

          <div className="flex flex-col justify-end">
            {task.time && (
              <div className="flex items-center gap-1 text-xs text-neutral-400">
                <Clock className="h-3 w-3" />
                <span>{task.time}</span>
              </div>
            )}

            {task.dueDate && (
              <div className="flex items-center gap-1 text-xs text-neutral-400">
                <Calendar className="h-3 w-3" />
                <span>{formatShortDate(task.dueDate)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
