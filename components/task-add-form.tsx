"use client"

import type React from "react"

import { useState } from "react"
import { Calendar, FileText, Plus, Tag, X } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils/utils"

interface TaskAddFormProps {
  onAddTask: (taskData: { text: string; date?: string; tags?: string[] }) => void
  buttonBgClass?: string
  buttonHoverClass?: string
  formBgClass?: string
  formInputBgClass?: string
  formInputTextClass?: string
}

export function TaskAddForm({
  onAddTask,
  buttonBgClass = "bg-neutral-700",
  buttonHoverClass = "hover:bg-neutral-600",
  formBgClass = "bg-neutral-600/50",
  formInputBgClass = "bg-neutral-700",
  formInputTextClass = "text-white",
}: TaskAddFormProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [taskName, setTaskName] = useState("")
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined)
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!taskName.trim()) return

    onAddTask({
      text: taskName,
      date: dueDate ? format(dueDate, "MMMM dd, yyyy") : undefined,
      tags: tags.length > 0 ? tags : undefined,
    })

    // Reset form
    setTaskName("")
    setDueDate(undefined)
    setTags([])
    setNewTag("")
    setIsExpanded(false)
  }

  const handleCancel = () => {
    setTaskName("")
    setDueDate(undefined)
    setTags([])
    setNewTag("")
    setIsExpanded(false)
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  if (!isExpanded) {
    return (
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start text-neutral-400 hover:text-white",
          buttonBgClass, // Apply the background class
          buttonHoverClass, // Apply the hover class
        )}
        onClick={() => setIsExpanded(true)}
      >
        <Plus className="h-4 w-4 mr-2" />
        New Task
      </Button>
    )
  }

  return (
    <div className={cn("rounded-md p-3 space-y-3", formBgClass)}>
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Task Name Input */}
        <div className="relative">
          <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <Input
            type="text"
            placeholder="Type a name..."
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            className={cn(
              "pl-10 border-neutral-600 placeholder:text-neutral-400",
              formInputBgClass,
              formInputTextClass,
            )}
            autoFocus
          />
        </div>

        {/* Due Date Input */}
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start pl-10 border-neutral-600 text-white",
                  formInputBgClass,
                  buttonHoverClass,
                )}
              >
                {dueDate ? format(dueDate, "MMMM dd, yyyy") : "Add Due Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>

        {/* Tags Input */}
        <div className="space-y-2">
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <div className="flex">
              <Input
                type="text"
                placeholder="Add Tags"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addTag()
                  }
                }}
                className={cn(
                  "pl-10 border-neutral-600 placeholder:text-neutral-400 rounded-r-none",
                  formInputBgClass,
                  formInputTextClass,
                )}
              />
              <Button
                type="button"
                onClick={addTag}
                className={cn("rounded-l-none border-neutral-600", formInputBgClass, buttonHoverClass)}
                size="icon"
              >
                <Tag/>
              </Button>
            </div>
          </div>

          {/* Display Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1 bg-blue-500/20 text-blue-300">
                  {tag}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCancel}
            className="bg-transparent border-neutral-600 text-neutral-300 hover:bg-neutral-700"
          >
            Cancel
          </Button>
          <Button type="submit" size="sm" disabled={!taskName.trim()} className="bg-blue-600 hover:bg-blue-700">
            Add Task
          </Button>
        </div>
      </form>
    </div>
  )
}
