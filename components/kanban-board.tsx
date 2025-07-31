"use client"

import { use, useState } from "react"
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd"
import { Calendar } from "lucide-react"
import { TaskDetailsSheet } from "./task-details-sheet"
import { TaskAddForm } from "./task-add-form"
import { GroupOptionsMenu } from "./group-options-menu"
import { cn, formatDate } from "@/lib/utils/utils"
import { Prisma, Task } from "@prisma/client"
import { TaskStatusTask } from "@/lib/types"
import AddGroup from "./add-group"
import { getColorVariants } from "@/lib/utils"
import { changeTaskStatus, updateTaskIndex } from "@/lib/actions/task"
import { toast } from "sonner"

interface Props {
  statusPromise: Promise<TaskStatusTask[]>
}

export default function KanbanBoard({ statusPromise }: Props) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [status, setStatus] = useState<TaskStatusTask[]>(() => {
    return use(statusPromise)
  })

  const reorderTasks = (tasks: Task[], startIndex: number, endIndex: number): Task[] => {
    const result = Array.from(tasks)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)

    // Update positions for all affected tasks
    return result.map((task, index) => ({
      ...task,
      taskIndex: index
    }))
  }

  const moveBetweenLists = (
    sourceTasks: Task[],
    destTasks: Task[],
    sourceIndex: number,
    destIndex: number,
    destListId: string
  ): { sourceTasks: Task[], destTasks: Task[] } => {
    const sourceClone = Array.from(sourceTasks)
    const destClone = Array.from(destTasks)
    const [removed] = sourceClone.splice(sourceIndex, 1)

    // Update the moved task's listId
    removed.statusId = destListId
    destClone.splice(destIndex, 0, removed)

    return {
      sourceTasks: sourceClone.map((task, index) => ({
        ...task,
        taskIndex: index
      })),
      destTasks: destClone.map((task, index) => ({
        ...task,
        taskIndex: index
      }))
    }
  }


  // Handle drag end
  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result

    // Do nothing if dropped outside or in same position
    if (!destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)) {
      return
    }

    const sourceListId = source.droppableId
    const destListId = destination.droppableId
    const sourceIndex = source.index
    const destIndex = destination.index

    // Find source and destination lists
    const sourceList = status.find(list => list.id === sourceListId)
    const destList = status.find(list => list.id === destListId)

    if (!sourceList || !destList) return

    // Create new status array with updated positions
    const newStatus = [...status]
    const sourceListIndex = newStatus.findIndex(list => list.id === sourceListId)
    const destListIndex = newStatus.findIndex(list => list.id === destListId)

    try {
      if (sourceListId === destListId) {
        // Moving within the same list
        const reorderedTasks = reorderTasks(sourceList.tasks, sourceIndex, destIndex)
        newStatus[sourceListIndex] = {
          ...sourceList,
          tasks: reorderedTasks
        }

        setStatus(newStatus)

        updateTaskIndex(reorderedTasks.map(task => ({
          id: task.id,
          taskIndex: task.taskIndex
        })))

      } else {
        // Moving between different lists
        const { sourceTasks, destTasks } = moveBetweenLists(
          sourceList.tasks,
          destList.tasks,
          sourceIndex,
          destIndex,
          destListId
        )

        newStatus[sourceListIndex] = {
          ...sourceList,
          tasks: sourceTasks
        }

        newStatus[destListIndex] = {
          ...destList,
          tasks: destTasks
        }
        setStatus(newStatus)
        Promise.all([
        changeTaskStatus(draggableId, destListId),
          updateTaskIndex([
            ...sourceTasks.map(task => ({
              id: task.id,
              taskIndex: task.taskIndex
            })),
            ...destTasks.map(task => ({
              id: task.id,
              taskIndex: task.taskIndex
            }))
          ])
        ])
      }
    } catch (error) {
      console.error('Failed to update task position:', error)
      toast.error("Failed to update task position")
    }
  }

  return (
    <div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {status.map((status) => {
            const colorVariants = getColorVariants(status.primaryColor)

            return (
              <Droppable droppableId={status.id} key={status.id}>
                {(provided) => (
                  <div
                    className={cn("p-2 flex-shrink-0", colorVariants.lightBg, "rounded-lg overflow-hidden flex flex-col")}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <div
                      className={cn("font-medium flex items-center justify-between rounded-md min-w-64", colorVariants.lightBg, "group")}
                    >
                      <div className="flex items-center gap-2">
                        <span className={cn("px-2 py-1 rounded-md", colorVariants.bgColor, "text-white")}>{status.name}</span>
                        <span className="text-sm">{status.tasks.length}</span>
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
                              className={cn(colorVariants.lightBg, "rounded-md p-3 shadow-sm cursor-pointer")}
                              // onClick={() => {
                              //   const mappedTask: Task = {
                              //     id: task.id,
                              //     text: task.text,
                              //     statusId: status.id,
                              //     dueDate: task.dueDate,
                              //     tags: task.tags as string[]
                              //   }
                              //   setSelectedTask(mappedTask)
                              //   setIsSheetOpen(true)
                              // }}
                            >
                              <div className="space-y-2">
                                <h3 className={cn("text-sm font-medium", colorVariants.textColor)}>
                                  {task.text}
                                </h3>

                                {task.dueDate && (
                                  <div className="flex items-center gap-1 text-xs">
                                    <Calendar className="h-3 w-3" />
                                    <span>{formatDate(task.dueDate)}</span>
                                  </div>
                                )}

                                {task.tags && (task.tags as Prisma.JsonArray)?.length > 0 && (
                                  <div className="flex flex-wrap gap-1">
                                    {(task.tags as Prisma.JsonArray)?.map((tag, index) => (
                                      <span
                                        key={index}
                                        className={cn("px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded text-xs", colorVariants.textColor)}
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
                        bgClass={colorVariants.bgColor} />
                    </div>
                  </div>
                )}
              </Droppable>
            )
          })}

          <AddGroup />
        </div>
        {/* Task Details Sheet */}
        {/* <TaskDetailsSheet
          task={selectedTask}
          open={isSheetOpen}
          onOpenChange={setIsSheetOpen}
          onTaskUpdate={updateTaskDetails}
        /> */}
      </DragDropContext>
    </div>
  )
}
