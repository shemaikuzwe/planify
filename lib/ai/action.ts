"use server"
import { db } from "../prisma";
import { revalidateTag } from "next/cache"
async function addTask(data: {
    statusId: string,
    task: {
        text: string,
        description?: string,
        tags?: string[],
        dueDate?: string,
    }
}) {
    const task = await db.task.create({ data: { text: data.task.text, description: data.task.description, tags: data.task.tags, dueDate: data.task.dueDate, statusId: data.statusId } });
    revalidateTag("tasks")
    return task
}

export { addTask }