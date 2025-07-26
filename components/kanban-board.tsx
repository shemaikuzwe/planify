"use client"

import { use, useState } from "react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { Calendar, Plus } from "lucide-react"
import { TaskDetailsSheet } from "./task-details-sheet"
import { TaskAddForm } from "./task-add-form"
import { GroupOptionsMenu } from "./group-options-menu"
import { cn, formatDate } from "@/lib/utils/utils"
import { Prisma } from "@prisma/client"
import { TaskStatusTask } from "@/lib/types"
import AddGroup from "./add-group"

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
interface Props {
  statusPromise: Promise<TaskStatusTask[]>
}

export default function KanbanBoard({ statusPromise }: Props) {
  const status = use(statusPromise)
  const [newGroupTitle, setNewGroupTitle] = useState("")
  const [isAddingGroup, setIsAddingGroup] = useState(false)
  // Removed: addingNewTaskGroupId and newTaskText states

  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  // Handle drag end
  const onDragEnd = (result: any) => {
    const { destination, source, draggableId } = result

    // If there's no destination or the item was dropped back in its original position
    // if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
    //   return
    // }

    // // Find the source and destination groups
    // // const sourceGroup = groups.find((group) => group.id === source.droppableId)
    // // const destGroup = groups.find((group) => group.id === destination.droppableId)

    // if (!sourceGroup || !destGroup) return

    // // Create a new array of groups
    // const newGroups:string[] = []

    // // Find the task being moved
    // const task = sourceGroup.tasks[source.index]

    // // Update the task status to match the destination group
    // const updatedTask = {
    //   ...task,
    //   status: destGroup.title.toUpperCase().replace(" ", "_"),
    // }

    // // Remove the task from the source group
    // const sourceGroupIndex = newGroups.findIndex((g) => g.id === sourceGroup.id)
    // newGroups[sourceGroupIndex] = {
    //   ...sourceGroup,
    //   tasks: sourceGroup.tasks.filter((_, index) => index !== source.index),
    // }

    // // Add the task to the destination group
    // const destGroupIndex = newGroups.findIndex((g) => g.id === destGroup.id)
    // const newTasks = [...destGroup.tasks]
    // newTasks.splice(destination.index, 0, updatedTask)
    // newGroups[destGroupIndex] = {
    //   ...destGroup,
    //   tasks: newTasks,
    // }


  }

  // Add a new task with details to a group
  const addTaskWithDetails = (groupId: string, taskData: { text: string; date?: string; tags?: string[] }) => {

  }

  // Removed: handleSaveNewTask function

  // Add a new group
  const addGroup = () => {

  }


  // Delete group
  const deleteGroup = (groupId: string) => {

  }
  const editGroup = (groupId: string) => {

  }

  // Update task details
  const updateTaskDetails = (updatedTask: Task) => {
    // const newGroups = [...groups]

    // for (let i = 0; i < newGroups.length; i++) {
    //   const taskIndex = newGroups[i].tasks.findIndex((t) => t.id === updatedTask.id)

    //   if (taskIndex !== -1) {
    //     // If the status has changed, move the task to the appropriate group
    //     if (newGroups[i].tasks[taskIndex].status !== updatedTask.status) {
    //       // Remove from current group
    //       const taskToMove = { ...updatedTask }
    //       newGroups[i].tasks.splice(taskIndex, 1)

    //       // Add to new group
    //       const targetGroupIndex = newGroups.findIndex(
    //         (g) => g.title.toUpperCase().replace(" ", "_") === updatedTask.status,
    //       )

    //       if (targetGroupIndex !== -1) {
    //         newGroups[targetGroupIndex].tasks.push(taskToMove)
    //       } else {
    //         // If no matching group, put it back in the original group
    //         newGroups[i].tasks.splice(taskIndex, 0, taskToMove)
    //       }
    //     } else {
    //       // Just update the task in place
    //       newGroups[i].tasks[taskIndex] = updatedTask
    //     }
    //     break
    //   }
    // }

    // setGroups(newGroups)
    // setSelectedTask(updatedTask)
  }

  return (
    <div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {status.map((status) => {
            // const colorClasses = getGroupColorClasses(status.primaryColor)
            return (
              <Droppable droppableId={status.id} key={status.id}>
                {(provided) => (
                  <div
                    // className={`w-80 flex-shrink-0 ${colorClasses.bgClass} rounded-lg overflow-hidden flex flex-col`}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <div
                      className={cn("font-medium flex items-center justify-between rounded-md min-w-64", status.primaryColor, "group")}
                    >
                      <div className="flex items-center gap-2">
                        <span className={cn("px-2 py-1 rounded-md", status.primaryColor)}>{status.name}</span>
                        <span className="text-neutral-400 text-sm">{status.tasks.length}</span>
                      </div>
                      <GroupOptionsMenu
                        groupId={status.id}
                        groupColor={status.primaryColor}
                      />
                    </div>

                    <div className="flex-1 p-2 space-y-2">
                      {status.tasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={cn(status.primaryColor, "rounded-md p-3 shadow-sm cursor-pointer")}
                              onClick={() => {
                                const mappedTask: Task = {
                                  id: task.id,
                                  text: task.text,
                                  status: status.name.toUpperCase().replace(" ", "_"),
                                  date: task.dueDate?.toISOString(),
                                  tags: task.tags as string[]
                                }
                                setSelectedTask(mappedTask)
                                setIsSheetOpen(true)
                              }}
                            >
                              <div className="space-y-2">
                                <h3 className={cn("text-sm font-medium", status.primaryColor)}>
                                  {task.text}
                                </h3>

                                {task.dueDate && (
                                  <div className="flex items-center gap-1 text-xs text-neutral-400">
                                    <Calendar className="h-3 w-3" />
                                    <span>{formatDate(task.dueDate)}</span>
                                  </div>
                                )}

                                {task.tags && (task.tags as Prisma.JsonArray)?.length > 0 && (
                                  <div className="flex flex-wrap gap-1">
                                    {(task.tags as Prisma.JsonArray)?.map((tag, index) => (
                                      <span
                                        key={index}
                                        className={cn("px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded text-xs", status.primaryColor)}
                                      >
                                        {tag as string}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      <TaskAddForm
                        statusId={status.id}
                        bgClass={status.primaryColor}
                      />
                    </div>
                  </div>
                )}
              </Droppable>
            )
          })}

          <AddGroup />
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
