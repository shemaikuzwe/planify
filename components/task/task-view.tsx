"use client";
import { useEffect, useState } from "react";
import { Edit2, CheckCheck, X, Clock, Calendar1, Pen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, formatShortDate } from "@/lib/utils/utils";
import { Task, TaskStatus } from "@prisma/client";
import Link from "next/link";
import MarkdownEditor from "../ui/mark-down-editor";
import { TaskStatusIndicator } from "../ui/task-status";
import DeleteDialog from "../ui/delete-dialog";
import { Dialog, DialogTrigger, DialogContent } from "../ui/dialog";
import { getColorVariants } from "@/lib/utils";
import ReactMd from "../ui/react-markdown";
import InlineInput from "../ui/inline-input";
import { taskStore } from "@/lib/store/tasks-store";
import { TaskStatusTask } from "@/lib/types";

interface Props {
  task: Task;
  children: React.ReactNode;
  currStatus: TaskStatus;
  status: TaskStatusTask[];
}

export function TaskView({ task, children, currStatus, status }: Props) {
  const [isHovering, setIsHovering] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [edit, setEdit] = useState<string | null>(task.description ?? null);
  const toggleTaskCompletion = async (taskId: string, status: string) => {
    await taskStore.toggleStatus(taskId, status);
  };
  const handleSaveDescription = async () => {
    if (!edit) return;
    await taskStore.editTaskDescription(task.id, edit);
    setIsEditing(false);
    task.description = edit;
  };
  useEffect(() => {
    if (edit !== null && edit !== task.description) {
      setIsEditing(true);
    } else if (edit === task.description) {
      setIsEditing(false);
    }
  }, [edit, task.description]);
  const colorVariants = getColorVariants(currStatus.primaryColor);
  return (
    <Dialog>
      <DialogTrigger className="w-full">{children}</DialogTrigger>
      <DialogContent className="min-w-150 min-h-90">
        <div
          className="rounded-md w-full"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div
            className={cn(
              "flex items-center justify-between p-2 rounded-md w-full h-16",
              colorVariants.lightBg,
            )}
          >
            <div className="flex items-center gap-2 ">
              <TaskStatusIndicator
                status={status}
                onChange={(status) => toggleTaskCompletion(task.id, status)}
                currStatusId={currStatus.id}
              />
              <div
                className={cn(
                  "flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium text-black",
                )}
              >
                <InlineInput
                  value={task.text}
                  onChange={(value) => {
                    taskStore.editName(task.id, value);
                    task.text = value;
                  }}
                  className="w-55"
                />
              </div>
            </div>

            {isHovering && (
              <div className="flex items-center gap-1">
                <Button
                  variant="secondary"
                  size="icon"
                  className="w-7 h-7"
                  asChild
                >
                  <Link href={`/edit/${task.id}`}>
                    <Edit2 className="h-3.5 w-3.5" />
                    <span className="sr-only">Edit</span>
                  </Link>
                </Button>
                <DeleteDialog id={task.id} type="task" text={task.text} />
              </div>
            )}
          </div>

          <div className="p-3 space-y-4 ">
            <div className="flex justify-between w-full">
              <div className="flex flex-col justify-end">
                {task.time && (
                  <div className="flex items-center gap-1 text-xs text-neutral-400">
                    <Clock className="h-3 w-3" />
                    <span>{task.time}</span>
                  </div>
                )}
                {task.dueDate && (
                  <div className="flex items-center gap-1 text-xs text-neutral-400">
                    <Calendar1 className="h-3 w-3" />
                    <span>{formatShortDate(task.dueDate)}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex gap-2 justify-end">
                {!isEditing ? (
                  <Button
                    size={"icon"}
                    variant={"outline"}
                    className="w-7 h-7"
                    onClick={() => {
                      setEdit(task.description ?? null);
                      setIsEditing(true);
                    }}
                  >
                    <Pen className="h-2 w-2" />
                  </Button>
                ) : (
                  <>
                    <Button
                      size={"icon"}
                      variant={"outline"}
                      className="w-7 h-7"
                      onClick={() => {
                        setEdit(task.description ?? null);
                        setIsEditing(false);
                      }}
                    >
                      <X className="h-2 w-2" />
                    </Button>
                    <Button
                      size={"icon"}
                      className="w-7 h-7"
                      onClick={handleSaveDescription}
                    >
                      <CheckCheck className="h-2 w-2" />
                    </Button>
                  </>
                )}
              </div>
              {isEditing ? (
                <MarkdownEditor
                  markdown={edit}
                  onChange={(val) => setEdit(val)}
                />
              ) : (
                <ReactMd markdown={edit ?? "Write your description here..."} />
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
