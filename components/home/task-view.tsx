"use client"

import { use, useState } from "react"
import { Check, Edit2, Trash2, ThumbsUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Task } from "@/lib/drizzle"
import { getPriorityIcon } from "../ui/priority-icon"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface Props {
  taskPromise:Promise<Task>
}

export function TaskView({taskPromise}:Props) {
  const task=use(taskPromise)
  const router=useRouter()
  const [isHovering, setIsHovering] = useState(false)

  return (
    <div
      className="rounded-md w-120 max-w-full"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="flex items-center justify-between p-2 bg-primary/70 rounded-md">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium",
              task.status === "COMPLETED" ? "bg-green-800 text-green-200" : "bg-neutral-800 text-neutral-300"
            )}
          >
            {task.status === "COMPLETED" && <Check className="h-3 w-3" />}
            {task.status === "COMPLETED" ? "Done" : "Task"}
            {/* {count > 0 && <span className="ml-1">{count}</span>} */}
          </div>
        </div>

        {isHovering && (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-neutral-400 hover:text-white hover:bg-neutral-700"
              asChild
            >
            <Link href={`/edit/${task.id}`}>
                <Edit2 className="h-3.5 w-3.5" />
              <span className="sr-only">Edit</span>
            </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-neutral-400 hover:text-red-400 hover:bg-neutral-700"
            //   onClick={onDelete}
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        )}
      </div>

      {/* {task.description && (
        <div className="p-3 text-sm text-green-300 bg-[#1a2721] border-b border-[#243029]">
          <p>{task.description}</p>
        </div>
      )} */}

      <div className="p-3">
        <div className="flex items-start gap-2">
          {task.priority && <div className="mt-0.5">{getPriorityIcon(task.priority)}</div>}
          <h3 className="text-sm font-medium text-white">{task.text}</h3>
        </div>

        {task.dueDate && <div className="mt-4 text-xs text-neutral-400">{new Date(task.dueDate).toDateString()}</div>}
      </div>
    </div>
  )
}
