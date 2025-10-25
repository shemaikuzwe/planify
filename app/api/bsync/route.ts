import { auth } from "@/auth";
import {
  deleteDrawing,
  editDrawingName,
  saveDrawing,
} from "@/lib/actions/drawing";
import {
  addPage,
  addStatus,
  addTask,
  changeStatusColor,
  changeTaskStatus,
  deletePage,
  deleteStatus,
  deleteTask,
  editPageName,
  editTaskDescription,
  editTaskName,
  updateStatusIndex,
  updateTaskIndex,
} from "@/lib/actions/task";
import { db } from "@/lib/prisma";
import {
  addPageSchema,
  addStatusSchema,
  AddTaskSchema,
  changeStatusSchema,
  editDrawingNameSchema,
  saveElement,
  SyncType,
  updateStatusIndexSchema,
  updateTaksIndexSchema,
} from "@/lib/types/schema";
import { after, NextRequest, NextResponse } from "next/server";
import z from "zod";

const searchParamsSchema = z.object({
  sync: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user.id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { sync } = searchParamsSchema.parse(
      Object.fromEntries(req.nextUrl.searchParams.entries()),
    );
    if (!sync) {
      const pages = await db.taskCategory.findMany({
        where: {
          userId: userId,
        },
        include: {
          taskStatus: {
            select: {
              id: true,
            },
          },
        },
      });
      const taskStatuses = await db.taskStatus.findMany({
        where: {
          categoryId: {
            in: pages.map((page) => page.id),
          },
        },
      });
      const drawings = await db.drawing.findMany({
        where: {
          userId: userId,
        },
      });
      const [tasks, files] = await Promise.all([
        db.task.findMany({
          where: {
            statusId: {
              in: taskStatuses.map((taskStatus) => taskStatus.id),
            },
          },
        }),

        db.drawingFile.findMany({
          where: {
            drawingId: {
              in: drawings.map((drawing) => drawing.id),
            },
          },
        }),
      ]);
      return NextResponse.json(
        {
          tables: { pages, taskStatus: taskStatuses, tasks, files, drawings },
          metadata: {
            lastSyncedAt: new Date().toISOString(),
          },
        },
        { status: 200 },
      );
    }
    const syncDate = new Date(sync);
    const events = await db.events.findMany({
      where: {
        createdAt: {
          gt: syncDate,
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    return NextResponse.json(
      { events, metadata: { lastSyncedAt: new Date().toISOString() } },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user.id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
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
          type: validate.type,
        });
        break;
      }
      case "addTask": {
        const validate = AddTaskSchema.parse(body.data);
        await addTask({
          taskId: validate.taskId,
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
      case "updateStatusIndex": {
        const validate = updateStatusIndexSchema.parse(body.data);
        await updateStatusIndex(validate);
        break;
      }
      case "save_element": {
        const validate = saveElement.parse(body.data);
        await saveDrawing(validate);
        break;
      }
      case "editDrawingName": {
        const validate = editDrawingNameSchema.parse(body.data);
        await editDrawingName(validate.id, validate.name);
        break;
      }
      case "changeStatusColor": {
        const validate = changeStatusSchema.parse(body.data);
        await changeStatusColor(validate.statusId, validate.color);
        break;
      }
      case "deleteTask": {
        const data = z.object({ id: z.uuid() }).parse(body.data);
        await deleteTask(data.id);
        break;
      }
      case "deleteStatus": {
        const data = z.object({ id: z.uuid() }).parse(body.data);
        await deleteStatus(data.id);
        break;
      }
      case "deletePage": {
        const data = z.object({ id: z.uuid() }).parse(body.data);
        await deletePage(data.id);
        break;
      }
      case "deleteDrawing":
        const data = z.object({ id: z.uuid() }).parse(body.data);
        await deleteDrawing(data.id);
        break;
      case "editTaskDescription": {
        const validate = z
          .object({
            taskId: z.uuid(),
            description: z.string().min(1),
          })
          .parse(body.data);
        await editTaskDescription(validate.taskId, validate.description);
        break;
      }
      case "editTaskName": {
        const validate = z
          .object({
            id: z.uuid(),
            name: z.string().min(1),
          })
          .parse(body.data);
        await editTaskName(validate.id, validate.name);
        break;
      }
      case "editPageName": {
        const validate = z
          .object({
            id: z.uuid(),
            name: z.string().min(1),
          })
          .parse(body.data);
        await editPageName(validate.id, validate.name);
        break;
      }
      case "toggleStatus": {
        const validate = z
          .object({
            id: z.uuid(),
            status: z.uuid(),
          })
          .parse(body.data);
        await changeTaskStatus(validate.id, validate.status);
        break;
      }
      case "save_file": {
        break;
      }
      default: {
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
      }
    }
    after(async () => {
      await db.events.create({
        data: {
          type: body.type,
          data: body.data,
          userId: userId,
          createdAt: new Date(body.metadata.lastSyncedAt).toISOString(),
        },
      });
    });

    return NextResponse.json(
      { message: "Synced successfully" },
      { status: 200 },
    );
  } catch (err) {
    console.error("error", err);
    return NextResponse.json({ error: "Failed to sync" }, { status: 500 });
  }
}
