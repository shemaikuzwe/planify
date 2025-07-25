"use client"

import { useState } from "react"
import { CalendarIcon, Clock, Tag, X } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"

interface Task {
  id: string
  text: string
  status: string
  date?: string
  time?: string
  tags?: string[]
  priority?: string
  description?: string
}

interface TaskDetailsSheetProps {
  task: Task | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onTaskUpdate: (updatedTask: Task) => void
}

export function TaskDetailsSheet({ task, open, onOpenChange, onTaskUpdate }: TaskDetailsSheetProps) {
  const [editedTask, setEditedTask] = useState<Task | null>(task)
  const [newTag, setNewTag] = useState("")

  // Update local state when the task prop changes
  if (task && (!editedTask || task.id !== editedTask.id)) {
    setEditedTask(task)
  }

  if (!editedTask) return null

  const handleSave = () => {
    if (editedTask) {
      onTaskUpdate(editedTask)
      onOpenChange(false)
    }
  }

  const addTag = () => {
    if (newTag.trim() && editedTask) {
      const tags = [...(editedTask.tags || [])]
      if (!tags.includes(newTag.trim())) {
        tags.push(newTag.trim())
        setEditedTask({ ...editedTask, tags })
      }
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    if (editedTask && editedTask.tags) {
      const tags = editedTask.tags.filter((tag) => tag !== tagToRemove)
      setEditedTask({ ...editedTask, tags })
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md overflow-y-auto mx-4">
        <SheetHeader>
          <SheetTitle>Task Details</SheetTitle>
          <SheetDescription>View and edit task details</SheetDescription>
        </SheetHeader>

        <div className="space-y-4 ml-5">
          {/* Task Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={editedTask.text}
              onChange={(e) => setEditedTask({ ...editedTask, text: e.target.value })}
            />
          </div>

          {/* Task Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={editedTask.status}
              onValueChange={(value) => setEditedTask({ ...editedTask, status: value })}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TODO">Todo</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="DONE">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label>Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {editedTask.date ? editedTask.date : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={editedTask.date ? new Date(editedTask.date) : undefined}
                  onSelect={(date) =>
                    setEditedTask({
                      ...editedTask,
                      date: date ? format(date, "MMMM dd, yyyy") : undefined,
                    })
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time */}
          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
              <Input
                id="time"
                value={editedTask.time || ""}
                onChange={(e) => setEditedTask({ ...editedTask, time: e.target.value })}
                placeholder="e.g., 3:00 PM"
              />
            </div>
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={editedTask.priority || ""}
              onValueChange={(value) => setEditedTask({ ...editedTask, priority: value })}
            >
              <SelectTrigger id="priority">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="LOW">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {editedTask.tags?.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addTag()
                  }
                }}
              />
              <Button type="button" size="sm" onClick={addTag}>
                <Tag className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={editedTask.description || ""}
              onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
              placeholder="Add notes or description"
              rows={5}
            />
          </div>
        </div>

        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
          <Button onClick={handleSave}>Save changes</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
