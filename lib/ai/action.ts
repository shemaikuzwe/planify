"use server"
import { db } from "../prisma";
import { revalidateTag } from "next/cache"
import { auth } from "@/auth";
import { getChatById, getChatTitle } from "./data";
import { UIMessage } from "../types/ai";
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
export async function saveChatData(id: string, messages: UIMessage[]) {
    try {
        const session = await auth();
        const existing = await getChatById(id);
        const title = existing ? existing.title : await getChatTitle(messages);
        const userId = existing ? existing.userId : session?.user?.id;
        if (!userId) return null;
        await db.chat.upsert({
            where: { id },
            update: {
                messages: messages as any,
            },
            create: {
                id: id,
                userId: userId,
                title: title,
                messages: messages as any,
            },
        });
        revalidateTag("chats")
    } catch (e) {
        return null;
    }
}

export { addTask }