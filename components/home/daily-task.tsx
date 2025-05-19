"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Todos } from "@/lib/data"
import { TaskStatus } from "@/lib/types"
import { editGroupName, ToggleTaskStatus } from "@/lib/actions"
import { TaskStatusIndicator } from "../ui/task-status"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getPriorityIcon } from "../ui/variants"
import { Button } from "../ui/button"
import AddGroup from "./add-group"
import DeleteDialog from "../ui/delete-dialog"


interface Props {
    todos: Todos
}

export default function DailyTodo({ todos }: Props) {
    const router = useRouter()
    const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null)
    const [editCategoryName, setEditCategoryName] = useState("")
    const toggleTaskCompletion = async (taskId: string, status: TaskStatus) => {
        await ToggleTaskStatus(taskId, status)
    }

    const handleCategoryDoubleClick = (categoryId: string, name: string) => {
        //edit category
        setEditingCategoryId(categoryId)
        setEditCategoryName(name)
    }
    const saveCategoryEdit = async () => {
        if (!editCategoryName.trim() || !editingCategoryId) return
        await editGroupName(editingCategoryId, editCategoryName)
        setEditingCategoryId(null)
    }

    return (
        <div className="w-full flex justify-start items-start">

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
                                    <DeleteDialog id={category.id} type="group" text={category.name} />

                                </div>
                            </div>

                            <ul className="space-y-3">
                                {category.tasks.map((task) => (
                                    <li key={task.id} className="group flex items-start gap-3 cursor-pointer" onClick={() => router.push(`/task/${task.id}`)}>
                                        <div className="mt-0.5">
                                            <TaskStatusIndicator status={task.status} onChange={(status) => toggleTaskCompletion(task.id, status)} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-1">
                                                {task.priority && (
                                                    <div className="text-xs text-neutral-400">
                                                        {getPriorityIcon(task.priority)}
                                                    </div>
                                                )}
                                                <span
                                                    className="font-medium"
                                                >
                                                    {task.text}
                                                </span>

                                            </div>

                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <Button asChild size={"sm"} variant={"ghost"} className="mt-2">
                                <Link href={`/new/${category.id}`}>
                                    <Plus className="w-4 h-4 mr-1" />
                                    Add task
                                </Link>
                            </Button>
                        </div>
                    ))}

                    <div className="mt-4">
                        <AddGroup dailyTodoId={todos[0]?.id} />
                    </div>
                </div>
            </div>
        </div>
    )
}
