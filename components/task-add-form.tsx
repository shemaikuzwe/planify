"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Calendar, FileText, Plus, Tag, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { cn } from "@/lib/utils/utils"
import { addTask } from "@/lib/actions/task"
import { AddTaskSchema } from "@/lib/types/schema"
import React from "react"
import { getColorVariants } from "@/lib/utils"

interface TaskAddFormProps {
  bgClass?: string;
  statusId: string;
}

export function TaskAddForm({
  bgClass = "bg-neutral-200",
  statusId,
}: TaskAddFormProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  type TaskFormValues = z.infer<typeof AddTaskSchema>
  const colorVariants = getColorVariants(bgClass)
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(AddTaskSchema),
    defaultValues: {
      text: "",
      statusId,
    },
  })

  const onSubmit = async (values: TaskFormValues) => {
    await addTask({
      text: values.text,
      dueDate: values.dueDate,
      priority: "MEDIUM",
      statusId,
      tags: tags
    })
    form.reset()
    setTags([])
    setNewTag("")
    setIsExpanded(false)
  }

  const handleCancel = () => {
    form.reset()
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
        variant="outline"
        className={cn(
          "w-64 justify-start border-2 bg-transparent",
          colorVariants.borderColor,
        )}
        onClick={() => setIsExpanded(true)}
      >
        <Plus className="h-4 w-4 mr-2" />
        New Task
      </Button>
    )
  }

  return (
    <div className={cn("rounded-md w-64 p-3 space-y-3", colorVariants.lightBg)}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          {/* Task Name Input */}
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 " />
                    <Input
                      placeholder="Type a name..."
                      className={cn(
                        "pl-10",
                        colorVariants.lightBg,
                      )}
                      autoFocus
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
                    <Input
                      placeholder="Add Due Date"
                      type="date"
                      className={cn(
                        "pl-10",
                        colorVariants.lightBg,
                      )}
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
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
                    "pl-10 rounded-r-none",
                    colorVariants.lightBg,
                  )}
                />
                <Button
                  type="button"
                  onClick={addTag}
                  className={cn("rounded-l-none", bgClass)}
                  size="icon"
                >
                  <Tag />
                </Button>
              </div>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={!form.watch("text")?.trim()}
            >
              Add Task
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
