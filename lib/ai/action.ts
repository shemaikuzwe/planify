"use server"
import { db } from "../prisma";

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
    return task
}

export { addTask }