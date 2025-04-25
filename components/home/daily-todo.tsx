"use client"

import { useState, type KeyboardEvent } from "react"
import { Plus, Clock, Trash, Edit, Flag, CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { format, isToday, isTomorrow } from "date-fns"
import { Todos } from "@/lib/data"
import { Priority, TaskStatus } from "@/lib/types"
import AddTaskForm from "./add-task-form"
import { DeleteTodo, editName, ToggleTaskStatus } from "@/lib/actions"
import EditTaskForm from "./edit-task-form"
import { TaskStatusIndicator } from "../ui/task-status"


interface Props {
    todos: Todos
}

export default function DailyTodo({ todos }: Props) {
    const [addingTaskTo, setAddingTaskTo] = useState<string | null>(null)
    const [editingTask, setEditingTask] = useState<{ categoryId: string; taskId: string } | null>(null)
    const [inlineEditingTask, setInlineEditingTask] = useState<{
        categoryId: string
        taskId: string
    } | null>(null)
    const [inlineEditText, setInlineEditText] = useState<string | null>(null)

    // State for editing category name
    const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null)
    const [editCategoryName, setEditCategoryName] = useState("")

    const toggleTaskCompletion = async(taskId: string, status: TaskStatus) => {
       await ToggleTaskStatus(taskId, status)
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
        // if (!editCategoryName.trim() || !editingCategoryId) return
        // setEditingCategoryId(null)
    }

    // Delete a category
    const deleteCategory = (categoryId: string) => {
        // setCategories(categories.filter((category) => category.id !== categoryId))

        //delete category
    }

    const deleteTaskFxn = async (taskId: string) => {
        await DeleteTodo(taskId)
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

    // Handle double-click events for inline editing
    const handleDoubleClick = (categoryId: string, taskId: string, field: "text" | "time" | "emoji", value: string) => {
        const category = todos[0].categories.find((cat) => cat.id === categoryId)
        const task = category?.tasks.find((t) => t.id === taskId)

        if (task?.status === "COMPLETED") return

        setInlineEditingTask({ categoryId, taskId })
        setInlineEditText(value)
    }

    // Save inline edits
    const saveInlineEdit = async () => {
        if (!inlineEditText || !inlineEditText?.trim() || !inlineEditingTask) return

        const { categoryId, taskId } = inlineEditingTask

        await editName({ text: inlineEditText, categoryId, taskId })

        setInlineEditingTask(null)
        setInlineEditText(null)
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
                                            <EditTaskForm setEditingTask={setEditingTask} task={task} />
                                        ) : (
                                            <>
                                                <div className="mt-0.5">
                                                    <TaskStatusIndicator status={task.status} onChange={(status) => toggleTaskCompletion(task.id, status)} />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center">
                                                        {inlineEditingTask &&
                                                            inlineEditingTask.categoryId === category.id &&
                                                            inlineEditingTask.taskId === task.id
                                                            ? (
                                                                <input
                                                                    type="text"
                                                                    value={inlineEditText ?? undefined}
                                                                    onChange={(e) => setInlineEditText(e.target.value)}
                                                                    onKeyDown={handleInlineKeyDown}
                                                                    onBlur={saveInlineEdit}
                                                                    className="flex-1 border-b border-gray-200 bg-transparent py-0.5 text-sm focus:border-gray-400 focus:outline-none font-medium"
                                                                    autoFocus
                                                                />
                                                            ) : (
                                                                <span
                                                                    className={cn("font-medium", task.status === "COMPLETED" && "line-through text-gray-400")}
                                                                    onDoubleClick={() => handleDoubleClick(category.id, task.id, "text", task.text)}
                                                                >
                                                                    {task.text}
                                                                </span>
                                                            )}

                                                        {task.priority && (
                                                            <Flag className={cn("ml-1.5 h-3 w-3", getPriorityColor(task.priority))} />
                                                        )}
                                                    </div>
                                                    <div className="flex items-center mt-1 text-xs gap-2">
                                                        {task.time && (
                                                            <div className="flex items-center mt-1">
                                                                <Clock className="w-3 h-3 mr-1" />
                                                                <span
                                                                    className="text-xs text-green-600 cursor-pointer"

                                                                >
                                                                    {task.time}
                                                                </span>

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
                                                        onClick={() => setEditingTask({ categoryId: category.id, taskId: task.id })}
                                                        className="text-gray-400 hover:text-gray-600 p-1"
                                                    >
                                                        <Edit className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteTaskFxn(task.id)}
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
                                    onClick={() => setAddingTaskTo(category.id)}
                                >
                                    <Plus className="w-4 h-4 mr-1" />
                                    Add task
                                </button>
                            )}
                        </div>
                    ))}

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
