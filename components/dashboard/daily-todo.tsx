"use client"

import { useState, type KeyboardEvent, type FormEvent } from "react"
import { Plus, Clock, Trash, Edit, Flag, CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { format, isToday, isTomorrow, addDays } from "date-fns"
import EmojiPicker from "../ui/emoji-picker"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Todos } from "@/lib/data"
import { Priority } from "@/lib/types"
import AddTaskForm from "./add-task-form"



interface Props {
    todos: Todos
}

export default function DailyTodo({ todos }: Props) {
    // State to track which add task form is visible
    const [addingTaskTo, setAddingTaskTo] = useState<string | null>(null)

    // State for editing tasks
    const [editingTask, setEditingTask] = useState<{ categoryId: string; taskId: string } | null>(null)

    // State for new task input
    const [newTaskText, setNewTaskText] = useState("")
    const [newTaskTime, setNewTaskTime] = useState("")
    const [newTaskEmoji, setNewTaskEmoji] = useState("")
    const [newTaskPriority, setNewTaskPriority] = useState<Priority>("MEDIUM")
    const [newTaskDueDate, setNewTaskDueDate] = useState<Date | undefined>(undefined)



    // State for inline editing
    const [inlineEditingTask, setInlineEditingTask] = useState<{
        categoryId: string
        taskId: string
        field: "text" | "time" | "emoji"
    } | null>(null)
    const [inlineEditText, setInlineEditText] = useState("")

    // State for editing category name
    const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null)
    const [editCategoryName, setEditCategoryName] = useState("")

    const toggleTaskCompletion = (categoryId: string, taskId: string) => {
        //handle toggle task
    }

    // Add a new category
    const addNewCategory = () => {
        //add category action
    }

    // Handle category name editing
    const handleCategoryDoubleClick = (categoryId: string, name: string) => {
        //edit category
        // setEditingCategoryId(categoryId)
        // setEditCategoryName(name)
    }

    // Save category name edits
    const saveCategoryEdit = () => {
        //save edit category

        // if (!editCategoryName.trim() || !editingCategoryId) return

        // setCategories(
        //     categories.map((category) =>
        //         category.id === editingCategoryId ? { ...category, name: editCategoryName } : category,
        //     ),
        // )

        // setEditingCategoryId(null)
    }

    // Delete a category
    const deleteCategory = (categoryId: string) => {
        // setCategories(categories.filter((category) => category.id !== categoryId))

        //delete category
    }

    // Add task to a category
    const handleAddTask = (categoryId: string) => {
        setAddingTaskTo(categoryId)
        // setEditingTask(null)
        // setNewTaskText("")
        // setNewTaskTime("")
        // setNewTaskEmoji("")
        // setNewTaskPriority("medium")
        // setNewTaskDueDate(undefined)

        //add task
    }

    const cancelAddTask = () => {
        //cancel add
        // setAddingTaskTo(null)
    }

    const submitNewTask = (e?: FormEvent) => {
        // if (e) e.preventDefault()

        // if (!newTaskText.trim() || addingTaskTo === null) {
        //     return
        // }




        // setAddingTaskTo(null)

        // handle add task
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        // if (e.key === "Enter") {
        //     submitNewTask()
        // } else if (e.key === "Escape") {
        //     cancelAddTask()
        // }

        //add task
    }

    const deleteTask = (categoryId: string, taskId: string) => {
        // setCategories(
        //     categories.map((category) =>
        //         category.id === categoryId
        //             ? {
        //                 ...category,
        //                 tasks: category.tasks.filter((task) => task.id !== taskId),
        //             }
        //             : category,
        //     ),
        // )

        //delete task
    }

    const startEditingTask = (categoryId: string, taskId: string) => {
        setEditingTask({ categoryId, taskId })
        setAddingTaskTo(null)

        const category = todos[0].categories.find((cat) => cat.id === categoryId)
        const task = category?.tasks.find((t) => t.id === taskId)

        if (task) {
            setNewTaskText(task.text)
            setNewTaskTime(task.time)
            setNewTaskEmoji(task.emoji)
            setNewTaskPriority(task.priority)
            setNewTaskDueDate(task.dueDate)
        }
    }

    const cancelEditTask = () => {
        setEditingTask(null)
    }

    const submitEditTask = (e?: FormEvent) => {
        if (e) e.preventDefault()


        if (!editingTask || !newTaskText.trim()) return

        const { categoryId, taskId } = editingTask


        setEditingTask(null)
    }

    const handleTimeChange = (time: Date | undefined) => {
        if (time) {
            setNewTaskTime(format(time, "h:mm a"))
        } else {
            setNewTaskTime("")
        }
    }

    const handleEmojiSelect = (emoji: string) => {
        setNewTaskEmoji(emoji)
    }

    const formatDueDate = (date?: Date) => {
        if (!date) return null

        if (isToday(date)) {
            return "Today"
        } else if (isTomorrow(date)) {
            return "Tomorrow"
        } else {
            return format(date, "MMM d")
        }
    }

    const getPriorityColor = (priority: Priority) => {
        switch (priority) {
            case "HIGH":
                return "text-red-500"
            case "MEDIUM":
                return "text-orange-500"
            case "LOW":
                return "text-blue-500"
            default:
                return "text-gray-400"
        }
    }

    const getPriorityLabel = (priority: Priority) => {
        switch (priority) {
            case "HIGH":
                return "High"
            case "MEDIUM":
                return "Medium"
            case "LOW":
                return "Low"
            default:
                return "None"
        }
    }

    // Handle double-click events for inline editing
    const handleDoubleClick = (categoryId: string, taskId: string, field: "text" | "time" | "emoji", value: string) => {
        const category = todos[0].categories.find((cat) => cat.id === categoryId)
        const task = category?.tasks.find((t) => t.id === taskId)

        if (task?.status === "COMPLETED") return

        setInlineEditingTask({ categoryId, taskId, field })
        setInlineEditText(value)
    }

    // Save inline edits
    const saveInlineEdit = () => {
        if (!inlineEditingTask) return

        const { categoryId, taskId, field } = inlineEditingTask



        setInlineEditingTask(null)
    }

    // Handle key events in inline editing
    const handleInlineKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            saveInlineEdit()
        } else if (e.key === "Escape") {
            setInlineEditingTask(null)
        }
    }

    return (
        <div className=" w-full flex justify-center items-center">

            <div className="p-6">



                <div className="space-y-6">
                    {/* Render all categories */}
                    {todos?.[0].categories.map((category) => (
                        <div key={category.id} className="mb-4">
                            <div className="flex justify-between items-center mb-2">
                                {editingCategoryId === category.id ? (
                                    <input
                                        type="text"
                                        value={editCategoryName}
                                        onChange={(e) => setEditCategoryName(e.target.value)}
                                        onBlur={saveCategoryEdit}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") saveCategoryEdit()
                                            if (e.key === "Escape") setEditingCategoryId(null)
                                        }}
                                        className="text-sm font-medium border-b focus:outline-none "
                                        autoFocus
                                    />
                                ) : (
                                    <h3
                                        className="text-sm font-medium text-gray-700 cursor-pointer"
                                        onDoubleClick={() => handleCategoryDoubleClick(category.id, category.name)}
                                    >
                                        {category.name}
                                    </h3>
                                )}

                                <div className="flex items-center">

                                    <button
                                        onClick={() => deleteCategory(category.id)}
                                        className="text-gray-400 hover:text-red-500 p-1"
                                    >
                                        <Trash className="w-3.5 h-3.5" />
                                    </button>

                                </div>
                            </div>

                            <ul className="space-y-3">
                                {category.tasks.map((task) => (
                                    <li key={task.id} className="group flex items-start gap-3">
                                        {editingTask && editingTask.categoryId === category.id && editingTask.taskId === task.id ? (
                                            <form onSubmit={submitEditTask} className="w-full space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-5 h-5 rounded-full border  flex-shrink-0"></div>
                                                    <input
                                                        type="text"
                                                        value={newTaskText}
                                                        onChange={(e) => setNewTaskText(e.target.value)}
                                                        onKeyDown={handleKeyDown}
                                                        placeholder="Task name"
                                                        className="flex-1 border-b not-[]:bg-transparent py-1 text-sm focus:outline-none"
                                                        autoFocus
                                                    />
                                                </div>
                                                <div className="flex flex-wrap items-center gap-2 pl-7">
                                                    <div className="relative flex items-center">
                                                        <Popover>
                                                            <PopoverTrigger asChild>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="h-7 w-[120px] justify-start text-left font-normal text-xs"
                                                                >
                                                                    <Clock className="mr-2 h-3 w-3" />
                                                                    {newTaskTime ? newTaskTime : "Select time"}
                                                                </Button>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-auto p-0" align="start">
                                                                <TimePicker setTime={handleTimeChange} />
                                                            </PopoverContent>
                                                        </Popover>
                                                    </div>

                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="h-7 justify-start text-left font-normal text-xs"
                                                            >
                                                                {newTaskEmoji ? (
                                                                    <span className="mr-2">{newTaskEmoji}</span>
                                                                ) : (
                                                                    <span className="mr-2">😀</span>
                                                                )}
                                                                Emoji
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-2" align="start">
                                                            <EmojiPicker onEmojiSelect={handleEmojiSelect} />
                                                        </PopoverContent>
                                                    </Popover>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-2 pl-7 mt-2">
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className={cn(
                                                                    "h-7 justify-start text-left font-normal text-xs",
                                                                    getPriorityColor(newTaskPriority),
                                                                )}
                                                            >
                                                                <Flag className={cn("mr-2 h-3 w-3", getPriorityColor(newTaskPriority))} />
                                                                {getPriorityLabel(newTaskPriority)}
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-2" align="start">
                                                            <RadioGroup
                                                                value={newTaskPriority || "null"}
                                                                onValueChange={(value) =>
                                                                    setNewTaskPriority(value as Priority)
                                                                }
                                                                className="flex flex-col gap-2"
                                                            >
                                                                <div className="flex items-center space-x-2">
                                                                    <RadioGroupItem value="high" id={`high-${category.id}-${task.id}`} />
                                                                    <Label htmlFor={`high-${category.id}-${task.id}`} className="flex items-center">
                                                                        <Flag className="h-3 w-3 mr-1 text-red-500" />
                                                                        <span>High</span>
                                                                    </Label>
                                                                </div>
                                                                <div className="flex items-center space-x-2">
                                                                    <RadioGroupItem value="medium" id={`medium-${category.id}-${task.id}`} />
                                                                    <Label htmlFor={`medium-${category.id}-${task.id}`} className="flex items-center">
                                                                        <Flag className="h-3 w-3 mr-1 text-orange-500" />
                                                                        <span>Medium</span>
                                                                    </Label>
                                                                </div>
                                                                <div className="flex items-center space-x-2">
                                                                    <RadioGroupItem value="low" id={`low-${category.id}-${task.id}`} />
                                                                    <Label htmlFor={`low-${category.id}-${task.id}`} className="flex items-center">
                                                                        <Flag className="h-3 w-3 mr-1 text-blue-500" />
                                                                        <span>Low</span>
                                                                    </Label>
                                                                </div>
                                                                <div className="flex items-center space-x-2">
                                                                    <RadioGroupItem value="null" id={`none-${category.id}-${task.id}`} />
                                                                    <Label htmlFor={`none-${category.id}-${task.id}`} className="flex items-center">
                                                                        <Flag className="h-3 w-3 mr-1 text-gray-400" />
                                                                        <span>None</span>
                                                                    </Label>
                                                                </div>
                                                            </RadioGroup>
                                                        </PopoverContent>
                                                    </Popover>

                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="h-7 justify-start text-left font-normal text-xs"
                                                            >
                                                                <CalendarIcon className="mr-2 h-3 w-3" />
                                                                {newTaskDueDate ? formatDueDate(newTaskDueDate) : "Due date"}
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0" align="start">
                                                            <div className="p-2">
                                                                <div className="flex flex-col gap-2 mb-2">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="justify-start text-xs h-7"
                                                                        onClick={() => setNewTaskDueDate(new Date())}
                                                                    >
                                                                        Today
                                                                    </Button>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="justify-start text-xs h-7"
                                                                        onClick={() => setNewTaskDueDate(addDays(new Date(), 1))}
                                                                    >
                                                                        Tomorrow
                                                                    </Button>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="justify-start text-xs h-7"
                                                                        onClick={() => setNewTaskDueDate(undefined)}
                                                                    >
                                                                        No date
                                                                    </Button>
                                                                </div>
                                                                <CalendarComponent
                                                                    mode="single"
                                                                    selected={newTaskDueDate}
                                                                    onSelect={setNewTaskDueDate}
                                                                    className="border rounded-md"
                                                                />
                                                            </div>
                                                        </PopoverContent>
                                                    </Popover>
                                                </div>

                                                <div className="flex justify-end gap-2 pt-1">
                                                    <button
                                                        type="button"
                                                        onClick={cancelEditTask}
                                                        className="text-xs text-gray-500 hover:text-gray-700"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        className="text-xs bg-gray-800 text-white px-3 py-1 rounded-md hover:bg-gray-700"
                                                    >
                                                        Save
                                                    </button>
                                                </div>
                                            </form>
                                        ) : (
                                            <>
                                                <div className="mt-0.5">
                                                    <button
                                                        onClick={() => toggleTaskCompletion(category.id, task.id)}
                                                        className={cn(
                                                            "w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center",
                                                            task.completed && "bg-gray-200",
                                                        )}
                                                    >
                                                        {task.completed && <div className="w-2 h-2 rounded-full bg-gray-500" />}
                                                    </button>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center">
                                                        {inlineEditingTask &&
                                                            inlineEditingTask.categoryId === category.id &&
                                                            inlineEditingTask.taskId === task.id &&
                                                            inlineEditingTask.field === "text" ? (
                                                            <input
                                                                type="text"
                                                                value={inlineEditText}
                                                                onChange={(e) => setInlineEditText(e.target.value)}
                                                                onKeyDown={handleInlineKeyDown}
                                                                onBlur={saveInlineEdit}
                                                                className="flex-1 border-b border-gray-200 bg-transparent py-0.5 text-sm focus:border-gray-400 focus:outline-none font-medium"
                                                                autoFocus
                                                            />
                                                        ) : (
                                                            <span
                                                                className={cn("font-medium", task.completed && "line-through text-gray-400")}
                                                                onDoubleClick={() => handleDoubleClick(category.id, task.id, "text", task.text)}
                                                            >
                                                                {task.text}
                                                            </span>
                                                        )}
                                                        {task.emoji &&
                                                            (inlineEditingTask &&
                                                                inlineEditingTask.categoryId === category.id &&
                                                                inlineEditingTask.taskId === task.id &&
                                                                inlineEditingTask.field === "emoji" ? (
                                                                <input
                                                                    type="text"
                                                                    value={inlineEditText}
                                                                    onChange={(e) => setInlineEditText(e.target.value)}
                                                                    onKeyDown={handleInlineKeyDown}
                                                                    onBlur={saveInlineEdit}
                                                                    className="w-8 border-b border-gray-200 bg-transparent py-0.5 text-sm focus:border-gray-400 focus:outline-none ml-1"
                                                                    autoFocus
                                                                />
                                                            ) : (
                                                                <span
                                                                    className="ml-1 cursor-pointer"
                                                                    onDoubleClick={() => handleDoubleClick(category.id, task.id, "emoji", task.emoji)}
                                                                >
                                                                    {task.emoji}
                                                                </span>
                                                            ))}
                                                        {task.priority && (
                                                            <Flag className={cn("ml-1.5 h-3 w-3", getPriorityColor(task.priority))} />
                                                        )}
                                                    </div>
                                                    <div className="flex items-center mt-1 text-xs gap-2">
                                                        {task.time && (
                                                            <div className="flex items-center mt-1">
                                                                {inlineEditingTask &&
                                                                    inlineEditingTask.categoryId === category.id &&
                                                                    inlineEditingTask.taskId === task.id &&
                                                                    inlineEditingTask.field === "time" ? (
                                                                    <input
                                                                        type="text"
                                                                        value={inlineEditText}
                                                                        onChange={(e) => setInlineEditText(e.target.value)}
                                                                        onKeyDown={handleInlineKeyDown}
                                                                        onBlur={saveInlineEdit}
                                                                        className="w-20 border-b border-gray-200 bg-transparent py-0.5 text-xs focus:border-gray-400 focus:outline-none text-green-600"
                                                                        autoFocus
                                                                    />
                                                                ) : (
                                                                    <span
                                                                        className="text-xs text-green-600 cursor-pointer"
                                                                        onDoubleClick={() => handleDoubleClick(category.id, task.id, "time", task.time)}
                                                                    >
                                                                        {task.time}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                        {task.dueDate && (
                                                            <span className="text-gray-500 flex items-center">
                                                                <CalendarIcon className="w-3 h-3 mr-1" />
                                                                {formatDueDate(task.dueDate)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => startEditingTask(category.id, task.id)}
                                                        className="text-gray-400 hover:text-gray-600 p-1"
                                                    >
                                                        <Edit className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteTask(category.id, task.id)}
                                                        className="text-gray-400 hover:text-red-500 p-1"
                                                    >
                                                        <Trash className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </li>
                                ))}
                            </ul>

                            {addingTaskTo === category.id ? (
                                <AddTaskForm categoryId={category.id} setAddingTaskTo={setAddingTaskTo} />
                            ) : (
                                <button
                                    className="flex items-center text-gray-500 mt-3 text-sm hover:text-gray-700"
                                    onClick={() => handleAddTask(category.id)}
                                >
                                    <Plus className="w-4 h-4 mr-1" />
                                    Add task
                                </button>
                            )}
                        </div>
                    ))}

                    {/* Add Category Button */}
                    <div className="mt-4">
                        <button className="flex items-center text-gray-500 text-sm hover:text-gray-700" onClick={addNewCategory}>
                            <Plus className="w-4 h-4 mr-1" />
                            Add Category
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
