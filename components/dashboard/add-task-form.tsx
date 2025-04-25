"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { AddTaskSchema, type AddTaskValue } from "@/lib/types/schema"
import { Button } from "../ui/button"
import { Flag } from "lucide-react"
import EmojiPicker from "../ui/emoji-picker"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { FormControl, FormField, Form, FormItem, FormLabel } from "../ui/form"
import { Input } from "../ui/input"
import { TimePicker } from "../ui/time-picker"
import { AddTodo } from "@/lib/actions"

export default function AddTaskForm({ categoryId }: { categoryId: string }) {
  const form = useForm<AddTaskValue>({
    resolver: zodResolver(AddTaskSchema),
    defaultValues: {
      categoryId
    }
  })

  const handleEmojiSelect = (newEmoji: string) => {
    const currentText = form.getValues("text") || ""
    form.setValue("text", currentText + newEmoji)
  }

  const onSubmit = async (data: AddTaskValue) => {
    await AddTodo(data)
  }

  return (
    <Form {...form}>
      <form className="mt-2 space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter task name" className="w-full" />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time</FormLabel>
                <FormControl>
                  <TimePicker onChange={field.onChange} value={field.value} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Due Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} className="w-full" />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <FormControl>
                  <RadioGroup
                    value={field.value || "null"}
                    onValueChange={(value) => field.onChange(value as AddTaskValue["priority"])}
                    className="grid grid-cols-2 gap-1"
                  >
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="high" id="high" />
                      <label htmlFor="high" className="flex items-center text-xs">
                        <Flag className="h-3 w-3 mr-1 text-red-500" />
                        <span>High</span>
                      </label>
                    </div>
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="medium" id="medium" />
                      <label htmlFor="medium" className="flex items-center text-xs">
                        <Flag className="h-3 w-3 mr-1 text-orange-500" />
                        <span>Medium</span>
                      </label>
                    </div>
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="low" id="low" />
                      <label htmlFor="low" className="flex items-center text-xs">
                        <Flag className="h-3 w-3 mr-1 text-blue-500" />
                        <span>Low</span>
                      </label>
                    </div>
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="null" id="none" />
                      <label htmlFor="none" className="flex items-center text-xs">
                        <Flag className="h-3 w-3 mr-1 text-gray-400" />
                        <span>None</span>
                      </label>
                    </div>
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />

          <FormItem>
            <FormLabel>Add Emoji</FormLabel>
            <div className="flex items-center h-10">
              <EmojiPicker onEmojiSelect={handleEmojiSelect} />

            </div>
          </FormItem>
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" size="sm" variant="outline">
            Cancel
          </Button>
          <Button size="sm" type="submit">
            Add
          </Button>
        </div>
      </form>
    </Form>
  )
}
