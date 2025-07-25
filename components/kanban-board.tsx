"use client"

import { useState } from "react"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { Check, Calendar, Plus, X, Edit2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TaskDetailsSheet } from "./task-details-sheet"
import { TaskAddForm } from "./task-add-form"
import { GroupOptionsMenu, colorOptions } from "./group-options-menu"
import { cn } from "@/lib/utils/utils"

// Types
type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE" | string

interface Task {
  id: string
  text: string
  status: TaskStatus
  date?: string
  tags?: string[]
}

interface Group {
  id: string
  title: string
  tasks: Task[]
  color?: string
}

export default function KanbanBoard() {
  // Initial state with sample data
  const [groups, setGroups] = useState<Group[]>([
    {
      id: "todo",
      title: "Todo",
      color: "default",
      tasks: [
        {
          id: "task-1",
          text: "Show the list of task using Notion Todo CLI",
          status: "TODO",
          date: "June 19, 2025",
          tags: ["productivity"],
        },
      ],
    },
    {
      id: "in-progress",
      title: "In Progress",
      color: "default",
      tasks: [
        {
          id: "task-2",
          text: "test",
          status: "IN_PROGRESS",
        },
      ],
    },
    {
      id: "done",
      title: "Done",
      color: "green",
      tasks: [
        {
          id: "task-3",
          text: "Setup Notion CLI",
          status: "DONE",
          date: "June 19, 2025",
          tags: ["productivity"],
        },
      ],
    },
  ])

  const [newGroupTitle, setNewGroupTitle] = useState("")
  const [isAddingGroup, setIsAddingGroup] = useState(false)
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [editingTaskText, setEditingTaskText] = useState("")

  // Removed: addingNewTaskGroupId and newTaskText states

  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  // Get color classes for a group
  const getGroupColorClasses = (color = "default") => {
    const colorOption = colorOptions.find((c) => c.value === color) || colorOptions[0]
    return {
      bgClass: colorOption.bgClass,
      headerClass: colorOption.headerClass,
      taskBgClass: colorOption.taskBgClass,
      taskTextClass: colorOption.taskTextClass,
      taskButtonBgClass: colorOption.taskButtonBgClass,
      taskButtonHoverClass: colorOption.taskButtonHoverClass,
    }
  }

  // Handle drag end
  const onDragEnd = (result: any) => {
    const { destination, source, draggableId } = result

    // If there's no destination or the item was dropped back in its original position
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return
    }

    // Find the source and destination groups
    const sourceGroup = groups.find((group) => group.id === source.droppableId)
    const destGroup = groups.find((group) => group.id === destination.droppableId)

    if (!sourceGroup || !destGroup) return

    // Create a new array of groups
    const newGroups = [...groups]

    // Find the task being moved
    const task = sourceGroup.tasks[source.index]

    // Update the task status to match the destination group
    const updatedTask = {
      ...task,
      status: destGroup.title.toUpperCase().replace(" ", "_"),
    }

    // Remove the task from the source group
    const sourceGroupIndex = newGroups.findIndex((g) => g.id === sourceGroup.id)
    newGroups[sourceGroupIndex] = {
      ...sourceGroup,
      tasks: sourceGroup.tasks.filter((_, index) => index !== source.index),
    }

    // Add the task to the destination group
    const destGroupIndex = newGroups.findIndex((g) => g.id === destGroup.id)
    const newTasks = [...destGroup.tasks]
    newTasks.splice(destination.index, 0, updatedTask)
    newGroups[destGroupIndex] = {
      ...destGroup,
      tasks: newTasks,
    }

    setGroups(newGroups)
  }

  // Add a new task with details to a group
  const addTaskWithDetails = (groupId: string, taskData: { text: string; date?: string; tags?: string[] }) => {
    const newGroups = [...groups]
    const groupIndex = newGroups.findIndex((g) => g.id === groupId)

    if (groupIndex === -1) return

    const newTask: Task = {
      id: `task-${Date.now()}`,
      text: taskData.text,
      status: newGroups[groupIndex].title.toUpperCase().replace(" ", "_"),
      date: taskData.date,
      tags: taskData.tags,
    }

    newGroups[groupIndex] = {
      ...newGroups[groupIndex],
      tasks: [...newGroups[groupIndex].tasks, newTask],
    }

    setGroups(newGroups)
  }

  // Removed: handleSaveNewTask function

  // Add a new group
  const addGroup = () => {
    if (!newGroupTitle.trim()) return

    const newGroup: Group = {
      id: `group-${Date.now()}`,
      title: newGroupTitle,
      color: "default",
      tasks: [],
    }

    setGroups([...groups, newGroup])
    setNewGroupTitle("")
    setIsAddingGroup(false)
  }

  // Change group color
  const changeGroupColor = (groupId: string, color: string) => {
    const newGroups = groups.map((group) => (group.id === groupId ? { ...group, color } : group))
    setGroups(newGroups)
  }

  // Delete group
  const deleteGroup = (groupId: string) => {
    const newGroups = groups.filter((group) => group.id !== groupId)
    setGroups(newGroups)
  }

  // Edit group (placeholder for now)
  const editGroup = (groupId: string) => {
    console.log("Edit group:", groupId)
    // This could open a modal to edit group title, etc.
  }

  // Save task text after editing
  const saveTaskText = (taskId: string) => {
    if (!editingTaskText.trim()) return

    const newGroups = [...groups]

    for (let i = 0; i < newGroups.length; i++) {
      const taskIndex = newGroups[i].tasks.findIndex((t) => t.id === taskId)

      if (taskIndex !== -1) {
        newGroups[i].tasks[taskIndex] = {
          ...newGroups[i].tasks[taskIndex],
          text: editingTaskText,
        }
        break
      }
    }

    setGroups(newGroups)
    setEditingTaskId(null)
    setEditingTaskText("")
  }

  // Update task details
  const updateTaskDetails = (updatedTask: Task) => {
    const newGroups = [...groups]

    for (let i = 0; i < newGroups.length; i++) {
      const taskIndex = newGroups[i].tasks.findIndex((t) => t.id === updatedTask.id)

      if (taskIndex !== -1) {
        // If the status has changed, move the task to the appropriate group
        if (newGroups[i].tasks[taskIndex].status !== updatedTask.status) {
          // Remove from current group
          const taskToMove = { ...updatedTask }
          newGroups[i].tasks.splice(taskIndex, 1)

          // Add to new group
          const targetGroupIndex = newGroups.findIndex(
            (g) => g.title.toUpperCase().replace(" ", "_") === updatedTask.status,
          )

          if (targetGroupIndex !== -1) {
            newGroups[targetGroupIndex].tasks.push(taskToMove)
          } else {
            // If no matching group, put it back in the original group
            newGroups[i].tasks.splice(taskIndex, 0, taskToMove)
          }
        } else {
          // Just update the task in place
          newGroups[i].tasks[taskIndex] = updatedTask
        }
        break
      }
    }

    setGroups(newGroups)
    setSelectedTask(updatedTask)
  }

  return (
    <div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {groups.map((group) => {
            const colorClasses = getGroupColorClasses(group.color)
            return (
              <Droppable droppableId={group.id} key={group.id}>
                {(provided) => (
                  <div
                    className={`w-80 flex-shrink-0 ${colorClasses.bgClass} rounded-lg overflow-hidden flex flex-col`}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <div
                      className={`p-3 font-medium flex items-center justify-between ${colorClasses.headerClass} group`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={cn("px-2 py-1 rounded-md",colorClasses.taskButtonBgClass)}>{group.title}</span>
                        <span className="text-neutral-400 text-sm">{group.tasks.length}</span>
                      </div>
                      <GroupOptionsMenu
                        groupId={group.id}
                        groupColor={group.color}
                        onColorChange={changeGroupColor}
                        onDeleteGroup={deleteGroup}
                        onEditGroup={editGroup}
                      />
                    </div>

                    <div className="flex-1 p-2 space-y-2">
                      {group.tasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`${colorClasses.taskBgClass} rounded-md p-3 shadow-sm cursor-pointer`}
                              onClick={() => {
                                if (editingTaskId !== task.id) {
                                  setSelectedTask(task)
                                  setIsSheetOpen(true)
                                }
                              }}
                            >
                              {editingTaskId === task.id ? (
                                <div className="flex flex-col gap-2">
                                  <Input
                                    type="text"
                                    value={editingTaskText}
                                    onChange={(e) => setEditingTaskText(e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") saveTaskText(task.id)
                                      if (e.key === "Escape") {
                                        setEditingTaskId(null)
                                        setEditingTaskText("")
                                      }
                                    }}
                                    className={cn(
                                      colorClasses.taskBgClass.replace("/50", "/70"),
                                      "border-neutral-600",
                                      colorClasses.taskTextClass,
                                    )}
                                    autoFocus
                                  />
                                  <div className="flex justify-end gap-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        setEditingTaskId(null)
                                        setEditingTaskText("")
                                      }}
                                      className="h-7 px-2"
                                    >
                                      <X className="h-3.5 w-3.5" />
                                    </Button>
                                    <Button size="sm" onClick={() => saveTaskText(task.id)} className="h-7 px-2">
                                      <Check className="h-3.5 w-3.5" />
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <h3
                                      className={cn("text-sm font-medium", colorClasses.taskTextClass)}
                                      onDoubleClick={() => {
                                        setEditingTaskId(task.id)
                                        setEditingTaskText(task.text)
                                      }}
                                    >
                                      {task.text}
                                    </h3>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                                      onClick={() => {
                                        setEditingTaskId(task.id)
                                        setEditingTaskText(task.text)
                                      }}
                                    >
                                      <Edit2 className="h-3 w-3" />
                                    </Button>
                                  </div>

                                  {task.date && (
                                    <div className="flex items-center gap-1 text-xs text-neutral-400">
                                      <Calendar className="h-3 w-3" />
                                      <span>{task.date}</span>
                                    </div>
                                  )}

                                  {task.tags && task.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                      {task.tags.map((tag) => (
                                        <span
                                          key={tag}
                                          className="px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded text-xs"
                                        >
                                          {tag}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}

                      {/* Re-add TaskAddForm */}
                      <TaskAddForm
                        onAddTask={(taskData) => addTaskWithDetails(group.id, taskData)}
                        buttonBgClass={colorClasses.taskButtonBgClass}
                        buttonHoverClass={colorClasses.taskButtonHoverClass}
                        formBgClass={colorClasses.taskBgClass}
                        formInputBgClass={colorClasses.taskBgClass.replace("/50", "/70")}
                        formInputTextClass={colorClasses.taskTextClass}
                      />
                    </div>
                  </div>
                )}
              </Droppable>
            )
          })}

          {isAddingGroup ? (
            <div className="w-80 flex-shrink-0 bg-neutral-800/50 rounded-lg p-3">
              <Input
                type="text"
                placeholder="Enter group title..."
                value={newGroupTitle}
                onChange={(e) => setNewGroupTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addGroup()
                  if (e.key === "Escape") {
                    setIsAddingGroup(false)
                    setNewGroupTitle("")
                  }
                }}
                className="bg-neutral-800 border-neutral-600 mb-2"
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddingGroup(false)
                    setNewGroupTitle("")
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={addGroup}>Add group</Button>
              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              className="h-10 mt-8 whitespace-nowrap bg-transparent"
              onClick={() => setIsAddingGroup(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              New group
            </Button>
          )}
        </div>
        {/* Task Details Sheet */}
        <TaskDetailsSheet
          task={selectedTask}
          open={isSheetOpen}
          onOpenChange={setIsSheetOpen}
          onTaskUpdate={updateTaskDetails}
        />
      </DragDropContext>
    </div>
  )
}
