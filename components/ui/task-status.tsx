"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { TaskStatus } from "@/lib/types"



interface TaskStatusIndicatorProps {
    status: TaskStatus
    onChange: (status: TaskStatus) => void
    className?: string
}
const TaskStatus = ["NOT_STARTED", "IN_PROGRESS", "COMPLETED", "FAILED"] as const
export function TaskStatusIndicator({ status, onChange, className }: TaskStatusIndicatorProps) {
    const [open, setOpen] = useState(false)

    const getStatusColor = (status: TaskStatus) => {
        switch (status) {
            case "NOT_STARTED":
                return "bg-gray-400"
            case "IN_PROGRESS":
                return "bg-blue-500"
            case "COMPLETED":
                return "bg-green-500"
            case "FAILED":
                return "bg-red-500"
            default:
                return "bg-gray-400"
        }
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button
                    className={cn("w-5 h-5 rounded-full flex items-center justify-center", getStatusColor(status), className)}
                    aria-label={`Task status: ${status.toLowerCase().replace("_", " ")}`}
                />
            </PopoverTrigger>
            <PopoverContent className="w-48 p-1" align="start">
                <div className="space-y-1">
                    {TaskStatus.map((st) => (
                        <button
                            key={st}
                            className={cn("w-full flex items-center px-2 py-1.5 rounded-sm hover:bg-muted capitalize disabled:opacity-90", {
                                "bg-muted": st === status
                            })}
                            onClick={() => {
                                onChange(st)
                                setOpen(false)
                            }}
                            disabled={st === status}
                        >
                            <div className={cn("w-4 h-4 rounded-full mr-2", getStatusColor(st))} />

                            <span className="text-md ">  {st.toLowerCase().replace("_", " ")}</span>
                        </button>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    )
}
{/* <button
    onClick={() => {
        onChange("NOT_STARTED")
        setOpen(false)
    }}
    className={cn("w-full flex items-center px-2 py-1.5 rounded-sm hover:bg-muted", {
        "bg-muted": status === "NOT_STARTED"
    })}
>
    <div className="w-4 h-4 rounded-full bg-gray-400 mr-2" />
    <span className="text-md ">Not Started</span>
</button> */}