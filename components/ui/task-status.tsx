"use client"

import { useState } from "react"
import { cn } from "@/lib/utils/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { TaskStatus } from "@prisma/client"


interface TaskStatusIndicatorProps {
    status: TaskStatus[],
    currStatusId:string,
    onChange: (status: string) => void
    className?: string
}
export function TaskStatusIndicator({ status, onChange, currStatusId, className }: TaskStatusIndicatorProps) {
    const [open, setOpen] = useState(false)
    const currStatus = status.find((st) => st.id === currStatusId)
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
            <button
                    className={cn("w-5 h-5 rounded-full flex items-center justify-center", currStatus?.primaryColor, className)}
                    aria-label={`Task status: ${currStatus?.name}`}
                />
            </PopoverTrigger>
            <PopoverContent className="w-48 p-1" align="start">
                <div className="space-y-1">
                    {status.map((st) => (
                        <button
                            key={st.id}
                            className={cn("w-full flex items-center px-2 py-1.5 rounded-sm hover:bg-muted capitalize disabled:opacity-90", {
                                "bg-muted": st.id === currStatus?.id
                            })}
                            onClick={() => {
                                onChange(st.id)
                                setOpen(false)
                            }}
                            disabled={st.id === currStatus?.id}
                        >
                            <div className={cn("w-4 h-4 rounded-full mr-2", st.primaryColor)} />

                            <span className="text-md ">  {st.name}</span>
                        </button>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    )
}