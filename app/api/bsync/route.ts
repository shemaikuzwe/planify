import {
  deleteDrawing,
  editDrawingName,
  saveDrawing,
} from "@/lib/actions/drawing";
import {
  addPage,
  addStatus,
  addTask,
  changeTaskStatus,
  deletePage,
  deleteStatus,
  deleteTask,
  editTaskDescription,
  editTaskName,
  updateTaskIndex,
} from "@/lib/actions/task";
import {
  addPageSchema,
  addStatusSchema,
  AddTaskSchema,
  editDrawingNameSchema,
  saveElement,
  SyncType,
  updateTaksIndexSchema,
} from "@/lib/types/schema";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    switch (body.type as SyncType) {
      case "addPage": {
        const validate = addPageSchema.parse(body.data);
        await addPage({
          name: validate.name,
          pageId: validate.pageId,
          todoId: validate.todoId,
          inProgressId: validate.inProgressId,
          doneId: validate.doneId,
        });
        break;
      }
      case "addTask": {
        const validate = AddTaskSchema.parse(body.data);
        await addTask({
          text: validate.text,
          tags: validate.tags,
          statusId: validate.statusId,
          priority: validate.priority,
          dueDate: validate.dueDate,
        });
        break;
      }
      case "addStatus": {
        const validate = addStatusSchema.parse(body.data);
        await addStatus(validate);
        break;
      }
      case "updateTaskIndex": {
        const validate = updateTaksIndexSchema.parse(body.data);
        await updateTaskIndex(validate.tasks, validate.opts);
        break;
      }
      case "save-element": {
        const validate = saveElement.parse(body.data);
        await saveDrawing(validate);
        break;
      }
      case "editDrawingName": {
        const validate = editDrawingNameSchema.parse(body.data);
        await editDrawingName(validate.id, validate.name);
        break;
      }
      case "deleteTask": {
        const id = z.string().uuid().parse(body.data);
        await deleteTask(id);
        break;
      }
      case "deleteStatus": {
        const id = z.string().uuid().uuid().parse(body.data);
        await deleteStatus(id);
        break;
      }
      case "deletePage": {
        const id = z.string().uuid().parse(body.data);
        await deletePage(id);
        break;
      }
      case "deleteDrawing":
        const id = z.string().uuid().parse(body.data);
        await deleteDrawing(id);
        break;
      case "editTaskDescription": {
        const validate = z
          .object({
            id: z.string().uuid(),
            description: z.string().min(1),
          })
          .parse(body.data);
        await editTaskDescription(validate.id, validate.description);
        break;
      }
      case "editTaskName": {
        const validate = z
          .object({
            id: z.string().uuid(),
            name: z.string().min(1),
          })
          .parse(body.data);
        await editTaskName(validate.id, validate.name);
        break;
      }
      case "toggleStatus": {
        const validate = z
          .object({
            id: z.string().uuid(),
            status: z.string().uuid(),
          })
          .parse(body.data);
        await changeTaskStatus(validate.id, validate.status);
        break;
      }
      default: {
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
      }
    }

    return NextResponse.json(
      { message: "Synced successfully" },
      { status: 200 },
    );
  } catch (err) {
    return NextResponse.json({ error: "Failed to sync" }, { status: 500 });
  }
}
